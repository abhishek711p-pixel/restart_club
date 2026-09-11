import { ArrowRight, Calendar, LogIn } from 'lucide-react';

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
        
        {/* Centered Segment Switcher */}
        <div className="hero-stream-pill">
          <button
            type="button"
            className={`stream-pill-btn ${activeTrack === 'neet' ? 'active-neet' : ''}`}
            onClick={() => onTrackChange('neet')}
          >
            🩺 NEET Aspirant
          </button>
          <button
            type="button"
            className={`stream-pill-btn ${activeTrack === 'jee' ? 'active-jee' : ''}`}
            onClick={() => onTrackChange('jee')}
          >
            ⚡ JEE Main + Adv
          </button>
        </div>

        {/* High-Impact Headline */}
        <h1 className="hero-title-clean">
          Crack {activeTrack === 'neet' ? 'NEET' : 'JEE'} with{' '}
          <span className="hero-gradient-text">AIR Topper Mentors</span> & 24/7 AI Doubt Solving
        </h1>

        {/* Concise 2-Sentence Subtitle */}
        <p className="hero-desc-clean">
          Get personalized 1-on-1 strategy sessions, high-yield {activeTrack === 'neet' ? 'NCERT Biology short notes' : 'Physics formula logs'}, and instant Hinglish WhatsApp doubt clearance built for Class 10–12 & droppers.
        </p>

        {/* Dual Primary CTAs */}
        <div className="hero-cta-group">
          <button 
            onClick={onBookCall} 
            className="hero-primary-btn"
            type="button"
          >
            <Calendar size={18} />
            <span>Claim Free Mentorship Call</span>
            <ArrowRight size={16} />
          </button>
          
          <button 
            onClick={onLoginClick || onJoinClick} 
            className="hero-secondary-btn"
            type="button"
          >
            <LogIn size={17} className="text-emerald" />
            <span>Student Login / Sign Up</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Single-Line Social Proof */}
        <div className="hero-social-line">
          <span className="stars-icon">⭐⭐⭐⭐⭐</span>
          <span className="social-text">
            Trusted by <strong>1,000+ aspirants</strong> • Mentors from <strong>AIIMS & IITs</strong>
          </span>
        </div>

      </div>
    </section>
  );
}
