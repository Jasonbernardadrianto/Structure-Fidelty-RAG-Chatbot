/**
 * mockAcademicData.js
 * 
 * Data tiruan (mock) realistis 6 semester, nama mata kuliah, dosen fiktif bergelar,
 * pengumuman 3 biro, dan profil mahasiswa sesuai konteks screenshot.
 * Seluruh data terpusat di satu berkas agar mudah diganti / dihubungkan ke backend.
 */

export const MOCK_STUDENT = {
  nim: "202303039",
  name: "Jason Bernard Adrianto",
  studyProgram: "S1 Sistem Informasi",
  faculty: "Fakultas Ilmu Komputer & Teknologi Informasi",
  cohort: "2023",
  status: "Aktif",
  currentSemesterName: "GASAL 2026/2027",
  advisor: "Yosita Lianawati, S.Kom., M.T.I.",
  totalSksKrsCurrent: 10,
  totalPriceKrsCurrent: 10.0,
  hasFinancialHold: true,
  financialHoldMessage: "Silakan cek tagihan keuangan anda di finance.portal-kampus.ac.id! Segera selesaikan blokir anda ke biro / unit terkait.",
  officials: {
    rector: "Dr. Romanus Edy Prabowo, S.Si., M.Sc., Ph.D.",
    dean: "Dr. Eng. Hendra Gunawan, S.T., M.T.",
    headOfProgram: "Diwahana Mutiara Chandrasari, M.Kom.",
    headOfAcademicBureau: "Dr. M. Adhi Wibowo, S.Kom., M.M., M.T.I.",
    advisor: "Yosita Lianawati, S.Kom., M.T.I."
  }
};

export const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann-01",
    bureau: "Biro Akademik",
    bureauCode: "akademik",
    publishedAt: "02-11-2026 07:20:29",
    title: "PENGUMUMAN PELAKSANAAN UJIAN TENGAH SEMESTER (UTS) GASAL 2026/2027",
    summary: "Diberitahukan kepada seluruh mahasiswa bahwa Ujian Tengah Semester (UTS) Gasal 2026/2027 akan dilaksanakan mulai 9-13 November 2026. Kartu ujian UTS sudah dapat diakses melalui portal dan wajib dibawa secara fisik saat ujian.",
    details: "Diberitahukan kepada seluruh mahasiswa bahwa Ujian Tengah Semester (UTS) Gasal 2026/2027 akan dilaksanakan pada:\n\nTanggal: 9 – 13 November 2026\nWaktu: Mengikuti jadwal perkuliahan masing-masing mata kuliah\n\nSehubungan dengan pelaksanaan UTS, disampaikan beberapa hal sebagai berikut:\n1. Kartu ujian UTS sudah dapat diunduh melalui portal akademik mulai 4 November 2026.\n2. Mahasiswa wajib mencetak kartu ujian dan menunjukkannya kepada pengawas ujian.\n3. Mahasiswa yang berstatus cekal/tunggakan administrasi belum dapat mengunduh kartu ujian hingga menyelesaikan kewajibannya di Biro Keuangan."
  },
  {
    id: "ann-02",
    bureau: "Biro Keuangan",
    bureauCode: "keuangan",
    publishedAt: "20-04-2026 04:46:00",
    title: "PENGUMUMAN PERSYARATAN UJIAN TENGAH SEMESTER (UTS) GENAP 2025/2026",
    summary: "Sehubungan dengan pelaksanaan UTS Genap 2025/2026, bersama ini disampaikan bahwa terdapat persyaratan administrasi keuangan yang wajib dipenuhi oleh seluruh mahasiswa sebagai ketentuan untuk dapat mengikuti UTS.",
    details: "Sehubungan dengan pelaksanaan Ujian Tengah Semester (UTS) Semester Genap Tahun Akademik 2025/2026, bersama ini disampaikan bahwa terdapat persyaratan administrasi keuangan yang wajib dipenuhi oleh seluruh mahasiswa sebagai ketentuan untuk dapat mengikuti UTS.\n\nMahasiswa diharapkan untuk segera menyelesaikan kewajiban administrasi sesuai dengan ketentuan yang berlaku sebelum batas waktu yang telah ditetapkan. Bagi mahasiswa dengan skema cicilan beasiswa/keringanan, dimohon segera melakukan konfirmasi ke loket Biro Keuangan Lantai 1 Gedung Administrasi Pusat."
  },
  {
    id: "ann-03",
    bureau: "Biro Kemahasiswaan",
    bureauCode: "kemahasiswaan",
    publishedAt: "21-02-2026 11:09:21",
    title: "KULIAH UMUM: INOVASI TEKNOLOGI & INDUSTRI 5.0 – WAJIB HADIR!",
    summary: "Diberitahukan kepada seluruh mahasiswa Semester 4, 6, dan 8 dari SEMUA PROGRAM STUDI bahwa akan dilaksanakan Kuliah Umum yang WAJIB dihadiri pada Senin, 2 Maret 2026 pukul 10.00 WIB di Aula Graha Widya.",
    details: "Diberitahukan kepada seluruh mahasiswa Semester 4, 6, dan 8 dari SEMUA PROGRAM STUDI bahwa akan dilaksanakan Kuliah Umum yang WAJIB dihadiri pada:\n\nTanggal: Senin, 2 Maret 2026\nPukul: 10.00 WIB – selesai\nTempat: Grand Ballroom Dominic Hotel & Hybrid Zoom\n\nManfaat yang didapatkan:\n✨ Upgrade wawasan transformasi kecerdasan buatan & cloud\n✨ Perluas jejaring profesional & industri rintisan\n✨ Sertifikat bernilai 2 SKPI (Surat Keterangan Pendamping Ijazah)\n\nKehadiran bersifat WAJIB dan akan dicatat melalui pemindaian QR Code di lokasi."
  },
  {
    id: "ann-04",
    bureau: "Biro Akademik",
    bureauCode: "akademik",
    publishedAt: "15-08-2026 09:00:00",
    title: "JADWAL PENGISIAN KRS SEMESTER GASAL 2026/2027",
    summary: "Pengisian Kartu Rencana Studi (KRS) periode Gasal 2026/2027 dibuka mulai 18 Agustus hingga 28 Agustus 2026 pukul 23.59 WIB. Pastikan berkonsultasi dengan Dosen Pembimbing Akademik.",
    details: "Pengisian KRS Semester Gasal 2026/2027 dilakukan secara mandiri melalui portal ini. Pastikan tidak ada bentrok waktu kuliah dan jumlah SKS yang diambil tidak melampaui batas jatah SKS berdasarkan IPS semester lalu."
  }
];

