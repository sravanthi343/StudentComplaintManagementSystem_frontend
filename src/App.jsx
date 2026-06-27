import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'

// Public
import AuthPage from './pages/public/AuthPage'
import { AboutPage, ContactPage, FAQPage } from './pages/public/InfoPages'

// Student
import StudentDashboard from './pages/student/StudentDashboard'
import StudentComplaints from './pages/student/StudentComplaints'
import ComplaintDetail from './pages/student/ComplaintDetail'
import FileComplaint from './pages/student/FileComplaint'
import StudentProfile from './pages/student/StudentProfile'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminComplaintDetail from './pages/admin/AdminComplaintDetail'

function RequireAuth({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
  }
  return children
}

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Protected layout */}
          <Route element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }>
            {/* Info pages (accessible to both roles) */}
            <Route path="/about"   element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq"     element={<FAQPage />} />

            {/* Student routes */}
            <Route path="/student/dashboard"    element={<RequireAuth role="STUDENT"><StudentDashboard /></RequireAuth>} />
            <Route path="/student/complaints"   element={<RequireAuth role="STUDENT"><StudentComplaints /></RequireAuth>} />
            <Route path="/student/complaints/:id" element={<RequireAuth role="STUDENT"><ComplaintDetail /></RequireAuth>} />
            <Route path="/student/file-complaint" element={<RequireAuth role="STUDENT"><FileComplaint /></RequireAuth>} />
            <Route path="/student/profile"      element={<RequireAuth role="STUDENT"><StudentProfile /></RequireAuth>} />

            {/* Admin routes */}
            <Route path="/admin/dashboard"      element={<RequireAuth role="ADMIN"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/complaints"     element={<RequireAuth role="ADMIN"><AdminComplaints /></RequireAuth>} />
            <Route path="/admin/complaints/:id" element={<RequireAuth role="ADMIN"><AdminComplaintDetail /></RequireAuth>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
