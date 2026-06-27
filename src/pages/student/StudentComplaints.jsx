import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintAPI } from '../../services/api'
import { Spinner, StatusBadge, PriorityBadge, EmptyState, Pagination } from '../../components/common'
import { formatDate, STATUSES, CATEGORIES, PRIORITIES, getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'

export default function StudentComplaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '' })

  const load = useCallback(async (p = 0) => {
    setLoading(true)
    try {
      const params = { page: p, size: 10 }
      if (filters.search) params.search = filters.search
      if (filters.status) params.status = filters.status
      if (filters.category) params.category = filters.category
      if (filters.priority) params.priority = filters.priority
      const { data } = await complaintAPI.getAll(params)
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
    if (!window.confirm('Delete this complaint? This cannot be undone.')) return
    try {
      await complaintAPI.delete(id)
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
          <h1>My Complaints</h1>
          <p>Track and manage all your filed complaints</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/student/file-complaint')}>
          + New Complaint
        </button>
      </div>

      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="Search by ID or title..."
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
        {(filters.search || filters.status || filters.category || filters.priority) && (
          <button className="btn btn-outline btn-sm"
                  onClick={() => setFilters({ search:'', status:'', category:'', priority:'' })}>
            Clear
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <Spinner /> : complaints.length === 0 ? (
          <EmptyState title="No complaints found"
            description="Try adjusting your filters or file a new complaint" />
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
                  <th>Images</th>
                  <th>Filed On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id} onClick={() => navigate(`/student/complaints/${c.id}`)}
                      style={{ cursor: 'pointer' }}>
                    <td><strong>#{c.id}</strong></td>
                    <td style={{ maxWidth: 200 }}>
                      <div style={{ fontWeight: 500 }}>{c.title}</div>
                      {c.location && <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>📍 {c.location}</div>}
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
                        <button className="btn btn-outline btn-sm"
                                onClick={() => navigate(`/student/complaints/${c.id}`)}>
                          View
                        </button>
                        {c.status === 'PENDING' && (
                          <button className="btn btn-danger btn-sm"
                                  onClick={e => handleDelete(c.id, e)}>
                            Del
                          </button>
                        )}
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
