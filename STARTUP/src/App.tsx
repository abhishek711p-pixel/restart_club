import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatSimulator from './components/ChatSimulator';
import BentoGrid from './components/BentoGrid';
import Pricing from './components/Pricing';
import type { BatchKey } from './components/Pricing';
import FaqAccordion from './components/FaqAccordion';
import LeadCaptureModal from './components/LeadCaptureModal';
import SamplePreviewModal from './components/SamplePreviewModal';
import StickyMobileBar from './components/StickyMobileBar';
import AuthScreen from './components/AuthScreen';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Compass, Smartphone } from 'lucide-react';

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
      
      {/* Ambient Glows */}
      <div className="glow-glow glow-indigo"></div>
      <div className="glow-glow glow-emerald"></div>

      <main>
        {/* 1. High-Impact Centered Hero Fold */}
        <Hero
          activeTrack={activeTrack}
          onTrackChange={handleTrackChange}
          onBookCall={() => setIsLeadModalOpen(true)}
        />

        {/* 2. Interactive WhatsApp AI Simulator (Immediate User Engagement) */}
        <ChatSimulator />

        {/* 3. Core Features & High-Yield Notes Matrix (Bento Grid) */}
        <div id="resources">
          <BentoGrid 
            activeTrack={activeTrack} 
            onOpenSampleModal={handleOpenSampleModal}
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
            onTrySimulator={() => {
              const el = document.getElementById('simulator');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* 4. Transparent Pricing & Batch Plans */}
        <Pricing 
          selectedClass={selectedClass} 
          setSelectedClass={handleSelectBatch} 
          onJoinClick={() => setView('auth')} 
        />

        {/* 5. Concise FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* Streamlined Consolidated Footer */}
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
            {/* Quick Community Channels */}
            <div className="footer-community-links">
              <a href="https://t.me/+qUnxBGBGFHFiNjdl" target="_blank" rel="noopener noreferrer" className="footer-comm-pill">
                <Compass size={14} /> Telegram Channel
              </a>
              <a href="https://chat.whatsapp.com/Ex2TyD2lP5aJGPvwUVT4tS" target="_blank" rel="noopener noreferrer" className="footer-comm-pill">
                <Smartphone size={14} /> WhatsApp Community
              </a>
            </div>
          </div>
          
          <div className="footer-right">
            <span className="copyright">© 2026 RestartClub Mentorship. All rights reserved.</span>
            <div className="footer-poc-row">
              <span>📧 Support & Enquiries:</span>
              <a href="mailto:rstartclub@gmail.com" className="footer-poc-email">
                rstartclub@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Action Bar on Mobile (<768px) */}
      <StickyMobileBar 
        activeTrack={activeTrack} 
        onBookCall={() => setIsLeadModalOpen(true)} 
      />

      {/* Free Sample Preview Drawer / Modal */}
      <SamplePreviewModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        defaultTrack={sampleModalTrack}
        onBookCall={() => {
          setIsSampleModalOpen(false);
          setIsLeadModalOpen(true);
        }}
      />

      {/* 1-on-1 Strategy Call Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        defaultTrack={activeTrack}
      />
    </div>
  );
}
