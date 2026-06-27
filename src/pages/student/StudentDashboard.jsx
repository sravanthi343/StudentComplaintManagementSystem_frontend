import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { complaintAPI } from '../../services/api'
import { Spinner, StatusBadge, PriorityBadge } from '../../components/common'
import { formatDate, getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#ffc107','#1a3c5e','#17a2b8','#28a745','#6c757d','#dc3545']

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          complaintAPI.getStats(),
          complaintAPI.getAll({ page: 0, size: 5 })
        ])
        setStats(statsRes.data)
        setRecent(complaintsRes.data.content || [])
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Spinner />

  const pieData = stats ? [
    { name: 'Pending', value: Number(stats.pendingComplaints) },
    { name: 'In Progress', value: Number(stats.inProgressComplaints) },
    { name: 'Resolved', value: Number(stats.resolvedComplaints) },
    { name: 'Rejected', value: Number(stats.rejectedComplaints) },
  ].filter(d => d.value > 0) : []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Here's an overview of your complaints</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/student/file-complaint')}>
          + File New Complaint
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon blue">📋</div>
          <div>
            <div className="stat-value">{stats?.totalComplaints ?? 0}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon yellow">⏳</div>
          <div>
            <div className="stat-value">{stats?.pendingComplaints ?? 0}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card inprogress">
          <div className="stat-icon cyan">🔧</div>
          <div>
            <div className="stat-value">{stats?.inProgressComplaints ?? 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{stats?.resolvedComplaints ?? 0}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon red">❌</div>
          <div>
            <div className="stat-value">{stats?.rejectedComplaints ?? 0}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: pieData.length > 0 ? '1fr 320px' : '1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Complaints</span>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/student/complaints')}>
              View All
            </button>
          </div>
          {recent.length === 0 ? (
            <p className="text-muted text-center" style={{ padding: 32 }}>
              No complaints yet. <span style={{ cursor:'pointer', color:'var(--primary)' }}
                onClick={() => navigate('/student/file-complaint')}>File one now →</span>
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/student/complaints/${c.id}`)}>
                      <td><strong>#{c.id}</strong></td>
                      <td>{c.title}</td>
                      <td><span className="badge badge-infrastructure">{c.category}</span></td>
                      <td><PriorityBadge priority={c.priority} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pieData.length > 0 && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Complaint Status</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80}
                     dataKey="value" nameKey="name" label={({ name, percent }) =>
                       `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
