import { Compass } from 'lucide-react';

interface NavbarProps {
  onSelectBatch: (batchKey: '10' | '11' | '12' | 'jee-dropper' | 'neet-dropper') => void;
  onJoinClick: () => void;
}

export default function Navbar({ onSelectBatch, onJoinClick }: NavbarProps) {
  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <div className="logo-section">
          <div className="logo-icon-wrapper">
            <Compass className="logo-icon animate-spin-slow" />
          </div>
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
          <a href="#about" className="nav-link">Compare & Choose</a>
        </nav>
        
        <div className="nav-cta">
          <button onClick={onJoinClick} className="btn btn-primary nav-btn" style={{ cursor: 'pointer' }}>
            Join the Family <span className="price-tag">₹500/mo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
