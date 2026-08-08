import React from "react";
import { Link } from "react-router-dom";
import "./FeaturedToolsSection.css";

/* ─── Static tool metadata ─────────────────────────────────────────────────
   Kept separate from HomeData so the card design owns its visual identity.
   `to` and `label` are derived from the HomeData links at render time,
   but accent, tags, and visual chrome live here.
──────────────────────────────────────────────────────────────────────────── */
const TOOL_META = {
  "Circuit Forge": {
    accent: "#3b82f6",
    accentAlt: "#6366f1",
    tags: ["Drag & Drop", "Truth Tables", "Real-time"],
    badge: "Interactive",
    svgIcon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        {/* IC chip body */}
        <rect x="18" y="18" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
        {/* Left pins */}
        <line x1="18" y1="26" x2="10" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="32" x2="10" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Right pins */}
        <line x1="46" y1="26" x2="54" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="46" y1="32" x2="54" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="46" y1="38" x2="54" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* AND gate symbol inside chip */}
        <path d="M26 27 L26 37 L30 37 Q36 37 36 32 Q36 27 30 27 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        {/* Notch */}
        <path d="M24 18 Q26 15 28 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        {/* Node dots */}
        <circle cx="10" cy="26" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="10" cy="32" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="54" cy="32" r="2" fill="currentColor" opacity="0.9" />
      </svg>
    ),
  },
  "K-Map Generator": {
    accent: "#8b5cf6",
    accentAlt: "#ec4899",
    tags: ["SOP / POS", "Visual K-Map", "Minimization"],
    badge: "Solver",
    svgIcon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        {/* Outer grid */}
        <rect x="12" y="12" width="40" height="40" rx="3" stroke="currentColor" strokeWidth="2" />
        {/* Grid lines vertical */}
        <line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" strokeWidth="1.5" />
        {/* Grid lines horizontal */}
        <line x1="12" y1="32" x2="52" y2="32" stroke="currentColor" strokeWidth="1.5" />
        {/* Highlighted group — top-right quadrant */}
        <rect x="33" y="13" width="18" height="18" rx="2" fill="currentColor" opacity="0.15" />
        <rect x="33" y="13" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 2" />
        {/* 1s in cells */}
        <text x="21" y="26" fontSize="9" fill="currentColor" textAnchor="middle" opacity="0.5">0</text>
        <text x="41" y="26" fontSize="9" fill="currentColor" textAnchor="middle">1</text>
        <text x="21" y="46" fontSize="9" fill="currentColor" textAnchor="middle" opacity="0.5">0</text>
        <text x="41" y="46" fontSize="9" fill="currentColor" textAnchor="middle">1</text>
        {/* Column labels */}
        <text x="22" y="10" fontSize="7" fill="currentColor" textAnchor="middle" opacity="0.5">AB</text>
        <text x="42" y="10" fontSize="7" fill="currentColor" textAnchor="middle" opacity="0.7">AB'</text>
      </svg>
    ),
  },
};

/* ─── Single featured tool card ──────────────────────────────────────────── */
const ToolCard = ({ tool, index }) => {
  const meta = TOOL_META[tool.title] ?? {
    accent: "#3b82f6",
    accentAlt: "#8b5cf6",
    tags: [],
    badge: "Tool",
    svgIcon: null,
  };

  const primaryLink = tool.links?.find((l) => l.primary) ?? tool.links?.[0];

  return (
    <article
      className="ft-card"
      style={{
        "--accent": meta.accent,
        "--accent-alt": meta.accentAlt,
        "--card-delay": `${index * 120}ms`,
      }}
    >
      {/* Ambient glow blobs */}
      <div className="ft-card__glow ft-card__glow--a" aria-hidden="true" />
      <div className="ft-card__glow ft-card__glow--b" aria-hidden="true" />

      {/* Top row: badge + icon panel */}
      <div className="ft-card__top">
        <span className="ft-card__badge">{meta.badge}</span>
        <div className="ft-card__icon-wrap" aria-hidden="true">
          {meta.svgIcon}
        </div>
      </div>

      {/* Title */}
      <h3 className="ft-card__title">{tool.title}</h3>

      {/* Description */}
      <p className="ft-card__desc">{tool.description}</p>

      {/* Feature tags */}
      <div className="ft-card__tags" aria-label="Features">
        {meta.tags.map((tag) => (
          <span key={tag} className="ft-card__tag">
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      {primaryLink && (
        <Link to={primaryLink.to} className="ft-card__cta">
          <span>{primaryLink.text}</span>
          <span className="ft-card__cta-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      )}

      {/* Bottom accent bar */}
      <div className="ft-card__bar" aria-hidden="true" />
    </article>
  );
};

/* ─── Section wrapper ────────────────────────────────────────────────────── */
const FeaturedToolsSection = ({ data }) => {
  const sectionRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!data?.length) return null;

  return (
    <section
      ref={sectionRef}
      className={`ft-section home-section${visible ? " is-visible" : ""}`}
    >
      {/* Section header */}
      <div className="home-section-header ft-section__header">
        <div className="ft-section__eyebrow">
          <span className="ft-section__eyebrow-dot" aria-hidden="true" />
          Interactive Tools
        </div>
        <h2 className="home-section-title">Featured Tools</h2>
        <p className="home-section-description">
          Hands-on interactive tools to build circuits, simplify logic, and
          visualize boolean expressions.
        </p>
      </div>

      {/* Cards grid */}
      <div className="ft-grid">
        {data.map((tool, i) => (
          <ToolCard key={tool.title} tool={tool} index={i} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedToolsSection;
