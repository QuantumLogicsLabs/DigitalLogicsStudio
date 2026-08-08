import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { useTheme } from "../../shared/context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function getErrorMessage(error, fallback) {
  const isNetworkError = !error.response && !error.status;
  if (isNetworkError) {
    return "Cannot reach the server. Please check your connection and try again.";
  }
  return error.message || fallback;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();
  const {
    user,
    emailNotificationsOptedOut,
    updateNotificationPreferences,
    changePassword,
    deleteAccount,
  } = useAuth();

  // ── Email notifications ──
  const [notificationsEnabled, setNotificationsEnabled] = useState(!emailNotificationsOptedOut);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifError, setNotifError] = useState("");

  const handleToggleNotifications = async () => {
    if (notifSaving) return;
    const nextEnabled = !notificationsEnabled;
    setNotifError("");
    setNotificationsEnabled(nextEnabled); 
    setNotifSaving(true);
    try {
      await updateNotificationPreferences(!nextEnabled);
    } catch (err) {
      setNotificationsEnabled(!nextEnabled);
      setNotifError(getErrorMessage(err, "Couldn't update your preference. Please try again."));
    } finally {
      setNotifSaving(false);
    }
  };

  // ── Change password ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from your current password.");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(getErrorMessage(err, "Unable to update your password right now."));
    } finally {
      setPasswordSaving(false);
    }
  };

  // ── Delete account ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm.");
      return;
    }

    setDeleteSaving(true);
    try {
      await deleteAccount(deletePassword);
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(getErrorMessage(err, "Unable to delete your account right now."));
      setDeleteSaving(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="auth-main profile-main settings-main">
        <section className="profile-panel">
          <article className="profile-hero settings-hero">
            <span className="auth-eyebrow">Settings</span>
            <h1>Account Settings</h1>
            <p>
              Signed in as <strong>{user?.name || "User"}</strong> ({user?.email}).
            </p>
          </article>

          {/* ── Appearance ── */}
          <article className="profile-card settings-card">
            <h2>Appearance</h2>
            <div className="settings-list">
              <div className="settings-item">
                <div>
                  <h3>Dark Mode</h3>
                  <p>Switch between light and dark theme across the whole app.</p>
                </div>
                <button
                  type="button"
                  className={`settings-toggle${theme === "dark" ? " is-on" : ""}`}
                  role="switch"
                  aria-checked={theme === "dark"}
                  aria-label="Toggle dark mode"
                  onClick={toggleTheme}
                >
                  <span className="settings-toggle-track">
                    <span className="settings-toggle-thumb" />
                  </span>
                  <span className="settings-toggle-label">
                    {theme === "dark" ? "Dark" : "Light"}
                  </span>
                </button>
              </div>
            </div>
          </article>

          {/* ── Notifications ── */}
          <article className="profile-card settings-card">
            <h2>Notifications</h2>
            <div className="settings-list">
              <div className="settings-item">
                <div>
                  <h3>Email Notifications</h3>
                  <p>
                    Welcome email, milestone emails (5/10/25+ problems solved), a weekly
                    progress digest, and a reminder if you've been away a while.
                  </p>
                  {notifError && <p className="settings-error-text">{notifError}</p>}
                </div>
                <button
                  type="button"
                  className={`settings-toggle${notificationsEnabled ? " is-on" : ""}`}
                  role="switch"
                  aria-checked={notificationsEnabled}
                  aria-label="Toggle email notifications"
                  disabled={notifSaving}
                  onClick={handleToggleNotifications}
                >
                  <span className="settings-toggle-track">
                    <span className="settings-toggle-thumb" />
                  </span>
                  <span className="settings-toggle-label">
                    {notifSaving ? "Saving…" : notificationsEnabled ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>
          </article>

          {/* ── Security ── */}
          <article className="profile-card settings-card">
            <h2>Security</h2>
            <p className="settings-card-subtext">Change the password used to log in.</p>

            <form className="auth-form settings-form" onSubmit={handleChangePassword} noValidate>
              <label className="auth-field">
                <span>Current Password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </label>

              <label className="auth-field">
                <span>New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
              </label>

              <label className="auth-field">
                <span>Confirm New Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                />
              </label>

              {passwordError ? <p className="auth-error">{passwordError}</p> : null}
              {passwordSuccess ? <p className="settings-success-text">{passwordSuccess}</p> : null}

              <button type="submit" className="auth-submit" disabled={passwordSaving}>
                {passwordSaving ? "Updating…" : "Update Password"}
              </button>
            </form>
          </article>

          {/* ── Danger zone ── */}
          <article className="profile-card settings-card settings-danger-card">
            <h2>Danger Zone</h2>
            <p className="settings-card-subtext">
              Permanently delete your account, including all solved problems, progress, and
              activity history. This cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button
                type="button"
                className="settings-danger-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete My Account
              </button>
            ) : (
              <form className="auth-form settings-form" onSubmit={handleDeleteAccount} noValidate>
                <label className="auth-field">
                  <span>Enter your password to confirm</span>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      if (deleteError) setDeleteError("");
                    }}
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                </label>

                {deleteError ? <p className="auth-error">{deleteError}</p> : null}

                <div className="settings-danger-actions">
                  <button
                    type="button"
                    className="auth-secondary-btn"
                    disabled={deleteSaving}
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword("");
                      setDeleteError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="settings-danger-btn" disabled={deleteSaving}>
                    {deleteSaving ? "Deleting…" : "Permanently Delete Account"}
                  </button>
                </div>
              </form>
            )}
          </article>

          <div className="profile-actions settings-actions">
            <Link to="/profile" className="auth-secondary-btn settings-back-link">
              <span className="settings-back-icon" aria-hidden="true">
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
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </span>
              <span>Back to Profile</span>
            </Link>
            <Link to="/problems" className="auth-submit settings-primary-link settings-continue-link">
              Continue Practice
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
