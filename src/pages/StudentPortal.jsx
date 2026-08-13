import React, { useState, useEffect } from 'react';
import { 
  Star, Trophy, Play, KeyRound, QrCode, Sparkles, Gamepad2, 
  BookOpen, CheckCircle2, Award, Copy, Check 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { JoinClassModal } from '../components/student/JoinClassModal';
import { InteractiveGameModal } from '../components/student/InteractiveGameModal';
import { 
  getStoredData, INITIAL_MOCK_MATERIALS, INITIAL_MOCK_ASSIGNMENTS, INITIAL_MOCK_BADGES 
} from '../lib/supabase';

export const StudentPortal = () => {
  const { profile, addStars } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(profile?.grade_level || 3);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const [joinedClasses, setJoinedClasses] = useState(() => getStoredData('joined_classes', [
    { id: 'class-1', name: 'Lớp 3A1 - Toán Học Vui', code: 'A8K2P9', teacher_name: 'Cô Lê Thị Thanh Hương' }
  ]));

  const [assignments, setAssignments] = useState(() => getStoredData('assignments_list', INITIAL_MOCK_ASSIGNMENTS));
  const [materials, setMaterials] = useState(() => getStoredData('materials_list', INITIAL_MOCK_MATERIALS));
  const [badges] = useState(INITIAL_MOCK_BADGES);

  const studentCode = profile?.student_code || 'ST8K92A1';

  const handleCopyStudentCode = () => {
    navigator.clipboard.writeText(studentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredMaterials = materials.filter(m => !selectedGrade || m.grade_level === selectedGrade);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF8]">
      <Navbar onOpenJoinModal={() => setJoinModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* STUDENT WELCOME & REWARD DASHBOARD CARD */}
        <div className="bg-edulive-gradient rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left z-10">
            <span className="bg-teal-800/40 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full border border-teal-200/30 flex items-center gap-1.5 w-max mx-auto md:mx-0">
              <Sparkles className="w-4 h-4 fill-amber-300" />
              CỔNG HỌC SINH (TIỂU HỌC KHỐI {selectedGrade})
            </span>

            <h1 className="text-3xl sm:text-4xl font-black font-sans">
              Chào {profile?.full_name || 'Học sinh'}! 🎒
            </h1>

            <p className="text-sm text-teal-50 max-w-xl font-semibold">
              Hãy hoàn thành các bài học và trò chơi để tích lũy thật nhiều <strong>Sao Thưởng ⭐</strong> nhé!
            </p>

            {/* Student Code for Parent linking */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-teal-100 font-bold">Mã Liên Kết Với Bố Mẹ:</span>
              <div className="bg-white/20 border border-white/40 px-3 py-1 rounded-full text-xs font-mono font-black tracking-wider text-amber-200 flex items-center gap-2">
                {studentCode}
                <button onClick={handleCopyStudentCode} className="hover:text-white" title="Copy mã học sinh">
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Stars & Badges Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-center space-y-3 min-w-[240px] z-10">
            <div className="text-xs font-bold text-teal-100 uppercase tracking-wider">Tổng Sao Tích Lũy</div>
            <div className="text-4xl font-black text-amber-300 flex items-center justify-center gap-2 drop-shadow-md">
              <Star className="w-9 h-9 fill-amber-300 text-amber-400" />
              {profile?.total_stars || 45}
            </div>
            <button
              onClick={() => setJoinModalOpen(true)}
              className="btn-eduyellow py-2 px-5 text-xs font-black w-full"
            >
              <KeyRound className="w-4 h-4" /> Vào Lớp Bằng Mã/QR
            </button>
          </div>
        </div>

        {/* GRADE FILTER SELECTOR (LỚP 1 - LỚP 5) */}
        <div className="flex items-center justify-between border-b border-teal-200/60 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Kho Bài Học & Trò Chơi Giáo Dục</h2>
            <p className="text-xs text-slate-500 font-semibold">Chọn khối lớp để tìm các trò chơi phù hợp nhất</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-teal-100 shadow-sm">
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                  selectedGrade === g
                    ? 'bg-[#40c7b1] text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:bg-teal-50'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>

        {/* MY JOINED CLASSES */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#36b3a0]" /> Lớp Học Của Tôi ({joinedClasses.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinedClasses.map((cls) => (
              <div key={cls.id} className="glass-card p-5 border-l-4 border-l-[#40c7b1] space-y-2">
                <span className="text-[10px] font-bold bg-teal-100 text-[#36b3a0] px-2.5 py-0.5 rounded-full">
                  Mã Lớp: {cls.code}
                </span>
                <h4 className="text-base font-extrabold text-slate-800">{cls.name}</h4>
                <p className="text-xs text-slate-500 font-semibold">GV: {cls.teacher_name || 'Cô Lê Thị Thanh Hương'}</p>
              </div>
            ))}

            <button
              onClick={() => setJoinModalOpen(true)}
              className="border-2 border-dashed border-teal-300 hover:border-[#40c7b1] rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-2 hover:bg-teal-50/50 transition-all text-slate-600"
            >
              <KeyRound className="w-6 h-6 text-[#36b3a0]" />
              <span className="text-xs font-extrabold text-[#36b3a0]">+ Tham gia Lớp học mới (QR / Code)</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE GAME CATALOG FOR SELECTED GRADE */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-500" /> Trò Chơi Tương Tác Lớp {selectedGrade}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((mat) => (
              <div 
                key={mat.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-teal-100 hover:shadow-xl transition-all space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-36 rounded-2xl bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" 
                      alt="Game"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/50 flex items-center justify-center">
                      <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-slate-900 ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                      Thưởng +15 Sao ⭐
                    </span>
                    <h4 className="text-base font-extrabold text-slate-800 mt-1 group-hover:text-[#36b3a0] transition-colors">
                      {mat.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{mat.description}</p>
                </div>

                <button
                  onClick={() => setActiveGame(mat)}
                  className="w-full btn-eduyellow py-2.5 text-xs font-black"
                >
                  <Play className="w-4 h-4 fill-slate-900" /> Bắt Đầu Chơi Ngay
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BADGES GALLERY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-2xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">Bộ Sưu Tập Huy Hiệu Của Con</h3>
              <p className="text-xs text-slate-500 font-semibold">Mở khóa huy hiệu danh giá khi đạt mốc Sao tương ứng</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {badges.map((b) => {
              const unlocked = (profile?.total_stars || 45) >= b.required_stars;
              return (
                <div 
                  key={b.id} 
                  className={`p-4 rounded-2xl text-center space-y-2 border transition-all ${
                    unlocked 
                      ? 'bg-amber-50/60 border-amber-300 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="text-4xl">{b.icon}</div>
                  <h4 className="text-xs font-extrabold text-slate-800">{b.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {unlocked ? 'Đã mở khóa!' : `Cần ${b.required_stars} Sao`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />

      {/* MODALS */}
      <JoinClassModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinedSuccess={(cls) => setJoinedClasses(prev => [cls, ...prev])}
      />

      <InteractiveGameModal
        isOpen={Boolean(activeGame)}
        onClose={() => setActiveGame(null)}
        gameMaterial={activeGame}
      />
    </div>
  );
};
