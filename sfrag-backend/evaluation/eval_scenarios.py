"""
eval_scenarios.py

5 Skenario Uji Evaluasi (Materi 4 Rubrik UTS): SF-RAG vs Baseline.
Mengukur: cakupan fakta (proxy kasar), fakta terlarang (jawaban jelas salah),
breadcrumb + isi chunk yang di-retrieve, dan latensi total (retrieval + generasi).
Hasil disimpan ke evaluation/hasil_eval.json untuk bahan tabel laporan.
"""

import os
import sys
import re
import time
import json
import random
import statistics

# Tambahkan root folder sfrag-backend ke sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.pipeline import SFragPipeline

REPEATS = 1        # naikkan ke 3-5 untuk median latensi (perhatikan kuota API)
SLEEP_SEC = 3      # jeda antar panggilan agar tidak kena rate limit
TOP_K = 2

# Format expected_facts: string, atau list alternatif penulisan (cukup salah satu cocok).
# TODO: cocokkan semua frasa dengan PDF asli sebelum dipakai di laporan.
SCENARIOS = [
    {
        "id": "SKENARIO_1",
        "topic": "Batas Beban SKS KRS & Toleransi +1 SKS",
        "query": "Berapa batas maksimal pengambilan SKS jika IPS saya 3.25, dan apakah boleh mengambil 1 SKS lebih jika tidak ada mata kuliah yang pas?",
        "expected_clause": "BAB III > C. STANDAR PROSES PEMBELAJARAN (Hal 39 & 76)",
        "expected_facts": ["24 SKS", ["hal. 76", "halaman 76"]],
        "forbidden": ["18 SKS", "19 SKS"],
    },
    {
        "id": "SKENARIO_2",
        "topic": "Konsekuensi & Aturan Cekal Keuangan",
        "query": "Bagaimana ketentuan pembayaran UKP dan UKV serta bagaimana jika mahasiswa mengalami kesulitan keuangan?",
        "expected_clause": "BAB VII > I. PENUNDAAN PEMBAYARAN DPP, UKP dan UKV (Hal 76 & 79)",
        "expected_facts": ["sebelum UTS", "surat permohonan", "ketua"],
        "forbidden": [],
    },
    {
        "id": "SKENARIO_3",
        "topic": "Ketentuan Cuti Studi Sementara & Sanksi Cuti Tanpa Izin",
        "query": "Berapa lama batas maksimal cuti studi dan apa sanksinya jika mahasiswa cuti tanpa izin selama 2 semester berturut-turut?",
        "expected_clause": "BAB VII > H. CUTI STUDI SEMENTARA (Hal 78-79)",
        # "UKP 50%" dihapus: kemungkinan untuk cuti BERIZIN. Verifikasi ke PDF.
        "expected_facts": ["2 kali", "4 semester", "mengundurkan diri"],
        "forbidden": [],
    },
    {
        "id": "SKENARIO_4",
        "topic": "Syarat Yudisium & Predikat Kelulusan Dengan Pujian (Cum Laude)",
        "query": "Apa syarat IPK dan ketentuan khusus untuk mendapatkan predikat kelulusan Dengan Pujian bagi mahasiswa S1?",
        "expected_clause": "BAB III & V > Kriteria Predikat Kelulusan (Hal 39 & 53)",
        "expected_facts": [["3.50", "3,50", "3.51", "3,51"], "4 tahun", ["nilai c", "c dan d"]],
        "forbidden": [],
    },
    {
        "id": "SKENARIO_5",
        "topic": "Persyaratan Mengambil Skripsi S1",
        "query": "Apa saja syarat akademik untuk dapat mengambil mata kuliah Skripsi pada program studi S1?",
        "expected_clause": "BAB IV > B. TUGAS AKHIR DAN UJIAN AKHIR (Hal 48-49 & 87)",
        "expected_facts": ["110 SKS", ["2.20", "2,20"], "8 SKS", "5 kali"],
        "forbidden": [],
    },
]


def norm(s):
    return re.sub(r"\s+", " ", s.replace("*", "").lower()).strip()


