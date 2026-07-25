// Force Vercel build update for Admin Panel Save Button
import React, { useState, useEffect } from 'react';
import { Compass, LogOut, X, Users, Trash2, FileText, Edit } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'students' | 'scores' | 'planners' | 'notes' | 'communication'>('students');
  const [studentsList, setStudentsList] = useState<StudentUser[]>([]);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  const [notesMode, setNotesMode] = useState<'batch' | 'student'>('batch');
  const [selectedStudentNotes, setSelectedStudentNotes] = useState<StudentUser | null>(null);
  const [studentNotesList, setStudentNotesList] = useState<Array<{ name: string; size: string; subject?: string }>>([]);
  const [newStudentNoteName, setNewStudentNoteName] = useState('');
  const [newStudentNoteSize, setNewStudentNoteSize] = useState('4.5 MB');
  const [newStudentNoteSubject, setNewStudentNoteSubject] = useState('Physics');
  const [notesSearchQuery, setNotesSearchQuery] = useState('');

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

  const filteredStudents = studentsList.filter(s => {
    const matchesBatch = selectedBatchFilter === 'all' || s.batch === selectedBatchFilter;
    const matchesSearch = s.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Admin Navbar */}
      <header className="navbar-header" style={{ background: '#ffffff', borderBottom: '2px solid var(--border-color)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-icon-wrapper" style={{ background: '#ef4444' }}>
              <Compass className="logo-icon animate-spin-slow" />
            </div>
            <span className="logo-text">RestartClub <span style={{ color: '#ef4444' }}>Admin</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="badge-pill" style={{ margin: 0, background: '#fee2e2', borderColor: '#ef4444', color: '#ef4444' }}>
              🛡️ Owner Session
            </div>
            <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '8px 16px', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
              Exit Panel <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tabs Switcher */}
      <div className="container" style={{ paddingTop: '30px', textAlign: 'left' }}>
        <div style={{
          display: 'inline-flex',
          background: '#ffffff',
          padding: '6px',
          borderRadius: '14px',
          gap: '8px',
          border: '2px solid var(--border-color)',
          boxShadow: '3px 3px 0px #111827'
        }}>
          <button 
            onClick={() => { setActiveTab('students'); setSelectedStudent(null); }}
            className="btn" 
            style={{
              padding: '8px 20px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '700',
              background: activeTab === 'students' ? '#ef4444' : 'transparent',
              color: activeTab === 'students' ? '#ffffff' : 'var(--text-primary)',
              boxShadow: 'none',
              transform: 'none',
              cursor: 'pointer'
            }}
          >
            👥 Students Directory
          </button>
          <button 
            onClick={() => { setActiveTab('scores'); setSelectedStudent(null); }}
            className="btn" 
            style={{
              padding: '8px 20px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '700',
              background: activeTab === 'scores' ? '#ef4444' : 'transparent',
              color: activeTab === 'scores' ? '#ffffff' : 'var(--text-primary)',
              boxShadow: 'none',
              transform: 'none',
              cursor: 'pointer'
            }}
          >
            📊 Manage Test Scores
          </button>
          <button 
            onClick={() => setActiveTab('planners')}
            className="btn" 
            style={{
              padding: '8px 20px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '700',
              background: activeTab === 'planners' ? '#ef4444' : 'transparent',
              color: activeTab === 'planners' ? '#ffffff' : 'var(--text-primary)',
              boxShadow: 'none',
              transform: 'none',
              cursor: 'pointer'
            }}
          >
            📝 Manage Batch Planners
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className="btn" 
            style={{
              padding: '8px 20px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '700',
              background: activeTab === 'notes' ? '#ef4444' : 'transparent',
              color: activeTab === 'notes' ? '#ffffff' : 'var(--text-primary)',
              boxShadow: 'none',
              transform: 'none',
              cursor: 'pointer'
            }}
          >
            📂 Manage Revision Notes
          </button>
          <button 
            onClick={() => setActiveTab('communication')}
            className="btn" 
            style={{
              padding: '8px 20px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '700',
              background: activeTab === 'communication' ? '#ef4444' : 'transparent',
              color: activeTab === 'communication' ? '#ffffff' : 'var(--text-primary)',
              boxShadow: 'none',
              transform: 'none',
              cursor: 'pointer'
            }}
          >
            💬 Manage Communication
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
        {(activeTab === 'students' || activeTab === 'scores') && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 0.8fr' : '1fr', gap: '30px' }}>
            
            {/* Students Table */}
            <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
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
                      border: '2px solid var(--border-color)',
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
                      border: '2px solid var(--border-color)',
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
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280' }}>STUDENT</th>
                      <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280' }}>BATCH</th>
                      <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280' }}>STATUS</th>
                      <th style={{ padding: '12px 10px', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textAlign: 'right' }}>ACTIONS</th>
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
                          <tr key={`${student.email}-${batch}`} style={{ borderBottom: '1px solid #f3f4f6', height: '60px' }}>
                            <td style={{ padding: '10px' }}>
                              <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>{student.username}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.email}</div>
                            </td>
                            <td style={{ padding: '10px', fontWeight: '600', fontSize: '0.85rem' }}>
                              {BATCH_LABELS[batch] || batch}
                            </td>
                            {(() => {
                              const isPremium = student.purchasedBatches?.includes(batch) || student.purchasedBatches?.includes(`${batch}_premium`);
                              const isStandard = student.purchasedBatches?.includes(`${batch}_standard`);
                              const isBought = isPremium || isStandard;
                              
                              let statusText = 'Unpaid/Pending';
                              if (isPremium) statusText = 'Active (Premium ₹599 for 6months)';
                              else if (isStandard) statusText = 'Active (Standard ₹499 for 6months)';

                              return (
                                <React.Fragment>
                                  <td style={{ padding: '10px' }}>
                                    <span style={{ 
                                      display: 'inline-block',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.7rem',
                                      fontWeight: '800',
                                      border: '1.5px solid',
                                      borderColor: isBought ? '#10b981' : '#f59e0b',
                                      background: isBought ? '#d1fae5' : '#fef3c7',
                                      color: isBought ? '#065f46' : '#92400e'
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
                                            className="btn btn-secondary"
                                            title="₹499 for 6months Tier (No AI Chat Bot)"
                                            style={{ 
                                              padding: '6px 12px', 
                                              fontSize: '0.7rem', 
                                              cursor: 'pointer', 
                                              background: isStandard && !isPremium ? '#10b981' : '#ffffff',
                                              color: isStandard && !isPremium ? '#ffffff' : '#111827',
                                              border: isStandard && !isPremium ? '2px solid #10b981' : '2px solid var(--border-color)'
                                            }}
                                          >
                                            Paid ₹499 for 6months
                                          </button>
                                          <button 
                                            onClick={() => {
                                              if (!isPremium) {
                                                handleTogglePayment(student.email, batch, 'premium');
                                              }
                                            }}
                                            className="btn btn-secondary"
                                            title="₹599 for 6months Tier (With AI Chat Bot)"
                                            style={{ 
                                              padding: '6px 12px', 
                                              fontSize: '0.7rem', 
                                              cursor: 'pointer', 
                                              background: isPremium ? '#10b981' : '#ffffff',
                                              color: isPremium ? '#ffffff' : '#111827',
                                              border: isPremium ? '2px solid #10b981' : '2px solid var(--border-color)'
                                            }}
                                          >
                                            Paid ₹599 for 6months
                                          </button>
                                          <button 
                                            onClick={() => {
                                              if (isPremium) {
                                                handleTogglePayment(student.email, batch, 'premium');
                                              } else if (isStandard) {
                                                handleTogglePayment(student.email, batch, 'standard');
                                              }
                                            }}
                                            className="btn btn-secondary"
                                            title="Revoke Access"
                                            style={{ 
                                              padding: '6px 12px', 
                                              fontSize: '0.7rem', 
                                              cursor: 'pointer', 
                                              background: !(isStandard || isPremium) ? '#10b981' : '#ffffff',
                                              color: !(isStandard || isPremium) ? '#ffffff' : '#111827',
                                              border: !(isStandard || isPremium) ? '2px solid #10b981' : '2px solid var(--border-color)'
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
                                              background: '#fee2e2',
                                              color: '#dc2626',
                                              border: '2px solid #f87171',
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
                                          className="btn btn-accent"
                                          style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer' }}
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
                        <td colSpan={4} style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
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
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#111827', fontWeight: '800' }}>
                      👤 Manage: {selectedStudent.username}
                    </h3>
                    <button 
                      onClick={() => setSelectedStudent(null)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Email: <strong>{selectedStudent.email}</strong> <br/>
                    Batch: <strong>{BATCH_LABELS[selectedStudent.batch] || selectedStudent.batch}</strong>
                  </p>

                  {activeTab === 'students' && (
                    <React.Fragment>
                      {/* Add task directly to student */}
                      <form onSubmit={handleAddStudentTask} style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
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
                              border: '2px solid var(--border-color)',
                              outline: 'none',
                              fontSize: '0.85rem'
                            }}
                          />
                          <button type="submit" className="btn btn-accent" style={{ padding: '10px 14px', fontSize: '0.85rem', cursor: 'pointer' }}>
                            Assign
                          </button>
                        </div>
                      </form>

                      {/* Student Active Task List */}
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
                        Active Checklist Tasks ({studentTasks.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                        {studentTasks.map(task => (
                          <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            background: '#fafafa',
                            borderRadius: '8px',
                            border: '1.5px solid var(--border-color)'
                          }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#9ca3af' : '#111827' }}>
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
                          <p style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center', padding: '10px' }}>
                            No checklist tasks assigned yet.
                          </p>
                        )}
                      </div>
                    </React.Fragment>
                  )}

                  {activeTab === 'scores' && (
                    <React.Fragment>
                      {/* Student Test Scores List */}
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
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
                              border: '2px solid var(--border-color)',
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
                              border: '2px solid var(--border-color)',
                              outline: 'none',
                              fontSize: '0.85rem'
                            }}
                          />
                          <button type="submit" className="btn btn-accent" style={{ padding: '10px 14px', fontSize: '0.85rem', cursor: 'pointer' }}>
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
                            background: '#fafafa',
                            borderRadius: '8px',
                            border: '1.5px solid var(--border-color)'
                          }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>
                              {score.subject} <span style={{ color: 'var(--accent-color)', marginLeft: '8px' }}>{score.score}%</span>
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
                          <p style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center', padding: '10px' }}>
                            No mock test scores logged yet.
                          </p>
                        )}
                      </div>

                      {/* Weekly Study Hours Form */}
                      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid var(--border-color)' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
                          Manage Weekly Study Hours
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                            <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{day}</label>
                              <input 
                                type="number" 
                                min="0"
                                max="24"
                                value={studentStudyHours[day] || ''}
                                onChange={(e) => handleStudyHoursChange(day, e.target.value)}
                                style={{
                                  padding: '8px',
                                  borderRadius: '6px',
                                  border: '2px solid var(--border-color)',
                                  outline: 'none',
                                  fontSize: '0.85rem'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={handleSaveStudyHours}
                          className="btn btn-accent" 
                          style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                          Save Study Hours
                        </button>
                      </div>
                    </React.Fragment>
                  )}

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '2px solid var(--border-color)' }}>
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
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: '2px solid #f87171',
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
            <div style={{ display: 'flex', gap: '15px', marginBottom: '24px', background: '#fafafa', padding: '10px', borderRadius: '12px', border: '2px solid var(--border-color)', boxShadow: '3px 3px 0px #111827', maxWidth: '400px' }}>
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
                  background: plannerMode === 'batch' ? 'var(--accent-color)' : 'transparent',
                  color: plannerMode === 'batch' ? '#ffffff' : 'var(--text-primary)',
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
                  background: plannerMode === 'student' ? 'var(--accent-color)' : 'transparent',
                  color: plannerMode === 'student' ? '#ffffff' : 'var(--text-primary)',
                  transition: 'all 0.2s ease'
                }}
              >
                👤 Student-wise Planners
              </button>
            </div>

            {plannerMode === 'batch' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px' }}>
                {/* Batch Selector */}
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '24px', alignSelf: 'start' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#111827', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
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
                          border: '2px solid var(--border-color)',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          background: selectedBatchPlanner === key ? 'var(--accent-color)' : '#fafafa',
                          color: selectedBatchPlanner === key ? '#ffffff' : '#111827',
                          boxShadow: selectedBatchPlanner === key ? 'none' : '2px 2px 0px #111827',
                          transform: selectedBatchPlanner === key ? 'translate(2px, 2px)' : 'none',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {BATCH_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Tasks Editor */}
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#111827' }}>
                    Default Study Planners: {BATCH_LABELS[selectedBatchPlanner]}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    These default study checklist goals are automatically assigned to all newly registering students in this batch.
                    <span style={{ display: 'inline-block', marginLeft: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: '6px' }}>
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
                        border: '2px solid var(--border-color)',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button type="submit" className="btn btn-accent" style={{ padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer' }}>
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
                        background: '#fafafa',
                        borderRadius: '10px',
                        border: '2px solid var(--border-color)',
                        boxShadow: '2px 2px 0px #111827'
                      }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111827' }}>
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

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      onClick={async () => {
                        await api.updateBatchPlanner(selectedBatchPlanner, batchPlannerTasks);
                        alert("✅ Success! Planner tasks saved and synced to all students in this batch!");
                      }}
                      className="btn btn-accent"
                      style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      💾 Save Planner to All Students
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px' }}>
                {/* Student Selector */}
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '24px', alignSelf: 'start' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#111827', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                    Select Student
                  </h3>

                  {/* Search Student */}
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={plannerSearchQuery}
                    onChange={(e) => setPlannerSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-color)',
                      marginBottom: '16px',
                      outline: 'none',
                      fontSize: '0.8rem'
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                    {studentsList
                      .filter(s => 
                        s.username.toLowerCase().includes(plannerSearchQuery.toLowerCase()) || 
                        s.email.toLowerCase().includes(plannerSearchQuery.toLowerCase())
                      )
                      .map(student => (
                        <button
                          key={student.email}
                          onClick={() => setSelectedStudentPlanner(student)}
                          style={{
                            textAlign: 'left',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            background: selectedStudentPlanner?.email === student.email ? 'var(--accent-color)' : '#fafafa',
                            color: selectedStudentPlanner?.email === student.email ? '#ffffff' : '#111827',
                            boxShadow: selectedStudentPlanner?.email === student.email ? 'none' : '2px 2px 0px #111827',
                            transform: selectedStudentPlanner?.email === student.email ? 'translate(2px, 2px)' : 'none',
                            transition: 'all 0.1s ease'
                          }}
                        >
                          <div style={{ fontWeight: '800' }}>{student.username}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal', marginTop: '2px' }}>{student.email}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.9, marginTop: '4px', textTransform: 'uppercase', display: 'inline-block', background: selectedStudentPlanner?.email === student.email ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                            {BATCH_LABELS[student.batch] || student.batch}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Student Specific Planner Editor */}
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '30px' }}>
                  {selectedStudentPlanner ? (
                    <>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#111827' }}>
                        Planner Checklist for <span style={{ color: 'var(--accent-color)' }}>{selectedStudentPlanner.username}</span>
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Modify checklist items specifically for this student. Updates are automatically synced to the student's dashboard.
                      </p>

                      <form onSubmit={handleAddStudentPlannerTask} style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          value={newStudentPlannerTaskText}
                          onChange={(e) => setNewStudentPlannerTaskText(e.target.value)}
                          placeholder="Add a new custom task for this student..."
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        />
                        <button type="submit" className="btn btn-accent" style={{ padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer' }}>
                          Add Task
                        </button>
                      </form>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {studentPlannerTasks.map((task) => (
                          <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            background: '#fafafa',
                            borderRadius: '10px',
                            border: '2px solid var(--border-color)',
                            boxShadow: '2px 2px 0px #111827'
                          }}>
                            <span style={{ 
                              fontSize: '0.9rem', 
                              fontWeight: '600', 
                              color: '#111827',
                              textDecoration: task.completed ? 'line-through' : 'none',
                              opacity: task.completed ? 0.6 : 1
                            }}>
                              {task.text}
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
                          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '20px 0' }}>
                            No tasks found for this student. Add some above!
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                      <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <h4 style={{ fontSize: '1.1rem', color: '#111827', marginBottom: '8px' }}>No Student Selected</h4>
                      <p style={{ fontSize: '0.85rem' }}>Select a student from the left panel to view and modify their planner checklist.</p>
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
            <div style={{ display: 'flex', gap: '15px', marginBottom: '24px', background: '#fafafa', padding: '10px', borderRadius: '12px', border: '2px solid var(--border-color)', boxShadow: '3px 3px 0px #111827', maxWidth: '400px' }}>
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
                  background: notesMode === 'batch' ? 'var(--accent-color)' : 'transparent',
                  color: notesMode === 'batch' ? '#ffffff' : 'var(--text-primary)',
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
                  background: notesMode === 'student' ? 'var(--accent-color)' : 'transparent',
                  color: notesMode === 'student' ? '#ffffff' : 'var(--text-primary)',
                  transition: 'all 0.2s ease'
                }}
              >
                👤 Student-wise Notes
              </button>
            </div>

            {notesMode === 'batch' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px' }}>
                {/* Batch Selector */}
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '24px', alignSelf: 'start' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#111827', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
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
                          border: '2px solid var(--border-color)',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          background: selectedBatchNotes === key ? 'var(--accent-color)' : '#fafafa',
                          color: selectedBatchNotes === key ? '#ffffff' : '#111827',
                          boxShadow: selectedBatchNotes === key ? 'none' : '2px 2px 0px #111827',
                          transform: selectedBatchNotes === key ? 'translate(2px, 2px)' : 'none',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {BATCH_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes editor */}
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#111827' }}>
                    Topper Revision Notes: {BATCH_LABELS[selectedBatchNotes]}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Add and manage study PDFs that students in this batch can download from their dashboards.
                  </p>

                  {/* Add Note File form */}
                  <form onSubmit={handleAddNote} style={{ marginBottom: '24px', background: '#fafafa', border: '2px solid var(--border-color)', padding: '20px', borderRadius: '12px', boxShadow: '3px 3px 0px #111827' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
                      📤 Upload Mock Study PDF
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.6fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>FILE NAME</label>
                        <input 
                          type="text" 
                          value={newNoteName}
                          onChange={(e) => setNewNoteName(e.target.value)}
                          placeholder="e.g. Inorganic Chemistry summary.pdf"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>SUBJECT SECTION</label>
                        <select
                          value={newNoteSubject}
                          onChange={(e) => setNewNoteSubject(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            outline: 'none',
                            fontSize: '0.85rem',
                            background: '#ffffff'
                          }}
                        >
                          {(BATCH_SUBJECTS[selectedBatchNotes] || ['Physics']).map(subj => (
                            <option key={subj} value={subj}>{subj}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>FILE SIZE</label>
                        <input 
                          type="text" 
                          value={newNoteSize}
                          onChange={(e) => setNewNoteSize(e.target.value)}
                          placeholder="e.g. 5.4 MB"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-accent w-full" style={{ padding: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
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
                        background: '#ffffff',
                        borderRadius: '10px',
                        border: '2px solid var(--border-color)',
                        boxShadow: '2px 2px 0px #111827'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FileText size={18} style={{ color: 'var(--accent-color)' }} />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {note.name}
                              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3', fontWeight: '800' }}>
                                {note.subject || (BATCH_SUBJECTS[selectedBatchNotes]?.[0] || 'Physics')}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
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

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      onClick={async () => {
                        await api.updateBatchNotes(selectedBatchNotes, batchNotesList);
                        alert("✅ Success! Revision notes saved and synced to all students in this batch!");
                      }}
                      className="btn btn-accent"
                      style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      💾 Save Revision Notes to All Students
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px' }}>
                {/* Student Selector */}
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '24px', alignSelf: 'start' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#111827', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                    Select Student
                  </h3>

                  {/* Search Student */}
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={notesSearchQuery}
                    onChange={(e) => setNotesSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-color)',
                      marginBottom: '16px',
                      outline: 'none',
                      fontSize: '0.8rem'
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                    {studentsList
                      .filter(s => 
                        s.username.toLowerCase().includes(notesSearchQuery.toLowerCase()) || 
                        s.email.toLowerCase().includes(notesSearchQuery.toLowerCase())
                      )
                      .map(student => (
                        <button
                          key={student.email}
                          onClick={() => setSelectedStudentNotes(student)}
                          style={{
                            textAlign: 'left',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            background: selectedStudentNotes?.email === student.email ? 'var(--accent-color)' : '#fafafa',
                            color: selectedStudentNotes?.email === student.email ? '#ffffff' : '#111827',
                            boxShadow: selectedStudentNotes?.email === student.email ? 'none' : '2px 2px 0px #111827',
                            transform: selectedStudentNotes?.email === student.email ? 'translate(2px, 2px)' : 'none',
                            transition: 'all 0.1s ease'
                          }}
                        >
                          <div style={{ fontWeight: '800' }}>{student.username}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal', marginTop: '2px' }}>{student.email}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.9, marginTop: '4px', textTransform: 'uppercase', display: 'inline-block', background: selectedStudentNotes?.email === student.email ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                            {BATCH_LABELS[student.batch] || student.batch}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Student Specific Notes Editor */}
                <div className="glass-card" style={{ background: '#ffffff', textAlign: 'left', padding: '30px' }}>
                  {selectedStudentNotes ? (
                    <>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#111827' }}>
                        Revision Notes for <span style={{ color: 'var(--accent-color)' }}>{selectedStudentNotes.username}</span>
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Manage study notes assigned specifically to this student.
                      </p>

                      {/* Add Student Note Form */}
                      <form onSubmit={handleAddStudentNote} style={{ marginBottom: '24px', background: '#fafafa', border: '2px solid var(--border-color)', padding: '20px', borderRadius: '12px', boxShadow: '3px 3px 0px #111827' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
                          📤 Upload PDF for Student
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.6fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>FILE NAME</label>
                            <input 
                              type="text" 
                              value={newStudentNoteName}
                              onChange={(e) => setNewStudentNoteName(e.target.value)}
                              placeholder="e.g. Personal feedback.pdf"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '2px solid var(--border-color)',
                                outline: 'none',
                                fontSize: '0.85rem'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>SUBJECT SECTION</label>
                            <select
                              value={newStudentNoteSubject}
                              onChange={(e) => setNewStudentNoteSubject(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '2px solid var(--border-color)',
                                outline: 'none',
                                fontSize: '0.85rem',
                                background: '#ffffff'
                              }}
                            >
                              {(BATCH_SUBJECTS[selectedStudentNotes.batch] || ['Physics']).map(subj => (
                                <option key={subj} value={subj}>{subj}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>FILE SIZE</label>
                            <input 
                              type="text" 
                              value={newStudentNoteSize}
                              onChange={(e) => setNewStudentNoteSize(e.target.value)}
                              placeholder="e.g. 5.4 MB"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '2px solid var(--border-color)',
                                outline: 'none',
                                fontSize: '0.85rem'
                              }}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-accent w-full" style={{ padding: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
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
                            background: '#ffffff',
                            borderRadius: '10px',
                            border: '2px solid var(--border-color)',
                            boxShadow: '2px 2px 0px #111827'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <FileText size={18} style={{ color: 'var(--accent-color)' }} />
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {note.name}
                                  <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3', fontWeight: '800' }}>
                                    {note.subject || (BATCH_SUBJECTS[selectedStudentNotes.batch]?.[0] || 'Physics')}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
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
                          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '20px 0' }}>
                            No custom notes uploaded for this student yet. Upload one above!
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                      <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <h4 style={{ fontSize: '1.1rem', color: '#111827', marginBottom: '8px' }}>No Student Selected</h4>
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
          <div className="glass-card" style={{ background: '#ffffff', padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              💬 Manage Important Notices
            </h2>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Batch to Manage</label>
              <select 
                value={selectedBatchNotices}
                onChange={(e) => setSelectedBatchNotices(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  fontSize: '1rem',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'var(--sans-font)',
                  background: '#f9fafb'
                }}
              >
                {Object.entries(BATCH_SUBJECTS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div style={{ background: '#f9fafb', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#111827' }}>Post New Notice</h3>
              <textarea 
                placeholder="Type your notice here..."
                value={newNoticeMessage}
                onChange={(e) => setNewNoticeMessage(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid var(--border-color)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--sans-font)',
                  resize: 'vertical',
                  marginBottom: '16px'
                }}
              />
              <button 
                onClick={handleAddNotice}
                disabled={!newNoticeMessage.trim()}
                className="btn btn-accent"
                style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: '800', cursor: newNoticeMessage.trim() ? 'pointer' : 'not-allowed', opacity: newNoticeMessage.trim() ? 1 : 0.6 }}
              >
                📢 Post Notice
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#111827' }}>Previous Notices</h3>
              {batchNoticesList.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No notices posted for this batch yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {batchNoticesList.map((notice) => (
                    <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '2px 2px 0px rgba(0,0,0,0.05)' }}>
                      <div>
                        <p style={{ color: '#374151', fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>{notice.message}</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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
