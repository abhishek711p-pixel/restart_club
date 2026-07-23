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
  forgotPassword: async (data: { email: string }) => {
    const res = await fetch(`${API_BASE_URL}/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  resetPassword: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/reset-password`, {
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
  updateUserBatch: async (data: { email: string, batch: string }) => {
    const res = await fetch(`${API_BASE_URL}/users/update-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  togglePayment: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/users/toggle-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Failed to toggle payment');
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Payment Gateway
  createPaymentOrder: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Failed to create order');
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  verifyPayment: async (data: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, email: string, batch: string, tier?: 'standard' | 'premium' }) => {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Payment verification failed');
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Tasks
  getTasks: async (email: string, batch: string) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${email}/${batch}`);
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  updateTasks: async (email: string, batch: string, tasks: any[]) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${email}/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Scores
  getScores: async (email: string, batch: string) => {
    const res = await fetch(`${API_BASE_URL}/scores/${email}/${batch}`);
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  updateScores: async (email: string, batch: string, scores: any[]) => {
    const res = await fetch(`${API_BASE_URL}/scores/${email}/${batch}`, {
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
