import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Internships from './pages/Internships';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentApplications from './pages/student/StudentApplications';
import StudentInternships from './pages/student/StudentInternships';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import CompanyApplications from './pages/company/CompanyApplications';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';

// Redirect logged-in users away from auth pages
const GuestRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (user) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'company') return <Navigate to="/company/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }
  return children;
};

// Protect routes that require auth
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading..." /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/internships" element={<Internships />} />

          {/* Auth — redirect if already logged in */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* ── Student ── */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/dashboard/profile" element={
            <ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>
          } />
          <Route path="/student/dashboard/applications" element={
            <ProtectedRoute allowedRoles={['student']}><StudentApplications /></ProtectedRoute>
          } />
          <Route path="/student/dashboard/internships" element={
            <ProtectedRoute allowedRoles={['student']}><StudentInternships /></ProtectedRoute>
          } />

          {/* ── Company ── */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>
          } />
          <Route path="/company/dashboard/profile" element={
            <ProtectedRoute allowedRoles={['company']}><CompanyProfile /></ProtectedRoute>
          } />
          <Route path="/company/dashboard/internships/:internshipId/applications" element={
            <ProtectedRoute allowedRoles={['company']}><CompanyApplications /></ProtectedRoute>
          } />

          {/* ── Admin ── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/dashboard/profile" element={
            <ProtectedRoute allowedRoles={['admin']}><CompanyProfile /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#1e293b',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
