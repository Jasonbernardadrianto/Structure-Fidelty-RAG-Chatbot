import React from 'react';
import { 
  Bot, 
  X, 
  Send, 
} from 'lucide-react';
import { MOCK_RAG_FAQ, MOCK_KHS_DATA } from '../../data/mockAcademicData';
import { calculateSemesterGPA, calculateCumulativeGPA, getGradeWeight, getMaxKrsCredits, getGraduationPredicate } from '../../utils/academicCalculations';

// Jumlah pesan terakhir yang dikirim sebagai riwayat saat toggle "Ingat percakapan" aktif
const MAX_HISTORY_MESSAGES = 6;
// Batas waktu tunggu respons backend sebelum beralih ke Mode Offline
const API_TIMEOUT_MS = 45000;

/**
 * Menyusun data akademik mahasiswa (profil + ringkasan + KHS per semester) untuk dikirim ke backend LLM.
 * Seluruh angka (IPS, IPK, total SKS, batas SKS KRS) dihitung di sini dengan fungsi resmi,
 * sehingga LLM tidak perlu (dan dilarang) menghitung ulang.
 * Catatan: MOCK_KHS_DATA tersusun dari semester TERBARU ke TERLAMA, maka dibalik agar Semester 1 = paling awal.
 */
function buildStudentContext(student) {
  const chronological = [...MOCK_KHS_DATA].reverse();
  const semesters = chronological.map((sem, idx) => {
    const stats = calculateSemesterGPA(sem.courses);
    return {
      semesterNumber: idx + 1,
      semesterName: sem.semesterName,
      ips: stats.ips.toFixed(2),
      totalSks: stats.totalSks,
      totalQuality: stats.totalQuality,
      courses: sem.courses.map(c => ({
        code: c.code,
        name: c.name,
        sks: c.sks,
        grade: c.grade,
        lecturer: (c.lecturer || '').split('\n')[0],
      })),
    };
  });

  const cumulative = calculateCumulativeGPA(semesters);
  const allCourses = semesters.flatMap(s => s.courses);
  const gradeDistribution = {};
  [...allCourses]
    .sort((a, b) => getGradeWeight(b.grade) - getGradeWeight(a.grade))
    .forEach(c => { gradeDistribution[c.grade] = (gradeDistribution[c.grade] || 0) + 1; });
  const lastIps = semesters.length ? Number(semesters[semesters.length - 1].ips) : 0;

  return {
    profile: {
      name: student.name,
      nim: student.nim,
      studyProgram: student.studyProgram,
      cohort: student.cohort,
      status: student.status,
      currentSemesterName: student.currentSemesterName,
      advisor: student.advisor,
      hasFinancialHold: student.hasFinancialHold,
    },
    summary: {
      ipk: cumulative.gpa.toFixed(2),
      totalSks: cumulative.cumulativeSks,
      totalCourses: allCourses.length,
      graduationPredicate: getGraduationPredicate(cumulative.gpa),
      lastIps: lastIps.toFixed(2),
      maxKrsCredits: getMaxKrsCredits(lastIps),
      gradeDistribution,
    },
    // totalQuality hanya dibutuhkan untuk menghitung IPK, tidak perlu dikirim ke LLM
    semesters: semesters.map(sem => ({
      semesterNumber: sem.semesterNumber,
      semesterName: sem.semesterName,
      ips: sem.ips,
      totalSks: sem.totalSks,
      courses: sem.courses,
    })),
  };
}

/**
 * [MODE OFFLINE SAJA] Menganalisis pertanyaan yang berhubungan dengan data KHS personal mahasiswa.
 * Hanya dipakai jika backend LLM tidak dapat dihubungi. Jawaban yang dihasilkan diberi label "[Mode Offline]".
 * Mengembalikan jawaban berbasis data akademik jika cocok, atau null jika bukan pertanyaan data personal.
 * 
 * URUTAN PRIORITAS (penting — handler lebih spesifik harus dicek lebih dulu):
 *   [1] Cum Laude / Predikat kelulusan (karena sering mengandung kata "nilai" juga)
 *   [2] Pencarian matakuliah berdasarkan nilai tertentu (bernilai AB, nilai A, dll)
 *   [3] IPK / rekap kumulatif
 *   [4] IPS semester tertentu
 *   [5] Distribusi nilai (semua matakuliah)
 */
