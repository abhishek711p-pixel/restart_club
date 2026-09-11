import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Download, 
  Award, 
  CheckSquare, 
  Users, 
  Check, 
  FileText, 
  MessageCircle, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Copy, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  BookOpen, 
  Send,
  Bot
} from 'lucide-react';
import { api } from '../services/api';

interface StudentDashboardProps {
  user: { username: string; email: string; batch: string; purchasedBatches?: string[] };
  onLogout: () => void;
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
      "Handwritten Science & Math Board notes",
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
      "Physics & Chemistry formula sheets + revision notes",
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
      "Full Counselling Help and Guidance (Home to College)",
      "1-on-1 Dedicated Mentor & Guidance",
      "Class 12 Boards & JEE/NEET handwritten notes & formula sheets",
      "Boards Pre-Board & Revision checklists",
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
      "Full Counselling Help and Guidance (Home to College)",
      "1-on-1 Dedicated Mentor & Guidance",
      "JEE Core Formula cheatsheets & short revision notes",
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
      "Full Counselling Help and Guidance (Home to College)",
      "1-on-1 Dedicated Mentor & Guidance",
      "NEET Biology NCERT-blueprint short notes & Physics formula sheets",
      "Dropper Backlog & Biology NCERT mapping",
      "NEET mock test error checking & tracking sheets",
      "24/7 WhatsApp AI Chatbot Assistant",
      "Weekly live NEET mock strategy sessions"
    ]
  }
};

const MOCK_MENTORS: Record<string, { name: string; college: string }> = {
  '10': { name: "Aarav Sharma", college: "CBSE State Topper (98.6%)" },
  '11': { name: "Sameer Verma", college: "IIT Delhi (EE)" },
  '12': { name: "Divya Patel", college: "IIT Bombay (CSE)" },
  'jee-dropper': { name: "Rohan Gupta", college: "IIT Kharagpur (CSE)" },
  'neet-dropper': { name: "Riya Sen", college: "AIIMS New Delhi (AIR 42)" }
};

const BATCH_SUBJECTS_MAP: Record<string, { label: string; subjects: string[] }> = {
  '10': {
    label: 'Class 10 (Foundation)',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'History', 'Geography']
  },
  '11': {
    label: 'Class 11 (Aarambh)',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'Physical Education']
  },
  '12': {
    label: 'Class 12 (Sankalp)',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'Physical Education']
  },
  'jee-dropper': {
    label: 'JEE Dropper',
    subjects: ['Physics', 'Chemistry', 'Maths']
  },
  'neet-dropper': {
    label: 'NEET Dropper',
    subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology']
  }
};

