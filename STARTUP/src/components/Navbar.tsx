import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User } from 'lucide-react';

interface NavbarProps {
  onJoinClick: () => void;
  onBookCallClick: () => void;
}

export default function Navbar({ onJoinClick, onBookCallClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        
        {/* Brand Logo */}
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

        {/* 4 Clean Navigation Links (Desktop) */}
        <nav className="nav-links">
          <a href="#features" className="nav-link">Mentorship</a>
          <a href="#resources" className="nav-link">Resources</a>
          <a href="#simulator" className="nav-link">AI Solver</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </nav>

        {/* Right CTA Area */}
        <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Desktop Primary CTA */}
          <button
            onClick={onBookCallClick}
            className="nav-btn nav-btn-primary hide-on-mobile"
            type="button"
          >
            <span>Claim Free Call</span>
            <ArrowRight size={15} />
          </button>

          {/* Mobile Quick Sign-In Pill */}
          <button
            onClick={onJoinClick}
            className="mobile-quick-signin-btn show-on-mobile-only"
            type="button"
          >
            <User size={13} />
            <span>Login</span>
          </button>

          {/* Hamburger Menu Toggle */}
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

      {/* Clean Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-drawer">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
            🎯 Mentorship Track
          </a>
          <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
            📚 Notes & Cheatsheets
          </a>
          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
            ⚡ 24/7 AI Doubt Solver
          </a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
            💳 Batch Pricing & Plans
          </a>

          <div className="mobile-drawer-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onBookCallClick(); }}
              className="mobile-cta-primary"
            >
              Claim Free Mentorship Call →
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onJoinClick(); }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Student Login / Sign Up →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
