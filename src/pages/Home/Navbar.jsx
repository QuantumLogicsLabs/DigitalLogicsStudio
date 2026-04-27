import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/boolforge", label: "Circuit Forge" },
  { to: "/kmapgenerator", label: "K-Map Studio" },
  { to: "/boolean-algebra", label: "Boolean Algebra" },
  { to: "/numbersystemcalculator", label: "Number Systems" },
  { to: "/sequential/intro", label: "Sequential" },
  { to: "/timing-diagrams", label: "Resources" },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Navbar({ toggleTheme, theme, onHomeClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleHomeClick = () => {
    setMenuOpen(false);
    onHomeClick?.();
  };

  return (
    <header className="home-header">
      <div className="home-header-inner">
        <Link
          to="/"
          className="home-brand home-brand-link"
          aria-label="Go to home page"
          onClick={handleHomeClick}
        >
          <div className="home-logo-container">
            <svg viewBox="0 0 100 100" className="home-logo-svg">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
                  <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
                </linearGradient>
                <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M30,20 L70,20 L85,35 L85,45 L70,50 L30,50 L70,50 L85,55 L85,75 L70,80 L30,80 L30,20"
                fill="none"
                stroke="url(#logo-grad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="logo-trace"
              />
              <circle cx="30" cy="20" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: "url(#soft-glow)" }} />
              <circle cx="30" cy="50" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: "url(#soft-glow)" }} />
              <circle cx="30" cy="80" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: "url(#soft-glow)" }} />
            </svg>
          </div>
          <div className="home-brand-text">
            <span className="home-title">Boolforge</span>
            <span className="home-tagline">The Digital Logic Playground</span>
          </div>
        </Link>

        <nav className="home-nav" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "home-nav-link home-nav-link--active" : "home-nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="home-nav-controls">
          <button
            onClick={toggleTheme}
            className="home-theme-btn"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className={`home-hamburger${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="home-mobile-nav"
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </div>

      <nav
        id="home-mobile-nav"
        className={`home-mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="home-mobile-nav-inner">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "home-mobile-link home-nav-link--active" : "home-mobile-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