function handlePersonalAcademicQuery(query, student) {
  const lower = query.toLowerCase();

  // Flatten semua course dari seluruh semester
  const allCourses = MOCK_KHS_DATA.flatMap(sem =>
    sem.courses.map(c => ({ ...c, semester: sem.semesterName }))
  );

  // [1] Cek apakah Cum Laude eligible — HARUS PERTAMA karena user sering menyebut "nilai C" di dalamnya
  if (lower.match(/cum\s*laude|pujian|predikat\s*(saya|kelulusan|lulus)|apakah.*(lulus|eligible).*pujian|lulus\s*dengan.*pujian|eligible\s*cum/i)) {
    const semData = MOCK_KHS_DATA.map(sem => {
      const stats = calculateSemesterGPA(sem.courses);
      return stats;
    });
    const cumulative = calculateCumulativeGPA(semData);
    const coursesWithC = allCourses.filter(c => ['C', 'CD'].includes(c.grade));
    const coursesWithD = allCourses.filter(c => c.grade === 'D');
    const hasLowGrades = coursesWithC.length > 0 || coursesWithD.length > 0;
    const ipkAbove = cumulative.gpa > 3.50;

    let result = `Analisis Kelayakan Predikat "Dengan Pujian (Cum Laude)" untuk ${student.name}:\n\n`;
    result += `IPK Saat Ini: ${cumulative.gpa.toFixed(2)} ${ipkAbove ? '✓ (> 3.50)' : '✗ (belum mencapai > 3.50)'}\n`;

    if (coursesWithC.length > 0) {
      result += `Nilai C/CD Ditemukan: ${coursesWithC.length} MK ✗\n`;
      coursesWithC.forEach(c => {
        result += `  - ${c.code} ${c.name}: ${c.grade} (${c.semester})\n`;
      });
    } else {
      result += `Nilai C/CD: Tidak ada ✓\n`;
    }

    if (coursesWithD.length > 0) {
      result += `Nilai D Ditemukan: ${coursesWithD.length} MK ✗\n`;
      coursesWithD.forEach(c => {
        result += `  - ${c.code} ${c.name}: ${c.grade} (${c.semester})\n`;
      });
    } else {
      result += `Nilai D: Tidak ada ✓\n`;
    }

    result += `\nKesimpulan (Berdasarkan Hal. 39 Butir m): `;
    if (ipkAbove && !hasLowGrades) {
      result += `Anda MEMENUHI syarat predikat Dengan Pujian, dengan catatan masa studi tidak melebihi 4 tahun (S1).`;
    } else {
      const reasons = [];
      if (!ipkAbove) reasons.push(`IPK belum > 3.50`);
      if (hasLowGrades) reasons.push(`masih terdapat nilai C/CD/D`);
      result += `Anda BELUM memenuhi syarat Cum Laude karena: ${reasons.join(' dan ')}.`;
    }

    // Jika user menyebutkan skenario "pernah mengulang dan mendapat C" — jawab secara eksplisit
    if (lower.includes('mengulang') || lower.includes('mendapat c') || lower.includes('nilai c') || lower.includes('pernah c')) {
      result += `\n\nCatatan: Berdasarkan Pedoman (Hal. 39 butir m), predikat Dengan Pujian mensyaratkan TIDAK ADA nilai C maupun D pada seluruh transkrip akhir. Jika Anda pernah mengulang dan nilai akhir yang tercatat adalah C, maka Anda TIDAK memenuhi syarat Cum Laude, meskipun IPK > 3.50.`;
    }

    return result;
  }

  // [2] Cek matakuliah dengan nilai tertentu (misal: "bernilai AB", "nilai A", "mendapat B")
  const gradeSearchMatch = lower.match(/(?:bernilai|mendapat|dapat|grade)\s+(a|ab|b|bc|c|cd|d|e)\b/i)
    || lower.match(/\bmatakuliah.+nilai\s+(a|ab|b|bc|c|cd|d|e)\b/i)
    || lower.match(/\bmk.+nilai\s+(a|ab|b|bc|c|cd|d|e)\b/i)
    || lower.match(/\bnilai\s+(ab|bc|cd)\b/i)  // Nilai AB/BC/CD lebih spesifik, tidak ambigú
    || lower.match(/\bcek.+(?:bernilai|nilai)\s+(a|ab|b|bc|c|cd|d|e)\b/i);
  if (gradeSearchMatch) {
    const targetGrade = gradeSearchMatch[1].toUpperCase();
    const matchingCourses = allCourses.filter(c => c.grade === targetGrade);
    if (matchingCourses.length > 0) {
      const courseList = matchingCourses.map((c, i) =>
        `${i + 1}. ${c.code} - ${c.name} (${c.sks} SKS, Semester: ${c.semester}, Dosen: ${c.lecturer.split('\n')[0]})`
      ).join('\n');
      return `Berdasarkan data KHS Anda (${student.name}, NIM ${student.nim}), berikut daftar mata kuliah dengan nilai ${targetGrade}:\n\n${courseList}\n\nTotal: ${matchingCourses.length} mata kuliah bernilai ${targetGrade}.`;
    } else {
      return `Berdasarkan data KHS Anda, tidak ditemukan mata kuliah dengan nilai ${targetGrade} di seluruh semester (1 s.d. 6).`;
    }
  }

  // [3] Cek pertanyaan IPK / IP kumulatif / rekap nilai
  if (lower.match(/\b(ipk|ip kumulatif|rekap nilai|ringkasan akademik|total sks)\b/)) {
    const semData = MOCK_KHS_DATA.map(sem => {
      const stats = calculateSemesterGPA(sem.courses);
      return { ...stats, name: sem.semesterName };
    });
    const cumulative = calculateCumulativeGPA(semData);
    const semDetail = [...semData].reverse().map((s, i) =>
      `Sem. ${i + 1} (${s.name}): IPS ${s.ips.toFixed(2)}, ${s.totalSks} SKS`
    ).join('\n');
    return `Rekap Akademik ${student.name} (NIM: ${student.nim}):\n\nIP Kumulatif (IPK): ${cumulative.gpa.toFixed(2)}\nTotal SKS Lulus: ${cumulative.cumulativeSks} SKS\nTotal Angka Kualitas: ${cumulative.cumulativeQuality.toFixed(1)}\n\nRincian per semester:\n${semDetail}`;
  }

  // [4] Cek pertanyaan IPS semester tertentu
  const semesterMatch = lower.match(/(?:ips|ip semester|nilai semester)\s*(?:(\d+)|terakhir|lalu)/);
  if (semesterMatch) {
    const reversed = [...MOCK_KHS_DATA].reverse(); // chronological
    let targetIdx;
    if (semesterMatch[1]) {
      targetIdx = parseInt(semesterMatch[1]) - 1;
    } else {
      targetIdx = reversed.length - 1; // "terakhir"
    }
    if (targetIdx >= 0 && targetIdx < reversed.length) {
      const sem = reversed[targetIdx];
      const stats = calculateSemesterGPA(sem.courses);
      const courseDetail = sem.courses.map(c =>
        `  ${c.code} ${c.name}: ${c.grade} (Bobot ${c.weight}, Kualitas ${(c.sks * c.weight).toFixed(1)})`
      ).join('\n');
      return `Data KHS Semester ${targetIdx + 1} (${sem.semesterName}):\n\n${courseDetail}\n\nTotal SKS: ${stats.totalSks}\nTotal Kualitas: ${stats.totalQuality.toFixed(1)}\nIP Semester: ${stats.ips.toFixed(2)}`;
    }
  }

  // [5] Cek pertanyaan matakuliah tertentu (distribusi nilai)
  if (lower.match(/\b(mata\s*kuliah|matkul|mk|kode)\b/) && lower.match(/\b(apa|berapa|nilai|daftar|list|semua)\b/)) {
    const totalMK = allCourses.length;
    const gradeCount = {};
    allCourses.forEach(c => {
      gradeCount[c.grade] = (gradeCount[c.grade] || 0) + 1;
    });
    const gradeBreakdown = Object.entries(gradeCount)
      .sort((a, b) => getGradeWeight(b[0]) - getGradeWeight(a[0]))
      .map(([g, count]) => `  ${g}: ${count} mata kuliah`)
      .join('\n');
    return `Distribusi nilai seluruh mata kuliah Anda (${totalMK} MK, Semester 1-6):\n\n${gradeBreakdown}\n\nAnda dapat bertanya lebih spesifik, misal: "matakuliah bernilai AB" atau "nilai semester 3".`;
  }

  return null; // Bukan pertanyaan data personal
}

