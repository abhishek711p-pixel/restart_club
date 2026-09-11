import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Layers, FileText, Award, HelpCircle, Maximize2, ArrowDown } from 'lucide-react';

interface BookShowcaseProps {
  compact?: boolean;
}

export default function BookShowcase({ compact = false }: BookShowcaseProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const totalPages = 3;

  useEffect(() => {
    if (compact) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the section (0 to 1)
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);

      // Auto flip pages based on scroll progress
      if (progress > 0.15 && !isOpen) {
        setIsOpen(true);
      }

      if (progress >= 0.25 && progress < 0.55 && currentPage !== 1) {
        setCurrentPage(1);
      } else if (progress >= 0.55 && progress < 0.85 && currentPage !== 2) {
        setCurrentPage(2);
      } else if (progress >= 0.85 && currentPage !== 3) {
        setCurrentPage(3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [compact, isOpen, currentPage]);

  const handleNextPage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(prev => (prev < totalPages ? prev + 1 : 1));
      setIsFlipping(false);
    }, 300);
  };

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(prev => (prev > 1 ? prev - 1 : totalPages));
      setIsFlipping(false);
    }, 300);
  };

  const handleZoomThrough = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsZooming(true);
    setTimeout(() => {
      const servicesEl = document.getElementById('services') || document.getElementById('pricing');
      if (servicesEl) {
        servicesEl.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        setIsZooming(false);
      }, 1000);
    }, 600);
  };

  return (
    <section 
      ref={sectionRef} 
      className={`${compact ? "book-showcase-compact" : "book-showcase-section"} ${isZooming ? 'zoom-overlay-active' : ''}`}
    >
      <div className={compact ? "book-container-compact" : "container"}>
        
        {/* Section Header */}
        {!compact && (
          <div className="book-header text-center">
            <div className="badge-pill" style={{ background: '#121214', border: '1px solid #ffffff', color: '#ffffff', boxShadow: '2px 2px 0px #ffffff' }}>
              <BookOpen size={14} style={{ marginRight: '6px' }} /> 3D Interactive Vault Experience
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em', marginTop: '12px' }}>
              Open the Vault & Enter RestartClub
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '640px', margin: '12px auto 24px auto' }}>
              Scroll down or flip pages below to explore our study vault, then zoom directly into the portal!
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.9rem', fontWeight: '700' }}>
              <ArrowDown size={16} className="animate-bounce" /> Scroll down to flip pages & zoom into portal
            </div>
          </div>
        )}

        {/* 3D Interactive Book Canvas Container */}
        <div className={`book-wrapper ${isZooming ? 'zooming-container' : ''}`}>
          
          {/* Spine 3D Texture Effect */}
          <div className="book-3d-spine-shadow"></div>

          <div 
            className={`book-3d ${isOpen ? 'open' : ''} ${isZooming ? 'book-zoom-active' : ''}`} 
            onClick={() => !isZooming && setIsOpen(!isOpen)}
            style={{
              transform: !compact && !isZooming ? `rotateY(${Math.min(0, -15 + scrollProgress * 15)}deg) rotateX(${Math.max(0, 10 - scrollProgress * 10)}deg)` : undefined
            }}
          >
            
            {/* Front Cover */}
            <div className="book-cover front">
              <div className="cover-border">
                <div className="cover-content">
                  <div className="cover-badge">
                    <Sparkles size={16} /> RESTART CLUB
                  </div>
                  <h3 className="cover-title">All-In-One Study Vault</h3>
                  <div className="cover-subtitle">NCERT • PYQs • NOTES • AI DOUBTS</div>
                  <div className="click-to-open-hint">
                    <BookOpen size={18} /> {isOpen ? 'Book Opened! Click to Flip Pages' : 'Click or Scroll to Open Book'}
                  </div>
                </div>
              </div>
            </div>

            {/* Book Pages Content (Inside) */}
            <div className="book-pages-inside">
              
              {/* Left Page */}
              <div className="book-page left-page">
                <div className="page-header-bar">
                  <span className="chapter-tag">RESTART CLUB VAULT</span>
                  <span className="page-num">PAGE {currentPage * 2 - 1}</span>
                </div>
                
                <div className="page-body">
                  {currentPage === 1 && (
                    <div className="page-content-block">
                      <h4 className="block-title"><BookOpen size={18} /> Ultimate Vault Overview</h4>
                      <p className="page-lead-text">
                        All your preparation materials indexed, organized, and verified in one structured portal.
                      </p>
                      <div className="material-list">
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>Class 10–12 NCERT Solutions & Exemplars</span>
                        </div>
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>JEE & NEET 15+ Years Chapterwise PYQs</span>
                        </div>
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>Top Rankers' Crisp Revision Cheat Sheets</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="page-content-block">
                      <h4 className="block-title"><CheckCircle2 size={18} /> High-Yield Material</h4>
                      <p className="page-lead-text">
                        Hand-picked study notes and revision sheets designed for maximum retention and top rank performance.
                      </p>
                      <div className="material-list">
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>1-Page Physics & Chemistry Formula Logs</span>
                        </div>
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>Biomolecules & Organic Reaction Mindmaps</span>
                        </div>
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>Chapterwise Expected Board Questions</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="page-content-block">
                      <h4 className="block-title"><Award size={18} /> Verified & Ad-Free</h4>
                      <p className="page-lead-text">
                        No more searching across 20+ Telegram groups or YouTube descriptions. Everything is verified for you.
                      </p>
                      <div className="material-list">
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>100% Curated for 2026 Board & Entrance Exams</span>
                        </div>
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>Verified by Engineering & Medical Toppers</span>
                        </div>
                        <div className="material-item">
                          <CheckCircle2 size={18} className="item-icon" />
                          <span>Instant PDF Downloads from Student Dashboard</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Page */}
              <div className={`book-page right-page page-${currentPage} ${isFlipping ? 'page-turning' : ''}`}>
                <div className="page-header-bar">
                  <span className="chapter-tag">VERIFIED RESOURCES</span>
                  <span className="page-num">PAGE {currentPage * 2}</span>
                </div>

                <div className="page-body">
                  {currentPage === 1 && (
                    <div className="page-content-block">
                      <h4 className="block-title"><Layers size={18} /> What's Included Inside:</h4>
                      <div className="feature-cards-grid">
                        <div className="mini-feat-card">
                          <FileText size={20} />
                          <div>
                            <strong>Formula Sheets</strong>
                            <p>Physics & Chem 1-pagers</p>
                          </div>
                        </div>
                        <div className="mini-feat-card">
                          <Award size={20} />
                          <div>
                            <strong>Mock Test Series</strong>
                            <p>Full length + Chapterwise</p>
                          </div>
                        </div>
                        <div className="mini-feat-card">
                          <HelpCircle size={20} />
                          <div>
                            <strong>24/7 AI Solver</strong>
                            <p>Instant Hinglish solutions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="page-content-block">
                      <h4 className="block-title"><Sparkles size={18} /> Personalized Study Assistant</h4>
                      <p className="page-lead-text">
                        Track your daily study targets, log your revision hours, and ask any doubt 24/7 directly on WhatsApp.
                      </p>
                      <div className="vault-highlight-pill">
                        ✅ 100% Curated & Updated for 2026 Board / JEE / NEET Exams
                      </div>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="page-content-block text-center">
                      <h4 className="block-title" style={{ justifyContent: 'center' }}>🚀 Ready to Start?</h4>
                      <p className="page-lead-text">
                        Join thousands of students scoring 95%+ in boards and cracking top competitive exams.
                      </p>
                      <button 
                        onClick={handleZoomThrough}
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '12px', gap: '8px', cursor: 'pointer' }}
                      >
                        <Maximize2 size={16} /> Zoom into Portal Now
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Navigation Controls */}
          {isOpen && (
            <div className="book-controls">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="control-btn"
              >
                <ChevronLeft size={18} /> Previous Page
              </button>
              <span className="page-indicator">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="control-btn"
              >
                Next Page <ChevronRight size={18} />
              </button>
              <button
                onClick={handleZoomThrough}
                className="control-btn zoom-btn-accent"
              >
                <Maximize2 size={16} /> Zoom Into Website
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

