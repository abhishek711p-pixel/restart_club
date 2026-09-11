import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

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

        {/* 4 Clean Navigation Links */}
        <nav className="nav-links">
          <a href="#features" className="nav-link">Mentorship</a>
          <a href="#resources" className="nav-link">Resources</a>
          <a href="#simulator" className="nav-link">AI Solver</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </nav>

        {/* Single Distinct High-Contrast CTA */}
        <div className="nav-cta">
          <button
            onClick={onBookCallClick || onJoinClick}
            className="nav-btn nav-btn-primary"
            type="button"
          >
            <span>Claim Free Call</span>
            <ArrowRight size={15} />
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

      {/* Clean Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-drawer">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
            🎯 Mentorship
          </a>
          <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
            📚 Resources
          </a>
          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
            ⚡ AI Doubt Solver
          </a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
            💳 Pricing Plans
          </a>

          <div className="mobile-drawer-actions">
            <button
              onClick={() => { setMobileMenuOpen(false); onBookCallClick(); }}
              className="mobile-cta-primary"
            >
              Claim Free Mentorship Call →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
