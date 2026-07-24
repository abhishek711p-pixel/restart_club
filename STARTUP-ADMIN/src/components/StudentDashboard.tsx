import React, { useState, useEffect, useRef } from 'react';
import { Compass, LogOut, Download, Send, Plus, Trash2, Award, Calendar, CheckSquare, Users, Check } from 'lucide-react';
import { api } from '../services/api';

interface StudentDashboardProps {
  user: { username: string; email: string; batch: string };
  onLogout: () => void;
}

interface Message {
  sender: 'student' | 'mentor';
  text: string;
  time: string;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const BATCH_DETAILS = {
  '10': {
    name: "RestartClub Foundation (Class 10)",
    tagline: "Board-Booster + JEE/NEET Foundation Prep",
    filled: 62,
    features: [
      "1-on-1 Dedicated Mentor & Guidance",
      "Toppers' handwritten Science & Math Board notes",
      "CBSE, ICSE & State Board writing paper checks",
      "Science & Maths Olympiad Foundation targets",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly Board Strategy sessions & live quizzes"
    ]
  },
  '11': {
    name: "RestartClub Aarambh (Class 11)",
    tagline: "Class 11 school syllabus + JEE/NEET concepts",
    filled: 74,
    features: [
      "1-on-1 Dedicated Mentor & Guidance",
      "Physics & Chemistry formula sheets + topper revision notes",
      "Class 11 Backlog clearing planner & trackers",
      "Advanced Science/Math doubt solver guidance",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly Backlog Revision live audio lounges"
    ]
  },
  '12': {
    name: "RestartClub Sankalp (Class 12)",
    tagline: "Class 12 Board preparation + JEE/NEET Cracker",
    filled: 91,
    features: [
      "1-on-1 Dedicated Mentor & Guidance",
      "Class 12 Boards & JEE/NEET Toppers' handwritten notes & formula sheets",
      "Boards Pre-Board & Revision revision checklists",
      "Mock Test Analysis & mistake-tracking spreadsheets",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly JEE/NEET strategy audio sessions"
    ]
  },
  'jee-dropper': {
    name: "RestartClub Dropper JEE",
    tagline: "Full JEE Main & Advanced coverage + Backlog tracker",
    filled: 83,
    features: [
      "1-on-1 Dedicated Mentor & Guidance",
      "JEE Core Formula cheatsheets & topper-vetted short revision notes",
      "Dropper Backlog & Daily Practice Problem tracker",
      "JEE Main & Advanced weekly mock test analytics",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly live JEE problem-solving lounges"
    ]
  },
  'neet-dropper': {
    name: "RestartClub Dropper NEET",
    tagline: "Full NEET-UG coverage + NCERT line-by-line tracker",
    filled: 87,
    features: [
      "1-on-1 Dedicated Mentor & Guidance",
      "NEET Biology NCERT-blueprint short notes & Physics formula sheets",
      "Dropper Backlog & Biology NCERT mapping",
      "NEET mock test error checking & tracking sheets",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly live NEET mock strategy sessions"
    ]
  }
};

const NOTES_LIST: Record<string, Array<{ name: string; size: string }>> = {
  '10': [
    { name: "Science Boards handwritten notes.pdf", size: "4.8 MB" },
    { name: "Maths NTSE & Olympiad cheat sheet.pdf", size: "2.1 MB" },
    { name: "Class 10 CBSE Sample writing checks.pdf", size: "3.5 MB" }
  ],
  '11': [
    { name: "Physics Class 11 formulas summary.pdf", size: "5.2 MB" },
    { name: "Inorganic Chemistry trend sheets.pdf", size: "3.8 MB" },
    { name: "Mathematics coordinate geometry tracker.pdf", size: "4.1 MB" }
  ],
  '12': [
    { name: "Physics Boards & JEE core cheatsheet.pdf", size: "6.1 MB" },
    { name: "Organic Chemistry named reactions notes.pdf", size: "4.5 MB" },
    { name: "Mathematics calculus boards check sheet.pdf", size: "5.0 MB" }
  ],
  'jee-dropper': [
    { name: "JEE Main and Advanced physics notes.pdf", size: "8.4 MB" },
    { name: "Physical Chemistry formula logs.pdf", size: "5.9 MB" },
    { name: "Coordinate Geometry Advanced problem sheet.pdf", size: "7.2 MB" }
  ],
  'neet-dropper': [
    { name: "Biology NCERT-blueprint short sheets.pdf", size: "11.2 MB" },
    { name: "Physics NEET-UG formula logs.pdf", size: "4.8 MB" },
    { name: "Organic Chemistry mock logs sheet.pdf", size: "6.5 MB" }
  ]
};

const DEFAULT_TASKS: Record<string, string[]> = {
  '10': ["Complete Science Chapter 4 boards checking", "Solve 10 algebra questions", "Review mock test quiz results"],
  '11': ["Clear Class 11 physics backlog (mechanics)", "Solve 15 Chemistry practice questions", "Read Biology NCERT Chapter 5"],
  '12': ["Practice Class 12 mock writing board sheet", "Attempt physics chapter-wise JEE test", "Revise Chemistry organic conversions"],
  'jee-dropper': ["Solve 20 JEE Mains calculus equations", "Complete inorganic trends notes review", "Attempt 1 full mock test paper"],
  'neet-dropper': ["Read Biology NCERT plant physiology trends", "Revise physics kinematics formula logs", "Solve 30 biology MCQ check sheets"]
};

const BATCH_LABELS: Record<string, string> = {
  '10': 'Class 10 (Foundation)',
  '11': 'Class 11 (Aarambh)',
  '12': 'Class 12 (Sankalp)',
  'jee-dropper': 'JEE Dropper',
  'neet-dropper': 'NEET Dropper'
};

const MOCK_MENTORS: Record<string, { name: string; college: string }> = {
  '10': { name: "Aarav Sharma", college: "CBSE State Topper (98.6%)" },
  '11': { name: "Sameer Verma", college: "IIT Delhi (EE)" },
  '12': { name: "Divya Patel", college: "IIT Bombay (CSE)" },
  'jee-dropper': { name: "Rohan Gupta", college: "IIT Kharagpur (CSE)" },
  'neet-dropper': { name: "Riya Sen", college: "AIIMS New Delhi (AIR 42)" }
};

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const handleChangePassword = async () => {
    setProfileError('');
    setProfileSuccess('');

    if (!newPassword || !confirmPassword) {
      setProfileError('Please fill in both fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 4) {
      setProfileError('Password must be at least 4 characters.');
      return;
    }

    try {
      const res = await api.updatePassword({ email: user.email, password: newPassword });
      if (res.success) {
        setProfileSuccess('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setProfileError(res.error || 'User account not found.');
      }
    } catch (err) {
      setProfileError('Network error');
    }
  };

  const [isBought, setIsBought] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await api.getUsers();
        if (users[user.email] && users[user.email].bought) {
          setIsBought(true);
        }
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    };
    fetchUser();
  }, [user.email]);

  const [activeNotes, setActiveNotes] = useState<Array<{ name: string; size: string }>>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await api.getBatchNotes(user.batch);
        if (notes && notes.length > 0) {
          setActiveNotes(notes);
        } else {
          setActiveNotes(NOTES_LIST[user.batch as keyof typeof NOTES_LIST] || []);
        }
      } catch (err) {
        console.error("Failed to fetch notes", err);
      }
    };
    fetchNotes();
  }, [user.batch]);

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId) {
      setCheckoutError('Please enter your UPI ID or Card details.');
      return;
    }
    
    try {
      const res = await api.togglePayment(user.email, user.batch);
      if (res.success && res.bought) {
        setIsBought(true);
        setShowCheckout(false);
        alert(`🎉 Payment Successful! Welcome to the family. Your batch is now fully unlocked.`);
      } else {
        setCheckoutError('Failed to process payment.');
      }
    } catch (err) {
      setCheckoutError('Network error');
    }
  };

  const [activeTab, setActiveTab] = useState<'workspace' | 'progress'>('workspace');
  const [mockScores, setMockScores] = useState<Array<{ id: string; subject: string; score: number; date: string }>>([]);
  const [logSubject, setLogSubject] = useState('Physics');
  const [logScore, setLogScore] = useState('');

  const handleLogScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logScore) return;
    const scoreVal = parseInt(logScore);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      alert('Please enter a valid score between 0 and 100.');
      return;
    }
    const newScore = {
      id: `score-${Date.now()}`,
      subject: logSubject,
      score: scoreVal,
      date: new Date().toISOString().split('T')[0]
    };
    const updatedScores = [newScore, ...mockScores];
    setMockScores(updatedScores);
    await api.updateScores(user.email, updatedScores);
    setLogScore('');
    alert(`🎉 Mock test score logged successfully!`);
  };

  const handleDeleteScore = async (id: string) => {
    const updated = mockScores.filter(s => s.id !== id);
    setMockScores(updated);
    await api.updateScores(user.email, updated);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeBatch = user.batch;
  const currentBatchDetails = BATCH_DETAILS[activeBatch as keyof typeof BATCH_DETAILS] || BATCH_DETAILS['12'];
  const mentor = MOCK_MENTORS[activeBatch] || { name: "RestartClub Senior Topper", college: "IIT/NEET Topper" };

  // Load chat and tasks history specific to this user from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Chat
        const chatData = await api.getChat(user.email);
        if (chatData && chatData.length > 0) {
          setMessages(chatData);
        } else {
          const welcomeMsg: Message = {
            sender: 'mentor',
            text: `Hey ${user.username}! Welcome to your dashboard. I am your assigned topper mentor, ${mentor.name} (${mentor.college}). Main aapko call pe update dunga, but any query or doubts ke liye type here! Aapki revision sheets share kar di gayi hain left side check karo.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages([welcomeMsg]);
          await api.updateChat(user.email, [welcomeMsg]);
        }

        // Load Tasks
        const tasksData = await api.getTasks(user.email);
        if (tasksData && tasksData.length > 0) {
          setTasks(tasksData);
        } else {
          const plannersData = await api.getBatchPlanner(activeBatch);
          const defaultList = plannersData.length > 0 ? plannersData : (DEFAULT_TASKS[activeBatch as keyof typeof DEFAULT_TASKS] || ["Revise current chapter notes", "Complete mock practice sheets"]);
          const initialTasks = defaultList.map((t: string, idx: number) => ({
            id: `task-${idx}`,
            text: t,
            completed: false
          }));
          setTasks(initialTasks);
          await api.updateTasks(user.email, initialTasks);
        }

        // Load Scores
        const scoresData = await api.getScores(user.email);
        if (scoresData && scoresData.length > 0) {
          setMockScores(scoresData);
        } else {
          const initialScores = [
            { id: '1', subject: 'Physics Mock 1', score: 82, date: '2026-07-15' },
            { id: '2', subject: 'Chemistry Revision Test', score: 88, date: '2026-07-18' },
            { id: '3', subject: 'Math/Bio Olympiad Prep', score: 76, date: '2026-07-20' }
          ];
          setMockScores(initialScores);
          await api.updateScores(user.email, initialScores);
        }
      } catch (err) {
        console.error("Failed to load dashboard data from API", err);
      }
    };
    loadData();
  }, [user.email, activeBatch, mentor.name, mentor.college, user.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save chat to API whenever it changes
  const saveChat = async (newMsgs: Message[]) => {
    setMessages(newMsgs);
    await api.updateChat(user.email, newMsgs);
  };

  // Save tasks to API
  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    await api.updateTasks(user.email, newTasks);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newStudentMsg: Message = {
      sender: 'student',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMsgs = [...messages, newStudentMsg];
    saveChat(updatedMsgs);
    setInputText('');

    // Mock mentor AI reply delay
    setTimeout(() => {
      let mentorReplyText = `Bilkul sahi doubt hai ${user.username}! I am checking this concept with our planning spreadsheet. Main offline detailed analysis check kar raha hoon and will review this with you in our weekly voice lounge. Revision lists follow karte raho!`;
      
      if (inputText.toLowerCase().includes('time') || inputText.toLowerCase().includes('timetable') || inputText.toLowerCase().includes('schedule')) {
        mentorReplyText = `Timetable block simple rakhein: Daily 3 slots (Physics, Chemistry, Maths/Bio) of 2.5 hours each. Main aapke tracker sheet mein slots update kar raha hoon, direct download kar lo left menu se.`;
      } else if (inputText.toLowerCase().includes('backlog') || inputText.toLowerCase().includes('revision')) {
        mentorReplyText = `Backlog revision block ke liye special handwritten revision cheatsheet bhej raha hoon left downloads panel mein. Study goals follow karo, main paper sheets inspect kar loonga.`;
      } else if (inputText.toLowerCase().includes('notes') || inputText.toLowerCase().includes('pdf') || inputText.toLowerCase().includes('sheets')) {
        mentorReplyText = `Notes aur revision PDF main update karta rahoonga. Please download them from the 'Revision Notes' tab here. Aur boards/JEE questions practice checks direct send karo mujhe.`;
      }

      const mentorMsg: Message = {
        sender: 'mentor',
        text: mentorReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChat([...updatedMsgs, mentorMsg]);
    }, 1200);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: newTaskText,
      completed: false
    };

    saveTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  const handleDownload = (filename: string) => {
    setDownloadingFile(filename);
    setTimeout(() => {
      setDownloadingFile(null);
      alert(`🎉 PDF Download Successful: "${filename}" has been saved to your offline files!`);
    }, 1500);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Dashboard Top Navbar */}
      <header className="navbar-header" style={{ background: '#ffffff', borderBottom: '2px solid var(--border-color)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-icon-wrapper">
              <Compass className="logo-icon animate-spin-slow" />
            </div>
            <span className="logo-text">Restart <span className="logo-highlight">Club</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', background: '#ffffff' }}
            >
              👤 {user.username} (Profile)
            </button>
            <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '8px 16px', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
              Logout <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Switcher inside active dashboard */}
      {isBought && (
        <div className="container" style={{ paddingTop: '30px', textAlign: 'left' }}>
          <div className="tab-switcher" style={{
            display: 'inline-flex',
            background: '#ffffff',
            padding: '6px',
            borderRadius: '14px',
            gap: '8px',
            border: '2px solid var(--border-color)',
            boxShadow: '3px 3px 0px #111827'
          }}>
            <button 
              onClick={() => setActiveTab('workspace')}
              className="btn" 
              style={{
                padding: '8px 20px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '700',
                background: activeTab === 'workspace' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'workspace' ? '#ffffff' : 'var(--text-primary)',
                boxShadow: 'none',
                transform: 'none',
                cursor: 'pointer'
              }}
            >
              📚 Study Desk
            </button>
            <button 
              onClick={() => setActiveTab('progress')}
              className="btn" 
              style={{
                padding: '8px 20px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '700',
                background: activeTab === 'progress' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'progress' ? '#ffffff' : 'var(--text-primary)',
                boxShadow: 'none',
                transform: 'none',
                cursor: 'pointer'
              }}
            >
              📈 My Progress Board
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      {isBought ? (
        activeTab === 'workspace' ? (
          <main className="container" style={{ flex: 1, padding: '40px 24px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px' }}>
        
        {/* Left Column: Tasks and Downloads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Welcome and Mentor assigned card */}
          <div className="glass-card" style={{ background: '#ffffff', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ background: 'var(--bg-primary)', width: '60px', height: '60px', borderRadius: '14px', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={30} style={{ color: 'var(--accent-color)' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: '#111827' }}>Welcome, {user.username}!</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Your personal topper mentor **{mentor.name}** ({mentor.college}) is active and monitoring your weekly planners.
              </p>
            </div>
          </div>

          {/* Daily Study Planner Checklist */}
          <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                <CheckSquare size={20} style={{ color: 'var(--accent-color)' }} />
                Daily Study Planner Checklist
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-color)', background: 'var(--bg-primary)', padding: '4px 10px', borderRadius: '6px', border: '1.5px solid var(--border-color)' }}>
                {progressPercent}% Complete
              </div>
            </div>

            {/* Checklist Progress Bar */}
            <div className="progress-bar-track" style={{ height: '8px', marginBottom: '20px' }}>
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, transition: 'width 0.3s ease' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Left Side: Tasks and form */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tasks.map(task => (
                    <div key={task.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: '#fafafa',
                      borderRadius: '10px',
                      border: task.completed ? '2px solid rgba(16, 185, 129, 0.3)' : '2px solid var(--border-color)',
                      boxShadow: task.completed ? 'none' : '2px 2px 0px #111827',
                      transition: 'all 0.2s ease'
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => handleToggleTask(task.id)}
                          style={{ accentColor: 'var(--accent-color)', width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: '600',
                          textDecoration: task.completed ? 'line-through' : 'none', 
                          color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)' 
                        }}>
                          {task.text}
                        </span>
                      </label>
                      <button 
                        onClick={() => handleDeleteTask(task.id)} 
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>
                      No study goals added. Add a study goal below to start!
                    </p>
                  )}
                </div>

                {/* Add task form */}
                <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="E.g., Read Physics Chapter 5 Boards checking sheet..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-color)',
                      outline: 'none',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--sans-font)'
                    }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', gap: '4px' }}>
                    Add <Plus size={16} />
                  </button>
                </form>
              </div>

              {/* Right Side: Day Wise Task Completed Widget */}
              <div style={{ width: '250px', flexShrink: 0, background: '#f9fafb', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '3px 3px 0px #111827' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', marginBottom: '8px' }}>DAY WISE TASK COMPLETED</span>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-color)', fontFamily: 'var(--heading-font)' }}>
                  {progressPercent}%
                </span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {completedCount} of {tasks.length} goals complete
                </span>
              </div>
            </div>
          </div>

          {/* Revision handwritten study materials and cheat sheets downloads panel */}
          <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
              <Calendar size={20} style={{ color: 'var(--accent-color)' }} />
              Revision Study Notes & Cheat Sheets
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeNotes.map((file, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  background: '#ffffff',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: '2px 2px 0px #111827'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>{file.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>📄 PDF Document • {file.size}</span>
                  </div>
                  <button 
                    onClick={() => handleDownload(file.name)} 
                    disabled={downloadingFile !== null}
                    className="btn btn-secondary" 
                    style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '4px' }}
                  >
                    {downloadingFile === file.name ? 'Saving...' : 'Download'} 
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mentor Chat Workspace */}
        <div className="glass-card" style={{ background: '#efeae2', padding: 0, height: '620px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Chat Workspace Header */}
          <div style={{
            background: '#008069',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '2px solid #111827',
            borderTopLeftRadius: '18px',
            borderTopRightRadius: '18px'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#54656f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #111827',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.9rem'
            }}>
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
              <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '0.95rem' }}>{mentor.name} (Your Topper Mentor)</span>
              <span style={{ fontSize: '0.75rem', color: '#e0f2f1', fontWeight: '600' }}>Active Now (IIT/NEET Topper Desk)</span>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#efeae2' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'student' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #111827',
                background: msg.sender === 'student' ? '#d9fdd3' : '#ffffff',
                color: '#111827',
                boxShadow: msg.sender === 'student' ? '2px 2px 0px #111827' : '-2px 2px 0px #111827',
                textAlign: 'left',
                borderTopRightRadius: msg.sender === 'student' ? '2px' : '12px',
                borderTopLeftRadius: msg.sender === 'mentor' ? '2px' : '12px'
              }}>
                <p style={{ fontSize: '0.85rem', margin: 0, wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{msg.text}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.7rem', color: '#667781', marginTop: '4px' }}>
                  {msg.time}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Send Input Box */}
          <form onSubmit={handleSendMessage} style={{
            background: '#f0f2f5',
            padding: '12px 16px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            borderTop: '1.5px solid var(--border-color)',
            borderBottomLeftRadius: '18px',
            borderBottomRightRadius: '18px'
          }}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask mentor a doubt or query..."
              style={{
                flex: 1,
                background: '#ffffff',
                border: '1.5px solid var(--border-color)',
                outline: 'none',
                padding: '10px 16px',
                borderRadius: '20px',
                color: '#111827',
                fontSize: '0.85rem',
                fontFamily: 'var(--sans-font)',
                boxShadow: '2px 2px 0px #111827'
              }}
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="whatsapp-send-btn"
              style={{ flexShrink: 0 }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>

      </main>
        ) : (
          <main className="container" style={{ flex: 1, padding: '40px 24px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px' }}>
            {/* Left Column: Progress Metrics & Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Overall Progress Stat Card */}
              <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '30px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                  📈 Overall Academic Progress
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ background: '#f9fafb', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '3px 3px 0px #111827' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', marginBottom: '8px' }}>DAY WISE TASK COMPLETED</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-color)', fontFamily: 'var(--heading-font)' }}>
                      {progressPercent}%
                    </span>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      {tasks.filter(t => t.completed).length} of {tasks.length} goals complete
                    </span>
                  </div>

                  <div style={{ background: '#f9fafb', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '3px 3px 0px #111827' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', marginBottom: '8px' }}>MOCK TEST AVERAGE</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-color)', fontFamily: 'var(--heading-font)' }}>
                      {mockScores.length > 0 ? Math.round(mockScores.reduce((acc, curr) => acc + curr.score, 0) / mockScores.length) : 0}%
                    </span>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      Based on {mockScores.length} tests logged
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Study Hours Log */}
              <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '30px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                  🕒 Weekly Study Hours Log
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Self-study hours tracker monitored by **{mentor.name}**.
                </p>

                {/* Simulated Chart Bars */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', padding: '0 20px 20px 20px', background: '#fafafa', borderRadius: '12px', border: '2px solid var(--border-color)' }}>
                  {[
                    { day: 'Mon', hrs: 6.5 },
                    { day: 'Tue', hrs: 8.0 },
                    { day: 'Wed', hrs: 7.0 },
                    { day: 'Thu', hrs: 9.5 },
                    { day: 'Fri', hrs: 6.0 },
                    { day: 'Sat', hrs: 8.5 },
                    { day: 'Sun', hrs: 4.0 }
                  ].map((d, idx) => {
                    const percentHeight = (d.hrs / 12) * 100;
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>{d.hrs}h</span>
                        <div style={{
                          width: '100%',
                          height: `${percentHeight}%`,
                          minHeight: '10px',
                          background: 'var(--accent-color)',
                          border: '2px solid #111827',
                          borderRadius: '6px',
                          boxShadow: '2px 0px 0px #111827',
                          transition: 'height 0.3s ease'
                        }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827', marginTop: '8px' }}>{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Log & Track Mock Tests */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Log new score form */}
              <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', color: '#111827', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                  📝 Log Mock Test Score
                </h3>
                <form onSubmit={handleLogScore} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                      TEST TITLE / SUBJECT
                    </label>
                    <select 
                      value={logSubject}
                      onChange={(e) => setLogSubject(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-color)',
                        outline: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      <option value="Physics Mock Test">Physics Mock Test</option>
                      <option value="Chemistry Revision quiz">Chemistry Revision quiz</option>
                      <option value="Mathematics mock quiz">Mathematics mock quiz</option>
                      <option value="Biology Olympiad Prep">Biology Olympiad Prep</option>
                      <option value="Full syllabus review">Full syllabus review</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                      SCORE SECURED (%)
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={logScore}
                        onChange={(e) => setLogScore(e.target.value)}
                        placeholder="e.g. 85"
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '2px solid var(--border-color)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                      <button 
                        type="submit" 
                        className="btn btn-accent" 
                        style={{ padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Log Score
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Logged mock tests tracker list */}
              <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', color: '#111827', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                  📋 Logged Test History
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                  {mockScores.map(score => (
                    <div key={score.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: '#fafafa',
                      borderRadius: '10px',
                      border: '2px solid var(--border-color)',
                      boxShadow: '2px 2px 0px #111827'
                    }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
                          {score.subject}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Logged: {score.date}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '800', color: score.score >= 75 ? '#10b981' : '#f59e0b' }}>
                          {score.score}%
                        </span>
                        <button 
                          onClick={() => handleDeleteScore(score.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {mockScores.length === 0 && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>
                      No mock scores logged yet. Add one above!
                    </p>
                  )}
                </div>
              </div>

            </div>
          </main>
        )
      ) : (
        <main className="container" style={{ flex: 1, padding: '40px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '520px',
            background: '#ffffff',
            textAlign: 'center',
            padding: '40px'
          }}>
            <div className="badge-pill" style={{ background: '#fef2f2', color: '#ef4444', borderColor: '#ef4444' }}>
              🔒 Payment Pending
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', color: '#111827' }}>
              Unlock {currentBatchDetails.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {currentBatchDetails.tagline}
            </p>

            {/* Visual Seat Filled Progress Tracker */}
            <div className="seat-filled-tracker" style={{
              background: '#faf6ee',
              border: '2px solid var(--border-color)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '24px',
              boxShadow: '3px 3px 0px #111827',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700' }}>
                  <Users size={14} style={{ color: 'var(--accent-color)' }} />
                  Seats Filled: {currentBatchDetails.filled}/500
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ef4444' }}>
                  {500 - currentBatchDetails.filled} Slots Left!
                </span>
              </div>
              <div className="progress-bar-track" style={{ height: '10px', background: '#e5e7eb', border: '1.5px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <div className="progress-bar-fill" style={{ 
                  height: '100%', 
                  width: `${(currentBatchDetails.filled / 500) * 100}%`, 
                  background: 'var(--accent-color)'
                }}></div>
              </div>
            </div>

            <div className="comp-price" style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', marginBottom: '24px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--heading-font)' }}>₹500</span>
              <span style={{ color: 'var(--text-secondary)', marginLeft: '6px', fontSize: '0.95rem' }}>/ month</span>
            </div>

            <ul className="comp-features-list" style={{ textAlign: 'left', marginBottom: '32px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentBatchDetails.features.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Check size={16} className="text-emerald" style={{ flexShrink: 0 }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setShowCheckout(true)} 
              className="btn btn-accent w-full"
              style={{ padding: '14px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer' }}
            >
              Unlock Batch & Start Mentorship (₹500/mo)
            </button>
          </div>
        </main>
      )}

      {showCheckout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(17, 24, 39, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '380px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '8px 8px 0px #111827'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#111827', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
              💳 Secure Checkout
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              You are subscribing to **{currentBatchDetails.name}** for **₹500/mo**.
            </p>

            {checkoutError && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', marginBottom: '12px' }}>
                {checkoutError}
              </div>
            )}

            <form onSubmit={handleConfirmPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                  UPI ID or CARD DETAILS
                </label>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@upi or Card Number"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '2px solid var(--border-color)',
                    outline: 'none',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--sans-font)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCheckout(false);
                    setUpiId('');
                    setCheckoutError('');
                  }} 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-accent" 
                  style={{ padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(17, 24, 39, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '400px',
            padding: '32px',
            textAlign: 'left',
            boxShadow: '8px 8px 0px #111827'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
              👤 Your RestartClub Profile
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', marginBottom: '4px' }}>FULL NAME</label>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#111827', padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', border: '1.5px solid var(--border-color)' }}>
                  {user.username}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', marginBottom: '4px' }}>EMAIL ADDRESS</label>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#111827', padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', border: '1.5px solid var(--border-color)' }}>
                  {user.email}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', marginBottom: '4px' }}>ACTIVE BATCH</label>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#111827', padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', border: '1.5px solid var(--border-color)' }}>
                  {BATCH_LABELS[activeBatch] || activeBatch}
                </div>
              </div>

              <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Change Password</h4>
                
                {profileError && <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>{profileError}</div>}
                {profileSuccess && <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>{profileSuccess}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>NEW PASSWORD</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-color)',
                        outline: 'none',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--sans-font)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>CONFIRM PASSWORD</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-color)',
                        outline: 'none',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--sans-font)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setProfileError('');
                  setProfileSuccess('');
                }} 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleChangePassword} 
                className="btn btn-accent" 
                style={{ padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
