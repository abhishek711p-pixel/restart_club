import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Target, 
  BookOpen, 
  Flame, 
  ArrowRight, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ProblemSolutionSEOProps {
  onBookCall: () => void;
}

interface SEOCardData {
  id: string;
  badge: string;
  title: string;
  queryKeyword: string;
  problemSummary: string;
  solutionBreakdown: string[];
  fullExplanation: string;
  actionStep: string;
  icon: typeof AlertTriangle;
  tagColor: string;
}

const SEO_CARDS: SEOCardData[] = [
  {
    id: 'backlog-management',
    badge: 'Class 11 & Droppers Problem',
    title: 'Backlog Management & Time Allocation in Coaching',
    queryKeyword: 'how to clear backlogs in JEE/NEET & manage school',
    problemSummary: 'Falling behind in coaching lectures while new chapters pile up daily, leading to panic and skipped tests.',
    solutionBreakdown: [
      'The 70-30 Rule: 70% study time dedicated to current running topics, 30% to high-yield backlogs.',
      'Priority Weightage Matrix: Target chapters contributing 60%+ marks first (e.g. Mechanics, Thermodynamics, Genetics).',
      'Daily 90-minute dedicated backlog slot with 24/7 AI WhatsApp doubt clearance to prevent getting stuck.'
    ],
    fullExplanation: `If you are searching for **how to clear backlogs in JEE/NEET** while juggling regular school and coaching classes, the biggest trap is pausing current syllabus to finish old chapters. At RestartClub, our AIR topper mentors implement the **70-30 Study Rule**: spend 70% of your daily time mastering running classroom topics to prevent fresh backlogs, while strictly reserving 30% (90 minutes every evening) for prioritized high-yield backlog chapters. Using our customized daily milestone tracker and instant WhatsApp AI doubt solver, you clear difficult conceptual bottlenecks in physics and chemistry without losing momentum in your ongoing syllabus.`,
    actionStep: 'Get a personalized 30-day backlog clearance timetable mapped to your target exam.',
    icon: Clock,
    tagColor: 'var(--text-primary)'
  },
  {
    id: 'mock-score-stagnation',
    badge: 'Score Stagnation & Accuracy',
    title: 'Mock Test Score Stagnation & Negative Marking Trap',
    queryKeyword: 'how to increase marks in NEET mock tests & avoid negative marking',
    problemSummary: 'Stuck at 400–500 in NEET or 80–120 in JEE with 30+ negative marks in every 3-hour paper.',
    solutionBreakdown: [
      '3-Tier Error Post-Mortem: Classify mistakes into Conceptual Gaps, Calculation Slips, and Blind Guesses.',
      'Two-Pass Exam Strategy: Solve 100% confident questions in Round 1, tackle analytical problems in Round 2.',
      'Personal Error Notebook: Mandatory revision of past mock mistakes with AIR mentors before every new test.'
    ],
    fullExplanation: `A frequent query among competitive aspirants is **how to increase marks in NEET mock tests** and systematically **avoid negative marking**. Most students fail to improve because they give tests without a 3-hour forensic error post-mortem. RestartClub mentors train you in the **Two-Pass Test Execution Method**, ensuring you never lose easy marks to time pressure or speculative guessing. Every incorrect attempt is logged in your digital Error Notebook and analyzed during weekly 1-on-1 strategy sessions, directly converting 25 to 40 negative marks into guaranteed positive score jumps within 3 test cycles.`,
    actionStep: 'Submit your recent mock score card for a complimentary AIR topper error diagnostic.',
    icon: Target,
    tagColor: 'var(--text-primary)'
  },
  {
    id: 'ncert-retention',
    badge: 'High-Yield Revision',
    title: 'Line-by-Line NCERT Mastery & Reaction Retention',
    queryKeyword: 'NCERT biology short notes for NEET & organic chemistry mechanism maps',
    problemSummary: 'Forgetting factual NCERT biology lines and mixing up reagents in organic and inorganic chemistry.',
    solutionBreakdown: [
      'Line-by-Line NCERT Short Notes: Every sentence converted into active recall fill-ins and micro-flashcards.',
      'Organic Reaction Roadmaps: Interlinked synthesis charts connecting hydrocarbons to carbonyl compounds.',
      'Spaced Repetition Algorithm: Automated WhatsApp reminders to revise volatile facts at 1, 3, 7, and 21-day intervals.'
    ],
    fullExplanation: `To secure 350+ out of 360 in NEET Biology and 90+ in NEET/JEE Chemistry, reading textbooks passively is never enough. High-ranking students rely on **NCERT biology short notes for NEET** and high-yield **organic chemistry mechanism maps**. RestartClub provides curated chapter-wise NCERT highlight digests where every diagram, scientist footnote, and exemplar trap is mapped directly to past 15-year question trends. Combined with our active recall flashcards on WhatsApp, you cement volatile inorganic trends and reaction conditions permanently into long-term memory.`,
    actionStep: 'Access our high-yield Class 11 & 12 NCERT Biology and Chemistry summary vaults.',
    icon: BookOpen,
    tagColor: 'var(--text-primary)'
  },
  {
    id: 'dropper-strategy',
    badge: 'Dropper & Repeater Special',
    title: 'Dropper Year Strategy, Pacing & Emotional Resilience',
    queryKeyword: 'best mentorship for NEET droppers & JEE dropper strategy 2027',
    problemSummary: 'Dealing with self-doubt, isolation, repetitive lectures, and fear of repeating past attempt mistakes.',
    solutionBreakdown: [
      'Customized Syllabus Roadmap: Accelerate strong chapters to allocate double time for historically weak topics.',
      'Daily Mentor Check-Ins: Eliminate procrastination and isolation through daily target accountability.',
      'Mental Conditioning & Mindset: Direct 1-on-1 calls with mentors who cracked AIR ranks in their drop years.'
    ],
    fullExplanation: `Searching for the **best mentorship for NEET droppers** or a proven **JEE dropper strategy 2027**? Droppers do not need another 8-hour passive video lecture cycle; they need targeted question practice, disciplined daily pacing, and psychological resilience. At RestartClub, our dropper-specific roadmaps eliminate repetitive theory for your strong areas while doubling down on rigorous problem-solving in weak zones. Paired with an AIR mentor who was once a dropper themselves, you receive constant emotional support, test strategy reviews, and unrelenting daily accountability to secure your dream medical or engineering seat.`,
    actionStep: 'Schedule a 1-on-1 strategy call to build your tailored drop year comeback plan.',
    icon: Flame,
    tagColor: 'var(--text-primary)'
  }
];

