import { Target, BookOpen, Bot, Calendar, GraduationCap, ArrowRight, Eye, ShieldCheck, Zap } from 'lucide-react';

interface BentoGridProps {
  activeTrack: 'neet' | 'jee';
  onOpenSampleModal: (track?: 'neet' | 'jee') => void;
  onOpenLeadModal: () => void;
  onTrySimulator: () => void;
}

export default function BentoGrid({
  activeTrack,
  onOpenSampleModal,
  onOpenLeadModal,
  onTrySimulator
}: BentoGridProps) {
  return (
    <section id="features" className="bento-section">
      <div className="container">
        <div className="section-header text-center">
          <div className="badge-pill">
            <Zap size={14} className="text-emerald" /> The Complete Academic Arsenal
          </div>
          <h2 className="section-title">
            Engineered for <span className="gradient-text-emerald">Peak Ranks</span>
          </h2>
          <p className="section-description max-w-2xl mx-auto">
            Everything an aspirant needs to eliminate confusion, crush backlogs, and convert raw effort into top percentiles in {activeTrack === 'neet' ? 'NEET UG' : 'JEE Main & Advanced'}.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="bento-grid">
          
          {/* Card 1: 1-on-1 Dedicated AIR Topper Mentorship (Large Span) */}
          <div className="bento-card bento-card-large glass-card">
            <div className="bento-card-bg-glow"></div>
            <div className="bento-card-content">
              <div className="bento-icon-wrapper">
                <Target size={22} className="text-emerald" />
              </div>
              <span className="bento-tag">CORE PILLAR</span>
              <h3 className="bento-title">1-on-1 Dedicated AIR Topper Mentorship</h3>
              <p className="bento-text">
                Never feel lost or isolated again. Get paired with an AIR Topper from {activeTrack === 'neet' ? 'AIIMS New Delhi & Top GMCs' : 'IIT Bombay & Top IITs'} who personally reviews your daily study hours, clears backlogs, and optimizes your timetable.
              </p>

              <div className="bento-feature-pills">
                <div className="bento-pill">
                  <ShieldCheck size={14} className="text-emerald" /> Weekly 1-on-1 Audio/Video Calls
                </div>
                <div className="bento-pill">
                  <ShieldCheck size={14} className="text-emerald" /> Custom Backlog Clearing Roadmaps
                </div>
                <div className="bento-pill">
                  <ShieldCheck size={14} className="text-emerald" /> Daily WhatsApp Progress Check-ins
                </div>
              </div>

              <div className="bento-action-row">
                <button onClick={onOpenLeadModal} className="bento-cta-btn">
                  <span>Match With A Mentor</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: High-Yield Resource Vault (Interactive Dynamic Track) */}
          <div className="bento-card bento-card-vault glass-card">
            <div className="bento-card-content">
              <div className="bento-icon-wrapper">
                <BookOpen size={22} className="text-indigo" />
              </div>
              <span className="bento-tag">HIGH-YIELD VAULT</span>
              <h3 className="bento-title">
                {activeTrack === 'neet' ? 'NEET NCERT Line-by-Line Vault' : 'JEE Formula & Advanced Problem Maps'}
              </h3>
              <p className="bento-text">
                {activeTrack === 'neet'
                  ? 'Handcrafted short notes condensing 1,500+ NCERT Biology pages into 42 revision-friendly sheets, along with Organic Chemistry reaction roadmaps.'
                  : 'Core Physics derivation logs, Organic multi-step flowcharts, and JEE Advanced trap analysis sheets built by top IITians.'}
              </p>

              <div className="vault-preview-card">
                <div className="vault-file-meta">
                  <div className="file-icon-box">📄</div>
                  <div>
                    <strong>{activeTrack === 'neet' ? 'Biology NCERT Master Sheet' : 'Physics Mechanics & Electro Sheet'}</strong>
                    <span>500+ High-Yield Pages • Watermark-Free PDF</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenSampleModal(activeTrack)}
                  className="vault-preview-btn"
                >
                  <Eye size={14} /> Preview Sample Free
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: 24/7 Hinglish AI WhatsApp Doubt Solver & SOS Handoff */}
          <div className="bento-card bento-card-ai glass-card">
            <div className="bento-card-content">
              <div className="bento-icon-wrapper">
                <Bot size={22} className="text-emerald" />
              </div>
              <span className="bento-tag">WHATSAPP AI + HUMAN SOS</span>
              <h3 className="bento-title">24/7 Hinglish AI Doubt Solver</h3>
              <p className="bento-text">
                Stuck on a tricky question at 1:30 AM? Send a photo or text on WhatsApp. Get instant, step-by-step solutions with concept breakdowns in conversational Hinglish.
              </p>

              <div className="ai-highlight-box">
                <div className="ai-badge-row">
                  <span className="pulse-dot"></span>
                  <strong>Seamless Human Mentor Handoff:</strong>
                </div>
                <p>If a doubt requires deep conceptual debugging, 1-tap SOS alerts your dedicated mentor directly on WhatsApp.</p>
              </div>

              <button onClick={onTrySimulator} className="bento-link-btn">
                <span>Test Live Interactive Simulator</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 4: Weekly Mock Paper Post-Mortem Sessions */}
          <div className="bento-card glass-card">
            <div className="bento-card-content">
              <div className="bento-icon-wrapper">
                <Calendar size={22} className="text-amber" />
              </div>
              <span className="bento-tag">ANALYTICS & STRATEGY</span>
              <h3 className="bento-title">Mock Test Post-Mortem</h3>
              <p className="bento-text">
                Marks don't improve by taking more tests; they improve by analyzing mistakes. Our mentors dissect your silly errors, time wastage, and negative marking patterns every Sunday.
              </p>
              <div className="stat-highlight">
                <span className="stat-number">+85 to +140 Marks</span>
                <span className="stat-label">Average jump within 60 days of error-tracking</span>
              </div>
            </div>
          </div>

          {/* Card 5: Full Counselling Guidance (Home to College) */}
          <div className="bento-card glass-card">
            <div className="bento-card-content">
              <div className="bento-icon-wrapper">
                <GraduationCap size={22} className="text-purple" />
              </div>
              <span className="bento-tag">END-TO-END SUPPORT</span>
              <h3 className="bento-title">Full Counselling Guidance (Home to College)</h3>
              <p className="bento-text">
                From your study desk to college admissions. Get 1-on-1 personalized preference lists for {activeTrack === 'neet' ? 'MCC & State Quota MBBS/BDS' : 'JoSAA, CSAB & State Engineering'} rounds.
              </p>
              <div className="counselling-badges">
                <span className="c-badge">{activeTrack === 'neet' ? 'AIQ & State Cutoff Matrix' : 'Branch vs College Predictor'}</span>
                <span className="c-badge">Document Verification Checklist</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