/**
 * Pencocokan FAQ berbasis skor relevansi (bukan sekadar first-match).
 * Menghitung berapa banyak kata kunci yang cocok, memilih yang tertinggi.
 */
function matchFaqByRelevanceScore(query) {
  const lower = query.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const faq of MOCK_RAG_FAQ) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (lower.includes(keyword)) {
        // Kata kunci lebih panjang = lebih spesifik = skor lebih tinggi
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestMatch;
}


export default function RagChatWidget({ student }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: 'ai',
      text: `Halo ${student.name.split(' ')[0]}! Saya Asisten AI Akademik ITSN. Saya bisa menjawab pertanyaan tentang:\n• Aturan KRS, batas SKS, dan jadwal\n• Status cekal/keuangan\n• Syarat skripsi & kelulusan\n• Data nilai & KHS Anda secara langsung\n\nCoba tanya, misal: "matakuliah bernilai AB" atau "apakah saya eligible Cum Laude?"`,
      time: 'Baru saja'
    }
  ]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  // Default OFF: setiap pertanyaan berdiri sendiri. Jika ON, 6 pesan terakhir ikut dikirim ke LLM.
  const [useHistory, setUseHistory] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const studentContext = React.useMemo(() => buildStudentContext(student), [student]);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: nowTime()
    };

    // Riwayat diambil SEBELUM pesan baru ditambahkan (pesan sambutan id=1 tidak ikut)
    const history = useHistory
      ? messages
          .filter(m => m.id !== 1)
          .slice(-MAX_HISTORY_MESSAGES)
          .map(m => ({ role: m.sender === 'user' ? 'user' : 'ai', text: m.text }))
      : null;

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setIsTyping(true);

    // [Langkah 1] Semua pertanyaan dikirim ke backend SF-RAG + Gemini, bersama data KHS mahasiswa
    let backendError = null;
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          method: 'sfrag', // Selalu jalur Structure-Fidelity, bukan baseline naive chunking
          top_k: 4,
          student_context: studentContext,
          history,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.answer,
          sources: data.sources || [],
          model: data.model,
          isFallback: !!data.is_fallback,
          time: nowTime()
        }]);
        setIsTyping(false);
        return;
      }
      backendError = `HTTP ${response.status}`;
    } catch (err) {
      backendError = err.name === 'AbortError' ? 'timeout' : 'server tidak dapat dihubungi';
    }

    // [Langkah 2] MODE OFFLINE: backend mati -> rule-based KHS lalu FAQ lokal, diberi label jelas
    const offlinePrefix = `[Mode Offline - backend AI ${backendError}. Jawaban di bawah berasal dari aturan statis, bukan model AI]\n\n`;
    const personalAnswer = handlePersonalAcademicQuery(userText, student);
    const bestFaq = personalAnswer ? null : matchFaqByRelevanceScore(userText);
    const replyText = personalAnswer
      || (bestFaq
        ? bestFaq.reply
        : "Informasi tersebut belum tersedia dalam basis pengetahuan saya. Anda dapat menghubungi BAAK (Biro Administrasi Akademik) atau Biro Kemahasiswaan untuk konfirmasi lebih lanjut.");

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'ai',
      text: offlinePrefix + replyText,
      model: 'offline',
      isFallback: true,
      time: nowTime()
    }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 no-print">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white p-3.5 rounded-full shadow-lg flex items-center space-x-2 transition duration-200 cursor-pointer border border-blue-800"
          title="Chat dengan Asisten AI"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs font-semibold pr-1">Tanya AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-80 sm:w-96 flex flex-col h-[480px] overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-blue-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span>Asisten AI Akademik</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">Pedoman SYS 2025 + Data KHS</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded p-2.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5 px-1">
                  {m.time}
                  {m.sender === 'ai' && m.model && (
                    <span className={m.isFallback ? 'text-amber-600' : 'text-emerald-600'}>
                      {' · '}{m.model}
                    </span>
                  )}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs italic px-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                <span className="text-[10px] ml-1">AI sedang menganalisis...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center space-x-1 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInputMessage("matakuliah bernilai AB")}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap cursor-pointer"
            >
              Nilai AB?
            </button>
            <button
              onClick={() => setInputMessage("apakah saya eligible Cum Laude?")}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap cursor-pointer"
            >
              Cum Laude?
            </button>
            <button
              onClick={() => setInputMessage("Berapa batas SKS KRS saya?")}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap cursor-pointer"
            >
              Batas SKS?
            </button>
            <button
              onClick={() => setInputMessage("rekap nilai semua semester")}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap cursor-pointer"
            >
              Rekap IPK
            </button>
          </div>

          {/* Toggle Riwayat Percakapan (default OFF) */}
          <label className="px-3 py-1 bg-white border-t border-slate-100 flex items-center space-x-1.5 text-[10px] text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useHistory}
              onChange={(e) => setUseHistory(e.target.checked)}
              className="w-3 h-3 accent-blue-900 cursor-pointer"
            />
            <span>Ingat percakapan ({MAX_HISTORY_MESSAGES} pesan terakhir)</span>
          </label>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-200 bg-white flex items-center space-x-1.5">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanya aturan akademik atau data nilai Anda..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white p-2 rounded cursor-pointer transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
