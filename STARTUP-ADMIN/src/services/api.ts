let RAW_URL = import.meta.env.VITE_API_URL;
if (!RAW_URL) {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    RAW_URL = '/api';
  } else {
    RAW_URL = 'https://restart-club.vercel.app/api';
  }
}
if (RAW_URL.startsWith('ttps://')) RAW_URL = 'h' + RAW_URL;
const API_BASE_URL = RAW_URL.replace(/\/+$/, '');

// Fast in-memory cache for GET requests with 3s TTL to deduplicate rapid queries
const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 3000;

async function fetchWithCache(url: string, options?: RequestInit): Promise<any> {
  const cacheKey = url;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      return { error: `Server responded with status ${res.status}` };
    }
    const data = await res.json();
    cache.set(cacheKey, { timestamp: now, data });
    return data;
  } catch (e) {
    return { error: "Network or Server Error" };
  }
}

function invalidateCache(urlSubstring?: string) {
  if (!urlSubstring) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(urlSubstring)) {
      cache.delete(key);
    }
  }
}

export const api = {
  // Users
  getUsers: async () => {
    return fetchWithCache(`${API_BASE_URL}/users`);
  },
  sendRegisterOtp: async (data: { email: string }) => {
    const res = await fetch(`${API_BASE_URL}/users/send-register-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  registerUser: async (data: any) => {
    invalidateCache('users');
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
    invalidateCache();
    const res = await fetch(`${API_BASE_URL}/users/update-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  togglePayment: async (email: string, batch?: string, tier: 'standard' | 'premium' = 'premium') => {
    invalidateCache();
    const res = await fetch(`${API_BASE_URL}/users/toggle-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, batch, tier })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  deleteUser: async (email: string) => {
    invalidateCache('users');
    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}`, {
      method: 'DELETE'
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  deleteUserBatch: async (email: string, batch: string) => {
    invalidateCache();
    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}/batch/${encodeURIComponent(batch)}`, {
      method: 'DELETE'
    });
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
    invalidateCache();
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Payment verification failed');
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Tasks
  getTasks: async (email: string, batch: string = '12') => {
    return fetchWithCache(`${API_BASE_URL}/tasks/${email}/${batch}`);
  },
  updateTasks: async (email: string, arg2: any, arg3?: any[]) => {
    const batch = typeof arg2 === 'string' ? arg2 : '12';
    const tasks = Array.isArray(arg2) ? arg2 : arg3 || [];
    invalidateCache(`tasks/${email}/${batch}`);
    const res = await fetch(`${API_BASE_URL}/tasks/${email}/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Scores
  getScores: async (email: string, batch: string) => {
    return fetchWithCache(`${API_BASE_URL}/scores/${email}/${batch}`);
  },
  updateScores: async (email: string, batch: string, scores: any[]) => {
    invalidateCache(`scores/${email}/${batch}`);
    const res = await fetch(`${API_BASE_URL}/scores/${email}/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Study Hours
  getStudyHours: async (email: string, batch: string) => {
    return fetchWithCache(`${API_BASE_URL}/study-hours/${email}/${batch}`);
  },
  updateStudyHours: async (email: string, batch: string, hours: any) => {
    invalidateCache(`study-hours/${email}/${batch}`);
    const res = await fetch(`${API_BASE_URL}/study-hours/${email}/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hours)
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Notices
  getNotices: async (batch: string) => {
    return fetchWithCache(`${API_BASE_URL}/notices/${batch}`);
  },
  createNotice: async (batch: string, message: string) => {
    invalidateCache(`notices/${batch}`);
    const res = await fetch(`${API_BASE_URL}/notices/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },
  deleteNotice: async (id: string) => {
    invalidateCache('notices');
    const res = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: 'DELETE'
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Planners (Templates)
  getBatchPlanner: async (batch: string) => {
    return fetchWithCache(`${API_BASE_URL}/templates/planner/${batch}`);
  },
  updateBatchPlanner: async (batch: string, planners: any[]) => {
    invalidateCache(`templates/planner/${batch}`);
    const res = await fetch(`${API_BASE_URL}/templates/planner/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planners })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Notes (Templates)
  getBatchNotes: async (batch: string, email?: string, onlyStudent?: boolean) => {
    let url = `${API_BASE_URL}/templates/notes/${batch}`;
    const params = [];
    if (email) params.push(`email=${encodeURIComponent(email)}`);
    if (onlyStudent) params.push(`onlyStudent=true`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return fetchWithCache(url);
  },
  updateBatchNotes: async (batch: string, notes: any[], email?: string) => {
    invalidateCache(`templates/notes/${batch}`);
    const res = await fetch(`${API_BASE_URL}/templates/notes/${batch}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, email })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Chat
  getChat: async (email: string) => {
    return fetchWithCache(`${API_BASE_URL}/chat/${email}`);
  },
  updateChat: async (email: string, chat: any[]) => {
    invalidateCache(`chat/${email}`);
    const res = await fetch(`${API_BASE_URL}/chat/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat })
    });
    try { return await res.json(); } catch(e) { return { error: "Network or Server Error" }; }
  },

  // Demo Call / Strategy Requests
  getDemoCalls: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/demo-calls`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // fallback to localStorage
    }
    try {
      const local = JSON.parse(localStorage.getItem('rc_leads') || '[]');
      return Array.isArray(local) ? local : [];
    } catch {
      return [];
    }
  },
  saveDemoCall: async (lead: { name: string; number: string; batch: string; class: string }) => {
    const newEntry = {
      id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: lead.name,
      number: lead.number,
      batch: lead.batch,
      class: lead.class,
      timestamp: new Date().toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('rc_leads') || '[]');
      existing.unshift(newEntry);
      localStorage.setItem('rc_leads', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }
    try {
      await fetch(`${API_BASE_URL}/demo-calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
    } catch {
      // ignore
    }
    return { success: true, lead: newEntry };
  },
  deleteDemoCall: async (idOrTimestamp: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem('rc_leads') || '[]');
      const filtered = existing.filter((l: any) => l.id !== idOrTimestamp && l.timestamp !== idOrTimestamp);
      localStorage.setItem('rc_leads', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
    try {
      await fetch(`${API_BASE_URL}/demo-calls/${idOrTimestamp}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    return { success: true };
  }
};