export const MOCK_KHS_DATA = [
  {
    semesterCode: "20252",
    semesterName: "GENAP 2025/2026",
    courses: [
      { no: 1, code: "22INF62104", name: "Keamanan Informasi Dan Jaringan", classGroup: "B", sks: 3, grade: "A", weight: 4.0, lecturer: "Putu Samuel Prihatmajaya, M.Kom.\nDwi Kurnia Wibowo, S.Kom., M.Kom." },
      { no: 2, code: "22SYS60107", name: "Komunikasi Interpersonal", classGroup: "B", sks: 2, grade: "A", weight: 4.0, lecturer: "Monika Gisthi Secaresmi, S.S., M.Pd.\nWilibrordus Megandika Wicaksono, M.IKom" },
      { no: 3, code: "22SYS60109", name: "Kerja Praktek", classGroup: "B", sks: 2, grade: "A", weight: 4.0, lecturer: "Diwahana Mutiara Chandrasari, M.Kom." },
      { no: 4, code: "22INF62107", name: "Big Data & Analitika Terapan", classGroup: "B", sks: 3, grade: "A", weight: 4.0, lecturer: "Diwahana Mutiara Chandrasari, M.Kom." },
      { no: 5, code: "22INF62112", name: "Internet Of Things", classGroup: "B", sks: 3, grade: "A", weight: 4.0, lecturer: "Christy Mahendra, M.Kom.\nYosita Lianawati, S.Kom., M.T.I." },
      { no: 6, code: "22INF62113", name: "Pengolahan Citra Digital", classGroup: "B", sks: 3, grade: "A", weight: 4.0, lecturer: "Christy Mahendra, M.Kom." }
    ]
  },
  {
    semesterCode: "20251",
    semesterName: "GASAL 2025/2026",
    courses: [
      { no: 1, code: "22INF52101", name: "Rekayasa Perangkat Lunak Lanjut", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Dr. M. Adhi Wibowo, S.Kom., M.M." },
      { no: 2, code: "22INF52102", name: "Kecerdasan Buatan Terapan", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Christy Mahendra, M.Kom." },
      { no: 3, code: "22SYS50103", name: "Manajemen Proyek Teknologi Informasi", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Diwahana Mutiara Chandrasari, M.Kom." },
      { no: 4, code: "22SYS50104", name: "Tata Kelola Teknologi Informasi (ITIL)", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Yosita Lianawati, S.Kom., M.T.I." },
      { no: 5, code: "22INF52105", name: "Pemrograman Berbasis Komponen & Web Service", classGroup: "B", sks: 4, grade: "A", weight: 4.0, lecturer: "Dwi Kurnia Wibowo, S.Kom., M.Kom." },
      { no: 6, code: "22SYS50106", name: "Interaksi Manusia dan Komputer Lanjut", classGroup: "A", sks: 3, grade: "AB", weight: 3.5, lecturer: "Putu Samuel Prihatmajaya, M.Kom." },
      { no: 7, code: "22UNI50001", name: "Metodologi Penelitian Akademik", classGroup: "C", sks: 4, grade: "A", weight: 4.0, lecturer: "Dr. Romanus Edy Prabowo, S.Si., M.Sc." }
    ]
  },
  {
    semesterCode: "20242",
    semesterName: "GENAP 2024/2025",
    courses: [
      { no: 1, code: "22INF42101", name: "Pemrograman Web Lanjut", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Dwi Kurnia Wibowo, S.Kom., M.Kom." },
      { no: 2, code: "22SYS40102", name: "Sistem Basis Data Terdistribusi", classGroup: "A", sks: 4, grade: "A", weight: 4.0, lecturer: "Diwahana Mutiara Chandrasari, M.Kom." },
      { no: 3, code: "22SYS40103", name: "Analisis & Desain Sistem Berorientasi Objek", classGroup: "B", sks: 3, grade: "A", weight: 4.0, lecturer: "Yosita Lianawati, S.Kom., M.T.I." },
      { no: 4, code: "22INF42104", name: "Jaringan Komputer & Komunikasi Data", classGroup: "B", sks: 3, grade: "AB", weight: 3.5, lecturer: "Putu Samuel Prihatmajaya, M.Kom." },
      { no: 5, code: "22SYS40105", name: "Etika Profesi & Hukum Siber", classGroup: "A", sks: 2, grade: "A", weight: 4.0, lecturer: "Monika Gisthi Secaresmi, S.S., M.Pd." },
      { no: 6, code: "22INF42106", name: "Pemrograman Berorientasi Objek", classGroup: "A", sks: 4, grade: "A", weight: 4.0, lecturer: "Christy Mahendra, M.Kom." },
      { no: 7, code: "22SYS40107", name: "Kewirausahaan Digital", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Dr. M. Adhi Wibowo, S.Kom., M.M." }
    ]
  },
  {
    semesterCode: "20241",
    semesterName: "GASAL 2024/2025",
    courses: [
      { no: 1, code: "22INF32101", name: "Struktur Data & Algoritma", classGroup: "A", sks: 4, grade: "A", weight: 4.0, lecturer: "Christy Mahendra, M.Kom." },
      { no: 2, code: "22SYS30102", name: "Sistem Manajemen Basis Data", classGroup: "A", sks: 4, grade: "A", weight: 4.0, lecturer: "Diwahana Mutiara Chandrasari, M.Kom." },
      { no: 3, code: "22INF32103", name: "Pemrograman Web Dasar", classGroup: "B", sks: 3, grade: "A", weight: 4.0, lecturer: "Dwi Kurnia Wibowo, S.Kom., M.Kom." },
      { no: 4, code: "22SYS30104", name: "Arsitektur Enterprise", classGroup: "A", sks: 3, grade: "AB", weight: 3.5, lecturer: "Yosita Lianawati, S.Kom., M.T.I." },
      { no: 5, code: "22UNI30005", name: "Statistika & Probabilitas", classGroup: "C", sks: 3, grade: "A", weight: 4.0, lecturer: "Dr. Romanus Edy Prabowo, S.Si." },
      { no: 6, code: "22SYS30106", name: "Sistem Informasi Manajemen", classGroup: "B", sks: 3, grade: "A", weight: 4.0, lecturer: "Dr. M. Adhi Wibowo, S.Kom., M.M." },
      { no: 7, code: "22UNI30007", name: "Bahasa Inggris Akademik & Profesional", classGroup: "B", sks: 4, grade: "AB", weight: 3.5, lecturer: "Wilibrordus Megandika Wicaksono, M.IKom" }
    ]
  },
  {
    semesterCode: "20232",
    semesterName: "GENAP 2023/2024",
    courses: [
      { no: 1, code: "22INF22101", name: "Algoritma Pemrograman II", classGroup: "A", sks: 4, grade: "A", weight: 4.0, lecturer: "Christy Mahendra, M.Kom." },
      { no: 2, code: "22SYS20102", name: "Konsep Sistem Informasi", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Diwahana Mutiara Chandrasari, M.Kom." },
      { no: 3, code: "22INF22103", name: "Sistem Operasi Komputer", classGroup: "B", sks: 3, grade: "AB", weight: 3.5, lecturer: "Putu Samuel Prihatmajaya, M.Kom." },
      { no: 4, code: "22UNI20004", name: "Matematika Diskrit", classGroup: "C", sks: 3, grade: "A", weight: 4.0, lecturer: "Dr. Romanus Edy Prabowo, S.Si." },
      { no: 5, code: "22SYS20105", name: "Akuntansi Dasar untuk Bisnis", classGroup: "B", sks: 3, grade: "B", weight: 3.0, lecturer: "Dra. Siti Rahayu, M.Si., Ak." },
      { no: 6, code: "22UNI20006", name: "Pendidikan Pancasila & Kewarganegaraan", classGroup: "A", sks: 4, grade: "A", weight: 4.0, lecturer: "Monika Gisthi Secaresmi, S.S., M.Pd." },
      { no: 7, code: "22INF22107", name: "Desain Antarmuka Pengguna (UI/UX)", classGroup: "A", sks: 4, grade: "A", weight: 4.0, lecturer: "Yosita Lianawati, S.Kom., M.T.I." }
    ]
  },
  {
    semesterCode: "20231",
    semesterName: "GASAL 2023/2024",
    courses: [
      { no: 1, code: "22INF12101", name: "Pengantar Teknologi Informasi", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Dr. M. Adhi Wibowo, S.Kom." },
      { no: 2, code: "22INF12102", name: "Algoritma Pemrograman I", classGroup: "A", sks: 4, grade: "AB", weight: 3.5, lecturer: "Christy Mahendra, M.Kom." },
      { no: 3, code: "22UNI10003", name: "Kalkulus & Aljabar Linier", classGroup: "C", sks: 3, grade: "B", weight: 3.0, lecturer: "Dr. Romanus Edy Prabowo, S.Si." },
      { no: 4, code: "22SYS10104", name: "Organisasi & Arsitektur Komputer", classGroup: "B", sks: 3, grade: "A", weight: 4.0, lecturer: "Putu Samuel Prihatmajaya, M.Kom." },
      { no: 5, code: "22UNI10005", name: "Bahasa Indonesia Ilmiah", classGroup: "A", sks: 2, grade: "A", weight: 4.0, lecturer: "Monika Gisthi Secaresmi, S.S., M.Pd." },
      { no: 6, code: "22UNI10006", name: "Pendidikan Agama & Budi Pekerti", classGroup: "A", sks: 2, grade: "A", weight: 4.0, lecturer: "Wilibrordus Megandika Wicaksono, M.IKom" },
      { no: 7, code: "22SYS10107", name: "Dasar Logika Pemecahan Masalah", classGroup: "A", sks: 3, grade: "A", weight: 4.0, lecturer: "Diwahana Mutiara Chandrasari, M.Kom." }
    ]
  }
];

export const MOCK_AVAILABLE_KRS_COURSES = [
  {
    id: "c-01",
    code: "22SYS70101",
    name: "Skripsi / Tugas Akhir",
    sks: 6,
    classGroup: "A",
    schedule: "Senin, 08.00 - 12.00 WIB",
    room: "Ruang Seminar 3.1",
    lecturer: "Diwahana Mutiara Chandrasari, M.Kom.",
    capacity: 40,
    enrolled: 18,
    isFull: false
  },
  {
    id: "c-02",
    code: "22SYS70102",
    name: "Audit & Tata Kelola Sistem Informasi",
    sks: 3,
    classGroup: "A",
    schedule: "Selasa, 08.00 - 10.30 WIB",
    room: "Lab Komputer 2",
    lecturer: "Dr. M. Adhi Wibowo, S.Kom., M.M., M.T.I.",
    capacity: 35,
    enrolled: 35, // Penuh untuk simulasi edge case kuota
    isFull: true
  },
  {
    id: "c-03",
    code: "22SYS70103",
    name: "Manajemen Resiko Teknologi Informasi",
    sks: 3,
    classGroup: "B",
    schedule: "Selasa, 13.00 - 15.30 WIB",
    room: "Gedung B Ruang 204",
    lecturer: "Yosita Lianawati, S.Kom., M.T.I.",
    capacity: 35,
    enrolled: 24,
    isFull: false
  },
  {
    id: "c-04",
    code: "22INF72104",
    name: "Cloud Computing & Arsitektur Microservices",
    sks: 3,
    classGroup: "A",
    schedule: "Rabu, 08.00 - 10.30 WIB",
    room: "Lab Jaringan",
    lecturer: "Putu Samuel Prihatmajaya, M.Kom.",
    capacity: 30,
    enrolled: 27,
    isFull: false
  },
  {
    id: "c-05",
    code: "22INF72105",
    name: "Pemrosesan Bahasa Alami (NLP)",
    sks: 3,
    classGroup: "A",
    schedule: "Rabu, 13.00 - 15.30 WIB",
    room: "Lab Data Science",
    lecturer: "Christy Mahendra, M.Kom.",
    capacity: 30,
    enrolled: 15,
    isFull: false
  },
  {
    id: "c-06",
    code: "22SYS70106",
    name: "Perencanaan Strategis Sistem Informasi (PSSI)",
    sks: 3,
    classGroup: "A",
    schedule: "Kamis, 08.00 - 10.30 WIB",
    room: "Gedung A Ruang 101",
    lecturer: "Diwahana Mutiara Chandrasari, M.Kom.",
    capacity: 35,
    enrolled: 30,
    isFull: false
  },
  {
    id: "c-07",
    code: "22INF72107",
    name: "Pengembangan Aplikasi Mobile Lanjut",
    sks: 3,
    classGroup: "A",
    schedule: "Kamis, 13.00 - 15.30 WIB",
    room: "Lab Multimedia",
    lecturer: "Dwi Kurnia Wibowo, S.Kom., M.Kom.",
    capacity: 30,
    enrolled: 22,
    isFull: false
  },
  {
    id: "c-08",
    code: "22UNI70008",
    name: "Kepemimpinan & Etika Bisnis Global",
    sks: 2,
    classGroup: "C",
    schedule: "Jumat, 08.00 - 09.40 WIB",
    room: "Auditorium Lantai 4",
    lecturer: "Dr. Romanus Edy Prabowo, S.Si., M.Sc., Ph.D.",
    capacity: 50,
    enrolled: 42,
    isFull: false
  }
];

export const MOCK_RAG_FAQ = [
  {
    keywords: ["cekal", "blokir", "tagihan", "bayar", "keuangan", "ukp", "ukv", "dpp"],
    reply: "Berdasarkan Buku Pedoman Pendidikan 2025 (Bab VII Hal. 74 & 79), herregistrasi dan pengisian KRS mensyaratkan pelunasan UKP dan UKM. Mahasiswa wajib melunasi UKP dan UKV paling lambat sebelum UTS (Hal. 76). Jika mengalami kesulitan finansial, Anda dapat mengajukan Surat Permohonan Penundaan DPP/UKP/UKV ke Ketua STIKOM Yos Sudarso melalui Wakil Ketua II Bidang Keuangan (Hal. 79)."
  },
  {
    keywords: ["krs", "ambil sks", "sks", "maksimal", "jatah"],
    reply: "Berdasarkan tabel resmi Pedoman Pendidikan 2025 (Hal. 39), beban studi maksimum ditentukan oleh IPS semester sebelumnya: IPS >= 3.00 (24 SKS), 2.50-2.99 (21 SKS), 2.00-2.49 (18 SKS), 1.50-1.99 (15 SKS), dan < 1.50 (12 SKS). Sesuai kesepakatan kampus (Hal. 76 butir 4), mahasiswa diperkenankan mengambil +1 SKS jika tidak ada kombinasi mata kuliah yang pas, selama tidak melampaui 24 SKS."
  },
  {
    keywords: ["khs", "cetak khs", "nilai", "ipk", "skala nilai", "grade"],
    reply: "Skala penilaian resmi STIKOM Yos Sudarso (Hal. 38): A=4.0 (>=80), AB=3.5 (75-79), B=3.0 (70-74), BC=2.5 (65-69), C=2.0 (60-64), CD=1.5 (55-59), D=1.0 (45-54), dan E=0.0 (<45). Mahasiswa dapat melihat dan mencetak KHS secara mandiri melalui SIA setelah pengisian IKAD (evaluasi dosen) dan dosen selesai menginput nilai (Hal. 51, 74)."
  },
  {
    keywords: ["uts", "uas", "ujian", "kartu ujian", "susulan", "remidi"],
    reply: "Syarat mengikuti UTS/UAS (Hal. 46): KRS telah divalidasi dosen PA, lunas administrasi keuangan, kehadiran kuliah minimal 75% (11 dari 14 pertemuan), dan membawa Kartu Ujian fisik. Ujian susulan hanya diizinkan untuk: tugas resmi kampus, sakit (surat dokter), atau musibah keluarga inti meninggal (Hal. 46). Ujian remidi terbuka bagi mahasiswa dengan nilai di bawah C (Hal. 47)."
  },
  {
    keywords: ["cuti", "cuti studi", "berhenti sementara"],
    reply: "Berdasarkan Bab VII Bagian H (Hal. 78): Mahasiswa berhak mengajukan cuti studi paling banyak 2 kali dan maksimal 4 semester (2 tahun). Diajukan paling lambat saat jadwal KRS. Selama cuti resmi, mahasiswa membayar UKP 50% dan bebas UKV (lama cuti tidak dihitung masa studi). Cuti tanpa izin wajib bayar UKP 100% dan bila 2 semester berturut-turut tanpa izin dinyatakan gugur status mahasiswanya."
  },
  {
    keywords: ["skripsi", "tugas akhir", "sempro", "semhas", "pendadaran", "komprehensif", "prosedur skripsi", "pendaftaran skripsi", "tahapan skripsi"],
    reply: "Syarat & Prosedur Skripsi S1 (Hal. 49, 87):\n\nSyarat Pendaftaran: Mahasiswa aktif, selesai minimal 110 SKS dengan IPK >= 2.20, nilai D maksimal 8 SKS, lulus/sedang tempuh Metodologi Penelitian & PPL, dan menghadiri minimal 5 kali seminar hasil mahasiswa lain.\n\nTahapan:\n1. Pendaftaran Skripsi — Ajukan judul & calon pembimbing ke Kaprodi. SK Pembimbing terbit setelah disetujui.\n2. Seminar Proposal (Sempro) — Diuji oleh 2 pembimbing + 1 penguji. Wajib revisi sesuai catatan penguji.\n3. Bimbingan Intensif — Minimal 10 kali bimbingan terdokumentasi (kartu bimbingan).\n4. Seminar Hasil (Semhas) — Presentasi hasil penelitian, dihadiri minimal 10 mahasiswa peserta.\n5. Ujian Pendadaran/Komprehensif — 3 penguji. Syarat: lulus semua MK tanpa E, IPK >= 2.50, D maks 4 SKS (maks 2 MK), MKWU dan Metopen min C, serta naskah jurnal nasional ber-ISSN min berstatus submit.\n\nBatas waktu pengerjaan skripsi maksimal 2 semester sejak SK terbit (Hal. 49)."
  },
  {
    keywords: ["cumlaude", "pujian", "yudisium", "predikat", "lulus"],
    reply: "Predikat Kelulusan S1 (Hal. 39): IPK 2.50-2.75 (Lulus), 2.76-3.00 (Memuaskan), 3.01-3.50 (Sangat Memuaskan), dan > 3.50 (Dengan Pujian / Cum Laude). Syarat predikat Dengan Pujian: masa studi maksimal 4 tahun dan TIDAK ADA nilai C maupun D (Hal. 39 butir m)."
  }
];
