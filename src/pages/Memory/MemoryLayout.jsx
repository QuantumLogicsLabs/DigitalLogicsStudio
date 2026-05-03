import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./MemorySystem.css";
import { memoryPages } from "./memoryConfig";

const MemoryLayout = ({ title, kicker, description, children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  const currentIndex = memoryPages.findIndex((p) => p.path === location.pathname);
  const prev = currentIndex > 0 ? memoryPages[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < memoryPages.length - 1
    ? memoryPages[currentIndex + 1] : null;
  const progress = Math.round(((currentIndex + 1) / memoryPages.length) * 100);
  const circumference = 2 * Math.PI * 13;
  const dashOffset = circumference - (progress / 100) * circumference;

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div className="mem-layout" data-theme={theme}>
      {/* Ambient background */}
      <div className="mem-bg-grid" />
      <div className="mem-bg-orb mem-bg-orb-1" />
      <div className="mem-bg-orb mem-bg-orb-2" />

      {/* ── TOPBAR ── */}
      <header className="mem-topbar">
        <div className="mem-topbar-left">
          <button
            className={`mem-hamburger${sidebarOpen ? " open" : ""}`}
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <span className="mem-ham-bar" />
            <span className="mem-ham-bar" />
            <span className="mem-ham-bar" />
          </button>
          <Link to="/" className="mem-home-link">
            <Home size={13} />
            <span>Home</span>
          </Link>
        </div>

        <div className="mem-pill">
          <span className="mem-pill-dot" />
          Memory Systems
        </div>

        <div className="mem-topbar-right">
          <button className="mem-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <div className="mem-ring-wrap" title={`${currentIndex + 1} / ${memoryPages.length}`}>
            <svg width="38" height="38" viewBox="0 0 38 38">
              <circle cx="19" cy="19" r="13" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="2.5" />
              <circle
                cx="19" cy="19" r="13"
                fill="none" stroke="#38bdf8" strokeWidth="2.5"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 19 19)"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <span className="mem-ring-text">{currentIndex + 1}/{memoryPages.length}</span>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="mem-body">
        {sidebarOpen && (
          <div className="mem-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`mem-sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="mem-sidebar-inner">
            <div className="mem-sidebar-card">
              <p className="mem-sidebar-kicker">Learning Path</p>
              <h2 className="mem-sidebar-title">Memory Systems</h2>
              <p className="mem-sidebar-desc">
                From ROM and PLA to RAM arrays — understand how digital systems store data.
              </p>
              <div className="mem-sidebar-prog-bar">
                <div className="mem-sidebar-prog-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="mem-sidebar-prog-label">{progress}% complete</span>
            </div>

            <nav className="mem-nav">
              {memoryPages.map((page, i) => (
                <NavLink
                  key={page.path}
                  to={page.path}
                  className={({ isActive }) =>
                    `mem-nav-item${isActive ? " active" : ""}${i < currentIndex ? " visited" : ""}`
                  }
                >
                  <span className="mem-nav-idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mem-nav-copy">
                    <span className="mem-nav-label">{page.icon} {page.label}</span>
                    <span className="mem-nav-sub">{page.description}</span>
                  </span>
                  <span className="mem-nav-check">{i < currentIndex ? "✓" : ""}</span>
                </NavLink>
              ))}
            </nav>

            <Link to="/" className="mem-sidebar-back">
              <ChevronLeft size={14} /> Back to All Topics
            </Link>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="mem-main" key={location.pathname}>
          {/* Breadcrumb */}
          <nav className="mem-breadcrumb">
            <Link to="/" className="mem-bc-link">Home</Link>
            <span className="mem-bc-sep">›</span>
            <span className="mem-bc-sep" style={{ color: "var(--mem-muted)" }}>Memory Systems</span>
            <span className="mem-bc-sep">›</span>
            <span className="mem-bc-current">{title}</span>
          </nav>

          {/* Hero */}
          <section className="mem-hero">
            <div className="mem-hero-badge">
              <span className="mem-hero-badge-label">Chapter</span>
              <strong className="mem-hero-badge-num">{currentIndex + 1}</strong>
            </div>
            <p className="mem-hero-kicker">{kicker || "Memory Systems"}</p>
            <h1 className="mem-hero-title">{title}</h1>
            {description && <p className="mem-hero-desc">{description}</p>}

            <div className="mem-chapter-dots">
              {memoryPages.map((p, i) => (
                <Link
                  key={p.path}
                  to={p.path}
                  className={`mem-chapter-dot${i === currentIndex ? " active" : ""}${i < currentIndex ? " done" : ""}`}
                  title={p.label}
                />
              ))}
            </div>
          </section>

          {/* Content */}
          <div className="mem-content">{children}</div>

          {/* Footer Nav */}
          <footer className="mem-footer-nav">
            {prev ? (
              <Link to={prev.path} className="mem-footer-link">
                <span className="mem-footer-arrow"><ChevronLeft size={16} /></span>
                <span>
                  <span className="mem-footer-label">Previous</span>
                  <span className="mem-footer-title">{prev.icon} {prev.label}</span>
                </span>
              </Link>
            ) : <div />}

            {next ? (
              <Link to={next.path} className="mem-footer-link mem-footer-link-next">
                <span>
                  <span className="mem-footer-label">Next</span>
                  <span className="mem-footer-title">{next.icon} {next.label}</span>
                </span>
                <span className="mem-footer-arrow"><ChevronRight size={16} /></span>
              </Link>
            ) : (
              <Link to="/" className="mem-footer-link mem-footer-link-next">
                <span>
                  <span className="mem-footer-label">All done!</span>
                  <span className="mem-footer-title">Return to Home</span>
                </span>
                <span className="mem-footer-arrow"><Home size={16} /></span>
              </Link>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MemoryLayout;
