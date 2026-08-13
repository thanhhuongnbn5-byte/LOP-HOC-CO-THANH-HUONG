-- =======================================================
-- EDULIVE PRIMARY EDTECH PLATFORM - FULL DATABASE SCHEMA
-- PostgreSQL + Supabase RLS + Functions & Seed Data
-- =======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------
-- 1. PROFILES TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    grade_level INT CHECK (grade_level BETWEEN 1 AND 5),
    student_code VARCHAR(8) UNIQUE,
    avatar_url TEXT,
    total_stars INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 2. PARENT_STUDENT_LINKS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parent_student_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    relationship_type TEXT DEFAULT 'father' CHECK (relationship_type IN ('father', 'mother', 'guardian')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_parent_student UNIQUE(parent_id, student_id)
);

-- -------------------------------------------------------
-- 3. SUBJECTS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    icon TEXT,
    color TEXT DEFAULT '#40c7b1'
);

-- -------------------------------------------------------
-- 4. CLASSES TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    description TEXT,
    code VARCHAR(6) UNIQUE NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 5. CLASS_MEMBERS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_class_student UNIQUE(class_id, student_id)
);

-- -------------------------------------------------------
-- 6. COURSES TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    thumbnail_url TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 7. LESSONS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 8. MATERIALS TABLE (Educational Games, Slides, Docs)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    type TEXT NOT NULL CHECK (type IN ('document', 'video', 'interactive_slide', 'game_iframe', 'game_html5')),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    grade_level INT CHECK (grade_level BETWEEN 1 AND 5),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 9. ASSIGNMENTS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    reward_stars INT DEFAULT 10,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 10. STUDENT_PROGRESS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'completed')),
    score INT DEFAULT 0,
    stars_earned INT DEFAULT 0,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_assignment_student UNIQUE(assignment_id, student_id)
);

-- -------------------------------------------------------
-- 11. TEACHER_FEEDBACKS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teacher_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    rating_stars INT DEFAULT 5 CHECK (rating_stars BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 12. BADGES TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    required_stars INT DEFAULT 20
);

-- -------------------------------------------------------
-- 13. STUDENT_BADGES TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_badge UNIQUE(student_id, badge_id)
);


-- =======================================================
-- FUNCTIONS & TRIGGERS
-- =======================================================

-- 1. Function generate unique 6-character Class Code
CREATE OR REPLACE FUNCTION generate_unique_class_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INT;
    code_exists BOOLEAN := true;
BEGIN
    WHILE code_exists LOOP
        result := '';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        SELECT EXISTS (
            SELECT 1 FROM public.classes WHERE code = result
        ) INTO code_exists;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 2. Function generate unique 8-character Student Code
CREATE OR REPLACE FUNCTION generate_student_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'STU';
    i INT;
    code_exists BOOLEAN := true;
BEGIN
    WHILE code_exists LOOP
        result := 'ST';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        SELECT EXISTS (
            SELECT 1 FROM public.profiles WHERE student_code = result
        ) INTO code_exists;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    user_fullname TEXT;
    user_grade INT;
    generated_code TEXT := NULL;
