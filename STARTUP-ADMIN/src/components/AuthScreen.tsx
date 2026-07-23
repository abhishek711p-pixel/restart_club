import React, { useState } from 'react';
import { Compass, Mail, Lock, User, ArrowLeft, BookOpen } from 'lucide-react';
import { api } from '../services/api';

interface AuthScreenProps {
  onSuccess: (user: { username: string; email: string; batch: string }) => void;
  onBack: () => void;
  defaultBatch: string;
}

export default function AuthScreen({ onSuccess, onBack, defaultBatch }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [batch, setBatch] = useState(defaultBatch);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (mode === 'register' && !username)) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (mode === 'register') {
        const response = await api.registerUser({ username, email, password, batch });
        if (response.error) {
          setError(response.error);
          return;
        }
        onSuccess({ username, email, batch });
      } else {
        const response = await api.loginUser({ email, password });
        if (response.error) {
          setError(response.error);
          return;
        }
        onSuccess({ username: response.user.username, email, batch: response.user.batch });
      }
    } catch (err) {
      setError('Failed to connect to the server. Please ensure the backend is running.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--bg-primary)',
      position: 'relative'
    }}>
      <button 
        onClick={onBack}
        className="btn btn-secondary"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          padding: '8px 16px',
          borderRadius: '10px',
          fontSize: '0.85rem'
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        background: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div className="logo-icon-wrapper">
            <Compass className="logo-icon animate-spin-slow" />
          </div>
          <span className="logo-text">Restart <span className="logo-highlight">Club</span></span>
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', color: '#111827' }}>
          {mode === 'register' ? 'Join the Family' : 'Welcome Back'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {mode === 'register' 
            ? 'Sign up to access your 1-on-1 mentor & study planners.' 
            : 'Sign in to check your active batch & message your mentor.'}
        </p>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '2px solid #ef4444',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: '700',
            textAlign: 'left',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>
                USER NAME
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '10px',
                    border: '2px solid var(--border-color)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'var(--sans-font)'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>
              EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'var(--sans-font)'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'var(--sans-font)'
                }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>
                SELECT YOUR BATCH
              </label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
                <select 
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '10px',
                    border: '2px solid var(--border-color)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    background: '#ffffff',
                    fontFamily: 'var(--sans-font)',
                    appearance: 'none',
                    fontWeight: '700'
                  }}
                >
                  <option value="10">Class 10 (Foundation)</option>
                  <option value="11">Class 11 (Aarambh)</option>
                  <option value="12">Class 12 (Sankalp)</option>
                  <option value="jee-dropper">JEE Dropper</option>
                  <option value="neet-dropper">NEET Dropper</option>
                </select>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-accent w-full"
            style={{
              padding: '14px',
              fontSize: '1rem',
              fontWeight: '800',
              marginTop: '10px'
            }}
          >
            {mode === 'register' ? 'Join the Family' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', borderTop: '2px solid var(--border-color)', paddingTop: '16px' }}>
          <button 
            onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-color)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {mode === 'register' 
              ? 'Already have an account? Sign In' 
              : 'New to RestartClub? Join the Family'}
          </button>
        </div>
      </div>
    </div>
  );
}
