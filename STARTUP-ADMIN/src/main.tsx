import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import AdminDashboard from './components/AdminDashboard';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'abhishek.711p@gmail.com' && password === 'Aa@1122334455') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary, #fcfcfc)',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px 32px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #111827',
          boxShadow: '4px 4px 0px #111827'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827' }}>Admin Login</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '8px', fontWeight: '500' }}>Enter your credentials to access the portal</p>
          </div>
          
          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem', textAlign: 'center', fontWeight: 'bold', border: '2px solid #b91c1c' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', marginBottom: '6px', color: '#111827' }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid #111827', outline: 'none', fontWeight: '500' }}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', marginBottom: '6px', color: '#111827' }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid #111827', outline: 'none', fontWeight: '500' }}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', marginTop: '8px', borderRadius: '8px', border: '2px solid #111827', background: '#ef4444', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '2px 2px 0px #111827' }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDashboard onLogout={() => {
        setIsAuthenticated(false);
        // We can just set state rather than reload, but keep the window redirect if they want to exit entirely.
        // window.location.href = 'http://localhost:5175/';
      }} />
      <Analytics />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
