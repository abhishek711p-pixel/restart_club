import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, BookOpen, Key } from 'lucide-react';
import { api } from '../services/api';

interface AuthScreenProps {
  onSuccess: (user: { username: string; email: string; batch: string }) => void;
  onBack: () => void;
  defaultBatch: string;
}

// Reverted to Email OTP authentication flow
export default function AuthScreen({ onSuccess, onBack, defaultBatch }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'register-otp' | 'forgot-email' | 'forgot-otp'>('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [registerOtp, setRegisterOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [batch, setBatch] = useState(defaultBatch);
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
        const response = await api.sendRegisterOtp({ email });
        if (response.error) {
          setError(response.error);
          return;
        }
        setMessage(`Verification code sent to ${email}. Please enter it below to complete registration.`);
        setMode('register-otp');
      } else if (mode === 'register-otp') {
        if (!registerOtp) {
          setError('Please enter the 6-digit verification code sent to your email.');
          setIsLoading(false);
          return;
        }
        const response = await api.registerUser({ username, email, password, batch, otp: registerOtp });
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
          <img src="/logo.png" alt="RestartClub Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
          <span className="logo-text">Restart <span className="logo-highlight">Club</span></span>
        </div>

        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '8px'
        }}>
          {mode === 'register' ? 'Join RestartClub' : 
           mode === 'register-otp' ? 'Verify Your Email' :
           mode === 'login' ? 'Welcome Back' : 
           mode === 'forgot-email' ? 'Reset Password' : 'Enter OTP'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {mode === 'register' ? 'Start your journey to top ranks today.' : 
           mode === 'register-otp' ? `We sent a 6-digit OTP code to ${email}` :
           mode === 'login' ? 'Resume your preparation.' : 
           mode === 'forgot-email' ? 'Enter your email to receive an OTP.' : 'Enter the 6-digit OTP and your new password.'}
        </p>

        {error && (
          <div style={{
            padding: '12px',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: '12px',
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {message}
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

          {(mode === 'register' || mode === 'login' || mode === 'forgot-email') && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
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

          {mode === 'forgot-otp' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>
                  6-DIGIT OTP
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
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
                  NEW PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
            </>
          )}

          {(mode === 'register' || mode === 'login') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#111827' }}>
                  PASSWORD
                </label>
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
                      color: 'var(--accent-color)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
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
          )}

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

          {mode === 'register-otp' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>
                EMAIL VERIFICATION CODE (OTP)
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text"
                  required
                  placeholder="Enter 6-digit verification code"
                  value={registerOtp}
                  onChange={(e) => setRegisterOtp(e.target.value)}
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '10px',
                    border: '2px solid var(--border-color)',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    letterSpacing: '2px',
                    outline: 'none',
                    background: '#ffffff',
                    fontFamily: 'var(--sans-font)'
                  }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-accent w-full"
            disabled={isLoading}
            style={{
              padding: '14px',
              fontSize: '1rem',
              fontWeight: '800',
              marginTop: '10px',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Processing...' :
             mode === 'register' ? 'Verify Email & Join' : 
             mode === 'register-otp' ? 'Complete Registration' :
             mode === 'login' ? 'Sign In' : 
             mode === 'forgot-email' ? 'Send OTP' : 'Reset Password'}
          </button>

          {mode === 'register-otp' && (
            <button 
              type="button"
              onClick={async () => {
                setError('');
                setMessage('');
                try {
                  const response = await api.sendRegisterOtp({ email });
                  if (response.error) {
                    setError(response.error);
                  } else {
                    setMessage(`A new verification OTP has been sent to ${email}!`);
                  }
                } catch (err) {
                  setError('Failed to resend OTP.');
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-color)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                marginTop: '8px'
              }}
            >
              Didn't receive the verification code? Resend Code
            </button>
          )}

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
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-color)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                marginTop: '8px'
              }}
            >
              Didn't receive the OTP? Resend it
            </button>
          )}
        </form>

        <div style={{ marginTop: '24px', borderTop: '2px solid var(--border-color)', paddingTop: '16px' }}>
          <button 
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register');
              setError('');
              setMessage('');
            }}
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
          
          {(mode === 'forgot-email' || mode === 'forgot-otp') && (
            <button 
              onClick={() => {
                setMode('login');
                setError('');
                setMessage('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                display: 'block',
                marginTop: '10px',
                width: '100%'
              }}
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
