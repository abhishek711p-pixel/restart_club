import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onSelectBatch: (batchKey: '10' | '11' | '12' | 'jee-dropper' | 'neet-dropper') => void;
  onJoinClick: () => void;
  onAdminClick?: () => void;
}

export default function Navbar({ onSelectBatch, onJoinClick, onAdminClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <div className="logo-section" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          <img src="/logo.png" alt="RestartClub Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
          <span className="logo-text">Restart <span className="logo-highlight">Club</span></span>
        </div>
        
        <nav className="nav-links">
          <div className="nav-dropdown-container">
            <button className="nav-dropdown-trigger">
              Batches <span className="dropdown-arrow">▼</span>
            </button>
            <div className="dropdown-menu">
              <button onClick={() => onSelectBatch('10')} className="dropdown-item">Class 10 (Foundation)</button>
              <button onClick={() => onSelectBatch('11')} className="dropdown-item">Class 11 (Aarambh)</button>
              <button onClick={() => onSelectBatch('12')} className="dropdown-item">Class 12 (Sankalp)</button>
              <button onClick={() => onSelectBatch('jee-dropper')} className="dropdown-item">JEE Dropper</button>
              <button onClick={() => onSelectBatch('neet-dropper')} className="dropdown-item">NEET Dropper</button>
            </div>
          </div>
          <a href="#simulator" className="nav-link">AI Simulator</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="https://chat.whatsapp.com/Ex2TyD2lP5aJGPvwUVT4tS?s=cl&p=a&ilr=1&amv=2" target="_blank" rel="noopener noreferrer" className="nav-link">Community</a>
        </nav>
        
        <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={onJoinClick} className="nav-btn" style={{ cursor: 'pointer' }}>
            Join <span className="price-tag hide-on-mobile">Starts at ₹499/6mos</span>
          </button>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-drawer">
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

          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">🤖 AI Simulator</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">💳 Pricing Plans</a>
          <a href="https://chat.whatsapp.com/Ex2TyD2lP5aJGPvwUVT4tS" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">💬 WhatsApp Community</a>
        </div>
      )}
    </header>
  );
}
