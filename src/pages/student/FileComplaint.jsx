import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintAPI } from '../../services/api'
import { CATEGORIES, PRIORITIES, getErrorMessage } from '../../utils/helpers'
import { toast } from 'react-toastify'

const MAX_IMAGES = 5
const MAX_SIZE_MB = 5

export default function FileComplaint() {
  const navigate = useNavigate()
  const fileRef = useRef()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: '', priority: 'MEDIUM', location: ''
  })
  const [images, setImages] = useState([]) // { file, preview }
  const [dragOver, setDragOver] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const addFiles = (files) => {
    const allowed = ['image/jpeg','image/jpg','image/png']
    const newImages = []
    for (const file of files) {
      if (images.length + newImages.length >= MAX_IMAGES) {
        toast.warning(`Maximum ${MAX_IMAGES} images allowed`)
        break
      }
      if (!allowed.includes(file.type)) {
        toast.error(`${file.name}: Only JPG, JPEG, PNG allowed`)
        continue
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: File size must be under ${MAX_SIZE_MB}MB`)
        continue
      }
      newImages.push({ file, preview: URL.createObjectURL(file) })
    }
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (idx) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.category) { toast.error('Please select a category'); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('complaint', new Blob([JSON.stringify({
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        location: form.location,
      })], { type: 'application/json' }))

      images.forEach(img => formData.append('images', img.file))

      const { data } = await complaintAPI.create(formData)
      toast.success('Complaint filed successfully!')
      navigate(`/student/complaints/${data.id}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>File a Complaint</h1>
          <p>Describe your issue and attach supporting images</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/student/complaints')}>
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>Complaint Details</div>

          <div className="form-group">
            <label className="form-label">Complaint Title <span className="required">*</span></label>
            <input className="form-control" name="title" required maxLength={200}
              placeholder="e.g. Broken projector in Room 301"
              value={form.title} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category <span className="required">*</span></label>
              <select className="form-control" name="category" required
                value={form.category} onChange={handleChange}>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority <span className="required">*</span></label>
              <select className="form-control" name="priority" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location / Room No.</label>
            <input className="form-control" name="location"
              placeholder="e.g. Block A, Room 301 / Hostel Block B"
              value={form.location} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea className="form-control" name="description" required
              rows={5} maxLength={2000}
              placeholder="Describe the issue in detail — when it started, how it affects you, etc."
              value={form.description} onChange={handleChange} />
            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>
              {form.description.length}/2000 characters
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 4 }}>Attach Images (Optional)</div>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 16 }}>
            Upload up to {MAX_IMAGES} images (JPG, JPEG, PNG — max {MAX_SIZE_MB}MB each)
          </p>

          <div className={`image-upload-area ${dragOver ? 'dragover' : ''}`}
               onClick={() => fileRef.current.click()}
               onDragOver={e => { e.preventDefault(); setDragOver(true) }}
               onDragLeave={() => setDragOver(false)}
               onDrop={handleDrop}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📷</div>
            <p style={{ fontWeight: 500 }}>Click to browse or drag & drop images here</p>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>
              JPG, JPEG, PNG — max {MAX_SIZE_MB}MB per file — up to {MAX_IMAGES} images
            </p>
            <input type="file" ref={fileRef} style={{ display: 'none' }}
              multiple accept=".jpg,.jpeg,.png"
              onChange={e => addFiles(Array.from(e.target.files))} />
          </div>

          {images.length > 0 && (
            <div className="image-previews">
              {images.map((img, i) => (
                <div key={i} className="image-preview-item">
                  <img src={img.preview} alt={`Preview ${i + 1}`} />
                  <div className="image-preview-remove" onClick={() => removeImage(i)}>×</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline"
                  onClick={() => navigate('/student/complaints')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Submitting...' : '📤 Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  )
}
