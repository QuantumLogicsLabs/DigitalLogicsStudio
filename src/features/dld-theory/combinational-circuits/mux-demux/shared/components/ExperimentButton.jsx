/**
 * ExperimentButton.jsx — "🔌 Experiment with Circuit" call-to-action.
 *
 * Props:
 *   onClick  : fn()
 *   children : button text (defaults to "Experiment with Circuit")
 *   title    : tooltip
 *   style    : extra styles for placement (margins etc.)
 */
import React from "react";
import { COLORS } from "../theme.js";

const ExperimentButton = ({ onClick, children = "Experiment with Circuit", title, style }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 18px",
      borderRadius: "10px",
      border: "1.5px solid rgba(0,255,136,0.45)",
      background: "rgba(0,255,136,0.1)",
      color: COLORS.high,
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "0.87rem",
      transition: "all 0.2s",
      ...style,
    }}
  >
    <span aria-hidden="true">🔌</span>
    {children}
  </button>
);

export default ExperimentButton;
