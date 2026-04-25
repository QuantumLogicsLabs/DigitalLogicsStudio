import { Link } from "react-router-dom";

export function Navbar({ toggleTheme, theme }) {
  return (
    <>
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-brand">
            <div className="home-logo-container" style={{ position: 'relative', width: '45px', height: '45px' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
                    <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
                  </linearGradient>
                  <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* PCB Style Trace B */}
                <path 
                  d="M30,20 L70,20 L85,35 L85,45 L70,50 L30,50 L70,50 L85,55 L85,75 L70,80 L30,80 L30,20" 
                  fill="none" 
                  stroke="url(#logo-grad)" 
                  strokeWidth="7" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="logo-trace"
                />
                
                {/* Larger, Glowing Terminal Nodes */}
                <circle cx="30" cy="20" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: 'url(#soft-glow)' }} />
                <circle cx="30" cy="50" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: 'url(#soft-glow)' }} />
                <circle cx="30" cy="80" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: 'url(#soft-glow)' }} />
              </svg>
            </div>
            <div>
              <h1 className="home-title" style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--text-color)',
                letterSpacing: '-0.01em'
              }}>Boolforge</h1>
              <p className="home-tagline">The Digital Logic Playground</p>
            </div>
          </div>

          <nav className="home-nav">
            <Link to="/boolforge" className="home-nav-link">
              Circuit Forge
            </Link>
            <Link to="/gates" className="home-nav-link">
              Gates
            </Link>
            <Link to="/timing-diagrams" className="home-nav-link">
              Timing
            </Link>
            <Link to="/numbersystemcalculator" className="home-nav-link">
              Number Calculator
            </Link>
            <Link to="/numberconversation" className="home-nav-link">
              Base Converter
            </Link>
            <Link to="/binaryrepresentation" className="home-nav-link">
              Binary Visualizer
            </Link>
            <Link to="/significant-digits" className="home-nav-link">
              Significant Digits
            </Link>
            <Link to="/bcd-notation" className="home-nav-link">
              BCD
            </Link>
            <Link to="/ascii-notation" className="home-nav-link">
              ASCII
            </Link>
            <Link to="/bit-extension" className="home-nav-link">
              Bit Extension
            </Link>
            <Link to="/kmapgenerator" className="home-nav-link">
              K‑Map Studio
            </Link>
            <Link to="/encoder" className="home-nav-link">
              Encoder
            </Link>
            <Link to="/decoder" className="home-nav-link">
              Decoder
            </Link>
            <Link to="/book" className="home-nav-link">
              Book Ch1
            </Link>
            <Link to="/book/ch2" className="home-nav-link">
              Book Ch2
            </Link>
            <Link to="/sequential/intro" className="home-nav-link">
              Sequential
            </Link>
            <button 
              onClick={toggleTheme} 
              className="home-nav-link theme-toggle"
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.4rem 0.8rem'
              }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
