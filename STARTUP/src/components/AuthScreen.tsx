import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, BookOpen, X, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

interface AuthScreenProps {
  onSuccess: (user: { username: string; email: string; batch: string }) => void;
  onBack: () => void;
  defaultBatch: string;
}

export default function AuthScreen({ onSuccess, onBack, defaultBatch }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-email' | 'forgot-otp'>('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [batch, setBatch] = useState(defaultBatch || '12');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (
      !email || 
      ((mode === 'login' || mode === 'register') && !password) || 
      (mode === 'register' && !username)
    ) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        const response = await api.registerUser({ username, email, password, batch, otp: '' });
        if (response.error) {
          setError(response.error);
          return;
        }
        onSuccess({ username, email, batch });
      } else if (mode === 'login') {
        const response = await api.loginUser({ email, password });
        if (response.error) {
          setError(response.error);
          return;
        }
        onSuccess({ username: response.user.username, email, batch: response.user.batch });
      } else if (mode === 'forgot-email') {
        const response = await api.forgotPassword({ email });
        if (response.error) {
          setError(response.error);
          return;
        }
        setMessage('OTP sent to your email! Please check your inbox.');
        setMode('forgot-otp');
      } else if (mode === 'forgot-otp') {
        if (!otp || !newPassword) {
          setError('Please provide OTP and new password.');
          setIsLoading(false);
          return;
        }
        const response = await api.resetPassword({ email, otp, newPassword });
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }
        setMessage('Password reset successful! You can now sign in.');
        setMode('login');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Floating Back button top left */}
      <button 
        onClick={onBack}
        className="auth-floating-back"
        type="button"
      >
        <ArrowLeft size={16} /> Back to Website
      </button>

      {/* Main Glassmorphic Auth Card */}
      <div className="auth-modal-card">
        {/* Top Close Button */}
        <button 
          onClick={onBack}
          className="auth-close-btn"
          aria-label="Close"
          type="button"
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            cursor: 'pointer'
          }} onClick={onBack}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(255,255,255,0.15)',
              border: '1.5px solid #ffffff',
              flexShrink: 0
            }}>
              <img src="/logo.png" alt="RestartClub Logo" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Restart <span style={{ color: '#22c55e' }}>Club</span>
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginBottom: '4px' }}>
            {mode === 'register' ? 'Create Your Account' : 
             mode === 'login' ? 'Welcome Back' : 
             mode === 'forgot-email' ? 'Reset Password' : 'Verify OTP'}
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>
            {mode === 'register' ? 'Start your preparation with dedicated topper mentors.' : 
             mode === 'login' ? 'Sign in to access your study planner, notes & dashboard.' : 
             mode === 'forgot-email' ? 'Enter your registered email to receive a password reset OTP.' : 
             'Enter the 6-digit OTP code and choose your new password.'}
          </p>
        </div>

        {/* Mode Selector Tabs (Sign Up / Sign In) */}
        {(mode === 'register' || mode === 'login') && (
          <div className="auth-mode-tabs">
            <button 
              type="button"
              className={`auth-mode-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); setMessage(''); }}
            >
              Sign Up
            </button>
            <button 
              type="button"
              className={`auth-mode-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); setMessage(''); }}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {error && <div className="auth-alert-error">⚠️ {error}</div>}
        {message && <div className="auth-alert-success">✅ {message}</div>}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User Name */}
          {mode === 'register' && (
            <div className="auth-field-group">
              <label className="auth-field-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="auth-text-input"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          {(mode === 'register' || mode === 'login' || mode === 'forgot-email') && (
            <div className="auth-field-group">
              <label className="auth-field-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="auth-text-input"
                  required
                />
              </div>
            </div>
          )}

          {/* Forgot Password OTP and New Password */}
          {mode === 'forgot-otp' && (
            <>
              <div className="auth-field-group">
                <label className="auth-field-label">6-Digit OTP Code</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="auth-text-input"
                    maxLength={6}
                    required
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px', fontWeight: '500' }}>
                  💡 Can't find the email? Please check your <strong>Spam / Junk</strong> folder.
                </p>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">New Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="auth-text-input"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Password (Register & Login) */}
          {(mode === 'register' || mode === 'login') && (
            <div className="auth-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-field-label">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-email');
                      setError('');
                      setMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#22c55e',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="auth-text-input"
                  required
                />
              </div>
            </div>
          )}

          {/* Batch Selector (Register) */}
          {mode === 'register' && (
            <div className="auth-field-group">
              <label className="auth-field-label">Select Your Batch</label>
              <div className="auth-input-wrapper">
                <BookOpen size={16} className="auth-input-icon" />
                <select 
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="auth-select-input"
                >
                  <option value="10">Class 10 (Foundation)</option>
                  <option value="11">Class 11 (Aarambh)</option>
                  <option value="12">Class 12 (Sankalp)</option>
                  <option value="jee-dropper">JEE Dropper</option>
                  <option value="neet-dropper">NEET Dropper</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '14px', color: '#71717a', pointerEvents: 'none' }} />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' :
             mode === 'register' ? 'Join RestartClub' : 
             mode === 'login' ? 'Sign In to Dashboard' : 
             mode === 'forgot-email' ? 'Send OTP Code' : 'Update Password & Sign In'}
          </button>

          {/* Resend OTP Button */}
          {mode === 'forgot-otp' && (
            <button 
              type="button"
              onClick={async () => {
                setError('');
                setMessage('');
                try {
                  const response = await api.forgotPassword({ email });
                  if (response.error) {
                    setError(response.error);
                  } else {
                    setMessage('A new OTP has been sent to your email!');
                  }
                } catch (err) {
                  setError('Failed to resend OTP.');
                }
              }}
              className="auth-footer-link"
              style={{ marginTop: '4px' }}
            >
              Didn't receive the OTP? Click to Resend
            </button>
          )}
        </form>

        {/* Bottom Switcher */}
        <div style={{ marginTop: '24px', borderTop: '1px solid #27272a', paddingTop: '16px', textAlign: 'center' }}>
          {(mode === 'register' || mode === 'login') ? (
            <button 
              type="button"
              onClick={() => {
                setMode(mode === 'register' ? 'login' : 'register');
                setError('');
                setMessage('');
              }}
              className="auth-footer-link"
            >
              {mode === 'register' 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Create one"}
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setMessage('');
              }}
              className="auth-footer-link"
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
