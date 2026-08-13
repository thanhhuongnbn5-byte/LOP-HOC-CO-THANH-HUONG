import React from 'react';
import { Heart, Sparkles, Shield, BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400"></span>
              <span className="text-2xl font-black text-white tracking-tight">edunbn</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng Giáo dục số, Bài giảng tương tác & Trò chơi Giáo dục chuẩn EdTech cho Học sinh Tiểu học (Khối 1 - 5) - Lớp Học Cô Lê Thị Thanh Hương.
            </p>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> 1000+ Mẫu bài giảng tương tác
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Môn Học Tiểu Học</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#math" className="hover:text-teal-400 transition-colors">Toán Học Vui (Lớp 1-5)</a></li>
              <li><a href="#viet" className="hover:text-teal-400 transition-colors">Tiếng Việt Khám Phá</a></li>
              <li><a href="#eng" className="hover:text-teal-400 transition-colors">Tiếng Anh Trải Nghiệm</a></li>
              <li><a href="#science" className="hover:text-teal-400 transition-colors">Tự Nhiên & Xã Hội</a></li>
              <li><a href="#it" className="hover:text-teal-400 transition-colors">Tin Học & Công Nghệ</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Hệ Thống Phân Quyền</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-amber-400" /> Quản Trị Hệ Thống (Admin)</li>
              <li className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-teal-400" /> Cô Lê Thị Thanh Hương (Giáo Viên)</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Cổng Học Sinh & Game (Student)</li>
              <li className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-pink-400" /> Cổng Phụ Huynh (Parent Portal)</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Liên Hệ & Hỗ Trợ</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-teal-400" /> thanhhuongle84@gmail.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-400" /> 0932474173</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-400" /> Đức Lập - Lâm Đồng</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EduNBN Digital Learning Platform. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Thiết kế cho Cô Lê Thị Thanh Hương với <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> & Supabase DB
          </p>
        </div>
      </div>
    </footer>
  );
};
