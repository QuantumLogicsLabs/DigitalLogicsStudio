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

  return (
    <div className="reg-layout-refined">
      {/* 
          We removed the local blobs and topbar because this component 
          is now wrapped in MainLayout/ModuleLayout.
      */}
      <div className="reg-body">
        {sidebarOpen && (
          <div className="reg-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main content ── */}
        <main className="reg-main" style={{ padding: 0 }}>
          <div className="reg-content">{children}</div>

          {/* ── Prev / Next navigation ── */}
          <div className="reg-page-nav" style={{ marginTop: '3rem' }}>
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
