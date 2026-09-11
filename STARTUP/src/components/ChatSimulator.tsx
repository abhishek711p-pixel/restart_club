import { useState, useRef, useEffect } from 'react';
import { CheckCheck, ShieldAlert, Award, User, Sparkles, BookOpen, Calendar, Target, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'student' | 'bot' | 'human';
  time: string;
}

const SAMPLE_FUNCTIONS = [
  {
    id: 'board-jee',
    label: "1. Board + JEE Dual Strategy",
    shortLabel: "Board + JEE Strategy",
    icon: <BookOpen size={14} />,
    badge: "Strategy",
    question: "Bhai, Board aur JEE prep ek sath kaise manage karein?",
    answer: "Dekho, Board aur JEE manage karna mushkil lagta hai par simple hai. Board ke liye NCERT basics clear karo, aur JEE ke liye usi concept ke tough problems practice karo. Daily 60% time JEE prep ko do aur 40% time boards ke theory/writing patterns ko do. Aap is board test series and revision calendar ko follow kar sakte ho!"
  },
  {
    id: 'schedule',
    label: "2. Daily Study Schedule",
    shortLabel: "Daily Schedule",
    icon: <Calendar size={14} />,
    badge: "Planner",
    question: "Class 10th / 11th / 12th ke liye best daily schedule kya hoga?",
    answer: "Boards & Competitive exams ke liye ek simple rule yaad rakho: consistency. Daily 4-5 ghante self-study kaafi hai. 2 ghante core subjects (Maths/Physics/Biology) ko do, 1.5 ghante other subjects ko aur 1 ghanta daily revision. Subah fresh brain ke sath complex topics padho aur raat ko revision/writing practice karo!"
  },
  {
    id: 'backlog',
    label: "3. Backlog & Target Pressure",
    shortLabel: "Backlog Clearing",
    icon: <Target size={14} />,
    badge: "Tracker",
    question: "Kya daily target hours match nahi hone pe tension lena normal hai?",
    answer: "Bilkul normal hai yaar! Har din ek jaisa nahi hota. Bas check karo ki backlog generate na ho. Agar aaj target short ho gaya, toh kal usko cover karne ke liye extra 1 ghanta padho. Par weekly target miss nahi hona chahiye. Tension mat lo, consistent raho, baaki AI aur hum mentors backup ke liye hain!"
  },
  {
    id: 'mentor-alert',
    label: "4. Topper Mentor SOS Alert",
    shortLabel: "Mentor SOS Alert",
    icon: <AlertTriangle size={14} />,
    badge: "Emergency",
    question: "Bhai help! Mujhe complex doubts me personal guidance chahiye.",
    answer: "Understood! Main aapke assigned topper mentor (Sankalp Bhaiya - IIT Delhi) ko direct alert notification bhej raha hoon. Wo aapse next 15 mins me direct WhatsApp / call pe connect karenge! Tab tak bilkul stress mat lo. 😊"
  }
];

export default function ChatSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Namaste! Main RestartClub hoon, aapka 24/7 study companion. Aapke daily targets track karne aur doubts clear karne ke liye! 🚀",
      sender: 'bot',
      time: '12:00 PM'
    },
    {
      id: '2',
      text: "Niche diye gaye 4 sample functions me se koi bhi select karein live demo dekhne ke liye! 👇",
      sender: 'bot',
      time: '12:01 PM'
    }
  ]);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      const container = chatEndRef.current.closest('.chat-messages-container');
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      } else {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [messages, isTyping]);

  const handleSelectSample = (sample: typeof SAMPLE_FUNCTIONS[0]) => {
    if (isTyping) return;

    setActiveSampleId(sample.id);

    const newStudentMsg: Message = {
      id: Date.now().toString(),
      text: sample.question,
      sender: 'student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newStudentMsg]);
    setIsTyping(true);

    // Simulate bot thinking and typing
    setTimeout(() => {
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: sample.answer,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section id="simulator" className="simulator-section">
      <div className="container simulator-container">
        
        <div className="simulator-info-pane">
          <div className="badge-pill">Interactive Demo</div>
          <h2 className="section-title">Try RestartClub <span className="gradient-text-indigo">WhatsApp Assistant</span></h2>
          <p className="section-description">
            Experience how our AI assistant resolves daily doubts, structures study timetables, and solves prep pressure in natural **Hinglish**. Whenever students need deep guidance, our system instantly triggers an alert to their dedicated topper mentor.
          </p>

          <div className="preset-doubts-list">
            <h4 className="preset-list-title">Select One of the 4 Functions:</h4>
            {SAMPLE_FUNCTIONS.map((sample) => (
              <button 
                key={sample.id}
                className={`preset-doubt-btn ${activeSampleId === sample.id ? 'active' : ''}`}
                onClick={() => handleSelectSample(sample)}
                disabled={isTyping}
              >
                <div className="doubt-btn-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  {sample.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', textAlign: 'left' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{sample.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>"{sample.question}"</span>
                </div>
              </button>
            ))}
          </div>

          <div className="whatsapp-note glass-card">
            <ShieldAlert className="note-icon" />
            <div className="note-text">
              <strong>Interactive Demo:</strong> Input is streamlined into 4 core functions. Click any sample button to experience instant resolution.
            </div>
          </div>
        </div>

        <div className="whatsapp-mockup-wrapper">
          <div className="whatsapp-device-border">
            <div className="whatsapp-header">
              <div className="user-avatar-wrapper">
                <div className="user-avatar">
                  <User size={20} className="avatar-icon-default" />
                </div>
                <div className="avatar-active-dot"></div>
              </div>
              <div className="chat-meta">
                <div className="chat-name-wrapper">
                  <span className="chat-name">RestartClub Companion</span>
                  <Award size={16} className="verified-badge" />
                </div>
                <span className="chat-status">online (AI Assistant)</span>
              </div>
            </div>

            <div className="whatsapp-body">
              <div className="chat-bg-pattern"></div>
              
              <div className="chat-messages-container">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`message-bubble-wrapper ${msg.sender === 'student' ? 'student-wrapper' : 'bot-wrapper'}`}
                  >
                    <div className={`message-bubble ${msg.sender === 'student' ? 'student-bubble' : 'bot-bubble'}`}>
                      <p className="message-text">{msg.text}</p>
                      <div className="message-meta-footer">
                        <span className="message-time">{msg.time}</span>
                        {msg.sender === 'student' && <CheckCheck size={14} className="blue-ticks" />}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message-bubble-wrapper bot-wrapper">
                    <div className="message-bubble bot-bubble typing-bubble">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Replaced text input with 4 interactive function selection buttons */}
            <div className="whatsapp-sample-footer">
              <div className="sample-footer-header">
                <Sparkles size={13} style={{ color: '#00a884' }} />
                <span>Select a function to see the live sample:</span>
              </div>
              <div className="sample-pills-grid">
                {SAMPLE_FUNCTIONS.map((sample) => (
                  <button 
                    key={sample.id}
                    type="button" 
                    className={`sample-pill-btn ${activeSampleId === sample.id ? 'active' : ''}`}
                    onClick={() => handleSelectSample(sample)}
                    disabled={isTyping}
                  >
                    <span className="sample-pill-icon">{sample.icon}</span>
                    <span className="sample-pill-text">{sample.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
