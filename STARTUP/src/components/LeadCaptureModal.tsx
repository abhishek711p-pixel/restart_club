import React, { useState } from 'react';
import { X, CheckCircle, MessageSquare, User, ArrowRight, Sparkles } from 'lucide-react';

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
  const [whatsappUrl, setWhatsappUrl] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!validatePhone(phone)) return;

    const classNameMap = {
      '10': 'Class 10',
      '11': 'Class 11',
      '12': 'Class 12',
      'dropper': 'Dropper'
    };

    const targetExamLabel = track === 'neet' ? 'NEET Aspirant' : 'JEE Main + Adv';
    const message = `Hello RestartClub Mentor Team! 👋\n\nI want to book my Free 1-on-1 Strategy Call:\nname = ${name.trim()}\nnumber = +91 ${phone}\nbatch = ${targetExamLabel}\nclass = ${classNameMap[currentClass]}`;

    const encoded = encodeURIComponent(message);
    const link = `https://wa.me/917568864993?text=${encoded}`;
    setWhatsappUrl(link);
    setIsSubmitted(true);

    // Automatically trigger WhatsApp direct message link
    try {
      window.open(link, '_blank');
    } catch {
      // Handled by modal CTA button fallback
    }

    try {
      const existingLeads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
      existingLeads.push({
        name: name.trim(),
        phone: `+91 ${phone}`,
        batch: targetExamLabel,
        currentClass: classNameMap[currentClass],
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('rc_leads', JSON.stringify(existingLeads));
    } catch {
      // ignore
    }
  };

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
              <button type="submit" className="lead-submit-btn">
                <span>Claim Free Strategy Call</span>
                <ArrowRight size={16} />
              </button>

              <div className="lead-trust-line">
                <span>🔒 100% Free • No Spam • Instant WhatsApp Connection</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="lead-success-state">
            <div className="success-icon-wrap">
              <CheckCircle size={46} className="text-emerald" />
            </div>
            <h3 className="lead-success-title">Call Request Received! 🎉</h3>
            <p className="lead-success-desc">
              Hi <strong>{name}</strong>, our senior mentor is ready to connect with you. Click below to start on WhatsApp.
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
              Close & Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
