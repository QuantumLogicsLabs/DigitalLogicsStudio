import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DLD_NAV_LINKS = [
  { to: "/problems", label: "Problems" },
  { to: "/boolforge", label: "Circuit Forge" },
  { to: "/kmapgenerator", label: "K-Map Studio" },
];

const COAL_NAV_LINKS = [
  { to: "/resources/coal", label: "COAL Home", end: true },
  { to: "/resources/coal/theory", label: "Theory", matchTheory: true },
  { to: "/resources/coal/practical", label: "Practical" },
  { to: "/resources/coal/problems", label: "Problems" },
];

function isCoalTheoryRoute(pathname) {
  return pathname.startsWith("/resources/coal/theory") || pathname.startsWith("/coal/");
}

function isCoalRoute(pathname) {
  return pathname.startsWith("/resources/coal") || pathname.startsWith("/coal/");
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Navbar({ toggleTheme, theme, onHomeClick, onToggleNavbar, navbarVisible }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "No email linked";
  const firstName = displayName.split(/\s+/)[0];
  const onCoalTrack = isCoalRoute(location.pathname);
  const navLinks = onCoalTrack ? COAL_NAV_LINKS : DLD_NAV_LINKS;
  const brandTagline = onCoalTrack
    ? "Computer Organization & Assembly"
    : "The Digital Logic Playground";

  const userInitials = useMemo(() => {
    const name = user?.name?.trim();
    if (!name) return "U";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [user?.name]);

  useEffect(() => {
    if (!profileMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileMenuOpen]);

  const handleHomeClick = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
    onHomeClick?.();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setMenuOpen(false);
      setProfileMenuOpen(false);
    }
  };

  const renderNavLinks = (baseClassName) =>
    navLinks.map(({ to, label, end, matchTheory }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={() => {
          const active = matchTheory
            ? isCoalTheoryRoute(location.pathname)
            : end
              ? location.pathname === to
              : location.pathname.startsWith(to);
          return active
            ? `${baseClassName} home-nav-link--active`
            : baseClassName;
        }}
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </NavLink>
    ));

  return (
    <header className="home-header">
      <div className="home-header-inner">
        <Link
          to="/"
          className="home-brand home-brand-link"
          aria-label="Go to home page"
          onClick={handleHomeClick}
        >
          <div className="home-logo-container">
            <svg viewBox="0 0 100 100" className="home-logo-svg">
              <defs>
                <linearGradient
                  id="logo-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
                  <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
                </linearGradient>
                <filter
                  id="soft-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="4"
                    result="blur"
                  />
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
              <circle
                cx="30"
                cy="20"
                r="7"
                fill="var(--logo-node-color)"
                className="logo-node"
                style={{ filter: "url(#soft-glow)" }}
              />
              <circle
                cx="30"
                cy="50"
                r="7"
                fill="var(--logo-node-color)"
                className="logo-node"
                style={{ filter: "url(#soft-glow)" }}
              />
              <circle
                cx="30"
                cy="80"
                r="7"
                fill="var(--logo-node-color)"
                className="logo-node"
                style={{ filter: "url(#soft-glow)" }}
              />
            </svg>
          </div>
          <div className="home-brand-text">
            <span className="home-title">Boolforge</span>
            <span className="home-tagline">{brandTagline}</span>
          </div>
        </Link>

        <nav className="home-nav" aria-label="Main navigation">
          {renderNavLinks("home-nav-link")}
        </nav>

        <div className="home-nav-controls">
          {!loading && (
            <div className="home-auth-actions">
              {user ? (
                <div className="home-profile-menu" ref={profileMenuRef}>
                  <button
                    type="button"
                    className={`home-profile-trigger${profileMenuOpen ? " is-open" : ""}`}
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={profileMenuOpen}
                    aria-label="Open profile menu"
                  >
                    <span className="home-profile-avatar">{userInitials}</span>
                    <span className="home-profile-name">{firstName}</span>
                    <span className="home-profile-chevron" aria-hidden="true">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  {profileMenuOpen && (
                    <div className="home-profile-dropdown" role="menu" aria-label="Profile actions">
                      <div className="home-profile-dropdown-header">
                        <span className="home-profile-dropdown-avatar">{userInitials}</span>
                        <div className="home-profile-dropdown-meta">
                          <span className="home-profile-dropdown-name">{displayName}</span>
                          <span className="home-profile-dropdown-email">{displayEmail}</span>
                        </div>
                      </div>
                      <div className="home-profile-dropdown-divider" />
                      <Link
                        to="/profile"
                        className="home-profile-item"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          setProfileMenuOpen(false);
                        }}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="home-profile-item"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          setProfileMenuOpen(false);
                        }}
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        className="home-profile-item home-profile-item--logout"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="home-auth-btn home-auth-btn--ghost"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="home-auth-btn home-auth-btn--primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="home-theme-btn"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          {onToggleNavbar && (
            <button
              onClick={onToggleNavbar}
              className="home-navbar-toggle-btn"
              aria-label="Hide navbar"
              title="Hide navbar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
              </svg>
            </button>
          )}
          <button
            className={`home-hamburger${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="home-mobile-nav"
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </div>

      <nav
        id="home-mobile-nav"
        className={`home-mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="home-mobile-nav-inner">
          {renderNavLinks("home-mobile-link")}
          {!loading && (
            <div className="home-mobile-auth">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="home-auth-btn home-auth-btn--ghost"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="home-auth-btn home-auth-btn--ghost"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="home-auth-btn home-auth-btn--danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="home-auth-btn home-auth-btn--ghost"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="home-auth-btn home-auth-btn--primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
