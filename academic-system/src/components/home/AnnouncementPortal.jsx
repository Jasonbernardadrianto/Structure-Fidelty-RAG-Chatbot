import React from 'react';
import { 
  Building2, 
  Calendar, 
  ChevronRight, 
  Filter, 
  X,
  FileText
} from 'lucide-react';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockAcademicData';

export default function AnnouncementPortal() {
  const [selectedBureau, setSelectedBureau] = React.useState('semua');
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);

  const bureaus = [
    { id: 'semua', label: 'Semua Biro' },
    { id: 'akademik', label: 'Biro Akademik' },
    { id: 'keuangan', label: 'Biro Keuangan' },
    { id: 'kemahasiswaan', label: 'Biro Kemahasiswaan' },
  ];

  const filteredAnnouncements = selectedBureau === 'semua'
    ? MOCK_ANNOUNCEMENTS
    : MOCK_ANNOUNCEMENTS.filter(item => item.bureauCode === selectedBureau);

  const getBureauBadgeColor = (code) => {
    switch (code) {
      case 'akademik':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'keuangan':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'kemahasiswaan':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      {/* Header section with Filter Tabs */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-900" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Portal Warta & Informasi Biro
            </h3>
          </div>

          {/* Filter Tab Buttons */}
          <div className="flex flex-wrap gap-1">
            {bureaus.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBureau(b.id)}
                className={`px-2.5 py-1 text-xs rounded transition cursor-pointer font-medium ${
                  selectedBureau === b.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="divide-y divide-slate-100">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Tidak ada pengumuman untuk biro ini.
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <article 
              key={item.id} 
              className="p-4 hover:bg-slate-50/80 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getBureauBadgeColor(item.bureauCode)}`}>
                    {item.bureau}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.publishedAt}</span>
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setSelectedAnnouncement(item)}
                  className="text-xs font-medium text-blue-900 hover:text-blue-800 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal Detail Pengumuman */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full max-h-[85vh] flex flex-col shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getBureauBadgeColor(selectedAnnouncement.bureauCode)}`}>
                  {selectedAnnouncement.bureau}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {selectedAnnouncement.publishedAt}
                </span>
              </div>
              <button 
                onClick={() => setSelectedAnnouncement(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {selectedAnnouncement.title}
              </h3>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {selectedAnnouncement.details || selectedAnnouncement.summary}
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
