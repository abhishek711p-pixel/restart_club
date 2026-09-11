import { useState } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onSelectBatch: (batchKey: '10' | '11' | '12' | 'jee-dropper' | 'neet-dropper') => void;
  onJoinClick: () => void;
  onBookCallClick?: () => void;
  activeTrack: 'neet' | 'jee';
  setActiveTrack: (track: 'neet' | 'jee') => void;
}

export default function Navbar({
  onSelectBatch,
  onJoinClick,
  onBookCallClick,
  activeTrack,
  setActiveTrack
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [batchesOpen, setBatchesOpen] = useState(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        
        {/* Brand Logo & Track Indicator */}
        <div className="navbar-brand-row">
          <div
            className="logo-section"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="navbar-logo-box">
              <img src="/logo.png" alt="RestartClub Logo" className="navbar-logo-img" />
            </div>
            <span className="logo-text">Restart <span className="logo-highlight">Club</span></span>
          </div>

          {/* Quick Mini Track Switcher in Navbar for Desktop */}
          <div className="nav-track-toggle hide-on-mobile">
            <button
              className={`nav-track-btn ${activeTrack === 'neet' ? 'active' : ''}`}
              onClick={() => setActiveTrack('neet')}
              type="button"
            >
              🩺 NEET
            </button>
            <button
              className={`nav-track-btn ${activeTrack === 'jee' ? 'active' : ''}`}
              onClick={() => setActiveTrack('jee')}
              type="button"
            >
              ⚡ JEE
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          {/* Batches Dropdown */}
          <div 
            className={`nav-dropdown-container ${batchesOpen ? 'active' : ''}`}
            onMouseEnter={() => setBatchesOpen(true)}
            onMouseLeave={() => setBatchesOpen(false)}
          >
            <button 
              className="nav-dropdown-trigger"
              onClick={() => setBatchesOpen(prev => !prev)}
              type="button"
              aria-expanded={batchesOpen}
            >
              Batches <span className={`dropdown-arrow ${batchesOpen ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`dropdown-menu ${batchesOpen ? 'open' : ''}`}>
              <button onClick={() => { onSelectBatch('10'); setBatchesOpen(false); }} className="dropdown-item">Class 10 (Foundation)</button>
              <button onClick={() => { onSelectBatch('11'); setBatchesOpen(false); }} className="dropdown-item">Class 11 (Aarambh)</button>
              <button onClick={() => { onSelectBatch('12'); setBatchesOpen(false); }} className="dropdown-item">Class 12 (Sankalp)</button>
              <button onClick={() => { onSelectBatch('jee-dropper'); setBatchesOpen(false); }} className="dropdown-item">JEE Dropper</button>
              <button onClick={() => { onSelectBatch('neet-dropper'); setBatchesOpen(false); }} className="dropdown-item">NEET Dropper</button>
            </div>
          </div>

          <a href="#features" className="nav-link">Mentorship</a>
          <a href="#resources" className="nav-link">Resources</a>
          <a href="#simulator" className="nav-link">AI Solver</a>
          <a href="#mentors" className="nav-link">AIR Mentors</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="nav-cta">
          {onBookCallClick && (
            <button
              onClick={onBookCallClick}
              className="nav-free-call-btn hide-on-mobile"
              type="button"
            >
              <Sparkles size={13} className="text-emerald" /> Free Strategy Call
            </button>
          )}

          <button onClick={onJoinClick} className="nav-btn" type="button">
            <span>Get Started</span>
            <ArrowRight size={14} className="hide-on-mobile" />
          </button>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            type="button"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-drawer">
          {/* Mobile Track Selection */}
          <div className="mobile-track-row">
            <span className="mobile-track-label">ACTIVE TRACK:</span>
            <div className="mobile-track-btns">
              <button
                className={`mobile-track-btn ${activeTrack === 'neet' ? 'active' : ''}`}
                onClick={() => setActiveTrack('neet')}
              >
                🩺 NEET UG
              </button>
              <button
                className={`mobile-track-btn ${activeTrack === 'jee' ? 'active' : ''}`}
                onClick={() => setActiveTrack('jee')}
              >
                ⚡ JEE Main + Adv
              </button>
            </div>
          </div>

          <div className="mobile-batch-group">
            <span className="mobile-group-title">EXPLORE BATCHES</span>
            <div className="mobile-batch-buttons">
              <button onClick={() => { onSelectBatch('10'); setMobileMenuOpen(false); }}>Class 10</button>
              <button onClick={() => { onSelectBatch('11'); setMobileMenuOpen(false); }}>Class 11</button>
              <button onClick={() => { onSelectBatch('12'); setMobileMenuOpen(false); }}>Class 12</button>
              <button onClick={() => { onSelectBatch('jee-dropper'); setMobileMenuOpen(false); }}>JEE Dropper</button>
              <button onClick={() => { onSelectBatch('neet-dropper'); setMobileMenuOpen(false); }}>NEET Dropper</button>
            </div>
          </div>

          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">🎯 1-on-1 Mentorship</a>
          <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">📚 High-Yield Vault</a>
          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">🤖 WhatsApp AI Solver</a>
          <a href="#mentors" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">🏆 AIR Topper Mentors</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">💳 Pricing Plans</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">❓ FAQ</a>
          
          <div className="mobile-drawer-actions">
            {onBookCallClick && (
              <button
                onClick={() => { setMobileMenuOpen(false); onBookCallClick(); }}
                className="mobile-cta-secondary"
              >
                Book 1-on-1 Call (Free)
              </button>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); onJoinClick(); }}
              className="mobile-cta-primary"
            >
              Join RestartClub (₹499)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
