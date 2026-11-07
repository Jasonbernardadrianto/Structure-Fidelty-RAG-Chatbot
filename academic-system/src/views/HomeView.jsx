import React from 'react';
import CekalAlertCard from '../components/home/CekalAlertCard';
import AcademicStatsCard from '../components/home/AcademicStatsCard';
import PerformanceChartCard from '../components/home/PerformanceChartCard';
import AnnouncementPortal from '../components/home/AnnouncementPortal';

export default function HomeView({ student, khsData }) {
  return (
    <div className="space-y-6">
      {/* Alert Blokir/Cekal */}
      <CekalAlertCard student={student} />

      {/* Grid Utama Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Informasi Akademik & Pejabat */}
        <div className="lg:col-span-5 space-y-6">
          <AcademicStatsCard student={student} khsData={khsData} />
        </div>

        {/* Kolom Kanan: Perkembangan IP & SKS Semester */}
        <div className="lg:col-span-7 space-y-6">
          <PerformanceChartCard khsData={khsData} />
        </div>

      </div>

      {/* Portal Informasi 3 Biro (Diletakkan di bagian bawah yang lapang dan mudah diakses) */}
      <div>
        <AnnouncementPortal />
      </div>
    </div>
  );
}
