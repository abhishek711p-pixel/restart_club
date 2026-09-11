import { ArrowRight, MessageSquare, Calendar, ShieldCheck, Zap, BookOpen } from 'lucide-react';

interface HeroProps {
  activeTrack: 'neet' | 'jee';
  onTrackChange: (track: 'neet' | 'jee') => void;
  onBookCall: () => void;
  onJoinClick: () => void;
}

export default function Hero({
  activeTrack,
  onTrackChange,
  onBookCall,
  onJoinClick
}: HeroProps) {
  const mentorData = activeTrack === 'neet' ? {
    name: 'Dr. Aryan Sharma',
    tag: 'AIR 89 • AIIMS New Delhi',
    initials: 'AS',
    avatarBg: '#10b981',
    noteFeature: 'NCERT Line-by-Line Notes & Reaction Maps'
  } : {
    name: 'Rohan Verma',
    tag: 'AIR 247 • IIT Bombay (CSE)',
    initials: 'RV',
    avatarBg: '#6366f1',
    noteFeature: 'Physics Formula Logs & JEE Adv Trap Maps'
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        {/* Left Column: Core Value Proposition */}
        <div className="hero-content">
          {/* 1. Single Clean Segment Switcher */}
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

          {/* 2. High-Impact Headline */}
          <h1 className="hero-title-clean">
            Crack {activeTrack === 'neet' ? 'NEET' : 'JEE'} with{' '}
            <span className="hero-gradient-text">AIR Topper Mentors</span> & 24/7 AI Doubt Solving
          </h1>

          {/* 3. Concise 2-Sentence Subtitle */}
          <p className="hero-desc-clean">
            Get personalized 1-on-1 strategy sessions, high-yield {activeTrack === 'neet' ? 'NCERT Biology short notes' : 'Physics formula logs'}, and instant Hinglish WhatsApp doubt clearance built for Class 10–12 & droppers.
          </p>

          {/* 4. Dual Primary CTAs (Above the Fold) */}
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
            <a href="#simulator" className="hero-secondary-btn">
              <Zap size={17} className="text-amber" />
              <span>Try WhatsApp AI Solver ⚡</span>
            </a>
          </div>

          {/* 5. Clean Single-Line Social Proof */}
          <div className="hero-social-line">
            <span className="stars-icon">⭐⭐⭐⭐⭐</span>
            <span className="social-text">
              Trusted by <strong>1,000+ aspirants</strong> • Mentors from <strong>AIIMS & IITs</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Refined Interactive Preview Card */}
        <div className="hero-visual">
          <div className="hero-card-glow"></div>
          <div className="hero-streamlined-card">
            
            {/* Mentor Badge */}
            <div className="card-mentor-row">
              <div className="card-avatar" style={{ background: mentorData.avatarBg }}>
                {mentorData.initials}
              </div>
              <div className="card-mentor-meta">
                <div className="card-mentor-name-wrap">
                  <strong>{mentorData.name}</strong>
                  <span className="card-status-dot" title="Active Mentor"></span>
                </div>
                <span className="card-mentor-rank">{mentorData.tag}</span>
              </div>
            </div>

            {/* 3 Clean Spaced Feature Chips */}
            <div className="card-features-stack">
              <div className="card-feat-item">
                <div className="feat-icon-box">
                  <ShieldCheck size={16} className="text-emerald" />
                </div>
                <span>Weekly 1-on-1 Strategy & Target Tracking</span>
              </div>

              <div className="card-feat-item">
                <div className="feat-icon-box">
                  <MessageSquare size={16} className="text-emerald" />
                </div>
                <span>24/7 Hinglish WhatsApp AI Solver (with human SOS handoff)</span>
              </div>

              <div className="card-feat-item">
                <div className="feat-icon-box">
                  <BookOpen size={16} className="text-indigo" />
                </div>
                <span>{mentorData.noteFeature}</span>
              </div>
            </div>

            {/* Bottom Card Action */}
            <button
              onClick={onJoinClick}
              className="card-action-btn"
              type="button"
            >
              <span>Explore Batches (Starts ₹499/6mos)</span>
              <ArrowRight size={14} />
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}
