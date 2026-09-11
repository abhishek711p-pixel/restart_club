import { ArrowRight, Calendar, LogIn, CheckCircle2, Award } from 'lucide-react';

interface HeroProps {
  activeTrack: 'neet' | 'jee';
  onTrackChange: (track: 'neet' | 'jee') => void;
  onBookCall: () => void;
  onLoginClick?: () => void;
  onJoinClick?: () => void;
}

export default function Hero({
  activeTrack,
  onTrackChange,
  onBookCall,
  onLoginClick,
  onJoinClick
}: HeroProps) {
  return (
    <section className="hero-section hero-section-centered">
      <div className="container hero-container-centered">
        
        {/* Centered Target Stream Switcher */}
        <div className="hero-stream-pill">
          <button
            type="button"
            className={`stream-pill-btn ${activeTrack === 'neet' ? 'active-neet' : ''}`}
            onClick={() => onTrackChange('neet')}
            aria-label="Switch to NEET Aspirant Track"
          >
            🩺 NEET Aspirant
          </button>
          <button
            type="button"
            className={`stream-pill-btn ${activeTrack === 'jee' ? 'active-jee' : ''}`}
            onClick={() => onTrackChange('jee')}
            aria-label="Switch to JEE Main + Advanced Track"
          >
            ⚡ JEE Main + Adv
          </button>
        </div>

        {/* High-Intent SEO Sub-Pill / Target Query Cluster */}
        <div className="hero-subpill-badge">
          <Award size={14} className="text-emerald inline-block mr-1" />
          <span>1-on-1 Strategy from AIIMS & IIT Rankers</span>
        </div>

        {/* Semantic H1 with High-Intent Keyword Density */}
        <h1 className="hero-title-clean">
          Crack {activeTrack === 'neet' ? 'NEET' : 'JEE'} with{' '}
          <span className="hero-gradient-text">AIR Topper Mentors</span> & 24/7 AI Doubt Solving
        </h1>

        {/* Semantic H2 Sub-Header for Crawlers */}
        <h2 className="hero-subtitle-seo">
          Result-Oriented Mentorship: Backlog Clearance, Timetables & Mock Analysis
        </h2>

        {/* Concise High-Converting Subtitle */}
        <p className="hero-desc-clean">
          Customized preparation roadmaps for <strong>Class 10, 11, 12 & Droppers</strong>. Get dedicated 1-on-1 guidance, high-yield {activeTrack === 'neet' ? 'NCERT Biology short notes' : 'Physics formula logs'}, and instant 24/7 Hinglish WhatsApp doubt clearance.
        </p>

        {/* Key USPs / Trust Checks */}
        <div className="hero-usp-strip">
          <div className="usp-item">
            <CheckCircle2 size={14} className="text-emerald" />
            <span>Zero Backlog Guarantee Plan</span>
          </div>
          <div className="usp-item">
            <CheckCircle2 size={14} className="text-emerald" />
            <span>Late-Night WhatsApp AI Doubts</span>
          </div>
          <div className="usp-item">
            <CheckCircle2 size={14} className="text-emerald" />
            <span>Weekly 1-on-1 AIR Syncs</span>
          </div>
        </div>

        {/* Dual Primary CTAs */}
        <div className="hero-cta-group">
          <button 
            onClick={onBookCall} 
            className="hero-primary-btn"
            type="button"
            aria-label="Claim Free Mentorship Call"
          >
            <Calendar size={18} />
            <span>Claim Free Mentorship Call</span>
            <ArrowRight size={16} />
          </button>
          
          <button 
            onClick={onLoginClick || onJoinClick} 
            className="hero-secondary-btn"
            type="button"
            aria-label="Student Login or Sign Up"
          >
            <LogIn size={17} className="text-emerald" />
            <span>Student Login / Sign Up</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Social Proof Banner */}
        <div className="hero-social-line">
          <span className="stars-icon">⭐⭐⭐⭐⭐</span>
          <span className="social-text">
            Trusted by <strong>1,000+ aspirants</strong> • Mentors from <strong>AIIMS Delhi, IIT Bombay & IIT Delhi</strong>
          </span>
        </div>

      </div>
    </section>
  );
}