export default function StudentDashboard({ user: initialUser, onLogout }: StudentDashboardProps) {
  const [user, setUser] = useState(initialUser);
  const [activeBatch, setActiveBatch] = useState<string>(user.batch || '12');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);
  
  // Profile modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isChangingBatch, setIsChangingBatch] = useState(false);
  const [pendingBatch, setPendingBatch] = useState(activeBatch);

  // Chatbot simulator interactive state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot'; text: string; time: string }>>([
    { role: 'bot', text: `Hi ${user.username}! I am your 24/7 AI Academic Assistant. Ask me any JEE/NEET formula, NCERT concept, or problem doubt!`, time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);

  useEffect(() => {
    setPendingBatch(activeBatch);
  }, [activeBatch]);

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
        setNewPassword('');
        setConfirmPassword('');
        setProfileSuccess('Password updated successfully!');
        setTimeout(() => setIsProfileOpen(false), 1200);
      } else {
        setProfileError(res.error || 'User account not found.');
      }
    } catch (err) {
      setProfileError('Network error');
    }
  };

  const handleBatchSubmit = async () => {
    if (pendingBatch === activeBatch) return;
    setIsChangingBatch(true);
    try {
      const res = await api.updateUserBatch({ email: user.email, batch: pendingBatch });
      if (res.success) {
        setUser(res.user);
        setActiveBatch(pendingBatch);
        localStorage.setItem('studentSession', JSON.stringify(res.user));
        alert('Batch updated successfully!');
        setIsProfileOpen(false);
      }
    } catch (err) {
      console.error("Failed to change batch", err);
      alert('Failed to update batch');
    } finally {
      setIsChangingBatch(false);
    }
  };

  // Derive access from purchasedBatches
  const hasPremiumAccess = user.purchasedBatches?.includes(activeBatch) || user.purchasedBatches?.includes(`${activeBatch}_premium`);
  const hasStandardAccess = user.purchasedBatches?.includes(`${activeBatch}_standard`) || hasPremiumAccess;
  const hasAccess = hasStandardAccess;

  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<'standard' | 'premium'>('premium');
  const [checkoutError, setCheckoutError] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirmPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setCheckoutError('');
      const res = await api.createPaymentOrder(user.email);
      const order = res;

      const resLoad = await loadRazorpayScript();
      if (!resLoad) {
        setCheckoutError("Failed to load Razorpay SDK. Check your connection.");
        return;
      }

      setShowCheckout(false);

      const options = {
        key: "rzp_live_THckRb4GLCahES",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "RestartClub Education",
        description: `Subscription for ${currentBatchDetails.name}`,
        order_id: order.id !== "client_only" ? order.id : undefined,
        handler: async function (response: any) {
          try {
            const verification = await api.verifyPayment({
              razorpay_order_id: response?.razorpay_order_id || "client_success_order",
              razorpay_payment_id: response?.razorpay_payment_id || "client_success_payment",
              razorpay_signature: response?.razorpay_signature || "client_success_signature",
              email: user.email,
              batch: activeBatch,
              tier: checkoutTier
            });
            if (verification.success) {
              const users = await api.getUsers();
              if (users[user.email]) {
                setUser(users[user.email]);
                localStorage.setItem('studentSession', JSON.stringify(users[user.email]));
              }
            }
          } catch (err) {
            console.error("Verification failed", err);
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: "#00BAF2",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (err) {
      setCheckoutError("Failed to initialize secure checkout. Please try again.");
    }
  };

  const [activeTab, setActiveTab] = useState<'communication' | 'workspace' | 'progress' | 'notes' | 'test' | 'chatbot'>(() => {
    const saved = localStorage.getItem('drona_active_tab');
    return (saved === 'progress' || saved === 'workspace' || saved === 'test' || saved === 'chatbot' || saved === 'notes' || saved === 'communication') ? saved as any : 'communication';
  });

  useEffect(() => {
    localStorage.setItem('drona_active_tab', activeTab);
  }, [activeTab]);

  const [mockScores, setMockScores] = useState<Array<{ id: string; subject: string; score: number; date: string }>>([]);
  const [studyHours, setStudyHours] = useState([
    { day: 'Mon', hrs: 6 },
    { day: 'Tue', hrs: 8 },
    { day: 'Wed', hrs: 7 },
    { day: 'Thu', hrs: 9 },
    { day: 'Fri', hrs: 8 },
    { day: 'Sat', hrs: 10 },
    { day: 'Sun', hrs: 6 }
  ]);
  const [notices, setNotices] = useState<Array<{ id: string; message: string; createdAt: string }>>([]);
  const [activeNotes, setActiveNotes] = useState<Array<{ name: string; size: string; subject?: string }>>([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All Subjects');

  const currentBatchDetails = BATCH_DETAILS[activeBatch as keyof typeof BATCH_DETAILS] || BATCH_DETAILS['12'];
  const mentor = MOCK_MENTORS[activeBatch] || { name: "RestartClub Senior Topper", college: "IIT/NEET Topper" };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [users, initialTasksResult, initialScores, initialHours, notes, fetchedNotices] = await Promise.all([
          api.getUsers(),
          api.getTasks(user.email, activeBatch),
          api.getScores(user.email, activeBatch),
          api.getStudyHours(user.email, activeBatch),
          api.getBatchNotes(activeBatch, user.email),
          api.getNotices(activeBatch)
        ]);

        const updatedUser = users && !users.error ? users[user.email] : null;

        if (!updatedUser) {
          onLogout();
          return;
        }

        const purchasedList = updatedUser.purchasedBatches || [];
        const cleanPurchased = purchasedList.map((b: string) => b.replace('_standard', '').replace('_premium', ''));
        const allUserBatches = Array.from(new Set([updatedUser.batch, ...cleanPurchased]));

        const isRegisteredInActiveBatch = allUserBatches.includes(activeBatch);

        if (!isRegisteredInActiveBatch) {
          if (allUserBatches.length > 0 && cleanPurchased.length > 0) {
            const targetBatch = cleanPurchased[0] || allUserBatches[0];
            setActiveBatch(targetBatch);
            localStorage.setItem('drona_selected_batch', targetBatch);
            setUser(updatedUser);
            localStorage.setItem('studentSession', JSON.stringify(updatedUser));
            return;
          } else {
            onLogout();
            return;
          }
        }

        setUser(updatedUser);
        localStorage.setItem('studentSession', JSON.stringify(updatedUser));

        if (Array.isArray(initialTasksResult) && initialTasksResult.length > 0) {
          setTasks(initialTasksResult);
        } else {
          const planners = await api.getBatchPlanner(activeBatch);
          const defaultTasks = Array.isArray(planners) && planners.length > 0 ? planners.map((t: string, idx: number) => ({
            id: `task-${idx}-${Date.now()}`,
            text: t,
            completed: false
          })) : [
            { id: 't1', text: 'Revise Electrostatics / Organic Mechanisms summary sheets', completed: true },
            { id: 't2', text: 'Solve 45 Previous Year Questions (PYQs) with error log', completed: false },
            { id: 't3', text: 'Attend Weekly Strategy Lounge & review Mock mistakes', completed: false }
          ];
          setTasks(defaultTasks);
          if (hasAccess && defaultTasks.length > 0) {
             api.updateTasks(user.email, activeBatch, defaultTasks).catch(() => {});
          }
        }
        
        if (Array.isArray(initialScores) && initialScores.length > 0) {
          setMockScores(initialScores);
        } else {
          setMockScores([
            { id: 's1', subject: 'Physics (Mechanics & Electrodynamics)', score: 82, date: 'Last Sunday' },
            { id: 's2', subject: 'Chemistry (Physical & Organic)', score: 88, date: '2 Weeks Ago' },
            { id: 's3', subject: activeBatch.includes('neet') ? 'Biology (Full NCERT Drill)' : 'Mathematics (Calculus & Algebra)', score: 79, date: '3 Weeks Ago' }
          ]);
        }

        if (initialHours && !initialHours.error && (initialHours.mon || initialHours.tue)) {
          setStudyHours([
            { day: 'Mon', hrs: initialHours.mon || 6 },
            { day: 'Tue', hrs: initialHours.tue || 7 },
            { day: 'Wed', hrs: initialHours.wed || 8 },
            { day: 'Thu', hrs: initialHours.thu || 9 },
            { day: 'Fri', hrs: initialHours.fri || 7 },
            { day: 'Sat', hrs: initialHours.sat || 10 },
            { day: 'Sun', hrs: initialHours.sun || 6 }
          ]);
        }

        if (Array.isArray(notes) && notes.length > 0) {
          setActiveNotes(notes);
        } else {
          setActiveNotes([
            { name: 'Physics - High-Yield Formula Handbook.pdf', size: '4.2 MB', subject: 'Physics' },
            { name: 'Chemistry - Organic Name Reactions & Mechanism Map.pdf', size: '3.8 MB', subject: 'Chemistry' },
            { name: activeBatch.includes('neet') ? 'Biology - NCERT Line-by-Line Diagram Cheatsheet.pdf' : 'Mathematics - Calculus Fast-Track Short Notes.pdf', size: '5.1 MB', subject: activeBatch.includes('neet') ? 'Biology' : 'Maths' }
          ]);
        }

        if (Array.isArray(fetchedNotices) && fetchedNotices.length > 0) {
          setNotices(fetchedNotices);
        } else {
          setNotices([
            {
              id: 'n1',
              message: '📢 Welcome to the official batch portal! Make sure to send "Hello" on WhatsApp to +91 7568864993 to link your personal mentor for 1-on-1 calls.',
              createdAt: new Date().toISOString()
            },
            {
              id: 'n2',
              message: '⚡ New weekly mock test analysis sheet and formula sheets have been updated in the Revision Notes tab.',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    
    fetchInitialData();
  }, [user.email, activeBatch, hasAccess]);

  const filteredNotes = activeNotes.filter(n => {
    if (selectedSubjectFilter === 'All Subjects') return true;
    return (n.subject || 'Physics').toLowerCase() === selectedSubjectFilter.toLowerCase();
  });

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    await api.updateTasks(user.email, activeBatch, newTasks);
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
      text: newTaskText.trim(),
      completed: false
    };
    const updated = [...tasks, newTask];
    setNewTaskText('');
    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  const handleDownload = (filename: string) => {
    setDownloadingFile(filename);
    setTimeout(() => {
      setDownloadingFile(null);
      alert(`🎉 Download Initiated: "${filename}" has been saved to your downloads folder!`);
    }, 1200);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("7568864993");
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatThinking) return;

    const userMsg = chatInput.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, time: nowTime }]);
    setChatInput('');
    setIsChatThinking(true);

    setTimeout(() => {
      let botReply = "Here is a quick concept breakdown: Keep your fundamental definitions clear and practice with standard PYQ variations. For detailed derivations, check your Revision Notes tab!";
      const lower = userMsg.toLowerCase();
      if (lower.includes('formula') || lower.includes('physics')) {
        botReply = "⚡ Key Formula Tip: For Work-Energy theorem, remember W_net = ΔK. Always check if conservative forces are doing path-independent work!";
      } else if (lower.includes('backlog') || lower.includes('plan')) {
        botReply = "🎯 Backlog Strategy: Dedicate 1.5 hours daily before main study blocks to clearing 1 high-weightage chapter from your study desk tracker.";
      } else if (lower.includes('neet') || lower.includes('biology')) {
        botReply = "🩺 NCERT High-Yield: Focus on Genetics & Ecology first — they constitute over 35% of the Botany/Zoology questions in recent NEET papers.";
      }
      setChatMessages(prev => [...prev, { role: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsChatThinking(false);
    }, 900);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const avgMockScore = mockScores.length > 0 ? Math.round(mockScores.reduce((acc, curr) => acc + curr.score, 0) / mockScores.length) : 0;
  const totalStudyHours = studyHours.reduce((acc, curr) => acc + curr.hrs, 0);

  const whatsappOnboardingUrl = `https://wa.me/917568864993?text=${encodeURIComponent(`Hello RestartClub Team, I am ${user.username} enrolled in ${currentBatchDetails.name}. Please connect me with my mentor!`)}`;

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Sleek Modern Dashboard Navbar */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'rgba(9, 9, 11, 0.85)', 
        backdropFilter: 'blur(16px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
        padding: '14px 0' 
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#121215',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)',
              flexShrink: 0
            }}>
              <img src="/logo.png" alt="RestartClub" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#ffffff' }}>
                Restart <span style={{ color: '#22c55e' }}>Club</span>
              </span>
              <span style={{ fontSize: '0.68rem', color: '#a1a1aa', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Student Portal
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Active Batch Indicator / Quick Switch */}
            <button 
              onClick={() => setIsProfileOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '100px',
                color: '#e4e4e7',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Click to switch batch or view profile"
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
              <span>{user.username}</span>
              <span style={{ color: '#71717a' }}>•</span>
              <span style={{ color: '#22c55e', fontWeight: '700' }}>{currentBatchDetails.name.split(' ')[1] || 'Batch'}</span>
            </button>

            {/* Logout Button */}
            <button 
              onClick={onLogout} 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '100px',
                color: '#f87171',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Glassmorphic Horizontal Tab Navigation Bar */}
      {hasAccess && (
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(18, 18, 21, 0.6)', backdropFilter: 'blur(10px)' }}>
          <div className="container" style={{ padding: '12px 24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '2px',
              scrollbarWidth: 'none'
            }}>
              
              <button 
                onClick={() => setActiveTab('communication')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '100px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'communication' ? '800' : '600',
                  background: activeTab === 'communication' ? '#ffffff' : 'transparent',
                  color: activeTab === 'communication' ? '#09090b' : '#a1a1aa',
                  border: activeTab === 'communication' ? '1px solid #ffffff' : '1px solid transparent',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'communication' ? '0 4px 15px rgba(255,255,255,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <MessageCircle size={15} style={{ color: activeTab === 'communication' ? '#09090b' : '#22c55e' }} />
                <span>Mentor Connect</span>
                {notices.length > 0 && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '1px 6px', 
                    borderRadius: '10px', 
                    background: activeTab === 'communication' ? '#09090b' : '#22c55e', 
                    color: activeTab === 'communication' ? '#ffffff' : '#000000',
                    fontWeight: '800'
                  }}>
                    {notices.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('workspace')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '100px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'workspace' ? '800' : '600',
                  background: activeTab === 'workspace' ? '#ffffff' : 'transparent',
                  color: activeTab === 'workspace' ? '#09090b' : '#a1a1aa',
                  border: activeTab === 'workspace' ? '1px solid #ffffff' : '1px solid transparent',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'workspace' ? '0 4px 15px rgba(255,255,255,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <CheckSquare size={15} style={{ color: activeTab === 'workspace' ? '#09090b' : '#60a5fa' }} />
                <span>Study Desk</span>
              </button>

              <button 
                onClick={() => setActiveTab('progress')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '100px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'progress' ? '800' : '600',
                  background: activeTab === 'progress' ? '#ffffff' : 'transparent',
                  color: activeTab === 'progress' ? '#09090b' : '#a1a1aa',
                  border: activeTab === 'progress' ? '1px solid #ffffff' : '1px solid transparent',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'progress' ? '0 4px 15px rgba(255,255,255,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <TrendingUp size={15} style={{ color: activeTab === 'progress' ? '#09090b' : '#fbbf24' }} />
                <span>My Progress</span>
              </button>

              <button 
                onClick={() => setActiveTab('notes')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '100px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'notes' ? '800' : '600',
                  background: activeTab === 'notes' ? '#ffffff' : 'transparent',
                  color: activeTab === 'notes' ? '#09090b' : '#a1a1aa',
                  border: activeTab === 'notes' ? '1px solid #ffffff' : '1px solid transparent',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'notes' ? '0 4px 15px rgba(255,255,255,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <BookOpen size={15} style={{ color: activeTab === 'notes' ? '#09090b' : '#a78bfa' }} />
                <span>Revision Notes</span>
              </button>

              <button 
                onClick={() => setActiveTab('test')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '100px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'test' ? '800' : '600',
                  background: activeTab === 'test' ? '#ffffff' : 'transparent',
                  color: activeTab === 'test' ? '#09090b' : '#a1a1aa',
                  border: activeTab === 'test' ? '1px solid #ffffff' : '1px solid transparent',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'test' ? '0 4px 15px rgba(255,255,255,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <FileText size={15} style={{ color: activeTab === 'test' ? '#09090b' : '#f472b6' }} />
                <span>Mock Tests</span>
              </button>

              <button 
                onClick={() => setActiveTab('chatbot')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '100px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'chatbot' ? '800' : '600',
                  background: activeTab === 'chatbot' ? '#ffffff' : 'transparent',
                  color: activeTab === 'chatbot' ? '#09090b' : '#a1a1aa',
                  border: activeTab === 'chatbot' ? '1px solid #ffffff' : '1px solid transparent',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'chatbot' ? '0 4px 15px rgba(255,255,255,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Bot size={15} style={{ color: activeTab === 'chatbot' ? '#09090b' : '#38bdf8' }} />
                <span>AI Doubt Solver</span>
                {!hasPremiumAccess && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 6px', 
                    borderRadius: '6px', 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    color: '#e4e4e7',
                    fontWeight: '700'
                  }}>
                    PRO
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard View Container */}
      <main className="container" style={{ flex: 1, padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        
        {hasAccess ? (
          
          /* TAB 1: MENTOR CONNECT / COMMUNICATION */
          activeTab === 'communication' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* WhatsApp Hero Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(18, 18, 21, 0.95), rgba(24, 24, 27, 0.95))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '40px 32px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Subtle emerald ambient aura */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '300px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  pointerEvents: 'none'
                }}></div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: '100px',
                  fontSize: '0.8rem',
                  color: '#4ade80',
                  fontWeight: '700',
                  marginBottom: '20px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}></span>
                  <span>Dedicated Mentorship Active • {currentBatchDetails.name}</span>
                </div>

                <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '12px' }}>
                  Connect with Your Official Mentor
                </h1>

                <p style={{ color: '#a1a1aa', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                  Every student who joins this batch must message <strong style={{ color: '#ffffff' }}>"Hello"</strong> on WhatsApp to get connected with their dedicated personal mentor for 1-on-1 strategy onboarding.
                </p>

                {/* 12-Hour SLA Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  color: '#fbbf24',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  marginBottom: '32px'
                }}>
                  <Clock size={16} />
                  <span>Note: After sending your message, your assigned mentor will onboard you within 12 hours!</span>
                </div>

                {/* Primary WhatsApp Action Container */}
                <div style={{
                  background: '#09090b',
                  border: '1.5px dashed rgba(34, 197, 94, 0.4)',
                  borderRadius: '16px',
                  padding: '24px',
                  maxWidth: '540px',
                  margin: '0 auto 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    <ShieldCheck size={16} style={{ color: '#22c55e' }} />
                    OFFICIAL MENTOR WHATSAPP NUMBER
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', letterSpacing: '0.04em', fontFamily: 'var(--heading-font)' }}>
                      +91 7568864993
                    </span>
                    <button
                      onClick={handleCopyPhone}
                      style={{
                        padding: '6px 12px',
                        background: copiedNumber ? '#22c55e' : 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: copiedNumber ? '#000000' : '#ffffff',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Copy size={13} />
                      <span>{copiedNumber ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* High-Impact 1-Click WhatsApp Button */}
                  <a
                    href={whatsappOnboardingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '100%',
                      padding: '14px 24px',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '800',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      boxShadow: '0 8px 25px rgba(34, 197, 94, 0.35)',
                      transition: 'all 0.2s ease',
                      marginTop: '4px'
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>Open WhatsApp & Message Mentor →</span>
                  </a>
                </div>

                {/* Mentor Bio Badge */}
                <div style={{ color: '#71717a', fontSize: '0.85rem' }}>
                  Assigned Mentor Lead: <strong style={{ color: '#e4e4e7' }}>{mentor.name}</strong> ({mentor.college})
                </div>
              </div>

              {/* Notices & Announcements Section */}
              <div style={{
                background: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    📢 Important Notices & Batch Updates
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: '600' }}>
                    Updated Daily
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notices.map((notice) => (
                    <div 
                      key={notice.id} 
                      style={{
                        background: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <p style={{ color: '#e4e4e7', fontSize: '0.92rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                        {notice.message}
                      </p>
                      <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: '600' }}>
                        📅 {new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}

                  {notices.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#71717a', fontSize: '0.9rem' }}>
                      No active notices right now. Batch announcements will appear here!
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : 

          /* TAB 2: STUDY DESK / WORKSPACE */
          activeTab === 'workspace' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Welcome & Motivational Card */}
              <div style={{
                background: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={28} style={{ color: '#22c55e' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      Welcome back, {user.username}!
                    </h2>
                    <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.08)', color: '#22c55e', fontWeight: '700', border: '1px solid rgba(255,255,255,0.1)' }}>
                      🎓 {currentBatchDetails.name}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#a1a1aa', margin: 0 }}>
                    Mentor: <strong style={{ color: '#ffffff' }}>{mentor.name}</strong> • Daily consistency is the single key factor between ordinary prep and top rankers.
                  </p>
                </div>
              </div>

              {/* Daily Study Planner Checklist */}
              <div style={{
                background: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <CheckSquare size={18} style={{ color: '#22c55e' }} />
                      Daily Study Planner & Backlog Checklist
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#71717a' }}>
                      Mark off tasks as you finish study blocks today
                    </span>
                  </div>

                  <div style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: '800', 
                    color: '#22c55e', 
                    background: 'rgba(34, 197, 94, 0.1)', 
                    padding: '5px 14px', 
                    borderRadius: '100px', 
                    border: '1px solid rgba(34, 197, 94, 0.3)' 
                  }}>
                    {completedCount}/{tasks.length} Completed ({progressPercent}%)
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div style={{ height: '8px', background: '#27272a', borderRadius: '100px', overflow: 'hidden', marginBottom: '20px' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${progressPercent}%`, 
                    background: 'linear-gradient(90deg, #22c55e, #10b981)', 
                    borderRadius: '100px', 
                    transition: 'width 0.4s ease' 
                  }}></div>
                </div>

                {/* Add Custom Task Form */}
                <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add your own custom daily study goal (e.g. Complete 30 Organic PYQs)..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '10px 18px',
                      background: '#ffffff',
                      color: '#09090b',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={15} />
                    <span>Add Goal</span>
                  </button>
                </form>

                {/* Tasks List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: task.completed ? 'rgba(34, 197, 94, 0.05)' : '#18181b',
                        border: task.completed ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => handleToggleTask(task.id)}
                          style={{ accentColor: '#22c55e', width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: '500',
                          textDecoration: task.completed ? 'line-through' : 'none', 
                          color: task.completed ? '#71717a' : '#e4e4e7' 
                        }}>
                          {task.text}
                        </span>
                      </label>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#71717a',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s ease'
                        }}
                        title="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#71717a', fontSize: '0.88rem' }}>
                      No tasks in your planner yet. Add your daily goals above!
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Access to Notes */}
              <div style={{
                background: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px 28px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <BookOpen size={16} style={{ color: '#22c55e' }} />
                    Quick Access Revision Sheets
                  </h3>
                  <button
                    onClick={() => setActiveTab('notes')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#22c55e',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View Full Library →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeNotes.slice(0, 3).map((file, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} style={{ color: '#22c55e' }} />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#ffffff' }}>{file.name}</div>
                          <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{file.size} • {file.subject || 'All'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(file.name)}
                        disabled={downloadingFile !== null}
                        style={{
                          padding: '6px 14px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Download size={12} />
                        <span>{downloadingFile === file.name ? 'Saving...' : 'Download'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : 

          /* TAB 3: MY PROGRESS BOARD */
          activeTab === 'progress' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Analytics Metric Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                
                {/* Metric 1 */}
                <div style={{
                  background: '#121215',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    DAILY TASK COMPLETION
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#22c55e', fontFamily: 'var(--heading-font)' }}>
                    {progressPercent}%
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginTop: '6px' }}>
                    {completedCount} of {tasks.length} goals checked off today
                  </div>
                </div>

                {/* Metric 2 */}
                <div style={{
                  background: '#121215',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    MOCK TEST ACCURACY
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', fontFamily: 'var(--heading-font)' }}>
                    {avgMockScore}%
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginTop: '6px' }}>
                    Based on {mockScores.length} logged exam tests
                  </div>
                </div>

                {/* Metric 3 */}
                <div style={{
                  background: '#121215',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    WEEKLY STUDY EFFORT
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#60a5fa', fontFamily: 'var(--heading-font)' }}>
                    {totalStudyHours} hrs
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginTop: '6px' }}>
                    Monitored by {mentor.name}
                  </div>
                </div>

              </div>

              {/* Weekly Study Hours Log Bar Chart */}
              <div style={{
                background: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      🕒 Weekly Self-Study Hours Log
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#71717a' }}>
                      Target: 7-9 productive hours daily for target syllabus completion
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '700' }}>
                    Avg: {(totalStudyHours / 7).toFixed(1)} hrs / day
                  </span>
                </div>

                {/* Simulated Modern Dark Bar Chart */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  height: '200px',
                  padding: '20px 24px 10px',
                  background: '#09090b',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  {studyHours.map((d, idx) => {
                    const percentHeight = Math.min(100, Math.max(12, (d.hrs / 12) * 100));
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#a1a1aa', marginBottom: '8px' }}>
                          {d.hrs}h
                        </span>
                        <div style={{
                          width: '36px',
                          maxWidth: '70%',
                          height: `${percentHeight}%`,
                          background: d.hrs >= 8 ? 'linear-gradient(180deg, #22c55e, #15803d)' : 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.2))',
                          borderRadius: '6px 6px 2px 2px',
                          boxShadow: d.hrs >= 8 ? '0 0 12px rgba(34, 197, 94, 0.3)' : 'none',
                          transition: 'height 0.4s ease'
                        }}></div>
                        <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#e4e4e7', marginTop: '10px' }}>
                          {d.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : 

          /* TAB 4: REVISION NOTES */
          activeTab === 'notes' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Filter Header Card */}
              <div style={{
                background: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px 28px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={22} style={{ color: '#a78bfa' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      📑 Topper Handwritten Notes & Cheatsheets
                    </h2>
                    <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
                      Curated subject-wise PDF resources for {BATCH_SUBJECTS_MAP[activeBatch]?.label || 'your batch'}
                    </span>
                  </div>
                </div>

                {/* Subject Filter Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {['All Subjects', ...(BATCH_SUBJECTS_MAP[activeBatch]?.subjects || ['Physics'])].map(subj => {
                    const isSelected = selectedSubjectFilter === subj;
                    return (
                      <button
                        key={subj}
                        onClick={() => setSelectedSubjectFilter(subj)}
                        style={{
                          padding: '7px 16px',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? '800' : '600',
                          borderRadius: '100px',
                          border: isSelected ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? '#09090b' : '#a1a1aa',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PDF Documents List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredNotes.map((file, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#121215',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={20} style={{ color: '#22c55e' }} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>{file.name}</h4>
                          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)', color: '#e4e4e7', fontWeight: '700' }}>
                            {file.subject || 'Core'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                          📄 High-Yield PDF • {file.size}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(file.name)}
                      disabled={downloadingFile !== null}
                      style={{
                        padding: '9px 18px',
                        background: '#ffffff',
                        color: '#09090b',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={14} />
                      <span>{downloadingFile === file.name ? 'Saving...' : 'Download PDF'}</span>
                    </button>
                  </div>
                ))}

                {filteredNotes.length === 0 && (
                  <div style={{ background: '#121215', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', color: '#71717a' }}>
                    <Download size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>No notes found for {selectedSubjectFilter}</h4>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>Your mentor will upload new summary sheets soon!</p>
                  </div>
                )}
              </div>

            </div>
          ) : 

          /* TAB 5: MOCK TEST HISTORY */
          activeTab === 'test' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                background: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      📋 Mock Test & Performance Logs
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#71717a' }}>
                      Verified score tracking reviewed by your batch mentors
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#22c55e' }}>
                    Batch Accuracy: {avgMockScore}%
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mockScores.map(score => (
                    <div 
                      key={score.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>
                          {score.subject}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '3px' }}>
                          Logged: {score.date}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '1.1rem',
                          fontWeight: '900',
                          color: score.score >= 80 ? '#22c55e' : score.score >= 60 ? '#fbbf24' : '#f87171',
                          padding: '4px 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                          {score.score}%
                        </span>
                      </div>
                    </div>
                  ))}

                  {mockScores.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#71717a', fontSize: '0.88rem' }}>
                      No mock scores logged yet. Your mentor will log your weekly test metrics here!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : 

          /* TAB 6: AI DOUBT SOLVER / CHATBOT */
          activeTab === 'chatbot' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {!hasPremiumAccess ? (
                /* Upgrade State for Standard Users */
                <div style={{
                  background: 'linear-gradient(135deg, #121215, #18181b)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '48px 32px',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
                }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Sparkles size={30} style={{ color: '#38bdf8' }} />
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#ffffff', marginBottom: '10px' }}>
                    Unlock 24/7 AI Doubt Solver
                  </h2>
                  <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                    Upgrade your batch subscription to the Premium Tier for just ₹100 and get unlimited 24/7 WhatsApp & Web AI concept solving.
                  </p>
                  <button 
                    onClick={async () => {
                      const resLoad = await loadRazorpayScript();
                      if (!resLoad) {
                        alert("Failed to load Razorpay SDK. Check your connection.");
                        return;
                      }

                      const options = {
                        key: "rzp_live_THckRb4GLCahES",
                        amount: 10000,
                        currency: "INR",
                        name: "RestartClub Education",
                        description: `Upgrade to Premium for ${currentBatchDetails?.name}`,
                        handler: async function (response: any) {
                          try {
                            const verification = await api.verifyPayment({
                              razorpay_order_id: response?.razorpay_order_id || "client_success_order",
                              razorpay_payment_id: response?.razorpay_payment_id || "client_success_payment",
                              razorpay_signature: response?.razorpay_signature || "client_success_signature",
                              email: user.email,
                              batch: activeBatch,
                              tier: 'premium'
                            });
                            if (verification.success) {
                              const users = await api.getUsers();
                              if (users[user.email]) {
                                setUser(users[user.email]);
                                localStorage.setItem('studentSession', JSON.stringify(users[user.email]));
                                alert("🎉 Upgrade successful! You now have full Premium access with AI solver.");
                              }
                            }
                          } catch (err) {
                            console.error("Verification failed", err);
                          }
                        },
                        prefill: {
                          name: user.username,
                          email: user.email,
                        },
                        theme: {
                          color: "#22c55e",
                        },
                      };
                      const rzp1 = new (window as any).Razorpay(options);
                      rzp1.open();
                    }}
                    style={{
                      padding: '14px 32px',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    Pay ₹100 to Upgrade to Premium
                  </button>
                </div>
              ) : (
                /* Active Interactive AI Chat Console */
                <div style={{
                  background: '#121215',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '560px',
                  overflow: 'hidden'
                }}>
                  {/* Console Header */}
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#18181b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={18} style={{ color: '#38bdf8' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff' }}>RestartClub AI Study Assistant</div>
                        <span style={{ fontSize: '0.72rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                          Active & Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {chatMessages.map((msg, idx) => (
                      <div 
                        key={idx}
                        style={{
                          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}
                      >
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          background: msg.role === 'user' ? '#ffffff' : '#18181b',
                          color: msg.role === 'user' ? '#09090b' : '#e4e4e7',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          border: msg.role === 'bot' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
                        }}>
                          {msg.text}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#71717a', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
                          {msg.time}
                        </span>
                      </div>
                    ))}
                    {isChatThinking && (
                      <div style={{ alignSelf: 'flex-start', padding: '10px 16px', borderRadius: '12px', background: '#18181b', color: '#a1a1aa', fontSize: '0.85rem' }}>
                        Thinking...
                      </div>
                    )}
                  </div>

                  {/* Chat Input Bar */}
                  <form onSubmit={handleSendChatMessage} style={{ padding: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#18181b', display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask any JEE/NEET doubt or concept clarification..."
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: '#09090b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isChatThinking}
                      style={{
                        padding: '10px 16px',
                        background: '#22c55e',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              )}

            </div>
          ) : null

        ) : (
          
          /* LOCKED / UNPAID BATCH STATE */
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{
              width: '100%',
              maxWidth: '540px',
              background: '#121215',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              textAlign: 'center',
              padding: '40px 32px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
            }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '4px 14px', 
                borderRadius: '100px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#f87171', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '0.8rem',
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                🔒 Subscription Activation Pending
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#ffffff', marginBottom: '8px' }}>
                Unlock {currentBatchDetails.name}
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '24px' }}>
                {currentBatchDetails.tagline}
              </p>

              {/* Batch Switch Notice */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '24px',
                fontSize: '0.85rem',
                color: '#93c5fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                textAlign: 'left'
              }}>
                <span>💡 Joined another batch? Switch active batch anytime in your profile.</span>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  style={{
                    padding: '6px 12px',
                    background: '#ffffff',
                    color: '#09090b',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Profile 👤
                </button>
              </div>

              {/* Seat Capacity Tracker */}
              <div style={{
                background: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '28px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem', fontWeight: '700' }}>
                  <span style={{ color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} style={{ color: '#22c55e' }} />
                    Seats Filled: {currentBatchDetails.filled}/500
                  </span>
                  <span style={{ color: '#f87171' }}>
                    {500 - currentBatchDetails.filled} Slots Left
                  </span>
                </div>
                <div style={{ height: '8px', background: '#27272a', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(currentBatchDetails.filled / 500) * 100}%`, background: '#22c55e' }}></div>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul style={{ textAlign: 'left', marginBottom: '28px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentBatchDetails.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#d4d4d8' }}>
                    <Check size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Payment CTA Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => { setCheckoutTier('standard'); setShowCheckout(true); }} 
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Unlock Standard Mentorship (₹499 / 6 months)
                </button>
                <button 
                  onClick={() => { setCheckoutTier('premium'); setShowCheckout(true); }} 
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  Unlock Premium with AI Solver (₹599 / 6 months)
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Razorpay Subscription Checkout Modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20000,
          backdropFilter: 'blur(8px)',
          padding: '20px'
        }}>
          <div style={{
            background: '#121215',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '420px',
            padding: '32px 28px',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
              💳 Activate Mentorship Access
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#a1a1aa', marginBottom: '24px', lineHeight: 1.5 }}>
              You are subscribing to <strong style={{ color: '#ffffff' }}>{currentBatchDetails.name}</strong> {checkoutTier === 'premium' ? 'Premium (₹599 for 6 months)' : 'Standard (₹499 for 6 months)'}.
            </p>

            {checkoutError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', marginBottom: '16px' }}>
                {checkoutError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                type="button"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutError('');
                }} 
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#a1a1aa',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleConfirmPayment()}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#22c55e',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
                }}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile & Batch Switcher Modal */}
      {isProfileOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(8px)',
          padding: '20px'
        }}>
          <div style={{
            background: '#121215',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '440px',
            padding: '32px 28px',
            textAlign: 'left',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
              👤 Your Student Profile
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              Change your active batch or update account password
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>FULL NAME</label>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', padding: '10px 14px', background: '#18181b', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {user.username}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', padding: '10px 14px', background: '#18181b', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {user.email}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>ACTIVE BATCH</label>
                <select 
                  value={pendingBatch}
                  onChange={(e) => setPendingBatch(e.target.value)}
                  disabled={isChangingBatch}
                  style={{ 
                    width: '100%',
                    fontSize: '0.9rem', 
                    fontWeight: '700', 
                    color: '#ffffff', 
                    padding: '11px 14px', 
                    background: '#18181b', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: isChangingBatch ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    marginBottom: '10px'
                  }}
                >
                  <option value="10" style={{ background: '#18181b', color: '#ffffff' }}>RestartClub Foundation (Class 10)</option>
                  <option value="11" style={{ background: '#18181b', color: '#ffffff' }}>RestartClub Aarambh (Class 11)</option>
                  <option value="12" style={{ background: '#18181b', color: '#ffffff' }}>RestartClub Sankalp (Class 12)</option>
                  <option value="jee-dropper" style={{ background: '#18181b', color: '#ffffff' }}>RestartClub Dropper JEE</option>
                  <option value="neet-dropper" style={{ background: '#18181b', color: '#ffffff' }}>RestartClub Dropper NEET</option>
                </select>
                
                {pendingBatch !== activeBatch && (
                  <button
                    onClick={handleBatchSubmit}
                    disabled={isChangingBatch}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '10px', 
                      background: '#22c55e', 
                      color: '#ffffff', 
                      border: 'none', 
                      fontWeight: '800', 
                      fontSize: '0.85rem', 
                      cursor: 'pointer' 
                    }}
                  >
                    {isChangingBatch ? 'Saving...' : 'Save & Switch to this Batch'}
                  </button>
                )}
              </div>

              {/* Password update section */}
              <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.1)', paddingTop: '16px', marginTop: '4px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>Update Password</h4>
                
                {profileError && <div style={{ color: '#f87171', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>{profileError}</div>}
                {profileSuccess && <div style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>{profileSuccess}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#71717a', marginBottom: '4px' }}>NEW PASSWORD</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: '#18181b',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#71717a', marginBottom: '4px' }}>CONFIRM PASSWORD</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: '#18181b',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setProfileError('');
                  setProfileSuccess('');
                }} 
                style={{
                  padding: '9px 18px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#a1a1aa',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button 
                onClick={handleChangePassword} 
                style={{
                  padding: '9px 20px',
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#09090b',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
