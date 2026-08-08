import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function ProfileDropdown({ user, userInitials, onLogout, onCloseAll }) {
  const [isOpen, setIsOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "No email linked";
  const firstName = displayName.split(/\s+/)[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
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
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
    onCloseAll?.();
  };

  return (
    <div className="home-profile-menu" ref={profileMenuRef}>
      <button
        type="button"
        className={`home-profile-trigger${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open profile menu"
      >
        <span className="home-profile-avatar">{userInitials}</span>
        <span className="home-profile-name">{firstName}</span>
        <span className="home-profile-chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="home-profile-dropdown" role="menu" aria-label="Profile actions">
          <div className="home-profile-dropdown-header">
            <span className="home-profile-dropdown-avatar">{userInitials}</span>
            <div className="home-profile-dropdown-meta">
              <span className="home-profile-dropdown-name">{displayName}</span>
              <span className="home-profile-dropdown-email">{displayEmail}</span>
            </div>
          </div>
          <div className="home-profile-dropdown-divider" />
          <Link to="/profile" className="home-profile-item" role="menuitem" onClick={handleLinkClick}>
            Profile
          </Link>
          <Link to="/settings" className="home-profile-item" role="menuitem" onClick={handleLinkClick}>
            Settings
          </Link>
          <button
            type="button"
            className="home-profile-item home-profile-item--logout"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
