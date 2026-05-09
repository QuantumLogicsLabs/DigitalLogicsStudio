/**
 * Section.jsx — Shared section wrapper
 *
 * A titled card used on both the Decoder and Encoder pages to group
 * related content.  Accepts an optional `accent` color that tints the
 * header and border so each section feels visually distinct.
 *
 * Usage:
 *   <Section title="🔢 Truth Table" accent="#fbbf24">
 *     <TruthTable ... />
 *   </Section>
 */
import React from "react";
import { COLORS } from "../theme.js";

const Section = ({ title, children, accent = "var(--app-accent)" }) => (
  <div className="app-section" style={{ padding: 0 }}>
    {/* ── Section header bar ── */}
    <div
      style={{
        padding: "1rem 1.5rem",
        borderBottom: `1px solid var(--app-border)`,
        background: `linear-gradient(90deg, ${accent}15, transparent)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h3 className="app-section-title" style={{ margin: 0 }}>
        <span style={{ width: "4px", height: "18px", background: accent, borderRadius: "2px" }} />
        {title}
      </h3>
    </div>

    {/* ── Section body ── */}
    <div style={{ padding: "1.5rem" }}>{children}</div>
  </div>
);

export default Section;
