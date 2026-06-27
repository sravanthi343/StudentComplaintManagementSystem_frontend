import React, { useState } from 'react'

export function AboutPage() {
  return (
    <div className="about-section">
      <div className="about-hero">
        <h1>🏛️ About Our College</h1>
        <p>Committed to excellence in education, innovation, and student welfare since 1985.</p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>🎯 Our Vision</h3>
          <p>To be a premier institution of higher learning that fosters intellectual curiosity,
          ethical leadership, and a commitment to societal well-being — producing graduates who
          are globally competitive and locally relevant.</p>
        </div>
        <div className="info-card">
          <h3>🚀 Our Mission</h3>
          <p>To provide quality education through innovative teaching methods, cutting-edge
          research, and strong industry partnerships — nurturing students to become skilled
          professionals and responsible citizens who contribute to national development.</p>
        </div>
        <div className="info-card">
          <h3>🎓 Student Welfare</h3>
          <p>We are deeply committed to the holistic development of every student. From academic
          support to counselling services, recreational facilities, and a transparent grievance
          redressal system — student welfare is at the heart of everything we do.</p>
        </div>
        <div className="info-card">
          <h3>🏢 Management</h3>
          <p>Our institution is governed by a distinguished board of educators, industry veterans,
          and community leaders dedicated to maintaining the highest standards of academic integrity,
          infrastructure quality, and student experience.</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--primary)', marginBottom:16 }}>
          📜 Principal's Message
        </h3>
        <p style={{ lineHeight:1.9, color:'var(--gray)', fontStyle:'italic' }}>
          "Dear Students, our institution stands as a beacon of knowledge and opportunity.
          We believe that every student deserves a safe, clean, and well-equipped environment
          to learn and grow. This complaint management system reflects our unwavering commitment
          to addressing your concerns swiftly and transparently. Your voice matters — and we
          are here to listen, act, and improve. Together, we build a better campus for everyone."
        </p>
        <p style={{ marginTop:12, fontWeight:600, color:'var(--primary)' }}>— Dr. A. K. Sharma, Principal</p>
      </div>

      <div className="card">
        <h3 style={{ fontSize:'1rem', fontWeight:600, color:'var(--primary)', marginBottom:16 }}>
          ℹ️ About This System
        </h3>
        <p style={{ color:'var(--gray)', lineHeight:1.8 }}>
          The Student Complaint Management System (SCMS) is a digital platform designed to streamline
          the process of filing, tracking, and resolving student complaints. Students can submit
          complaints with supporting images, track their progress through a clear status workflow,
          and receive updates directly from the administration — all in one transparent system.
        </p>
      </div>
    </div>
  )
}

