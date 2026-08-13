import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, KeyRound, LogIn, LogOut, UserCheck, 
  BookOpen, QrCode, Shield, GraduationCap, Users, Star, ChevronDown, Menu, X
} from 'lucide-react';

export const Navbar = ({ onOpenJoinModal }) => {
  const { user, profile, role, logout, switchRole, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const getRolePath = (r) => {
    switch (r) {
      case 'admin': return '/admin';
      case 'teacher': return '/teacher';
      case 'student': return '/student';
      case 'parent': return '/parent';
      default: return '/';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#40c7b1] shadow-md border-b border-teal-400/30 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO EDUNBN */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="text-3xl font-black tracking-tight text-white font-sans drop-shadow-sm flex items-center gap-1">
              <span className="inline-block w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse"></span>
              edunbn
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold text-teal-100 bg-teal-800/30 px-2 py-0.5 rounded-full">
              Lớp Học Cô Lê Thị Thanh Hương
            </span>
          </Link>

          {/* MAIN DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-teal-50">
            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <Link to="/student" className="hover:text-white transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Kho bài giảng & Game
            </Link>
            <button 
              onClick={() => onOpenJoinModal ? onOpenJoinModal() : navigate('/join-class')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <QrCode className="w-4 h-4" />
              Vào lớp bằng Mã/QR
            </button>
          </nav>
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Quick Demo Switcher */}
          <div className="relative">
            <button 
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-teal-700/40 hover:bg-teal-700/60 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-300/40 flex items-center gap-1.5 transition-all"
              title="Chuyển đổi vai trò trải nghiệm nhanh"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Demo Role: <strong className="text-amber-200 capitalize">{role || 'GUEST'}</strong></span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-xl border border-teal-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Thử nghiệm 4 Vai Trò
                </div>
                <button 
                  onClick={() => { loginAsDemo('student'); navigate('/student'); setRoleDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-teal-50 flex items-center gap-2 font-medium text-slate-700"
                >
                  <GraduationCap className="w-4 h-4 text-blue-500" /> Học Sinh (Lớp 1-5)
                </button>
                <button 
                  onClick={() => { loginAsDemo('teacher'); navigate('/teacher'); setRoleDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-teal-50 flex items-center gap-2 font-medium text-slate-700"
                >
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Giáo Viên
                </button>
                <button 
                  onClick={() => { loginAsDemo('parent'); navigate('/parent'); setRoleDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-teal-50 flex items-center gap-2 font-medium text-slate-700"
                >
                  <Users className="w-4 h-4 text-purple-500" /> Phụ Huynh
                </button>
                <button 
                  onClick={() => { loginAsDemo('admin'); navigate('/admin'); setRoleDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-teal-50 flex items-center gap-2 font-medium text-slate-700"
                >
                  <Shield className="w-4 h-4 text-amber-500" /> Quản Trị Viên (Admin)
                </button>
              </div>
            )}
          </div>

          {/* Quick Join Button Pill */}
          <button
            onClick={() => onOpenJoinModal ? onOpenJoinModal() : navigate('/join-class')}
            className="bg-teal-600/60 hover:bg-teal-700/70 text-white font-bold text-sm px-4 py-2 rounded-full border border-teal-200/40 flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            Nhập mã
          </button>

          {/* User Status / Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-3 pl-2">
              <Link 
                to={getRolePath(role)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full border border-white/30 transition-all"
              >
                <img 
                  src={profile?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'} 
                  alt="Avatar" 
                  className="w-7 h-7 rounded-full bg-white object-cover border border-white"
                />
                <span className="text-sm font-bold max-w-[120px] truncate">{profile?.full_name || 'Người dùng'}</span>
                {profile?.total_stars > 0 && (
                  <span className="bg-amber-400 text-slate-900 text-xs font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-900" />
                    {profile.total_stars}
                  </span>
                )}
              </Link>

              <button
                onClick={() => { logout(); navigate('/'); }}
                className="bg-white/10 hover:bg-red-500/80 text-white p-2 rounded-full transition-all"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth?mode=login"
                className="bg-white text-[#36b3a0] hover:bg-teal-50 font-bold text-sm px-5 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </Link>

              <Link
                to="/auth?mode=signup"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm px-5 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5 transform hover:scale-105"
              >
                <UserCheck className="w-4 h-4" />
                Đăng ký ngay
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:bg-teal-600 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#36b3a0] px-4 pt-2 pb-6 space-y-3 border-t border-teal-400/30">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-bold"
          >
            Trang chủ
          </Link>
          <Link 
            to="/student" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-bold"
          >
            Kho bài giảng & Game
          </Link>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenJoinModal ? onOpenJoinModal() : navigate('/join-class'); }}
            className="w-full text-left py-2 text-amber-200 font-bold flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4" /> Vào lớp bằng Mã QR / Code
          </button>
          
          <div className="pt-3 border-t border-teal-400/40">
            <p className="text-xs font-bold text-teal-100 uppercase mb-2">Thử nghiệm vai trò:</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { loginAsDemo('student'); navigate('/student'); setMobileMenuOpen(false); }} className="bg-teal-700/50 py-1.5 px-3 rounded-lg text-xs font-bold text-white text-left">Học sinh</button>
              <button onClick={() => { loginAsDemo('teacher'); navigate('/teacher'); setMobileMenuOpen(false); }} className="bg-teal-700/50 py-1.5 px-3 rounded-lg text-xs font-bold text-white text-left">Giáo viên</button>
              <button onClick={() => { loginAsDemo('parent'); navigate('/parent'); setMobileMenuOpen(false); }} className="bg-teal-700/50 py-1.5 px-3 rounded-lg text-xs font-bold text-white text-left">Phụ huynh</button>
              <button onClick={() => { loginAsDemo('admin'); navigate('/admin'); setMobileMenuOpen(false); }} className="bg-teal-700/50 py-1.5 px-3 rounded-lg text-xs font-bold text-white text-left">Quản trị viên</button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {user ? (
              <button onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }} className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full w-full">Đăng xuất</button>
            ) : (
              <div className="flex gap-2 w-full">
                <Link to="/auth?mode=login" onClick={() => setMobileMenuOpen(false)} className="bg-white text-[#36b3a0] text-center font-bold px-4 py-2 rounded-full flex-1">Đăng nhập</Link>
                <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)} className="bg-amber-400 text-slate-900 text-center font-bold px-4 py-2 rounded-full flex-1">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
