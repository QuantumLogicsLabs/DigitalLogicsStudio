import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/MainLayout.css";

const MainLayout = ({ 
  title, 
  subtitle, 
  moduleName = "Digital Logics Studio",
  sidebarContent,
  children 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* Background blobs */}
      <div className="app-bg-blob app-bg-1" />
      <div className="app-bg-blob app-bg-2" />

      {/* TOPBAR */}
      <header className="app-topbar">
        <div className="app-topbar-left">
          <button
            className="afhdl-theme-btn" /* Reusing class for consistency */
            style={{ border: 'none', background: 'transparent' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="afhdl-topbar-link">
            <Home size={18} />
            <span className="hide-mobile">Home</span>
          </Link>
        </div>

        <div className="app-topbar-center">
          <span className="afhdl-category-pill">
            <span className="afhdl-pill-dot" />
            {moduleName}
          </span>
        </div>

        <div className="app-topbar-right">
          <button
            className="app-theme-toggle afhdl-theme-btn"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <div className="app-main-container">
        {/* SIDEBAR */}
        <aside className={`app-sidebar ${sidebarOpen ? "is-open" : ""}`}>
          <div style={{ padding: '1.5rem' }}>
            {sidebarContent || (
              <div className="app-card">
                <p style={{ fontSize: '0.8rem', color: 'var(--app-muted)' }}>Navigation</p>
                <h3 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>Module Links</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--app-muted)' }}>
                  Select a topic to begin learning.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="app-main">
          {/* Breadcrumbs */}
          <nav className="afhdl-breadcrumb">
            <Link to="/" className="afhdl-bc-link">Home</Link>
            <span className="afhdl-bc-sep">›</span>
            <span className="afhdl-bc-current">{title || "Tool"}</span>
          </nav>

          {/* Hero Section */}
          <section className="app-hero">
            <h1 className="app-hero-title">{title}</h1>
            {subtitle && <p className="app-hero-subtitle">{subtitle}</p>}
          </section>

          <div className="app-content-wrap">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="afhdl-overlay" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default MainLayout;
