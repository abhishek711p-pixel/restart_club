import { Check, X, ShieldCheck, BookOpen, Users } from 'lucide-react';

const BATCH_DETAILS = {
  '10': {
    name: "RestartClub Foundation (Class 10)",
    tagline: "Board-Booster + JEE/NEET Foundation Prep",
    filled: 62,
    features: [
      "1-on-1 Dedicated Board Topper Mentor",
      "Toppers' handwritten Science & Math Board notes",
      "CBSE, ICSE & State Board writing paper checks",
      "Science & Maths Olympiad Foundation targets",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly Board Strategy sessions & live quizzes"
    ],
    waMessage: "Hi! I want to join the RestartClub Class 10 Foundation Batch (1-on-1 Mentorship | Limited 500 Seats)"
  },
  '11': {
    name: "RestartClub Aarambh (Class 11)",
    tagline: "Class 11 school syllabus + JEE/NEET concepts",
    filled: 74,
    features: [
      "1-on-1 Dedicated IITian / NEET Topper Mentor",
      "Physics & Chemistry formula sheets + topper revision notes",
      "Class 11 Backlog clearing planner & trackers",
      "Advanced Science/Math doubt solver guidance",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly Backlog Revision live audio lounges"
    ],
    waMessage: "Hi! I want to join the RestartClub Class 11 Aarambh Batch (1-on-1 Mentorship | Limited 500 Seats)"
  },
  '12': {
    name: "RestartClub Sankalp (Class 12)",
    tagline: "Class 12 Board preparation + JEE/NEET Cracker",
    filled: 91,
    features: [
      "1-on-1 Dedicated Top-Ranker IITian / NEET Mentor",
      "Class 12 Boards & JEE/NEET Toppers' handwritten notes & formula sheets",
      "Boards Pre-Board & Revision revision checklists",
      "Mock Test Analysis & mistake-tracking spreadsheets",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly JEE/NEET strategy audio sessions"
    ],
    waMessage: "Hi! I want to join the RestartClub Class 12 Sankalp Batch (1-on-1 Mentorship | Limited 500 Seats)"
  },
  'jee-dropper': {
    name: "RestartClub Dropper JEE",
    tagline: "Full JEE Main & Advanced coverage + Backlog tracker",
    filled: 83,
    features: [
      "1-on-1 Dedicated IITian Topper Mentor",
      "JEE Core Formula cheatsheets & topper-vetted short revision notes",
      "Dropper Backlog & Daily Practice Problem tracker",
      "JEE Main & Advanced weekly mock test analytics",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly live JEE problem-solving lounges"
    ],
    waMessage: "Hi! I want to join the RestartClub JEE Dropper Batch (1-on-1 Mentorship | Limited 500 Seats)"
  },
  'neet-dropper': {
    name: "RestartClub Dropper NEET",
    tagline: "Full NEET-UG coverage + NCERT line-by-line tracker",
    filled: 87,
    features: [
      "1-on-1 Dedicated NEET Topper Mentor (AIR < 1000)",
      "NEET Biology NCERT-blueprint short notes & Physics formula sheets",
      "Dropper Backlog & Biology NCERT mapping",
      "NEET mock test error checking & tracking sheets",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly live NEET mock strategy sessions"
    ],
    waMessage: "Hi! I want to join the RestartClub NEET Dropper Batch (1-on-1 Mentorship | Limited 500 Seats)"
  }
};

export type BatchKey = keyof typeof BATCH_DETAILS;

const BATCH_LABELS: Record<BatchKey, string> = {
  '10': 'Class 10',
  '11': 'Class 11',
  '12': 'Class 12',
  'jee-dropper': 'JEE Dropper',
  'neet-dropper': 'NEET Dropper'
};

interface PricingProps {
  selectedClass: BatchKey;
  setSelectedClass: (batchKey: BatchKey) => void;
  onJoinClick: () => void;
}

