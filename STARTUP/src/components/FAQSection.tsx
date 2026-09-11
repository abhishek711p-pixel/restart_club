import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
  searchIntent: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Where can I get personal 1-on-1 help if my coaching isn't clearing my doubts?",
    answer: "At RestartClub, you get paired directly with an AIR Topper from AIIMS or IIT who conducts weekly 1-on-1 video mentorship sessions, reviews your test mistakes, and provides an actionable daily timetable. Combined with our 24/7 Hinglish AI WhatsApp doubt assistant, you never stay stuck on any physics numerical, chemistry mechanism, or biology concept.",
    tag: "1-on-1 Mentorship",
    searchIntent: "help in jee neet"
  },
  {
    question: "What is a result-oriented study plan for a NEET or JEE dropper?",
    answer: "A result-oriented dropper plan starts with a diagnostic test to identify high-yield backlogs and concept gaps. We allocate 70% study time to syllabus completion and 30% to structured revision. It includes weekly full-syllabus mock tests with 3-category error analysis (conceptual, calculation, panic-guessing) and daily mentor accountability check-ins.",
    tag: "Dropper Strategy",
    searchIntent: "dropper study plan for jee"
  },
  {
    question: "How does the 24/7 WhatsApp AI doubt solver help with late-night study?",
    answer: "Whenever you encounter a tough question during self-study or late-night revision (11 PM - 4 AM), snap a picture or type the problem into WhatsApp. The AI engine instantly replies with step-by-step logic, formula derivations, and common trap warnings in easy Hinglish. If you need further clarity, you can trigger a 1-tap Priority Human Mentor SOS.",
    tag: "24/7 AI Doubt Solver",
    searchIntent: "instant doubt clearance whatsapp"
  },
  {
    question: "Can Class 10/11 foundation students get mentorship for early JEE/NEET prep?",
    answer: "Yes! Early start batches for Class 10 and 11 focus on building rock-solid fundamentals, managing school-coaching balance, mastering NCERT line-by-line, and preventing common backlogs in mechanics, physical chemistry, and cell biology.",
    tag: "Class 10 & 11 Foundation",
    searchIntent: "how to cover backlog in class 11 neet"
  },
  {
    question: "How are mentors selected, and what results have past students achieved?",
    answer: "Our mentors are verified top rankers from prestigious institutions including AIIMS New Delhi, IIT Bombay, IIT Delhi, and MAMC. In the past academic cycle, 87% of our enrolled droppers achieved score jumps of 150+ marks in NEET and 15+ percentile in JEE Main.",
    tag: "Mentor Trust & Results",
    searchIntent: "result oriented neet mentorship"
  },
  {
    question: "What is covered in the Full Home-to-College Counselling Support?",
    answer: "Counselling is included for Class 12 and Dropper batches. We assist you from document verification to the final seat allotment. Our senior mentors construct customized preference order lists for JoSAA, CSAB, MCC, and state quota counselling rounds based on your percentile, category, and preferred branches.",
    tag: "College Counselling",
    searchIntent: "josaa mcc counselling guidance"
  },
  {
    question: "What is your refund or satisfaction policy?",
    answer: "We offer a 100% risk-free 7-day satisfaction window. If you feel that the 1-on-1 mentor guidance, WhatsApp AI bot, or study vault materials do not match your expectations, simply reach out for a full, no-questions-asked refund.",
    tag: "Trust & Safety",
    searchIntent: "mentorship refund guarantee"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(prev => prev === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="badge-pill">
            <HelpCircle size={14} className="text-emerald" /> High-Intent Answers
          </div>
          <h2 className="section-title">
            Frequently Asked <span className="gradient-text-emerald">Questions</span>
          </h2>
          <p className="section-description max-w-xl mx-auto">
            Everything you need to know about our result-oriented 1-on-1 mentorship, 24/7 AI WhatsApp doubts, and rank improvement roadmaps.
          </p>
        </div>

        {/* FAQ Accordion List with Crawlable Semantic Microdata */}
        <div className="faq-container max-w-3xl mx-auto" itemScope itemType="https://schema.org/FAQPage">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`faq-card glass-card ${isOpen ? 'active' : ''}`}
                onClick={() => toggleIndex(idx)}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <div className="faq-question-row">
                  <div className="faq-question-content">
                    <div className="faq-meta-tags">
                      <span className="faq-tag">{faq.tag}</span>
                    </div>
                    <h3 className="faq-question-text" itemProp="name">
                      {faq.question}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className={`faq-toggle-btn ${isOpen ? 'open' : ''}`}
                    aria-label={`Toggle answer for ${faq.question}`}
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                {isOpen && (
                  <div 
                    className="faq-answer-content"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="faq-bottom-callout text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Have a specific question about your syllabus or backlog?{' '}
            <a href="#solutions" className="text-emerald font-semibold underline hover:text-white">
              Explore our step-by-step problem-solving hub ↑
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
