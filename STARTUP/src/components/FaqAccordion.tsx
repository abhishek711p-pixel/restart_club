import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How does the 24/7 Hinglish AI WhatsApp Doubt Solver work?",
    answer: "Whenever you are stuck on a physics numerical, reaction mechanism, or biology question, simply take a photo or type your question on our dedicated WhatsApp bot. The AI instantly returns a step-by-step breakdown explaining the underlying formula, core logic, and common traps in natural conversational Hinglish.",
    tag: "AI & WhatsApp"
  },
  {
    question: "What happens during the Priority Human Mentor Alert (SOS) handoff?",
    answer: "If a problem requires deeper discussion or you don't fully grasp the AI's explanation, you can trigger the 'Mentor SOS Alert' button in WhatsApp. Your question, along with your conversation history, is immediately escalated to your dedicated human AIR mentor who will send a detailed audio note or schedule a quick sync to clear the confusion.",
    tag: "Mentorship"
  },
  {
    question: "Is RestartClub suitable for JEE and NEET Droppers?",
    answer: "Absolutely. In fact, more than 40% of our enrolled students are droppers. Droppers face unique challenges like isolation, burnout, and fear of repeating past mistakes. Our dropper batches include personalized backlog trackers, intense mock paper post-mortems, and daily accountability to keep your consistency at 100%.",
    tag: "Aspirants"
  },
  {
    question: "What is covered in the Full Home-to-College Counselling Support?",
    answer: "Counselling is included for Class 12 and Dropper batches. We assist you from document verification to the final seat allotment. Our senior mentors construct customized preference order lists for JoSAA, CSAB, MCC, and state quota counselling rounds based on your percentile, category, and preferred branches.",
    tag: "Counselling"
  },
  {
    question: "What is your refund or trial policy?",
    answer: "We offer a 100% risk-free 7-day satisfaction window. If you feel that the 1-on-1 mentor guidance, WhatsApp AI bot, or study vault materials do not match your expectations, simply reach out to rstartclub@gmail.com or WhatsApp support for a full, no-questions-asked refund.",
    tag: "Policy & Trust"
  },
  {
    question: "How are mentors assigned to students?",
    answer: "During onboarding, we evaluate your target exam (NEET or JEE), current grade level, strengths, and weak subject areas. We then pair you with an AIR Topper from AIIMS or IITs who specializes in your exact target profile and understands your syllabus pacing.",
    tag: "Onboarding"
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(prev => prev === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="section-header text-center">
          <div className="badge-pill">
            <HelpCircle size={14} className="text-emerald" /> Clear Answers
          </div>
          <h2 className="section-title">
            Frequently Asked <span className="gradient-text-emerald">Questions</span>
          </h2>
          <p className="section-description max-w-xl mx-auto">
            Everything you need to know about our hybrid 1-on-1 mentorship, WhatsApp AI doubt solver, and admissions support.
          </p>
        </div>

        <div className="faq-container max-w-3xl mx-auto">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`faq-card glass-card ${isOpen ? 'active' : ''}`}
                onClick={() => toggleIndex(idx)}
              >
                <div className="faq-question-row">
                  <div className="faq-question-content">
                    <span className="faq-tag">{faq.tag}</span>
                    <h3 className="faq-question-text">{faq.question}</h3>
                  </div>
                  <button
                    type="button"
                    className={`faq-toggle-btn ${isOpen ? 'open' : ''}`}
                    aria-label="Toggle FAQ"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
