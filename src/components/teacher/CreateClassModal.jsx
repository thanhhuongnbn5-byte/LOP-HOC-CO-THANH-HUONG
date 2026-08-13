import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, CheckCircle, BookOpen, Layers } from 'lucide-react';
import { generateClassCode, supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const CreateClassModal = ({ isOpen, onClose, onClassCreated }) => {
  const { profile } = useAuth();
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState(3);
  const [description, setDescription] = useState('');
  const [classCode, setClassCode] = useState(() => generateClassCode());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    setClassCode(generateClassCode());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên lớp học');
      return;
    }

    setLoading(true);
    setError(null);

    const newClassData = {
      id: `class-${Date.now()}`,
      name,
      grade_level: parseInt(gradeLevel),
      description,
      code: classCode,
      teacher_id: profile?.id || 'teacher-1',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error: dbErr } = await supabase
          .from('classes')
          .insert({
            name,
            grade_level: parseInt(gradeLevel),
            description,
            code: classCode,
            teacher_id: profile?.id
          })
          .select()
          .single();

        if (dbErr) throw dbErr;
        if (data) {
          onClassCreated(data);
          onClose();
          return;
        }
      } catch (err) {
        console.warn('Supabase create class error, using local state fallback:', err);
      }
    }

    // Local state callback fallback
    onClassCreated(newClassData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#40c7b1] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-sans">Tạo Lớp Học Mới</h3>
              <p className="text-xs text-teal-100">Hệ thống sẽ tự động sinh Mã Lớp & Mã QR gia nhập</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
              Tên Lớp Học <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              placeholder="VD: Lớp 3A1 - Toán Học Vui"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#40c7b1] focus:ring-2 focus:ring-[#40c7b1]/20 outline-none text-slate-800 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                Khối Lớp (Grade)
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-slate-800 font-semibold bg-white"
              >
                <option value={1}>Lớp 1 (6 tuổi)</option>
                <option value={2}>Lớp 2 (7 tuổi)</option>
                <option value={3}>Lớp 3 (8 tuổi)</option>
                <option value={4}>Lớp 4 (9 tuổi)</option>
                <option value={5}>Lớp 5 (10 tuổi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                Mã Lớp Tự Sinh (Join Code)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  readOnly
                  value={classCode}
                  className="w-full px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-black text-center text-lg tracking-widest"
                />
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  title="Sinh mã ngẫu nhiên mới"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
              Mô tả / Ghi chú lớp học
            </label>
            <textarea
              rows={3}
              placeholder="Nhập thông tin giới thiệu lớp học hoặc lưu ý cho phụ huynh..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-slate-800 text-sm"
            ></textarea>
          </div>

          <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#36b3a0] flex-shrink-0" />
            <p className="text-xs text-teal-800 font-medium">
              Sau khi bấm <strong>Tạo Lớp</strong>, hệ thống sẽ tự động xuất mã QR Code và đường dẫn link gia nhập riêng cho lớp này.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 text-sm transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-edumint text-sm"
            >
              {loading ? 'Đang tạo...' : 'Tạo Lớp Học ngay'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
