import { describe, it, expect } from 'vitest';
import {
  GRADE_WEIGHTS,
  getGradeWeight,
  calculateQuality,
  calculateSemesterGPA,
  calculateCumulativeGPA,
  getMaxKrsCredits,
  getGraduationPredicate
} from './academicCalculations.js';

describe('academicCalculations', () => {
  describe('getGradeWeight', () => {
    it('mengembalikan bobot yang benar untuk setiap huruf mutu', () => {
      expect(getGradeWeight('A')).toBe(4.0);
      expect(getGradeWeight('AB')).toBe(3.5);
      expect(getGradeWeight('B')).toBe(3.0);
      expect(getGradeWeight('BC')).toBe(2.5);
      expect(getGradeWeight('C')).toBe(2.0);
      expect(getGradeWeight('CD')).toBe(1.5);
      expect(getGradeWeight('D')).toBe(1.0);
      expect(getGradeWeight('E')).toBe(0.0);
    });

    it('toleran terhadap huruf kecil dan spasi tambahan', () => {
      expect(getGradeWeight(' a ')).toBe(4.0);
      expect(getGradeWeight('ab')).toBe(3.5);
      expect(getGradeWeight('bc')).toBe(2.5);
    });

    it('mengembalikan 0 untuk nilai tidak valid atau null', () => {
      expect(getGradeWeight('T')).toBe(0.0);
      expect(getGradeWeight(null)).toBe(0.0);
      expect(getGradeWeight(undefined)).toBe(0.0);
    });
  });

  describe('calculateQuality', () => {
    it('menghitung kualitas = SKS * Bobot', () => {
      expect(calculateQuality(3, 'A')).toBe(12.0);
      expect(calculateQuality(2, 'AB')).toBe(7.0);
      expect(calculateQuality(3, 'BC')).toBe(7.5);
      expect(calculateQuality(4, 'B')).toBe(12.0);
      expect(calculateQuality(2, 'E')).toBe(0.0);
    });

    it('menerima bobot numerik secara langsung', () => {
      expect(calculateQuality(3, 4.0)).toBe(12.0);
      expect(calculateQuality(3, 3.5)).toBe(10.5);
    });

    it('mengembalikan 0 bila SKS 0 atau negatif', () => {
      expect(calculateQuality(0, 'A')).toBe(0);
      expect(calculateQuality(-2, 'A')).toBe(0);
    });
  });

  describe('calculateSemesterGPA (IPS)', () => {
    it('menghitung total SKS, total kualitas, dan IPS dengan akurat sesuai data screenshot 3', () => {
      // Semester Genap 2025/2026 dari screenshot: 6 MK, semua A (bobot 4.0), SKS: 3, 2, 2, 3, 3, 3 = 16 SKS
      const courses = [
        { sks: 3, grade: 'A' },
        { sks: 2, grade: 'A' },
        { sks: 2, grade: 'A' },
        { sks: 3, grade: 'A' },
        { sks: 3, grade: 'A' },
        { sks: 3, grade: 'A' }
      ];

      const result = calculateSemesterGPA(courses);
      expect(result.totalSks).toBe(16);
      expect(result.totalQuality).toBe(64.0);
      expect(result.ips).toBe(4.0);
    });

    it('menghitung variasi nilai dengan pembulatan 2 desimal', () => {
      const courses = [
        { sks: 3, grade: 'A' },  // 12
        { sks: 3, grade: 'B' },  // 9
        { sks: 4, grade: 'AB' }  // 14
        // Total SKS = 10, Total Kualitas = 35 -> IPS = 3.50
      ];

      const result = calculateSemesterGPA(courses);
      expect(result.totalSks).toBe(10);
      expect(result.totalQuality).toBe(35.0);
      expect(result.ips).toBe(3.50);
    });

    it('mengembalikan 0 untuk daftar mata kuliah kosong', () => {
      const result = calculateSemesterGPA([]);
      expect(result.totalSks).toBe(0);
      expect(result.totalQuality).toBe(0);
      expect(result.ips).toBe(0.0);
    });
  });

  describe('calculateCumulativeGPA (IPK)', () => {
    it('menghitung IPK kumulatif dari beberapa semester', () => {
      const semesters = [
        { totalSks: 20, totalQuality: 73.6 }, // IPS 3.68
        { totalSks: 24, totalQuality: 90.0 }, // IPS 3.75
        { totalSks: 24, totalQuality: 93.12 }, // IPS 3.88
        { totalSks: 22, totalQuality: 86.46 }, // IPS 3.93
        { totalSks: 23, totalQuality: 90.39 }, // IPS 3.93
        { totalSks: 16, totalQuality: 64.0 }  // IPS 4.00
      ];

      const result = calculateCumulativeGPA(semesters);
      expect(result.cumulativeSks).toBe(129);
      expect(result.gpa).toBeGreaterThanOrEqual(3.8);
    });
  });

  describe('getMaxKrsCredits', () => {
    it('memberikan batas SKS sesuai capaian IPS Buku Pedoman 2025 Hal 39', () => {
      expect(getMaxKrsCredits(3.85)).toBe(24);
      expect(getMaxKrsCredits(2.75)).toBe(21);
      expect(getMaxKrsCredits(2.20)).toBe(18);
      expect(getMaxKrsCredits(1.80)).toBe(15);
      expect(getMaxKrsCredits(1.20)).toBe(12);
    });
  });

  describe('getGraduationPredicate', () => {
    it('menghitung predikat kelulusan sesuai Buku Pedoman 2025 Hal 39', () => {
      expect(getGraduationPredicate(3.86)).toBe('Dengan Pujian (Cum Laude)');
      expect(getGraduationPredicate(3.25)).toBe('Sangat Memuaskan');
      expect(getGraduationPredicate(2.80)).toBe('Memuaskan');
      expect(getGraduationPredicate(2.50)).toBe('Lulus');
      expect(getGraduationPredicate(2.30)).toContain('Belum Memenuhi Syarat');
    });
  });
});
