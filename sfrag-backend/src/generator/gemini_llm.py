"""
gemini_llm.py

Generator teks menggunakan Gemini API resmi (google-genai).
Memiliki prompt ketat (strict groundness) agar jawaban hanya bersumber dari
konteks dokumen hierarki yang di-retrieve (anti-halusinasi) DAN data akademik
pribadi mahasiswa (KHS) yang dikirim oleh frontend.
"""

import os
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

logger = logging.getLogger("sfrag.generator")

# Nama model dibaca dari .env (GEMINI_MODEL); default ke model super cepat dan stabil (gemini-3.1-flash-lite)
DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

# Batas riwayat percakapan yang ikut dikirim ke LLM (opsional, diaktifkan dari UI)
MAX_HISTORY_MESSAGES = 6

SYSTEM_INSTRUCTION = (
    "Anda adalah Asisten AI Akademik Resmi STIKOM Yos Sudarso (SYS).\n"
    "Anda menerima dua sumber informasi:\n"
    "  (A) DATA AKADEMIK MAHASISWA: profil, ringkasan IPK, dan KHS per semester milik mahasiswa yang sedang bertanya.\n"
    "  (B) KONTEKS PEDOMAN: potongan Buku Pedoman Pendidikan 2025 hasil retrieval Structure-Fidelity, lengkap dengan hierarki (Bab > Sub-bab).\n\n"
    "Pedoman Menjawab:\n"
    "1. Pertanyaan tentang data pribadi (mata kuliah, nilai, SKS, IPS/IPK, dosen, semester tertentu) -> jawab dari (A).\n"
    "2. Pertanyaan tentang aturan/prosedur kampus -> jawab dari (B) dan sebutkan rujukan Bab/Sub-bab/halaman jika tertera.\n"
    "3. Pertanyaan yang menggabungkan keduanya (mis. kelayakan Cum Laude, batas SKS KRS, syarat skripsi) -> terapkan aturan dari (B) pada data dari (A), jelaskan langkah penalarannya secara singkat.\n"
    "4. Angka IPS, IPK, total SKS, dan batas SKS KRS SUDAH dihitung oleh sistem. Gunakan angka tersebut apa adanya; JANGAN menghitung ulang.\n"
    "5. 'Semester N' berarti urutan semester kronologis yang tertera pada data (Semester 1 = semester paling awal).\n"
    "6. Jangan mengarang data atau aturan yang tidak ada di (A) maupun (B). Jika informasi tidak cukup, katakan dengan jujur dan sarankan menghubungi BAAK.\n"
    "7. Jawab dalam Bahasa Indonesia yang lugas dan santun. Gunakan daftar bernomor bila menyebutkan beberapa item. Jangan gunakan sintaks Markdown tebal (**) atau tabel."
)


def format_student_context(student_context: Optional[Dict[str, Any]]) -> str:
    """Mengubah JSON data akademik dari frontend menjadi teks ringkas untuk prompt LLM."""
    if not student_context:
        return "(Data akademik mahasiswa tidak tersedia.)"

    lines = []
    profile = student_context.get("profile") or {}
    if profile:
        lines.append("PROFIL:")
        for key, label in [
            ("name", "Nama"), ("nim", "NIM"), ("studyProgram", "Program Studi"),
            ("cohort", "Angkatan"), ("status", "Status"), ("currentSemesterName", "Semester Berjalan"),
            ("advisor", "Dosen PA"), ("hasFinancialHold", "Status Cekal Keuangan"),
        ]:
            if key in profile and profile[key] is not None:
                value = profile[key]
                if isinstance(value, bool):
                    value = "Ya (sedang dicekal)" if value else "Tidak"
                lines.append(f"- {label}: {value}")

    summary = student_context.get("summary") or {}
    if summary:
        lines.append("\nRINGKASAN AKADEMIK (dihitung sistem):")
        for key, label in [
            ("ipk", "IPK"), ("totalSks", "Total SKS Lulus"), ("totalCourses", "Jumlah Mata Kuliah"),
            ("graduationPredicate", "Predikat Berdasarkan IPK"), ("lastIps", "IPS Semester Terakhir"),
            ("maxKrsCredits", "Batas SKS KRS Semester Berikutnya"), ("gradeDistribution", "Distribusi Nilai"),
        ]:
            if key in summary and summary[key] is not None:
                value = summary[key]
                if isinstance(value, dict):
                    value = ", ".join(f"{g}: {n} MK" for g, n in value.items())
                lines.append(f"- {label}: {value}")

    semesters = student_context.get("semesters") or []
    if semesters:
        lines.append("\nKHS PER SEMESTER (urut kronologis):")
        for sem in semesters:
            lines.append(
                f"\nSemester {sem.get('semesterNumber')} ({sem.get('semesterName')}) - "
                f"IPS {sem.get('ips')}, {sem.get('totalSks')} SKS:"
            )
            for c in sem.get("courses", []):
                lecturer = f", Dosen: {c['lecturer']}" if c.get("lecturer") else ""
                lines.append(f"  - {c.get('code')} {c.get('name')} | {c.get('sks')} SKS | Nilai {c.get('grade')}{lecturer}")

    return "\n".join(lines)


