import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const seqPages = [
  {
    path: "/sequential/intro",
    label: "Introduction",
    icon: "📡",
    short: "Intro",
  },
  {
    path: "/sequential/latches",
    label: "Latches",
    icon: "🔒",
    short: "Latches",
  },
  {
    path: "/sequential/flip-flops",
    label: "Flip-Flops",
    icon: "🔁",
    short: "Flip-Flops",
  },
  {
    path: "/sequential/flip-flop-types",
    label: "Types of Flip-Flops",
    icon: "📋",
    short: "FF Types",
  },
  {
    path: "/sequential/analysis",
    label: "Analysis",
    icon: "🔬",
    short: "Analysis",
  },
  {
    path: "/sequential/design-procedures",
    label: "Design Procedures",
    icon: "🏗️",
    short: "Design",
  },
  {
    path: "/sequential/state-diagram",
    label: "State Diagrams & Tables",
    icon: "🗺️",
    short: "States",
  },
  {
    path: "/sequential/state-reduction",
    label: "State Reduction & Excitation",
    icon: "⚡",
    short: "Reduction",
  },
];

const SeqLayout = ({ children, title, subtitle }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentIndex = seqPages.findIndex((p) => p.path === location.pathname);
  const prev = seqPages[currentIndex - 1];
  const next = seqPages[currentIndex + 1];
  const progress = Math.round(((currentIndex + 1) / seqPages.length) * 100);

  return (
    <div className="seq-layout">
      {/* ── Ambient background blobs ── */}
      <div className="seq-bg-blob seq-bg-blob-1" />
      <div className="seq-bg-blob seq-bg-blob-2" />
      <div className="seq-bg-blob seq-bg-blob-3" />

      {/* ── Top navigation bar ── */}
      <header className="seq-topbar">
        <div className="seq-topbar-left">
          <button
            className="seq-hamburger"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
          <Link to="/" className="seq-back-home">
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

        <div className="seq-topbar-center">
          <span className="seq-category-pill">
            <span className="seq-pill-dot" />
            Sequential Circuits
          </span>
        </div>

        <div className="seq-topbar-right">
          <div
            className="seq-progress-ring-wrap"
            title={`${currentIndex + 1} of ${seqPages.length}`}
          >
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="rgba(99,102,241,0.2)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                strokeDasharray={`${progress * 0.879} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className="seq-progress-text">
              {currentIndex + 1}/{seqPages.length}
            </span>
          </div>
        </div>
      </header>

      <div className="seq-body">
        {/* ── Sidebar overlay (mobile) ── */}
        {sidebarOpen && (
          <div className="seq-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside className={`seq-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="seq-sidebar-inner">
            <div className="seq-sidebar-header">
              <div className="seq-sidebar-logo">⟳</div>
              <div>
                <p className="seq-sidebar-title">Sequential</p>
                <p className="seq-sidebar-subtitle">Circuits</p>
              </div>
            </div>

            {/* Progress bar inside sidebar */}
            <div className="seq-sidebar-progress">
              <div className="seq-sidebar-progress-bar">
                <div
                  className="seq-sidebar-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="seq-sidebar-progress-label">
                {progress}% complete
              </span>
            </div>

            <nav className="seq-sidebar-nav">
              {seqPages.map((p, i) => {
                const isActive = location.pathname === p.path;
                const isVisited = i < currentIndex;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    className={`seq-nav-item${isActive ? " active" : ""}${isVisited ? " visited" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="seq-nav-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="seq-nav-icon">{p.icon}</span>
                    <span className="seq-nav-label-text">{p.label}</span>
                    <span className="seq-nav-status">
                      {isActive && <span className="seq-nav-dot-active" />}
                      {isVisited && <span className="seq-nav-check">✓</span>}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="seq-sidebar-footer">
              <Link to="/" className="seq-sidebar-home-btn">
                ← Back to All Topics
              </Link>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="seq-main">
          {/* Page header */}
          <div className="seq-page-header">
            <nav className="seq-breadcrumb">
              <Link to="/" className="seq-bc-link">
                Home
              </Link>
              <span className="seq-bc-chevron">›</span>
              <span className="seq-bc-mid">Sequential Circuits</span>
              <span className="seq-bc-chevron">›</span>
              <span className="seq-bc-current">{title}</span>
            </nav>

            <div className="seq-header-content">
              <div className="seq-header-badge">
                <span>{seqPages[currentIndex]?.icon}</span>
                <span>Chapter {currentIndex + 1}</span>
              </div>
              <h1 className="seq-page-title">{title}</h1>
              {subtitle && <p className="seq-page-subtitle">{subtitle}</p>}
            </div>

            {/* Chapter mini-nav dots */}
            <div className="seq-chapter-dots">
              {seqPages.map((p, i) => (
                <Link
                  key={p.path}
                  to={p.path}
                  className={`seq-dot${i === currentIndex ? " active" : ""}${i < currentIndex ? " done" : ""}`}
                  title={p.label}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="seq-content-body">{children}</div>

          {/* Prev / Next */}
          <div className="seq-pagination">
            {prev ? (
              <Link to={prev.path} className="seq-pag-btn seq-pag-prev">
                <div className="seq-pag-arrow">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M13 5l-5 5 5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="seq-pag-info">
                  <span className="seq-pag-hint">Previous</span>
                  <span className="seq-pag-name">
                    {prev.icon} {prev.label}
                  </span>
                </div>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link to={next.path} className="seq-pag-btn seq-pag-next">
                <div className="seq-pag-info seq-pag-info-right">
                  <span className="seq-pag-hint">Up Next</span>
                  <span className="seq-pag-name">
                    {next.icon} {next.label}
                  </span>
                </div>
                <div className="seq-pag-arrow">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7 5l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ) : (
              <Link to="/" className="seq-pag-btn seq-pag-finish">
                <div className="seq-pag-info seq-pag-info-right">
                  <span className="seq-pag-hint">🎉 All done!</span>
                  <span className="seq-pag-name">Return to Home</span>
                </div>
                <div className="seq-pag-arrow seq-pag-arrow-home">🏠</div>
              </Link>
            )}
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ─── Google Fonts ─── */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

        /* ─── Reset & base ─── */
        *, *::before, *::after { box-sizing: border-box; }

        .seq-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #050b18;
          color: #e2e8f0;
          font-family: 'Inter', 'Azeret Mono', system-ui, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ─── Ambient background blobs ─── */
        .seq-bg-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
        }
        .seq-bg-blob-1 {
          width: 600px; height: 600px;
          top: -200px; left: -100px;
          background: radial-gradient(circle, #312e81, transparent 70%);
        }
        .seq-bg-blob-2 {
          width: 500px; height: 500px;
          top: 30%; right: -150px;
          background: radial-gradient(circle, #1e3a5f, transparent 70%);
          opacity: 0.25;
        }
        .seq-bg-blob-3 {
          width: 400px; height: 400px;
          bottom: -100px; left: 30%;
          background: radial-gradient(circle, #1a1a4e, transparent 70%);
          opacity: 0.2;
        }

        /* ─── Top bar ─── */
        .seq-topbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 1.5rem;
          height: 56px;
          background: rgba(5,11,24,0.85);
          backdrop-filter: blur(20px) saturate(1.5);
          border-bottom: 1px solid rgba(99,102,241,0.15);
          box-shadow: 0 1px 0 rgba(99,102,241,0.08), 0 4px 24px rgba(0,0,0,0.4);
        }
        .seq-topbar-left  { display: flex; align-items: center; gap: .75rem; }
        .seq-topbar-center { position: absolute; left: 50%; transform: translateX(-50%); }
        .seq-topbar-right { display: flex; align-items: center; gap: .75rem; }

        /* Hamburger */
        .seq-hamburger {
          display: none;
          flex-direction: column; gap: 5px; padding: 8px; cursor: pointer;
          background: transparent; border: none;
        }
        .seq-hamburger span {
          display: block; width: 20px; height: 2px;
          background: #94a3b8; border-radius: 2px;
          transition: all .2s ease;
        }

        /* Back home pill */
        .seq-back-home {
          display: inline-flex; align-items: center; gap: .4rem;
          font-size: .8rem; font-weight: 500; color: #94a3b8;
          text-decoration: none; padding: .35rem .85rem;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,.15);
          background: rgba(30,41,59,.5);
          transition: all .2s ease;
        }
        .seq-back-home:hover {
          color: #c7d2fe; border-color: rgba(99,102,241,.5);
          background: rgba(99,102,241,.12);
        }
        .seq-back-home svg { flex-shrink: 0; }

        /* Category pill */
        .seq-category-pill {
          display: inline-flex; align-items: center; gap: .5rem;
          font-size: .75rem; font-weight: 600; letter-spacing: .06em;
          color: #a5b4fc;
          background: rgba(99,102,241,.1);
          border: 1px solid rgba(99,102,241,.25);
          padding: .3rem 1rem; border-radius: 999px;
        }
        .seq-pill-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 6px #818cf8;
          animation: seq-pulse 2s ease-in-out infinite;
        }
        @keyframes seq-pulse {
          0%,100% { opacity:1; transform: scale(1); }
          50%      { opacity:.6; transform: scale(1.3); }
        }

        /* Progress ring */
        .seq-progress-ring-wrap {
          position: relative; width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
        }
        .seq-progress-ring-wrap svg { position: absolute; top:0; left:0; }
        .seq-progress-text {
          font-size: .6rem; font-weight: 700; color: #a5b4fc;
          font-variant-numeric: tabular-nums; position: relative; z-index: 1;
        }

        /* ─── Body ─── */
        .seq-body { display: flex; flex: 1; position: relative; z-index: 1; }

        /* Mobile overlay */
        .seq-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,.6); z-index: 49;
        }

        /* ─── Sidebar ─── */
        .seq-sidebar {
          width: 272px; flex-shrink: 0;
          background: rgba(8,15,30,.75);
          border-right: 1px solid rgba(99,102,241,.12);
          backdrop-filter: blur(12px);
          position: sticky; top: 56px;
          height: calc(100vh - 56px); overflow-y: auto;
          display: flex; flex-direction: column;
          transition: transform .25s cubic-bezier(.4,0,.2,1);
        }
        .seq-sidebar::-webkit-scrollbar { width: 4px; }
        .seq-sidebar::-webkit-scrollbar-track { background: transparent; }
        .seq-sidebar::-webkit-scrollbar-thumb { background: rgba(99,102,241,.3); border-radius: 2px; }

        .seq-sidebar-inner { display: flex; flex-direction: column; height: 100%; padding: 1.25rem .75rem 1.5rem; }

        /* Sidebar header */
        .seq-sidebar-header {
          display: flex; align-items: center; gap: .75rem;
          padding: .5rem .5rem 1.1rem; margin-bottom: .25rem;
          border-bottom: 1px solid rgba(99,102,241,.1);
        }
        .seq-sidebar-logo {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 700;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          box-shadow: 0 4px 12px rgba(79,70,229,.4);
        }
        .seq-sidebar-title  { font-size: .85rem; font-weight: 700; color: #e2e8f0; margin: 0; line-height: 1.2; }
        .seq-sidebar-subtitle { font-size: .72rem; color: #6b7280; margin: 0; }

        /* Progress bar */
        .seq-sidebar-progress { padding: .75rem .5rem; margin-bottom: .5rem; }
        .seq-sidebar-progress-bar {
          height: 3px; background: rgba(99,102,241,.15);
          border-radius: 2px; overflow: hidden; margin-bottom: .4rem;
        }
        .seq-sidebar-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4f46e5, #818cf8);
          border-radius: 2px;
          transition: width .4s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 0 8px rgba(129,140,248,.5);
        }
        .seq-sidebar-progress-label { font-size: .68rem; color: #6b7280; }

        /* Nav items */
        .seq-sidebar-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .seq-nav-item {
          display: flex; align-items: center; gap: .6rem;
          padding: .58rem .65rem; border-radius: .6rem;
          text-decoration: none; color: #64748b;
          border: 1px solid transparent;
          transition: all .18s ease;
          position: relative; overflow: hidden;
        }
        .seq-nav-item::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(99,102,241,.08), transparent);
          opacity: 0; transition: opacity .2s;
        }
        .seq-nav-item:hover { color: #c7d2fe; border-color: rgba(99,102,241,.2); }
        .seq-nav-item:hover::before { opacity: 1; }
        .seq-nav-item.visited { color: #475569; }
        .seq-nav-item.visited .seq-nav-icon { opacity: .5; }
        .seq-nav-item.active {
          color: #c7d2fe;
          background: rgba(99,102,241,.14);
          border-color: rgba(99,102,241,.35);
          box-shadow: inset 0 0 0 1px rgba(99,102,241,.1), 0 2px 8px rgba(99,102,241,.15);
        }
        .seq-nav-item.active::before { opacity: 1; }

        .seq-nav-num   { font-size: .6rem; color: #374151; font-variant-numeric: tabular-nums; font-weight: 600; min-width: 18px; }
        .seq-nav-icon  { font-size: .9rem; flex-shrink: 0; }
        .seq-nav-label-text { font-size: .78rem; font-weight: 500; flex: 1; line-height: 1.3; }
        .seq-nav-status { flex-shrink: 0; }
        .seq-nav-dot-active {
          display: block; width: 6px; height: 6px; border-radius: 50%;
          background: #818cf8; box-shadow: 0 0 6px #818cf8;
        }
        .seq-nav-check { font-size: .65rem; color: #10b981; }

        /* Sidebar footer */
        .seq-sidebar-footer {
          padding-top: 1rem; margin-top: .5rem;
          border-top: 1px solid rgba(99,102,241,.1);
        }
        .seq-sidebar-home-btn {
          display: block; text-align: center;
          font-size: .75rem; color: #475569; text-decoration: none;
          padding: .5rem; border-radius: .5rem;
          border: 1px solid rgba(148,163,184,.1);
          transition: all .18s ease;
        }
        .seq-sidebar-home-btn:hover { color: #94a3b8; border-color: rgba(148,163,184,.2); background: rgba(30,41,59,.4); }

        /* ─── Main content ─── */
        .seq-main {
          flex: 1; min-width: 0;
          padding: 2.5rem 3.5rem 5rem;
          max-width: 900px;
        }

        /* ─── Page header ─── */
        .seq-breadcrumb {
          display: flex; align-items: center; gap: .4rem;
          font-size: .72rem; color: #475569; margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .seq-bc-link { color: #6366f1; text-decoration: none; transition: color .15s; }
        .seq-bc-link:hover { color: #818cf8; }
        .seq-bc-chevron { color: #374151; }
        .seq-bc-mid { color: #475569; }
        .seq-bc-current { color: #94a3b8; font-weight: 500; }

        .seq-page-header {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(99,102,241,.12);
          position: relative;
        }
        .seq-page-header::after {
          content: '';
          position: absolute; bottom: -1px; left: 0;
          width: 80px; height: 2px;
          background: linear-gradient(90deg, #6366f1, transparent);
          border-radius: 1px;
        }

        .seq-header-badge {
          display: inline-flex; align-items: center; gap: .5rem;
          font-size: .72rem; font-weight: 600; letter-spacing: .08em;
          color: #818cf8;
          background: rgba(99,102,241,.08);
          border: 1px solid rgba(99,102,241,.2);
          padding: .3rem .8rem; border-radius: 999px;
          margin-bottom: .9rem;
        }

        .seq-page-title {
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 800; color: #f1f5f9;
          margin: 0 0 .65rem;
          letter-spacing: -.03em;
          line-height: 1.2;
          background: linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .seq-page-subtitle {
          font-size: .93rem; color: #64748b;
          margin: 0; line-height: 1.7; max-width: 620px;
        }

        /* Chapter dots */
        .seq-chapter-dots {
          display: flex; gap: .4rem; margin-top: 1.25rem;
        }
        .seq-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(99,102,241,.2);
          border: 1px solid rgba(99,102,241,.25);
          transition: all .2s ease;
          text-decoration: none;
        }
        .seq-dot:hover { background: rgba(99,102,241,.5); transform: scale(1.2); }
        .seq-dot.active {
          background: #6366f1; width: 24px; border-radius: 4px;
          box-shadow: 0 0 8px rgba(99,102,241,.6);
        }
        .seq-dot.done { background: rgba(16,185,129,.4); border-color: rgba(16,185,129,.4); }

        /* ══════════════════════════════════
           CONTENT TYPOGRAPHY & COMPONENTS
        ══════════════════════════════════ */

        /* Section headings */
        .seq-content-body h2 {
          font-size: 1.15rem; font-weight: 700; color: #c7d2fe;
          margin: 2.5rem 0 .8rem; display: flex; align-items: center; gap: .6rem;
          letter-spacing: -.01em;
        }
        .seq-content-body h2::before {
          content: '';
          display: inline-block; width: 3px; height: 1.1em;
          background: linear-gradient(180deg, #6366f1, #818cf8);
          border-radius: 2px; flex-shrink: 0;
        }
        .seq-content-body h2:first-child { margin-top: 0; }

        .seq-content-body h3 {
          font-size: 1rem; font-weight: 600; color: #a5b4fc;
          margin: 1.75rem 0 .6rem;
        }

        /* Paragraphs */
        .seq-content-body p {
          font-size: .92rem; line-height: 1.85; color: #94a3b8;
          margin-bottom: 1rem;
        }
        .seq-content-body strong { color: #e2e8f0; font-weight: 600; }
        .seq-content-body em { color: #a5b4fc; font-style: normal; font-weight: 600; }
        .seq-content-body code {
          font-family: 'JetBrains Mono', monospace;
          font-size: .82em; color: #c7d2fe;
          background: rgba(99,102,241,.12);
          border: 1px solid rgba(99,102,241,.2);
          padding: .1em .4em; border-radius: .25rem;
        }

        /* Lists */
        .seq-content-body ul, .seq-content-body ol {
          padding-left: 0; margin-bottom: 1.1rem; list-style: none;
        }
        .seq-content-body li {
          font-size: .91rem; line-height: 1.8; color: #94a3b8;
          margin-bottom: .4rem; padding-left: 1.5rem; position: relative;
        }
        .seq-content-body ul li::before {
          content: '';
          position: absolute; left: 0; top: .7em;
          width: 6px; height: 6px; border-radius: 50%;
          background: #4f46e5; box-shadow: 0 0 4px rgba(99,102,241,.5);
        }
        .seq-content-body ol { counter-reset: seq-ol; }
        .seq-content-body ol li::before {
          content: counter(seq-ol);
          counter-increment: seq-ol;
          position: absolute; left: 0; top: .08em;
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: .65rem; font-weight: 700; color: #818cf8;
          background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.25);
          border-radius: 50%;
        }
        .seq-content-body li strong { color: #e2e8f0; }

        /* ─── Callout boxes ─── */
        .seq-box {
          position: relative; overflow: hidden;
          border-radius: .875rem; padding: 1.1rem 1.3rem 1.1rem 1.5rem;
          margin: 1.5rem 0;
          border: 1px solid rgba(99,102,241,.25);
          background: rgba(99,102,241,.07);
          backdrop-filter: blur(4px);
        }
        .seq-box::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(180deg, #6366f1, #818cf8);
        }
        .seq-box.info {
          border-color: rgba(59,130,246,.3);
          background: rgba(37,99,235,.07);
        }
        .seq-box.info::before { background: linear-gradient(180deg, #3b82f6, #60a5fa); }
        .seq-box.warning {
          border-color: rgba(245,158,11,.3);
          background: rgba(245,158,11,.06);
        }
        .seq-box.warning::before { background: linear-gradient(180deg, #f59e0b, #fbbf24); }
        .seq-box.success {
          border-color: rgba(16,185,129,.3);
          background: rgba(16,185,129,.06);
        }
        .seq-box.success::before { background: linear-gradient(180deg, #10b981, #34d399); }

        .seq-box p { margin: 0; font-size: .88rem; line-height: 1.7; }
        .seq-box-title {
          font-size: .68rem !important; letter-spacing: .12em; font-weight: 700 !important;
          text-transform: uppercase; color: #818cf8 !important;
          margin-bottom: .5rem !important; display: block;
        }
        .seq-box.info .seq-box-title    { color: #60a5fa !important; }
        .seq-box.warning .seq-box-title { color: #f59e0b !important; }
        .seq-box.warning p              { color: #fbbf24 !important; }
        .seq-box.success .seq-box-title { color: #34d399 !important; }

        /* ─── Tables ─── */
        .seq-table-wrap {
          overflow-x: auto; margin: 1.5rem 0;
          border-radius: 1rem;
          border: 1px solid rgba(99,102,241,.15);
          box-shadow: 0 4px 24px rgba(0,0,0,.3);
        }
        .seq-table {
          width: 100%; border-collapse: collapse;
          font-size: .8rem; font-family: 'JetBrains Mono','Courier New',monospace;
        }
        .seq-table thead tr { background: rgba(30,27,75,.9); }
        .seq-table th {
          color: #a5b4fc; padding: .75rem 1.1rem;
          text-align: center; font-size: .72rem; letter-spacing: .07em;
          font-weight: 700; white-space: nowrap;
          border-bottom: 1px solid rgba(99,102,241,.25);
          border-right: 1px solid rgba(99,102,241,.1);
        }
        .seq-table th:last-child { border-right: none; }
        .seq-table td {
          background: rgba(8,15,30,.6); color: #cbd5e1;
          padding: .65rem 1.1rem; text-align: center;
          border-bottom: 1px solid rgba(99,102,241,.07);
          border-right: 1px solid rgba(99,102,241,.07);
          transition: background .15s;
        }
        .seq-table td:last-child { border-right: none; }
        .seq-table tr:last-child td { border-bottom: none; }
        .seq-table tbody tr:hover td { background: rgba(99,102,241,.1); color: #e2e8f0; }
        .seq-table tbody tr:nth-child(even) td { background: rgba(15,23,42,.5); }
        .seq-table tbody tr:nth-child(even):hover td { background: rgba(99,102,241,.1); }

        /* ─── Diagram wrapper ─── */
        .seq-diagram {
          position: relative; overflow: hidden;
          background: rgba(8,15,30,.7);
          border: 1px solid rgba(99,102,241,.18);
          border-radius: 1rem; padding: 2rem;
          margin: 1.5rem 0; text-align: center;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.03);
        }
        .seq-diagram::before {
          content: 'CIRCUIT DIAGRAM';
          position: absolute; top: .75rem; left: 1rem;
          font-size: .55rem; letter-spacing: .18em;
          color: rgba(99,102,241,.4); font-weight: 700;
        }
        .seq-diagram svg { max-width: 100%; height: auto; }
        .seq-diagram-caption {
          font-size: .75rem; color: #475569;
          margin-top: .9rem; font-style: italic; letter-spacing: .02em;
        }

        /* ─── Simulator widgets ─── */
        .seq-sim, .seq-sim-mini {
          background: rgba(10,18,35,.8);
          border: 1px solid rgba(99,102,241,.2);
          border-radius: 1rem; padding: 1.4rem 1.6rem; margin: 1.5rem 0;
          box-shadow: 0 4px 24px rgba(0,0,0,.3);
          backdrop-filter: blur(8px);
        }
        .seq-sim::before, .seq-sim-mini::before {
          content: ''; display: block;
          height: 2px; margin: -1.4rem -1.6rem 1.2rem;
          border-radius: 1rem 1rem 0 0;
          background: linear-gradient(90deg, #4f46e5, #7c3aed, #4f46e5);
          background-size: 200% 100%;
          animation: seq-shimmer 3s linear infinite;
        }
        @keyframes seq-shimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        .seq-sim-title {
          font-size: .68rem !important; letter-spacing: .14em; text-transform: uppercase;
          color: #818cf8 !important; margin: 0 0 1.1rem !important;
          font-weight: 700 !important;
        }
        .seq-sim-inputs {
          display: flex; gap: 1rem; margin-bottom: 1.1rem;
          flex-wrap: wrap; align-items: center;
        }
        .seq-sim-label {
          display: flex; align-items: center; gap: .6rem;
          font-size: .85rem; color: #cbd5e1; font-weight: 500;
        }
        .seq-sim-toggle {
          min-width: 52px; height: 30px; border-radius: 8px; border: 2px solid;
          font-size: .85rem; font-weight: 700; cursor: pointer;
          font-family: 'JetBrains Mono',monospace; transition: all .2s ease;
          letter-spacing: .05em;
        }
        .seq-sim-toggle.on {
          background: rgba(16,185,129,.15); border-color: #10b981; color: #10b981;
          box-shadow: 0 0 12px rgba(16,185,129,.25);
        }
        .seq-sim-toggle.off {
          background: rgba(30,41,59,.6); border-color: #374151; color: #6b7280;
        }
        .seq-sim-toggle:hover { transform: translateY(-1px); }

        .seq-clk-btn {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .45rem 1.1rem;
          background: rgba(79,70,229,.15);
          border: 2px solid rgba(99,102,241,.45);
          border-radius: 8px; color: #a5b4fc;
          font-size: .8rem; font-weight: 700; cursor: pointer;
          font-family: 'JetBrains Mono',monospace; transition: all .2s ease;
        }
        .seq-clk-btn:hover {
          background: rgba(79,70,229,.3); border-color: #6366f1;
          color: #c7d2fe; transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99,102,241,.3);
        }
        .seq-clk-btn:active { transform: translateY(0); }

        .seq-sim-output {
          background: rgba(5,11,24,.7); border-radius: .75rem;
          padding: 1rem 1.2rem;
          border: 1px solid rgba(16,185,129,.18);
          display: flex; flex-direction: column; gap: .4rem;
        }
        .seq-sim-output.invalid {
          border-color: rgba(239,68,68,.35);
          background: rgba(239,68,68,.05);
        }
        .seq-out-row { display: flex; align-items: center; gap: .5rem; }
        .seq-out-label {
          font-size: .78rem; color: #475569; font-family: 'JetBrains Mono',monospace;
          min-width: 32px;
        }
        .seq-out-val {
          font-size: 1.05rem; font-weight: 700; color: #10b981;
          font-family: 'JetBrains Mono',monospace;
          text-shadow: 0 0 12px rgba(16,185,129,.4);
        }
        .seq-sim-output.invalid .seq-out-val { color: #ef4444; text-shadow: 0 0 12px rgba(239,68,68,.4); }
        .seq-sim-state {
          margin-top: .3rem; font-size: .7rem; letter-spacing: .1em;
          text-transform: uppercase; color: #6366f1; font-weight: 600;
        }
        .seq-sim-output.invalid .seq-sim-state { color: #ef4444; }

        /* ─── Equation display ─── */
        .seq-equation {
          font-family: 'JetBrains Mono', monospace;
          font-size: .95rem; font-weight: 600;
          color: #c7d2fe;
          background: rgba(99,102,241,.08);
          border: 1px solid rgba(99,102,241,.2);
          border-radius: .6rem;
          padding: .75rem 1.2rem;
          margin: .75rem 0;
          display: block;
          letter-spacing: .04em;
        }

        /* ─── Feature grid (key-value cards) ─── */
        .seq-grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem; margin: 1.25rem 0;
        }
        .seq-feature-card {
          background: rgba(15,23,42,.6);
          border: 1px solid rgba(99,102,241,.15);
          border-radius: .875rem; padding: 1.1rem 1.2rem;
          transition: all .2s ease;
        }
        .seq-feature-card:hover {
          border-color: rgba(99,102,241,.35);
          background: rgba(99,102,241,.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,.3);
        }
        .seq-feature-icon { font-size: 1.4rem; margin-bottom: .5rem; display: block; }
        .seq-feature-title { font-size: .8rem; font-weight: 700; color: #a5b4fc; margin-bottom: .35rem; }
        .seq-feature-desc  { font-size: .8rem; color: #64748b; line-height: 1.6; margin: 0; }

        /* ─── Pagination ─── */
        .seq-pagination {
          display: flex; justify-content: space-between; align-items: stretch; gap: 1rem;
          margin-top: 4rem; padding-top: 2rem;
          border-top: 1px solid rgba(99,102,241,.1);
        }
        .seq-pag-btn {
          display: flex; align-items: center; gap: .85rem;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(99,102,241,.18);
          border-radius: 1rem; text-decoration: none; color: #64748b;
          background: rgba(15,23,42,.5);
          transition: all .2s ease;
          flex: 1; max-width: 280px;
          backdrop-filter: blur(8px);
        }
        .seq-pag-btn:hover {
          border-color: rgba(99,102,241,.4); color: #c7d2fe;
          background: rgba(99,102,241,.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,.15);
        }
        .seq-pag-prev { }
        .seq-pag-next { margin-left: auto; }
        .seq-pag-finish { margin-left: auto; border-color: rgba(16,185,129,.25); }
        .seq-pag-finish:hover { border-color: rgba(16,185,129,.5); box-shadow: 0 8px 24px rgba(16,185,129,.1); }

        .seq-pag-arrow {
          width: 36px; height: 36px; border-radius: .6rem; flex-shrink: 0;
          background: rgba(99,102,241,.12); border: 1px solid rgba(99,102,241,.2);
          display: flex; align-items: center; justify-content: center;
          color: #818cf8; transition: all .2s ease;
        }
        .seq-pag-arrow-home { font-size: 1.1rem; }
        .seq-pag-btn:hover .seq-pag-arrow { background: rgba(99,102,241,.25); border-color: rgba(99,102,241,.4); }
        .seq-pag-info { display: flex; flex-direction: column; gap: .2rem; flex: 1; }
        .seq-pag-info-right { align-items: flex-end; }
        .seq-pag-hint  { font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; color: #374151; }
        .seq-pag-name  { font-size: .82rem; font-weight: 600; line-height: 1.3; }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .seq-main { padding: 2rem 2.5rem 4rem; }
        }
        @media (max-width: 900px) {
          .seq-hamburger { display: flex; }
          .seq-sidebar {
            position: fixed; top: 56px; left: 0; bottom: 0; z-index: 50;
            transform: translateX(-100%); width: 280px;
          }
          .seq-sidebar.open { transform: translateX(0); }
          .seq-overlay { display: block; }
          .seq-main { padding: 1.75rem 1.5rem 4rem; max-width: 100%; }
          .seq-topbar-center { display: none; }
        }
        @media (max-width: 560px) {
          .seq-main { padding: 1.25rem 1rem 3rem; }
          .seq-page-title { font-size: 1.5rem; }
          .seq-pagination { flex-direction: column; }
          .seq-pag-btn { max-width: 100%; }
          .seq-pag-next, .seq-pag-finish { margin-left: 0; }
        }
      `}</style>
    </div>
  );
};

export default SeqLayout;
