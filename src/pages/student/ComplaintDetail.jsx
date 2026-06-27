import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { complaintAPI } from '../../services/api'
import { Spinner, StatusBadge, PriorityBadge, StatusWorkflow, Lightbox } from '../../components/common'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'

export default function ComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxSrc, setLightboxSrc] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await complaintAPI.getById(id)
        setComplaint(data)
      } catch (err) {
        toast.error(getErrorMessage(err))
        navigate('/student/complaints')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <Spinner />
  if (!complaint) return null

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Complaint #{complaint.id}</h1>
          <p>Filed on {formatDateTime(complaint.createdAt)}</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/student/complaints')}>
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

            {complaint.resolvedAt && (
              <div className="detail-field">
                <label>Resolved On</label>
                <p style={{ color:'var(--success)' }}>✅ {formatDateTime(complaint.resolvedAt)}</p>
              </div>
            )}
          </div>

          {complaint.images?.length > 0 && (
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>
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
              <p className="text-muted mt-2" style={{ fontSize:'0.78rem' }}>
                Click an image to view full size
              </p>
            </div>
          )}

          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>
              💬 Admin Updates {complaint.comments?.length > 0 && `(${complaint.comments.length})`}
            </div>
            {!complaint.comments?.length ? (
              <p className="text-muted" style={{ padding: '12px 0' }}>
                No updates yet. The admin will post updates as your complaint is processed.
              </p>
            ) : (
              <ul className="comment-timeline">
                {complaint.comments.map(c => (
                  <li key={c.id} className="comment-item">
                    <div className="comment-dot">{c.adminName?.[0] || 'A'}</div>
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="comment-author">{c.adminName}</span>
                        {c.statusChange && (
                          <StatusBadge status={c.statusChange} />
                        )}
                        <span className="comment-time">{formatDateTime(c.createdAt)}</span>
                      </div>
                      <p className="comment-text">{c.comment}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Complaint Info</div>
            <div className="detail-field">
              <label>Complaint ID</label>
              <p><strong>#{complaint.id}</strong></p>
            </div>
            <div className="detail-field">
              <label>Category</label>
              <p>{complaint.category}</p>
            </div>
            <div className="detail-field">
              <label>Priority</label>
              <p><PriorityBadge priority={complaint.priority} /></p>
            </div>
            <div className="detail-field">
              <label>Current Status</label>
              <p><StatusBadge status={complaint.status} /></p>
            </div>
            <div className="detail-field">
              <label>Filed On</label>
              <p>{formatDateTime(complaint.createdAt)}</p>
            </div>
            <div className="detail-field">
              <label>Last Updated</label>
              <p>{formatDateTime(complaint.updatedAt)}</p>
            </div>
            <div className="detail-field">
              <label>Images Attached</label>
              <p>{complaint.images?.length || 0} file(s)</p>
            </div>
          </div>
        </div>
      </div>

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </div>
  )
}
