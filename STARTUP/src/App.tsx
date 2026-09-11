import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatSimulator from './components/ChatSimulator';
import Pricing from './components/Pricing';
import type { BatchKey } from './components/Pricing';
import AuthScreen from './components/AuthScreen';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import BookShowcase from './components/BookShowcase';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Compass, 
  Users, 
  Smartphone,
  Check,
  X
} from 'lucide-react';

export default function App() {
  const [selectedClass, setSelectedClass] = useState<BatchKey>('12');
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'admin-auth' | 'admin-dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; batch: string } | null>(null);
  
  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('adminSession') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    // Check hash for direct admin access
    if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
      if (localStorage.getItem('adminSession') === 'true') {
        setIsAdminAuthenticated(true);
        setView('admin-dashboard');
      } else {
        setView('admin-auth');
      }
      return;
    }

    const savedUser = localStorage.getItem('studentSession');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleSelectBatch = (batchKey: BatchKey) => {
    setSelectedClass(batchKey);
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'abhishek.711p@gmail.com' && adminPassword === 'Aa@1122334455') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminSession', 'true');
      setAdminError('');
      setView('admin-dashboard');
    } else {
      setAdminError('Invalid admin email or password');
    }
  };

  if (view === 'admin-auth') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary, #fcfcfc)',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px 32px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #111827',
          boxShadow: '4px 4px 0px #111827'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827' }}>Admin Portal Login</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '8px', fontWeight: '500' }}>Enter your credentials to access the admin portal</p>
          </div>
          
          {adminError && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem', textAlign: 'center', fontWeight: 'bold', border: '2px solid #b91c1c' }}>
              {adminError}
            </div>
          )}
          
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', marginBottom: '6px', color: '#111827' }}>EMAIL</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid #111827', outline: 'none', fontWeight: '500' }}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', marginBottom: '6px', color: '#111827' }}>PASSWORD</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid #111827', outline: 'none', fontWeight: '500' }}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', marginTop: '8px', borderRadius: '8px', border: '2px solid #111827', background: '#ef4444', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '2px 2px 0px #111827' }}>
              Login to Admin Panel
            </button>
            <button type="button" onClick={() => setView('landing')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#4b5563', fontWeight: '700', cursor: 'pointer' }}>
              ← Back to Main Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'admin-dashboard' && isAdminAuthenticated) {
    return (
      <AdminDashboard 
        onLogout={() => {
          localStorage.removeItem('adminSession');
          setIsAdminAuthenticated(false);
          setView('landing');
        }}
      />
    );
  }

  if (view === 'auth') {
    return (
      <AuthScreen 
        onSuccess={(user) => {
          localStorage.setItem('studentSession', JSON.stringify(user));
          localStorage.setItem('drona_active_tab', 'communication');
          setCurrentUser(user);
          setView('dashboard');
        }}
        onBack={() => setView('landing')}
        defaultBatch={selectedClass}
      />
    );
  }

  if (view === 'dashboard' && currentUser) {
    return (
      <StudentDashboard 
        user={currentUser}
        onLogout={() => {
          localStorage.removeItem('studentSession');
          setCurrentUser(null);
          setView('landing');
        }}
      />
    );
  }

  return (
    <div className="app-wrapper">
      <Navbar 
        onSelectBatch={handleSelectBatch} 
        onJoinClick={() => setView('auth')} 
        onAdminClick={() => setView(isAdminAuthenticated ? 'admin-dashboard' : 'admin-auth')}
      />
      
      {/* Decorative Glow Elements */}
      <div className="glow-glow glow-indigo"></div>
      <div className="glow-glow glow-emerald"></div>

      {/* Master First-Fold Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          
          <div className="hero-content">
            <div className="hero-badge float-animation">
              <Sparkles size={14} className="text-emerald" />
              <span>Dedicated Topper Mentors + 24/7 AI WhatsApp Planner</span>
            </div>
            
            <h1 className="hero-title">
              Restart <span className="gradient-text-indigo">Club</span>
            </h1>
            
            <h2 className="hero-subtitle-primary">
              Dedicated IIT/NEET Mentor + 24/7 Hinglish AI WhatsApp Doubts
            </h2>
            
            <p className="hero-subtitle">
              Get matched with dedicated topper mentors who build your weekly study schedules and review your backlog, backed by a 24/7 AI assistant on WhatsApp for instant doubt solving. Tailored for Class 10–12, JEE & NEET.
            </p>

            {/* Quick Batch Selection Bar */}
            <div className="hero-batch-selector">
              <span className="selector-label">Select Your Batch:</span>
              <div className="batch-chips">
                <button onClick={() => handleSelectBatch('10')} className={`batch-chip ${selectedClass === '10' ? 'active' : ''}`}>Class 10</button>
                <button onClick={() => handleSelectBatch('11')} className={`batch-chip ${selectedClass === '11' ? 'active' : ''}`}>Class 11</button>
                <button onClick={() => handleSelectBatch('12')} className={`batch-chip ${selectedClass === '12' ? 'active' : ''}`}>Class 12</button>
                <button onClick={() => handleSelectBatch('jee-dropper')} className={`batch-chip ${selectedClass === 'jee-dropper' ? 'active' : ''}`}>JEE Dropper</button>
                <button onClick={() => handleSelectBatch('neet-dropper')} className={`batch-chip ${selectedClass === 'neet-dropper' ? 'active' : ''}`}>NEET Dropper</button>
              </div>
            </div>
            
            {/* Instant Action CTAs */}
            <div className="hero-actions">
              <button onClick={() => setView('auth')} className="btn btn-primary" style={{ cursor: 'pointer' }}>
                🚀 Join Batch (Starts ₹499/6mos) <ArrowRight size={16} />
              </button>
              <a href="#simulator" className="btn btn-secondary">
                💬 Try WhatsApp Demo <MessageSquare size={16} />
              </a>
            </div>

            <div className="hero-social-proof">
              <div className="proof-item">
                <span className="proof-number">Class 10–12 & Droppers</span>
                <span className="proof-label">Boards, JEE & NEET</span>
              </div>
              <div className="proof-item">
                <span className="proof-number">₹499 / 6 Months</span>
                <span className="proof-label">Hybrid Mentorship</span>
              </div>
              <div className="proof-item">
                <span className="proof-number">WhatsApp 24/7</span>
                <span className="proof-label">Daily Guidance</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Area: Sleek First-Fold Master Card */}
          <div className="hero-visual">
            <div className="visual-card-glow"></div>
            <div className="glass-card hero-preview-card">
              <div className="preview-card-header">
                <div className="preview-status-pill">
                  <div className="pulse-indicator"></div> Live Personal Mentor
                </div>
                <span className="preview-batch-tag">Batch 2026</span>
              </div>

              <div className="preview-feature-box">
                <div className="preview-feat-row">
                  <span className="preview-icon-badge">🎯</span>
                  <div>
                    <strong>Dedicated Topper Guidance</strong>
                    <p>IITian & NEET toppers track your weekly targets</p>
                  </div>
                </div>
                <div className="preview-feat-row">
                  <span className="preview-icon-badge">⚡</span>
                  <div>
                    <strong>24/7 WhatsApp AI Assistant</strong>
                    <p>Instant step-by-step Hinglish doubt solving</p>
                  </div>
                </div>
                <div className="preview-feat-row">
                  <span className="preview-icon-badge">📚</span>
                  <div>
                    <strong>All-In-One Study Vault</strong>
                    <p>NCERT Solutions, 15+ Yrs PYQs & Formula Sheets</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setView('auth')}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px', padding: '12px', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Register & Start Preparation Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3D Animated Book Material Showcase (Full Width Dedicated Section) */}
      <BookShowcase />

      {/* Simulator Section */}
      <ChatSimulator />

      {/* Pricing & Batch Registration Section */}
      <Pricing selectedClass={selectedClass} setSelectedClass={setSelectedClass} onJoinClick={() => setView('auth')} />

      {/* Join The Family & Support Section */}
      <section className="join-family-section">
        <div className="container text-center">
          <h2 className="section-title">Join the RestartClub Family</h2>
          <p className="section-description max-w-md mx-auto">
            Stay updated with free study notes, formula cheatsheets, and live board strategy announcements.
          </p>
          <button 
            onClick={() => setView('auth')} 
            className="btn btn-accent"
            style={{ marginTop: '20px', marginBottom: '16px', padding: '14px 32px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer' }}
          >
            Register / Login to Your Account <ArrowRight size={16} />
          </button>
          
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px' }}>
            ⚠️ Facing any issues? Contact support directly at: <a href="mailto:rstartclub@gmail.com" style={{ color: '#ffffff', fontWeight: '700', textDecoration: 'underline' }}>rstartclub@gmail.com</a>
          </div>
          
          <div className="social-links-grid">
            <a href="https://t.me/+qUnxBGBGFHFiNjdl" target="_blank" rel="noopener noreferrer" className="social-btn telegram">
              <Compass size={20} />
              <span>Join Telegram Group</span>
            </a>
            <a href="https://chat.whatsapp.com/Ex2TyD2lP5aJGPvwUVT4tS" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp-social">
              <Smartphone size={20} />
              <span>Join WhatsApp Group</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-container">
          <div className="footer-left">
            <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(255,255,255,0.15)',
                border: '1.5px solid #ffffff',
                flexShrink: 0
              }}>
                <img src="/logo.png" alt="RestartClub Logo" style={{ width: '92%', height: '92%', objectFit: 'contain' }} />
              </div>
              <span className="logo-text">Restart <span className="logo-highlight">Club</span></span>
            </div>
            <p className="footer-desc">Empowering Class 10–12, JEE & NEET students with dedicated mentors and 24/7 Hinglish AI WhatsApp guides.</p>
          </div>
          <div className="footer-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span className="copyright">© 2026 RestartClub Mentorship. All rights reserved.</span>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📧 Point of Contact:</span>
              <a href="mailto:rstartclub@gmail.com" style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: '700' }}>
                rstartclub@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
