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
  pageBg: "var(--app-bg)",
  cardBg: "var(--app-surface)",
  inputBg: "var(--app-interactive-bg)",
  darkBg: "var(--app-surface-strong)",
  deepBg: "var(--app-surface-strong)",

  // Brand / accent
  indigo: "var(--app-accent)",
  indigoLight: "color-mix(in srgb, var(--app-accent) 80%, white)",
  indigoMuted: "var(--app-accent-soft)",

  // Signal states
  high: "#00ff88",   // Logic HIGH — bright green
  low: "#ef4444",    // Logic LOW / error — red
  warn: "#fbbf24",   // Enable / warning — amber
  blue: "#60a5fa",   // Address inputs
  purple: "#a78bfa", // Secondary accent

  // Text
  textPrimary: "var(--app-text)",
  textSecondary: "var(--app-muted-strong)",
  textMuted: "var(--app-muted)",
  textDim: "var(--app-muted)",

  // Glassmorphism & Misc
  glassBg: "var(--app-surface)",
  glassBorder: "var(--app-border)",
  glassShadow: "var(--app-shadow)",
  glowShadow: (color) => `0 0 15px ${color}60, 0 0 5px ${color}40`,
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
/**
 * Returns inline styles for a glassmorphism card.
 */
export const glassCardStyle = (accentColor = COLORS.indigo) => ({
  background: COLORS.glassBg,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${accentColor}40`,
  borderRadius: "20px",
  boxShadow: COLORS.glassShadow,
  overflow: "hidden",
});

export const cardStyle = (accentColor = COLORS.indigo) => ({
  background: COLORS.cardBg,
  border: `1px solid ${accentColor}30`,
  borderRadius: "16px",
  overflow: "hidden",
});
