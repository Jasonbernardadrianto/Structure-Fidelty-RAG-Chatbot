/**
 * academicCalculations.js
 * 
 * Fungsi murni perhitungan nilai akademik perguruan tinggi.
 * Seluruh fungsi bersifat murni (pure function) tanpa efek samping (side effects).
 */

// Skala bobot nilai resmi berdasarkan Buku Pedoman Pendidikan STIKOM Yos Sudarso 2025 (Hal. 38)
export const GRADE_WEIGHTS = {
  'A': 4.0,   // >= 80 (Sangat Baik)
  'AB': 3.5,  // >= 75 - < 80 (Lebih dari Baik)
  'B': 3.0,   // >= 70 - < 75 (Baik)
  'BC': 2.5,  // >= 65 - < 70 (Lebih dari Cukup)
  'C': 2.0,   // >= 60 - < 65 (Cukup)
  'CD': 1.5,  // >= 55 - < 60 (Kurang dari Cukup)
  'D': 1.0,   // >= 45 - < 55 (Kurang)
  'E': 0.0,   // < 45 (Gagal)
};

/**
 * Mendapatkan bobot angka dari huruf mutu nilai.
 * @param {string} grade - Huruf mutu (A, AB, B, BC, C, D, E)
 * @returns {number} Bobot angka (0.0 - 4.0)
 */
export function getGradeWeight(grade) {
  if (!grade || typeof grade !== 'string') return 0.0;
  const normalized = grade.trim().toUpperCase();
  return GRADE_WEIGHTS.hasOwnProperty(normalized) ? GRADE_WEIGHTS[normalized] : 0.0;
}

/**
 * Menghitung angka kualitas per mata kuliah.
 * Rumus: Kualitas = SKS * Bobot
 * @param {number} sks - Jumlah Satuan Kredit Semester
 * @param {string|number} gradeOrWeight - Huruf mutu atau angka bobot langsung
 * @returns {number} Angka kualitas
 */
export function calculateQuality(sks, gradeOrWeight) {
  const sksNum = Number(sks) || 0;
  if (sksNum <= 0) return 0;

  const weight = typeof gradeOrWeight === 'number' 
    ? gradeOrWeight 
    : getGradeWeight(gradeOrWeight);

  return parseFloat((sksNum * weight).toFixed(2));
}

/**
 * Menghitung Indeks Prestasi Semester (IPS).
 * Rumus: IPS = Total Kualitas Semester / Total SKS Semester
 * @param {Array<{sks: number, grade?: string, weight?: number, quality?: number}>} courses
 * @returns {{totalSks: number, totalQuality: number, ips: number}}
 */
export function calculateSemesterGPA(courses) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return { totalSks: 0, totalQuality: 0, ips: 0.0 };
  }

  let totalSks = 0;
  let totalQuality = 0;

  for (const course of courses) {
    const sks = Number(course.sks) || 0;
    totalSks += sks;

    if (course.quality !== undefined && course.quality !== null) {
      totalQuality += Number(course.quality) || 0;
    } else {
      const weight = course.weight !== undefined ? course.weight : course.grade;
      totalQuality += calculateQuality(sks, weight);
    }
  }

  const ips = totalSks > 0 ? parseFloat((totalQuality / totalSks).toFixed(2)) : 0.0;
  return {
    totalSks,
    totalQuality: parseFloat(totalQuality.toFixed(2)),
    ips,
  };
}

/**
 * Menghitung Indeks Prestasi Kumulatif (IPK).
 * Rumus: IPK = Total Kualitas Seluruh Semester / Total SKS Seluruh Semester
 * @param {Array<{courses?: Array<any>, totalSks?: number, totalQuality?: number}>} semesters
 * @returns {{cumulativeSks: number, cumulativeQuality: number, gpa: number}}
 */
export function calculateCumulativeGPA(semesters) {
  if (!Array.isArray(semesters) || semesters.length === 0) {
    return { cumulativeSks: 0, cumulativeQuality: 0, gpa: 0.0 };
  }

  let cumulativeSks = 0;
  let cumulativeQuality = 0;

  for (const sem of semesters) {
    if (sem.totalSks !== undefined && sem.totalQuality !== undefined) {
      cumulativeSks += Number(sem.totalSks) || 0;
      cumulativeQuality += Number(sem.totalQuality) || 0;
    } else if (Array.isArray(sem.courses)) {
      const semResult = calculateSemesterGPA(sem.courses);
      cumulativeSks += semResult.totalSks;
      cumulativeQuality += semResult.totalQuality;
    }
  }

  const gpa = cumulativeSks > 0 ? parseFloat((cumulativeQuality / cumulativeSks).toFixed(2)) : 0.0;
  return {
    cumulativeSks,
    cumulativeQuality: parseFloat(cumulativeQuality.toFixed(2)),
    gpa,
  };
}

/**
 * Menentukan batas maksimum SKS yang boleh diambil mahasiswa untuk KRS
 * berdasarkan IPS semester sebelumnya sesuai Buku Pedoman Pendidikan STIKOM Yos Sudarso 2025 (Hal. 39).
 * Catatan: Mahasiswa diperkenankan mengambil +1 SKS jika tidak ada mata kuliah yang pas (Hal. 76).
 * @param {number} previousIPS - IPS semester sebelumnya
 * @returns {number} Batas maksimal SKS resmi
 */
export function getMaxKrsCredits(previousIPS) {
  const ips = Number(previousIPS) || 0;
  if (ips >= 3.00) return 24;
  if (ips >= 2.50) return 21;
  if (ips >= 2.00) return 18;
  if (ips >= 1.50) return 15;
  return 12;
}

/**
 * Kriteria Predikat Kelulusan Sesuai Pedoman STIKOM Yos Sudarso 2025 (Hal. 39)
 * @param {number} ipk - Indeks Prestasi Kumulatif
 * @returns {string} Predikat Kelulusan
 */
export function getGraduationPredicate(ipk) {
  const score = Number(ipk) || 0;
  if (score > 3.50) return 'Dengan Pujian (Cum Laude)';
  if (score >= 3.01) return 'Sangat Memuaskan';
  if (score >= 2.76) return 'Memuaskan';
  if (score >= 2.50) return 'Lulus';
  return 'Belum Memenuhi Syarat Kelulusan (IPK Min 2.50)';
}
