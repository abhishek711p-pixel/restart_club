import { Trophy, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface CaseStudiesSEOProps {
  onBookCall: () => void;
}

interface CaseStudy {
  name: string;
  category: 'NEET' | 'JEE';
  startingScore: string;
  finalScore: string;
  scoreJump: string;
  airRank: string;
  targetCollege: string;
  methodology: string;
  keyMilestones: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    name: 'Aryan Sharma',
    category: 'NEET',
    startingScore: '420 / 720',
    finalScore: '665 / 720',
    scoreJump: '+245 Marks',
    airRank: 'AIR 2,184',
    targetCollege: 'MAMC New Delhi (MBBS)',
    methodology: 'Cleared 4-month Class 11 Physics and Genetics backlog in 60 days using personalized daily micro-targets + instant WhatsApp AI doubt clearance and weekly mock error-analysis sessions with an AIIMS Delhi mentor.',
    keyMilestones: [
      'Eliminated 35 negative marks in Biology with line-by-line NCERT short notes.',
      'Completed 15-year Physics PYQ drills with step-by-step formula derivations.',
      'Achieved 99.2 percentile in final 5 full-syllabus grand tests.'
    ]
  },
  {
    name: 'Sneha Patel',
    category: 'JEE',
    startingScore: '78.4 %ile',
    finalScore: '99.28 %ile',
    scoreJump: '+20.88 Percentile',
    airRank: 'AIR 1,412',
    targetCollege: 'IIT Bombay (Mechanical)',
    methodology: 'Replaced passive video lectures with targeted high-yield question sets, speed-accuracy calibration, and 1-on-1 calculus mastery under an IIT Delhi AIR 41 mentor.',
    keyMilestones: [
      'Mastered coordinate geometry and rotational dynamics through structured problem-solving.',
      'Maintained 100% doubt clearance rate with 24/7 AI WhatsApp solver.',
      'Improved exam question selection efficiency by 40% using the Two-Pass strategy.'
    ]
  },
  {
    name: 'Rohan Verma',
    category: 'NEET',
    startingScore: '510 / 720',
    finalScore: '678 / 720',
    scoreJump: '+168 Marks',
    airRank: 'AIR 945',
    targetCollege: 'AIIMS Rishikesh (MBBS)',
    methodology: 'Balanced Class 12 CBSE board exams alongside intense NEET mock testing through personalized weekly timetables and active recall organic reaction roadmaps.',
    keyMilestones: [
      'Scored 355/360 in NEET Biology using active recall revision flashcards.',
      'Systematically logged 120+ mistakes into a dedicated digital Error Notebook.',
      'Built unshakeable exam temperament with bi-weekly mentor strategy syncs.'
    ]
  },
  {
    name: 'Ananya Sen',
    category: 'JEE',
    startingScore: '85 / 300 Mock',
    finalScore: '245 / 300 Final',
    scoreJump: '+160 Marks',
    airRank: 'AIR 1,850',
    targetCollege: 'IIT Kharagpur (CSE)',
    methodology: 'Class 11 foundation student who overcame mechanics anxiety by converting theoretical doubts into conceptual clarity with late-night AI assistance and mentor guidance.',
    keyMilestones: [
      'Built foundational mastery in organic reaction mechanisms and chemical bonding.',
      'Eliminated school-coaching scheduling clashes with a customized study timetable.',
      'Maintained a consistent 7-hour productive self-study routine.'
    ]
  }
];

export default function CaseStudiesSEO({ onBookCall }: CaseStudiesSEOProps) {
  return (
    <section id="results" className="case-studies-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="badge-pill">
            <Trophy size={14} className="text-emerald" /> Verifiable Track Record
          </div>
          <h2 className="section-title">
            Result-Oriented Mentorship: <span className="gradient-text-emerald">Real Student Transformations</span>
          </h2>
          <h3 className="section-subtitle-seo max-w-2xl mx-auto">
            1-on-1 Strategy from AIIMS & IIT Rankers with Verifiable Score Jumps
          </h3>
          <p className="section-description max-w-2xl mx-auto">
            Discover how real JEE and NEET aspirants eliminated backlogs, mastered mock tests, and secured top ranks in prestigious government colleges.
          </p>
        </div>

        {/* Crawlable Case Studies Grid */}
        <div className="case-studies-grid">
          {CASE_STUDIES.map((study, idx) => (
            <article key={idx} className="case-study-card glass-card">
              
              {/* Header with Name, Exam & Target College */}
              <div className="case-study-header">
                <div className="student-profile-row">
                  <div className="student-avatar-box">
                    <span>{study.name.charAt(0)}</span>
                  </div>
                  <div className="student-name-block">
                    <h4 className="student-name">{study.name}</h4>
                    <span className="student-exam-tag">{study.category} Aspirant • {study.airRank}</span>
                  </div>
                </div>
                <div className="target-college-badge">
                  <span>🏛️ {study.targetCollege}</span>
                </div>
              </div>

              {/* Tangible Score Jump Metrics */}
              <div className="score-jump-container">
                <div className="score-box score-start">
                  <span className="score-label">Starting Baseline</span>
                  <strong className="score-value">{study.startingScore}</strong>
                </div>
                <div className="score-arrow-box">
                  <TrendingUp size={20} className="text-emerald" />
                  <span className="score-jump-pill">{study.scoreJump}</span>
                </div>
                <div className="score-box score-final">
                  <span className="score-label">Final Achieved</span>
                  <strong className="score-value text-emerald">{study.finalScore}</strong>
                </div>
              </div>

              {/* Methodology Paragraph (High-Density Crawlable Text) */}
              <div className="case-methodology">
                <h5 className="methodology-title">
                  <Sparkles size={14} className="text-emerald inline-block mr-1" />
                  Methodology & Strategy:
                </h5>
                <p className="methodology-text">{study.methodology}</p>
              </div>

              {/* Key Milestones */}
              <div className="case-milestones">
                <ul className="milestone-list">
                  {study.keyMilestones.map((item, mIdx) => (
                    <li key={mIdx} className="milestone-item">
                      <CheckCircle2 size={15} className="text-emerald shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action */}
              <div className="case-card-footer">
                <button 
                  type="button" 
                  onClick={onBookCall}
                  className="case-cta-btn"
                >
                  <span>Build My Result Roadmap</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
