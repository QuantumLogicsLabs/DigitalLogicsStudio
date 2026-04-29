import React from 'react';
import { Link } from 'react-router-dom';

const SeqSidebar = ({ seqPages, currentIndex, progress, sidebarOpen, setSidebarOpen }) => {
  return (
    <aside className={`seq-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="seq-sidebar-inner">
        <div className="seq-sidebar-header">
          <div className="seq-sidebar-logo">⟳</div>
          <div>
            <p className="seq-sidebar-title">Sequential</p>
            <p className="seq-sidebar-subtitle">Circuits</p>
          </div>
        </div>

        <div className="seq-sidebar-progress">
          <div className="seq-sidebar-progress-bar">
            <div className="seq-sidebar-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="seq-sidebar-progress-label">{progress}% complete</span>
        </div>

        <nav className="seq-sidebar-nav">
          {seqPages.map((p, i) => {
            const isActive = window.location.pathname === p.path;
            const isVisited = i < currentIndex;
            return (
              <Link
                key={p.path}
                to={p.path}
                className={`seq-nav-item${isActive ? ' active' : ''}${isVisited ? ' visited' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="seq-nav-num">{String(i + 1).padStart(2, '0')}</span>
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
          <Link to="/" className="seq-sidebar-home-btn">← Back to All Topics</Link>
        </div>
      </div>
    </aside>
  );
};

export default SeqSidebar;
