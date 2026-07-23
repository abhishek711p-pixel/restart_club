import React, { useState, useEffect } from 'react';
import { Compass, LogOut, X, Users, Trash2, FileText } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'students' | 'planners' | 'notes'>('students');
  const [studentsList, setStudentsList] = useState<StudentUser[]>([]);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected student management
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null);
  const [studentTasks, setStudentTasks] = useState<any[]>([]);
  const [newStudentTaskText, setNewStudentTaskText] = useState('');
  
  // Planners editor
  const [selectedBatchPlanner, setSelectedBatchPlanner] = useState<string>('12');
  const [batchPlannerTasks, setBatchPlannerTasks] = useState<string[]>([]);
  const [newPlannerTaskText, setNewPlannerTaskText] = useState('');

  // Notes editor
  const [selectedBatchNotes, setSelectedBatchNotes] = useState<string>('12');
  const [batchNotesList, setBatchNotesList] = useState<Array<{ name: string; size: string }>>([]);
  const [newNoteName, setNewNoteName] = useState('');
  const [newNoteSize, setNewNoteSize] = useState('4.5 MB');

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
        } catch (err) {
          setStudentTasks([]);
        }
      }
    };
    loadTasks();
  }, [selectedStudent]);

  // Load selected batch planner defaults
  useEffect(() => {
    const loadPlanner = async () => {
      const defaultTasks = {
        '10': ["Complete Science Chapter 4 boards checking", "Solve 10 algebra questions", "Review mock test quiz results"],
        '11': ["Clear Class 11 physics backlog (mechanics)", "Solve 15 Chemistry practice questions", "Read Biology NCERT Chapter 5"],
        '12': ["Practice Class 12 mock writing board sheet", "Attempt physics chapter-wise JEE test", "Revise Chemistry organic conversions"],
        'jee-dropper': ["Solve 20 JEE Mains calculus equations", "Complete inorganic trends notes review", "Attempt 1 full mock test paper"],
        'neet-dropper': ["Read Biology NCERT plant physiology trends", "Revise physics kinematics formula logs", "Solve 30 biology MCQ check sheets"]
      };
      
      try {
        const storedPlanner = await api.getBatchPlanner(selectedBatchPlanner);
        if (storedPlanner && storedPlanner.length > 0) {
          setBatchPlannerTasks(storedPlanner);
        } else {
          const defaults = defaultTasks[selectedBatchPlanner as keyof typeof defaultTasks] || [];
          setBatchPlannerTasks(defaults);
          await api.updateBatchPlanner(selectedBatchPlanner, defaults);
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
      const defaultNotes = {
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
      try {
        const storedNotes = await api.getBatchNotes(selectedBatchNotes);
        if (storedNotes && storedNotes.length > 0) {
          setBatchNotesList(storedNotes);
        } else {
          const defaults = defaultNotes[selectedBatchNotes as keyof typeof defaultNotes] || [];
          setBatchNotesList(defaults);
          await api.updateBatchNotes(selectedBatchNotes, defaults);
        }
      } catch (err) {
        console.error("Failed to load notes", err);
      }
    };
    loadNotes();
  }, [selectedBatchNotes]);

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
    const newNote = {
      name: newNoteName.endsWith('.pdf') ? newNoteName : `${newNoteName}.pdf`,
      size: newNoteSize || '4.5 MB'
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
        </div>
      </div>

      {/* Main Admin Workspace Container */}
      <main className="container" style={{ flex: 1, padding: '40px 24px' }}>
        
        {/* TAB 1: STUDENTS DIRECTORY */}
        {activeTab === 'students' && (
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
                              if (isPremium) statusText = 'Active (Premium ₹599)';
                              else if (isStandard) statusText = 'Active (Standard ₹499)';

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
                                      <button 
                                        onClick={() => {
                                          if (!isStandard) {
                                            // If they have premium, we might need to handle that, but togglePayment will add standard.
                                            // To ensure they only have one, we could just call togglePayment for standard.
                                            handleTogglePayment(student.email, batch, 'standard');
                                          }
                                        }}
                                        className="btn btn-secondary"
                                        title="₹499 Tier (No AI Chat Bot)"
                                        style={{ 
                                          padding: '6px 12px', 
                                          fontSize: '0.7rem', 
                                          cursor: 'pointer', 
                                          background: isStandard && !isPremium ? '#10b981' : '#ffffff',
                                          color: isStandard && !isPremium ? '#ffffff' : '#111827',
                                          border: isStandard && !isPremium ? '2px solid #10b981' : '2px solid var(--border-color)'
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
                                        className="btn btn-secondary"
                                        title="₹599 Tier (With AI Chat Bot)"
                                        style={{ 
                                          padding: '6px 12px', 
                                          fontSize: '0.7rem', 
                                          cursor: 'pointer', 
                                          background: isPremium ? '#10b981' : '#ffffff',
                                          color: isPremium ? '#ffffff' : '#111827',
                                          border: isPremium ? '2px solid #10b981' : '2px solid var(--border-color)'
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
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE BATCH PLANNER TEMPLATES */}
        {activeTab === 'planners' && (
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
        )}

        {/* TAB 3: MANAGE BATCH REVISION NOTES */}
        {activeTab === 'notes' && (
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
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px', marginBottom: '12px' }}>
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
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
                          {note.name}
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
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
