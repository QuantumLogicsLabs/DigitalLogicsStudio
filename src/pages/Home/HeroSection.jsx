import { useEffect, useRef } from "react";

export default function HeroSection({ searchTerm, setSearchTerm, onSearchSubmit }) {
  const heroRef = useRef(null);

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
        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          Free interactive digital logic platform
        </div>

        <h2>Explore, visualize and<br /> master digital logic.</h2>
        <p>
          Jump into interactive tools for circuits, Karnaugh maps, number
          systems, and binary arithmetic — all in one smooth experience.
        </p>

        <form className="search-container" onSubmit={onSearchSubmit} role="search">
          <div className="home-search-field">
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