export default function ProblemSolutionSEO({ onBookCall }: ProblemSolutionSEOProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>('backlog-management');

  const toggleCard = (id: string) => {
    setExpandedCard(prev => prev === id ? null : id);
  };

  return (
    <section id="solutions" className="problem-solution-section">
      <div className="container">
        
        {/* Section Header with Semantic SEO Hierarchy */}
        <div className="section-header text-center">
          <div className="badge-pill">
            <Sparkles size={14} className="text-emerald" /> Step-by-Step Problem Solving
          </div>
          <h2 className="section-title">
            Stuck in Your Preparation? <span className="gradient-text-emerald">Get Step-by-Step Help</span>
          </h2>
          <p className="section-description max-w-2xl mx-auto">
            Result-oriented solutions for the 4 most critical roadblocks stopping JEE and NEET aspirants from reaching their target AIR rank.
          </p>
        </div>

        {/* High-Density Problem & Solution Matrix */}
        <div className="seo-problem-grid">
          {SEO_CARDS.map((card) => {
            const isExpanded = expandedCard === card.id;
            const IconComponent = card.icon;

            return (
              <article 
                key={card.id} 
                className={`seo-problem-card glass-card ${isExpanded ? 'card-active' : ''}`}
              >
                {/* Header & Badges */}
                <div className="seo-card-top" onClick={() => toggleCard(card.id)} style={{ cursor: 'pointer' }}>
                  <div className="seo-card-badge-row">
                    <span className="seo-badge">{card.badge}</span>
                    <span className="seo-query-tag">🔍 {card.queryKeyword}</span>
                  </div>

                  <div className="seo-card-title-row">
                    <div className="seo-card-icon-box">
                      <IconComponent size={22} className="text-emerald" />
                    </div>
                    <h3 className="seo-card-heading">{card.title}</h3>
                    <button 
                      type="button" 
                      className="seo-expand-btn"
                      aria-label="Toggle section details"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  <p className="seo-problem-lead">
                    <strong className="text-rose">The Roadblock:</strong> {card.problemSummary}
                  </p>
                </div>

                {/* Key Bullet Highlights (Always Visible for Crawlers & Fast Scanners) */}
                <div className="seo-solution-highlights">
                  <h4 className="seo-subheading">Result-Oriented Action Plan:</h4>
                  <ul className="seo-checklist">
                    {card.solutionBreakdown.map((point, pIdx) => (
                      <li key={pIdx} className="seo-check-item">
                        <CheckCircle2 size={16} className="text-emerald shrink-0 mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expandable High-Density SEO Deep Dive */}
                {isExpanded && (
                  <div className="seo-expanded-content">
                    <div className="seo-prose">
                      <p dangerouslySetInnerHTML={{ __html: card.fullExplanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>

                    <div className="seo-action-box">
                      <div className="seo-action-text">
                        <span className="action-tag">Next Action Step</span>
                        <p>{card.actionStep}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={onBookCall}
                        className="seo-cta-btn"
                      >
                        <span>Fix My Prep Plan with an AIR Mentor</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Compact Footer when collapsed */}
                {!isExpanded && (
                  <div className="seo-card-bottom-quick">
                    <button 
                      type="button"
                      onClick={() => toggleCard(card.id)}
                      className="seo-readmore-link"
                    >
                      Read full AIR topper framework & strategy guide ↓
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
