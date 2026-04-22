/**
 * theme.js — Shared design tokens
 *
 * A single source of truth for colors, radii, and spacing used
 * across both the Decoder and Encoder pages.  Import what you need
 * rather than scattering magic strings throughout the codebase.
 */

// ─── Color palette ─────────────────────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  pageBg: "#080e1e",
  cardBg: "rgba(10,16,32,0.85)",
  inputBg: "rgba(12,18,35,0.7)",
  darkBg: "rgba(8,14,30,0.9)",
  deepBg: "rgba(15,23,42,0.9)",

  // Brand / accent
  indigo: "#6366f1",
  indigoLight: "#a5b4fc",
  indigoMuted: "rgba(99,102,241,0.2)",

  // Signal states
  high: "#00ff88",   // Logic HIGH — bright green
  low: "#ef4444",    // Logic LOW / error — red
  warn: "#fbbf24",   // Enable / warning — amber
  blue: "#60a5fa",   // Address inputs
  purple: "#a78bfa", // Secondary accent

  // Text
  textPrimary: "#e2e8f0",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
  textDim: "#4b5563",
};

// ─── Typography ────────────────────────────────────────────────────────────────
export const FONT = {
  mono: "monospace",
  base: "inherit",
};

// ─── Shared inline-style helpers ───────────────────────────────────────────────
/**
 * Returns inline styles for a "pill" bit indicator.
 * @param {boolean} isActive - Whether this bit is HIGH (1)
 * @param {string}  activeColor - Color when HIGH
 */
export const bitIndicatorStyle = (isActive, activeColor = COLORS.high) => ({
  width: "28px",
  height: "16px",
  borderRadius: "4px",
  background: isActive ? activeColor : "rgba(99,102,241,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: FONT.mono,
  fontSize: "0.78rem",
  color: isActive ? "#0a0f1a" : COLORS.textDim,
  fontWeight: "800",
  transition: "all 0.2s",
});

/**
 * Returns inline styles for a generic card / panel box.
 * @param {string} accentColor - Border accent color
 */
export const cardStyle = (accentColor = COLORS.indigo) => ({
  background: COLORS.cardBg,
  border: `1px solid ${accentColor}30`,
  borderRadius: "16px",
  overflow: "hidden",
});
