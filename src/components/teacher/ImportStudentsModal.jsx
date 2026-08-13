import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle, Users, Sparkles } from 'lucide-react';
import { generateStudentCode, supabase, isSupabaseConfigured, getStoredData, setStoredData } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const ImportStudentsModal = ({ isOpen, onClose, targetClass, onImportSuccess }) => {
  const { usersList } = useAuth();
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importCount, setImportCount] = useState(0);

  if (!isOpen) return null;

  // Handle Excel / CSV File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          setError('File Excel rỗng hoặc không đúng định dạng mẫu.');
          return;
        }

        // Format and validate data rows
        const formatted = data.map((row, idx) => ({
          id: `tmp-${idx}`,
          full_name: row['Họ và tên'] || row['Họ tên'] || row['Full Name'] || `Học sinh ${idx + 1}`,
          email: row['Email'] || `hocsinh${Date.now().toString().slice(-4)}${idx}@edunbn.vn`,
          grade_level: parseInt(row['Khối lớp'] || row['Khối'] || targetClass?.grade_level || 3),
          student_code: generateStudentCode()
        }));

        setPreviewData(formatted);
      } catch (err) {
        console.error(err);
        setError('Không thể đọc file Excel. Vui lòng sử dụng file định dạng .xlsx hoặc .csv.');
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const templateData = [
      { 'Họ và tên': 'Trần Văn An', 'Email': 'an.tran@edunbn.vn', 'Khối lớp': targetClass?.grade_level || 3 },
      { 'Họ và tên': 'Nguyễn Thị Bình', 'Email': 'binh.nguyen@edunbn.vn', 'Khối lớp': targetClass?.grade_level || 3 },
      { 'Họ và tên': 'Lê Hoàng Cường', 'Email': 'cuong.le@edunbn.vn', 'Khối lớp': targetClass?.grade_level || 3 }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachHocSinh');
    XLSX.writeFile(wb, `Mau_Import_HocSinh_Lop_${targetClass?.code || 'EduNBN'}.xlsx`);
  };

  // Confirm Import
  const handleConfirmImport = async () => {
    if (previewData.length === 0) return;

    setLoading(true);
    setError(null);

    const importedStudents = [];

    for (const student of previewData) {
      const studentProfile = {
        id: `stu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        email: student.email,
        full_name: student.full_name,
        role: 'student',
        grade_level: student.grade_level,
        student_code: student.student_code,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(student.full_name)}`,
        total_stars: 10,
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured) {
        try {
          const { data: createdUser, error: authErr } = await supabase.from('profiles').insert({
            email: studentProfile.email,
            full_name: studentProfile.full_name,
            role: 'student',
            grade_level: studentProfile.grade_level,
            student_code: studentProfile.student_code,
            avatar_url: studentProfile.avatar_url,
            total_stars: 10
          }).select().single();

          if (createdUser && !authErr) {
            // Assign to class
            if (targetClass?.id) {
              await supabase.from('class_members').insert({
                class_id: targetClass.id,
                student_id: createdUser.id
              });
            }
            importedStudents.push(createdUser);
          }
        } catch (err) {
          console.warn('Supabase bulk insert fallback:', err);
        }
      }

      importedStudents.push(studentProfile);
    }

    // Save to local state
    const currentUsers = getStoredData('users_list', []);
    setStoredData('users_list', [...importedStudents, ...currentUsers]);

    setImportCount(previewData.length);
    setLoading(false);

    if (onImportSuccess) {
      onImportSuccess(importedStudents);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#40c7b1] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-sans">Import Học Sinh Từ Excel (.xlsx / .csv)</h3>
              <p className="text-xs text-teal-100">Dành cho Giáo viên • {targetClass?.name || 'Tất cả các lớp'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {importCount > 0 ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-800">Nhập Danh Sách Thành Công!</h4>
              <p className="text-sm font-semibold text-slate-600">
                Đã khởi tạo tài khoản và xếp lớp cho <strong>{importCount} học sinh</strong>. Mỗi học sinh được cấp sẵn Mã Liên Kết (Student Code) và +10 Sao thưởng đầu tiên.
              </p>
              <button onClick={onClose} className="btn-edumint py-2.5 px-8 mx-auto">
                Hoàn Tất & Đóng
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Upload & Download Template */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">Chưa có file mẫu Excel?</h4>
                  <p className="text-xs text-slate-500 font-semibold">Tải file mẫu định dạng chuẩn để nhập danh sách nhanh nhất</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="btn-outline-mint text-xs py-2 px-4 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" /> Tải File Mẫu Excel
                </button>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-teal-300 hover:border-[#40c7b1] rounded-2xl p-6 text-center space-y-3 bg-white transition-colors">
                <Upload className="w-10 h-10 text-[#36b3a0] mx-auto" />
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer text-sm font-extrabold text-[#36b3a0] hover:underline">
                    Bấm để chọn file Excel (.xlsx / .csv)
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-400 mt-1">Hệ thống sẽ tự động quét cột "Họ và tên", "Email", "Khối lớp"</p>
                </div>
                {file && (
                  <span className="inline-block bg-amber-100 text-amber-900 font-mono text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                    📄 File đã chọn: {file.name}
                  </span>
                )}
              </div>

              {/* Preview Table */}
              {previewData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#36b3a0]" /> Xem Trước ({previewData.length} Học Sinh)
                    </h4>
                    <span className="text-xs text-emerald-600 font-bold">✨ Tự sinh Mã Liên Kết 8 Ký Tự</span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-56">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-extrabold sticky top-0">
                        <tr>
                          <th className="p-2.5">STT</th>
                          <th className="p-2.5">Họ và Tên</th>
                          <th className="p-2.5">Email Kích Hoạt</th>
                          <th className="p-2.5">Khối</th>
                          <th className="p-2.5">Mã Liên Kết (Code)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewData.map((stu, idx) => (
                          <tr key={idx} className="hover:bg-teal-50/50">
                            <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-800">{stu.full_name}</td>
                            <td className="p-2.5 text-slate-500 font-mono">{stu.email}</td>
                            <td className="p-2.5 font-bold text-teal-700">Lớp {stu.grade_level}</td>
                            <td className="p-2.5 font-mono font-black text-amber-700">{stu.student_code}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={loading || previewData.length === 0}
                  onClick={handleConfirmImport}
                  className="btn-edumint text-xs py-2.5 px-6 disabled:opacity-50"
                >
                  {loading ? 'Đang nhập...' : `Xác Nhận Import ${previewData.length} Học Sinh`}
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
