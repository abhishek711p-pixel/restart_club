import { useState, useRef, useEffect } from 'react';
import { Send, CheckCheck, ShieldAlert, Award, User, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'student' | 'bot' | 'human';
  time: string;
}

const PRESET_DOUBTS = [
  { question: "Bhai, Board aur JEE prep ek sath kaise manage karein?", answer: "Dekho, Board aur JEE manage karna mushkil lagta hai par simple hai. Board ke liye NCERT basics clear karo, aur JEE ke liye usi concept ke tough problems practice karo. Daily 60% time JEE prep ko do aur 40% time boards ke theory/writing patterns ko do. Aap is board test series and revision calendar ko follow kar sakte ho!" },
  { question: "Class 10th ICSE ke liye best daily schedule kya hoga?", answer: "Class 10th ICSE boards ke liye ek simple rule yaad rakho: consistency. Daily 4-5 ghante self-study kaafi hai. 2 ghante subjects like Maths/Physics ko do, 1.5 ghante languages/History/Geography ko aur 1 ghanta revision. Subah fresh brain ke sath complex topics padho aur raat ko revision/writing practice karo!" },
  { question: "Kya daily target hours match nahi hone pe tension lena normal hai?", answer: "Bilkul normal hai yaar! Har din ek jaisa nahi hota. Bas check karo ki backlog generate na ho. Agar aaj target short ho gaya, toh kal usko cover karne ke liye extra 1 ghanta padho. Par weekly target miss nahi hona chahiye. Tension mat lo, consistent raho, baaki AI aur hum mentors backup ke liye hain!" },
  { question: "Maths bilkul samajh nahi aa rahi, solve kaise karein?", answer: "Maths practice maangti hai, rote learning nahi. Pehle basics aur solved examples dekho. Har chapter ke formulas ki cheat sheet banao. Phir level-1 practice problems se start karo, bina direct solutions dekhe. Jab 10 me se 7 problems banne lagein, tab high level pe jao. Tension mat lo, clear your concepts step-by-step!" }
];

export default function ChatSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Namaste! Main RestartClub hoon, aapka study assistant. Aapke targets track karne aur doubts clear karne ke liye. Aapko personal topper mentor (IITian/NEET top ranker) bhi assign kiya jayega jo aapki exact strategy check karenge! 🚀",
      sender: 'bot',
      time: '12:00 PM'
    },
    {
      id: '2',
      text: "Aap niche diye gaye questions pe click karke check kar sakte hain, ya direct 'bhai help' type karke mentor alert test karein! 👇",
      sender: 'bot',
      time: '12:01 PM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newStudentMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newStudentMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking and typing
    setTimeout(() => {
      let botResponse = "";
      const lowerText = text.toLowerCase();

      // Find matching preset answer
      const matchedPreset = PRESET_DOUBTS.find(p => p.question.toLowerCase() === lowerText);
      
      if (matchedPreset) {
        botResponse = matchedPreset.answer;
      } else if (lowerText.includes('backlog')) {
        botResponse = "Backlog sabki problem hoti hai! Simple solution: fresh chapters ke sath touch me raho aur daily extra 1.5 hour purane backlog chapters ko do. Saturday/Sunday ko strictly backlog clear karne ke liye dedicated rakho.";
      } else if (lowerText.includes('stress') || lowerText.includes('tension') || lowerText.includes('darr')) {
        botResponse = "Chill karo, stress lene se rank nahi aati. Chote chote daily milestones banao, deep breaths lo aur 7 hours sleep strictly complete karo. Agar fir bhi darr lage toh directly personal mentor support option switch karo!";
      } else if (lowerText.includes('time table') || lowerText.includes('timetable') || lowerText.includes('schedule')) {
        botResponse = "Timetable rigid mat banao, task-based targets rakho. Har subah 3 core tasks list karo aur din ke end tak unhe complete karo. Yeh schedule template follow kar sakte ho.";
      } else if (lowerText.includes('help') || lowerText.includes('bhai help') || lowerText.includes('talk')) {
        botResponse = "Understood! Main aapke assigned topper mentor (Sankalp Bhaiya - IIT Delhi) ko direct alert notification bhej raha hoon. Wo aapse next 15 mins me connect karenge! Tab tak stress mat lo. 😊";
      } else {
        botResponse = "Aapka sawal bohot achha hai! Hum is topic ke detailed study planner aur direct toppers' logic hamare WhatsApp program portal par share karte hain, jahan real human mentors aapse personal call pe connect karte hain!";
      }

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section id="simulator" className="simulator-section">
      <div className="container simulator-container">
        
        <div className="simulator-info-pane">
          <div className="badge-pill">Interactive Demo</div>
          <h2 className="section-title">Try RestartClub <span className="gradient-text-indigo">WhatsApp Assistant</span></h2>
          <p className="section-description">
            Experience how our AI assistant helper resolves daily doubts, tracks study schedules, and addresses prep stress in natural **Hinglish**. If a student needs complex revision strategies, they can trigger an alert to route to their assigned topper mentor.
          </p>

          <div className="preset-doubts-list">
            <h4 className="preset-list-title">Frequently Asked Doubts:</h4>
            {PRESET_DOUBTS.map((doubt, index) => (
              <button 
                key={index}
                className="preset-doubt-btn"
                onClick={() => handleSend(doubt.question)}
                disabled={isTyping}
              >
                <MessageCircle className="doubt-btn-icon" />
                <span>{doubt.question}</span>
              </button>
            ))}
          </div>

          <div className="whatsapp-note glass-card">
            <ShieldAlert className="note-icon" />
            <div className="note-text">
              <strong>Topper Mentor Alert:</strong> Type <em>"bhai help"</em> in the chat input below to see how a real human mentor gets alerted for a personal takeover.
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

            <form 
              className="whatsapp-footer"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputText);
              }}
            >
              <input
                type="text"
                placeholder="Ask RestartClub a question in Hinglish..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                className="whatsapp-input"
              />
              <button 
                type="submit" 
                className="whatsapp-send-btn"
                disabled={!inputText.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