export default function Pricing({ selectedClass, setSelectedClass, onJoinClick }: PricingProps) {
  const currentBatch = BATCH_DETAILS[selectedClass];
  const seatsLeft = 500 - currentBatch.filled;
  const percentFilled = (currentBatch.filled / 500) * 100;

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        
        <div className="pricing-header text-center">
          <div className="badge-pill" style={{ background: '#fef2f2', color: '#ef4444', borderColor: '#ef4444' }}>
            🚨 Limited Seats: 500 Only
          </div>
          <h2 className="section-title">Select Your Class Batch</h2>
          <p className="section-description max-w-2xl mx-auto">
            To maintain high personal guidance quality, we strictly limit each batch to the **first 500 students**. Register now before admissions close!
          </p>

          {/* Class Selector Tabs */}
          <div className="class-selector-tabs" style={{
            display: 'inline-flex',
            background: '#ffffff',
            padding: '6px',
            borderRadius: '14px',
            gap: '8px',
            marginTop: '24px',
            border: '2px solid var(--border-color)',
            boxShadow: '3px 3px 0px #111827',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {(Object.keys(BATCH_DETAILS) as BatchKey[]).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`class-tab-btn ${selectedClass === cls ? 'active' : ''}`}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'var(--heading-font)',
                  transition: 'var(--transition-smooth)',
                  background: selectedClass === cls ? 'var(--accent-color)' : 'transparent',
                  color: selectedClass === cls ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                {BATCH_LABELS[cls]}
              </button>
            ))}
          </div>
        </div>

        <div className="pricing-comparison-grid">
          
          {/* Competitor Card */}
          <div className="comparison-card competitor-card">
            <h3 className="comp-title">Standard Competitors</h3>
            <div className="comp-price">
              <span className="price-num">₹1,200+</span>
              <span className="price-period">/ 6 months</span>
            </div>
            
            <ul className="comp-features-list">
              <li><X size={16} className="text-red" /> <span>Rigid English-only interaction</span></li>
              <li><X size={16} className="text-red" /> <span>No direct WhatsApp access</span></li>
              <li><X size={16} className="text-red" /> <span>Slow query response times (24-48h)</span></li>
              <li><X size={16} className="text-red" /> <span>Complicated web dashboard setups</span></li>
              <li><X size={16} className="text-red" /> <span>Highly expensive for middle class</span></li>
            </ul>
          </div>

          {/* RestartClub Premium Card */}
          <div className="comparison-card premium-card glass-card relative-glow" style={{
            borderLeft: '4px solid var(--accent-color)'
          }}>
            <div className="popular-badge">Best Choice</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BookOpen size={18} style={{ color: 'var(--accent-color)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '700', textTransform: 'uppercase' }}>
                Batch Active
              </span>
            </div>
            
            <h3 className="comp-title gradient-text-indigo" style={{ marginBottom: '4px' }}>
              {currentBatch.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {currentBatch.tagline}
            </p>

            {/* Visual Seat Filled Progress Tracker (Neubrutalist styling) */}
            <div className="seat-filled-tracker" style={{
              background: '#faf6ee',
              border: '2px solid var(--border-color)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '24px',
              boxShadow: '3px 3px 0px #111827'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700' }}>
                  <Users size={14} style={{ color: 'var(--accent-color)' }} />
                  Seats Filled: {currentBatch.filled}/500
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ef4444' }}>
                  {seatsLeft} Slots Left!
                </span>
              </div>
              <div className="progress-bar-track" style={{ height: '10px', background: '#e5e7eb', border: '1.5px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <div className="progress-bar-fill" style={{ 
                  height: '100%', 
                  width: `${percentFilled}%`, 
                  background: seatsLeft <= 15 ? '#ef4444' : 'var(--accent-color)',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>
            </div>

            <div className="comp-price">
              <span className="price-num">₹500</span>
              <span className="price-period">/ 6 months</span>
            </div>
            
            <ul className="comp-features-list" style={{ minHeight: '260px' }}>
              {currentBatch.features.map((feature, idx) => (
                <li key={idx}>
                  <Check size={16} className="text-emerald" /> 
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={onJoinClick} 
              className="btn btn-accent w-full pricing-btn"
              style={{ cursor: 'pointer' }}
            >
              Join the Family
            </button>
            
            <div className="pricing-guarantee">
              <ShieldCheck size={14} className="text-emerald" />
              <span>Cancel subscription anytime. 100% transparent.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
