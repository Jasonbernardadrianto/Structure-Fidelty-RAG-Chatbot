import React from 'react';
import { 
  CheckSquare, 
  Square, 
  AlertCircle, 
  AlertTriangle, 
  Check, 
  Save, 
  Clock, 
  Info, 
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { MOCK_AVAILABLE_KRS_COURSES } from '../data/mockAcademicData';
import { getMaxKrsCredits } from '../utils/academicCalculations';

export default function KrsView({ student }) {
  // State interaktif simulasi
  const [isKrsPeriodActive, setIsKrsPeriodActive] = React.useState(true);
  const [selectedCourseIds, setSelectedCourseIds] = React.useState(['c-01', 'c-04']); // Default 9 SKS
  const [saveStatus, setSaveStatus] = React.useState(null); // 'saving', 'saved', 'error'
  
  // Batas SKS dihitung dari IP terakhir (4.00) = 24 SKS
  const maxSks = getMaxKrsCredits(4.0);

  // Hitung total SKS terpilih
  const selectedCourses = MOCK_AVAILABLE_KRS_COURSES.filter(c => selectedCourseIds.includes(c.id));
  const currentTotalSks = selectedCourses.reduce((sum, c) => sum + c.sks, 0);
  const isOverLimit = currentTotalSks > maxSks;

  const toggleSelectCourse = (course) => {
    if (!isKrsPeriodActive) return;
    if (course.isFull && !selectedCourseIds.includes(course.id)) return;

    if (selectedCourseIds.includes(course.id)) {
      setSelectedCourseIds(selectedCourseIds.filter(id => id !== course.id));
    } else {
      setSelectedCourseIds([...selectedCourseIds, course.id]);
    }
    setSaveStatus(null);
  };

  const handleSaveKrs = () => {
    if (!isKrsPeriodActive || isOverLimit) return;
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Periode KRS & Toggle Pengujian */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarCheck className="w-4 h-4 text-blue-900" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Periode Pengisian KRS {student.currentSemesterName}
            </h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
              isKrsPeriodActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isKrsPeriodActive ? 'STATUS: DIBUKA' : 'STATUS: DITUTUP'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Batas pengisian: <strong className="font-mono text-slate-800">12 Nov 2026, 23.59 WIB</strong>. Konsultasikan pilihan mata kuliah dengan Dosen Wali ({student.advisor}).
          </p>
        </div>

        {/* Toggle Simulasi Pengujian Periode Buka / Tutup */}
        <div className="flex items-center space-x-2 text-xs bg-slate-50 border border-slate-200 p-1.5 rounded">
          <span className="text-slate-500 font-medium">Simulasi State:</span>
          <button
            onClick={() => setIsKrsPeriodActive(!isKrsPeriodActive)}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
              isKrsPeriodActive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {isKrsPeriodActive ? 'Ubah ke: Di Luar Periode' : 'Ubah ke: Periode Buka'}
          </button>
        </div>
      </div>

      {/* State di luar periode */}
      {!isKrsPeriodActive && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs flex items-center space-x-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">Periode Pengisian KRS Sedang Ditutup</p>
            <p className="mt-0.5 text-amber-800">
              Pengisian atau perubahan rencana studi di luar jadwal resmi hanya dapat dilakukan atas izin Biro Administrasi Akademik (BAA).
            </p>
          </div>
        </div>
      )}

      {/* Bar Ringkasan Beban SKS */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">SKS Terpilih</span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className={`text-2xl font-bold font-mono ${isOverLimit ? 'text-rose-600' : 'text-blue-900'}`}>
              {currentTotalSks}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {maxSks} SKS Maksimal</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Batas SKS (IPS Lalu 4.00)</span>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex-1 bg-slate-100 rounded-xs h-2.5 overflow-hidden border border-slate-200">
              <div 
                className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-blue-900'}`}
                style={{ width: `${Math.min((currentTotalSks / maxSks) * 100, 100)}%` }}
              />
            </div>
            <span className="font-mono text-xs text-slate-600 font-semibold">{maxSks} SKS</span>
          </div>
        </div>

        <div className="flex justify-end items-center space-x-3">
          {saveStatus === 'saved' && (
            <span className="text-xs text-emerald-700 flex items-center space-x-1 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Tersimpan (Mock)</span>
            </span>
          )}

          <button
            onClick={handleSaveKrs}
            disabled={!isKrsPeriodActive || isOverLimit || saveStatus === 'saving'}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-medium rounded shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Save className="w-4 h-4" />
            <span>{saveStatus === 'saving' ? 'Menyimpan...' : 'Simpan KRS'}</span>
          </button>
        </div>
      </div>

      {/* Peringatan Melebihi Batas SKS */}
      {isOverLimit && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            <strong>Beban SKS Melebihi Batas!</strong> Anda memilih {currentTotalSks} SKS dari batas maksimal {maxSks} SKS. Harap batalkan pilihan beberapa mata kuliah agar dapat menyimpan KRS.
          </span>
        </div>
      )}

      {/* Tabel Pemilihan Matakuliah */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Daftar Mata Kuliah Ditawarkan
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            {selectedCourses.length} Mata Kuliah Terpilih
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">PILIH</th>
                <th className="py-2.5 px-3 w-28 font-mono">KODE</th>
                <th className="py-2.5 px-3">MATA KULIAH</th>
                <th className="py-2.5 px-3 w-14 text-center">KELAS</th>
                <th className="py-2.5 px-3 w-14 text-center">SKS</th>
                <th className="py-2.5 px-3 min-w-[170px]">JADWAL & RUANG</th>
                <th className="py-2.5 px-3 min-w-[200px]">DOSEN PENGAMPU</th>
                <th className="py-2.5 px-3 w-28 text-center">KUOTA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_AVAILABLE_KRS_COURSES.map((course) => {
                const isSelected = selectedCourseIds.includes(course.id);
                const disabled = !isKrsPeriodActive || (course.isFull && !isSelected);

                return (
                  <tr 
                    key={course.id}
                    onClick={() => !disabled && toggleSelectCourse(course)}
                    className={`transition cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50/60 font-medium' 
                        : course.isFull 
                          ? 'bg-slate-50/60 opacity-60 cursor-not-allowed' 
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={disabled}
                        onChange={() => toggleSelectCourse(course)}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{course.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {course.name}
                      {course.isFull && (
                        <span className="ml-2 px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded text-[10px] font-mono">
                          Penuh
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-700">{course.classGroup}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{course.sks}</td>
                    <td className="py-2.5 px-3 text-slate-700 text-[11px]">
                      <div className="font-medium">{course.schedule}</div>
                      <div className="text-slate-400 font-mono text-[10px]">{course.room}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-relaxed">
                      {course.lecturer}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                      <span className={course.isFull ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                        {course.enrolled} / {course.capacity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
