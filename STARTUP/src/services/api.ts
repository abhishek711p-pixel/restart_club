const API_BASE_URL = 'http://localhost:5001/api';

export const api = {
  // Users
  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/users`);
    return res.json();
  },
  registerUser: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  loginUser: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  forgotPassword: async (data: { email: string }) => {
    const res = await fetch(`${API_BASE_URL}/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  resetPassword: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updatePassword: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/update-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateUserBatch: async (data: { email: string, batch: string }) => {
    const res = await fetch(`${API_BASE_URL}/users/update-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  togglePayment: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/users/toggle-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Failed to toggle payment');
    return res.json();
  },

  // Payment Gateway
  createPaymentOrder: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  verifyPayment: async (data: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, email: string, batch: string, tier?: 'standard' | 'premium' }) => {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Payment verification failed');
    return res.json();
  },

  // Tasks
  getTasks: async (email: string, batch: string) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${email}/${batch}`);
    return res.json();
  },
  updateTasks: async (email: string, batch: string, tasks: any[]) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${email}/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
    });
    return res.json();
  },

  // Scores
  getScores: async (email: string, batch: string) => {
    const res = await fetch(`${API_BASE_URL}/scores/${email}/${batch}`);
    return res.json();
  },
  updateScores: async (email: string, batch: string, scores: any[]) => {
    const res = await fetch(`${API_BASE_URL}/scores/${email}/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores })
    });
    return res.json();
  },

  // Planners (Templates)
  getBatchPlanner: async (batch: string) => {
    const res = await fetch(`${API_BASE_URL}/templates/planner/${batch}`);
    return res.json();
  },
  updateBatchPlanner: async (batch: string, planners: any[]) => {
    const res = await fetch(`${API_BASE_URL}/templates/planner/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planners })
    });
    return res.json();
  },

  // Notes (Templates)
  getBatchNotes: async (batch: string) => {
    const res = await fetch(`${API_BASE_URL}/templates/notes/${batch}`);
    return res.json();
  },
  updateBatchNotes: async (batch: string, notes: any[]) => {
    const res = await fetch(`${API_BASE_URL}/templates/notes/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    return res.json();
  },

  // Chat
  getChat: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/chat/${email}`);
    return res.json();
  },
  updateChat: async (email: string, chat: any[]) => {
    const res = await fetch(`${API_BASE_URL}/chat/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat })
    });
    return res.json();
  }
};
