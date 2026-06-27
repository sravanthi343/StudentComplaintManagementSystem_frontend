import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { Spinner, StatusBadge, PriorityBadge } from '../../components/common'
import { formatDate, getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const STATUS_COLORS = {
  PENDING:'#ffc107', ACCEPTED:'#17a2b8', ASSIGNED:'#6610f2',
  IN_PROGRESS:'#007bff', RESOLVED:'#28a745', CLOSED:'#6c757d', REJECTED:'#dc3545'
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, complaintsRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getAllComplaints({ page: 0, size: 8, status: 'PENDING' })
        ])
        setStats(dashRes.data)
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

  const statusData = stats?.categoryStats?.map(s => ({
    name: s.category.charAt(0) + s.category.slice(1).toLowerCase(),
    count: Number(s.count)
  })) || []

  const priorityPie = stats?.priorityStats?.map(p => ({
    name: p.priority, value: Number(p.count)
  })) || []

  const PIE_COLORS = ['#28a745','#ffc107','#dc3545','#6f42c1']

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of all student complaints and system status</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/complaints')}>
          View All Complaints
        </button>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Complaints', val: stats?.totalComplaints, icon: '📋', cls: 'total', color: 'blue' },
          { label: 'Pending',          val: stats?.pendingComplaints, icon: '⏳', cls: 'pending', color: 'yellow' },
          { label: 'In Progress',      val: stats?.inProgressComplaints, icon: '🔧', cls: 'inprogress', color: 'cyan' },
          { label: 'Resolved',         val: stats?.resolvedComplaints, icon: '✅', cls: 'resolved', color: 'green' },
          { label: 'Rejected',         val: stats?.rejectedComplaints, icon: '❌', cls: 'rejected', color: 'red' },
          { label: 'Total Students',   val: stats?.totalStudents, icon: '🎓', cls: 'total', color: 'blue' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.val ?? 0}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {statusData.length > 0 && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Complaints by Category</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData} margin={{ top: 0, right: 10, left: -20, bottom: 40 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {priorityPie.length > 0 && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Complaints by Priority</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={priorityPie} cx="50%" cy="50%" outerRadius={75}
                     dataKey="value" nameKey="name"
                     label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                     labelLine={false}>
                  {priorityPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">⚠️ Pending Complaints Requiring Attention</span>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/complaints')}>
            View All
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: 32 }}>
            🎉 No pending complaints at the moment!
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#ID</th><th>Title</th><th>Student</th>
                  <th>Category</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/complaints/${c.id}`)}>
                    <td><strong>#{c.id}</strong></td>
                    <td style={{ maxWidth: 180 }}>
                      <div style={{ fontWeight:500 }}>{c.title}</div>
                    </td>
                    <td>
                      <div>{c.student?.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--gray)' }}>{c.student?.rollNumber}</div>
                    </td>
                    <td><span className="badge badge-infrastructure">{c.category}</span></td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-primary btn-sm"
                              onClick={() => navigate(`/admin/complaints/${c.id}`)}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
