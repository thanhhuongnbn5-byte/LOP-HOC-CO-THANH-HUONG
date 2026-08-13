import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dorxwxczijzgubkbhppd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcnh3eGN6aWp6Z3Via2JocHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjQzNDYsImV4cCI6MjEwMjIwMDM0Nn0.Yf7ARNwAjv_RgvIlcVWHW6JMl3m9P3OMrP5x4odymdU';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Seed data storage key for local offline/hybrid state synchronization
const LOCAL_STORAGE_PREFIX = 'edulive_app_data_v1';

export const getStoredData = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch (err) {
    console.error('Error reading localStorage', err);
    return defaultVal;
  }
};

export const setStoredData = (key, val) => {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_${key}`, JSON.stringify(val));
  } catch (err) {
    console.error('Error setting localStorage', err);
  }
};

// Initial Seed Data for immediate interactive testing
export const INITIAL_MOCK_SUBJECTS = [
  { id: 'sub-1', name: 'Toán học', code: 'MATH', icon: 'Calculator', color: '#3b82f6' },
  { id: 'sub-2', name: 'Tiếng Việt', code: 'VIET', icon: 'BookOpen', color: '#ef4444' },
  { id: 'sub-3', name: 'Tiếng Anh', code: 'ENG', icon: 'Languages', color: '#8b5cf6' },
  { id: 'sub-4', name: 'Tự nhiên & Xã hội', code: 'SCIENCE', icon: 'Globe', color: '#10b981' },
  { id: 'sub-5', name: 'Đạo đức', code: 'ETHICS', icon: 'Heart', color: '#f59e0b' },
  { id: 'sub-6', name: 'Tin học', code: 'IT', icon: 'Monitor', color: '#06b6d4' },
  { id: 'sub-7', name: 'Nghệ thuật', code: 'ART', icon: 'Palette', color: '#ec4899' }
];

export const INITIAL_MOCK_CLASSES = [
  {
    id: 'class-1',
    name: 'Lớp 3A1 - Toán Học Vui',
    grade_level: 3,
    description: 'Lớp học Toán tương tác sáng tạo cho học sinh Lớp 3',
    code: 'A8K2P9',
    teacher_id: 'teacher-1',
    teacher_name: 'Cô Lê Thị Thanh Hương',
    created_at: new Date().toISOString()
  },
  {
    id: 'class-2',
    name: 'Lớp 1B - Tiếng Việt Khám Phá',
    grade_level: 1,
    description: 'Học vần và ghép từ qua trò chơi tương tác',
    code: 'V8M4K1',
    teacher_id: 'teacher-1',
    teacher_name: 'Cô Lê Thị Thanh Hương',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_MOCK_MATERIALS = [
  {
    id: 'mat-1',
    title: 'Trò chơi "Đào Vàng" - Phép Nhân & Phép Chia (Lớp 3)',
    description: 'Thu thập vàng bằng cách trả lời đúng các câu hỏi phép nhân chia.',
    type: 'game_html5',
    game_type: 'gold_miner',
    grade_level: 3,
    subject_id: 'sub-1',
    file_url: 'gold_miner_game',
    created_at: new Date().toISOString()
  },
  {
    id: 'mat-2',
    title: 'Trò chơi "Đập Chuột" - Nhận Biết Từ Chỉ Hoạt Động (Lớp 2)',
    description: 'Đập trúng những chú chuột mang từ chỉ hoạt động đúng.',
    type: 'game_html5',
    game_type: 'whack_mole',
    grade_level: 2,
    subject_id: 'sub-2',
    file_url: 'whack_mole_game',
    created_at: new Date().toISOString()
  },
  {
    id: 'mat-3',
    title: 'Trò chơi "Giải Ô Chữ" - Từ Vựng Tiếng Anh Sinh Vật (Lớp 4)',
    description: 'Điền các từ tiếng anh về động vật vào ô chữ tương ứng.',
    type: 'game_html5',
    game_type: 'crossword',
    grade_level: 4,
    subject_id: 'sub-3',
    file_url: 'crossword_game',
    created_at: new Date().toISOString()
  },
  {
    id: 'mat-4',
    title: 'Trò chơi "Ai Là Triệu Phú" - Đố Vui Khoa Học Tự Nhiên (Lớp 5)',
    description: 'Vượt qua 10 câu hỏi đố vui để dành ngôi vị Triệu Phú Tri Thức!',
    type: 'game_html5',
    game_type: 'millionaire',
    grade_level: 5,
    subject_id: 'sub-4',
    file_url: 'millionaire_game',
    created_at: new Date().toISOString()
  },
  {
    id: 'mat-5',
    title: 'Trò chơi "Sắp Xếp Chữ Cái" - Ghép Từ Tiếng Việt (Lớp 1)',
    description: 'Kéo thả các chữ cái để tạo thành từ đúng có nghĩa.',
    type: 'game_html5',
    game_type: 'word_scramble',
    grade_level: 1,
    subject_id: 'sub-2',
    file_url: 'word_scramble_game',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_MOCK_ASSIGNMENTS = [
  {
    id: 'assign-1',
    class_id: 'class-1',
    material_id: 'mat-1',
    material_title: 'Trò chơi "Đào Vàng" - Phép Nhân & Phép Chia',
    reward_stars: 15,
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'assign-2',
    class_id: 'class-1',
    material_id: 'mat-3',
    material_title: 'Trò chơi "Giải Ô Chữ" - Từ Vựng Tiếng Anh',
    reward_stars: 20,
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    created_at: new Date().toISOString()
  }
];

export const INITIAL_MOCK_BADGES = [
  { id: 'b1', title: '🌱 Mầm Non Tri Thức', description: 'Hoàn thành bài học đầu tiên', required_stars: 10, icon: '🌱' },
  { id: 'b2', title: '⭐ Ngôi Sao Toán Học', description: 'Tích lũy 30 Sao từ bài tập Toán', required_stars: 30, icon: '⭐' },
  { id: 'b3', title: '⛏️ Thợ Săn Kho Báu', description: 'Chơi thành công trò chơi Đào Vàng', required_stars: 50, icon: '⛏️' },
  { id: 'b4', title: '🏆 Siêu Trí Tuệ EduNBN', description: 'Tích lũy 100 Sao tích cực', required_stars: 100, icon: '🏆' },
  { id: 'b5', title: '🧩 Dũng Sĩ Ô Chữ', description: 'Giải ô chữ thành công', required_stars: 70, icon: '🧩' }
];

// Helper to generate 6-char random code
export const generateClassCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper to generate 8-char student link code
export const generateStudentCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ST';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
