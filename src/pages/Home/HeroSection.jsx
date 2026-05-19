import { useEffect, useRef } from "react";
import FiberOpticBackground from "../../components/animations/FiberOpticBackground";
import { useAuth } from "../../context/AuthContext";

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

    // No longer animating B-shaped SVG, only keep observer.
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="home-hero" id="top" ref={heroRef}>
      <FiberOpticBackground />
      {/* Removed B-shaped SVG graphic */}
      <div className="home-hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          {user ? `Welcome back, ${user.name}` : "Free interactive digital logic platform"}
        </div>

        <h2>Explore, visualize and<br /> master digital logic.</h2>
        <p>
          {user
            ? "Your account is active. Keep building with circuits, Karnaugh maps, number systems, and binary arithmetic in one smooth workspace."
            : "Jump into interactive tools for circuits, Karnaugh maps, number systems, and binary arithmetic — all in one smooth experience."}
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
              placeholder="Search tools — K-Map, Boolean, Flip‑Flop..."
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
