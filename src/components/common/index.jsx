import React from 'react'
import { statusClass, priorityClass, statusLabel, categoryLabel } from '../../utils/helpers'

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${statusClass(status)}`}>
      {statusLabel(status)}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge ${priorityClass(priority)}`}>
      {priority}
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span className="badge badge-infrastructure" style={{ background: '#e8f0fa', color: '#1a3c5e' }}>
      {categoryLabel(category)}
    </span>
  )
}

export function Spinner() {
  return <div className="loading-center"><div className="spinner" /></div>
}

export function EmptyState({ title = 'No records found', description = '', icon }) {
  return (
    <div className="empty-state">
      {icon || (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = []
  for (let i = 0; i < totalPages; i++) pages.push(i)
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>‹ Prev</button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)} className={p === page ? 'active' : ''}>
          {p + 1}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages - 1}>Next ›</button>
    </div>
  )
}

export function Lightbox({ src, onClose }) {
  if (!src) return null
  return (
    <div className="lightbox" onClick={onClose}>
      <span className="lightbox-close">×</span>
      <img src={src} alt="Full size" onClick={e => e.stopPropagation()} />
    </div>
  )
}

export function StatusWorkflow({ currentStatus }) {
  const steps = ['PENDING','ACCEPTED','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED']
  const currentIdx = steps.indexOf(currentStatus)
  return (
    <div className="status-workflow">
      {steps.map((step, i) => (
        <div key={step} className="workflow-step">
          <div className={`workflow-dot ${i < currentIdx ? 'done' : i === currentIdx ? 'active' : ''}`}>
            {i < currentIdx ? '✓' : i + 1}
          </div>
          <span className="workflow-label" style={{ fontSize: '0.68rem', marginLeft: 3 }}>
            {step.replace('_', ' ')}
          </span>
          {i < steps.length - 1 && <span className="workflow-arrow" style={{ margin: '0 4px' }}>→</span>}
        </div>
      ))}
    </div>
  )
}
