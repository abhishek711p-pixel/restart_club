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
        background: '#09090b',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px 32px',
          background: '#121215',
          borderRadius: '16px',
          border: '1.5px solid #27272a',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff' }}>Admin Login</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginTop: '8px', fontWeight: '500' }}>Enter your credentials to access the portal</p>
          </div>
          
          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem', textAlign: 'center', fontWeight: 'bold' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', marginBottom: '6px', color: '#e4e4e7' }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #27272a', background: '#18181b', color: '#ffffff', outline: 'none', fontWeight: '500' }}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', marginBottom: '6px', color: '#e4e4e7' }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #27272a', background: '#18181b', color: '#ffffff', outline: 'none', fontWeight: '500' }}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', marginTop: '8px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '800', cursor: 'pointer' }}>
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
