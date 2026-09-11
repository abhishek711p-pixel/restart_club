import React, { useState } from 'react';
import { X, CheckCircle, MessageSquare, User, Sparkles, ArrowRight } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: 'neet' | 'jee';
  title?: string;
  subtitle?: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  defaultTrack = 'neet',
  title = "Book Your 1-on-1 Strategy Call (Free)",
  subtitle = "Get a customized study roadmap & backlog analysis from an AIR Topper."
}: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [track, setTrack] = useState<'neet' | 'jee'>(defaultTrack);
  const [currentClass, setCurrentClass] = useState<'10' | '11' | '12' | 'dropper'>('12');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  if (!isOpen) return null;

  const validatePhone = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length === 0) {
      setPhoneError('Phone number is required');
      return false;
    }
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleaned)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!validatePhone(phone)) return;

    const classNameMap = {
      '10': 'Class 10 Foundation',
      '11': 'Class 11',
      '12': 'Class 12',
      'dropper': `${track.toUpperCase()} Dropper`
    };

    const targetExamLabel = track === 'neet' ? 'NEET UG' : 'JEE Main + Advanced';
    const message = `Hello RestartClub Mentor Team! 👋\n\nI want to book my Free 1-on-1 Strategy Call.\n• Name: ${name.trim()}\n• Target Exam: ${targetExamLabel}\n• Class/Status: ${classNameMap[currentClass]}\n• WhatsApp: +91 ${phone}\n\nPlease share my personalized study plan & connect me with a mentor!`;

    const encoded = encodeURIComponent(message);
    const link = `https://wa.me/918340384877?text=${encoded}`;
    setWhatsappUrl(link);
    setIsSubmitted(true);

    // Also store lead locally for analytics
    try {
      const existingLeads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
      existingLeads.push({
        name: name.trim(),
        phone,
        track,
        currentClass,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('rc_leads', JSON.stringify(existingLeads));
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="lead-modal-overlay" onClick={onClose}>
      <div className="lead-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="lead-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="lead-modal-header">
              <div className="lead-badge-pill">
                <Sparkles size={13} className="text-emerald" /> 100% Free • No Card Required
              </div>
              <h3 className="lead-modal-title">{title}</h3>
              <p className="lead-modal-desc">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="lead-form">
              {/* Full Name */}
              <div className="lead-field">
                <label className="lead-label">Your Full Name</label>
                <div className="lead-input-wrap">
                  <User size={16} className="lead-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="lead-input"
                  />
                </div>
              </div>

              {/* WhatsApp Number with +91 Prefix */}
              <div className="lead-field">
                <label className="lead-label">WhatsApp Number</label>
                <div className="lead-input-wrap">
                  <div className="lead-phone-prefix">🇮🇳 +91</div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`lead-input lead-phone-input ${phoneError ? 'error-border' : ''}`}
                  />
                </div>
                {phoneError && <span className="lead-error-text">{phoneError}</span>}
              </div>

              {/* Target Exam Switcher */}
              <div className="lead-field">
                <label className="lead-label">Target Exam</label>
                <div className="lead-track-toggle">
                  <button
                    type="button"
                    className={`lead-track-btn ${track === 'neet' ? 'active neet' : ''}`}
                    onClick={() => setTrack('neet')}
                  >
                    🩺 NEET UG
                  </button>
                  <button
                    type="button"
                    className={`lead-track-btn ${track === 'jee' ? 'active jee' : ''}`}
                    onClick={() => setTrack('jee')}
                  >
                    ⚡ JEE Main + Adv
                  </button>
                </div>
              </div>

              {/* Class / Status */}
              <div className="lead-field">
                <label className="lead-label">Current Academic Class</label>
                <div className="lead-chips-grid">
                  {(['10', '11', '12', 'dropper'] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      className={`lead-chip ${currentClass === cls ? 'active' : ''}`}
                      onClick={() => setCurrentClass(cls)}
                    >
                      {cls === 'dropper' ? 'Dropper Batch' : `Class ${cls}`}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="lead-submit-btn">
                <span>Book Free Call & Get PDF Roadmap</span>
                <ArrowRight size={16} />
              </button>

              <div className="lead-trust-footer">
                <span>🔒 Your number is 100% private. We never spam.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="lead-success-state">
            <div className="success-icon-wrap">
              <CheckCircle size={48} className="text-emerald" />
            </div>
            <h3 className="lead-success-title">Call Request Received! 🎉</h3>
            <p className="lead-success-desc">
              Hi <strong>{name}</strong>, our senior mentor from <strong>{track === 'neet' ? 'AIIMS / Top GMC' : 'IIT Bombay / Delhi'}</strong> is ready to connect. Click below to confirm via WhatsApp instantly.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lead-whatsapp-btn"
            >
              <MessageSquare size={18} />
              <span>Continue on WhatsApp Now</span>
            </a>

            <button
              type="button"
              className="lead-close-secondary"
              onClick={onClose}
            >
              Close & Browse Platform
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
