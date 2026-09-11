import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import MentorTrust from './components/MentorTrust';
import FaqAccordion from './components/FaqAccordion';
import LeadCaptureModal from './components/LeadCaptureModal';
import SamplePreviewModal from './components/SamplePreviewModal';
import StickyMobileBar from './components/StickyMobileBar';
import ChatSimulator from './components/ChatSimulator';
import Pricing from './components/Pricing';
import type { BatchKey } from './components/Pricing';
import AuthScreen from './components/AuthScreen';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import BookShowcase from './components/BookShowcase';
import { 
  ArrowRight, 
  Compass, 
  Smartphone,
  Calendar
} from 'lucide-react';

export default function App() {
  const [selectedClass, setSelectedClass] = useState<BatchKey>('12');
  const [activeTrack, setActiveTrack] = useState<'neet' | 'jee'>('neet');
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'admin-auth' | 'admin-dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; batch: string } | null>(null);
  
  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [sampleModalTrack, setSampleModalTrack] = useState<'neet' | 'jee'>('neet');

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
      try {
        setCurrentUser(JSON.parse(savedUser));
        setView('dashboard');
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const handleSelectBatch = (batchKey: BatchKey) => {
    setSelectedClass(batchKey);
    if (batchKey === 'neet-dropper') {
      setActiveTrack('neet');
    } else if (batchKey === 'jee-dropper') {
      setActiveTrack('jee');
    }
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrackChange = (track: 'neet' | 'jee') => {
    setActiveTrack(track);
    if (track === 'neet' && selectedClass === 'jee-dropper') {
      setSelectedClass('neet-dropper');
    } else if (track === 'jee' && selectedClass === 'neet-dropper') {
      setSelectedClass('jee-dropper');
    }
  };

  const handleOpenSampleModal = (track?: 'neet' | 'jee') => {
    setSampleModalTrack(track || activeTrack);
    setIsSampleModalOpen(true);
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
        background: '#09090b',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px 32px',
          background: '#121215',
          borderRadius: '16px',
          border: '1.5px solid #27272a',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff' }}>Admin Portal Login</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginTop: '8px', fontWeight: '500' }}>Enter your credentials to access the admin portal</p>
          </div>
          
          {adminError && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem', textAlign: 'center', fontWeight: 'bold' }}>
              {adminError}
            </div>
          )}
          
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', marginBottom: '6px', color: '#e4e4e7' }}>EMAIL</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #27272a', background: '#18181b', color: '#ffffff', outline: 'none', fontWeight: '500' }}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', marginBottom: '6px', color: '#e4e4e7' }}>PASSWORD</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #27272a', background: '#18181b', color: '#ffffff', outline: 'none', fontWeight: '500' }}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', marginTop: '8px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '800', cursor: 'pointer' }}>
              Login to Admin Panel
            </button>
            <button type="button" onClick={() => setView('landing')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#a1a1aa', fontWeight: '700', cursor: 'pointer' }}>
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
        onJoinClick={() => setView('auth')} 
        onBookCallClick={() => setIsLeadModalOpen(true)}
      />
      
      {/* Ambient Decorative Glows */}
      <div className="glow-glow glow-indigo"></div>
      <div className="glow-glow glow-emerald"></div>

      <main>
        {/* Streamlined Clean Hero Section */}
        <Hero
          activeTrack={activeTrack}
          onTrackChange={handleTrackChange}
          onBookCall={() => setIsLeadModalOpen(true)}
          onJoinClick={() => setView('auth')}
        />

        {/* Feature Grid / Value Matrix (Bento Grid) */}
        <BentoGrid 
          activeTrack={activeTrack} 
          onOpenSampleModal={handleOpenSampleModal}
          onOpenLeadModal={() => setIsLeadModalOpen(true)}
          onTrySimulator={() => {
            const el = document.getElementById('simulator');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3D Animated Book Material Showcase (Vault) */}
        <div id="resources">
          <BookShowcase />
        </div>

        {/* Simulator Section (WhatsApp AI Doubt Assistant) */}
        <ChatSimulator />

        {/* Mentor & Trust Section */}
        <MentorTrust 
          activeTrack={activeTrack} 
          onBookCall={() => setIsLeadModalOpen(true)} 
        />

        {/* Pricing & Batch Registration Section */}
        <Pricing 
          selectedClass={selectedClass} 
          setSelectedClass={handleSelectBatch} 
          onJoinClick={() => setView('auth')} 
        />

        {/* FAQ Accordion Section */}
        <FaqAccordion />

        {/* Join The Family & Support Section */}
        <section className="join-family-section">
          <div className="container text-center">
            <h2 className="section-title">Join the RestartClub Family</h2>
            <p className="section-description max-w-md mx-auto">
              Stay updated with free study notes, formula cheatsheets, and live strategy announcements.
            </p>
            <div className="family-action-buttons">
              <button 
                onClick={() => setView('auth')} 
                className="btn btn-accent"
                type="button"
              >
                Enroll in Batch (Starts ₹499) <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="btn btn-secondary"
                type="button"
              >
                <Calendar size={16} /> Book Free Strategy Call
              </button>
            </div>
            
            <div className="support-contact-notice">
              ⚠️ Facing any issues? Contact support directly at:{' '}
              <a href="mailto:rstartclub@gmail.com" className="support-email-link">
                rstartclub@gmail.com
              </a>
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
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-container">
          <div className="footer-left">
            <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="footer-logo-box">
                <img src="/logo.png" alt="RestartClub Logo" className="footer-logo-img" />
              </div>
              <span className="logo-text">Restart <span className="logo-highlight">Club</span></span>
            </div>
            <p className="footer-desc">
              Empowering Class 10–12, JEE & NEET students with dedicated 1-on-1 AIR Topper Mentors and 24/7 Hinglish AI WhatsApp doubt assistants.
            </p>
          </div>
          <div className="footer-right">
            <span className="copyright">© 2026 RestartClub Mentorship. All rights reserved.</span>
            <div className="footer-poc-row">
              <span>📧 Point of Contact:</span>
              <a href="mailto:rstartclub@gmail.com" className="footer-poc-email">
                rstartclub@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar on Mobile (<768px) */}
      <StickyMobileBar 
        activeTrack={activeTrack} 
        onBookCall={() => setIsLeadModalOpen(true)} 
      />

      {/* Interactive Free Sample Preview Drawer / Modal */}
      <SamplePreviewModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        defaultTrack={sampleModalTrack}
        onBookCall={() => {
          setIsSampleModalOpen(false);
          setIsLeadModalOpen(true);
        }}
      />

      {/* Lead Capture & 1-on-1 Strategy Call Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        defaultTrack={activeTrack}
      />
    </div>
  );
}
