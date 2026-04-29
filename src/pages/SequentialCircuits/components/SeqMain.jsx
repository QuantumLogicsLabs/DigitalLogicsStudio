import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';
import ShowWorkToggle from './ShowWorkToggle';

const SeqMain = ({ seqPages, currentIndex, prev, next, title, subtitle, children }) => {
  const [showWork, setShowWork] = useState(false);

  return (
    <main className="seq-main">
      <div className="seq-page-header">
        <nav className="seq-breadcrumb">
          <Link to="/" className="seq-bc-link">Home</Link>
          <span className="seq-bc-chevron">›</span>
          <span className="seq-bc-mid">Sequential Circuits</span>
          <span className="seq-bc-chevron">›</span>
          <span className="seq-bc-current">{title}</span>
        </nav>

        <div className="seq-header-content">
          <div className="seq-header-badge">
            <span className="seq-header-badge-icon">{seqPages[currentIndex]?.icon}</span>
            <span className="seq-header-badge-label">Chapter</span>
            <strong className="seq-header-badge-number">{currentIndex + 1}</strong>
          </div>

          <div className="seq-header-main">
            <div className="seq-header-copy">
              <h1 className="seq-page-title">{title}</h1>
              {subtitle && <p className="seq-page-subtitle">{subtitle}</p>}
            </div>
            <div className="seq-header-actions">
              <ShowWorkToggle showWork={showWork} setShowWork={setShowWork} />
            </div>
          </div>
        </div>

        <div className="seq-chapter-dots">
          {seqPages.map((p, i) => (
            <Link key={p.path} to={p.path} className={`seq-dot${i === currentIndex ? ' active' : ''}${i < currentIndex ? ' done' : ''}`} title={p.label} />
          ))}
        </div>
      </div>

      <div className="seq-content-body" data-show-work={showWork}>{children}</div>

      <div className="seq-pagination">
        {prev ? (
          <Link to={prev.path} className="seq-pag-btn seq-pag-prev">
            <div className="seq-pag-arrow">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="seq-pag-info">
              <span className="seq-pag-hint">Previous</span>
              <span className="seq-pag-name">{prev.icon} {prev.label}</span>
            </div>
          </Link>
        ) : <span />}

        {next ? (
          <Link to={next.path} className="seq-pag-btn seq-pag-next">
            <div className="seq-pag-info seq-pag-info-right">
              <span className="seq-pag-hint">Up Next</span>
              <span className="seq-pag-name">{next.icon} {next.label}</span>
            </div>
            <div className="seq-pag-arrow">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        ) : (
          <Link to="/" className="seq-pag-btn seq-pag-finish">
            <div className="seq-pag-info seq-pag-info-right">
              <span className="seq-pag-hint"><Sparkles size={18} style={{ display: 'inline-block', marginRight: '.4rem' }} /> All done!</span>
              <span className="seq-pag-name">Return to Home</span>
            </div>
            <div className="seq-pag-arrow seq-pag-arrow-home"><Home size={24} /></div>
          </Link>
        )}
      </div>
    </main>
  );
};

export default SeqMain;
