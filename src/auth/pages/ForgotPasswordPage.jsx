import React from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { useTheme } from "../../shared/context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import authService from "../../shared/services/authService";
import "./Auth.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEP = {
  EMAIL: "email",
  OTP: "otp",
  PASSWORD: "password",
  DONE: "done",
};

export default function ForgotPasswordPage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { isAuthenticated, loading: isLoading } = useAuth();

  const [step, setStep] = React.useState(STEP.EMAIL);
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [resetToken, setResetToken] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const getErrorMessage = (error, fallback) => {
    const isNetworkError = !error.response && !error.status;
    if (isNetworkError) {
      return "Cannot reach the server. Please check your connection and try again.";
    }
    return error.message || fallback;
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await authService.forgotPassword({ email: trimmedEmail });
      setEmail(trimmedEmail);
      setStep(STEP.OTP);
    } catch (error) {
      setFormError(getErrorMessage(error, "Unable to send the verification code right now."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp.trim())) {
      setFormError("Enter the 6-digit code sent to your email.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const data = await authService.verifyResetOtp({ email, otp: otp.trim() });
      setResetToken(data.resetToken);
      setStep(STEP.PASSWORD);
    } catch (error) {
      setFormError(getErrorMessage(error, "Invalid or expired verification code."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await authService.resetPassword({ email, resetToken, password: newPassword });
      setStep(STEP.DONE);
    } catch (error) {
      setFormError(getErrorMessage(error, "Unable to reset your password right now."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    setFormError("");

    try {
      await authService.forgotPassword({ email });
      setOtp("");
    } catch (error) {
      setFormError(getErrorMessage(error, "Unable to resend the verification code."));
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
            {step === STEP.EMAIL && (
              <>
                <div className="auth-card-header">
                  <h2>Forgot Password</h2>
                  <p>Enter your account email and we'll send you a verification code.</p>
                </div>

                <form className="auth-form" onSubmit={handleRequestOtp} noValidate>
                  <label className="auth-field">
                    <span>Email Address</span>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (formError) setFormError("");
                      }}
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </label>

                  {formError ? <p className="auth-error">{formError}</p> : null}

                  <button type="submit" className="auth-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending code..." : "Send Verification Code"}
                  </button>
                </form>
              </>
            )}

            {step === STEP.OTP && (
              <>
                <div className="auth-card-header">
                  <h2>Check Your Email</h2>
                  <p>
                    We sent a 6-digit code to <strong>{email}</strong>. It expires in 10
                    minutes.
                  </p>
                </div>

                <form className="auth-form" onSubmit={handleVerifyOtp} noValidate>
                  <label className="auth-field">
                    <span>Verification Code</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      name="otp"
                      value={otp}
                      onChange={(event) => {
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                        if (formError) setFormError("");
                      }}
                      autoComplete="one-time-code"
                      placeholder="123456"
                    />
                  </label>

                  {formError ? <p className="auth-error">{formError}</p> : null}

                  <button type="submit" className="auth-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Verify Code"}
                  </button>

                  <button
                    type="button"
                    className="auth-secondary-btn"
                    disabled={isSubmitting}
                    onClick={handleResendOtp}
                  >
                    Resend Code
                  </button>
                </form>
              </>
            )}

            {step === STEP.PASSWORD && (
              <>
                <div className="auth-card-header">
                  <h2>Set a New Password</h2>
                  <p>Choose a new password for your account.</p>
                </div>

                <form className="auth-form" onSubmit={handleResetPassword} noValidate>
                  <label className="auth-field">
                    <span>New Password</span>
                    <input
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        if (formError) setFormError("");
                      }}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                    />
                  </label>

                  <label className="auth-field">
                    <span>Confirm New Password</span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        if (formError) setFormError("");
                      }}
                      autoComplete="new-password"
                      placeholder="Re-enter your new password"
                    />
                  </label>

                  {formError ? <p className="auth-error">{formError}</p> : null}

                  <button type="submit" className="auth-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}

            {step === STEP.DONE && (
              <>
                <div className="auth-card-header">
                  <h2>Password Reset</h2>
                  <p>Your password has been changed successfully.</p>
                </div>

                <p className="auth-success">You can now log in with your new password.</p>

                <Link to="/login" className="auth-submit" style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
                  Go to Login
                </Link>
              </>
            )}

            {step !== STEP.DONE && (
              <p className="auth-switch-copy">
                Remembered your password? <Link to="/login">Login here</Link>
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
