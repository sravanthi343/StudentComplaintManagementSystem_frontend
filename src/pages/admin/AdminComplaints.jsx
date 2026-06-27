import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { Spinner, StatusBadge, PriorityBadge, EmptyState, Pagination } from '../../components/common'
import { formatDate, STATUSES, CATEGORIES, PRIORITIES, getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'

export default function AdminComplaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search:'', status:'', category:'', priority:'' })

  const load = useCallback(async (p = 0) => {
    setLoading(true)
    try {
      const params = { page: p, size: 15 }
      if (filters.search) params.search = filters.search
      if (filters.status) params.status = filters.status
      if (filters.category) params.category = filters.category
      if (filters.priority) params.priority = filters.priority
      const { data } = await adminAPI.getAllComplaints(params)
      setComplaints(data.content || [])
      setTotalPages(data.totalPages || 0)
      setPage(p)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load(0) }, [filters])

  const handleFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }))

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Permanently delete complaint #' + id + '?')) return
    try {
      await adminAPI.deleteComplaint(id)
      toast.success('Complaint deleted')
      load(page)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>All Complaints</h1>
          <p>Manage and respond to student complaints</p>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="Search by ID, title or category..."
            value={filters.search}
            onChange={e => handleFilter('search', e.target.value)} />
        </div>
        <select className="filter-select" value={filters.status}
                onChange={e => handleFilter('status', e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
        <select className="filter-select" value={filters.category}
                onChange={e => handleFilter('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}
        </select>
        <select className="filter-select" value={filters.priority}
                onChange={e => handleFilter('priority', e.target.value)}>
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0)+p.slice(1).toLowerCase()}</option>)}
        </select>
        {(filters.search||filters.status||filters.category||filters.priority) && (
          <button className="btn btn-outline btn-sm"
                  onClick={() => setFilters({ search:'',status:'',category:'',priority:'' })}>
            Clear
          </button>
        )}
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {loading ? <Spinner /> : complaints.length === 0 ? (
          <EmptyState title="No complaints found" description="Adjust filters to see more results" />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#ID</th><th>Title</th><th>Student</th>
                  <th>Category</th><th>Priority</th><th>Status</th>
                  <th>Images</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id} style={{ cursor:'pointer' }}
                      onClick={() => navigate(`/admin/complaints/${c.id}`)}>
                    <td><strong>#{c.id}</strong></td>
                    <td style={{ maxWidth:200 }}>
                      <div style={{ fontWeight:500 }}>{c.title}</div>
                      {c.location && <div style={{ fontSize:'0.72rem', color:'var(--gray)' }}>📍 {c.location}</div>}
                    </td>
                    <td>
                      <div>{c.student?.name}</div>
                      <div style={{ fontSize:'0.72rem', color:'var(--gray)' }}>
                        {c.student?.rollNumber} {c.student?.department && `• ${c.student.department}`}
                      </div>
                    </td>
                    <td><span className="badge badge-infrastructure">{c.category}</span></td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      {c.images?.length > 0
                        ? <span title={`${c.images.length} image(s)`}>🖼 {c.images.length}</span>
                        : <span className="text-muted">—</span>}
                    </td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display:'flex', gap:4 }}>
                        <button className="btn btn-primary btn-sm"
                                onClick={() => navigate(`/admin/complaints/${c.id}`)}>
                          Manage
                        </button>
                        <button className="btn btn-danger btn-sm"
                                onClick={e => handleDelete(c.id, e)}>
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={p => load(p)} />
    </div>
  )
}
