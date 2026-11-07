import React from 'react';
import { 
  Home, 
  FileSpreadsheet, 
  ChevronDown, 
  LogOut, 
  Calendar, 
  AlertTriangle 
} from 'lucide-react';

export default function Navbar({ 
  student, 
  currentView, 
  setCurrentView, 
  onLogout 
}) {
  const [academicDropdownOpen, setAcademicDropdownOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const dropdownRef = React.useRef(null);
  const profileRef = React.useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAcademicDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'M';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setCurrentView('home')} 
              className="flex items-center space-x-2 text-slate-900 font-bold tracking-tight text-sm uppercase hover:opacity-85 text-left"
            >
              <span className="w-7 h-7 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
                ITSN
              </span>
              <span className="hidden sm:inline font-semibold">STUDENTS PORTAL</span>
            </button>

            {/* Menu Links */}
            <nav className="flex items-center space-x-1 sm:space-x-2 text-xs font-medium">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
                  currentView === 'home'
                    ? 'bg-slate-100 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>HOME</span>
              </button>

              {/* Data Akademik Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAcademicDropdownOpen(!academicDropdownOpen)}
                  className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
                    currentView === 'khs' || currentView === 'krs'
                      ? 'bg-slate-100 text-blue-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>DATA AKADEMIK</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${academicDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {academicDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-md py-1 z-50">
                    <button
                      onClick={() => {
                        setCurrentView('krs');
                        setAcademicDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        currentView === 'krs' ? 'font-semibold text-blue-900 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>Kartu Rencana Studi (KRS)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                        Aktif
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('khs');
                        setAcademicDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        currentView === 'khs' ? 'font-semibold text-blue-900 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>Kartu Hasil Studi (KHS)</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Sem. 1-6
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right section: Semester & User Profile */}
          <div className="flex items-center space-x-4">
            
            {/* Active Semester Tag */}
            <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{student.currentSemesterName}</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 py-1 px-1.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-semibold text-xs flex items-center justify-center">
                  {getInitials(student.name)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-xs font-mono font-semibold text-slate-800 leading-tight">
                    {student.nim}
                  </span>
                  <span className="block text-[10px] text-slate-500 truncate max-w-[120px]">
                    {student.name}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded shadow-md py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{student.name}</p>
                    <p className="text-xs font-mono text-slate-500">{student.nim}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{student.studyProgram}</p>
                    <p className="text-[11px] text-slate-400">Angkatan {student.cohort}</p>
                  </div>
                  <div className="px-2 pt-1">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Sub-header Breadcrumb line (sesuai Screenshot 2) */}
      <div className="bg-slate-50 border-t border-slate-200 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700">
              {currentView === 'home' ? 'HOME' : currentView === 'khs' ? 'KARTU HASIL STUDI' : 'KARTU RENCANA STUDI'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-900 uppercase">{student.name}</span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-slate-600">{student.nim}</span>
          </div>
          <div className="hidden sm:block text-[11px] text-slate-500">
            Dosen Wali: <span className="font-medium text-slate-700">{student.advisor}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
