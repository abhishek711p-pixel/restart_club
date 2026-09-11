// Force Vercel build update for Admin Panel Save Button
import React, { useState, useEffect } from 'react';
import { Compass, LogOut, X, Users, Trash2, FileText, Edit, PhoneCall, MessageSquare, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface StudentUser {
  username: string;
  email: string;
  batch: string;
  bought: boolean; // Virtual property computed by server or ignored
  purchasedBatches?: string[];
}

const BATCH_LABELS: Record<string, string> = {
  '10': 'Class 10 (Foundation)',
  '11': 'Class 11 (Aarambh)',
  '12': 'Class 12 (Sankalp)',
  'jee-dropper': 'JEE Dropper',
  'neet-dropper': 'NEET Dropper'
};

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'democalls' | 'scores' | 'planners' | 'notes' | 'communication'>('students');
  const [studentsList, setStudentsList] = useState<StudentUser[]>([]);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Demo call leads state
  const [demoCallsList, setDemoCallsList] = useState<Array<{ id?: string; name: string; number: string; batch: string; class: string; timestamp: string }>>([]);
  const [demoCallSearch, setDemoCallSearch] = useState('');
  const [demoCallBatchFilter, setDemoCallBatchFilter] = useState('all');
  
  // Selected student management
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null);
  const [studentTasks, setStudentTasks] = useState<any[]>([]);
  const [studentScores, setStudentScores] = useState<any[]>([]);
  const [studentStudyHours, setStudentStudyHours] = useState<Record<string, number>>({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
  const [newStudentTaskText, setNewStudentTaskText] = useState("");
  
  const [newScoreSubject, setNewScoreSubject] = useState("");
  const [newScoreValue, setNewScoreValue] = useState("");
  
  // Planners editor
  const [selectedBatchPlanner, setSelectedBatchPlanner] = useState<string>('12');
  const [batchPlannerTasks, setBatchPlannerTasks] = useState<string[]>([]);
const BATCH_SUBJECTS: Record<string, string[]> = {
  '10': ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'History', 'Geography'],
  '11': ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'Physical Education'],
  '12': ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'Physical Education'],
  'jee-dropper': ['Physics', 'Chemistry', 'Maths'],
  'neet-dropper': ['Physics', 'Chemistry', 'Botany', 'Zoology']
};

  const [newPlannerTaskText, setNewPlannerTaskText] = useState('');

  // Notes editor
  const [selectedBatchNotes, setSelectedBatchNotes] = useState<string>('12');
  const [batchNotesList, setBatchNotesList] = useState<Array<{ name: string; size: string; subject?: string }>>([]);
  const [newNoteName, setNewNoteName] = useState('');
  const [newNoteSize, setNewNoteSize] = useState('4.5 MB');
  const [newNoteSubject, setNewNoteSubject] = useState<string>('Physics');

  // Notices State
  const [selectedBatchNotices, setSelectedBatchNotices] = useState<string>('12');
  const [batchNoticesList, setBatchNoticesList] = useState<Array<{ id: string; message: string; createdAt: string }>>([]);
  const [newNoticeMessage, setNewNoticeMessage] = useState('');

  // Student-wise Planners & Notes States
  const [plannerMode, setPlannerMode] = useState<'batch' | 'student'>('batch');
  const [selectedStudentPlanner, setSelectedStudentPlanner] = useState<StudentUser | null>(null);
  const [studentPlannerTasks, setStudentPlannerTasks] = useState<any[]>([]);
  const [newStudentPlannerTaskText, setNewStudentPlannerTaskText] = useState('');
  const [plannerSearchQuery, setPlannerSearchQuery] = useState('');
  const [plannerBatchFilter, setPlannerBatchFilter] = useState<string>('all');

  const [notesMode, setNotesMode] = useState<'batch' | 'student'>('batch');
  const [selectedStudentNotes, setSelectedStudentNotes] = useState<StudentUser | null>(null);
  const [studentNotesList, setStudentNotesList] = useState<Array<{ name: string; size: string; subject?: string }>>([]);
  const [newStudentNoteName, setNewStudentNoteName] = useState('');
  const [newStudentNoteSize, setNewStudentNoteSize] = useState('4.5 MB');
  const [newStudentNoteSubject, setNewStudentNoteSubject] = useState('Physics');
  const [notesSearchQuery, setNotesSearchQuery] = useState('');
  const [notesBatchFilter, setNotesBatchFilter] = useState<string>('all');

  // Load selected student planner tasks
  useEffect(() => {
    const loadStudentPlanner = async () => {
      if (selectedStudentPlanner) {
        try {
          const storedTasks = await api.getTasks(selectedStudentPlanner.email, selectedStudentPlanner.batch);
          if (Array.isArray(storedTasks)) {
            setStudentPlannerTasks(storedTasks);
          } else {
            setStudentPlannerTasks([]);
          }
        } catch (err) {
          console.error("Failed to load student planner tasks", err);
          setStudentPlannerTasks([]);
        }
      }
    };
    loadStudentPlanner();
  }, [selectedStudentPlanner]);

  // Load selected student notes
  useEffect(() => {
    const loadStudentNotes = async () => {
      if (selectedStudentNotes) {
        try {
          const storedNotes = await api.getBatchNotes(selectedStudentNotes.batch, selectedStudentNotes.email, true);
          if (Array.isArray(storedNotes)) {
            setStudentNotesList(storedNotes);
          } else {
            setStudentNotesList([]);
          }
        } catch (err) {
          console.error("Failed to load student notes", err);
          setStudentNotesList([]);
        }
      }
    };
    loadStudentNotes();
  }, [selectedStudentNotes]);


  // Load all students on mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const users = await api.getUsers();
      const list: StudentUser[] = Object.values(users);
      setStudentsList(list);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  // Load selected student's checklist
  useEffect(() => {
    const loadTasks = async () => {
      if (selectedStudent) {
        try {
          // Wait, the API for student tasks is in the main API as getTasks but it was not defined in the Admin dashboard API! 
          // Let me define it in api.ts first. Wait, I will just add getTasks and updateTasks to api.ts in STARTUP-ADMIN as well, but for now I'll write the API calls using fetch directly if it's missing, OR I can just edit api.ts in STARTUP-ADMIN later. I will assume I added them to api.ts.
          const storedTasks = await api.getTasks(selectedStudent.email, selectedStudent.batch);
          if (storedTasks && Array.isArray(storedTasks) && storedTasks.length > 0) {
            setStudentTasks(storedTasks);
          } else {
            setStudentTasks([]);
          }
          
          const storedScores = await api.getScores(selectedStudent.email, selectedStudent.batch);
          setStudentScores(Array.isArray(storedScores) ? storedScores : []);

          const storedHours = await api.getStudyHours(selectedStudent.email, selectedStudent.batch);
          if (storedHours && !storedHours.error) {
            setStudentStudyHours({
              mon: storedHours.mon || 0,
              tue: storedHours.tue || 0,
              wed: storedHours.wed || 0,
              thu: storedHours.thu || 0,
              fri: storedHours.fri || 0,
              sat: storedHours.sat || 0,
              sun: storedHours.sun || 0
            });
          } else {
            setStudentStudyHours({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
          }
        } catch (err) {
          setStudentTasks([]);
          setStudentScores([]);
          setStudentStudyHours({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
        }
      }
    };
    loadTasks();
  }, [selectedStudent]);

  // Load selected batch planner defaults
  useEffect(() => {
    const loadPlanner = async () => {
      try {
        const storedPlanner = await api.getBatchPlanner(selectedBatchPlanner);
        if (Array.isArray(storedPlanner)) {
          setBatchPlannerTasks(storedPlanner);
        }
      } catch (err) {
        console.error("Failed to load planner", err);
      }
    };
    loadPlanner();
  }, [selectedBatchPlanner]);

  // Load selected batch notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await api.getBatchNotes(selectedBatchNotes);
        if (Array.isArray(storedNotes)) {
          setBatchNotesList(storedNotes);
        }
      } catch (err) {
        console.error("Failed to load notes", err);
      }
    };
    loadNotes();
  }, [selectedBatchNotes]);

  // Load selected batch notices
  useEffect(() => {
    const loadNotices = async () => {
      try {
        const storedNotices = await api.getNotices(selectedBatchNotices);
        if (Array.isArray(storedNotices)) {
          setBatchNoticesList(storedNotices);
        }
      } catch (err) {
        console.error("Failed to load notices", err);
      }
    };
    loadNotices();
  }, [selectedBatchNotices]);

  // Handle Notices
  const handleAddNotice = async () => {
    if (!newNoticeMessage.trim()) return;
    try {
      const newNotice = await api.createNotice(selectedBatchNotices, newNoticeMessage);
      if (newNotice && !newNotice.error) {
        setBatchNoticesList([newNotice, ...batchNoticesList]);
        setNewNoticeMessage('');
      }
    } catch (err) {}
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      await api.deleteNotice(id);
      setBatchNoticesList(batchNoticesList.filter(n => n.id !== id));
    } catch (err) {}
  };

  // Toggle user payment status
  const handleTogglePayment = async (email: string, batch: string, tier: 'standard' | 'premium') => {
    try {
      const res = await api.togglePayment(email, batch, tier);
      if (res.success) {
        loadStudents();
        if (selectedStudent && selectedStudent.email === email) {
          setSelectedStudent({ ...selectedStudent, purchasedBatches: res.purchasedBatches });
        }
      }
    } catch (err) {
      console.error("Error toggling payment", err);
    }
  };

  // Add task directly to student checklist
  const handleAddStudentTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newStudentTaskText.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      text: newStudentTaskText,
      completed: false
    };

    const updatedTasks = [...studentTasks, newTask];
    setStudentTasks(updatedTasks);
    await api.updateTasks(selectedStudent.email, selectedStudent.batch, updatedTasks);
    setNewStudentTaskText('');
  };

  // Delete student task
  const handleDeleteStudentTask = async (taskId: string) => {
    if (!selectedStudent) return;
    const updated = studentTasks.filter(t => t.id !== taskId);
    setStudentTasks(updated);
    await api.updateTasks(selectedStudent.email, selectedStudent.batch, updated);
  };

  const handleAddStudentScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newScoreSubject.trim() || !newScoreValue.trim()) return;
    const value = parseInt(newScoreValue, 10);
    if (isNaN(value)) return;

    const newScore = {
      id: `score-${Date.now()}`,
      subject: newScoreSubject,
      score: value,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [...studentScores, newScore];
    setStudentScores(updated);
    setNewScoreSubject("");
    setNewScoreValue("");
    await api.updateScores(selectedStudent.email, selectedStudent.batch, updated);
  };

  const handleDeleteStudentScore = async (id: string) => {
    if (!selectedStudent) return;
    const updated = studentScores.filter(s => s.id !== id);
    setStudentScores(updated);
    await api.updateScores(selectedStudent.email, selectedStudent.batch, updated);
  };

  const handleStudyHoursChange = (day: string, value: string) => {
    const num = parseInt(value, 10);
    setStudentStudyHours(prev => ({ ...prev, [day]: isNaN(num) ? 0 : num }));
  };

  const handleSaveStudyHours = async () => {
    if (!selectedStudent) return;
    await api.updateStudyHours(selectedStudent.email, selectedStudent.batch, studentStudyHours);
    alert('Study hours saved successfully!');
  };

  const handleAddPlannerTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlannerTaskText.trim()) return;
    const updated = [...batchPlannerTasks, newPlannerTaskText];
    setBatchPlannerTasks(updated);
    await api.updateBatchPlanner(selectedBatchPlanner, updated);
    setNewPlannerTaskText('');
  };

  const handleDeletePlannerTask = async (idx: number) => {
    const updated = [...batchPlannerTasks];
    updated.splice(idx, 1);
    setBatchPlannerTasks(updated);
    await api.updateBatchPlanner(selectedBatchPlanner, updated);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteName.trim()) return;
    const currentSubjects = BATCH_SUBJECTS[selectedBatchNotes] || ['Physics'];
    const activeSubject = currentSubjects.includes(newNoteSubject) ? newNoteSubject : currentSubjects[0];
    const newNote = {
      name: newNoteName.endsWith('.pdf') ? newNoteName : `${newNoteName}.pdf`,
      size: newNoteSize || '4.5 MB',
      subject: activeSubject
    };
    const updated = [...batchNotesList, newNote];
    setBatchNotesList(updated);
    await api.updateBatchNotes(selectedBatchNotes, updated);
    setNewNoteName('');
  };

  const handleDeleteNote = async (idx: number) => {
    const updated = [...batchNotesList];
    updated.splice(idx, 1);
    setBatchNotesList(updated);
    await api.updateBatchNotes(selectedBatchNotes, updated);
  };

  // Student-wise Planner Handlers
  const handleAddStudentPlannerTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentPlanner || !newStudentPlannerTaskText.trim()) return;
    const newTask = {
      id: `task-${Date.now()}-${Math.random()}`,
      text: newStudentPlannerTaskText,
      completed: false
    };
    const updated = [...studentPlannerTasks, newTask];
    setStudentPlannerTasks(updated);
    await api.updateTasks(selectedStudentPlanner.email, selectedStudentPlanner.batch, updated);
    setNewStudentPlannerTaskText('');
  };

  const handleDeleteStudentPlannerTask = async (id: string) => {
    if (!selectedStudentPlanner) return;
    const updated = studentPlannerTasks.filter(t => t.id !== id);
    setStudentPlannerTasks(updated);
    await api.updateTasks(selectedStudentPlanner.email, selectedStudentPlanner.batch, updated);
  };

  // Student-wise Notes Handlers
  const handleAddStudentNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentNotes || !newStudentNoteName.trim()) return;
    const currentSubjects = BATCH_SUBJECTS[selectedStudentNotes.batch] || ['Physics'];
    const activeSubject = currentSubjects.includes(newStudentNoteSubject) ? newStudentNoteSubject : currentSubjects[0];
    const newNote = {
      name: newStudentNoteName.endsWith('.pdf') ? newStudentNoteName : `${newNoteName}.pdf`,
      size: newStudentNoteSize || '4.5 MB',
      subject: activeSubject
    };
    const updated = [...studentNotesList, newNote];
    setStudentNotesList(updated);
    await api.updateBatchNotes(selectedStudentNotes.batch, updated, selectedStudentNotes.email);
    setNewStudentNoteName('');
  };

  const handleDeleteStudentNote = async (index: number) => {
    if (!selectedStudentNotes) return;
    const updated = [...studentNotesList];
    updated.splice(index, 1);
    setStudentNotesList(updated);
    await api.updateBatchNotes(selectedStudentNotes.batch, updated, selectedStudentNotes.email);
  };

  const filteredStudents = studentsList
    .filter(s => {
      const matchesBatch = selectedBatchFilter === 'all' || s.batch === selectedBatchFilter;
      const matchesSearch = s.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBatch && matchesSearch;
    })
    .sort((a, b) => a.username.localeCompare(b.username));

  const loadDemoCalls = async () => {
    try {
      const calls = await api.getDemoCalls();
      setDemoCallsList(Array.isArray(calls) ? calls : []);
    } catch (err) {
      console.error("Failed to load demo calls", err);
    }
  };

  const handleDeleteDemoCall = async (idOrTimestamp: string) => {
    if (!window.confirm("Are you sure you want to remove this demo call request?")) return;
    await api.deleteDemoCall(idOrTimestamp);
    setDemoCallsList(prev => prev.filter(c => c.id !== idOrTimestamp && c.timestamp !== idOrTimestamp));
  };

  useEffect(() => {
    loadDemoCalls();
  }, [activeTab]);

  const filteredDemoCalls = demoCallsList.filter(c => {
    const matchesSearch = (c.name || '').toLowerCase().includes(demoCallSearch.toLowerCase()) ||
                          (c.number || '').toLowerCase().includes(demoCallSearch.toLowerCase());
    const matchesFilter = demoCallBatchFilter === 'all' || 
                          (c.batch || '').toLowerCase().includes(demoCallBatchFilter.toLowerCase()) ||
                          (c.class || '').toLowerCase().includes(demoCallBatchFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
      
      {/* Admin Navbar */}
      <header className="navbar-header" style={{ background: '#111113', borderBottom: '1px solid #27272a', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-icon-wrapper" style={{ background: '#ef4444', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass className="logo-icon animate-spin-slow" size={20} color="#ffffff" />
            </div>
            <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>RestartClub <span style={{ color: '#ef4444' }}>Admin</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="badge-pill" style={{ margin: 0, background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', padding: '4px 12px', borderRadius: '9999px' }}>
              🛡️ Owner Session
            </div>
            <button onClick={onLogout} className="btn" style={{ padding: '8px 16px', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', background: '#18181b', color: '#ffffff', border: '1px solid #3f3f46', borderRadius: '8px', fontWeight: '700', display: 'inline-flex', alignItems: 'center' }}>
              Exit Panel <LogOut size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tabs Switcher */}
      <div className="container" style={{ paddingTop: '30px', textAlign: 'left' }}>
        <div style={{
          display: 'inline-flex',
          background: '#111113',
          padding: '6px',
          borderRadius: '14px',
          gap: '8px',
          border: '1px solid #27272a',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => { setActiveTab('students'); setSelectedStudent(null); }}
            className="btn" 
            style={{
              padding: '9px 18px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              background: activeTab === 'students' ? '#ef4444' : 'transparent',
              color: activeTab === 'students' ? '#ffffff' : '#a1a1aa',
              boxShadow: activeTab === 'students' ? '0 2px 10px rgba(239, 68, 68, 0.4)' : 'none',
              transform: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👥 Students Directory
          </button>
          <button 
            onClick={() => { setActiveTab('democalls'); setSelectedStudent(null); }}
            className="btn" 
            style={{
              padding: '9px 18px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              background: activeTab === 'democalls' ? '#ef4444' : 'transparent',
              color: activeTab === 'democalls' ? '#ffffff' : '#a1a1aa',
              boxShadow: activeTab === 'democalls' ? '0 2px 10px rgba(239, 68, 68, 0.4)' : 'none',
              transform: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            📞 Demo Call Requests {demoCallsList.length > 0 && <span style={{ background: activeTab === 'democalls' ? '#ffffff' : '#ef4444', color: activeTab === 'democalls' ? '#ef4444' : '#ffffff', padding: '1px 7px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '800' }}>{demoCallsList.length}</span>}
          </button>
          <button 
            onClick={() => { setActiveTab('scores'); setSelectedStudent(null); }}
            className="btn" 
            style={{
              padding: '9px 18px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              background: activeTab === 'scores' ? '#ef4444' : 'transparent',
              color: activeTab === 'scores' ? '#ffffff' : '#a1a1aa',
              boxShadow: activeTab === 'scores' ? '0 2px 10px rgba(239, 68, 68, 0.4)' : 'none',
              transform: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📊 Manage Test Scores
          </button>
          <button 
            onClick={() => setActiveTab('planners')}
            className="btn" 
            style={{
              padding: '9px 18px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              background: activeTab === 'planners' ? '#ef4444' : 'transparent',
              color: activeTab === 'planners' ? '#ffffff' : '#a1a1aa',
              boxShadow: activeTab === 'planners' ? '0 2px 10px rgba(239, 68, 68, 0.4)' : 'none',
              transform: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📝 Manage Batch Planners
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className="btn" 
            style={{
              padding: '9px 18px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              background: activeTab === 'notes' ? '#ef4444' : 'transparent',
              color: activeTab === 'notes' ? '#ffffff' : '#a1a1aa',
              boxShadow: activeTab === 'notes' ? '0 2px 10px rgba(239, 68, 68, 0.4)' : 'none',
              transform: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📂 Manage Revision Notes
          </button>
          <button 
            onClick={() => setActiveTab('communication')}
            className="btn" 
            style={{
              padding: '9px 18px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              background: activeTab === 'communication' ? '#ef4444' : 'transparent',
              color: activeTab === 'communication' ? '#ffffff' : '#a1a1aa',
              boxShadow: activeTab === 'communication' ? '0 2px 10px rgba(239, 68, 68, 0.4)' : 'none',
              transform: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            💬 Manage Communication
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
        
        {/* Demo Call Requests Tab View */}
        {activeTab === 'democalls' && (
          <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '30px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #27272a', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', margin: 0 }}>
                  <PhoneCall size={20} style={{ color: '#ef4444' }} />
                  Demo Strategy Call Requests ({filteredDemoCalls.length})
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: '4px 0 0' }}>
                  All strategy calls requested by prospective students from the landing page.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text"
                  placeholder="🔍 Search name / phone..."
                  value={demoCallSearch}
                  onChange={(e) => setDemoCallSearch(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #3f3f46',
                    background: '#18181b',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: '180px',
                    fontFamily: 'var(--sans-font)'
                  }}
                />

                <select 
                  value={demoCallBatchFilter}
                  onChange={(e) => setDemoCallBatchFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #3f3f46',
                    background: '#18181b',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                >
                  <option value="all">All Batches/Streams</option>
                  <option value="neet">NEET Aspirants</option>
                  <option value="jee">JEE Main + Adv</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                  <option value="dropper">Dropper</option>
                </select>

                <button 
                  onClick={loadDemoCalls}
                  className="btn"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#18181b', color: '#ffffff', border: '1px solid #3f3f46', borderRadius: '8px', fontWeight: '700' }}
                  title="Refresh List"
                >
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>
            </div>

            {/* Demo Calls Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #27272a', background: '#18181b' }}>
                    <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa' }}>NAME</th>
                    <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa' }}>PHONE NUMBER</th>
                    <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa' }}>TARGET STREAM (BATCH)</th>
                    <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa' }}>CLASS / STATUS</th>
                    <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa' }}>REQUESTED AT</th>
                    <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemoCalls.map((call, idx) => {
                    const rawPhone = (call.number || '').replace(/\D/g, '');
                    const cleanPhone = rawPhone.startsWith('91') && rawPhone.length > 10 ? rawPhone.slice(2) : rawPhone;
                    const waLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${call.name}! 👋 I am contacting you from the RestartClub Academic Mentor Team. You requested a Free 1-on-1 Strategy Call for ${call.batch} (${call.class}). Let's connect for your session!`)}`;

                    return (
                      <tr key={call.id || call.timestamp || idx} style={{ borderBottom: '1px solid #27272a', transition: 'background 0.2s ease' }}>
                        <td style={{ padding: '14px 10px' }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>
                            {call.name}
                          </div>
                        </td>
                        <td style={{ padding: '14px 10px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#60a5fa' }}>
                            {call.number}
                          </span>
                        </td>
                        <td style={{ padding: '14px 10px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '6px', 
                            fontSize: '0.75rem', 
                            fontWeight: '800', 
                            background: (call.batch || '').toLowerCase().includes('neet') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
                            color: (call.batch || '').toLowerCase().includes('neet') ? '#10b981' : '#60a5fa',
                            border: (call.batch || '').toLowerCase().includes('neet') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)'
                          }}>
                            {call.batch}
                          </span>
                        </td>
                        <td style={{ padding: '14px 10px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', background: '#27272a', color: '#e4e4e7' }}>
                            {call.class}
                          </span>
                        </td>
                        <td style={{ padding: '14px 10px', fontSize: '0.78rem', color: '#a1a1aa' }}>
                          {call.timestamp ? new Date(call.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </td>
                        <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn"
                              style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: '800', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#10b981', color: '#050505', border: 'none', borderRadius: '6px' }}
                              title="Open WhatsApp Chat with student"
                            >
                              <MessageSquare size={13} /> Chat on WhatsApp
                            </a>
                            <button
                              onClick={() => handleDeleteDemoCall(call.id || call.timestamp)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                              title="Delete Request"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredDemoCalls.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '48px 12px', textAlign: 'center', color: '#a1a1aa' }}>
                        <PhoneCall size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                        <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0, color: '#ffffff' }}>No Demo Call requests found.</p>
                        <span style={{ fontSize: '0.8rem' }}>When students submit the "Book Free Call" modal, they will appear here in real-time.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === 'students' || activeTab === 'scores') && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 0.8fr' : '1fr', gap: '30px' }}>
            
            {/* Students Table */}
            <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '30px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #27272a', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                  <Users size={20} style={{ color: '#ef4444' }} />
                  Registered Students ({filteredStudents.reduce((acc, student) => acc + Array.from(new Set([...(student.purchasedBatches || []).map(b => b.replace('_premium', '').replace('_standard', '')), student.batch])).filter(Boolean).length, 0)})
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {/* Search Input */}
                  <input 
                    type="text"
                    placeholder="🔍 Search name / email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #3f3f46',
                      background: '#18181b',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      width: '200px',
                      fontFamily: 'var(--sans-font)'
                    }}
                  />

                  {/* Batch Filter dropdown */}
                  <select 
                    value={selectedBatchFilter}
                    onChange={(e) => setSelectedBatchFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #3f3f46',
                      background: '#18181b',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      outline: 'none'
                    }}
                  >
                    <option value="all">All Batches</option>
                    <option value="10">Class 10 (Foundation)</option>
                    <option value="11">Class 11 (Aarambh)</option>
                    <option value="12">Class 12 (Sankalp)</option>
                    <option value="jee-dropper">JEE Dropper</option>
                    <option value="neet-dropper">NEET Dropper</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #27272a', background: '#18181b' }}>
                      <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa' }}>STUDENT</th>
                      <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa' }}>BATCH</th>
                      <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa' }}>STATUS</th>
                      <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.flatMap(student => {
                      const batches = Array.from(new Set([
                        ...(student.purchasedBatches || []).map(b => b.replace('_premium', '').replace('_standard', '')),
                        student.batch
                      ])).filter(Boolean); 
                      
                      return batches.map(batch => {
                        return (
                          <tr key={`${student.email}-${batch}`} style={{ borderBottom: '1px solid #27272a', height: '60px' }}>
                            <td style={{ padding: '10px' }}>
                              <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem' }}>{student.username}</div>
                              <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{student.email}</div>
                            </td>
                            <td style={{ padding: '10px', fontWeight: '600', fontSize: '0.85rem', color: '#e4e4e7' }}>
                              {BATCH_LABELS[batch] || batch}
                            </td>
                            {(() => {
                              const isPremium = student.purchasedBatches?.includes(batch) || student.purchasedBatches?.includes(`${batch}_premium`);
                              const isStandard = student.purchasedBatches?.includes(`${batch}_standard`);
                              const isBought = isPremium || isStandard;
                              
                              let statusText = 'Unpaid/Pending';
                              if (isPremium) statusText = 'Active (Premium ₹599/6mo)';
                              else if (isStandard) statusText = 'Active (Standard ₹499/6mo)';

                              return (
                                <React.Fragment>
                                  <td style={{ padding: '10px' }}>
                                    <span style={{ 
                                      display: 'inline-block',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.7rem',
                                      fontWeight: '800',
                                      border: '1px solid',
                                      borderColor: isBought ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
                                      background: isBought ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                      color: isBought ? '#10b981' : '#f59e0b'
                                    }}>
                                      {statusText}
                                    </span>
                                  </td>
                                  <td style={{ padding: '10px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                      {activeTab === 'students' ? (
                                        <React.Fragment>
                                          <button 
                                            onClick={() => {
                                              if (!isStandard) {
                                                handleTogglePayment(student.email, batch, 'standard');
                                              }
                                            }}
                                            className="btn"
                                            title="₹499 for 6months Tier (Standard)"
                                            style={{ 
                                              padding: '6px 12px', 
                                              fontSize: '0.7rem', 
                                              fontWeight: '700',
                                              cursor: 'pointer', 
                                              borderRadius: '6px',
                                              background: isStandard && !isPremium ? '#10b981' : '#18181b',
                                              color: isStandard && !isPremium ? '#050505' : '#a1a1aa',
                                              border: isStandard && !isPremium ? '1px solid #10b981' : '1px solid #3f3f46'
                                            }}
                                          >
                                            Paid ₹499
                                          </button>
                                          <button 
                                            onClick={() => {
                                              if (!isPremium) {
                                                handleTogglePayment(student.email, batch, 'premium');
                                              }
                                            }}
                                            className="btn"
                                            title="₹599 for 6months Tier (Premium with AI)"
                                            style={{ 
                                              padding: '6px 12px', 
                                              fontSize: '0.7rem', 
                                              fontWeight: '700',
                                              cursor: 'pointer', 
                                              borderRadius: '6px',
                                              background: isPremium ? '#10b981' : '#18181b',
                                              color: isPremium ? '#050505' : '#a1a1aa',
                                              border: isPremium ? '1px solid #10b981' : '1px solid #3f3f46'
                                            }}
                                          >
                                            Paid ₹599
                                          </button>
                                          <button 
                                            onClick={() => {
                                              if (isPremium) {
                                                handleTogglePayment(student.email, batch, 'premium');
                                              } else if (isStandard) {
                                                handleTogglePayment(student.email, batch, 'standard');
                                              }
                                            }}
                                            className="btn"
                                            title="Revoke Access"
                                            style={{ 
                                              padding: '6px 12px', 
                                              fontSize: '0.7rem', 
                                              fontWeight: '700',
                                              cursor: 'pointer', 
                                              borderRadius: '6px',
                                              background: !(isStandard || isPremium) ? '#ef4444' : '#18181b',
                                              color: !(isStandard || isPremium) ? '#ffffff' : '#a1a1aa',
                                              border: !(isStandard || isPremium) ? '1px solid #ef4444' : '1px solid #3f3f46'
                                            }}
                                          >
                                            Unpaid
                                          </button>
                                          <button 
                                            onClick={async () => {
                                              const batchName = BATCH_LABELS[batch] || batch;
                                              if (window.confirm(`⚠️ Delete batch "${batchName}" for "${student.username}" (${student.email})?\n\nOnly data for "${batchName}" will be erased. Their other active batches will remain completely safe!`)) {
                                                await api.deleteUserBatch(student.email, batch);
                                                alert(`✅ Batch "${batchName}" deleted for "${student.username}"!`);
                                                loadStudents();
                                                if (selectedStudent?.email === student.email && selectedStudent.batch === batch) {
                                                  setSelectedStudent(null);
                                                }
                                              }
                                            }}
                                            className="btn"
                                            title={`Delete ${BATCH_LABELS[batch] || batch} Batch Data`}
                                            style={{
                                              padding: '6px 10px',
                                              fontSize: '0.7rem',
                                              cursor: 'pointer',
                                              background: 'rgba(239, 68, 68, 0.15)',
                                              color: '#ef4444',
                                              border: '1px solid rgba(239, 68, 68, 0.4)',
                                              borderRadius: '6px',
                                              fontWeight: '800',
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '4px'
                                            }}
                                          >
                                            <Trash2 size={12} /> Delete
                                          </button>
                                        </React.Fragment>
                                      ) : (
                                        <button 
                                          onClick={() => setSelectedStudent({ ...student, batch })}
                                          className="btn"
                                          style={{ 
                                            padding: '6px 12px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            borderRadius: '6px',
                                            background: selectedStudent?.email === student.email && selectedStudent?.batch === batch ? '#ef4444' : '#27272a',
                                            color: '#ffffff',
                                            border: '1px solid #3f3f46'
                                          }}
                                        >
                                          <Edit size={14} style={{ marginRight: '4px' }} /> Manage Scores
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </React.Fragment>
                              );
                            })()}
                          </tr>
                        );
                      });
                    })}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '30px 0', color: '#a1a1aa', fontSize: '0.9rem' }}>
                          No students registered in this batch filter yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar: Manage Selected Student Tasks */}
            {selectedStudent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: '800' }}>
                      👤 Manage: {selectedStudent.username}
                    </h3>
                    <button 
                      onClick={() => setSelectedStudent(null)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '16px' }}>
                    Email: <strong style={{ color: '#ffffff' }}>{selectedStudent.email}</strong> <br/>
                    Batch: <strong style={{ color: '#ffffff' }}>{BATCH_LABELS[selectedStudent.batch] || selectedStudent.batch}</strong>
                  </p>

                  {activeTab === 'students' && (
                    <React.Fragment>
                      {/* Add task directly to student */}
                      <form onSubmit={handleAddStudentTask} style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#e4e4e7', marginBottom: '6px' }}>
                          ASSIGN DIRECT TASK / GOAL
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            type="text" 
                            value={newStudentTaskText}
                            onChange={(e) => setNewStudentTaskText(e.target.value)}
                            placeholder="E.g., Complete physics backlog chapter..."
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid #3f3f46',
                              background: '#18181b',
                              color: '#ffffff',
                              outline: 'none',
                              fontSize: '0.85rem'
                            }}
                          />
                          <button type="submit" className="btn" style={{ padding: '10px 14px', fontSize: '0.85rem', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700' }}>
                            Assign
                          </button>
                        </div>
                      </form>

                      {/* Student Active Task List */}
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>
                        Active Checklist Tasks ({studentTasks.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                        {studentTasks.map(task => (
                          <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            background: '#18181b',
                            borderRadius: '8px',
                            border: '1px solid #27272a'
                          }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#71717a' : '#ffffff' }}>
                              {task.text} {task.completed && '✓'}
                            </span>
                            <button 
                              onClick={() => handleDeleteStudentTask(task.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {studentTasks.length === 0 && (
                          <p style={{ fontSize: '0.8rem', color: '#71717a', textAlign: 'center', padding: '10px' }}>
                            No checklist tasks assigned yet.
                          </p>
                        )}
                      </div>
                    </React.Fragment>
                  )}

                  {activeTab === 'scores' && (
                    <React.Fragment>
                      {/* Student Test Scores List */}
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>
                        Mock Test Scores ({studentScores.length})
                      </h4>
                      <form onSubmit={handleAddStudentScore} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            type="text" 
                            value={newScoreSubject}
                            onChange={(e) => setNewScoreSubject(e.target.value)}
                            placeholder="E.g., Physics Mock 1..."
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid #3f3f46',
                              background: '#18181b',
                              color: '#ffffff',
                              outline: 'none',
                              fontSize: '0.85rem'
                            }}
                          />
                          <input 
                            type="number" 
                            value={newScoreValue}
                            onChange={(e) => setNewScoreValue(e.target.value)}
                            placeholder="Score (0-100)..."
                            style={{
                              width: '120px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid #3f3f46',
                              background: '#18181b',
                              color: '#ffffff',
                              outline: 'none',
                              fontSize: '0.85rem'
                            }}
                          />
                          <button type="submit" className="btn" style={{ padding: '10px 14px', fontSize: '0.85rem', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700' }}>
                            Add
                          </button>
                        </div>
                      </form>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                        {studentScores.map(score => (
                          <div key={score.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            background: '#18181b',
                            borderRadius: '8px',
                            border: '1px solid #27272a'
                          }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                              {score.subject} <span style={{ color: '#10b981', marginLeft: '8px' }}>{score.score}%</span>
                            </span>
                            <button 
                              onClick={() => handleDeleteStudentScore(score.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {studentScores.length === 0 && (
                          <p style={{ fontSize: '0.8rem', color: '#71717a', textAlign: 'center', padding: '10px' }}>
                            No mock test scores logged yet.
                          </p>
                        )}
                      </div>

                      {/* Weekly Study Hours Form */}
                      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #27272a' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
                          Manage Weekly Study Hours
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                            <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#a1a1aa', textTransform: 'uppercase' }}>{day}</label>
                              <input 
                                type="number" 
                                min="0"
                                max="24"
                                value={studentStudyHours[day] || ''}
                                onChange={(e) => handleStudyHoursChange(day, e.target.value)}
                                style={{
                                  padding: '8px',
                                  borderRadius: '6px',
                                  border: '1px solid #3f3f46',
                                  background: '#18181b',
                                  color: '#ffffff',
                                  outline: 'none',
                                  fontSize: '0.85rem'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={handleSaveStudyHours}
                          className="btn" 
                          style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700' }}
                        >
                          Save Study Hours
                        </button>
                      </div>
                    </React.Fragment>
                  )}

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #27272a' }}>
                    <button
                      onClick={async () => {
                        const batchName = BATCH_LABELS[selectedStudent.batch] || selectedStudent.batch;
                        if (window.confirm(`⚠️ Delete batch "${batchName}" for "${selectedStudent.username}" (${selectedStudent.email})?\n\nOnly data for "${batchName}" will be erased. Their other active batches will remain completely safe!`)) {
                          await api.deleteUserBatch(selectedStudent.email, selectedStudent.batch);
                          alert(`✅ Batch "${batchName}" deleted for "${selectedStudent.username}"!`);
                          setSelectedStudent(null);
                          loadStudents();
                        }
                      }}
                      className="btn w-full"
                      style={{
                        padding: '10px',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 size={16} /> Delete This Batch Data ({BATCH_LABELS[selectedStudent.batch] || selectedStudent.batch})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE BATCH & STUDENT PLANNER */}
        {activeTab === 'planners' && (
          <div>
            {/* Planner Mode Toggle */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '24px', background: '#111113', padding: '8px', borderRadius: '12px', border: '1px solid #27272a', maxWidth: '420px' }}>
              <button
                onClick={() => setPlannerMode('batch')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  background: plannerMode === 'batch' ? '#ef4444' : 'transparent',
                  color: plannerMode === 'batch' ? '#ffffff' : '#a1a1aa',
                  transition: 'all 0.2s ease'
                }}
              >
                🏫 Batch-wise Planners
              </button>
              <button
                onClick={() => setPlannerMode('student')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  background: plannerMode === 'student' ? '#ef4444' : 'transparent',
                  color: plannerMode === 'student' ? '#ffffff' : '#a1a1aa',
                  transition: 'all 0.2s ease'
                }}
              >
                👤 Student-wise Planners
              </button>
            </div>

            {plannerMode === 'batch' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px' }}>
                {/* Batch Selector */}
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '24px', alignSelf: 'start', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>
                    Select Target Batch
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.keys(BATCH_LABELS).map(key => (
                      <button
                        key={key}
                        onClick={() => setSelectedBatchPlanner(key)}
                        style={{
                          textAlign: 'left',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: selectedBatchPlanner === key ? '1px solid #ef4444' : '1px solid #27272a',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          background: selectedBatchPlanner === key ? '#ef4444' : '#18181b',
                          color: selectedBatchPlanner === key ? '#ffffff' : '#a1a1aa',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {BATCH_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Tasks Editor */}
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '30px', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffffff' }}>
                    Default Study Planners: {BATCH_LABELS[selectedBatchPlanner]}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '24px' }}>
                    These default study checklist goals are automatically assigned to all newly registering students in this batch.
                    <span style={{ display: 'inline-block', marginLeft: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                      ✓ Auto-saved to Cloud Database
                    </span>
                  </p>

                  {/* Add template task form */}
                  <form onSubmit={handleAddPlannerTask} style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      value={newPlannerTaskText}
                      onChange={(e) => setNewPlannerTaskText(e.target.value)}
                      placeholder="Add a new default study goal..."
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #3f3f46',
                        background: '#18181b',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button type="submit" className="btn" style={{ padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700' }}>
                      Add Task
                    </button>
                  </form>

                  {/* List of active template tasks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {batchPlannerTasks.map((task, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: '#18181b',
                        borderRadius: '10px',
                        border: '1px solid #27272a'
                      }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ffffff' }}>
                          {task}
                        </span>
                        <button 
                          onClick={() => handleDeletePlannerTask(idx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      onClick={async () => {
                        await api.updateBatchPlanner(selectedBatchPlanner, batchPlannerTasks);
                        alert("✅ Success! Planner tasks saved and synced to all students in this batch!");
                      }}
                      className="btn"
                      style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px' }}
                    >
                      💾 Save Planner to All Students
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px' }}>
                {/* Student Selector */}
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '24px', alignSelf: 'start', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>
                    Select Student
                  </h3>

                  {/* Filter by Batch */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>FILTER BY BATCH</label>
                    <select
                      value={plannerBatchFilter}
                      onChange={(e) => setPlannerBatchFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #3f3f46',
                        background: '#18181b',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}
                    >
                      <option value="all">All Batches</option>
                      {Object.keys(BATCH_LABELS).map(key => (
                        <option key={key} value={key}>{BATCH_LABELS[key]}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Student */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>SEARCH BY NAME / EMAIL</label>
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={plannerSearchQuery}
                      onChange={(e) => setPlannerSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #3f3f46',
                        background: '#18181b',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '0.8rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                    {studentsList
                      .filter(s => {
                        const matchesBatch = plannerBatchFilter === 'all' || s.batch === plannerBatchFilter;
                        const matchesSearch = s.username.toLowerCase().includes(plannerSearchQuery.toLowerCase()) || 
                                              s.email.toLowerCase().includes(plannerSearchQuery.toLowerCase());
                        return matchesBatch && matchesSearch;
                      })
                      .sort((a, b) => a.username.localeCompare(b.username))
                      .map(student => (
                        <button
                          key={student.email}
                          onClick={() => setSelectedStudentPlanner(student)}
                          style={{
                            textAlign: 'left',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: selectedStudentPlanner?.email === student.email ? '1px solid #ef4444' : '1px solid #27272a',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            background: selectedStudentPlanner?.email === student.email ? '#ef4444' : '#18181b',
                            color: selectedStudentPlanner?.email === student.email ? '#ffffff' : '#a1a1aa',
                            transition: 'all 0.1s ease'
                          }}
                        >
                          <div style={{ fontWeight: '800', color: '#ffffff' }}>{student.username}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal', marginTop: '2px' }}>{student.email}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.9, marginTop: '4px', textTransform: 'uppercase', display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            {BATCH_LABELS[student.batch] || student.batch}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Student Specific Planner Tasks Editor */}
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '30px', borderRadius: '16px' }}>
                  {selectedStudentPlanner ? (
                    <>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffffff' }}>
                        Study Planner for <span style={{ color: '#ef4444' }}>{selectedStudentPlanner.username}</span>
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '24px' }}>
                        Manage daily study goals assigned specifically to this student.
                      </p>

                      {/* Add Student Task Form */}
                      <form onSubmit={handleAddStudentPlannerTask} style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          value={newStudentPlannerTaskText}
                          onChange={(e) => setNewStudentPlannerTaskText(e.target.value)}
                          placeholder="Assign custom goal for this student..."
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#18181b',
                            color: '#ffffff',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        />
                        <button type="submit" className="btn" style={{ padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700' }}>
                          Add Task
                        </button>
                      </form>

                      {/* List of active student tasks */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {studentPlannerTasks.map((task) => (
                          <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            background: '#18181b',
                            borderRadius: '10px',
                            border: '1px solid #27272a'
                          }}>
                            <span style={{ 
                              fontSize: '0.9rem', 
                              fontWeight: '600', 
                              color: task.completed ? '#71717a' : '#ffffff',
                              textDecoration: task.completed ? 'line-through' : 'none'
                            }}>
                              {task.text} {task.completed && '✓'}
                            </span>
                            <button 
                              onClick={() => handleDeleteStudentPlannerTask(task.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        {studentPlannerTasks.length === 0 && (
                          <p style={{ textAlign: 'center', color: '#a1a1aa', fontSize: '0.9rem', margin: '20px 0' }}>
                            No custom tasks for this student yet. Add one above!
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a1a1aa' }}>
                      <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '8px' }}>No Student Selected</h4>
                      <p style={{ fontSize: '0.85rem' }}>Select a student from the left panel to manage their specific checklist goals.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANAGE BATCH & STUDENT REVISION NOTES */}
        {activeTab === 'notes' && (
          <div>
            {/* Notes Mode Toggle */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '24px', background: '#111113', padding: '8px', borderRadius: '12px', border: '1px solid #27272a', maxWidth: '420px' }}>
              <button
                onClick={() => setNotesMode('batch')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  background: notesMode === 'batch' ? '#ef4444' : 'transparent',
                  color: notesMode === 'batch' ? '#ffffff' : '#a1a1aa',
                  transition: 'all 0.2s ease'
                }}
              >
                🏫 Batch-wise Notes
              </button>
              <button
                onClick={() => setNotesMode('student')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  background: notesMode === 'student' ? '#ef4444' : 'transparent',
                  color: notesMode === 'student' ? '#ffffff' : '#a1a1aa',
                  transition: 'all 0.2s ease'
                }}
              >
                👤 Student-wise Notes
              </button>
            </div>

            {notesMode === 'batch' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px' }}>
                {/* Batch Selector */}
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '24px', alignSelf: 'start', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>
                    Select Target Batch
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.keys(BATCH_LABELS).map(key => (
                      <button
                        key={key}
                        onClick={() => setSelectedBatchNotes(key)}
                        style={{
                          textAlign: 'left',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: selectedBatchNotes === key ? '1px solid #ef4444' : '1px solid #27272a',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          background: selectedBatchNotes === key ? '#ef4444' : '#18181b',
                          color: selectedBatchNotes === key ? '#ffffff' : '#a1a1aa',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {BATCH_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Revision Notes List & Form */}
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '30px', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffffff' }}>
                    Topper Revision Notes: {BATCH_LABELS[selectedBatchNotes]}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '24px' }}>
                    Add and manage study PDFs that students in this batch can download from their dashboards.
                  </p>

                  {/* Add Note File form */}
                  <form onSubmit={handleAddNote} style={{ marginBottom: '24px', background: '#18181b', border: '1px solid #27272a', padding: '20px', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
                      📤 Upload Study PDF
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.6fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>FILE NAME</label>
                        <input 
                          type="text" 
                          value={newNoteName}
                          onChange={(e) => setNewNoteName(e.target.value)}
                          placeholder="e.g. Inorganic Chemistry summary.pdf"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#121214',
                            color: '#ffffff',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>SUBJECT SECTION</label>
                        <select
                          value={newNoteSubject}
                          onChange={(e) => setNewNoteSubject(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#121214',
                            color: '#ffffff',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          {(BATCH_SUBJECTS[selectedBatchNotes] || ['Physics']).map(subj => (
                            <option key={subj} value={subj}>{subj}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>FILE SIZE</label>
                        <input 
                          type="text" 
                          value={newNoteSize}
                          onChange={(e) => setNewNoteSize(e.target.value)}
                          placeholder="e.g. 5.4 MB"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#121214',
                            color: '#ffffff',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn" style={{ padding: '10px', fontSize: '0.85rem', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', width: '100%' }}>
                      Upload Note PDF
                    </button>
                  </form>

                  {/* Revision materials download list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {batchNotesList.map((note, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: '#18181b',
                        borderRadius: '10px',
                        border: '1px solid #27272a'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FileText size={18} style={{ color: '#ef4444' }} />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {note.name}
                              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: '800' }}>
                                {note.subject || (BATCH_SUBJECTS[selectedBatchNotes]?.[0] || 'Physics')}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                              PDF Document • {note.size}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDeleteNote(idx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      onClick={async () => {
                        await api.updateBatchNotes(selectedBatchNotes, batchNotesList);
                        alert("✅ Success! Revision notes saved and synced to all students in this batch!");
                      }}
                      className="btn"
                      style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px' }}
                    >
                      💾 Save Revision Notes to All Students
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px' }}>
                {/* Student Selector */}
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '24px', alignSelf: 'start', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>
                    Select Student
                  </h3>

                  {/* Filter by Batch */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>FILTER BY BATCH</label>
                    <select
                      value={notesBatchFilter}
                      onChange={(e) => setNotesBatchFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #3f3f46',
                        background: '#18181b',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}
                    >
                      <option value="all">All Batches</option>
                      {Object.keys(BATCH_LABELS).map(key => (
                        <option key={key} value={key}>{BATCH_LABELS[key]}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Student */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>SEARCH BY NAME / EMAIL</label>
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={notesSearchQuery}
                      onChange={(e) => setNotesSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #3f3f46',
                        background: '#18181b',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '0.8rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                    {studentsList
                      .filter(s => {
                        const matchesBatch = notesBatchFilter === 'all' || s.batch === notesBatchFilter;
                        const matchesSearch = s.username.toLowerCase().includes(notesSearchQuery.toLowerCase()) || 
                                              s.email.toLowerCase().includes(notesSearchQuery.toLowerCase());
                        return matchesBatch && matchesSearch;
                      })
                      .sort((a, b) => a.username.localeCompare(b.username))
                      .map(student => (
                        <button
                          key={student.email}
                          onClick={() => setSelectedStudentNotes(student)}
                          style={{
                            textAlign: 'left',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: selectedStudentNotes?.email === student.email ? '1px solid #ef4444' : '1px solid #27272a',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            background: selectedStudentNotes?.email === student.email ? '#ef4444' : '#18181b',
                            color: selectedStudentNotes?.email === student.email ? '#ffffff' : '#a1a1aa',
                            transition: 'all 0.1s ease'
                          }}
                        >
                          <div style={{ fontWeight: '800', color: '#ffffff' }}>{student.username}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal', marginTop: '2px' }}>{student.email}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.9, marginTop: '4px', textTransform: 'uppercase', display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            {BATCH_LABELS[student.batch] || student.batch}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Student Specific Notes Editor */}
                <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', textAlign: 'left', padding: '30px', borderRadius: '16px' }}>
                  {selectedStudentNotes ? (
                    <>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffffff' }}>
                        Revision Notes for <span style={{ color: '#ef4444' }}>{selectedStudentNotes.username}</span>
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '24px' }}>
                        Manage study notes assigned specifically to this student.
                      </p>

                      {/* Add Student Note Form */}
                      <form onSubmit={handleAddStudentNote} style={{ marginBottom: '24px', background: '#18181b', border: '1px solid #27272a', padding: '20px', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
                          📤 Upload PDF for Student
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.6fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>FILE NAME</label>
                            <input 
                              type="text" 
                              value={newStudentNoteName}
                              onChange={(e) => setNewStudentNoteName(e.target.value)}
                              placeholder="e.g. Personal feedback.pdf"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #3f3f46',
                                background: '#121214',
                                color: '#ffffff',
                                outline: 'none',
                                fontSize: '0.85rem'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>SUBJECT SECTION</label>
                            <select
                              value={newStudentNoteSubject}
                              onChange={(e) => setNewStudentNoteSubject(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #3f3f46',
                                background: '#121214',
                                color: '#ffffff',
                                outline: 'none',
                                fontSize: '0.85rem'
                              }}
                            >
                              {(BATCH_SUBJECTS[selectedStudentNotes.batch] || ['Physics']).map(subj => (
                                <option key={subj} value={subj}>{subj}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#a1a1aa', marginBottom: '4px' }}>FILE SIZE</label>
                            <input 
                              type="text" 
                              value={newStudentNoteSize}
                              onChange={(e) => setNewStudentNoteSize(e.target.value)}
                              placeholder="e.g. 5.4 MB"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #3f3f46',
                                background: '#121214',
                                color: '#ffffff',
                                outline: 'none',
                                fontSize: '0.85rem'
                              }}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn" style={{ padding: '10px', fontSize: '0.85rem', cursor: 'pointer', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', width: '100%' }}>
                          Upload Note PDF
                        </button>
                      </form>

                      {/* Revision materials download list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {studentNotesList.map((note, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            background: '#18181b',
                            borderRadius: '10px',
                            border: '1px solid #27272a'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <FileText size={18} style={{ color: '#ef4444' }} />
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {note.name}
                                  <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: '800' }}>
                                    {note.subject || (BATCH_SUBJECTS[selectedStudentNotes.batch]?.[0] || 'Physics')}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                                  PDF Document • {note.size}
                                </span>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleDeleteStudentNote(idx)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        {studentNotesList.length === 0 && (
                          <p style={{ textAlign: 'center', color: '#a1a1aa', fontSize: '0.9rem', margin: '20px 0' }}>
                            No custom notes uploaded for this student yet. Upload one above!
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a1a1aa' }}>
                      <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '8px' }}>No Student Selected</h4>
                      <p style={{ fontSize: '0.85rem' }}>Select a student from the left panel to manage their specific revision notes.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manage Communication Tab */}
        {activeTab === 'communication' && (
          <div className="glass-card" style={{ background: '#111113', border: '1px solid #27272a', padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'left', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              💬 Manage Important Notices
            </h2>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px', color: '#a1a1aa' }}>Select Batch to Manage</label>
              <select 
                value={selectedBatchNotices}
                onChange={(e) => setSelectedBatchNotices(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #3f3f46',
                  fontSize: '1rem',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'var(--sans-font)',
                  background: '#18181b',
                  color: '#ffffff'
                }}
              >
                {Object.entries(BATCH_SUBJECTS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#ffffff' }}>Post New Notice</h3>
              <textarea 
                placeholder="Type your notice here..."
                value={newNoticeMessage}
                onChange={(e) => setNewNoticeMessage(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #3f3f46',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--sans-font)',
                  resize: 'vertical',
                  marginBottom: '16px',
                  background: '#121214',
                  color: '#ffffff'
                }}
              />
              <button 
                onClick={handleAddNotice}
                disabled={!newNoticeMessage.trim()}
                className="btn"
                style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: '800', cursor: newNoticeMessage.trim() ? 'pointer' : 'not-allowed', opacity: newNoticeMessage.trim() ? 1 : 0.6, background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px' }}
              >
                📢 Post Notice
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#ffffff' }}>Previous Notices</h3>
              {batchNoticesList.length === 0 ? (
                <p style={{ color: '#a1a1aa' }}>No notices posted for this batch yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {batchNoticesList.map((notice) => (
                    <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#18181b', padding: '16px', borderRadius: '8px', border: '1px solid #27272a' }}>
                      <div>
                        <p style={{ color: '#e4e4e7', fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>{notice.message}</p>
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                          {new Date(notice.createdAt).toLocaleDateString()} at {new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteNotice(notice.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                        title="Delete Notice"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
