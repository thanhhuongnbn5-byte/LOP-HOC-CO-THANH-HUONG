import React, { useState } from 'react';
import { 
  Folder, FolderOpen, ChevronRight, ChevronDown, BookOpen, 
  Gamepad2, FileText, Presentation, Search, Plus, Play, Eye, Sparkles 
} from 'lucide-react';
import { INITIAL_MOCK_SUBJECTS, INITIAL_MOCK_MATERIALS } from '../../lib/supabase';

export const MaterialFolderTree = ({ onSelectMaterial, onAssignMaterial }) => {
  const [expandedNodes, setExpandedNodes] = useState({
    'sub-1': true,
    'sub-1-grade-3': true,
    'sub-2': true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const grades = [1, 2, 3, 4, 5];

  // Organize sample chapters & materials hierarchy
  const getGradeMaterials = (subjectId, gradeLevel) => {
    return INITIAL_MOCK_MATERIALS.filter(
      m => m.subject_id === subjectId && m.grade_level === gradeLevel
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm space-y-6">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-100 text-[#36b3a0] rounded-2xl">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800">Cây Thư Mục Học Liệu (Taxonomy Tree)</h3>
            <p className="text-xs text-slate-500 font-semibold">Cấu trúc: Môn học ➔ Khối lớp (1-5) ➔ Bài học ➔ Học liệu & Game</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Tìm bài học, game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:border-[#40c7b1] outline-none bg-slate-50"
          />
        </div>
      </div>

      {/* TREE LIST CONTAINER */}
      <div className="space-y-3 font-sans">
        {INITIAL_MOCK_SUBJECTS.map((subject) => {
          const subjectNodeId = subject.id;
          const isSubjectExpanded = expandedNodes[subjectNodeId] || Boolean(searchQuery);

          return (
            <div key={subject.id} className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
              
              {/* LEVEL 1: MÔN HỌC */}
              <div 
                onClick={() => toggleNode(subjectNodeId)}
                className="p-3.5 bg-white hover:bg-teal-50/60 cursor-pointer flex items-center justify-between transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <button className="text-slate-400 hover:text-slate-600">
                    {isSubjectExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm" style={{ backgroundColor: subject.color }}>
                    {subject.code.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-800">{subject.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-400">Chương trình Tiểu học</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  5 Khối lớp
                </span>
              </div>

              {/* LEVEL 2: KHỐI LỚP (1 - 5) */}
              {isSubjectExpanded && (
                <div className="pl-6 pr-3 py-2 space-y-2 border-t border-slate-100 bg-slate-50/80">
                  {grades.map((grade) => {
                    const gradeNodeId = `${subject.id}-grade-${grade}`;
                    const isGradeExpanded = expandedNodes[gradeNodeId] || Boolean(searchQuery);
                    const gradeMaterials = getGradeMaterials(subject.id, grade);

                    // Filter search
                    const matchesSearch = searchQuery
                      ? gradeMaterials.some(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      : true;

                    if (searchQuery && !matchesSearch) return null;

                    return (
                      <div key={grade} className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                        
                        {/* LEVEL 2 HEADER */}
                        <div 
                          onClick={() => toggleNode(gradeNodeId)}
                          className="p-2.5 hover:bg-teal-50/40 cursor-pointer flex items-center justify-between text-xs select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-slate-400">
                              {isGradeExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                            <Folder className="w-4 h-4 text-amber-500" />
                            <span className="font-extrabold text-slate-800">Khối Lớp {grade}</span>
                          </div>

                          <span className="text-[11px] font-semibold text-slate-500">
                            {gradeMaterials.length} Bài học / Game
                          </span>
                        </div>

                        {/* LEVEL 3 & 4: HỌC LIỆU & GAMES */}
                        {isGradeExpanded && (
                          <div className="pl-6 pr-3 py-2 border-t border-slate-100 bg-slate-50/40 space-y-2">
                            {gradeMaterials.length === 0 ? (
                              <p className="text-xs text-slate-400 italic py-1">Chưa có bài học trong khối này</p>
                            ) : (
                              gradeMaterials.map((mat) => (
                                <div 
                                  key={mat.id}
                                  className="p-2.5 rounded-xl bg-white border border-teal-100/80 hover:border-[#40c7b1] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all"
                                >
                                  <div className="flex items-center gap-2.5">
                                    {mat.type === 'game_html5' ? (
                                      <Gamepad2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    ) : (
                                      <Presentation className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    )}
                                    <div>
                                      <h5 className="text-xs font-extrabold text-slate-800">{mat.title}</h5>
                                      <p className="text-[10px] text-slate-400">{mat.description}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <button
                                      onClick={() => onSelectMaterial(mat)}
                                      className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold rounded-full flex items-center gap-1 transition-colors"
                                    >
                                      {mat.type === 'game_html5' ? <Play className="w-3 h-3 text-[#36b3a0]" /> : <Eye className="w-3 h-3 text-[#36b3a0]" />}
                                      {mat.type === 'game_html5' ? 'Chơi Game' : 'Xem PDF/Slide'}
                                    </button>

                                    {onAssignMaterial && (
                                      <button
                                        onClick={() => onAssignMaterial(mat)}
                                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 text-[11px] font-extrabold rounded-full transition-colors"
                                      >
                                        Giao Bài
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
