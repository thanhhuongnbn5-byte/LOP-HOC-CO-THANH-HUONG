import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { StudentPortal } from './pages/StudentPortal';
import { TeacherPortal } from './pages/TeacherPortal';
import { ParentPortal } from './pages/ParentPortal';
import { AdminDashboard } from './pages/AdminDashboard';
import { JoinClassPage } from './pages/JoinClassPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/student" element={<StudentPortal />} />
      <Route path="/teacher" element={<TeacherPortal />} />
      <Route path="/parent" element={<ParentPortal />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/join-class" element={<JoinClassPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
