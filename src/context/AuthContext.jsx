import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, getStoredData, setStoredData, generateStudentCode } from '../lib/supabase';

const AuthContext = createContext();

// Pre-configured accounts for instant login demo
const DEMO_USERS = [
  {
    id: 'teacher-1',
    email: 'giaovien@edunbn.vn',
    full_name: 'Cô Lê Thị Thanh Hương',
    role: 'teacher',
    grade_level: 3,
    student_code: null,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    total_stars: 0
  },
  {
    id: 'student-1',
    email: 'hocsinh@edunbn.vn',
    full_name: 'Trần Minh Anh',
    role: 'student',
    grade_level: 3,
    student_code: 'ST8K92A1',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=student1',
    total_stars: 45
  },
  {
    id: 'parent-1',
    email: 'phuhuynh@edunbn.vn',
    full_name: 'Bác Trần Văn Nam',
    role: 'parent',
    grade_level: null,
    student_code: null,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    total_stars: 0
  },
  {
    id: 'admin-1',
    email: 'admin@edunbn.vn',
    full_name: 'Quản Trị Viên EduNBN',
    role: 'admin',
    grade_level: null,
    student_code: null,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    total_stars: 0
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize stored users list
  const [usersList, setUsersList] = useState(() => getStoredData('users_list', DEMO_USERS));

  useEffect(() => {
    setStoredData('users_list', usersList);
  }, [usersList]);

  // Sync session on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            // Restore demo session if saved
            const savedUser = getStoredData('current_user', DEMO_USERS[0]);
            if (savedUser) {
              setUser({ id: savedUser.id, email: savedUser.email });
              setProfile(savedUser);
              setActiveRole(savedUser.role);
            }
          }
        } catch (err) {
          console.warn('Supabase auth session fetch error, using stored user', err);
          const savedUser = getStoredData('current_user', DEMO_USERS[0]);
          if (savedUser) {
            setUser({ id: savedUser.id, email: savedUser.email });
            setProfile(savedUser);
            setActiveRole(savedUser.role);
          }
        }
      } else {
        // Fallback demo user loading
        const savedUser = getStoredData('current_user', DEMO_USERS[0]);
        if (savedUser) {
          setUser({ id: savedUser.id, email: savedUser.email });
          setProfile(savedUser);
          setActiveRole(savedUser.role);
        }
      }

      setLoading(false);
    };

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setActiveRole(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data);
        setActiveRole(data.role);
        setStoredData('current_user', data);
      } else {
        // Fallback local search
        const found = usersList.find(u => u.id === userId);
        if (found) {
          setProfile(found);
          setActiveRole(found.role);
          setStoredData('current_user', found);
        }
      }
    } catch (err) {
      console.warn('Fetch profile error:', err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        await fetchProfile(data.user.id);
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.warn('Supabase login failed, trying demo user matching:', err.message);
    }

    // Demo user login logic
    const matched = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser({ id: matched.id, email: matched.email });
      setProfile(matched);
      setActiveRole(matched.role);
      setStoredData('current_user', matched);
      setLoading(false);
      return { success: true };
    }

    // Create instant fallback account
    const newDemoUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      role: 'student',
      grade_level: 3,
      student_code: generateStudentCode(),
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      total_stars: 10
    };

    setUsersList(prev => [...prev, newDemoUser]);
    setUser({ id: newDemoUser.id, email: newDemoUser.email });
    setProfile(newDemoUser);
    setActiveRole(newDemoUser.role);
    setStoredData('current_user', newDemoUser);
    setLoading(false);
    return { success: true };
  };

  const signup = async ({ email, password, full_name, role, grade_level }) => {
    setLoading(true);
    const studentCode = role === 'student' ? generateStudentCode() : null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name,
              role,
              grade_level: parseInt(grade_level) || 1,
              student_code: studentCode
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          await fetchProfile(data.user.id);
          setLoading(false);
          return { success: true };
        }
      } catch (err) {
        console.warn('Supabase signup fallback to local demo store:', err.message);
      }
    }

    const newUserProfile = {
      id: `user-${Date.now()}`,
      email,
      full_name,
      role,
      grade_level: parseInt(grade_level) || 3,
      student_code: studentCode,
      avatar_url: role === 'student'
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      total_stars: 0,
      created_at: new Date().toISOString()
    };

    setUsersList(prev => [...prev, newUserProfile]);
    setUser({ id: newUserProfile.id, email: newUserProfile.email });
    setProfile(newUserProfile);
    setActiveRole(newUserProfile.role);
    setStoredData('current_user', newUserProfile);
    setLoading(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setActiveRole(null);
    localStorage.removeItem(`edulive_app_data_v1_current_user`);
  };

  // Quick switch role (For demo & testing)
  const switchRole = (newRole) => {
    setActiveRole(newRole);
  };

  // Quick login demo shortcut
  const loginAsDemo = (roleName) => {
    const found = DEMO_USERS.find(u => u.role === roleName);
    if (found) {
      setUser({ id: found.id, email: found.email });
      setProfile(found);
      setActiveRole(found.role);
      setStoredData('current_user', found);
    }
  };

  // Add stars to current student profile
  const addStars = async (starCount) => {
    if (!profile) return;
    const newTotal = (profile.total_stars || 0) + starCount;
    const updated = { ...profile, total_stars: newTotal };
    setProfile(updated);
    setStoredData('current_user', updated);

    // Update in list
    setUsersList(prev => prev.map(u => u.id === profile.id ? updated : u));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').update({ total_stars: newTotal }).eq('id', profile.id);
      } catch (err) {
        console.warn('Supabase update stars error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role: activeRole || profile?.role,
      loading,
      login,
      signup,
      logout,
      switchRole,
      loginAsDemo,
      addStars,
      usersList
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
