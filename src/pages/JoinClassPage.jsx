import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, CheckCircle2, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { getStoredData, setStoredData, supabase, isSupabaseConfigured } from '../lib/supabase';

export const JoinClassPage = () => {
  const [searchParams] = useSearchParams();
  const codeParam = searchParams.get('code') || '';
  const navigate = useNavigate();

  const { profile, addStars } = useAuth();
  const [code, setCode] = useState(codeParam.toUpperCase());
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [joinedClass, setJoinedClass] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (codeParam) {
      handleJoin(codeParam.toUpperCase());
    }
  }, [codeParam]);

  const handleJoin = async (targetCode) => {
    if (!targetCode || targetCode.length !== 6) {
      setErrorMsg('Mã lớp học phải có 6 ký tự (VD: A8K2P9)');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    let foundClass = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error: dbErr } = await supabase
          .from('classes')
          .select('*')
          .eq('code', targetCode)
          .single();

        if (data && !dbErr) {
          foundClass = data;
        }
      } catch (err) {
        console.warn('Supabase fetch class error:', err);
      }
    }

    if (!foundClass) {
      const storedClasses = getStoredData('classes_list', [
        { id: 'class-1', name: 'Lớp 3A1 - Toán Học Vui', code: 'A8K2P9', grade_level: 3, teacher_name: 'Cô Nguyễn Thị Hoa' },
        { id: 'class-2', name: 'Lớp 1B - Tiếng Việt Khám Phá', code: 'V8M4K1', grade_level: 1, teacher_name: 'Cô Nguyễn Thị Hoa' }
      ]);
      foundClass = storedClasses.find(c => c.code === targetCode);
    }

    if (foundClass) {
      setJoinedClass(foundClass);
      setStatus('success');
      addStars(10);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

      const joined = getStoredData('joined_classes', []);
      if (!joined.some(c => c.id === foundClass.id)) {
        setStoredData('joined_classes', [...joined, foundClass]);
      }
    } else {
      setErrorMsg(`Không tìm thấy Lớp học nào tương ứng với mã "${targetCode}".`);
      setStatus('error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleJoin(code);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF8]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-teal-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-edulive-gradient p-8 text-white text-center relative">
            <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-1.5 bg-white/20 rounded-full hover:bg-white/30 text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-3">
              <KeyRound className="w-7 h-7 text-amber-300" />
            </div>
            <h2 className="text-2xl font-black font-sans">Tham Gia Lớp Học</h2>
            <p className="text-xs text-teal-100 mt-1">Quét mã QR Code thành công từ thiết bị di động</p>
          </div>

          {/* Body */}
          <div className="p-8">
            {status === 'success' && joinedClass ? (
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800">Chúc Mừng Bạn!</h3>
                  <p className="text-sm font-extrabold text-[#36b3a0] bg-teal-50 py-1.5 px-4 rounded-full inline-block">
                    {joinedClass.name}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold">
                    Khối Lớp {joinedClass.grade_level} • Mã Lớp: {joinedClass.code}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-sm pt-2">
                    <Sparkles className="w-4 h-4 fill-amber-400" /> Nhận ngay +10 Sao Thưởng!
                  </div>
                </div>

                <button
                  onClick={() => navigate('/student')}
                  className="w-full btn-edumint py-3 text-base font-extrabold"
                >
                  Vào Cổng Học Sinh & Chơi Game
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-2 text-center">
                    Nhập mã 6 ký tự từ Giáo viên (Ví dụ: A8K2P9)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="A8K2P9"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full text-center text-3xl font-mono font-black py-3 px-4 rounded-2xl border-2 border-teal-200 focus:border-[#40c7b1] outline-none uppercase tracking-widest text-slate-800 bg-amber-50/50"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || code.length < 6}
                  className="w-full btn-edumint py-3 text-base font-extrabold shadow-md disabled:opacity-50"
                >
                  {status === 'loading' ? 'Đang kiểm tra...' : 'Xác Nhận Gia Nhập Lớp'}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
