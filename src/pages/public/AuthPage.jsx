import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'
import { getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    rollNumber: '', department: '', phone: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.login(loginForm)
      login(data)
      toast.success(`Welcome back, ${data.name}!`)
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (regForm.password !== regForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { data } = await authAPI.register(regForm)
      login(data)
      toast.success('Registration successful! Welcome.')
      navigate('/student/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🎓 Student Complaint Management System</h1>
          <p>SCMS Portal — File and track your complaints</p>
        </div>

        <div className="auth-tabs">
          <div className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
               onClick={() => setTab('login')}>Login</div>
          <div className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
               onClick={() => setTab('register')}>Register</div>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <input className="form-control" type="email" required
                placeholder="student@college.edu"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <input className="form-control" type="password" required
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg"
                    style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-center text-muted mt-3" style={{ fontSize: '0.8rem' }}>
              Admin: admin@college.edu / Admin@123
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input className="form-control" type="text" required
                placeholder="Enter your full name"
                value={regForm.name}
                onChange={e => setRegForm({ ...regForm, name: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input className="form-control" type="email" required
                  placeholder="your@email.com"
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input className="form-control" type="text"
                  placeholder="e.g. 22CS101"
                  value={regForm.rollNumber}
                  onChange={e => setRegForm({ ...regForm, rollNumber: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-control" type="text"
                  placeholder="e.g. Computer Science"
                  value={regForm.department}
                  onChange={e => setRegForm({ ...regForm, department: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" type="tel"
                  placeholder="10-digit mobile"
                  value={regForm.phone}
                  onChange={e => setRegForm({ ...regForm, phone: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
                <input className="form-control" type="password" required
                  placeholder="Min 6 characters"
                  value={regForm.password}
                  onChange={e => setRegForm({ ...regForm, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password <span className="required">*</span></label>
                <input className="form-control" type="password" required
                  placeholder="Repeat password"
                  value={regForm.confirmPassword}
                  onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg"
                    style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
