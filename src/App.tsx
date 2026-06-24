import './App.css';
import profilePhoto from './assets/images/Profile.png';
import { useState, useEffect, useRef } from 'react';

/* ─── Types ─── */
type ModalTab = 'contact' | 'message';

/* ─── Email send via mailto (opens default email app) ─── */
function sendEmail(data: { name: string; email: string; message: string }): boolean {
  try {
    const subject = encodeURIComponent(`[Portfolio] Pesan dari ${data.name}`);
    const body = encodeURIComponent(
      `Halo Aliya!\n\nSaya ${data.name} (${data.email}) ingin menghubungi kamu.\n\n${data.message}\n\n---\nDikirim dari portfolio website kamu.`
    );
    window.open(`mailto:aliyawijaya67@gmail.com?subject=${subject}&body=${body}`, '_blank');
    return true;
  } catch {
    return false;
  }
}

/* ─── Typing Animation Hook ─── */
function useTyping(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx));
        setCharIdx(c => c - 1);
      }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

/* ─── Contact Modal ─── */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<ModalTab>('contact');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const overlayRef = useRef<HTMLDivElement>(null);

  /* close on overlay click */
  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // small delay for UX feel
    await new Promise(r => setTimeout(r, 600));
    const ok = sendEmail(form);
    setStatus(ok ? 'success' : 'error');
    if (ok) setForm({ name: '', email: '', message: '' });
  };

  const contacts = [
    {
      id: 'email',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="3"/>
          <path d="M2 7l10 7 10-7"/>
        </svg>
      ),
      label: 'Email',
      value: 'aliyawijaya67@gmail.com',
      href: 'mailto:aliyawijaya67@gmail.com',
      color: '#8b5cf6',
    },
    {
      id: 'linkedin',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
      label: 'LinkedIn',
      value: 'aliya-cahyanti-wijaya',
      href: 'https://www.linkedin.com/in/aliya-cahyanti-wijaya-197310328',
      color: '#06b6d4',
    },
    {
      id: 'phone',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
        </svg>
      ),
      label: 'Phone / WhatsApp',
      value: '+62 812-1176-7422',
      href: 'https://wa.me/6281211767422',
      color: '#10b981',
    },
    {
      id: 'instagram',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
      ),
      label: 'Instagram',
      value: '@aliya.wj_',
      href: 'https://www.instagram.com/aliya.wj_?igsh=OGR6dnpoenF1azZv',
      color: '#e1306c',
    },
  ];

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlay}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label="Contact Aliya">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-avatar">
            <img src={profilePhoto} alt="Aliya" />
          </div>
          <div>
            <h3 className="modal-name">Aliya Cahyanti Wijaya</h3>
            <p className="modal-sub">Let's connect & create together </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab${tab === 'contact' ? ' active' : ''}`}
            onClick={() => setTab('contact')}
          >
            Contact Info
          </button>
          <button
            className={`modal-tab${tab === 'message' ? ' active' : ''}`}
            onClick={() => setTab('message')}
          >
            Send Message
          </button>
        </div>

        {/* Tab: Contact Info */}
        {tab === 'contact' && (
          <div className="modal-body">
            {contacts.map(c => (
              <a
                key={c.id}
                href={c.href}
                target={c.id !== 'email' && c.id !== 'phone' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="contact-item"
                style={{ '--c-color': c.color } as React.CSSProperties}
              >
                <span className="contact-icon">{c.icon}</span>
                <span className="contact-info">
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                </span>
                <svg className="contact-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Tab: Send Message */}
        {tab === 'message' && (
          <div className="modal-body">
            {status === 'success' ? (
              <div className="form-success">
                <div className="success-icon"></div>
                <h4>Email App Opened!</h4>
                <p>Complete your message in your email app and I’ll respond as soon as possible.</p>
                <button className="btn-primary" onClick={() => setStatus('idle')}>Send Again</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <p className="form-tagline">
                  Got a project in mind? Let's build something amazing together! 
                </p>
                <div className="form-group">
                  <label htmlFor="contact-name">Your Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Your Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="e.g. john@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell me about your project or idea..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>
                {status === 'error' && (
                  <p className="form-error">Oops! Ada yang salah. Coba lagi ya.</p>
                )}
                <button
                  id="submit-contact"
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <span className="btn-loading"><span className="spinner" /> Mengirim...</span>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const typedRole = useTyping(['Informatics Engineering Student', 'Frontend Developer', 'Mobile App Developer', 'Game Developer', 'UI/UX Enthusiast']);

  /* prevent scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  return (
    <div className="page">
      {/* ── Decorative blobs ── */}
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-dot" />
          <span>ACW</span>
        </div>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>About</a></li>
          <li><a href="#publication">Publication</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Project</a></li>
        </ul>
        <div className="nav-actions">
          <a
            id="nav-cv-btn"
            href="/cv.pdf"
            download
            className="btn-outline"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download CV
          </a>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <main id="home" className="hero-section">
        {/* Left: Text */}
        <div className="hero-text">
          <div className="hero-badge">
            <span className="badge-dot" />
            Available for opportunities
          </div>

          <h1 className="hero-title">
            Hello, I'm<br />
            <span className="hero-name">Aliya Cahyanti</span><br />
            <span className="hero-name">Wijaya</span>
          </h1>

          <div className="hero-roles">
            <span className="role-typed">{typedRole}</span>
            <span className="role-cursor" aria-hidden="true">|</span>
          </div>

          <p className="hero-desc">
            Informatics Engineering Student with an interest in{' '}
            <span className="highlight">Frontend Development</span>,{' '}
            <span className="highlight">Mobile Applications</span>,{' '}
            <span className="highlight">Game Development</span>, and{' '}
            <span className="highlight">UI/UX Design</span>. Passionate about building functional and user-friendly digital experiences.
          </p>

          <div className="hero-actions">
            <button
              id="hero-contact-btn"
              className="btn-primary"
              onClick={() => setModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Contact Me
            </button>
            <a
              id="hero-linkedin-btn"
              href="https://www.linkedin.com/in/aliya-cahyanti-wijaya-197310328"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          </div>

          {/* Tags */}
          <div className="hero-tags">
            {['Informatics Engineering Student', 'Frontend Developer', 'Mobile App Developer', 'Game Developer', 'UI/UX Enthusiast'].map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Right: Photo + Stats */}
        <div className="hero-visual">
          {/* Photo frame */}
          <div className="photo-frame">
            <div className="photo-ring photo-ring-1" aria-hidden="true" />
            <div className="photo-ring photo-ring-2" aria-hidden="true" />
            <div className="photo-glow" aria-hidden="true" />
            <div className="photo-container">
              <img src={profilePhoto} alt="Aliya Cahyanti Wijaya" className="profile-photo" />
            </div>
            {/* Floating badge */}
            <div className="float-badge float-badge-top">
              <span></span> Hi there!
            </div>
            <div className="float-badge float-badge-bottom">
              <span></span> Open to work
            </div>
          </div>
        </div>
      </main>

      {/* ── Experience Section ── */}
      <section id="experience" className="exp-section">
        <div className="exp-inner">
          <div className="section-label">
            <span className="section-label-dot" />
            Experience
          </div>
          <h2 className="section-title">Leadership & Organizational Experience</h2>
          <p className="section-sub">Organizations & Roles</p>

          {/* Organization Card */}
          <div className="exp-org-card">
            <div className="exp-org-header">
              <div className="exp-org-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="exp-org-info">
                <h3 className="exp-org-name">Himpunan Mahasiswa Informatika (BIOS)</h3>
                <p className="exp-org-sub">Universitas Bunda Mulia · 2 yrs 1 mo</p>
                <p className="exp-org-loc">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Tangerang, Banten, Indonesia · On-site
                </p>
              </div>
            </div>

            {/* Role list */}
            <div className="exp-roles">

              {/* Role 1: Treasurer */}
              <div className="exp-role-item">
                <div className="exp-role-dot" />
                <div className="exp-role-body">
                  <div className="exp-role-top">
                    <div>
                      <h4 className="exp-role-title">Treasurer</h4>
                      <p className="exp-role-meta">Contract · Jul 2025 – Present · 1 yr</p>
                    </div>
                    {/* Certificate link coming soon */}
                  </div>
                  <p className="exp-role-desc">
                    Responsible for managing organizational finances, recording income and expenses, preparing budget plans,
                    monitoring financial reports, and ensuring transparency and accountability in financial activities to support
                    various student programs and events.
                  </p>
                  <div className="exp-skills">
                    <span className="exp-skill-tag">Money Management</span>
                    <span className="exp-skill-tag">Treasury Accounting</span>
                    <span className="exp-skill-tag">Financial Reporting</span>
                  </div>
                </div>
              </div>

              {/* Role 2: Event Organizer – LKMM Building Unity */}
              <div className="exp-role-item">
                <div className="exp-role-dot" />
                <div className="exp-role-body">
                  <div className="exp-role-top">
                    <div>
                      <h4 className="exp-role-title">Event Organizer – LKMM Building Unity, Leading with Vision, Growing Together</h4>
                      <p className="exp-role-meta">Jun 2026 · 1 mo</p>
                    </div>
                    {/* Certificate link coming soon */}
                  </div>
                  <p className="exp-role-desc">
                    A student leadership development program designed to strengthen leadership, teamwork, and organizational
                    skills among university students. Focuses on developing adaptive leadership capabilities and preparing students
                    to contribute effectively in dynamic and collaborative environments. The program includes seminars, team-based
                    activities, fundraising initiatives, and practical experiences that encourage communication, problem-solving,
                    responsibility, and innovation throughout the event implementation process.
                  </p>
                </div>
              </div>

              {/* Role 3: Event Organizer – LKMM Adaptive Leadership */}
              <div className="exp-role-item">
                <div className="exp-role-dot" />
                <div className="exp-role-body">
                  <div className="exp-role-top">
                    <div>
                      <h4 className="exp-role-title">Event Organizer – LKMM Adaptive Leadership: Dare to Make a Change</h4>
                      <p className="exp-role-meta">May 2025 · 1 mo</p>
                    </div>
                    <a
                      href="https://drive.google.com/file/d/1mD3Q1iqtZfbZAspYxamhKqE977OxjmFv/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exp-cert-btn"
                      title="View Certificate"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                      e-Certificate
                    </a>
                  </div>
                  <p className="exp-role-desc">
                    A student leadership training program designed to enhance critical thinking, problem-solving, and decision-making skills.
                    Focuses on developing adaptive leadership capabilities, equipping students to lead in dynamic and uncertain situations.
                    It includes seminar, team-based challenges, and simulations that foster communication, collaboration, and resilience
                    in student organizations and project environments.
                  </p>
                </div>
              </div>

              {/* Role 4: Multimedia Designer */}
              <div className="exp-role-item">
                <div className="exp-role-dot" />
                <div className="exp-role-body">
                  <div className="exp-role-top">
                    <div>
                      <h4 className="exp-role-title">Multimedia Designer</h4>
                      <p className="exp-role-meta">Contract · Jun 2024 – Jun 2025 · 1 yr 1 mo</p>
                    </div>
                    <a
                      href="https://drive.google.com/file/d/1IXvB5Pfd-fjR-4nzeHCRM_Sh2v3IBrpm/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exp-cert-btn"
                      title="View Certificate"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                      e-Certificate
                    </a>
                  </div>
                  <p className="exp-role-desc">
                    Responsible for designing visual content, managing social media graphics, event posters, and digital assets
                    for organizational activities and student engagement.
                  </p>
                  <div className="exp-skills">
                    <span className="exp-skill-tag">Graphic Design</span>
                    <span className="exp-skill-tag">Social Media</span>
                    <span className="exp-skill-tag">Digital Media</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Publication Section ── */}
      <section id="publication" className="pub-section">
        <div className="pub-inner">
          <div className="section-label">
            <span className="section-label-dot" />
            Publication
          </div>
          <h2 className="section-title">Research & Publication</h2>
          <p className="section-sub">Published Article</p>

          <div className="pub-card">
            {/* Icon */}
            <div className="pub-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>

            {/* Content */}
            <div className="pub-content">
              <span className="pub-badge">Journal Article</span>
              <h3 className="pub-title">
                Pengembangan Chatbot Analisis Data Mahasiswa dengan Term Frequency - Inverse Document Frequency dan Logistic Regression
              </h3>

              <div className="pub-meta">
                <div className="pub-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <span>Jurnal Algoritma, Logika dan Komputasi (JALU) — Universitas Bunda Mulia</span>
                </div>
                <div className="pub-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>January 1, 2026</span>
                </div>
              </div>

              <a
                href="https://journal.ubm.ac.id/index.php/alu/article/view/9015"
                target="_blank"
                rel="noopener noreferrer"
                className="pub-link"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Read Article
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}