import { Link } from "react-router-dom";

export default function HeroSection({ searchTerm, setSearchTerm }) {
  return (
    <section className="home-hero" id="top">
      <div className="home-hero-content">
        <div className="hero-badge" style={{
          display: 'inline-block',
          padding: '0.4rem 1rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '999px',
          fontSize: '0.8rem',
          color: '#60a5fa',
          fontWeight: '600',
          marginBottom: '1.5rem',
          animation: 'fadeIn 1s ease-out'
        }}>
          ✨ New: Interactive Boolean Toolkit
        </div>
        <h2>Explore, visualize and master digital logic.</h2>
        <p>
          Jump into interactive tools for circuits, Karnaugh maps, number
          systems, and binary arithmetic — all in one smooth experience.
        </p>

        {/* New Search Bar */}
        <div className="search-container" style={{
          marginTop: '2.5rem',
          maxWidth: '500px',
          position: 'relative'
        }}>
          <input 
            type="text" 
            placeholder="Search for tools (e.g. 'K-Map', 'Binary')..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '1rem',
              color: 'var(--text-color)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)'
            }}
            className="home-search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--secondary-text)',
                cursor: 'pointer'
              }}
            >✕</button>
          )}
        </div>

        <div className="home-hero-actions" style={{ marginTop: '2rem' }}>
          <Link to="/boolforge" className="home-primary-btn">
            Launch Circuit Forge
          </Link>
          <Link to="/boolean-algebra" className="home-secondary-btn">
            Explore Boolean Algebra
          </Link>
        </div>
      </div>
    </section>
  );
}
