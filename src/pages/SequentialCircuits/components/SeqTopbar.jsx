import React from 'react';
import { Link } from 'react-router-dom';
 
import ThemeToggle from './ThemeToggle';

const SeqTopbar = ({ currentIndex, progress, sidebarOpen, setSidebarOpen }) => {
  return (
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
        <div className="seq-progress-ring-wrap" title={`${currentIndex + 1} of 8`}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="3" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#818cf8" strokeWidth="3" strokeDasharray={`${progress * 0.879} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" style={{ transition: 'stroke-dasharray 0.4s ease' }} />
          </svg>
          <span className="seq-progress-text">{currentIndex + 1}/8</span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default SeqTopbar;
