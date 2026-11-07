# Sistem Informasi Akademik Terintegrasi Structure-Fidelity RAG (SF-RAG)

Proyek ini mengimplementasikan prototipe **Sistem Informasi Akademik (SIAKAD)** yang dilengkapi asisten kecerdasan buatan berbasis **Structure-Fidelity RAG (SF-RAG)**. Sistem dirancang untuk menjawab pertanyaan seputar regulasi dan pedoman akademik kampus secara faktual dan tepat sasaran tanpa mengalami halusinasi tabel aturan bersyarat.

Proyek ini dikembangkan untuk memenuhi tugas project **Ujian Tengah Semester (UTS) Mata Kuliah Aplikasi Kecerdasan Buatan**, STIKOM Yos Sudarso Purwokerto (Semester Gasal 2026/2027).

---

## 🏛️ Arsitektur Proyek

Repositori ini terdiri dari dua komponen utama:

```
├── academic-system/        # Frontend: React 19 + Vite + Tailwind CSS + Lucide
│   ├── src/
│   │   ├── components/ai/  # Widget Chatbot AI (3-Tier Router)
│   │   ├── utils/          # Pure functions kalkulasi IPK/SKS (12 unit test Vitest)
│   │   ├── views/          # Halaman SIAKAD (KHS, KRS, Dashboard, Login)
│   │   └── data/           # Mock data akademik mahasiswa & FAQ
│   └── package.json
│
├── sfrag-backend/          # Backend: FastAPI + ChromaDB + Gemini LLM
│   ├── src/
│   │   ├── parser/         # structure_parser.py (Ekstraksi hierarki Bab/Sub-bab)
│   │   ├── vectorstore/    # chroma_manager.py (paraphrase-multilingual-MiniLM + Reranker)
│   │   ├── generator/      # gemini_llm.py (Dual-Context prompt builder)
│   │   └── pipeline.py     # Orchestrator SF-RAG vs Baseline
│   ├── data/
│   │   └── processed/      # Dokumen pedoman pendidikan berstruktur
│   ├── evaluation/         # Suite evaluasi 5 skenario uji & log komparasi
│   │   ├── dataset.json    # 5 skenario ground truth
│   │   ├── eval_retrival.py# Pengujian metrik Information Retrieval (Hit@K, MRR)
│   │   ├── eval_scenarios.py# Pengujian inferensi LLM & cakupan fakta
│   │   ├── hasil_eval.json # Log empiris inferensi LLM
│   │   └── result_*.csv    # Hasil kuantitatif retrieval
│   ├── app.py              # FastAPI server entry point
│   ├── requirements.txt    # Dependensi Python
│   └── .env.example        # Template konfigurasi environment
│
├── .gitignore
└── README.md
```

---

## 🚀 Panduan Menjalankan Sistem

### 1. Menjalankan Backend (`sfrag-backend`)

Pastikan Anda telah menginstal **Python 3.11**.

1. Masuk ke direktori backend:
   ```bash
   cd sfrag-backend
   ```
2. Buat dan aktifkan virtual environment:
   ```bash
   python -m venv venv
   # Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Pasang dependensi:
   ```bash
   pip install -r requirements.txt
   ```
4. Buat file `.env` berdasarkan template:
   ```bash
   cp .env.example .env
   ```
   Isi konfigurasi `GEMINI_API_KEY` dan `GEMINI_MODEL`:
   ```env
   GEMINI_API_KEY=isi_dengan_api_key_gemini_anda
   GEMINI_MODEL=gemini-3.1-flash-lite
   ```
5. Jalankan server FastAPI:
   ```bash
   python app.py
   ```
   Server akan aktif di `http://localhost:8000`. Dokumentasi OpenAPI/Swagger dapat diakses di `http://localhost:8000/docs`.

---

### 2. Menjalankan Frontend (`academic-system`)

Pastikan Anda telah menginstal **Node.js** (versi 18+ disarankan).

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd academic-system
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Jalankan unit test logika akademik:
   ```bash
   npm test
   ```
4. Jalankan aplikasi web lokal:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui browser di `http://localhost:5173`.

---

## 🧪 Evaluasi & Pengujian

Sistem telah diuji menggunakan 5 skenario akademik riil yang membandingkan **Structure-Fidelity RAG (SF-RAG)** dengan **Naive Baseline RAG (Fixed-size Chunking)**:

1. **Evaluasi Tingkat Retrieval (`eval_retrival.py`):**
   ```bash
   cd sfrag-backend
   python evaluation/eval_retrival.py
   ```
   Menghitung *Hit@1, Hit@3, MRR*, dan *Recall@3* untuk menguji kemampuan pencarian semantik.

2. **Evaluasi Tingkat Inferensi & Faktualitas (`eval_scenarios.py`):**
   ```bash
   cd sfrag-backend
   python evaluation/eval_scenarios.py
   ```
   Menguji ketahanan model terhadap halusinasi regulasi, pemotongan tabel bersyarat, dan mencatat output lengkap ke `hasil_eval.json`.

---

## 👥 Pengembang / Anggota Kelompok

* **Mata Kuliah:** Aplikasi Kecerdasan Buatan
* **Dosen Pengampu:** Putu Samuel Prihatmajaya, S.Kom., M.Kom.
* **Institusi:** STIKOM Yos Sudarso Purwokerto
* **Tahun Akademik:** Semester Gasal 2026/2027
