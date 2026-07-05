import React from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitialForm(mode) {
  if (mode === "signup") {
    return { name: "", email: "", password: "", confirmPassword: "" };
  }
  return { email: "", password: "" };
}

function validateForm(mode, values) {
  if (mode === "signup") {
    if (!values.name.trim()) return "Please enter your full name.";
    if (values.name.trim().length < 2)
      return "Name must be at least 2 characters long.";
  }

  if (!values.email.trim()) return "Please enter your email address.";
  if (!emailPattern.test(values.email.trim()))
    return "Please enter a valid email address.";
  if (!values.password) return "Please enter your password.";
  if (values.password.length < 8)
    return "Password must be at least 8 characters long.";

  if (mode === "signup" && values.password !== values.confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
}

/* ── Eye icon SVGs ─────────────────────────────────────────────────────────── */
function EyeOpen() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── Password input with toggle ────────────────────────────────────────────── */
function PasswordField({ name, value, onChange, autoComplete, placeholder, label }) {
  const [visible, setVisible] = React.useState(false);

  return (
    <label className="auth-field">
      <span>{label}</span>
      <div className="auth-password-wrapper">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="auth-eye-btn"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff /> : <EyeOpen />}
        </button>
      </div>
    </label>
  );
}

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const [formValues, setFormValues] = React.useState(() =>
    getInitialForm(mode),
  );
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  // FIX 1: AuthContext exports `loading`, not `isLoading`.
  // Renamed via destructuring alias so the rest of the file can keep using `isLoading`.
  const { isAuthenticated, loading: isLoading, login, register } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm(mode, formValues);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignup) {
        // FIX 2: AuthContext.register() expects three positional args (name, email, password),
        // not a single object. Passing an object was causing name=[object Object],
        // email=undefined, password=undefined → 400 from the backend every time.
        const data = await register(
          formValues.name.trim(),
          formValues.email.trim().toLowerCase(),
          formValues.password,
        );

        // FIX 3: register/login return the full API response object { success, message, user }.
        // The user is nested under data.user, not at the top level.
        navigate(redirectTo, {
          replace: true,
          state: {
            authMessage: `Welcome, ${data.user.name}. Your account has been created successfully.`,
          },
        });
      } else {
        // FIX 2 (login side): AuthContext.login(email, password) expects two positional
        // args, NOT an object. Passing { email, password } made email = the whole object
        // and password = undefined → backend got empty fields → 400 "fields are required".
        const data = await login(
          formValues.email.trim().toLowerCase(),
          formValues.password,
        );

        // FIX 3: Same as above — user is at data.user, not data directly.
        navigate(redirectTo, {
          replace: true,
          state: { authMessage: `Welcome back, ${data.user.name}.` },
        });
      }
    } catch (error) {
      // The Axios response interceptor in apiClient.js already extracts
      // error.response.data.message into error.message, so we read error.message
      // directly. A missing error.response means it never reached the server at all.
      const isNetworkError = !error.response && !error.status;

      if (isNetworkError) {
        setFormError(
          "Cannot reach the server. Please check your connection and try again.",
        );
      } else {
        setFormError(
          error.message ||
            `Unable to ${isSignup ? "create your account" : "log you in"} right now.`,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="auth-main">
        <section className="auth-panel">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>{isSignup ? "Sign Up" : "Login"}</h2>
              <p>
                {isSignup
                  ? "Create an account using your name, email, and password."
                  : "Enter your email and password to access your account."}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <label className="auth-field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Muhammad Saad"
                  />
                </label>
              )}

              <label className="auth-field">
                <span>Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>

              <PasswordField
                label="Password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="At least 8 characters"
              />

              {isSignup && (
                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                />
              )}

              {formError ? <p className="auth-error">{formError}</p> : null}

              <button
                type="submit"
                className="auth-submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting
                  ? isSignup
                    ? "Creating account..."
                    : "Logging in..."
                  : isSignup
                    ? "Create Account"
                    : "Login"}
              </button>
            </form>

            <p className="auth-switch-copy">
              {isSignup ? "Already have an account?" : "Need an account?"}{" "}
              <Link to={isSignup ? "/login" : "/signup"}>
                {isSignup ? "Login here" : "Sign up here"}
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
