import React, { useState, useEffect } from 'react';
import { Compass, LogOut, Download, Trash2, Award, Calendar, CheckSquare, Users, Check } from 'lucide-react';
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
      "1-on-1 Dedicated Board Topper Mentor",
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
      "1-on-1 Dedicated IITian / NEET Topper Mentor",
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
      "1-on-1 Dedicated Top-Ranker IITian / NEET Mentor",
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
      "1-on-1 Dedicated IITian Topper Mentor",
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
      "1-on-1 Dedicated NEET Topper Mentor (AIR < 1000)",
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

export default function StudentDashboard({ user: initialUser, onLogout }: StudentDashboardProps) {
  const [user, setUser] = useState(initialUser);
  const [activeBatch, setActiveBatch] = useState<string>(user.batch || '12');
  const [tasks, setTasks] = useState<Task[]>([]);
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

  const [isChangingBatch, setIsChangingBatch] = useState(false);
  const [pendingBatch, setPendingBatch] = useState(activeBatch);

  useEffect(() => {
    setPendingBatch(activeBatch);
  }, [activeBatch]);

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
        key: "rzp_test_TGvs6Ti9j9LKZb",
        amount: order.amount,
        currency: order.currency,
        name: "RestartClub Education",
        description: `Subscription for ${currentBatchDetails.name}`,
        handler: async function (_response: any) {
          try {
            const verification = await api.verifyPayment({
              razorpay_order_id: "client_success_order",
              razorpay_payment_id: "client_success_payment",
              razorpay_signature: "client_success_signature",
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

  const [activeTab, setActiveTab] = useState<'workspace' | 'progress' | 'test' | 'chatbot'>(() => {
    const saved = localStorage.getItem('drona_active_tab');
    return (saved === 'progress' || saved === 'workspace' || saved === 'test' || saved === 'chatbot') ? saved as any : 'workspace';
  });

  useEffect(() => {
    localStorage.setItem('drona_active_tab', activeTab);
  }, [activeTab]);
  const [mockScores, setMockScores] = useState<Array<{ id: string; subject: string; score: number; date: string }>>([]);

  const handleDeleteScore = async (id: string) => {
    const updated = mockScores.filter(s => s.id !== id);
    setMockScores(updated);
    await api.updateScores(user.email, activeBatch, updated);
  };

  const currentBatchDetails = BATCH_DETAILS[activeBatch as keyof typeof BATCH_DETAILS] || BATCH_DETAILS['12'];
  const mentor = MOCK_MENTORS[activeBatch] || { name: "RestartClub Senior Topper", college: "IIT/NEET Topper" };
  const [activeNotes, setActiveNotes] = useState<Array<{ name: string; size: string }>>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const users = await api.getUsers();
        if (users[user.email]) {
          setUser(users[user.email]);
        }
        const initialTasks = await api.getTasks(user.email, activeBatch);
        if (initialTasks && initialTasks.length > 0) {
          setTasks(initialTasks);
        } else {
          const planners = await api.getBatchPlanner(activeBatch);
          const defaultTasks = planners.map((t: string, idx: number) => ({
            id: `task-${idx}-${Date.now()}`,
            text: t,
            completed: false
          }));
          setTasks(defaultTasks);
          if (hasAccess) {
             await api.updateTasks(user.email, activeBatch, defaultTasks);
          }
        }
        
        const initialScores = await api.getScores(user.email, activeBatch);
        setMockScores(initialScores || []);

        const notes = await api.getBatchNotes(activeBatch);
        if (notes && notes.length > 0) {
          setActiveNotes(notes);
        } else {
          setActiveNotes(currentBatchDetails.notes || []);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    
    fetchInitialData();
  }, [user.email, activeBatch, hasAccess]);

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    await api.updateTasks(user.email, activeBatch, newTasks);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
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

      {hasAccess && (
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
            <button 
              onClick={() => setActiveTab('test')}
              className="btn" 
              style={{
                padding: '8px 20px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '700',
                background: activeTab === 'test' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'test' ? '#ffffff' : 'var(--text-primary)',
                boxShadow: 'none',
                transform: 'none',
                cursor: 'pointer'
              }}
            >
              📝 Test
            </button>
            <button 
              onClick={() => setActiveTab('chatbot')}
              className="btn" 
              style={{
                padding: '8px 20px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '700',
                background: activeTab === 'chatbot' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'chatbot' ? '#ffffff' : 'var(--text-primary)',
                boxShadow: 'none',
                transform: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🤖 Chat Bot {!hasPremiumAccess && <span style={{ fontSize: '0.65rem', background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#4b5563' }}>Upgrade</span>}
            </button>
          </div>
        </div>
      )}

      {hasAccess ? (
        activeTab === 'test' || activeTab === 'chatbot' ? (
          <main className="container" style={{ flex: 1, padding: '60px 24px', maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
            <div className="glass-card" style={{ background: '#ffffff', padding: '60px' }}>
              {activeTab === 'chatbot' && !hasPremiumAccess ? (
                <>
                  <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '16px' }}>🌟 Upgrade Your Subscription</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '30px' }}>
                    Unlock the AI Chat Bot feature by upgrading to the Premium Tier for just ₹100!
                  </p>
                  <button 
                    onClick={async () => {
                      const resLoad = await loadRazorpayScript();
                      if (!resLoad) {
                        alert("Failed to load Razorpay SDK. Check your connection.");
                        return;
                      }

                      const options = {
                        key: "rzp_test_TGvs6Ti9j9LKZb",
                        amount: 10000,
                        currency: "INR",
                        name: "RestartClub Education",
                        description: `Upgrade to Premium for ${currentBatchDetails?.name}`,
                        handler: async function (_response: any) {
                          try {
                            const verification = await api.verifyPayment({
                              razorpay_order_id: "client_success_order",
                              razorpay_payment_id: "client_success_payment",
                              razorpay_signature: "client_success_signature",
                              email: user.email,
                              batch: activeBatch,
                              tier: 'premium'
                            });
                            if (verification.success) {
                              const users = await api.getUsers();
                              if (users[user.email]) {
                                setUser(users[user.email]);
                                localStorage.setItem('studentSession', JSON.stringify(users[user.email]));
                                alert("Upgrade successful! You now have Premium access.");
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
                      rzp1.open();
                    }}
                    className="btn btn-accent" 
                    style={{ padding: '12px 32px', fontSize: '1.1rem', cursor: 'pointer' }}
                  >
                    Pay ₹100 to Upgrade
                  </button>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '16px' }}>🚀 Coming Soon</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    We're working hard to bring you the {activeTab === 'test' ? 'Test Engine' : 'AI Chat Bot'}. Stay tuned!
                  </p>
                </>
              )}
            </div>
          </main>
        ) : activeTab === 'workspace' ? (
          <main className="container" style={{ flex: 1, padding: '40px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-card" style={{ background: '#ffffff', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ background: 'var(--bg-primary)', width: '60px', height: '60px', borderRadius: '14px', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={30} style={{ color: 'var(--accent-color)' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: '#111827' }}>Welcome, {user.username}!</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Believe in yourself and your goals. Every study session brings you closer to success!
              </p>
            </div>
          </div>

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

            <div className="progress-bar-track" style={{ height: '8px', marginBottom: '20px' }}>
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, transition: 'width 0.3s ease' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
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
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', background: '#fafafa', border: '2px dashed var(--border-color)', borderRadius: '10px' }}>
                    <CheckSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Mentor will upload it soon</p>
                  </div>
                )}
              </div>

              {/* Day Wise Task Completed Widget */}
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

          <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
              <Calendar size={20} style={{ color: 'var(--accent-color)' }} />
              Revision Study Notes & Cheat Sheets
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeNotes.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', background: '#fafafa', border: '2px dashed var(--border-color)', borderRadius: '12px' }}>
                  <Download size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Mentor will upload it soon</p>
                </div>
              ) : (
                activeNotes.map((file, idx) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </main>
        ) : (
          <main className="container" style={{ flex: 1, padding: '40px 24px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px' }}>
            {/* Left Column: Progress Metrics & Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
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
                    { day: 'Mon', hrs: 0 },
                    { day: 'Tue', hrs: 0 },
                    { day: 'Wed', hrs: 0 },
                    { day: 'Thu', hrs: 0 },
                    { day: 'Fri', hrs: 0 },
                    { day: 'Sat', hrs: 0 },
                    { day: 'Sun', hrs: 0 }
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => { setCheckoutTier('standard'); setShowCheckout(true); }} 
                className="btn btn-secondary w-full"
                style={{ padding: '14px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', background: '#f3f4f6' }}
              >
                Unlock Standard Mentorship (₹499/mo)
              </button>
              <button 
                onClick={() => { setCheckoutTier('premium'); setShowCheckout(true); }} 
                className="btn btn-accent w-full"
                style={{ padding: '14px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer' }}
              >
                Unlock Premium with AI Chat Bot (₹599/mo)
              </button>
            </div>
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
              💳 Subscription Checkout
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              You are subscribing to **{currentBatchDetails.name}** {checkoutTier === 'premium' ? 'Premium (₹599/mo)' : 'Standard (₹499/mo)'}.
            </p>

            {checkoutError && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', marginBottom: '12px' }}>
                {checkoutError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '10px' }}>
              <button 
                type="button"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutError('');
                }} 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleConfirmPayment()}
                className="btn btn-accent" 
                style={{ padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Proceed to Payment
              </button>
            </div>
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
                <select 
                  value={pendingBatch}
                  onChange={(e) => setPendingBatch(e.target.value)}
                  disabled={isChangingBatch}
                  style={{ 
                    width: '100%',
                    fontSize: '0.95rem', 
                    fontWeight: '700', 
                    color: '#111827', 
                    padding: '10px 12px', 
                    background: '#f9fafb', 
                    borderRadius: '8px', 
                    border: '1.5px solid var(--border-color)',
                    cursor: isChangingBatch ? 'not-allowed' : 'pointer',
                    opacity: isChangingBatch ? 0.7 : 1,
                    marginBottom: '10px'
                  }}
                >
                  <option value="10">RestartClub Foundation (Class 10)</option>
                  <option value="11">RestartClub Elite (Class 11)</option>
                  <option value="12">RestartClub Achiever (Class 12)</option>
                  <option value="jee-dropper">JEE Dropper Batch</option>
                  <option value="neet-dropper">NEET Dropper Batch</option>
                </select>
                <button
                  onClick={handleBatchSubmit}
                  disabled={isChangingBatch || pendingBatch === activeBatch}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', opacity: (isChangingBatch || pendingBatch === activeBatch) ? 0.5 : 1 }}
                >
                  {isChangingBatch ? 'Saving...' : 'Save Batch'}
                </button>
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
                Close
              </button>
              <button 
                onClick={handleChangePassword} 
                className="btn btn-accent" 
                style={{ padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
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
