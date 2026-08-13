import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  LogIn, UserCheck, Shield, GraduationCap, BookOpen, Users, 
  Mail, Lock, User, Sparkles, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [gradeLevel, setGradeLevel] = useState(3);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res?.success) {
          redirectToPortal(role);
        }
      } else {
        const res = await signup({
          email,
          password,
          full_name: fullName,
          role,
          grade_level: gradeLevel
        });
        if (res?.success) {
          redirectToPortal(role);
        }
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập/Đăng ký không thành công. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  const redirectToPortal = (targetRole) => {
    switch (targetRole) {
      case 'admin': navigate('/admin'); break;
      case 'teacher': navigate('/teacher'); break;
      case 'student': navigate('/student'); break;
      case 'parent': navigate('/parent'); break;
      default: navigate('/'); break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF8]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-teal-100 overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-edulive-gradient p-8 text-white text-center relative">
            <Link to="/" className="absolute top-4 left-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="w-14 h-14 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-7 h-7 text-amber-300" />
            </div>
            <h2 className="text-2xl font-black font-sans">
              {mode === 'login' ? 'Đăng Nhập EduNBN' : 'Đăng Ký Tài Khoản Mới'}
            </h2>
            <p className="text-xs text-teal-100 mt-1">
              {mode === 'login' ? 'Nhập thông tin tài khoản để truy cập hệ thống' : 'Chọn vai trò của bạn để bắt đầu trải nghiệm'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 mb-2">
                Chọn Vai Trò (Role)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    role === 'student'
                      ? 'border-[#40c7b1] bg-teal-50 text-[#36b3a0]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-500" /> Học Sinh (1-5)
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    role === 'teacher'
                      ? 'border-[#40c7b1] bg-teal-50 text-[#36b3a0]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Cô Thanh Hương
                </button>

                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    role === 'parent'
                      ? 'border-[#40c7b1] bg-teal-50 text-[#36b3a0]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-purple-500" /> Phụ Huynh
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    role === 'admin'
                      ? 'border-[#40c7b1] bg-teal-50 text-[#36b3a0]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-500" /> Quản Trị Viên
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-sm text-slate-800"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && role === 'student' && (
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Khối Lớp (Grade Level)
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-sm text-slate-800 bg-white"
                >
                  <option value={1}>Lớp 1</option>
                  <option value={2}>Lớp 2</option>
                  <option value={3}>Lớp 3</option>
                  <option value={4}>Lớp 4</option>
                  <option value={5}>Lớp 5</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                Địa chỉ Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-sm text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-sm text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-edumint py-3 text-base font-extrabold shadow-md mt-2"
            >
              {loading 
                ? 'Đang xử lý...' 
                : (mode === 'login' ? 'Đăng Nhập Lập Tức' : 'Đăng Ký Tài Khoản')
              }
            </button>

            {/* Toggle Mode */}
            <div className="text-center pt-2 text-xs text-slate-500 font-semibold">
              {mode === 'login' ? (
                <p>
                  Chưa có tài khoản?{' '}
                  <button 
                    type="button" 
                    onClick={() => setMode('signup')}
                    className="text-[#36b3a0] font-bold hover:underline"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              ) : (
                <p>
                  Đã có tài khoản?{' '}
                  <button 
                    type="button" 
                    onClick={() => setMode('login')}
                    className="text-[#36b3a0] font-bold hover:underline"
                  >
                    Đăng nhập
                  </button>
                </p>
              )}
            </div>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
};
