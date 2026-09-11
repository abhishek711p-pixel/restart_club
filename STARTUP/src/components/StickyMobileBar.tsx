import { Calendar, Sparkles, UserCheck } from 'lucide-react';

interface StickyMobileBarProps {
  onBookCall: () => void;
  onLoginClick: () => void;
  activeTrack?: 'neet' | 'jee';
}

export default function StickyMobileBar({ onBookCall, onLoginClick }: StickyMobileBarProps) {
  return (
    <div className="sticky-mobile-bar">
      <div className="sticky-bar-content">
        <button
          type="button"
          onClick={onLoginClick}
          className="sticky-btn-secondary"
        >
          <UserCheck size={16} />
          <span>Student Sign In</span>
        </button>

        <button
          type="button"
          onClick={onBookCall}
          className="sticky-btn-primary"
        >
          <Calendar size={16} />
          <span>Book Free Call <Sparkles size={12} className="inline-sparkle" /></span>
        </button>
      </div>
    </div>
  );
}
