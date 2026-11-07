import React from 'react';
import { User, LogIn, AlertCircle, Info, Lock } from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [nim, setNim] = React.useState('202303039');
  const [password, setPassword] = React.useState('password123');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!nim.trim()) {
      setError('Nomor Induk Mahasiswa (NIM) wajib diisi.');
      return;
    }
    if (!password) {
      setError('Kata sandi wajib diisi.');
      return;
    }

    setLoading(true);

    // Mock autentikasi login
    setTimeout(() => {
      setLoading(false);
      if (nim.trim() === '202303039' && password === 'password123') {
        onLoginSuccess({
          nim: '202303039',
          name: 'Jason Bernard Adrianto'
        });
      } else {
        setError('Kombinasi NIM atau kata sandi tidak cocok. Gunakan NIM: 202303039 dan Sandi: password123');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top institution bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center font-bold text-sm tracking-wider text-white">
              ITSN
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide uppercase">Institut Teknologi & Sains Nusantara</h1>
              <p className="text-xs text-slate-400">Sistem Informasi Akademik Terpadu (SIAKAD)</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Tahun Ajaran: Gasal 2026/2027
          </div>
        </div>
      </header>

      {/* Main hero & login card */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Sisi Kiri: Form Login */}
          <div className="p-8 md:col-span-5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="mb-6">
              <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-900 bg-blue-50 rounded">
                Portal Mahasiswa
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">Masuk ke Akun Anda</h2>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan NIM dan kata sandi yang telah terdaftar di BAAK.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Induk Mahasiswa (NIM)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 202303039"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-medium text-sm rounded shadow-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk Portal</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-slate-500 text-xs">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Akun demo aktif: NIM <strong className="font-mono text-slate-700">202303039</strong> / Sandi <strong className="font-mono text-slate-700">password123</strong>.
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Kampus Landmark & Info Ringkas */}
          <div className="p-8 md:col-span-7 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-800/80 text-blue-200 rounded mb-4">
                Informasi Periode Berjalan
              </div>
              <h3 className="text-xl font-bold leading-snug">
                Pendaftaran & Perubahan Kartu Rencana Studi (KRS) Semester Gasal 2026/2027 Telah Dibuka
              </h3>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Batas akhir pengisian dan persetujuan dosen wali: <strong>12 November 2026, 23.59 WIB</strong>. Mahasiswa diharapkan memeriksa riwayat KHS semester terdahulu dan memastikan tidak ada tanggungan administrasi.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
              <div className="bg-slate-800/60 p-3 rounded border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Jadwal Ujian UTS</span>
                <span className="text-sm font-semibold text-slate-100">09 – 13 Nov 2026</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Status Server</span>
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Operasional Normal
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        © 2026 Institut Teknologi & Sains Nusantara. Sistem Informasi Akademik Prototipe.
      </footer>
    </div>
  );
}
