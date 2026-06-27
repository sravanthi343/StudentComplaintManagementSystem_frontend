import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminAPI, complaintAPI } from '../../services/api'
import { Spinner, StatusBadge, PriorityBadge, StatusWorkflow, Lightbox } from '../../components/common'
import { formatDateTime, STATUSES, getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'

export default function AdminComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [statusForm, setStatusForm] = useState({ status: '', comment: '' })
  const [commentForm, setCommentForm] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      const { data } = await adminAPI.getComplaint(id)
      setComplaint(data)
      setStatusForm(prev => ({ ...prev, status: data.status }))
    } catch (err) {
      toast.error(getErrorMessage(err))
      navigate('/admin/complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    if (!statusForm.comment.trim()) { toast.error('Please add a comment explaining the status change'); return }
    setSubmitting(true)
    try {
      await adminAPI.updateStatus(id, statusForm)
      toast.success('Status updated successfully')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentForm.trim()) { toast.error('Comment cannot be empty'); return }
    setSubmitting(true)
    try {
      await adminAPI.addComment(id, { comment: commentForm })
      toast.success('Comment added')
      setCommentForm('')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (!complaint) return null

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Complaint #{complaint.id}</h1>
          <p>Filed by {complaint.student?.name} on {formatDateTime(complaint.createdAt)}</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/admin/complaints')}>
          ← Back
        </button>
      </div>

      <StatusWorkflow currentStatus={complaint.status} />

      <div className="complaint-detail-grid">
        <div>
          <div className="card">
            <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--primary)', marginBottom:16 }}>
              {complaint.title}
            </h3>
            <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              <span className="badge badge-infrastructure">{complaint.category}</span>
            </div>
            <div className="detail-field">
              <label>Description</label>
              <p style={{ lineHeight:1.7 }}>{complaint.description}</p>
            </div>
            {complaint.location && (
              <div className="detail-field">
                <label>Location</label>
                <p>📍 {complaint.location}</p>
              </div>
            )}
          </div>

          {complaint.images?.length > 0 && (
            <div className="card">
              <div className="card-title" style={{ marginBottom:12 }}>
                📷 Attached Images ({complaint.images.length})
              </div>
              <div className="complaint-images-grid">
                {complaint.images.map(img => (
                  <img key={img.id}
                       src={complaintAPI.imageUrl(img.fileName)}
                       alt={img.originalName}
                       className="complaint-image-thumb"
                       onClick={() => setLightboxSrc(complaintAPI.imageUrl(img.fileName))}
                       title={img.originalName} />
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-title" style={{ marginBottom:12 }}>
              💬 Comment History {complaint.comments?.length > 0 && `(${complaint.comments.length})`}
            </div>
            {!complaint.comments?.length ? (
              <p className="text-muted" style={{ padding:'12px 0' }}>No comments yet.</p>
            ) : (
              <ul className="comment-timeline">
                {complaint.comments.map(c => (
                  <li key={c.id} className="comment-item">
                    <div className="comment-dot">{c.adminName?.[0] || 'A'}</div>
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="comment-author">{c.adminName}</span>
                        {c.statusChange && <StatusBadge status={c.statusChange} />}
                        <span className="comment-time">{formatDateTime(c.createdAt)}</span>
                      </div>
                      <p className="comment-text">{c.comment}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddComment} style={{ marginTop:16, borderTop:'1px solid var(--border)', paddingTop:16 }}>
              <div className="form-group">
                <label className="form-label">Add a Comment</label>
                <textarea className="form-control" rows={3}
                  placeholder="Post an update visible to the student..."
                  value={commentForm}
                  onChange={e => setCommentForm(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-outline" disabled={submitting}>
                {submitting ? 'Posting...' : '💬 Post Comment'}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-title" style={{ marginBottom:12 }}>Student Details</div>
            {[
              { label: 'Name', val: complaint.student?.name },
              { label: 'Email', val: complaint.student?.email },
              { label: 'Roll No.', val: complaint.student?.rollNumber || '—' },
              { label: 'Department', val: complaint.student?.department || '—' },
            ].map(f => (
              <div key={f.label} className="detail-field">
                <label>{f.label}</label>
                <p>{f.val}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom:16 }}>Update Status</div>
            <form onSubmit={handleStatusUpdate}>
              <div className="form-group">
                <label className="form-label">New Status <span className="required">*</span></label>
                <select className="form-control" value={statusForm.status}
                        onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}>
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s.replace('_',' ')}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comment / Reason <span className="required">*</span></label>
                <textarea className="form-control" rows={3} required
                  placeholder="Explain the status change (visible to student)..."
                  value={statusForm.comment}
                  onChange={e => setStatusForm({ ...statusForm, comment: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width:'100%' }}
                      disabled={submitting}>
                {submitting ? 'Updating...' : '✅ Update Status'}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom:12 }}>Complaint Info</div>
            {[
              { label: 'ID', val: `#${complaint.id}` },
              { label: 'Category', val: complaint.category },
              { label: 'Priority', val: <PriorityBadge priority={complaint.priority} /> },
              { label: 'Status', val: <StatusBadge status={complaint.status} /> },
              { label: 'Filed', val: formatDateTime(complaint.createdAt) },
              { label: 'Updated', val: formatDateTime(complaint.updatedAt) },
              { label: 'Images', val: `${complaint.images?.length || 0} file(s)` },
            ].map(f => (
              <div key={f.label} className="detail-field">
                <label>{f.label}</label>
                <p>{f.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </div>
  )
}
