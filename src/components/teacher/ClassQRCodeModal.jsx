import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Download, Printer, Check, RefreshCw, QrCode, Share2, Sparkles } from 'lucide-react';

export const ClassQRCodeModal = ({ isOpen, onClose, classItem, onResetCode }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  if (!isOpen || !classItem) return null;

  const joinUrl = `${window.location.origin}/join-class?code=${classItem.code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 140;
      
      // Draw background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Title Header
      ctx.fillStyle = '#36b3a0';
      ctx.font = 'bold 20px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(classItem.name, canvas.width / 2, 40);

      // Draw QR Image
      ctx.drawImage(img, 40, 60);

      // Draw Code footer
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`MÃ LỚP: ${classItem.code}`, canvas.width / 2, canvas.height - 30);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_Lop_${classItem.code}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-teal-100 overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Header */}
        <div className="bg-[#40c7b1] p-6 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <QrCode className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Mã QR Gia Nhập Lớp</h3>
              <p className="text-xs text-teal-100">{classItem.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-6 text-center space-y-6">
          <div className="space-y-1">
            <h4 className="text-xl font-extrabold text-slate-800">{classItem.name}</h4>
            <p className="text-sm font-semibold text-teal-700 bg-teal-50 py-1 px-3 rounded-full inline-block">
              Khối Lớp {classItem.grade_level} • Giáo viên: {classItem.teacher_name || 'Cô giáo'}
            </p>
          </div>

          {/* QR Canvas Render */}
          <div ref={qrRef} className="inline-block p-4 bg-white border-4 border-[#40c7b1] rounded-3xl shadow-md">
            <QRCodeSVG 
              value={joinUrl}
              size={220}
              bgColor={"#ffffff"}
              fgColor={"#1e293b"}
              level={"H"}
              includeMargin={true}
              imageSettings={{
                src: "https://api.dicebear.com/7.x/bottts/svg?seed=eduliveqr",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

          {/* Join Code Display Pill */}
          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
            <span className="text-xs font-bold text-amber-800 uppercase block mb-1">Mã Gia Nhập 6 Ký Tự:</span>
            <div className="text-3xl font-black font-mono tracking-widest text-amber-900">
              {classItem.code}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 print:hidden">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Đã copy link!' : 'Copy Link Gia Nhập'}
            </button>

            <button
              onClick={handleDownloadPNG}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-sm rounded-xl transition-all"
            >
              <Download className="w-4 h-4 text-[#36b3a0]" />
              Tải Ảnh QR Code
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 hover:text-slate-800 font-semibold"
            >
              <Printer className="w-4 h-4 text-slate-600" /> In Mã QR này
            </button>

            {onResetCode && (
              <button
                onClick={() => onResetCode(classItem.id)}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Tạo lại mã mới
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
