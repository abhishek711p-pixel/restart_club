import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onSelectBatch: (batchKey: '10' | '11' | '12' | 'jee-dropper' | 'neet-dropper') => void;
  onJoinClick: () => void;
  onAdminClick?: () => void;
}

export default function Navbar({ onSelectBatch, onJoinClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [batchesOpen, setBatchesOpen] = useState(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <div className="logo-section" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => window.location.href = '/'}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(255,255,255,0.2)',
            border: '2px solid #ffffff',
            flexShrink: 0
          }}>
            <img src="/logo.png" alt="RestartClub Logo" style={{ width: '92%', height: '92%', objectFit: 'contain' }} />
          </div>
          <span className="logo-text" style={{ fontSize: '1.45rem' }}>Restart <span className="logo-highlight">Club</span></span>
        </div>
        
        <nav className="nav-links">
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
