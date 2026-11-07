import React from 'react';
import { Printer, Filter, CheckCircle2, Award } from 'lucide-react';
import { calculateSemesterGPA } from '../utils/academicCalculations';

export default function KhsView({ student, khsData }) {
  const [selectedSemester, setSelectedSemester] = React.useState('ALL');

  const semestersToDisplay = selectedSemester === 'ALL'
    ? khsData
    : khsData.filter(sem => sem.semesterCode === selectedSemester);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Filter Semester:</span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedSemester('ALL')}
              className={`px-3 py-1.5 text-xs rounded font-medium transition cursor-pointer ${
                selectedSemester === 'ALL'
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua Semester
            </button>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-800 font-mono"
            >
              <option value="ALL">-- Pilih Semester --</option>
              {khsData.map(sem => (
                <option key={sem.semesterCode} value={sem.semesterCode}>
                  {sem.semesterName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded shadow-xs flex items-center space-x-2 cursor-pointer transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak KHS</span>
          </button>
        </div>
      </div>

      {/* Dokumen KHS Tiap Semester */}
      <div className="space-y-8">
        {semestersToDisplay.map((semester) => {
          const stats = calculateSemesterGPA(semester.courses);

          return (
            <div 
              key={semester.semesterCode} 
              className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden print:border-none print:shadow-none"
            >
              {/* Header Pita Semester seperti Screenshot 3 */}
              <div className="bg-blue-900 text-white px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {semester.semesterName}
                  </span>
                </div>
                <div className="text-xs font-mono opacity-90 hidden sm:block">
                  Program Studi: {student.studyProgram}
                </div>
              </div>

              {/* Tabel Matakuliah Padat */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase font-semibold text-[11px] tracking-wider">
                      <th className="py-2.5 px-3 w-10 text-center">NO</th>
                      <th className="py-2.5 px-3 w-28 font-mono">KODE</th>
                      <th className="py-2.5 px-3">MATAKULIAH</th>
                      <th className="py-2.5 px-3 w-16 text-center">GRUP</th>
                      <th className="py-2.5 px-3 w-14 text-center">SKS</th>
                      <th className="py-2.5 px-3 w-14 text-center">NILAI</th>
                      <th className="py-2.5 px-3 w-14 text-center">BOBOT</th>
                      <th className="py-2.5 px-3 w-16 text-center">KUALITAS</th>
                      <th className="py-2.5 px-3 min-w-[200px]">DOSEN PENGAMPU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {semester.courses.map((course) => {
                      const quality = course.sks * course.weight;
                      return (
                        <tr key={course.code} className="hover:bg-slate-50/70 transition">
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">{course.no}.</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{course.code}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{course.name}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-600">{course.classGroup}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-800">{course.sks}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-900">{course.grade}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-600">{course.weight.toFixed(1)}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">{quality.toFixed(1)}</td>
                          <td className="py-2.5 px-3 text-slate-600 whitespace-pre-line text-[11px] leading-relaxed">
                            {course.lecturer}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Rekapitulasi Semester */}
              <div className="bg-slate-50 border-t border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="font-semibold uppercase tracking-wider text-slate-700">
                  {semester.semesterName} TOTAL
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 uppercase text-[10px]">Total SKS:</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-900 rounded font-bold">
                      {stats.totalSks}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 uppercase text-[10px]">Total Kualitas:</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-900 rounded font-bold">
                      {stats.totalQuality.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 uppercase text-[10px]">IP Semester:</span>
                    <span className="px-2.5 py-0.5 bg-blue-900 text-white rounded font-bold text-xs">
                      {stats.ips.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
