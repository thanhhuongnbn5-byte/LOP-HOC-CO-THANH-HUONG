import React, { useState, useEffect } from 'react';
import { X, Star, Trophy, Sparkles, RefreshCw, CheckCircle, Volume2, HelpCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export const InteractiveGameModal = ({ isOpen, onClose, gameMaterial }) => {
  const { addStars } = useAuth();
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'completed'
  const [score, setScore] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  
  // Game 1: Gold Miner state
  const [goldQuestionIdx, setGoldQuestionIdx] = useState(0);
  const [reeling, setReeling] = useState(false);

  // Game 2: Whack-a-mole state
  const [moles, setMoles] = useState([
    { id: 1, word: 'Chạy', isCorrect: true, active: true },
    { id: 2, word: 'Bàn học', isCorrect: false, active: true },
    { id: 3, word: 'Hát', isCorrect: true, active: false },
    { id: 4, word: 'Quyển sách', isCorrect: false, active: true },
    { id: 5, word: 'Nảy mầm', isCorrect: true, active: false },
    { id: 6, word: 'Cây thông', isCorrect: false, active: true }
  ]);

  // Game 4: Millionaire state
  const [milQuestionIdx, setMilQuestionIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setGameState('playing');
      setScore(0);
      setEarnedStars(0);
      setGoldQuestionIdx(0);
      setMilQuestionIdx(0);
    }
  }, [isOpen]);

  if (!isOpen || !gameMaterial) return null;

  const gameType = gameMaterial.game_type || 'gold_miner';

  const finishGame = (finalScore, bonusStars) => {
    setScore(finalScore);
    setEarnedStars(bonusStars);
    setGameState('completed');
    addStars(bonusStars);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };

  // Sample data for Gold Miner Math Game
  const goldQuestions = [
    { q: 'Phép tính nào sau đây có kết quả bằng 24?', options: ['6 × 4', '5 × 5', '7 × 3', '8 × 2'], ans: 0 },
    { q: '36 chia cho 4 bằng bao nhiêu?', options: ['8', '9', '7', '6'], ans: 1 },
    { q: 'Một tuần có 7 ngày. Hỏi 4 tuần có bao nhiêu ngày?', options: ['21 ngày', '24 ngày', '28 ngày', '30 ngày'], ans: 2 }
  ];

  // Sample data for Millionaire Trivia Game
  const millionaireQuestions = [
    { q: 'Loài chim nào không biết bay nhưng bơi rất giỏi?', options: ['Chim Bồ Câu', 'Chim Cánh Cụt', 'Chim Đại Bàng', 'Chim Vẹt'], ans: 1 },
    { q: 'Cơ quan nào trong cơ thể giúp chúng ta hô hấp lấy Oxy?', options: ['Dạ dày', 'Trái tim', 'Lá Phổi', 'Bộ não'], ans: 2 },
    { q: 'Trái đất quay xung quanh hành tinh nào?', options: ['Mặt Trăng', 'Mặt Trời', 'Sao Hỏa', 'Sao Kim'], ans: 1 }
  ];

  const handleGoldAnswer = (idx) => {
    if (reeling) return;
    setReeling(true);

    const currentQ = goldQuestions[goldQuestionIdx];
    const isRight = idx === currentQ.ans;

    setTimeout(() => {
      setReeling(false);
      if (isRight) setScore(prev => prev + 100);

      if (goldQuestionIdx + 1 < goldQuestions.length) {
        setGoldQuestionIdx(prev => prev + 1);
      } else {
        finishGame(isRight ? score + 100 : score, 15);
      }
    }, 1200);
  };

  const handleWhackMole = (id, isCorrect) => {
    setMoles(prev => prev.map(m => m.id === id ? { ...m, active: false } : m));
    if (isCorrect) {
      setScore(prev => prev + 50);
      if (score + 50 >= 150) {
        finishGame(200, 20);
      }
    }
  };

  const handleMilAnswer = (idx) => {
    const currentQ = millionaireQuestions[milQuestionIdx];
    const isRight = idx === currentQ.ans;

    if (isRight) {
      const nextScore = (milQuestionIdx + 1) * 1000;
      setScore(nextScore);
      if (milQuestionIdx + 1 < millionaireQuestions.length) {
        setMilQuestionIdx(prev => prev + 1);
      } else {
        finishGame(nextScore, 25);
      }
    } else {
      finishGame(score, 10);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 text-white w-full max-w-4xl rounded-3xl shadow-2xl border-4 border-[#40c7b1] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* TOP BAR */}
        <div className="bg-[#40c7b1] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <h3 className="text-lg font-black text-white">{gameMaterial.title}</h3>
              <p className="text-xs text-teal-100">Lớp {gameMaterial.grade_level || 3} • Tương tác Edulive HTML5</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-teal-800/40 px-4 py-1.5 rounded-full font-black text-amber-300 flex items-center gap-1 text-sm border border-teal-300/30">
              <Star className="w-4 h-4 fill-amber-300" />
              Điểm: {score}
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* GAME CANVAS AREA */}
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-center min-h-[420px]">
          
          {gameState === 'completed' ? (
            /* FINISH SCREEN */
            <div className="text-center space-y-6 py-8">
              <div className="w-24 h-24 bg-amber-400/20 border-4 border-amber-400 rounded-full mx-auto flex items-center justify-center animate-bounce">
                <Trophy className="w-12 h-12 text-amber-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-amber-300">XUẤT SẮC! HOÀN THÀNH TRÒ CHƠI</h2>
                <p className="text-slate-300 font-semibold text-lg">Bạn đã dành được <strong className="text-white">{score} điểm</strong></p>
              </div>

              <div className="bg-amber-400/10 border-2 border-amber-400/30 p-4 rounded-2xl max-w-sm mx-auto flex items-center justify-center gap-3 text-amber-300 font-black text-xl">
                <Sparkles className="w-6 h-6 fill-amber-300" />
                + {earnedStars} SAO THƯỞNG!
              </div>

              <button
                onClick={() => { setGameState('playing'); setScore(0); setGoldQuestionIdx(0); setMilQuestionIdx(0); }}
                className="btn-eduyellow mx-auto px-8 py-3 text-base"
              >
                <RefreshCw className="w-5 h-5" /> Chơi Lại Trò Chơi
              </button>
            </div>
          ) : (
            /* ACTIVE GAME RENDER */
            <>
              {gameType === 'gold_miner' && (
                /* GAME 1: ĐÀO VÀNG */
                <div className="space-y-6 text-center">
                  <div className="relative h-48 bg-amber-950/40 rounded-2xl border-2 border-amber-600/40 overflow-hidden flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" 
                      alt="Gold Mine"
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    
                    {/* Claw reel line */}
                    <div className={`absolute top-0 w-1 bg-amber-400 transition-all duration-700 ${reeling ? 'h-36' : 'h-10'}`}></div>
                    <div className={`absolute text-3xl transition-all duration-700 ${reeling ? 'top-32 scale-125' : 'top-8'}`}>
                      ⛏️
                    </div>

                    <div className="absolute bottom-4 flex justify-around w-full px-8">
                      <span className="text-4xl animate-pulse">💰</span>
                      <span className="text-3xl">💎</span>
                      <span className="text-4xl animate-pulse">🥇</span>
                    </div>
                  </div>

                  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <h4 className="text-lg font-bold text-amber-300">
                      Câu hỏi {goldQuestionIdx + 1}/{goldQuestions.length}: {goldQuestions[goldQuestionIdx].q}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {goldQuestions[goldQuestionIdx].options.map((opt, idx) => (
                        <button
                          key={idx}
                          disabled={reeling}
                          onClick={() => handleGoldAnswer(idx)}
                          className="p-3.5 bg-slate-700 hover:bg-[#36b3a0] text-white font-extrabold rounded-xl transition-all border border-slate-600 hover:border-teal-300 text-left flex items-center gap-3"
                        >
                          <span className="w-7 h-7 rounded-full bg-slate-900/40 flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {gameType === 'whack_mole' && (
                /* GAME 2: ĐẬP CHUỘT */
                <div className="space-y-6 text-center">
                  <div className="bg-teal-900/30 p-3 rounded-xl border border-teal-500/30 text-teal-200 font-bold text-sm">
                    🎯 Hãy click đập những chú chuột mang <strong>TỪ CHỈ HOẠT ĐỘNG</strong>!
                  </div>

                  <div className="grid grid-cols-3 gap-6 py-4">
                    {moles.map((mole) => (
                      <div 
                        key={mole.id}
                        className="h-28 bg-amber-900/60 rounded-2xl border-4 border-amber-700/50 flex items-center justify-center relative overflow-hidden group cursor-pointer"
                        onClick={() => mole.active && handleWhackMole(mole.id, mole.isCorrect)}
                      >
                        {mole.active ? (
                          <div className="text-center space-y-1 transform transition-all group-hover:scale-110">
                            <span className="text-4xl block">🐹</span>
                            <span className="bg-amber-400 text-slate-900 font-black text-xs px-2 py-0.5 rounded-full">
                              {mole.word}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-500">Đã đập! ✨</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {gameType === 'millionaire' && (
                /* GAME 4: AI LÀ TRIỆU PHÚ */
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-amber-500/20 border-4 border-amber-400 rounded-full mx-auto flex items-center justify-center">
                    <Award className="w-10 h-10 text-amber-400" />
                  </div>

                  <div className="bg-blue-950/60 p-6 rounded-2xl border-2 border-amber-400/40 space-y-4">
                    <h4 className="text-xl font-extrabold text-white">
                      Câu {milQuestionIdx + 1}: {millionaireQuestions[milQuestionIdx].q}
                    </h4>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {millionaireQuestions[milQuestionIdx].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleMilAnswer(idx)}
                          className="p-4 bg-blue-900/80 hover:bg-amber-500 hover:text-slate-900 text-white font-black text-base rounded-full transition-all border-2 border-blue-400/50 hover:border-amber-300 text-left px-6 flex items-center gap-3"
                        >
                          <span className="text-amber-300 font-mono">{String.fromCharCode(65 + idx)}:</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DEFAULT / FALLBACK GAME */}
              {['crossword', 'word_scramble'].includes(gameType) && (
                <div className="text-center space-y-6 py-6">
                  <div className="text-6xl animate-pulse">🧩</div>
                  <h4 className="text-2xl font-black text-amber-300">Trò Chơi Xếp Từ Tương Tác</h4>
                  <p className="text-sm text-slate-300">Kéo thả các mảnh ghép chữ cái tương ứng để hoàn thành từ đúng!</p>
                  <button 
                    onClick={() => finishGame(100, 15)} 
                    className="btn-edumint px-8 py-3 text-base mx-auto"
                  >
                    Hoàn Thành Nhận +15 Sao!
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
