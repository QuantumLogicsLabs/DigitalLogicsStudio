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

const Section = ({ title, children, accent = COLORS.indigo }) => (
  <div
    style={{
      marginBottom: "32px",
      background: COLORS.cardBg,
      border: `1px solid ${accent}30`,
      borderRadius: "16px",
      overflow: "hidden",
    }}
  >
    {/* ── Section header bar ── */}
    <div
      style={{
        padding: "16px 22px",
        borderBottom: `1px solid ${accent}25`,
        background: `${accent}0a`,
      }}
    >
      <h3
        style={{
          color: COLORS.textPrimary,
          margin: 0,
          fontSize: "1.05rem",
          fontWeight: "700",
        }}
      >
        {title}
      </h3>
    </div>

    {/* ── Section body ── */}
    <div style={{ padding: "22px" }}>{children}</div>
  </div>
);

export default Section;