export function ContactPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Contact Us</h1>
          <p>Get in touch with the Student Welfare Office</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card">
          <h3 style={{ fontSize:'1rem', fontWeight:600, color:'var(--primary)', marginBottom:16 }}>
            📍 Contact Information
          </h3>
          {[
            { icon:'📍', label:'Address', val:'123 College Road, Knowledge Park,\nHyderabad, Telangana - 500001' },
            { icon:'📧', label:'Email', val:'welfare@college.edu' },
            { icon:'📞', label:'Phone', val:'+91 40 1234 5678' },
            { icon:'📱', label:'Mobile', val:'+91 98765 43210' },
            { icon:'🌐', label:'Website', val:'www.college.edu' },
          ].map(item => (
            <div key={item.label} className="contact-item">
              <div className="contact-icon">{item.icon}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:'0.8rem', color:'var(--gray)', marginBottom:2 }}>
                  {item.label}
                </div>
                <div style={{ whiteSpace:'pre-line' }}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize:'1rem', fontWeight:600, color:'var(--primary)', marginBottom:16 }}>
            🕐 Office Hours
          </h3>
          {[
            { day:'Monday – Friday', time:'9:00 AM – 5:00 PM' },
            { day:'Saturday',         time:'9:00 AM – 1:00 PM' },
            { day:'Sunday',           time:'Closed' },
            { day:'Public Holidays',  time:'Closed' },
          ].map(row => (
            <div key={row.day} style={{
              display:'flex', justifyContent:'space-between', padding:'10px 0',
              borderBottom:'1px solid var(--gray-light)', fontSize:'0.875rem'
            }}>
              <span style={{ fontWeight:500 }}>{row.day}</span>
              <span style={{ color: row.time === 'Closed' ? 'var(--danger)' : 'var(--success)', fontWeight:600 }}>
                {row.time}
              </span>
            </div>
          ))}
          <div style={{ marginTop:16, padding:14, background:'var(--secondary)', borderRadius:'var(--radius)',
                        fontSize:'0.85rem', color:'var(--primary)' }}>
            💡 <strong>Tip:</strong> For faster resolution, use the online complaint system above
            rather than visiting in person.
          </div>
        </div>

        <div className="card" style={{ gridColumn:'1 / -1' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:600, color:'var(--primary)', marginBottom:16 }}>
            🏢 Departmental Contacts
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12 }}>
            {[
              { dept:'Infrastructure', email:'infra@college.edu', ext:'101' },
              { dept:'Hostel Office', email:'hostel@college.edu', ext:'102' },
              { dept:'Library',       email:'library@college.edu', ext:'103' },
              { dept:'IT / WiFi',     email:'it@college.edu', ext:'104' },
              { dept:'Transport',     email:'transport@college.edu', ext:'105' },
              { dept:'Canteen',       email:'canteen@college.edu', ext:'106' },
            ].map(d => (
              <div key={d.dept} style={{ padding:14, border:'1px solid var(--border)',
                borderRadius:'var(--radius)', fontSize:'0.85rem' }}>
                <div style={{ fontWeight:600, color:'var(--primary)', marginBottom:4 }}>{d.dept}</div>
                <div style={{ color:'var(--gray)' }}>{d.email}</div>
                <div style={{ color:'var(--gray)' }}>Ext: {d.ext}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FAQPage() {
  const [open, setOpen] = useState(null)

  const faqs = [
    {
      q: 'How do I file a complaint?',
      a: 'Log in to your student account, click "File Complaint" in the sidebar, fill in the complaint title, description, category, and priority. You can also attach supporting images (JPG/PNG, max 5MB each). Once submitted, your complaint will be assigned a unique ID for tracking.'
    },
    {
      q: 'How long does complaint resolution take?',
      a: 'Resolution time depends on the nature and priority of the complaint. Emergency and High priority complaints are addressed within 24-48 hours. Medium priority complaints are typically resolved within 3-5 working days, and Low priority within 7-10 working days. You can track real-time status updates in your complaint detail page.'
    },
    {
      q: 'Can I edit my complaint after submission?',
      a: 'Currently, complaints cannot be edited after submission to maintain integrity. However, you can add additional information by contacting the Student Welfare Office directly. If your complaint is still in "Pending" status, you may delete it and re-file with the correct information.'
    },
    {
      q: 'Can I delete my complaint?',
      a: 'Yes, you can delete a complaint only while it is in "Pending" status — before it has been reviewed by an administrator. Once the status changes to "Accepted" or beyond, the complaint cannot be deleted as it is already being processed.'
    },
    {
      q: 'Who reviews my complaints?',
      a: 'Complaints are reviewed by designated administrators in the Student Welfare Office. Depending on the category, they may coordinate with relevant department heads (e.g., Infrastructure team for maintenance issues, IT team for WiFi problems). You will receive updates through the admin comments on your complaint.'
    },
    {
      q: 'What types of images can I upload?',
      a: 'You can upload JPG, JPEG, and PNG image files. Each file must be under 5MB in size, and you can attach up to 5 images per complaint. Images help administrators better understand and faster resolve your issue.'
    },
    {
      q: 'How do I track my complaint status?',
      a: 'Go to "My Complaints" in the sidebar to see all your filed complaints with their current status. Click on any complaint to view the full status workflow (Pending → Accepted → Assigned → In Progress → Resolved → Closed), admin comments, and timeline.'
    },
    {
      q: 'What do the different complaint statuses mean?',
      a: 'PENDING: Submitted, awaiting admin review. ACCEPTED: Admin has acknowledged and accepted the complaint. ASSIGNED: A team has been assigned to work on it. IN PROGRESS: Work is actively underway. RESOLVED: The issue has been fixed. CLOSED: The complaint is officially closed. REJECTED: The complaint was not valid or could not be actioned.'
    },
    {
      q: 'Is my personal information kept confidential?',
      a: 'Yes. Your complaint details and personal information are only visible to authorized administrators. Other students cannot see your complaints. Administrators are bound by the college\'s data privacy policy.'
    },
    {
      q: 'What if I am not satisfied with the resolution?',
      a: 'If you feel your complaint has not been adequately resolved, you can contact the Student Welfare Office directly at welfare@college.edu or visit in person during office hours (Mon-Fri, 9 AM - 5 PM). You may also escalate to the Principal\'s office for unresolved grievances.'
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about the complaint system</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom:24 }}>
        <p style={{ color:'var(--gray)', fontSize:'0.9rem', lineHeight:1.8 }}>
          Can't find what you're looking for? Contact the Student Welfare Office at{' '}
          <strong>welfare@college.edu</strong> or call <strong>+91 40 1234 5678</strong>.
        </p>
      </div>

      {faqs.map((faq, i) => (
        <div key={i} className="faq-item">
          <div className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
            <span>Q{i + 1}. {faq.q}</span>
            <span style={{ fontSize:'1.2rem', color:'var(--primary)' }}>
              {open === i ? '−' : '+'}
            </span>
          </div>
          {open === i && (
            <div className="faq-answer">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  )
}
