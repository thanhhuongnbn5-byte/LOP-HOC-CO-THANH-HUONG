import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, QrCode, Copy, Share2, Users, Sparkles, 
  Gamepad2, Calendar, CheckCircle2, MessageSquare, Star, RefreshCw 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { CreateClassModal } from '../components/teacher/CreateClassModal';
import { ClassQRCodeModal } from '../components/teacher/ClassQRCodeModal';
import { 
  getStoredData, setStoredData, generateClassCode, 
  INITIAL_MOCK_CLASSES, INITIAL_MOCK_MATERIALS, INITIAL_MOCK_ASSIGNMENTS 
} from '../lib/supabase';

export const TeacherPortal = () => {
  const { profile } = useAuth();
  const [classes, setClasses] = useState(() => getStoredData('classes_list', INITIAL_MOCK_CLASSES));
  const [materials, setMaterials] = useState(() => getStoredData('materials_list', INITIAL_MOCK_MATERIALS));
  const [assignments, setAssignments] = useState(() => getStoredData('assignments_list', INITIAL_MOCK_ASSIGNMENTS));
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedQRClass, setSelectedQRClass] = useState(null);
  
  // Feedback Form State
  const [feedbackStudent, setFeedbackStudent] = useState('Trần Minh Anh');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    setStoredData('classes_list', classes);
  }, [classes]);

  useEffect(() => {
    setStoredData('assignments_list', assignments);
  }, [assignments]);

  const handleClassCreated = (newClass) => {
    setClasses(prev => [newClass, ...prev]);
    setSelectedQRClass(newClass);
  };

  const handleResetClassCode = (classId) => {
    const newCode = generateClassCode();
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, code: newCode } : c));
    if (selectedQRClass?.id === classId) {
      setSelectedQRClass(prev => prev ? { ...prev, code: newCode } : null);
    }
  };

  const handleAssignGame = (material) => {
    if (classes.length === 0) return;
    const targetClass = classes[0];
    const newAssignment = {
      id: `assign-${Date.now()}`,
      class_id: targetClass.id,
      material_id: material.id,
      material_title: material.title,
      reward_stars: 15,
      due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
      created_at: new Date().toISOString()
    };

    setAssignments(prev => [newAssignment, ...prev]);
    alert(`Đã giao bài "${material.title}" cho lớp ${targetClass.name}!`);
  };

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    const existingFeedbacks = getStoredData('teacher_feedbacks_list', []);
    const newFb = {
      id: `fb-${Date.now()}`,
      teacher_name: profile?.full_name || 'Cô Lê Thị Thanh Hương',
      student_name: feedbackStudent,
      comment: feedbackComment,
      rating_stars: feedbackRating,
      created_at: new Date().toISOString()
    };

    setStoredData('teacher_feedbacks_list', [newFb, ...existingFeedbacks]);
    setFeedbackComment('');
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF8]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* TOP WELCOME BAR */}
        <div className="bg-edulive-gradient rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-teal-800/40 text-teal-100 text-xs font-bold px-3 py-1 rounded-full border border-teal-200/30">
              CỔNG QUẢN LÝ GIÁO VIÊN (TEACHER PORTAL)
            </span>
            <h1 className="text-3xl font-black font-sans">
              Xin chào, {profile?.full_name || 'Cô Lê Thị Thanh Hương'}!
            </h1>
            <p className="text-sm text-teal-50 max-w-xl">
              Tạo lớp học mới tự sinh Mã QR Code, chọn game bài giảng tương tác và nhận xét cho học sinh.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn-eduyellow font-black text-base px-6 py-3 rounded-full shadow-lg transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Tạo Lớp Học Mới
          </button>
        </div>

        {/* SECTION 1: MY CLASSES & QR CODES */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Danh Sách Lớp Học & Mã QR</h2>
              <p className="text-xs text-slate-500 font-semibold">Giáo viên bấm vào mã QR để in hoặc gửi cho Phụ huynh</p>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="btn-edumint text-xs py-2 px-4"
            >
              <Plus className="w-4 h-4" /> Thêm Lớp
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-[#40c7b1] transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-teal-100 text-[#36b3a0] text-xs font-extrabold px-3 py-1 rounded-full">
                      Khối Lớp {cls.grade_level}
                    </span>
                    <button
                      onClick={() => setSelectedQRClass(cls)}
                      className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold border border-amber-200"
                    >
                      <QrCode className="w-4 h-4 text-amber-600" /> Xem QR
                    </button>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-800">{cls.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{cls.description || 'Chưa có mô tả lớp'}</p>

                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-700 uppercase block">Mã Gia Nhập (Join Code)</span>
                    <span className="text-2xl font-black font-mono tracking-widest text-amber-900">{cls.code}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#36b3a0]" /> 28 Học sinh
                  </span>
                  <button 
                    onClick={() => setSelectedQRClass(cls)}
                    className="text-[#36b3a0] hover:underline font-bold"
                  >
                    Phóng to QR & In
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: GAME MATERIAL CATALOG & ASSIGNMENT LAUNCHER */}
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Kho Trò Chơi Giáo Dục & Bài Giảng</h2>
              <p className="text-xs text-slate-500 font-semibold">Chọn game tương tác để giao bài tập cho học sinh</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {materials.map((mat) => (
              <div key={mat.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#40c7b1]/30 flex flex-col justify-between hover:shadow-md transition-all space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Khối {mat.grade_level}
                    </span>
                    <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                      <Gamepad2 className="w-3.5 h-3.5" /> HTML5 Game
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800">{mat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{mat.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> Thưởng +15 Sao
                  </span>
                  <button
                    onClick={() => handleAssignGame(mat)}
                    className="btn-edumint py-1.5 px-4 text-xs"
                  >
                    Giao Cho Lớp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: TEACHER FEEDBACK & GRADING BOOK */}
        <div className="bg-white rounded-3xl p-8 border border-teal-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 text-[#36b3a0] rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">Sổ Liên Lạc Điện Tử & Gửi Nhận Xét</h3>
              <p className="text-xs text-slate-500 font-semibold">Nhận xét sẽ hiển thị ngay lập tức trên Cổng Phụ Huynh</p>
            </div>
          </div>

          <form onSubmit={handleSendFeedback} className="space-y-4 max-w-2xl">
            {feedbackSent && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Đã gửi nhận xét thành công đến Phụ huynh của học sinh!
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Chọn Học Sinh
                </label>
                <select
                  value={feedbackStudent}
                  onChange={(e) => setFeedbackStudent(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-sm text-slate-800 bg-white"
                >
                  <option value="Trần Minh Anh">Trần Minh Anh (Mã: ST8K92A1)</option>
                  <option value="Lê Bảo Nam">Lê Bảo Nam (Mã: ST9M21K3)</option>
                  <option value="Pham Thu Trang">Phạm Thu Trang (Mã: ST7V44X1)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Đánh Giá Sao Tích Cực
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFeedbackRating(s)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${s <= feedbackRating ? 'fill-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                Nội dung Nhận xét / Đánh giá
              </label>
              <textarea
                rows={3}
                required
                placeholder="VD: Con tiếp thu bài tốt, hoàn thành game Đào vàng rất nhanh. Cần chú ý giữ chữ viết sạch đẹp hơn..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#40c7b1] outline-none text-sm text-slate-800"
              ></textarea>
            </div>

            <button type="submit" className="btn-edumint text-sm py-2.5 px-6">
              Gửi Nhận Xét Ngay
            </button>
          </form>
        </div>

      </main>

      <Footer />

      {/* MODALS */}
      <CreateClassModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onClassCreated={handleClassCreated}
      />

      <ClassQRCodeModal
        isOpen={Boolean(selectedQRClass)}
        onClose={() => setSelectedQRClass(null)}
        classItem={selectedQRClass}
        onResetCode={handleResetClassCode}
      />
    </div>
  );
};
