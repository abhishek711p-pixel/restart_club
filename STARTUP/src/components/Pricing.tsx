import { Check, BookOpen, Sparkles } from 'lucide-react';

const BATCH_DETAILS = {
  '10': {
    name: "Class 10 (Foundation)",
    tagline: "Board Booster + JEE/NEET Foundation Prep",
    features: [
      "1-on-1 Dedicated IIT/NEET Topper Mentor",
      "Handwritten Science & Math Board notes",
      "Class 10 NCERT Solutions & PYQs",
      "Weekly Board Strategy Live Sessions"
    ]
  },
  '11': {
    name: "Class 11 (Aarambh)",
    tagline: "Class 11 Syllabus + JEE/NEET Concepts",
    features: [
      "1-on-1 Dedicated IIT/NEET Topper Mentor",
      "Physics & Chem Formula Sheets + Cheat Sheets",
      "Class 11 Backlog Clearing Tracker",
      "Weekly Live Audio Strategy Lounges"
    ]
  },
  '12': {
    name: "Class 12 (Sankalp)",
    tagline: "Class 12 Boards + JEE/NEET Cracker",
    features: [
      "Full Counselling Help and Guidance (Home to College)",
      "1-on-1 Dedicated IIT/NEET Topper Mentor",
      "Class 12 Board & Entrance Handwritten Notes",
      "Pre-Board & Revision Checklists",
      "Mock Test Mistake-Tracking Spreadsheets"
    ]
  },
  'jee-dropper': {
    name: "JEE Dropper",
    tagline: "Full JEE Main & Advanced Coverage",
    features: [
      "Full Counselling Help and Guidance (Home to College)",
      "1-on-1 Dedicated IITian Mentor",
      "JEE Core Formula Cheatsheets & Short Notes",
      "Daily Practice Problem (DPP) Tracker",
      "Weekly Live JEE Problem-Solving Sessions"
    ]
  },
  'neet-dropper': {
    name: "NEET Dropper",
    tagline: "Full NEET-UG Coverage + NCERT Tracker",
    features: [
      "Full Counselling Help and Guidance (Home to College)",
      "1-on-1 Dedicated NEET AIR Topper Mentor",
      "NEET Biology NCERT Line-by-Line Short Notes",
      "Physics Formula Logs & Reaction Maps",
      "Weekly Live NEET Mock Strategy Sessions"
    ]
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

  return (
    <section id="pricing" className="pricing-section" style={{ padding: '60px 0' }}>
      <div className="container">
        
        <div className="pricing-header text-center">
          <div className="badge-pill" style={{ background: '#18181b', color: '#22c55e', borderColor: '#27272a' }}>
            ⚡ Select Your Batch & Plan
          </div>
          <h2 className="section-title">Transparent & Affordable Plans</h2>

          {/* High Contrast Class Selector Tabs */}
          <div className="class-selector-tabs" style={{
            display: 'inline-flex',
            background: '#18181b',
            padding: '6px',
            borderRadius: '12px',
            gap: '6px',
            marginTop: '16px',
            border: '1px solid #27272a',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '100%'
          }}>
            {(Object.keys(BATCH_DETAILS) as BatchKey[]).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`class-tab-btn ${selectedClass === cls ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedClass === cls ? '#ffffff' : 'transparent',
                  color: selectedClass === cls ? '#000000' : '#a1a1aa'
                }}
              >
                {BATCH_LABELS[cls]}
              </button>
            ))}
          </div>
        </div>

        {/* Clean 2-Card Plan Grid */}
        <div className="pricing-comparison-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '32px' }}>
          
          {/* Standard Plan */}
          <div className="glass-card" style={{
            background: '#0d0d0f',
            border: '1.5px solid #27272a',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'visible',
            marginTop: '10px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BookOpen size={18} style={{ color: '#a1a1aa' }} />
                <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: '800', textTransform: 'uppercase' }}>
                  Mentor Access
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
                {currentBatch.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '20px' }}>
                {currentBatch.tagline}
              </p>

              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', marginBottom: '20px' }}>
                ₹499 <span style={{ fontSize: '0.9rem', color: '#a1a1aa', fontWeight: '600' }}>/ 6 months</span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentBatch.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#ffffff' }}>
                    <Check size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} /> 
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={onJoinClick}
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '12px', cursor: 'pointer', textAlign: 'center' }}
            >
              Enroll Standard Plan (₹499)
            </button>
          </div>

          {/* Premium Plan (AI + Mentor) */}
          <div className="glass-card" style={{
            background: '#121214',
            border: '2px solid #ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '4px 4px 0px #ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'visible',
            marginTop: '10px'
          }}>
            <div style={{
              position: 'absolute',
              top: '-13px',
              right: '20px',
              background: '#22c55e',
              color: '#000000',
              fontSize: '0.74rem',
              fontWeight: '900',
              padding: '4px 12px',
              borderRadius: '100px',
              textTransform: 'uppercase',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
              zIndex: 10
            }}>
              ⭐ Most Popular
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} style={{ color: '#22c55e' }} />
                <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '800', textTransform: 'uppercase' }}>
                  AI + Mentor Access
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
                {currentBatch.name} Premium
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '20px' }}>
                {currentBatch.tagline} + 24/7 AI WhatsApp Doubt Solver
              </p>

              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', marginBottom: '20px' }}>
                ₹999 <span style={{ fontSize: '0.9rem', color: '#a1a1aa', fontWeight: '600' }}>/ 6 months</span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentBatch.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#ffffff' }}>
                    <Check size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} /> 
                    <span>{feature}</span>
                  </li>
                ))}
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#ffffff', fontWeight: '700' }}>
                  <Check size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} /> 
                  <span>⚡ 24/7 Hinglish AI WhatsApp Doubt Solver</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#ffffff', fontWeight: '700' }}>
                  <Check size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} /> 
                  <span>🚨 Priority Human Mentor Alert Handoff</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={onJoinClick}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', cursor: 'pointer', textAlign: 'center' }}
            >
              Enroll Premium Plan (₹999)
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
