import React from 'react';
import { UserCheck, ShieldAlert, BookOpen, CreditCard } from 'lucide-react';
import { calculateCumulativeGPA } from '../../utils/academicCalculations';

export default function AcademicStatsCard({ student, khsData }) {
  // Hitung kumulatif aktual dari KHS
  const cumulative = React.useMemo(() => {
    const semData = khsData.map(sem => {
      let semSks = 0;
      let semQual = 0;
      sem.courses.forEach(c => {
        semSks += c.sks;
        semQual += (c.sks * c.weight);
      });
      return { totalSks: semSks, totalQuality: semQual };
    });
    return calculateCumulativeGPA(semData);
  }, [khsData]);

  return (
    <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      {/* Header Info Akademik */}
      <div className="p-3.5 border-b border-slate-200 bg-blue-900 text-white flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider">
          Informasi Akademik
        </h3>
        <span className="text-[11px] font-mono opacity-80">
          Status: {student.status}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* IP Kumulatif Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-700">IP Kumulatif</span>
            <span className="text-sm font-mono font-bold text-blue-900">{cumulative.gpa.toFixed(2)} / 4.00</span>
          </div>
          <div className="w-full bg-slate-100 rounded-xs h-3 overflow-hidden border border-slate-200">
            <div 
              className="bg-blue-900 h-full rounded-xs transition-all duration-300"
              style={{ width: `${(cumulative.gpa / 4.0) * 100}%` }}
            />
          </div>
        </div>

        {/* Tabel Ringkas Nilai Sesuai Screenshot 2 */}
        <div className="border border-slate-200 rounded divide-y divide-slate-100 text-xs">
          <div className="flex justify-between py-2 px-3 bg-slate-50">
            <span className="text-slate-600">Total SKS Kumulatif</span>
            <span className="font-mono font-bold text-slate-900">{cumulative.cumulativeSks} SKS</span>
          </div>
          <div className="flex justify-between py-2 px-3">
            <span className="text-slate-600">Total Angka Kualitas</span>
            <span className="font-mono font-bold text-slate-900">{cumulative.cumulativeQuality.toFixed(1)}</span>
          </div>
          <div className="flex justify-between py-2 px-3 bg-slate-50">
            <span className="text-slate-600">Total SKS KRS ({student.currentSemesterName})</span>
            <span className="font-mono font-bold text-blue-900">{student.totalSksKrsCurrent} SKS</span>
          </div>
          <div className="flex justify-between py-2 px-3">
            <span className="text-slate-600">Total Beban KRS</span>
            <span className="font-mono font-bold text-slate-800">{student.totalPriceKrsCurrent.toFixed(1)} SKS Reguler</span>
          </div>
        </div>

        {/* Pejabat Akademik Sesuai Screenshot 2 */}
        <div className="pt-2">
          <div className="flex items-center space-x-1.5 pb-2 mb-2 border-b border-slate-100">
            <UserCheck className="w-3.5 h-3.5 text-blue-900" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Daftar Pejabat Akademik
            </h4>
          </div>
          
          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-1.5 text-slate-500 w-28 align-top">Rektor</td>
                <td className="py-1.5 text-slate-400 w-3 align-top">:</td>
                <td className="py-1.5 text-slate-800 font-medium">{student.officials.rector}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-slate-500 align-top">Dekan</td>
                <td className="py-1.5 text-slate-400 align-top">:</td>
                <td className="py-1.5 text-slate-800 font-medium">{student.officials.dean}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-slate-500 align-top">Ka. Prodi</td>
                <td className="py-1.5 text-slate-400 align-top">:</td>
                <td className="py-1.5 text-slate-800 font-medium">{student.officials.headOfProgram}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-slate-500 align-top">Kepala BAA</td>
                <td className="py-1.5 text-slate-400 align-top">:</td>
                <td className="py-1.5 text-slate-800 font-medium">{student.officials.headOfAcademicBureau}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-slate-500 align-top">Wali Studi</td>
                <td className="py-1.5 text-slate-400 align-top">:</td>
                <td className="py-1.5 text-slate-800 font-medium">{student.officials.advisor}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
