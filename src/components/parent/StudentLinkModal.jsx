import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured, getStoredData, setStoredData } from '../../lib/supabase';

export const StudentLinkModal = ({ isOpen, onClose, onLinkSuccess }) => {
  const { profile, usersList } = useAuth();
  const [studentCode, setStudentCode] = useState('');
  const [relationship, setRelationship] = useState('father');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanCode = studentCode.trim().toUpperCase();
    if (!cleanCode) {
      setError('Vui lòng nhập Mã Liên Kết Học Sinh (8 ký tự)');
      return;
    }

    setLoading(true);
    setError(null);

    let linkedStudent = null;

    if (isSupabaseConfigured) {
      try {
        const { data: studentProfile, error: stuErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('student_code', cleanCode)
          .single();

        if (studentProfile && !stuErr) {
          linkedStudent = studentProfile;

          // Insert into parent_student_links table
          await supabase.from('parent_student_links').insert({
            parent_id: profile?.id,
            student_id: studentProfile.id,
            relationship_type: relationship
          });
        }
      } catch (err) {
        console.warn('Supabase link student error, fallback local search:', err);
      }
    }

    // Local storage fallback match
    if (!linkedStudent) {
      linkedStudent = usersList.find(u => u.student_code === cleanCode || u.role === 'student');
    }

    setLoading(false);

    if (linkedStudent) {
      const existingLinks = getStoredData('parent_student_links', []);
      const newLink = {
        id: `link-${Date.now()}`,
        parent_id: profile?.id || 'parent-1',
        student_id: linkedStudent.id,
        student_name: linkedStudent.full_name,
        student_code: linkedStudent.student_code,
        grade_level: linkedStudent.grade_level,
        total_stars: linkedStudent.total_stars,
        avatar_url: linkedStudent.avatar_url,
        relationship_type: relationship,
        created_at: new Date().toISOString()
      };

      setStoredData('parent_student_links', [...existingLinks, newLink]);
      onLinkSuccess(newLink);
      onClose();
    } else {
      setError(`Không tìm thấy Học sinh nào với Mã Liên Kết "${cleanCode}". Vui lòng kiểm tra lại trong Sổ Liên Lạc của con.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#40c7b1] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Heart className="w-6 h-6 text-pink-300 fill-pink-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Liên Kết Tài Khoản Con</h3>
              <p className="text-xs text-teal-100">Nhập Mã Liên Kết Học Sinh (Student Code)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full">
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
              Mã Liên Kết Học Sinh (8 ký tự) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              placeholder="VD: ST8K92A1"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
              className="w-full text-center text-2xl font-mono font-black py-3 px-4 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-slate-800 tracking-widest uppercase bg-amber-50/50"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              *Mã này hiển thị ở góc trên Cổng Học Sinh của con hoặc trên Thẻ Học Sinh.
            </p>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
              Quan hệ với Học sinh
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-slate-800 font-semibold bg-white"
            >
              <option value="father">Bố (Cha)</option>
              <option value="mother">Mẹ</option>
              <option value="guardian">Người giám hộ hợp pháp</option>
            </select>
          </div>

          <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#36b3a0] flex-shrink-0" />
            <p className="text-xs text-teal-800 font-medium">
              Sau khi kết nối, Phụ huynh sẽ theo dõi được ngay tiến độ làm bài, điểm số, Sao thưởng và nhận xét của Giáo viên.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 text-sm transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-edumint text-sm"
            >
              {loading ? 'Đang kết nối...' : 'Xác Nhận Liên Kết'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
