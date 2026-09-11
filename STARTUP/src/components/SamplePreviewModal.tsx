import React, { useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight, Lock, Sparkles, Check, ArrowRight } from 'lucide-react';

interface SamplePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: 'neet' | 'jee';
  onBookCall?: () => void;
}

export default function SamplePreviewModal({
  isOpen,
  onClose,
  defaultTrack = 'neet',
  onBookCall
}: SamplePreviewModalProps) {
  const [activeTrack, setActiveTrack] = useState<'neet' | 'jee'>(defaultTrack);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  const neetPages = [
    {
      title: "Human Physiology — Chemical Coordination & Integration",
      subject: "Biology High-Yield Line-by-Line NCERT",
      chapter: "Class 11 Biology • Chapter 22",
      points: [
        "Hypothalamus produces releasing & inhibiting hormones (Somatostatin inhibits GH).",
        "Pituitary Gland: Adenohypophysis (Pars Distalis + Pars Intermedia) & Neurohypophysis (Pars Nervosa).",
        "Thyroid: Follicular cells produce T3 & T4 (requires Iodine). Calcitonin (TCT) lowers blood calcium level.",
        "Parathyroid Hormone (PTH): Hypercalcemic hormone (increases blood Ca2+ absorption from renal tubules).",
        "Adrenal Cortex: Glucocorticoids (Cortisol - gluconeogenesis, anti-inflammatory), Mineralocorticoids (Aldosterone)."
      ],
      diagramLabel: "🔬 High-Probability Diagram: Hormonal Feedback Loop (Repeated 6 Times in NEET PYQs)",
      pageNumber: "Page 1 of 42"
    },
    {
      title: "Genetics & Evolution — Molecular Basis of Inheritance",
      subject: "Biology Short Notes & DNA Replication Mechanisms",
      chapter: "Class 12 Biology • Chapter 6",
      points: [
        "DNA double helix pitch = 3.4 nm; 10 base pairs per turn; distance between bp = 0.34 nm.",
        "Nucleosome: 200 bp DNA wrapped around Histone Octamer (H2A, H2B, H3, H4 x 2) + H1 Histone.",
        "Meselson & Stahl: E. coli grown in 15NH4Cl then shifted to 14NH4Cl (Proved Semiconservative Replication via CsCl density centrifugation).",
        "Leading vs Lagging Strand: DNA Polymerase synthesizes 5' -> 3'. Okazaki fragments joined by DNA Ligase.",
        "Genetic Code: AUG (Dual function: codes for Methionine and acts as Initiator codon)."
      ],
      diagramLabel: "🧬 NCERT Master Chart: Lac Operon Structural Genes (Z: β-gal, Y: Permease, A: Transacetylase)",
      pageNumber: "Page 2 of 42"
    },
    {
      title: "Organic Chemistry — Name Reactions & Mechanism Cheat Sheet",
      subject: "Chemistry Reactions & Reagents Vault",
      chapter: "Aldehydes, Ketones & Carboxylic Acids",
      points: [
        "Rosenmund Reduction: R-COCl + H2 (Pd/BaSO4, poisoned by quinoline/S) -> R-CHO.",
        "Stephen Reaction: R-CN + SnCl2 + HCl followed by H3O+ -> R-CHO.",
        "Etard Reaction: Toluene + CrO2Cl2 (CS2) -> Chromium complex -> Benzaldehyde.",
        "Aldol Condensation: Carbonyl compounds having at least one α-H in presence of dilute alkali form β-hydroxy carbonyl.",
        "Cannizzaro Reaction: Carbonyls WITHOUT α-H in presence of conc. KOH undergo disproportionation."
      ],
      diagramLabel: "🧪 Reaction Flowchart: 1-Step Conversions for 100% Guaranteed NEET Chemistry Marks",
      pageNumber: "Page 3 of 42"
    }
  ];

  const jeePages = [
    {
      title: "Rotational Dynamics & Moment of Inertia Matrix",
      subject: "Physics Advanced Formula & Derivation Log",
      chapter: "Class 11 Physics • Mechanics Core",
      points: [
        "Parallel Axis Theorem: I = I_cm + Md² (valid for any rigid body).",
        "Perpendicular Axis Theorem: Iz = Ix + Iy (strictly valid only for planar laminar bodies in xy plane).",
        "Rolling Motion without slipping on inclined plane: Acceleration a = g sinθ / (1 + I_cm / MR²).",
        "Conservation of Angular Momentum: τ_ext = 0 ⇒ L = Iω = constant.",
        "Pure rolling condition: v_cm = Rω, a_cm = Rα at the instantaneous axis of rotation (point of contact at rest)."
      ],
      diagramLabel: "⚡ JEE Advanced Trap Map: Slipping vs Non-Slipping Friction Directions on Incline",
      pageNumber: "Page 1 of 38"
    },
    {
      title: "Electrodynamics & Gauss's Law Boundary Conditions",
      subject: "Physics Core Derivation & Potential Superposition",
      chapter: "Class 12 Physics • Electromagnetism",
      points: [
        "Electric Field of uniformly charged solid dielectric sphere: Inside (r < R) E = (ρ r) / (3ε0) = (k Q r) / R³.",
        "Self Energy of Spherical charge distribution: U_conducting = kQ²/(2R), U_uniform_solid = 3kQ²/(5R).",
        "Electric Dipole in Non-Uniform field: Force F = p (dE/dx); Torque τ = p × E.",
        "Capacitor with multi-dielectric slabs: Series C_eq = ε0 A / Σ(t_i / k_i); Parallel C_eq = (ε0/d) Σ(k_i A_i).",
        "Conductor Cavity theorem: Induced charge on inner cavity surface = -q_enclosed (Electric field inside metal is always 0)."
      ],
      diagramLabel: "📐 Advanced Boundary Problems: Field & Potential variation curve graphs",
      pageNumber: "Page 2 of 38"
    },
    {
      title: "Coordinate Geometry — Conic Sections Master Formulae",
      subject: "Mathematics Formula & Shortcut Logs",
      chapter: "Parabola, Ellipse & Hyperbola Advanced",
      points: [
        "Parabola y² = 4ax: Tangent at (x1, y1) is yy1 = 2a(x + x1); Slope form: y = mx + a/m.",
        "Ellipse x²/a² + y²/b² = 1: Eccentricity e = √(1 - b²/a²); Director Circle is x² + y² = a² + b².",
        "Hyperbola x²/a² - y²/b² = 1: Asymptotes equation is x²/a² - y²/b² = 0; Angle between asymptotes = 2 tan⁻¹(b/a).",
        "Condition of Common Tangents between Circle & Parabola: substitute slope form and equate discriminant Δ = 0.",
        "Reflection Property: Ray from one focus of ellipse passes through second focus after reflection."
      ],
      diagramLabel: "🎯 JEE Advanced Shortcut: Parametric forms for locus of perpendicular tangents",
      pageNumber: "Page 3 of 38"
    }
  ];

  const currentList = activeTrack === 'neet' ? neetPages : jeePages;
  const pageData = currentList[currentPage - 1];

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = leadPhone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setPhoneError('Please enter a valid 10-digit Indian phone number');
      return;
    }
    setPhoneError('');
    setLeadSubmitted(true);

    const docName = activeTrack === 'neet' ? 'NEET Biology High-Yield Master Vault' : 'JEE Physics & Math Formula Vault';
    const msg = encodeURIComponent(`Hi RestartClub! I previewed the ${docName} samples on the website. Please send the complete un-watermarked 500+ pages PDF pack to my WhatsApp number +91 ${cleaned}! 📚✨`);
    window.open(`https://wa.me/918340384877?text=${msg}`, '_blank');
  };

  return (
    <div className="sample-modal-overlay" onClick={onClose}>
      <div className="sample-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="sample-modal-header">
          <div className="sample-header-left">
            <div className="sample-badge">
              <Sparkles size={14} className="text-emerald" /> Free Sample Preview
            </div>
            <h3 className="sample-title">Topper Handwritten Notes & Formula Logs</h3>
          </div>

          <div className="sample-track-pill">
            <button
              className={`track-pill-btn ${activeTrack === 'neet' ? 'active neet' : ''}`}
              onClick={() => { setActiveTrack('neet'); setCurrentPage(1); }}
            >
              🩺 NEET Vault
            </button>
            <button
              className={`track-pill-btn ${activeTrack === 'jee' ? 'active jee' : ''}`}
              onClick={() => { setActiveTrack('jee'); setCurrentPage(1); }}
            >
              ⚡ JEE Vault
            </button>
          </div>

          <button className="sample-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Two Columns (Page Viewer + Download CTA) */}
        <div className="sample-body-grid">
          {/* Document Viewer */}
          <div className="sample-doc-viewer">
            <div className="sample-doc-page">
              {/* Watermark Diagonal Overlay */}
              <div className="watermark-overlay">
                <span>RESTARTCLUB SAMPLE PREVIEW • JOIN TO UNLOCK ALL 500+ PAGES</span>
                <span>RESTARTCLUB SAMPLE PREVIEW • JOIN TO UNLOCK ALL 500+ PAGES</span>
                <span>RESTARTCLUB SAMPLE PREVIEW • JOIN TO UNLOCK ALL 500+ PAGES</span>
              </div>

              {/* Page Content */}
              <div className="doc-content">
                <div className="doc-meta-bar">
                  <span className="doc-subject-tag">{pageData.subject}</span>
                  <span className="doc-page-counter">{pageData.pageNumber}</span>
                </div>

                <div className="doc-chapter-label">{pageData.chapter}</div>
                <h4 className="doc-page-title">{pageData.title}</h4>

                <div className="doc-notes-list">
                  {pageData.points.map((pt, idx) => (
                    <div key={idx} className="doc-point-row">
                      <span className="doc-point-bullet">✦</span>
                      <p className="doc-point-text">{pt}</p>
                    </div>
                  ))}
                </div>

                <div className="doc-diagram-box">
                  <span className="doc-diagram-text">{pageData.diagramLabel}</span>
                </div>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="sample-pagination-bar">
              <button
                className="page-nav-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} /> Previous Page
              </button>
              <div className="page-indicator-dots">
                {currentList.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  />
                ))}
              </div>
              <button
                className="page-nav-btn"
                disabled={currentPage === currentList.length}
                onClick={() => setCurrentPage(p => Math.min(currentList.length, p + 1))}
              >
                Next Page <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Download & Unlock Sidebar */}
          <div className="sample-sidebar-card">
            <div className="vault-unlock-badge">
              <Lock size={14} /> Full 500+ Page Vault
            </div>

            <h4 className="sidebar-title">Want the Complete High-Yield PDF Vault?</h4>
            <p className="sidebar-desc">
              Get all chapter-wise NCERT Line-by-Line short notes, Physics derivation sheets, and reaction roadmaps delivered to your WhatsApp.
            </p>

            <ul className="sidebar-feature-list">
              <li><Check size={14} className="text-emerald" /> 100% Watermark-Free Crisp PDFs</li>
              <li><Check size={14} className="text-emerald" /> 15+ Years PYQ Mistake Analysis</li>
              <li><Check size={14} className="text-emerald" /> Ready for direct Print / iPad annotation</li>
              <li><Check size={14} className="text-emerald" /> 24/7 WhatsApp AI Solver Integration</li>
            </ul>

            {!leadSubmitted ? (
              <form onSubmit={handleDownloadSubmit} className="sample-download-form">
                <label className="download-label">Enter WhatsApp number for Instant PDF Delivery:</label>
                <div className="download-input-row">
                  <span className="country-code">🇮🇳 +91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`download-input ${phoneError ? 'error-border' : ''}`}
                  />
                </div>
                {phoneError && <span className="lead-error-text">{phoneError}</span>}

                <button type="submit" className="download-cta-btn">
                  <Download size={16} />
                  <span>Send Full PDF on WhatsApp</span>
                </button>
              </form>
            ) : (
              <div className="sample-success-box">
                <Check size={24} className="text-emerald" />
                <h5>PDF Sent to WhatsApp! 🚀</h5>
                <p>Check your WhatsApp inbox to download your high-yield PDF sheets.</p>
              </div>
            )}

            {onBookCall && (
              <div className="sidebar-call-box">
                <span>Need a mentor to guide you through these notes?</span>
                <button
                  type="button"
                  className="sidebar-call-btn"
                  onClick={() => {
                    onClose();
                    onBookCall();
                  }}
                >
                  Book Free 1-on-1 Call <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
