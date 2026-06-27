import React, { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../services/api'
import { getInitials, getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'

export default function StudentProfile() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    rollNumber: user?.rollNumber || '',
  })

  const [pwForm, setPwForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  })

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await userAPI.updateProfile(profileForm)
      updateUser({ name: data.name, phone: data.phone, department: data.department, rollNumber: data.rollNumber })
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match'); return
    }
    setLoading(true)
    try {
      await userAPI.changePassword(pwForm)
      toast.success('Password changed successfully')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handlePicUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const { data } = await userAPI.uploadPicture(fd)
      const fileName = data.url.split('/').pop()
      updateUser({ profilePicture: fileName })
      toast.success('Profile picture updated')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account information and settings</p>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div className="user-avatar"
               style={{ width: 80, height: 80, fontSize: '1.8rem', cursor: 'pointer' }}
               onClick={() => fileRef.current.click()}>
            {user?.profilePicture
              ? <img src={`/api/complaints/images/${user.profilePicture}`} alt="Profile" />
              : getInitials(user?.name)}
          </div>
          <input type="file" ref={fileRef} style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png" onChange={handlePicUpload} />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user?.name}</h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>{user?.email}</p>
            <span className="badge badge-accepted" style={{ marginTop: 6 }}>{user?.role}</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => fileRef.current.click()}>
            📷 Change Photo
          </button>
        </div>
      </div>

      <div className="auth-tabs" style={{ background: 'white', borderRadius: 'var(--radius)', padding: '0 16px' }}>
        <div className={`auth-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
          Edit Profile
        </div>
        <div className={`auth-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
          Change Password
        </div>
        <div className={`auth-tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
          Account Info
        </div>
      </div>

      {tab === 'profile' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>Edit Profile</div>
          <form onSubmit={handleProfileSave}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input className="form-control" required value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input className="form-control" placeholder="e.g. 22CS101"
                  value={profileForm.rollNumber}
                  onChange={e => setProfileForm({ ...profileForm, rollNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-control" placeholder="e.g. Computer Science"
                  value={profileForm.department}
                  onChange={e => setProfileForm({ ...profileForm, department: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" type="tel" placeholder="10-digit mobile"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" value={user?.email} disabled
                style={{ background: 'var(--light)', cursor: 'not-allowed' }} />
              <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: 3 }}>
                Email cannot be changed
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>Change Password</div>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password <span className="required">*</span></label>
              <input className="form-control" type="password" required
                value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">New Password <span className="required">*</span></label>
              <input className="form-control" type="password" required minLength={6}
                placeholder="Minimum 6 characters"
                value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password <span className="required">*</span></label>
              <input className="form-control" type="password" required
                value={pwForm.confirmPassword}
                onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : '🔒 Update Password'}
            </button>
          </form>
        </div>
      )}

      {tab === 'info' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>Account Information</div>
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Roll Number', value: user?.rollNumber || '—' },
            { label: 'Department', value: user?.department || '—' },
            { label: 'Phone', value: user?.phone || '—' },
            { label: 'Role', value: user?.role },
          ].map(f => (
            <div key={f.label} className="detail-field">
              <label>{f.label}</label>
              <p>{f.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
