import React from 'react';
import Navbar from './components/common/Navbar';
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import KhsView from './views/KhsView';
import KrsView from './views/KrsView';
import RagChatWidget from './components/ai/RagChatWidget';
import { MOCK_STUDENT, MOCK_KHS_DATA } from './data/mockAcademicData';

export default function App() {
  // Session authentication state (mock)
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  const [currentView, setCurrentView] = React.useState('home'); // 'home' | 'khs' | 'krs'
  const [student, setStudent] = React.useState(MOCK_STUDENT);

  const handleLoginSuccess = (loginData) => {
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Sticky Navigation Bar */}
      <Navbar
        student={student}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'home' && (
          <HomeView student={student} khsData={MOCK_KHS_DATA} />
        )}
        {currentView === 'khs' && (
          <KhsView student={student} khsData={MOCK_KHS_DATA} />
        )}
        {currentView === 'krs' && (
          <KrsView student={student} />
        )}
      </main>

      {/* Floating AI RAG Assistant */}
      <RagChatWidget student={student} />

      {/* App Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>© 2026 Institut Teknologi & Sains Nusantara (ITSN) — Portal Mahasiswa</span>
          <span className="font-mono text-[11px] text-slate-400">Versi Prototipe Frontend 1.0</span>
        </div>
      </footer>
    </div>
  );
}
