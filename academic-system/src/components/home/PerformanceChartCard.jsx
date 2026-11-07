import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { TrendingUp, Award, BookOpen } from 'lucide-react';
import { calculateSemesterGPA, calculateCumulativeGPA } from '../../utils/academicCalculations';

export default function PerformanceChartCard({ khsData }) {
  // Hitung metrik per semester
  const performanceData = React.useMemo(() => {
    return khsData.map((sem) => {
      const stats = calculateSemesterGPA(sem.courses);
      return {
        semesterCode: sem.semesterCode,
        semesterName: sem.semesterName,
        // Short name misal "GASAL 23/24"
        shortName: sem.semesterName.replace('20', '').replace('20', ''),
        ips: stats.ips,
        sks: stats.totalSks,
        quality: stats.totalQuality,
      };
    }).reverse(); // Urutan kronologis dari semester 1 ke 6
  }, [khsData]);

  // Hitung IPK kumulatif
  const cumulativeStats = React.useMemo(() => {
    return calculateCumulativeGPA(performanceData);
  }, [performanceData]);

  const latestSemester = performanceData[performanceData.length - 1] || { ips: 0, sks: 0, shortName: '-' };
  const previousSemester = performanceData.length > 1 ? performanceData[performanceData.length - 2] : null;
  const ipTrend = previousSemester ? (latestSemester.ips - previousSemester.ips).toFixed(2) : 0;

  // Custom tooltip tanpa dekorasi berlebih
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded shadow text-xs border border-slate-800">
          <p className="font-semibold text-slate-200">{data.semesterName}</p>
          <div className="mt-1 space-y-0.5 font-mono text-[11px]">
            <p>IPS: <span className="text-blue-300 font-bold">{data.ips.toFixed(2)}</span> / 4.00</p>
            <p>SKS Semester: <span className="text-slate-300">{data.sks} SKS</span></p>
            <p>Total Kualitas: <span className="text-slate-300">{data.quality}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      {/* Header Card */}
      <div className="p-3.5 border-b border-slate-200 bg-blue-900 text-white flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider">
          Perkembangan IP & SKS Semester
        </h3>
        <span className="text-[11px] font-mono opacity-80">
          6 Semester Terakhir
        </span>
      </div>

      <div className="p-4">
        {/* Ringkasan Statistik Kartu (Metric Badges) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">IP Kumulatif (IPK)</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-base font-bold font-mono text-blue-950">{cumulativeStats.gpa.toFixed(2)}</span>
              <span className="text-[10px] font-mono text-slate-400">/ 4.00</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Total SKS Lulus</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-base font-bold font-mono text-slate-900">{cumulativeStats.cumulativeSks}</span>
              <span className="text-[10px] text-slate-500">SKS</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">IP Terakhir</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-base font-bold font-mono text-blue-900">{latestSemester.ips.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400">({latestSemester.shortName})</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Tren Performa</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className={`text-xs font-mono font-bold ${Number(ipTrend) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {Number(ipTrend) >= 0 ? `+${ipTrend}` : ipTrend}
              </span>
              <span className="text-[10px] text-slate-400">vs sem lalu</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis 
                dataKey="shortName" 
                tick={{ fontSize: 10, fill: '#475569' }} 
                interval={0}
                angle={-12}
                textAnchor="end"
              />
              <YAxis 
                domain={[0, 4.0]} 
                ticks={[0, 1.0, 2.0, 3.0, 4.0]} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={3.0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Bar 
                dataKey="ips" 
                fill="#1e3a8a" 
                radius={[2, 2, 0, 0]} 
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Horizontal List seperti screenshot 2 */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-semibold uppercase text-slate-600 tracking-wider block">
            Rincian Indeks Prestasi per Semester
          </span>
          <div className="space-y-1.5">
            {performanceData.slice().reverse().map((sem) => (
              <div key={sem.semesterCode} className="flex items-center text-xs">
                <span className="w-28 text-slate-600 font-mono text-[11px] truncate">
                  {sem.semesterName}
                </span>
                <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] rounded mr-2 shrink-0">
                  {sem.sks} sks
                </span>
                <div className="flex-1 bg-slate-100 rounded-xs h-4 overflow-hidden relative mr-2">
                  <div 
                    className="bg-blue-900 h-full rounded-xs transition-all duration-300"
                    style={{ width: `${(sem.ips / 4.0) * 100}%` }}
                  />
                </div>
                <span className="w-9 text-right font-mono font-bold text-slate-800 text-[11px]">
                  {sem.ips.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
