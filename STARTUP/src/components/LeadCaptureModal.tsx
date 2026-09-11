import React, { useState } from 'react';
import { X, CheckCircle, User, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: 'neet' | 'jee';
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  defaultTrack = 'neet'
}: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [track, setTrack] = useState<'neet' | 'jee'>(defaultTrack);
  const [currentClass, setCurrentClass] = useState<'10' | '11' | '12' | 'dropper'>('12');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validatePhone = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length === 0) {
      setPhoneError('WhatsApp number is required');
      return false;
    }
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleaned)) {
      setPhoneError('Please enter a valid 10-digit Indian number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (val.length === 10) {
      validatePhone(val);
    } else if (val.length > 0) {
      setPhoneError('Must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!validatePhone(phone)) return;

    setIsSubmitting(true);

    const classNameMap = {
      '10': 'Class 10',
      '11': 'Class 11',
      '12': 'Class 12',
      'dropper': 'Dropper'
    };

    const targetExamLabel = track === 'neet' ? 'NEET Aspirant' : 'JEE Main + Adv';

    try {
      await api.saveDemoCall({
        name: name.trim(),
        number: `+91 ${phone}`,
        batch: targetExamLabel,
        class: classNameMap[currentClass]
      });
    } catch (err) {
      console.error("Failed to save demo call", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const classNameMap = {
    '10': 'Class 10',
    '11': 'Class 11',
    '12': 'Class 12',
    'dropper': 'Dropper'
  };
  const targetExamLabel = track === 'neet' ? 'NEET Aspirant' : 'JEE Main + Adv';
  const whatsappDmUrl = `https://wa.me/917568864993?text=${encodeURIComponent(`Hello RestartClub Mentor Team! 👋\n\nI want to book my Free 1-on-1 Strategy Call:\nname = ${name.trim()}\nnumber = +91 ${phone}\nbatch = ${targetExamLabel}\nclass = ${classNameMap[currentClass]}`)}`;

  return (
    <div className="lead-modal-overlay" onClick={onClose}>
      <div className="lead-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Close Button */}
        <button className="lead-modal-close" onClick={onClose} aria-label="Close modal" type="button">
          <X size={16} />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Clean Header */}
            <div className="lead-modal-header">
              <div className="lead-pill-badge">
                <Sparkles size={13} className="text-emerald" /> Free 1-on-1 Mentorship Call
              </div>
              <h3 className="lead-modal-title">Book Your Strategy Call</h3>
              <p className="lead-modal-desc">
                Get paired with an AIR Topper from AIIMS / IIT for a personalized backlog audit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="lead-form">
              
              {/* Full Name */}
              <div className="lead-field">
                <label className="lead-label">Full Name</label>
                <div className="lead-input-box">
                  <User size={16} className="lead-field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="lead-clean-input"
                  />
                </div>
              </div>

              {/* WhatsApp Number with Integrated Flag & Prefix */}
              <div className="lead-field">
                <label className="lead-label">WhatsApp Number</label>
                <div className={`lead-phone-unified ${phoneError ? 'lead-phone-error' : ''}`}>
                  <span className="lead-phone-badge">🇮🇳 +91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="lead-phone-input-clean"
                  />
                </div>
                {phoneError && <span className="lead-error-text">{phoneError}</span>}
              </div>

              {/* Stream Switcher */}
              <div className="lead-field">
                <label className="lead-label">Target Stream</label>
                <div className="lead-stream-grid">
                  <button
                    type="button"
                    className={`lead-stream-btn ${track === 'neet' ? 'active-neet' : ''}`}
                    onClick={() => setTrack('neet')}
                  >
                    🩺 NEET Aspirant
                  </button>
                  <button
                    type="button"
                    className={`lead-stream-btn ${track === 'jee' ? 'active-jee' : ''}`}
                    onClick={() => setTrack('jee')}
                  >
                    ⚡ JEE Main + Adv
                  </button>
                </div>
              </div>

              {/* Class / Grade Selector */}
              <div className="lead-field">
                <label className="lead-label">Current Class / Target</label>
                <div className="lead-grade-pills">
                  {(['10', '11', '12', 'dropper'] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      className={`lead-grade-pill ${currentClass === cls ? 'active' : ''}`}
                      onClick={() => setCurrentClass(cls)}
                    >
                      {cls === 'dropper' ? 'Dropper' : `Class ${cls}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button type="submit" disabled={isSubmitting} className="lead-submit-btn">
                <span>{isSubmitting ? 'Submitting Request...' : 'Claim Free Strategy Call'}</span>
                <ArrowRight size={16} />
              </button>

              <div className="lead-trust-line">
                <span>🔒 100% Free • No Spam • We Connect on WhatsApp</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="lead-success-state" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div className="success-icon-wrap" style={{ margin: '0 auto 16px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={40} className="text-emerald" style={{ color: '#22c55e' }} />
            </div>
            <h3 className="lead-success-title" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffffff', marginBottom: '8px' }}>
              Strategy Call Request Received! 🎉
            </h3>
            <p className="lead-success-desc" style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Thank you, <strong style={{ color: '#ffffff' }}>{name}</strong>! Your request for <strong style={{ color: '#22c55e' }}>{targetExamLabel} ({classNameMap[currentClass]})</strong> has been submitted. Our senior mentor team will reach out to you on WhatsApp (<strong style={{ color: '#ffffff' }}>+91 {phone}</strong>) within 12 hours!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="lead-submit-btn"
                style={{ width: '100%', padding: '12px', background: '#22c55e', color: '#ffffff', fontWeight: '800', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                onClick={onClose}
              >
                Done / Back to Website
              </button>

              <a
                href={whatsappDmUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#a1a1aa',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'color 0.2s ease'
                }}
              >
                <MessageSquare size={14} style={{ color: '#22c55e' }} />
                <span>Want faster response? Chat directly with Mentor on WhatsApp →</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
