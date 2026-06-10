import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const STATS = [
  { value: "12+", label: "Interactive Tools" },
  { value: "200+", label: "Practice Problems" },
  { value: "Free", label: "Always" },
];

export default function HeroSection({ searchTerm, setSearchTerm, onSearchSubmit }) {
  const heroRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.style.setProperty("--ghost-opacity", entry.intersectionRatio.toFixed(2));
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="home-hero" id="top" ref={heroRef}>
      {/* Ambient glow blobs */}
      <div className="hero-glow hero-glow--blue" aria-hidden="true" />
      <div className="hero-glow hero-glow--purple" aria-hidden="true" />

      {/* Ghost logo */}
      <svg
        className="hero-ghost-logo"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ghost-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
            <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
          </linearGradient>
        </defs>
        <path
          d="M30,20 L70,20 L85,35 L85,45 L70,50 L30,50 L70,50 L85,55 L85,75 L70,80 L30,80 L30,20"
          fill="none"
          stroke="url(#ghost-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="30" cy="20" r="6" fill="url(#ghost-grad)" />
        <circle cx="30" cy="50" r="6" fill="url(#ghost-grad)" />
        <circle cx="30" cy="80" r="6" fill="url(#ghost-grad)" />
      </svg>

      <div className="home-hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          {user ? `Welcome back, ${user.name}` : "Free interactive digital logic platform"}
        </div>

        {/* Heading */}
        <h1>
          <span className="hero-title-line">Master Digital Logic</span>
          <span className="hero-title-accent"> Interactively</span>
        </h1>

        {/* Sub-description */}
        <p>
          {user
            ? "Your workspace is ready. Build circuits, simplify expressions with K-Maps, explore number systems, and tackle problems — all in one place."
            : "Build circuits visually, simplify Boolean expressions with K-Maps, convert number systems, and solve logic problems — no setup required."}
        </p>

        {/* Stats row */}
        <div className="hero-stats" aria-label="Platform statistics">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <form className="search-container" onSubmit={onSearchSubmit} role="search">          <div className="home-search-field">
            <svg
              className="search-field-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search tools — K-Map, Boolean, Flip-Flop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="home-search-input"
              aria-label="Search tools"
            />
            {searchTerm && (
              <button
                type="button"
                className="home-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="home-search-button">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
