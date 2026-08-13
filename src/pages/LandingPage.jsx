import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, Sparkles, KeyRound, QrCode, BookOpen, Trophy, Star, 
  Gamepad2, Users, CheckCircle2, ArrowRight, Layers 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { JoinClassModal } from '../components/student/JoinClassModal';
import { InteractiveGameModal } from '../components/student/InteractiveGameModal';
import { INITIAL_MOCK_MATERIALS } from '../lib/supabase';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const gameShowcaseList = [
    {
      id: 'mat-1',
      title: "Tạo trò chơi 'Đào vàng' cho bài giảng tương tác trên EduNBN",
      type: 'game_html5',
      game_type: 'gold_miner',
      thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      grade_level: 3,
      tag: 'Toán học'
    },
    {
      id: 'mat-2',
      title: "Tạo trò chơi 'Đập chuột' cho bài giảng tương tác trên EduNBN",
      type: 'game_html5',
      game_type: 'whack_mole',
      thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      grade_level: 2,
      tag: 'Tiếng Việt'
    },
    {
      id: 'mat-3',
      title: "Tạo trò chơi 'Giải ô chữ' cho bài giảng tương tác trên EduNBN",
      type: 'game_html5',
      game_type: 'crossword',
      thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
      grade_level: 4,
      tag: 'Tiếng Anh'
    },
    {
      id: 'mat-4',
      title: "Tạo trò chơi 'Ai là triệu phú' cho bài giảng tương tác trên EduNBN",
      type: 'game_html5',
      game_type: 'millionaire',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
      grade_level: 5,
      tag: 'Tự nhiên & Xã hội'
    },
    {
      id: 'mat-5',
      title: "Tạo trò chơi 'Sắp xếp chữ cái' cho bài giảng tương tác trên EduNBN",
      type: 'game_html5',
      game_type: 'word_scramble',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      grade_level: 1,
      tag: 'Tiếng Việt'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF8]">
      <Navbar onOpenJoinModal={() => setJoinModalOpen(true)} />

      {/* HERO SECTION - EDUNBN THEME */}
      <section className="bg-edulive-gradient text-white pt-10 pb-20 relative overflow-hidden">
        {/* Subtle background decoration shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-5 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-teal-800/30 border border-teal-200/30 px-4 py-1.5 rounded-full text-xs font-bold text-teal-100">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Lớp Học Cô Lê Thị Thanh Hương - Đức Lập - Lâm Đồng
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-sans">
                Game hóa bài giảng siêu đơn giản
              </h1>

              <p className="text-base sm:text-lg text-teal-50 font-medium leading-relaxed max-w-2xl">
                Biến mọi ý tưởng thành các bài giảng tương tác với 1000+ mẫu bài giảng sinh động thiết kế riêng cho học sinh Tiểu học trên EduNBN.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="bg-white text-[#36b3a0] hover:bg-teal-50 font-black text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Soạn giảng miễn phí
                </button>

                <button
                  onClick={() => navigate('/student')}
                  className="btn-eduyellow font-black text-base px-8 py-3.5 rounded-full shadow-lg"
                >
                  <Play className="w-5 h-5 fill-slate-900" />
                  Khám phá kho bài giảng
                </button>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-teal-300/30 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-white">1,000+</div>
                  <div className="text-xs text-teal-100 font-semibold">Bài giảng tương tác</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-300">50,000+</div>
                  <div className="text-xs text-teal-100 font-semibold">Học sinh hăng hái</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-xs text-teal-100 font-semibold">Không dùng mock data</div>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Device Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="bg-slate-900 p-3 rounded-3xl shadow-2xl border-4 border-teal-300/40">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800">
                    <img 
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80" 
                      alt="Lớp học EduNBN"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl text-slate-900 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-teal-600">GV: Cô Lê Thị Thanh Hương</div>
                        <div className="text-sm font-black">Đào Vàng - Toán Lớp 3</div>
                      </div>
                      <button 
                        onClick={() => setActiveGame(gameShowcaseList[0])}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-900" /> Trải nghiệm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GAME SHOWCASE CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {gameShowcaseList.map((game) => (
            <div 
              key={game.id}
              onClick={() => setActiveGame(game)}
              className="bg-white rounded-2xl p-3 shadow-md hover:shadow-xl transition-all border border-teal-100 group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#36b3a0] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                    {game.tag}
                  </div>
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-3 group-hover:text-[#36b3a0] transition-colors">
                  {game.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>Khối Lớp {game.grade_level}</span>
                <span className="text-[#36b3a0] font-bold group-hover:underline flex items-center gap-0.5">
                  Chơi ngay <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK JOIN CLASS & QR CODE SECTION */}
      <section className="bg-white py-16 border-y border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="bg-teal-50 text-[#36b3a0] text-xs font-extrabold px-3.5 py-1 rounded-full border border-teal-200">
              DÀNH CHO HỌC SINH & PHỤ HUYNH
            </span>
            <h2 className="text-3xl font-black text-slate-800">
              Vào Lớp Học Bằng Mã QR Hoặc Mã 6 Ký Tự
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Không cần đăng nhập phức tạp! Học sinh tiểu học có thể mở máy ảnh quét mã QR trên lớp hoặc nhập mã lớp do Cô Lê Thị Thanh Hương cung cấp để tham gia bài học lập tức.
            </p>
          </div>

          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-teal-50/80 p-4 rounded-3xl border border-teal-200 shadow-sm max-w-xl mx-auto">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-teal-100 text-[#36b3a0]">
              <QrCode className="w-12 h-12" />
            </div>
            <div className="text-left space-y-2 flex-1">
              <h4 className="font-extrabold text-slate-800 text-base">Có mã lớp học từ Giáo viên?</h4>
              <p className="text-xs text-slate-500 font-semibold">Ví dụ: A8K2P9 hoặc quét Camera trên thiết bị di động</p>
              <button
                onClick={() => setJoinModalOpen(true)}
                className="btn-edumint py-2 px-6 text-sm"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                Nhập Mã / Quét QR Ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 ROLES EXPLANATION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-slate-800">Hệ Thống Phân Quyền 4 Vai Trò</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
            Tất cả dữ liệu được đồng bộ trực tiếp qua Supabase Row Level Security (RLS) bảo mật cao.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 space-y-3 border-t-4 border-amber-400">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold text-xl">
              👑
            </div>
            <h3 className="text-lg font-black text-slate-800">Quản Trị Viên (Admin)</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Quản lý toàn bộ danh mục môn học, các tài khoản người dùng, xem báo cáo tổng quan hệ thống và phân quyền.
            </p>
            <Link to="/auth?mode=login" className="text-xs font-bold text-amber-600 flex items-center gap-1 pt-2">
              Truy cập Admin <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 space-y-3 border-t-4 border-[#40c7b1]">
            <div className="w-12 h-12 bg-teal-100 text-[#36b3a0] rounded-2xl flex items-center justify-center font-bold text-xl">
              👩‍🏫
            </div>
            <h3 className="text-lg font-black text-slate-800">Cô Lê Thị Thanh Hương</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Tạo lớp học tự sinh Mã QR, chọn game bài giảng, giao bài tập có hạn chót và gửi nhận xét đánh giá cho từng con.
            </p>
            <Link to="/auth?mode=login" className="text-xs font-bold text-[#36b3a0] flex items-center gap-1 pt-2">
              Cổng Giáo Viên <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 space-y-3 border-t-4 border-blue-500">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">
              🎒
            </div>
            <h3 className="text-lg font-black text-slate-800">Học Sinh (Student)</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Giao diện trực quan phù hợp Lớp 1-5, tham gia lớp bằng QR Code, tích lũy Sao Thưởng & mở khóa Huy hiệu danh giá.
            </p>
            <Link to="/auth?mode=login" className="text-xs font-bold text-blue-600 flex items-center gap-1 pt-2">
              Cổng Học Sinh <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 space-y-3 border-t-4 border-purple-500">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-xl">
              👨‍👩‍👧
            </div>
            <h3 className="text-lg font-black text-slate-800">Phụ Huynh (Parent)</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Nhập Mã Liên Kết (Student Code 8 ký tự) để theo dõi thời lượng học, bảng điểm, sổ liên lạc điện tử từ Giáo viên.
            </p>
            <Link to="/auth?mode=login" className="text-xs font-bold text-purple-600 flex items-center gap-1 pt-2">
              Cổng Phụ Huynh <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* MODALS */}
      <JoinClassModal 
        isOpen={joinModalOpen} 
        onClose={() => setJoinModalOpen(false)} 
        onJoinedSuccess={(classData) => {
          setJoinModalOpen(false);
          navigate('/student');
        }}
      />

      <InteractiveGameModal 
        isOpen={Boolean(activeGame)} 
        onClose={() => setActiveGame(null)} 
        gameMaterial={activeGame} 
      />
    </div>
  );
};
