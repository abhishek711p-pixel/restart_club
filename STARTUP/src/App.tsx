import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatSimulator from './components/ChatSimulator';
import Pricing from './components/Pricing';
import type { BatchKey } from './components/Pricing';
import AuthScreen from './components/AuthScreen';
import StudentDashboard from './components/StudentDashboard';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Compass, 
  Play, 
  Users, 
  Smartphone,
  Check,
  X
} from 'lucide-react';

export default function App() {
  const [selectedClass, setSelectedClass] = useState<BatchKey>('12');
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; batch: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('studentSession');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleSelectBatch = (batchKey: BatchKey) => {
    setSelectedClass(batchKey);
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (view === 'auth') {
    return (
      <AuthScreen 
        onSuccess={(user) => {
          localStorage.setItem('studentSession', JSON.stringify(user));
          setCurrentUser(user);
          setView('dashboard');
        }}
        onBack={() => setView('landing')}
        defaultBatch={selectedClass}
      />
    );
  }

  if (view === 'dashboard' && currentUser) {
    return (
      <StudentDashboard 
        user={currentUser}
        onLogout={() => {
          localStorage.removeItem('studentSession');
          setCurrentUser(null);
          setView('landing');
        }}
      />
    );
  }



  return (
    <div className="app-wrapper">
      <Navbar onSelectBatch={handleSelectBatch} onJoinClick={() => setView('auth')} />
      
      {/* Decorative Glow Elements */}
      <div className="glow-glow glow-indigo"></div>
      <div className="glow-glow glow-emerald"></div>

      {/* Hero Section (Competitor Layout Style) */}
      <section className="hero-section">
        <div className="container hero-container">
          
          <div className="hero-content">
            <div className="hero-badge float-animation">
              <Sparkles size={14} className="text-emerald" />
              <span>Personal Topper Mentors + AI Assistant Feature</span>
            </div>
            
            <h1 className="hero-title">
              Restart <span className="gradient-text-indigo">Club</span>
            </h1>
            
            <h2 className="hero-subtitle-primary">
              Personal Topper Mentorship + 24/7 AI WhatsApp Planner
            </h2>
            
            <p className="hero-subtitle">
              Study under real IITian & NEET topper mentors who track your progress, with our 24/7 custom Hinglish AI assistant feature on WhatsApp for daily doubts & study planners. Tailored for Classes 10–12 and JEE/NEET.
            </p>
            
            <div className="hero-actions">
              <a href="#simulator" className="btn btn-primary">
                Try WhatsApp Demo <MessageSquare size={16} />
              </a>
              <button onClick={() => setView('auth')} className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                Join the Family <ArrowRight size={16} />
              </button>
            </div>

            <div className="hero-social-proof">
              <div className="proof-item">
                <span className="proof-number">Class 10-12</span>
                <span className="proof-label">Boards, JEE & NEET</span>
              </div>
              <div className="proof-item">
                <span className="proof-number">Starts at ₹499/mo</span>
                <span className="proof-label">Hybrid Mentorship</span>
              </div>
              <div className="proof-item">
                <span className="proof-number">WhatsApp</span>
                <span className="proof-label">Daily Interaction</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card - Chat Simulator acts as the main hero interactive element */}
          <div className="hero-visual">
            <div className="visual-card-glow"></div>
            <div className="glass-card visual-card float-animation">
              <div className="card-header">
                <div className="card-dot red"></div>
                <div className="card-dot yellow"></div>
                <div className="card-dot green"></div>
                <span className="card-title-text">RestartClub Student Dashboard</span>
              </div>
              <div className="card-body text-left">
                <div className="visual-status-row">
                  <div className="visual-status-pill green">Topper Mentor Assigned</div>
                  <div className="visual-status-pill purple">AI Feature Active</div>
                </div>
                <h4 className="visual-chat-header">WhatsApp Study Companion:</h4>
                <div className="visual-chat-box">
                  <div className="v-msg student">Bhai, Chemistry inorganic reaction kaise rattein?</div>
                  <div className="v-msg bot">
                    Inorganic ko ratna nahi hai! 1. Daily 15 mins block banao key trends (atomic size, ionization energy) likh ke padhne ke liye. 2. Exceptions ki separate cheat sheet banao. Main aapko daily reminders aur quizzes bhejta rahunga!
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Our Services - Alternating Service Grid (JeeSankalp Layout) */}
      <section id="services" className="services-section">
        <div className="container">
          
          <div className="services-header text-center">
            <div className="badge-pill">Our Program Features</div>
            <h2 className="section-title">Hinglish Mentors & AI tools to guide your preparation</h2>
            <p className="section-description max-w-2xl mx-auto">
              Get personalized toppers' advice and AI-driven study organizers designed specifically to help you score high.
            </p>
          </div>

          <div className="services-alternating-list">
            
            {/* Row 1: Left Visual (Timetable), Right Content */}
            <div className="service-row">
              <div className="service-visual">
                <div className="glass-card schedule-visual-card">
                  <div className="visual-card-header">
                    <span className="visual-card-title">Daily Study Planner</span>
                    <span className="day-badge">Today</span>
                  </div>
                  <div className="schedule-list">
                    <div className="schedule-item checked">
                      <input type="checkbox" checked readOnly />
                      <span>Maths Integration Formulas (Boards Revision)</span>
                    </div>
                    <div className="schedule-item checked">
                      <input type="checkbox" checked readOnly />
                      <span>Solve 15 Physics HC Verma problems (JEE prep)</span>
                    </div>
                    <div className="schedule-item current">
                      <div className="pulse-indicator"></div>
                      <span>Chemistry Inorganic trends quiz (10 mins)</span>
                    </div>
                    <div className="schedule-item">
                      <input type="checkbox" disabled />
                      <span>Analyze Mock Test Mistakes</span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-text">Daily Target Completed: 75%</div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="service-content">
                <div className="feat-icon-wrapper text-indigo">
                  <Compass className="feat-icon" />
                </div>
                <h3 className="service-title">Topper Guidance Program</h3>
                <p className="service-desc">
                  Get matched with a dedicated personal mentor from top IITs, NITs, or medical colleges. They build customized boards & exam study schedules based on your target syllabus, review your backlog weekly, and provide real human guidance.
                </p>
              </div>
            </div>

            {/* Row 2: Left Content, Right Visual (Doubt Chat) */}
            <div className="service-row reverse">
              <div className="service-content">
                <div className="feat-icon-wrapper text-emerald">
                  <MessageSquare className="feat-icon" />
                </div>
                <h3 className="service-title">24/7 AI Doubt Solver (WhatsApp Feature)</h3>
                <p className="service-desc">
                  Stuck on a homework problem or formula late at night? Snap a photo or type your query to get instant conceptual explanations in easy-to-understand Hinglish from our custom AI WhatsApp helper. If you need more help, tap the handoff button to message your personal human mentor.
                </p>
              </div>
              <div className="service-visual">
                <div className="glass-card doubt-visual-card">
                  <div className="chat-bubble received">
                    <span className="sender-tag">Student</span>
                    <p>Bhai HC Verma Chapter 3 question 14 check kar do, acceleration negative kyu aa raha hai?</p>
                  </div>
                  <div className="chat-bubble sent">
                    <span className="sender-tag">RestartClub Feature</span>
                    <p>Bilkul! Dekho, car de-accelerate ho rahi hai (brake apply kiya hai). Isliye final velocity initial se kam hai. Formulate a = (v - u)/t me v &lt; u hai, to numerator negative aayega! Equation me direction reverse check karo.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Left Visual (Audio Lounge Speakers), Right Content */}
            <div className="service-row">
              <div className="service-visual">
                <div className="glass-card audio-visual-card">
                  <div className="audio-card-header">
                    <div className="pulse-indicator red"></div>
                    <span className="audio-live-text">Weekly Live Mentor Session</span>
                  </div>
                  <div className="speaker-grid">
                    <div className="speaker active">
                      <div className="speaker-avatar iit">SB</div>
                      <span className="speaker-name">Sankalp Bhaiya (IIT-D)</span>
                      <span className="speaker-label">Speaking...</span>
                    </div>
                    <div className="speaker">
                      <div className="speaker-avatar neet">RN</div>
                      <span className="speaker-name">Rohan (NEET AIR 42)</span>
                      <span className="speaker-label">Mentor</span>
                    </div>
                    <div className="speaker">
                      <div className="speaker-avatar normal">AM</div>
                      <span className="speaker-name">Amit (Class 12 CBSE)</span>
                      <span className="speaker-label">Student</span>
                    </div>
                  </div>
                  <div className="audio-equalizer">
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                </div>
              </div>
              <div className="service-content">
                <div className="feat-icon-wrapper text-indigo">
                  <Users className="feat-icon" />
                </div>
                <h3 className="service-title">Live Weekly Strategy Sessions</h3>
                <p className="service-desc">
                  Every week, connect directly in live audio lounges led by topper mentors. Ask strategy questions live, get emotional guidance, learn revision frameworks, and discuss study targets directly with students who have cracked the exams.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Simulator Section */}
      <ChatSimulator />

      {/* Why RestartClub Section (JeeSankalp Layout Style) */}
      <section className="why-section">
        <div className="container">
          <div className="why-header text-center">
            <h2 className="why-title">WHY DRONA MENTORSHIP?</h2>
            <p className="why-subtitle-sub">Take a step to clear your target exams with flying colors today</p>
          </div>

          <div className="why-grid">
            <div className="why-col">
              <h3 className="why-col-title">Topper Mentors + Smart AI Features at a fraction of the cost</h3>
              <p className="why-col-text">
                We understand that students need real human connections, but hiring a personal mentor is highly expensive. By using our AI assistant features to handle daily planners and doubt answering, we reduce human mentor workload by 80%—allowing us to offer premium personal topper mentorship starting at just ₹499/month.
              </p>
            </div>
            
            <div className="why-col">
              <h3 className="why-col-title">Only the best can lead you to be the best in your exam preparation</h3>
              <p className="why-col-text">
                Our custom AI tools are trained on proven study techniques from top-ranking educators, IITians, and board toppers. Plus, our hybrid human-in-the-loop backup ensures that you get real personal support from dedicated human mentors whenever you face hurdles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Math Section (Nova style) */}
      <section className="math-value-section">
        <div className="container">
          <div className="math-value-header text-center">
            <div className="badge-pill">Value Calculation</div>
            <h2 className="section-title">How Small is ₹499/month for Topper Mentorship?</h2>
            <p className="section-description max-w-2xl mx-auto">
              Putting your monthly subscription cost into perspective:
            </p>
          </div>

          <div className="math-grid">
            <div className="math-card glass-card">
              <span className="math-metric-highlight">Less Than 1 Pizza</span>
              <p className="math-card-desc">₹499/month is less than the cost of ordering a single medium pizza. Invest it in securing your topper mentorship and AI guides instead.</p>
            </div>
            
            <div className="math-card glass-card">
              <span className="math-metric-highlight">5% of Coaching Cost</span>
              <p className="math-card-desc">Traditional coaching institutes charge ₹10,000+ per month. RestartClub gives personal topper attention + 24/7 AI features at 5% of that cost.</p>
            </div>
            
            <div className="math-card glass-card">
              <span className="math-metric-highlight">Save Commute Travel</span>
              <p className="math-card-desc">A single daily travel auto/bus trip to coaching centers costs more than ₹499/month. Save travel time and resolve doubts comfortably from home.</p>
            </div>
            
            <div className="math-card glass-card">
              <span className="math-metric-highlight">0.05% of First Salary</span>
              <p className="math-card-desc">₹499 is a tiny fraction of your monthly salary after graduating from top IITs/NITs or government medical colleges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section (Nova Matrix style) */}
      <section id="about" className="comparison-table-section">
        <div className="container">
          <div className="table-header text-center">
            <div className="badge-pill">Compare & Choose</div>
            <h2 className="section-title">Why RestartClub Hybrid Mentorship is Unbeatable</h2>
            <p className="section-description max-w-2xl mx-auto">
              See how we stack up against traditional learning methods:
            </p>
          </div>

          <div className="table-wrapper glass-card">
            <table className="comparison-matrix">
              <thead>
                <tr>
                  <th>Features</th>
                  <th>YouTube Channels</th>
                  <th>Offline Coaching</th>
                  <th className="highlight-col">RestartClub (AI + Mentor) (Starts at ₹499)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="feature-name">24/7 AI WhatsApp Doubt Solver</td>
                  <td><X className="table-icon red" size={20} /></td>
                  <td><X className="table-icon red" size={20} /></td>
                  <td className="highlight-col"><Check className="table-icon green" size={20} /> <span className="highlight-text">Instant</span></td>
                </tr>
                <tr>
                  <td className="feature-name">Dedicated Topper Mentor Assigned</td>
                  <td><X className="table-icon red" size={20} /> <span className="cell-sub text-muted">One-way</span></td>
                  <td><X className="table-icon red" size={20} /> <span className="cell-sub text-muted">Rarely</span></td>
                  <td className="highlight-col"><Check className="table-icon green" size={20} /> <span className="highlight-text">Direct access</span></td>
                </tr>
                <tr>
                  <td className="feature-name">Customized Study Calendars</td>
                  <td><X className="table-icon red" size={20} /> <span className="cell-sub text-muted">Generic</span></td>
                  <td><X className="table-icon red" size={20} /></td>
                  <td className="highlight-col"><Check className="table-icon green" size={20} /> <span className="highlight-text">Tailored</span></td>
                </tr>
                <tr>
                  <td className="feature-name">Weekly Live Voice Sessions</td>
                  <td><X className="table-icon red" size={20} /></td>
                  <td><X className="table-icon red" size={20} /></td>
                  <td className="highlight-col"><Check className="table-icon green" size={20} /> <span className="highlight-text">Weekly</span></td>
                </tr>
                <tr>
                  <td className="feature-name">Affordable Pricing</td>
                  <td><Check className="table-icon green" size={20} /> <span className="cell-sub green-text">Free</span></td>
                  <td><X className="table-icon red" size={20} /> <span className="cell-sub text-muted">₹1.2L+/yr</span></td>
                  <td className="highlight-col"><Check className="table-icon green" size={20} /> <span className="highlight-text">Starts at ₹499/mo</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing selectedClass={selectedClass} setSelectedClass={setSelectedClass} onJoinClick={() => setView('auth')} />

      {/* Join The Family Section (JeeSankalp style) */}
      <section className="join-family-section">
        <div className="container text-center">
          <h2 className="section-title">Join the Family</h2>
          <p className="section-description max-w-md mx-auto">
            Stay updated with free study notes, formula cheatsheets, and live board strategy announcements.
          </p>

          <button 
            onClick={() => setView('auth')} 
            className="btn btn-accent"
            style={{ marginTop: '24px', marginBottom: '32px', padding: '14px 32px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer' }}
          >
            Register / Login to Your Account <ArrowRight size={16} />
          </button>
          
          <div className="social-links-grid">
            <a href="https://t.me/mocklink" target="_blank" rel="noopener noreferrer" className="social-btn telegram">
              <Compass size={20} />
              <span>Join Telegram Group</span>
            </a>
            <a href="https://youtube.com/mocklink" target="_blank" rel="noopener noreferrer" className="social-btn youtube">
              <Play size={20} />
              <span>Subscribe YouTube Channel</span>
            </a>
            <a href="https://wa.me/919999999999?text=Hi" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp-social">
              <Smartphone size={20} />
              <span>Join WhatsApp Updates</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-container">
          <div className="footer-left">
            <div className="logo-section">
              <Compass className="logo-icon text-indigo" />
              <span className="logo-text">Restart <span className="logo-highlight">Club</span></span>
            </div>
            <p className="footer-desc">Empowering Tier 2 & Tier 3 students to ace their Class 10-12 boards and JEE/NEET exams with personalized Hinglish AI guides.</p>
          </div>
          <div className="footer-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span className="copyright">© 2026 RestartClub Mentorship. All rights reserved.</span>
            <a 
              href="/admin.html"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                textDecoration: 'underline',
                padding: '4px 0'
              }}
            >
              🔒 Admin Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
