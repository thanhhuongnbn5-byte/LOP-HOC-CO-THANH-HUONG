import React, { useState, useEffect } from 'react';
import { 
  Users, Heart, Star, Trophy, MessageSquare, Plus, 
  Calendar, CheckCircle2, Shield, Sparkles, BookOpen 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { StudentLinkModal } from '../components/parent/StudentLinkModal';
import { TeacherFeedbackList } from '../components/parent/TeacherFeedbackList';
import { getStoredData, setStoredData } from '../lib/supabase';

export const ParentPortal = () => {
  const { profile } = useAuth();
  const [linkedStudents, setLinkedStudents] = useState(() => getStoredData('parent_student_links', [
    {
      id: 'link-1',
      student_id: 'student-1',
      student_name: 'Trần Minh Anh',
      student_code: 'ST8K92A1',
      grade_level: 3,
      total_stars: 45,
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=student1',
      relationship_type: 'father'
    }
  ]));

  const [selectedStudentId, setSelectedStudentId] = useState(linkedStudents[0]?.student_id || 'student-1');
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  const [feedbacks] = useState(() => getStoredData('teacher_feedbacks_list', [
    {
      id: 'fb-1',
      teacher_name: 'Cô Lê Thị Thanh Hương',
      teacher_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      comment: 'Bé Minh Anh học tập rất tích cực, hoàn thành tốt trò chơi Đào vàng phép nhân chia và đạt 100 điểm.',
      rating_stars: 5,
      assignment_title: 'Trò chơi "Đào Vàng" - Phép Nhân Chia',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]));

  useEffect(() => {
    setStoredData('parent_student_links', linkedStudents);
  }, [linkedStudents]);

  const activeStudent = linkedStudents.find(s => s.student_id === selectedStudentId) || linkedStudents[0];

  const handleLinkSuccess = (newLink) => {
    setLinkedStudents(prev => [newLink, ...prev]);
    setSelectedStudentId(newLink.student_id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF8]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* TOP WELCOME BANNER */}
        <div className="bg-edulive-gradient rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-teal-800/40 text-pink-200 text-xs font-bold px-3 py-1 rounded-full border border-teal-200/30 flex items-center gap-1.5 w-max mx-auto md:mx-0">
              <Heart className="w-4 h-4 fill-pink-300 text-pink-300" />
              CỔNG PHỤ HUYNH (PARENT PORTAL)
            </span>
            <h1 className="text-3xl font-black font-sans">
              Xin chào, {profile?.full_name || 'Phụ huynh'}!
            </h1>
            <p className="text-sm text-teal-50 max-w-xl font-medium">
              Sổ liên lạc điện tử gia đình - Theo dõi sát sao tiến độ học tập, điểm số và nhận xét từ Giáo viên chủ nhiệm.
            </p>
          </div>

          <button
            onClick={() => setLinkModalOpen(true)}
            className="btn-eduyellow font-black text-base px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Liên Kết Thêm Con (Student Code)
          </button>
        </div>

        {/* CHILDREN SWITCHER BAR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" /> Danh Sách Các Con Đã Liên Kết ({linkedStudents.length})
            </h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {linkedStudents.map((stu) => {
              const isSelected = stu.student_id === selectedStudentId;
              return (
                <button
                  key={stu.id}
                  onClick={() => setSelectedStudentId(stu.student_id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center gap-3 text-left ${
                    isSelected
                      ? 'bg-white border-[#40c7b1] shadow-md ring-2 ring-[#40c7b1]/20'
                      : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                  }`}
                >
                  <img 
                    src={stu.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=student1'} 
                    alt="Child"
                    className="w-10 h-10 rounded-full border border-teal-200 bg-teal-50 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{stu.student_name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">Khối {stu.grade_level || 3} • Mã: {stu.student_code}</p>
                  </div>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#40c7b1] ml-2"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED CHILD DASHBOARD OVERVIEW */}
        {activeStudent ? (
          <div className="space-y-8">
            
            {/* STAT CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="glass-card p-5 space-y-2 border-l-4 border-l-amber-400">
                <div className="text-xs font-extrabold text-slate-400 uppercase">Tổng Sao Thưởng</div>
                <div className="text-3xl font-black text-amber-500 flex items-center gap-2">
                  <Star className="w-7 h-7 fill-amber-400" />
                  {activeStudent.total_stars || 45} Sao
                </div>
              </div>

              <div className="glass-card p-5 space-y-2 border-l-4 border-l-teal-500">
                <div className="text-xs font-extrabold text-slate-400 uppercase">Khối Lớp Đang Học</div>
                <div className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-7 h-7 text-[#36b3a0]" />
                  Lớp {activeStudent.grade_level || 3}
                </div>
              </div>

              <div className="glass-card p-5 space-y-2 border-l-4 border-l-purple-500">
                <div className="text-xs font-extrabold text-slate-400 uppercase">Trò Chơi Đã Chơi</div>
                <div className="text-2xl font-black text-purple-600 flex items-center gap-2">
                  <Sparkles className="w-7 h-7" />
                  8 Bài / Game
                </div>
              </div>

              <div className="glass-card p-5 space-y-2 border-l-4 border-l-emerald-500">
                <div className="text-xs font-extrabold text-slate-400 uppercase">Tỷ Lệ Hoàn Thành</div>
                <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                  <CheckCircle2 className="w-7 h-7" />
                  95% Xuất Sắc
                </div>
              </div>
            </div>

            {/* TEACHER ELECTRONIC FEEDBACK BOOK */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-100 text-[#36b3a0] rounded-2xl">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800">
                      Sổ Liên Lạc Điện Tử - {activeStudent.student_name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">Nhận xét và đánh giá định kỳ trực tiếp từ Cô Lê Thị Thanh Hương</p>
                  </div>
                </div>
              </div>

              <TeacherFeedbackList feedbacks={feedbacks} />
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-teal-100 shadow-sm space-y-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">Chưa có Học sinh nào được liên kết</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Vui lòng hỏi Mã Liên Kết Học Sinh (8 ký tự) từ con hoặc Giáo viên để theo dõi sổ liên lạc.</p>
            <button onClick={() => setLinkModalOpen(true)} className="btn-edumint py-2.5 px-6 text-sm inline-flex">
              + Liên Kết Ngay
            </button>
          </div>
        )}

      </main>

      <Footer />

      {/* LINK MODAL */}
      <StudentLinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onLinkSuccess={handleLinkSuccess}
      />
    </div>
  );
};
