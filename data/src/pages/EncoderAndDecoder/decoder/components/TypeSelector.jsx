/**
 * TypeSelector.jsx — Decoder type picker
 *
 * Renders a row of buttons, one per decoder type.
 * Highlights the currently selected type with a different color.
 *
 * Props:
 *   selectedType : string   — key of the active decoder (e.g. "2to4")
 *   types        : object   — DECODER_TYPES map  { key: { label } }
 *   onChange     : fn(key)  — called when the user picks a different type
 */
import React from "react";
import { COLORS } from "../../shared/theme.js";

const TypeSelector = ({ selectedType, types, onChange }) => (
  <div style={{ display: "flex", gap: "10px", marginBottom: "22px", flexWrap: "wrap" }}>
    {Object.entries(types).map(([key, val]) => {
      const isSelected = selectedType === key;
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: `2px solid ${isSelected ? COLORS.indigo : COLORS.indigoMuted}`,
            background: isSelected ? "rgba(99,102,241,0.2)" : COLORS.inputBg,
            color: isSelected ? COLORS.indigoLight : COLORS.textMuted,
            cursor: "pointer",
            fontWeight: isSelected ? "700" : "400",
            transition: "all 0.2s",
            fontSize: "0.87rem",
          }}
        >
          {val.label}
        </button>
      );
    })}
  </div>
);

export default TypeSelector;
