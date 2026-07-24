let RAW_URL = import.meta.env.VITE_API_URL || 'https://restart-club.vercel.app/api';
if (RAW_URL.startsWith('ttps://')) RAW_URL = 'h' + RAW_URL;
if (!RAW_URL.startsWith('http')) RAW_URL = 'https://restart-club.vercel.app/api';
const API_BASE_URL = RAW_URL.replace(/\/+$/, '');

export const api = {
  // Users
  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/users`);
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  registerUser: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  loginUser: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  updatePassword: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/update-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  togglePayment: async (email: string, batch: string, tier: 'standard' | 'premium' = 'premium') => {
    const res = await fetch(`${API_BASE_URL}/users/toggle-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, batch, tier })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  deleteUser: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}`, {
      method: 'DELETE'
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  deleteUserBatch: async (email: string, batch: string) => {
    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}/batch/${encodeURIComponent(batch)}`, {
      method: 'DELETE'
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Tasks
  getTasks: async (email: string, batch: string = '12') => {
    const res = await fetch(`${API_BASE_URL}/tasks/${email}/${batch}`);
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  updateTasks: async (email: string, arg2: any, arg3?: any[]) => {
    const batch = typeof arg2 === 'string' ? arg2 : '12';
    const tasks = Array.isArray(arg2) ? arg2 : arg3 || [];
    const res = await fetch(`${API_BASE_URL}/tasks/${email}/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Scores
  getScores: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/scores/${email}`);
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  updateScores: async (email: string, scores: any[]) => {
    const res = await fetch(`${API_BASE_URL}/scores/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Planners (Templates)
  getBatchPlanner: async (batch: string) => {
    const res = await fetch(`${API_BASE_URL}/templates/planner/${batch}`);
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  updateBatchPlanner: async (batch: string, planners: any[]) => {
    const res = await fetch(`${API_BASE_URL}/templates/planner/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planners })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Notes (Templates)
  getBatchNotes: async (batch: string) => {
    const res = await fetch(`${API_BASE_URL}/templates/notes/${batch}`);
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  updateBatchNotes: async (batch: string, notes: any[]) => {
    const res = await fetch(`${API_BASE_URL}/templates/notes/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Chat
  getChat: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/chat/${email}`);
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  updateChat: async (email: string, chat: any[]) => {
    const res = await fetch(`${API_BASE_URL}/chat/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  }
};
