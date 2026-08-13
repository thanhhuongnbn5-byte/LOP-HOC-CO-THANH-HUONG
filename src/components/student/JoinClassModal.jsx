import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, QrCode, KeyRound, CheckCircle2, Sparkles, Camera, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured, getStoredData, setStoredData } from '../../lib/supabase';

export const JoinClassModal = ({ isOpen, onClose, onJoinedSuccess }) => {
  const { profile, addStars } = useAuth();
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'scanner'
  const [inputCode, setInputCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successClass, setSuccessClass] = useState(null);

  useEffect(() => {
    let html5QrCode;
    if (isOpen && activeTab === 'scanner') {
      const qrRegionId = "qr-reader-element";
      html5QrCode = new Html5Qrcode(qrRegionId);

      const config = { fps: 10, qrbox: { width: 220, height: 220 } };
      setScanning(true);

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Successfully scanned QR Code
          html5QrCode.stop().then(() => {
            setScanning(false);
            processJoinCode(decodedText);
          }).catch(err => console.error(err));
        },
        () => {
          // Scanning in progress...
        }
      ).catch(err => {
        console.warn('Camera scanning error or permission denied:', err);
        setScanning(false);
        setError('Không thể mở Camera thiết bị. Vui lòng nhập mã lớp thủ công.');
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const processJoinCode = async (rawInput) => {
    setError(null);
    let codeToVerify = rawInput.trim();

    // Extract code if rawInput is a full URL e.g. https://domain/join-class?code=A8K2P9
    if (codeToVerify.includes('code=')) {
      const match = codeToVerify.match(/code=([A-Z0-9]{6})/i);
      if (match && match[1]) {
        codeToVerify = match[1];
      }
    }

    codeToVerify = codeToVerify.toUpperCase();

    if (codeToVerify.length !== 6) {
      setError('Mã lớp học phải đủ 6 ký tự (VD: A8K2P9)');
      return;
    }

    setLoading(true);

    let targetClass = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error: fetchErr } = await supabase
          .from('classes')
          .select('*')
          .eq('code', codeToVerify)
          .single();

        if (data && !fetchErr) {
          targetClass = data;
          
          // Insert membership
          if (profile?.id) {
            await supabase.from('class_members').insert({
              class_id: targetClass.id,
              student_id: profile.id
            });
          }
        }
      } catch (err) {
        console.warn('Supabase fetch class error, checking local store:', err);
      }
    }

    // Local state fallback search
    if (!targetClass) {
      const allStoredClasses = getStoredData('classes_list', [
        { id: 'class-1', name: 'Lớp 3A1 - Toán Học Vui', code: 'A8K2P9', grade_level: 3, teacher_name: 'Cô Nguyễn Thị Hoa' },
        { id: 'class-2', name: 'Lớp 1B - Tiếng Việt Khám Phá', code: 'V8M4K1', grade_level: 1, teacher_name: 'Cô Nguyễn Thị Hoa' }
      ]);

      targetClass = allStoredClasses.find(c => c.code === codeToVerify);
    }

    setLoading(false);

    if (targetClass) {
      // Reward student 10 stars for joining!
      addStars(10);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setSuccessClass(targetClass);

      // Save to joined classes
      const myJoined = getStoredData('joined_classes', []);
      if (!myJoined.some(c => c.id === targetClass.id)) {
        setStoredData('joined_classes', [...myJoined, targetClass]);
      }

      if (onJoinedSuccess) onJoinedSuccess(targetClass);
    } else {
      setError(`Không tìm thấy lớp học với mã "${codeToVerify}". Vui lòng kiểm tra lại.`);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    processJoinCode(inputCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#40c7b1] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <KeyRound className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">Vào Lớp Học</h3>
              <p className="text-xs text-teal-100">Quét mã QR hoặc Nhập mã Lớp 6 ký tự</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        {!successClass && (
          <div className="flex border-b border-slate-100 bg-slate-50">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'code' 
                  ? 'border-[#40c7b1] text-[#36b3a0] bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound className="w-4 h-4" /> Nhập Mã 6 Ký Tự
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'scanner' 
                  ? 'border-[#40c7b1] text-[#36b3a0] bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Camera className="w-4 h-4" /> Quét Mã QR Camera
            </button>
          </div>
        )}

        <div className="p-6">
          {successClass ? (
            /* SUCCESS STATE */
            <div className="text-center space-y-5 py-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-800">Gia Nhập Thành Công!</h4>
                <p className="text-sm font-bold text-[#36b3a0] bg-teal-50 py-1.5 px-4 rounded-full inline-block">
                  {successClass.name}
                </p>
                <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-sm pt-2">
                  <Sparkles className="w-4 h-4 fill-amber-400" /> Bạn đã nhận được +10 Sao Thưởng!
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full btn-edumint mt-4 py-3"
              >
                Bắt đầu Học tập & Chơi Game
              </button>
            </div>
          ) : (
            /* FORM STATE */
            <div className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              {activeTab === 'code' ? (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="text-center">
                    <label className="block text-xs font-extrabold uppercase text-slate-500 mb-2">
                      Nhập mã 6 ký tự từ Giáo viên (Ví dụ: A8K2P9)
                    </label>
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="A8K2P9"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      className="w-full text-center text-3xl font-mono font-black py-3 px-4 rounded-2xl border-2 border-teal-200 focus:border-[#40c7b1] outline-none uppercase tracking-widest text-slate-800 bg-amber-50/50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || inputCode.length < 6}
                    className="w-full btn-edumint py-3 text-base font-extrabold disabled:opacity-50"
                  >
                    {loading ? 'Đang kiểm tra...' : 'Vào Lớp Ngay'}
                  </button>
                </form>
              ) : (
                /* CAMERA SCANNER TAB */
                <div className="space-y-3 text-center">
                  <p className="text-xs text-slate-500 font-semibold">
                    Đưa mã QR của lớp học vào khung hình Camera bên dưới:
                  </p>

                  <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[#40c7b1] bg-slate-900 min-h-[240px] flex items-center justify-center">
                    <div id="qr-reader-element" className="w-full"></div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Mẹo: Có thể dùng thiết bị di động quét trực tiếp từ ảnh QR giáo viên gửi.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
