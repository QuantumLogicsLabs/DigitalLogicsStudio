import React from "react";
import "./IconButton.css";

/**
 * IconButton — used in the Circuit Forge toolbar.
 * variant: "ghost" (default) | "solid" | "danger"
 */
export default function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
  active = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={`cf-icon-btn cf-icon-btn--${variant} ${active ? "is-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      <Icon size={17} strokeWidth={2} />
    </button>
  );
}
