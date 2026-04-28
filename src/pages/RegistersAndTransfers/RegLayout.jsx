import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./RegStyles.css"; // ← THE MISSING LINE — this is why nothing was styled

const regPages = [
  {
    path: "/registers/intro",
    label: "Registers",
    icon: "🗂️",
    short: "Registers",
  },
  {
    path: "/registers/counters",
    label: "Counters",
    icon: "🔢",
    short: "Counters",
  },
  {
    path: "/registers/sync-async",
    label: "Synchronous / Asynchronous",
    icon: "⏱️",
    short: "Sync/Async",
  },
  {
    path: "/registers/shift-registers",
    label: "Shift Registers",
    icon: "➡️",
    short: "Shift Reg",
  },
  {
    path: "/registers/serial-shift",
    label: "Serial Shift Registers",
    icon: "📡",
    short: "Serial Shift",
  },
  {
    path: "/registers/loading",
    label: "Loading Registers",
    icon: "📥",
    short: "Loading",
  },
  {
    path: "/registers/parallel",
    label: "Parallel Registers",
    icon: "⟺",
    short: "Parallel",
  },
  {
    path: "/registers/ripple-counters",
    label: "Ripple Counters",
    icon: "🌊",
    short: "Ripple",
  },
  {
    path: "/registers/sync-binary-counters",
    label: "Synchronous Binary Counters",
    icon: "⚙️",
    short: "Sync Binary",
  },
];

const RegLayout = ({ children, title, subtitle }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentIndex = regPages.findIndex((p) => p.path === location.pathname);
  const prev = regPages[currentIndex - 1];
  const next = regPages[currentIndex + 1];
  const progress = Math.round(((currentIndex + 1) / regPages.length) * 100);

  return (
    <div className="reg-layout">
      <div className="reg-bg-blob reg-bg-blob-1" />
      <div className="reg-bg-blob reg-bg-blob-2" />
      <div className="reg-bg-blob reg-bg-blob-3" />

      {/* ── Top bar ── */}
      <header className="reg-topbar">
        <div className="reg-topbar-left">
          <button
            className="reg-hamburger"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
          <Link to="/" className="reg-back-home">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Home
          </Link>
        </div>

        <div className="reg-topbar-center">
          <span className="reg-category-pill">
            <span className="reg-pill-dot" />
            Registers &amp; Register Transfers
          </span>
        </div>

        <div className="reg-topbar-right">
          <div
            className="reg-progress-ring-wrap"
            title={`${currentIndex + 1} of ${regPages.length}`}
          >
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="rgba(251,191,36,0.2)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeDasharray={`${progress * 0.879} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className="reg-progress-text">
              {currentIndex + 1}/{regPages.length}
            </span>
          </div>
        </div>
      </header>

      <div className="reg-body">
        {sidebarOpen && (
          <div className="reg-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside className={`reg-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="reg-sidebar-inner">
            <div className="reg-sidebar-header">
              <div className="reg-sidebar-logo">⇌</div>
              <div>
                <p className="reg-sidebar-title">Registers</p>
                <p className="reg-sidebar-subtitle">&amp; Transfers</p>
              </div>
            </div>

            <div className="reg-sidebar-progress">
              <div className="reg-sidebar-progress-bar">
                <div
                  className="reg-sidebar-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="reg-sidebar-progress-label">
                {progress}% complete
              </span>
            </div>

            <nav className="reg-sidebar-nav">
              {regPages.map((p, i) => {
                const isActive = location.pathname === p.path;
                const isVisited = i < currentIndex;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    className={`reg-nav-item${isActive ? " active" : ""}${isVisited ? " visited" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="reg-nav-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="reg-nav-icon">{p.icon}</span>
                    <span className="reg-nav-label-text">{p.label}</span>
                    <span className="reg-nav-status">
                      {isActive && <span className="reg-nav-dot-active" />}
                      {isVisited && <span className="reg-nav-check">✓</span>}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="reg-sidebar-footer">
              <Link to="/" className="reg-sidebar-home-btn">
                ← Back to All Topics
              </Link>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="reg-main">
          {title && (
            <div className="reg-page-header">
              <h1 className="reg-page-title">{title}</h1>
              {subtitle && <p className="reg-page-subtitle">{subtitle}</p>}
            </div>
          )}
          <div className="reg-content">{children}</div>

          {/* ── Prev / Next navigation ── */}
          <div className="reg-page-nav">
            {prev ? (
              <Link to={prev.path} className="reg-page-nav-btn reg-prev">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 3L5 8l5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{prev.label}</span>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link to={next.path} className="reg-page-nav-btn reg-next">
                <span>{next.label}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegLayout;
