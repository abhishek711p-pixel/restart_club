import React, { useState } from 'react';
import { Award, Star, Quote, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface MentorTrustProps {
  activeTrack: 'neet' | 'jee';
  onBookCall: () => void;
}

interface Mentor {
  id: string;
  name: string;
  exam: 'NEET' | 'JEE';
  rank: string;
  college: string;
  city: string;
  experience: string;
  avatarColor: string;
  avatarInitials: string;
  quote: string;
  specialty: string;
}

const MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Aryan Sharma',
    exam: 'NEET',
    rank: 'AIR 89',
    college: 'AIIMS New Delhi',
    city: 'Delhi',
    experience: '3+ Yrs Mentoring',
    avatarColor: 'linear-gradient(135deg, #10b981, #047857)',
    avatarInitials: 'AS',
    quote: 'NEET is 90% NCERT mastery and 10% calm nerves. I help students stop overthinking and build robotic accuracy in Biology & Chemistry.',
    specialty: 'NCERT Line-by-Line & Biology Speed Drills'
  },
  {
    id: '2',
    name: 'Rohan Verma',
    exam: 'JEE',
    rank: 'AIR 247',
    college: 'IIT Bombay (CSE)',
    city: 'Mumbai',
    experience: '3+ Yrs Mentoring',
    avatarColor: 'linear-gradient(135deg, #6366f1, #4338ca)',
    avatarInitials: 'RV',
    quote: 'Stop solving 10 books randomly. Master 1 standard resource and 15 years of PYQs. That is how I cracked JEE Adv without coaching burnouts.',
    specialty: 'Advanced Mechanics & Calculus Traps'
  },
  {
    id: '3',
    name: 'Dr. Ananya Patel',
    exam: 'NEET',
    rank: 'AIR 412',
    college: 'Maulana Azad Medical College (MAMC)',
    city: 'Delhi',
    experience: '2+ Yrs Mentoring',
    avatarColor: 'linear-gradient(135deg, #059669, #065f46)',
    avatarInitials: 'AP',
    quote: 'My weekly 1-on-1 calls helped 50+ students jump from 480 to 650+. The secret is strict mistake post-mortems and scheduled active recall.',
    specialty: 'Organic Chemistry Reactions & Mock Analysis'
  },
  {
    id: '4',
    name: 'Kartik Iyer',
    exam: 'JEE',
    rank: 'AIR 165',
    college: 'IIT Delhi (Electrical)',
    city: 'Delhi',
    experience: '2+ Yrs Mentoring',
    avatarColor: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    avatarInitials: 'KI',
    quote: 'Physics becomes your highest-scoring subject once derivation pathways and boundary conditions are crystal clear in your head.',
    specialty: 'Electrodynamics & Multi-Concept Problems'
  }
];

export default function MentorTrust({ activeTrack, onBookCall }: MentorTrustProps) {
  const [filter, setFilter] = useState<'all' | 'neet' | 'jee'>(activeTrack);

  // Sync filter when activeTrack changes from parent hero
  React.useEffect(() => {
    setFilter(activeTrack);
  }, [activeTrack]);

  const displayedMentors = MENTORS.filter(m => {
    if (filter === 'all') return true;
    return m.exam.toLowerCase() === filter;
  });

  return (
    <section id="mentors" className="mentors-section">
      <div className="container">
        <div className="section-header text-center">
          <div className="badge-pill">
            <Award size={14} className="text-emerald" /> Elite Pedigree Mentors
          </div>
          <h2 className="section-title">
            Learn From Those Who <span className="gradient-text-emerald">Already Conquered</span>
          </h2>
          <p className="section-description max-w-2xl mx-auto">
            Our mentors are not generic academic counselors. They are recent top rankers who solved the exact same exams, handled the exact same pressure, and know the modern exam pattern inside out.
          </p>

          {/* Filter Pills */}
          <div className="mentor-filter-bar">
            <button
              className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Mentors
            </button>
            <button
              className={`filter-pill ${filter === 'neet' ? 'active' : ''}`}
              onClick={() => setFilter('neet')}
            >
              🩺 NEET Mentors (AIIMS & MAMC)
            </button>
            <button
              className={`filter-pill ${filter === 'jee' ? 'active' : ''}`}
              onClick={() => setFilter('jee')}
            >
              ⚡ JEE Mentors (IIT Bombay & Delhi)
            </button>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="mentors-grid">
          {displayedMentors.map((mentor) => (
            <div key={mentor.id} className="mentor-card glass-card">
              <div className="mentor-card-header">
                <div className="mentor-avatar" style={{ background: mentor.avatarColor }}>
                  <span>{mentor.avatarInitials}</span>
                </div>
                <div className="mentor-details">
                  <div className="mentor-name-row">
                    <h4 className="mentor-name">{mentor.name}</h4>
                    <span className="verified-badge" title="Verified AIR Topper">
                      <ShieldCheck size={14} className="text-emerald" />
                    </span>
                  </div>
                  <div className="mentor-rank-badge">
                    <Award size={13} /> {mentor.rank} • {mentor.exam}
                  </div>
                  <span className="mentor-college">{mentor.college}</span>
                </div>
              </div>

              <div className="mentor-quote-box">
                <Quote size={16} className="quote-icon" />
                <p className="mentor-quote-text">"{mentor.quote}"</p>
              </div>

              <div className="mentor-specialty-tag">
                <Sparkles size={12} className="text-amber" />
                <span>Specialty: {mentor.specialty}</span>
              </div>

              <button
                type="button"
                onClick={onBookCall}
                className="mentor-book-btn"
              >
                <span>Request Call With {mentor.name.split(' ')[0]}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Social Proof & Numbers Banner */}
        <div className="proof-banner glass-card">
          <div className="proof-stat-item">
            <span className="proof-big-num">1,000+</span>
            <span className="proof-sub">Aspirants Mentored Across India</span>
          </div>
          <div className="proof-divider"></div>
          <div className="proof-stat-item">
            <span className="proof-big-num">98.4%</span>
            <span className="proof-sub">Student Confidence & Satisfaction Score</span>
          </div>
          <div className="proof-divider"></div>
          <div className="proof-stat-item">
            <span className="proof-big-num">24/7</span>
            <span className="proof-sub">Hinglish WhatsApp Support Availability</span>
          </div>
          <div className="proof-divider"></div>
          <div className="proof-stat-item">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span className="proof-sub">Rated 4.9/5 by Class 10-12 & Droppers</span>
          </div>
        </div>

      </div>
    </section>
  );
}
