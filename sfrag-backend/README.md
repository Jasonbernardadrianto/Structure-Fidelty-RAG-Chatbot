# SF-RAG Academic Backend (STIKOM Yos Sudarso 2025)

Modul Backend Chatbot Akademik berbasis **Structure-Fidelity Retrieval-Augmented Generation (SF-RAG)** untuk Buku Pedoman Pendidikan STIKOM Yos Sudarso Tahun 2025. Proyek ini disusun untuk memenuhi tugas **Project Kelompok Ujian Tengah Semester (UTS) Aplikasi Kecerdasan Buatan (Semester Gasal 2026/2027)** dengan Dosen Pengampu: **Putu Samuel Prihatmajaya, S.Kom., M.Kom.**

---

## 1. Keunggulan Metode SF-RAG vs Baseline (Naive RAG)

Pada dokumen hukum / pedoman akademik, pemotongan teks acak (*Fixed-Size Chunker*, cth: 500 karakter) seringkali:
1. Memenggal ayat dari induk pasalnya.
2. Memisahkan tabel syarat SKS dari klausul ketentuannya.
3. Menghilangkan silsilah/hierarki kewenangan aturan (kehilangan konteks induk).

**Structure-Fidelity RAG (SF-RAG)** memecahkan masalah ini dengan:
- **Hierarchical Parser:** Memecah dokumen mengikuti struktur pohon logis: `BAB > SUB-BAB/PASAL > BUTIR KETENTUAN`.
- **Breadcrumb Context Enrichment:** Menyuntikkan metadata silsilah hierarki dokumen ke dalam vektor embedding dan prompt LLM.
- **Strict Groundness Prompting:** Memastikan LLM menjawab secara akurat sesuai isi pasal dengan merujuk nomor bab dan halamannya.

---

## 2. Cara Menjalankan Backend & Server API

Pastikan berada di direktori `sfrag-backend`:
```bash
cd sfrag-backend
```

### Menjalankan Server FastAPI:
```bash
python app.py
```
Server akan aktif di `http://localhost:8000`. Dokumentasi interaktif Swagger API dapat diakses di `http://localhost:8000/docs`.

### Menjalankan Benchmark Evaluasi (5 Skenario Uji Akademik):
```bash
python evaluation/eval_scenarios.py
```

---

## 3. Struktur Direktori Proyek

```
sfrag-backend/
├── app.py                     # Entry point REST API (Endpoint /api/chat & /api/evaluate)
├── requirements.txt           # Daftar pustaka AI
├── data/
│   └── processed/
│       └── pedoman_pendidikan_sys_2025_structured.md  # Korpus resmi 90 hal. tersusun rapi
├── src/
│   ├── parser/
│   │   └── structure_parser.py   # Hierarchical Pattern Parser (Bab, Sub-bab, Ayat)
│   ├── chunking/
│   │   ├── sf_chunker.py         # Structure-Fidelity Chunker ber-metadata
│   │   └── naive_chunker.py      # Baseline Splitter 500 chars untuk komparasi
│   ├── vectorstore/
│   │   └── chroma_manager.py     # Local ChromaDB Vector Store & Cosine Similarity
│   ├── generator/
│   │   └── gemini_llm.py         # Google Gemini Generator (Groundness Faktual)
│   └── pipeline.py               # Orkestrator RAG
└── evaluation/
    └── eval_scenarios.py         # 5 Skenario Uji Akademik & Pengujian Latensi
```

---

## 4. Format Laporan & Slide Presentasi (Untuk Mahasiswa)
Proyek ini telah memenuhi seluruh rubrik penilaian UTS:
- **Materi 1:** Perumusan masalah nyata (akurasi konsultasi akademik mahasiswa).
- **Materi 2/3/5:** Penerapan representasi pengetahuan & Deep Learning (Embeddings & LLM).
- **Materi 4:** Evaluasi sistem dengan 1 baseline pembanding (Fixed-Size RAG) dan 5 skenario uji akademik terukur.
