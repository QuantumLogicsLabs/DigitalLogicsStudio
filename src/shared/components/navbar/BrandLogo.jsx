import React from "react";
import { Link } from "react-router-dom";

export function BrandLogo({ tagline, onClick }) {
  return (
    <Link
      to="/"
      className="home-brand home-brand-link"
      aria-label="Go to home page"
      onClick={onClick}
    >
      <div className="home-logo-container">
        <svg viewBox="0 0 100 100" className="home-logo-svg">
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
              <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
            </linearGradient>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M30,20 L70,20 L85,35 L85,45 L70,50 L30,50 L70,50 L85,55 L85,75 L70,80 L30,80 L30,20"
            fill="none"
            stroke="url(#logo-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-trace"
          />
          <circle cx="30" cy="20" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: "url(#soft-glow)" }} />
          <circle cx="30" cy="50" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: "url(#soft-glow)" }} />
          <circle cx="30" cy="80" r="7" fill="var(--logo-node-color)" className="logo-node" style={{ filter: "url(#soft-glow)" }} />
        </svg>
      </div>
      <div className="home-brand-text">
        <span className="home-title">Boolforge</span>
        <span className="home-tagline">{tagline}</span>
      </div>
    </Link>
  );
}