BEGIN
    user_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
    user_fullname := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
    user_grade := (new.raw_user_meta_data->>'grade_level')::INT;

    IF user_role = 'student' THEN
        generated_code := public.generate_student_code();
    END IF;

    INSERT INTO public.profiles (id, email, full_name, role, grade_level, student_code, avatar_url, total_stars)
    VALUES (
        new.id,
        new.email,
        user_fullname,
        user_role,
        user_grade,
        generated_code,
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- Helper RLS helper functions
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES Policies
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "Admin profile full" ON public.profiles FOR ALL USING (is_admin());

-- PARENT_STUDENT_LINKS Policies (Strict Parent-Student Isolation)
CREATE POLICY "Parents read linked students" ON public.parent_student_links FOR SELECT USING (
    parent_id = auth.uid() OR student_id = auth.uid() OR is_admin()
);
CREATE POLICY "Parents add links" ON public.parent_student_links FOR INSERT WITH CHECK (
    parent_id = auth.uid() OR is_admin()
);
CREATE POLICY "Parents delete links" ON public.parent_student_links FOR DELETE USING (
    parent_id = auth.uid() OR is_admin()
);

-- SUBJECTS Policies
CREATE POLICY "Anyone read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admin write subjects" ON public.subjects FOR ALL USING (is_admin());

-- CLASSES Policies
CREATE POLICY "Read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Teachers create classes" ON public.classes FOR INSERT WITH CHECK (
    auth.uid() = teacher_id OR is_admin()
);
CREATE POLICY "Teachers update own classes" ON public.classes FOR UPDATE USING (
    auth.uid() = teacher_id OR is_admin()
);

-- CLASS_MEMBERS Policies
CREATE POLICY "Read class members" ON public.class_members FOR SELECT USING (true);
CREATE POLICY "Students or teachers join class" ON public.class_members FOR INSERT WITH CHECK (true);

-- COURSES & LESSONS Policies
CREATE POLICY "Read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Teachers write courses" ON public.courses FOR ALL USING (auth.uid() = author_id OR is_admin());
CREATE POLICY "Read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Teachers write lessons" ON public.lessons FOR ALL USING (is_admin() OR EXISTS (
    SELECT 1 FROM public.courses WHERE id = lessons.course_id AND author_id = auth.uid()
));

-- MATERIALS Policies
CREATE POLICY "Read materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Teachers create materials" ON public.materials FOR INSERT WITH CHECK (auth.uid() = author_id OR is_admin());

-- ASSIGNMENTS & PROGRESS Policies
CREATE POLICY "Read assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Teachers write assignments" ON public.assignments FOR ALL USING (is_admin() OR EXISTS (
    SELECT 1 FROM public.classes WHERE id = assignments.class_id AND teacher_id = auth.uid()
));
CREATE POLICY "Read progress" ON public.student_progress FOR SELECT USING (
    student_id = auth.uid() 
    OR is_admin()
    OR EXISTS (
        SELECT 1 FROM public.parent_student_links WHERE parent_id = auth.uid() AND student_id = student_progress.student_id
    )
    OR EXISTS (
        SELECT 1 FROM public.assignments a 
        JOIN public.classes c ON a.class_id = c.id 
        WHERE a.id = student_progress.assignment_id AND c.teacher_id = auth.uid()
    )
);
CREATE POLICY "Students insert/update progress" ON public.student_progress FOR INSERT WITH CHECK (student_id = auth.uid() OR is_admin());
CREATE POLICY "Students update own progress" ON public.student_progress FOR UPDATE USING (student_id = auth.uid() OR is_admin());

-- TEACHER FEEDBACKS Policies
CREATE POLICY "Read feedbacks" ON public.teacher_feedbacks FOR SELECT USING (
    student_id = auth.uid()
    OR teacher_id = auth.uid()
    OR is_admin()
    OR EXISTS (
        SELECT 1 FROM public.parent_student_links WHERE parent_id = auth.uid() AND student_id = teacher_feedbacks.student_id
    )
);
CREATE POLICY "Teachers write feedback" ON public.teacher_feedbacks FOR INSERT WITH CHECK (teacher_id = auth.uid() OR is_admin());

-- BADGES Policies
CREATE POLICY "Read badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Read student badges" ON public.student_badges FOR SELECT USING (true);
CREATE POLICY "Unlock student badges" ON public.student_badges FOR INSERT WITH CHECK (student_id = auth.uid() OR is_admin());


-- =======================================================
-- SEED DATA (TAXONOMY & BADGES)
-- =======================================================

INSERT INTO public.subjects (name, code, icon, color) VALUES
('Toán học', 'MATH', 'Calculator', '#3b82f6'),
('Tiếng Việt', 'VIET', 'BookOpen', '#ef4444'),
('Tiếng Anh', 'ENG', 'Languages', '#8b5cf6'),
('Tự nhiên & Xã hội', 'SCIENCE', 'Globe', '#10b981'),
('Đạo đức', 'ETHICS', 'Heart', '#f59e0b'),
('Tin học', 'IT', 'Monitor', '#06b6d4'),
('Nghệ thuật', 'ART', 'Palette', '#ec4899')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.badges (title, description, icon_url, required_stars) VALUES
('Mầm Non Tri Thức', 'Hoàn thành bài học đầu tiên', '🌱', 10),
('Ngôi Sao Toán Học', 'Tích lũy 30 Sao từ các bài tập Toán', '⭐', 30),
('Thợ Săn Kho Báu', 'Chơi thành công 5 trò chơi Đào vàng', '⛏️', 50),
('Siêu Cấp Siêu Trí Tuệ', 'Tích lũy 100 Sao tích cực', '🏆', 100),
('Dũng Sĩ Ô Chữ', 'Giải thành công trò chơi Ô chữ', '🧩', 70)
ON CONFLICT DO NOTHING;
