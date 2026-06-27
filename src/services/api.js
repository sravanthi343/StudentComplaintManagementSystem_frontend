import axios from 'axios'

const api = axios.create({
  baseURL: 'https://studentcomplaintmanagementsystem-backend.onrender.com',
  timeout: 30000,
})

// Attach token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, err => Promise.reject(err))

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cms_token')
      localStorage.removeItem('cms_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ---- Auth ----
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

// ---- Complaints (Student) ----
export const complaintAPI = {
  create: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  delete:  (id) => api.delete(`/complaints/${id}`),
  getStats: () => api.get('/complaints/stats'),
  imageUrl: (fileName) =>
  `https://studentcomplaintmanagementsystem-backend.onrender.com/api/complaints/images/${fileName}`,
}

// ---- Admin ----
export const adminAPI = {
  getAllComplaints: (params) => api.get('/admin/complaints', { params }),
  getComplaint:    (id) => api.get(`/admin/complaints/${id}`),
  updateStatus:    (id, data) => api.patch(`/admin/complaints/${id}/status`, data),
  addComment:      (id, data) => api.post(`/admin/complaints/${id}/comments`, data),
  deleteComplaint: (id) => api.delete(`/admin/complaints/${id}`),
  getDashboard:    () => api.get('/admin/dashboard'),
}

// ---- User Profile ----
export const userAPI = {
  getProfile:      () => api.get('/users/me'),
  updateProfile:   (data) => api.put('/users/me', data),
  changePassword:  (data) => api.post('/users/me/change-password', data),
  uploadPicture:   (formData) => api.post('/users/me/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export default api
