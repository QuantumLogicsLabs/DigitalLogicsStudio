/**
 * EncoderTypeSelector.jsx — Encoder type picker
 *
 * Renders a row of buttons, one per encoder type.
 *
 * Props:
 *   selectedType : string
 *   types        : object  — ENCODER_TYPES map { key: { label } }
 *   onChange     : fn(key)
 */
import React from "react";
import { COLORS } from "../../shared/theme.js";

const EncoderTypeSelector = ({ selectedType, types, onChange }) => (
  <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
    {Object.entries(types).map(([key, val]) => {
      const isSelected = selectedType === key;
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: `2px solid ${isSelected ? COLORS.indigo : COLORS.indigoMuted}`,
            background: isSelected ? "rgba(99,102,241,0.2)" : COLORS.inputBg,
            color: isSelected ? COLORS.indigoLight : COLORS.textMuted,
            cursor: "pointer",
            fontWeight: isSelected ? "700" : "400",
            transition: "all 0.2s",
            fontSize: "0.88rem",
          }}
        >
          {val.label}
        </button>
      );
    })}
  </div>
);

export default EncoderTypeSelector;
