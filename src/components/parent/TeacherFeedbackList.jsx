import React from 'react';
import { Star, MessageSquare, Calendar, Award } from 'lucide-react';

export const TeacherFeedbackList = ({ feedbacks = [] }) => {
  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-teal-100 shadow-sm space-y-3">
        <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
        <h4 className="text-base font-bold text-slate-700">Chưa có nhận xét từ Giáo viên</h4>
        <p className="text-xs text-slate-400">Các nhận xét đánh giá định kỳ và điểm số sẽ tự động cập nhật tại đây.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((fb) => (
        <div key={fb.id} className="bg-white p-5 rounded-2xl border border-teal-100/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={fb.teacher_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'} 
                alt="Teacher"
                className="w-10 h-10 rounded-full border border-teal-200 object-cover"
              />
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">{fb.teacher_name || 'Cô Lê Thị Thanh Hương'}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(fb.created_at || Date.now()).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < (fb.rating_stars || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                />
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-medium bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
            "{fb.comment}"
          </p>

          {fb.assignment_title && (
            <div className="text-xs text-teal-700 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Bài nộp: {fb.assignment_title}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
