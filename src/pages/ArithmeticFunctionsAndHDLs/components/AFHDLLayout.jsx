import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import "../AFHDLLayout.css";
import { afhdlPages } from "../afhdlConfig";

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

const AFHDLLayout = ({ title, subtitle, intro, highlights = [], children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  const currentIndex = afhdlPages.findIndex((page) => page.path === location.pathname);
  const prev = currentIndex > 0 ? afhdlPages[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < afhdlPages.length - 1
      ? afhdlPages[currentIndex + 1]
      : null;
  const progress = Math.round(((currentIndex + 1) / afhdlPages.length) * 100);
  const progressDash = progress * 0.879;

  return (
    <div className="afhdl-layout">
      <div className="afhdl-bg afhdl-bg-1" />
      <div className="afhdl-bg afhdl-bg-2" />

      {/* ── TOPBAR ──────────────────────────────────────────── */}
      <header className="afhdl-topbar">
        <div className="afhdl-topbar-left">
          <button
            className={`afhdl-hamburger${sidebarOpen ? " is-open" : ""}`}
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
          >
            <span className="afhdl-ham-bar" />
            <span className="afhdl-ham-bar" />
            <span className="afhdl-ham-bar" />
          </button>
          <Link to="/" className="afhdl-topbar-link">
            <Home size={15} aria-hidden="true" />
            <span>Home</span>
          </Link>
        </div>

        <div className="afhdl-topbar-center">
          <span className="afhdl-category-pill">
            <span className="afhdl-pill-dot" />
            Arithmetic &amp; HDLs
          </span>
        </div>

        <div className="afhdl-topbar-right">
          <button
            className="afhdl-theme-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="afhdl-progress-ring-wrap" title={`${currentIndex + 1} of ${afhdlPages.length}`}>
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                strokeDasharray={`${progressDash} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className="afhdl-progress-text">{currentIndex + 1}/{afhdlPages.length}</span>
          </div>
        </div>
      </header>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="afhdl-body">
        {sidebarOpen && (
          <div
            className="afhdl-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`afhdl-sidebar${sidebarOpen ? " is-open" : ""}`}
          aria-label="Arithmetic module navigation"
        >
          <div className="afhdl-sidebar-inner">
            <div className="afhdl-sidebar-card">
              <p className="afhdl-sidebar-kicker">Learning Path</p>
              <h2 className="afhdl-sidebar-title">Arithmetic Toolkit</h2>
              <p className="afhdl-sidebar-copy">
                Learn one operation at a time, then connect ideas to hardware design.
              </p>
              <div className="afhdl-sidebar-progress-bar">
                <div
                  className="afhdl-sidebar-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="afhdl-sidebar-progress-label">{progress}% complete</span>
            </div>

            <nav className="afhdl-sidebar-nav">
              {afhdlPages.map((page, index) => (
                <NavLink
                  key={page.path}
                  to={page.path}
                  className={({ isActive }) =>
                    `afhdl-nav-item${isActive ? " is-active" : ""}${index < currentIndex ? " is-visited" : ""}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="afhdl-nav-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="afhdl-nav-copy">
                    <span className="afhdl-nav-label">{page.label}</span>
                    <span className="afhdl-nav-description">{page.description}</span>
                  </span>
                  <span className="afhdl-nav-status">
                    {index < currentIndex && <span className="afhdl-nav-check">✓</span>}
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="afhdl-sidebar-footer">
              <Link to="/" className="afhdl-sidebar-home-btn">← Back to All Topics</Link>
            </div>
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────────────── */}
        <main className="afhdl-main">
          <nav className="afhdl-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="afhdl-bc-link">Home</Link>
            <span className="afhdl-bc-sep">›</span>
            <span className="afhdl-bc-mid">Arithmetic &amp; HDLs</span>
            <span className="afhdl-bc-sep">›</span>
            <span className="afhdl-bc-current">{title}</span>
          </nav>

          <section className="afhdl-hero">
            <div className="afhdl-hero-badge">
              <span className="afhdl-hero-badge-label">Chapter</span>
              <strong className="afhdl-hero-badge-num">{currentIndex + 1}</strong>
            </div>
            <p className="afhdl-hero-kicker">Arithmetic Functions and HDLs</p>
            <h1 className="afhdl-hero-title">{title}</h1>
            {subtitle ? <p className="afhdl-hero-subtitle">{subtitle}</p> : null}
            {intro ? <p className="afhdl-hero-intro">{intro}</p> : null}

            {highlights.length > 0 ? (
              <div className="afhdl-hero-highlights">
                {highlights.map((item) => (
                  <div key={item.title} className="afhdl-hero-highlight">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="afhdl-chapter-dots">
              {afhdlPages.map((p, i) => (
                <Link
                  key={p.path}
                  to={p.path}
                  className={`afhdl-dot${i === currentIndex ? " active" : ""}${i < currentIndex ? " done" : ""}`}
                  title={p.label}
                />
              ))}
            </div>
          </section>

          <div className="afhdl-content">{children}</div>

          <footer className="afhdl-footer-nav">
            {prev ? (
              <NavLink to={prev.path} className="afhdl-footer-link">
                <span className="afhdl-footer-arrow">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="afhdl-footer-label">Previous</span>
                  <span className="afhdl-footer-title">{prev.label}</span>
                </span>
              </NavLink>
            ) : (
              <div />
            )}

            {next ? (
              <NavLink to={next.path} className="afhdl-footer-link afhdl-footer-link-next">
                <span>
                  <span className="afhdl-footer-label">Next</span>
                  <span className="afhdl-footer-title">{next.label}</span>
                </span>
                <span className="afhdl-footer-arrow afhdl-footer-arrow-next">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </NavLink>
            ) : (
              <Link to="/" className="afhdl-footer-link afhdl-footer-link-next">
                <span>
                  <span className="afhdl-footer-label">All done!</span>
                  <span className="afhdl-footer-title">Return to Home</span>
                </span>
                <span className="afhdl-footer-arrow afhdl-footer-arrow-next">
                  <Home size={16} aria-hidden="true" />
                </span>
              </Link>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AFHDLLayout;
