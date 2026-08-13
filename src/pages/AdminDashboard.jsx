import React, { useState } from 'react';
import { 
  Shield, Users, BookOpen, Calculator, Layers, Database, 
  Sparkles, CheckCircle2, UserCheck, Plus, Trash2 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { INITIAL_MOCK_SUBJECTS, INITIAL_MOCK_CLASSES } from '../lib/supabase';

export const AdminDashboard = () => {
  const { usersList } = useAuth();
  const [subjects, setSubjects] = useState(INITIAL_MOCK_SUBJECTS);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName || !newSubCode) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      name: newSubName,
      code: newSubCode.toUpperCase(),
      icon: 'BookOpen',
      color: '#40c7b1'
    };
    setSubjects(prev => [...prev, newSub]);
    setNewSubName('');
    setNewSubCode('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF8]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* WELCOME HEADER */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-amber-400">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5 w-max mx-auto md:mx-0">
              <Shield className="w-4 h-4 text-amber-400" />
              CỔNG QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN DASHBOARD)
            </span>
            <h1 className="text-3xl font-black font-sans">
              Quản Lý Hệ Thống EduNBN Digital
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-medium">
              Toàn quyền quản lý tài khoản 4 vai trò, danh mục môn học, các lớp học và phân quyền bảo mật RLS Supabase.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center min-w-[200px]">
            <div className="text-xs font-bold text-slate-400 uppercase">Supabase DB Status</div>
            <div className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 13 Tables Ready
            </div>
          </div>
        </div>

        {/* SYSTEM STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5 space-y-2 border-l-4 border-l-amber-400">
            <div className="text-xs font-extrabold text-slate-400 uppercase">Tổng Tài Khoản</div>
            <div className="text-3xl font-black text-slate-800">{usersList.length} Người dùng</div>
          </div>

          <div className="glass-card p-5 space-y-2 border-l-4 border-l-[#40c7b1]">
            <div className="text-xs font-extrabold text-slate-400 uppercase">Tổng Số Môn Học</div>
            <div className="text-3xl font-black text-[#36b3a0]">{subjects.length} Môn</div>
          </div>

          <div className="glass-card p-5 space-y-2 border-l-4 border-l-blue-500">
            <div className="text-xs font-extrabold text-slate-400 uppercase">Lớp Học Đang Mở</div>
            <div className="text-3xl font-black text-blue-600">{INITIAL_MOCK_CLASSES.length} Lớp</div>
          </div>

          <div className="glass-card p-5 space-y-2 border-l-4 border-l-purple-500">
            <div className="text-xs font-extrabold text-slate-400 uppercase">Trò Chơi Tương Tác</div>
            <div className="text-3xl font-black text-purple-600">5 Mẫu HTML5</div>
          </div>
        </div>

        {/* USER MANAGEMENT TABLE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">Quản Lý Tài Khoản Người Dùng (4 Roles)</h3>
                <p className="text-xs text-slate-500 font-semibold">Tự động phân quyền RLS theo vai trò Admin, Teacher, Student, Parent</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-xs border-b border-slate-200">
                  <th className="p-3.5">Họ và Tên</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Vai Trò (Role)</th>
                  <th className="p-3.5">Khối / Mã Liên Kết</th>
                  <th className="p-3.5">Sao Thưởng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-teal-50/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-800 flex items-center gap-2">
                      <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full bg-slate-100 object-cover" />
                      {u.full_name}
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono text-xs">{u.email}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                        u.role === 'teacher' ? 'bg-teal-100 text-teal-800' :
                        u.role === 'parent' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-slate-700">
                      {u.student_code ? `Mã: ${u.student_code}` : (u.grade_level ? `Khối ${u.grade_level}` : '-')}
                    </td>
                    <td className="p-3.5 font-bold text-amber-500">
                      {u.total_stars || 0} ⭐
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUBJECT TAXONOMY MANAGEMENT */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 text-[#36b3a0] rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">Danh Mục Môn Học (Subjects Taxonomy)</h3>
              <p className="text-xs text-slate-500 font-semibold">Phân loại môn học cho các bài giảng & trò chơi giáo dục</p>
            </div>
          </div>

          <form onSubmit={handleAddSubject} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input 
              type="text"
              placeholder="Tên môn học mới (VD: Âm Nhạc)"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-sm"
              required
            />
            <input 
              type="text"
              placeholder="Mã môn (MUSIC)"
              value={newSubCode}
              onChange={(e) => setNewSubCode(e.target.value)}
              className="w-32 px-4 py-2 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-sm uppercase font-mono"
              required
            />
            <button type="submit" className="btn-edumint py-2 px-5 text-sm">
              <Plus className="w-4 h-4" /> Thêm Môn
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subjects.map((sub) => (
              <div key={sub.id} className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{sub.name}</h4>
                  <span className="text-[10px] font-mono font-bold text-teal-700">{sub.code}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-teal-600 font-bold text-xs">
                  {sub.code.substring(0, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
