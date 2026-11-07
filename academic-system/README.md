# Sistem Informasi Akademik (SIAKAD) - Prototipe Frontend

Prototipe antarmuka frontend Sistem Informasi Akademik perguruan tinggi berbasis **React + Vite + Tailwind CSS + Recharts + Lucide Icons** dengan mock data terstruktur dan arsitektur siap-integrasi ke backend Laravel (Inertia.js / REST API).

---

## 1. Fitur Utama yang Telah Diimplementasikan

1. **Autentikasi (Mock Login):**
   - Halaman login bersih dengan identitas institusi placeholder (*Institut Teknologi & Sains Nusantara*).
   - Validasi input NIM dan kata sandi dengan pesan kesalahan spesifik dan jelas.
   - Kredensial demo bawaan:
     - **NIM:** `202303039`
     - **Kata Sandi:** `password123`

2. **Header & Profil Mahasiswa:**
   - Profil mahasiswa lengkap: Nama, NIM, Program Studi, Angkatan, Avatar inisial, dan Dosen Wali.
   - Status semester berjalan (`GASAL 2026/2027`).
   - Dropdown menu **"DATA AKADEMIK"** dengan akses langsung ke:
     - Kartu Rencana Studi (KRS)
     - Kartu Hasil Studi (KHS)
   - Menu aksi keluar (Logout).

3. **Dashboard Mahasiswa (Home):**
   - **Informasi Cekal / Blokir:** Kartu peringatan tunggakan administrasi keuangan semester aktif beserta aksi tautan unit terkait.
   - **Kartu Informasi Akademik & Pejabat:** Menampilkan IP Kumulatif (*progress indicator*), Total SKS (143 SKS), Total Angka Kualitas, SKS KRS semester berjalan, serta daftar pimpinan/pejabat universitas (Rektor, Dekan, Ka.Prodi, Kepala BAA, Wali Studi).
   - **Perkembangan IP & SKS per Semester:** Visualisasi grafik bar (*Recharts*) 6 semester terakhir, kartu statistik ringkas (IPK, SKS Lulus, IP Terakhir, Tren perubahan performa), serta bar horizontal per semester.
   - **Portal Warta & Informasi Biro:** Portal pengumuman terpadu 3 biro (*Akademik, Keuangan, Kemahasiswaan*) dengan filter tab interaktif dan modal *"Baca Selengkapnya"* untuk membaca detail edaran.

4. **Kartu Hasil Studi (KHS):**
   - Filter pemilihan semester (semua semester atau per semester).
   - Tabel padat (*compact table*) dengan nomor, kode MK, nama MK, kelas, SKS, nilai mutu (A s.d. E), bobot, kualitas, dan dosen pengampu bergelar lengkap.
   - Footer kalkulasi otomatis: Total SKS semester, Total Kualitas semester, dan IP Semester (IPS).
   - Tombol **"Cetak KHS"** yang langsung terhubung ke cetak kertas (*clean print layout*).

5. **Kartu Rencana Studi (KRS):**
   - Informasi batas akhir periode pengisian (*12 Nov 2026, 23.59 WIB*).
   - Tabel mata kuliah ditawarkan (kode, nama MK, SKS, kelas, jadwal waktu & ruang, dosen, serta rasio kuota).
   - Ringkasan realtime total SKS terpilih terhadap batas jatah SKS (berdasarkan IPS semester lalu).
   - Validasi ketat:
     - **State kuota penuh:** Baris kelas terkunci dan berlabel `Penuh`.
     - **State melebihi batas SKS:** Indikator merah dan tombol simpan dinonaktifkan.
     - **State di luar periode:** Banner informasi penutupan dan tombol pemilihan dinonaktifkan.
     - **Tombol Simulasi Periode:** Tersedia tombol untuk menguji kedua state (*Periode Buka* vs *Periode Tutup*).
     - Tombol **"Simpan KRS"** mock.

6. **Asisten AI Chatbot (RAG Assistant Widget):**
   - Floating widget responsif di pojok kanan bawah.
   - Mampu menjawab pertanyaan umum akademik (masalah cekal, kuota SKS, cetak KHS, jadwal UTS).
   - Siap disambungkan ke API backend RAG Anda melalui integrasi endpoint.

---

## 2. Rumus Matematis & Unit Test

Rumus akademik diimplementasikan sebagai fungsi murni pada `src/utils/academicCalculations.js`:
- $\text{Kualitas} = \text{SKS} \times \text{Bobot}$
- $\text{IP Semester (IPS)} = \frac{\sum \text{Kualitas Semester}}{\sum \text{SKS Semester}}$
- $\text{IP Kumulatif (IPK)} = \frac{\sum \text{Kualitas Seluruh Semester}}{\sum \text{SKS Seluruh Semester}}$
- Skala Bobot: $A=4.0, AB=3.5, B=3.0, BC=2.5, C=2.0, D=1.0, E=0.0$.

Seluruh 11 skenario unit test telah terverifikasi sukses dengan **Vitest**.

---

## 3. Cara Menjalankan Aplikasi

Pastikan berada di direktori proyek:
```bash
cd academic-system
```

### Mode Pengembangan (Dev Server):
```bash
npm run dev
```
Buka browser pada alamat yang tertera (biasanya `http://localhost:5173`).

### Menjalankan Unit Test:
```bash
npx vitest run
```

### Build Produksi:
```bash
npm run build
```

---

## 4. Struktur Direktori Proyek

```
academic-system/
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   └── RagChatWidget.jsx         # Widget interaktif Chatbot RAG
│   │   ├── common/
│   │   │   └── Navbar.jsx                # Header, profil mahasiswa & dropdown
│   │   └── home/
│   │       ├── AcademicStatsCard.jsx     # Statistik akademik & data pejabat
│   │       ├── AnnouncementPortal.jsx    # Portal informasi 3 biro dengan tab filter
│   │       ├── CekalAlertCard.jsx        # Peringatan status blokir/cekal keuangan
│   │       └── PerformanceChartCard.jsx  # Grafik Recharts & tren perkembangan IP
│   ├── data/
│   │   └── mockAcademicData.js           # Berkas tunggal seluruh data tiruan realistis
│   ├── utils/
│   │   ├── academicCalculations.js       # Fungsi murni rumus nilai
│   │   └── academicCalculations.test.js  # 11 Unit test otomatis Vitest
│   ├── views/
│   │   ├── HomeView.jsx                  # Halaman dashboard utama
│   │   ├── KhsView.jsx                   # Halaman KHS & cetak dokumen
│   │   ├── KrsView.jsx                   # Halaman pemilihan KRS & validasi batas SKS
│   │   └── LoginView.jsx                 # Halaman login mock
│   ├── App.jsx                           # Manajemen session state & view switcher
│   ├── index.css                         # CSS Tailwind v4 & utilitas angka tabular
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 5. Daftar Asumsi

1. Identitas universitas fiktif menggunakan **Institut Teknologi & Sains Nusantara (ITSN)**.
2. Data mahasiswa mengacu pada konteks screenshot 2: Jason Bernard Adrianto (NIM: 202303039, S1 Sistem Informasi).
3. Batas SKS maksimal ditentukan oleh IPS semester terakhir (IPS 4.00 mendapatkan jatah 24 SKS).
4. Skala bobot nilai menggunakan standar umum Dikti (A, AB, B, BC, C, D, E) dan ditandai komentar `// TODO:` agar mudah disesuaikan bila kebijakan kampus berbeda.