def fact_coverage(answer, facts):
    a = norm(answer)
    hit = 0
    for f in facts:
        alts = f if isinstance(f, list) else [f]
        if any(norm(x) in a for x in alts):
            hit += 1
    return hit / len(facts)


def forbidden_hits(answer, forbidden):
    a = norm(answer)
    return [f for f in forbidden if norm(f) in a]


def is_error(res):
    return res["answer"].startswith("Terjadi kendala")


def chunk_dump(res):
    return [
        {
            "breadcrumb": c.get("metadata", {}).get("breadcrumb", "-"),
            "text": c["text"],
        }
        for c in res["retrieved_contexts"]
    ]


def run_benchmark():
    pipeline = SFragPipeline()
    print("Mempersiapkan indeks...")
    pipeline.build_indexes()
    print("=" * 70)
    print("BENCHMARK EVALUASI: STRUCTURE-FIDELITY RAG (SF-RAG) vs BASELINE")
    print("=" * 70)

    all_results = []
    latencies = {"SF-RAG": [], "Baseline": []}

    for sc in SCENARIOS:
        print(f"\n[{sc['id']}] Topik: {sc['topic']}")
        print(f"Query: \"{sc['query']}\"")
        print(f"Rujukan Dokumen Diharapkan: {sc['expected_clause']}")

        record = {
            "id": sc["id"],
            "query": sc["query"],
            "expected_clause": sc["expected_clause"],
            "runs": [],
        }

        for run_idx in range(REPEATS):
            order = [("SF-RAG", "sfrag"), ("Baseline", "baseline")]
            random.shuffle(order)  # acak urutan agar tidak bias

            run_data = {}
            for label, method in order:
                t0 = time.perf_counter()
                res = pipeline.ask(sc["query"], method=method, top_k=TOP_K)
                lat = round(time.perf_counter() - t0, 3)
                time.sleep(SLEEP_SEC)

                entry = {"latency": lat, "chunks": chunk_dump(res)}
                if is_error(res):
                    entry["error"] = res["answer"]
                else:
                    entry["answer"] = res["answer"]
                    entry["coverage"] = fact_coverage(res["answer"], sc["expected_facts"])
                    entry["forbidden_hits"] = forbidden_hits(res["answer"], sc["forbidden"])
                    latencies[label].append(lat)
                run_data[label] = entry

            record["runs"].append(run_data)

            # Cetak hanya run pertama agar terminal tidak terlalu panjang
            if run_idx == 0:
                for label in ("SF-RAG", "Baseline"):
                    e = run_data[label]
                    print(f"\n--- [{label}] (Latency total: {e['latency']}s) ---")
                    for i, c in enumerate(e["chunks"], 1):
                        print(f"[chunk {i}] {c['breadcrumb']}")
                        print(f"          {c['text'][:300]!r}")
                    if "error" in e:
                        print("GAGAL:", e["error"][:200])
                        continue
                    print(f"Cakupan fakta: {e['coverage']:.2f} | Fakta terlarang muncul: {e['forbidden_hits']}")
                    print("Jawaban lengkap:\n" + e["answer"])

        all_results.append(record)
        print("-" * 70)

    # Ringkasan
    print("\nRINGKASAN (n skenario = %d, REPEATS = %d)" % (len(SCENARIOS), REPEATS))
    for label in ("SF-RAG", "Baseline"):
        covs = [
            r["runs"][0][label]["coverage"]
            for r in all_results
            if "coverage" in r["runs"][0][label]
        ]
        bad = sum(
            1 for r in all_results
            if r["runs"][0][label].get("forbidden_hits")
        )
        lat = latencies[label]
        med = round(statistics.median(lat), 3) if lat else None
        mean_cov = round(statistics.mean(covs), 2) if covs else None
        print(f"{label:9} rata-rata cakupan={mean_cov} | skenario ber-fakta-terlarang={bad} | median latensi={med}s")
    print("Catatan: cakupan hanyalah proxy kasar. Nilai manual tiap jawaban (0/1/2) sebagai metrik utama.")

    out_path = os.path.join(os.path.dirname(__file__), "hasil_eval.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print(f"\nHasil disimpan di: {out_path}")


if __name__ == "__main__":
    run_benchmark()