class GeminiGenerator:
    def __init__(self, api_key: str = None, model_name: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.model_name = model_name or os.getenv("GEMINI_MODEL", DEFAULT_MODEL)
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def _build_contents(self, user_prompt: str, history: Optional[List[Dict[str, str]]]) -> list:
        """Menyusun isi percakapan: riwayat (opsional, maks 6 pesan) + prompt saat ini."""
        contents = []
        for msg in (history or [])[-MAX_HISTORY_MESSAGES:]:
            text = (msg.get("text") or "").strip()
            if not text:
                continue
            role = "user" if msg.get("role") == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part(text=text)]))
        contents.append(types.Content(role="user", parts=[types.Part(text=user_prompt)]))
        return contents

    def _fallback(self, reason: str, retrieved_contexts: list) -> dict:
        """Jawaban cadangan yang DIBERI LABEL JELAS agar tidak disangka jawaban LLM."""
        sources = [c.get("metadata", {}).get("breadcrumb", "Dokumen Pedoman") for c in retrieved_contexts]
        if retrieved_contexts:
            body = retrieved_contexts[0].get("text", "")
            answer = (
                f"[Fallback: Gemini gagal - {reason}]\n\n"
                f"Jawaban di bawah BUKAN hasil model AI, melainkan kutipan mentah pedoman yang paling relevan:\n\n{body}"
            )
        else:
            answer = f"[Fallback: Gemini gagal - {reason}]\n\nTidak ada konteks pedoman yang dapat ditampilkan."
        return {
            "answer": answer,
            "model": "fallback-tanpa-llm",
            "sources": sources,
            "is_fallback": True,
            "fallback_reason": reason,
        }

    def generate_response(
        self,
        query: str,
        retrieved_contexts: list,
        is_sfrag: bool = True,
        student_context: Optional[Dict[str, Any]] = None,
        history: Optional[List[Dict[str, str]]] = None,
    ) -> dict:
        """
        Menghasilkan jawaban berbasis konteks hasil retrieval dokumen + data akademik mahasiswa.
        """
        context_str = "\n\n---\n\n".join([c["text"] for c in retrieved_contexts]) or "(Tidak ada konteks pedoman yang relevan.)"
        student_str = format_student_context(student_context)

        user_prompt = (
            f"(A) DATA AKADEMIK MAHASISWA:\n{student_str}\n\n"
            f"=====\n\n"
            f"(B) KONTEKS PEDOMAN:\n{context_str}\n\n"
            f"=====\n\n"
            f"PERTANYAAN MAHASISWA: {query}\n\nJAWABAN:"
        )

        # Jika API KEY belum disetel, kembalikan jawaban cadangan berlabel
        if not self.client or not self.api_key:
            logger.error("GEMINI_API_KEY tidak ditemukan di .env - menggunakan fallback.")
            return self._fallback("GEMINI_API_KEY belum disetel di .env", retrieved_contexts)

        contents = self._build_contents(user_prompt, history)

        # Daftar model yang stabil dan responsif (tanpa delay/overload 503)
        candidate_models = [self.model_name]
        for fallback_candidate in ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-3.5-flash"]:
            if fallback_candidate not in candidate_models:
                candidate_models.append(fallback_candidate)

        errors = []
        for model_to_try in candidate_models:
            try:
                response = self.client.models.generate_content(
                    model=model_to_try,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_INSTRUCTION,
                        temperature=0.2, # Rendah untuk presisi akademik faktual
                    )
                )
                if not response.text:
                    raise ValueError("respons kosong dari model")
                return {
                    "answer": response.text,
                    "model": model_to_try,
                    "sources": [c.get("metadata", {}).get("breadcrumb", "Dokumen Pedoman") for c in retrieved_contexts],
                    "is_fallback": False,
                    "fallback_reason": None,
                }
            except Exception as e:
                logger.warning("Model %s gagal: %s", model_to_try, e)
                print(f"[GEMINI ERROR] {model_to_try}: {e}")
                errors.append(f"{model_to_try}: {str(e)[:150]}")
                continue

        # Seluruh pemanggilan API LLM gagal -> fallback berlabel jelas + alasan
        return self._fallback("; ".join(errors), retrieved_contexts)
