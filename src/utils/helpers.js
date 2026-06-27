// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Status badge class
export const statusClass = (status) => {
  const map = {
    PENDING: 'badge-pending',
    ACCEPTED: 'badge-accepted',
    ASSIGNED: 'badge-assigned',
    IN_PROGRESS: 'badge-in_progress',
    RESOLVED: 'badge-resolved',
    CLOSED: 'badge-closed',
    REJECTED: 'badge-rejected',
  }
  return map[status] || 'badge-other'
}

export const priorityClass = (priority) => {
  const map = {
    LOW: 'badge-low',
    MEDIUM: 'badge-medium',
    HIGH: 'badge-high',
    EMERGENCY: 'badge-emergency',
  }
  return map[priority] || ''
}

export const categoryLabel = (cat) => {
  if (!cat) return ''
  return cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' ')
}

export const statusLabel = (status) => {
  if (!status) return ''
  return status.replace('_', ' ')
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const getErrorMessage = (error) => {
  if (!error) return 'Something went wrong'
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.validationErrors) {
    return Object.values(error.response.data.validationErrors).join(', ')
  }
  if (error.message) return error.message
  return 'Something went wrong'
}

export const STATUSES = ['PENDING','ACCEPTED','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED','REJECTED']
export const PRIORITIES = ['LOW','MEDIUM','HIGH','EMERGENCY']
export const CATEGORIES = [
  'INFRASTRUCTURE','ELECTRICITY','WATER','WIFI','HOSTEL',
  'LIBRARY','SPORTS','TRANSPORT','CANTEEN','FACULTY','HARASSMENT','OTHER'
]

export const STATUS_WORKFLOW = ['PENDING','ACCEPTED','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED']
