import React, { useState } from 'react';
import { X, Download, Maximize2, Minimize2, ZoomIn, ZoomOut, FileText, Presentation, ExternalLink, Sparkles } from 'lucide-react';

export const PDFSlideViewerModal = ({ isOpen, onClose, documentItem }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || !documentItem) return null;

  const fileUrl = documentItem.file_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  const isPPTX = documentItem.type === 'interactive_slide' || fileUrl.endsWith('.pptx') || fileUrl.endsWith('.ppt');
  
  // Google Docs Viewer fallback for PPTX / Slides
  const embedUrl = isPPTX
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
    : fileUrl;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 75));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className={`bg-slate-900 text-white w-full rounded-3xl shadow-2xl border-4 border-[#40c7b1] overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen ? 'h-screen max-w-none rounded-none border-none' : 'max-w-5xl h-[88vh]'
      }`}>
        
        {/* TOP CONTROLS BAR */}
        <div className="bg-[#40c7b1] px-6 py-3.5 flex items-center justify-between text-white border-b border-teal-400/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              {isPPTX ? <Presentation className="w-5 h-5 text-amber-300" /> : <FileText className="w-5 h-5 text-amber-300" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold truncate max-w-md">{documentItem.title || 'Tài liệu Bài giảng Trực tuyến'}</h3>
              <p className="text-xs text-teal-100 font-semibold">
                Khối Lớp {documentItem.grade_level || 3} • Xem trực tiếp không cần tải về
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom controls */}
            <div className="hidden sm:flex items-center gap-1 bg-teal-800/40 px-3 py-1 rounded-full text-xs font-bold border border-teal-200/30">
              <button onClick={handleZoomOut} className="p-1 hover:text-amber-300" title="Thu nhỏ">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-mono">{zoomLevel}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:text-amber-300" title="Phóng to">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow"
            >
              <Download className="w-3.5 h-3.5" /> Tải Về
            </a>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            {/* Close */}
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* EMBEDDED VIEWER CANVAS */}
        <div className="flex-1 bg-slate-950 p-2 relative overflow-hidden flex items-center justify-center">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}>
            <iframe
              src={embedUrl}
              title="PDF Slide Viewer"
              className="w-full h-full border-none"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* FOOTER INFO BAR */}
        <div className="bg-slate-900 px-6 py-2.5 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800">
          <span className="flex items-center gap-1 text-teal-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> EduNBN Online Viewer • Tích hợp xem trực tiếp PDF / PPTX
          </span>
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white font-semibold flex items-center gap-1"
          >
            Mở trong cửa sổ mới <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
