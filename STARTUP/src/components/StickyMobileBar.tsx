import { MessageSquare, Calendar, Sparkles } from 'lucide-react';

interface StickyMobileBarProps {
  onBookCall: () => void;
  activeTrack: 'neet' | 'jee';
}

export default function StickyMobileBar({ onBookCall, activeTrack }: StickyMobileBarProps) {
  const targetLabel = activeTrack === 'neet' ? 'NEET' : 'JEE';
  const whatsappUrl = `https://wa.me/918340384877?text=${encodeURIComponent(
    `Hi RestartClub! I am preparing for ${targetLabel}. I want to try the 24/7 AI WhatsApp Doubt Assistant and connect with an AIR mentor!`
  )}`;

  return (
    <div className="sticky-mobile-bar">
      <div className="sticky-bar-content">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-btn-secondary"
        >
          <MessageSquare size={16} />
          <span>WhatsApp 24/7</span>
        </a>

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
