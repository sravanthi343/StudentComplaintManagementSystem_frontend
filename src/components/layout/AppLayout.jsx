import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const pageTitles = {
  '/student/dashboard': 'Dashboard',
  '/student/complaints': 'My Complaints',
  '/student/file-complaint': 'File a Complaint',
  '/student/profile': 'My Profile',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/complaints': 'All Complaints',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/faq': 'FAQ',
}

export default function AppLayout() {
  const location = useLocation()
  const title = Object.entries(pageTitles).find(([k]) =>
    location.pathname === k || location.pathname.startsWith(k + '/')
  )?.[1] || 'SCMS'

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-actions">
            <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
              Student Complaint Management System
            </span>
          </div>
        </header>
        <div className="page-body">
          <Outlet />
        </div>
        <footer className="app-footer">
          © {new Date().getFullYear()} Student Complaint Management System. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
