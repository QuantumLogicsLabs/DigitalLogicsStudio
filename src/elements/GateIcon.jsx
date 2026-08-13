import React from "react";

const PATHS = {
  AND: <path d="M4 3H14C19.5 3 24 7.5 24 13S19.5 23 14 23H4V3Z" />,
  OR: <path d="M4 3C9 3 9 3 12 4.5C17 7 20 9.5 24 13C20 16.5 17 19 12 21.5C9 23 9 23 4 23C7 18 7 8 4 3Z" />,
  NOT: (
    <>
      <path d="M4 3L22 13L4 23V3Z" />
      <circle cx="25.5" cy="13" r="2.5" fill="none" />
    </>
  ),
  NAND: (
    <>
      <path d="M4 3H12C17.5 3 22 7.5 22 13S17.5 23 12 23H4V3Z" />
      <circle cx="25" cy="13" r="2.5" fill="none" />
    </>
  ),
  NOR: (
    <>
      <path d="M4 3C9 3 9 3 11.5 4.5C16.5 7 19.5 9.5 22 13C19.5 16.5 16.5 19 11.5 21.5C9 23 9 23 4 23C7 18 7 8 4 3Z" />
      <circle cx="25" cy="13" r="2.5" fill="none" />
    </>
  ),
  XOR: (
    <>
      <path d="M6.5 3C11.5 3 11.5 3 14 4.5C19 7 22 9.5 24 13C22 16.5 19 19 14 21.5C11.5 23 11.5 23 6.5 23C9.5 18 9.5 8 6.5 3Z" />
      <path d="M3 3C6 8 6 18 3 23" fill="none" />
    </>
  ),
  XNOR: (
    <>
      <path d="M6.5 3C11.5 3 11.5 3 13.5 4.5C18.5 7 21.5 9.5 23.5 13C21.5 16.5 18.5 19 13.5 21.5C11.5 23 11.5 23 6.5 23C9.5 18 9.5 8 6.5 3Z" />
      <path d="M3 3C6 8 6 18 3 23" fill="none" />
      <circle cx="26" cy="13" r="2.2" fill="none" />
    </>
  ),
  BUFFER: <path d="M4 3L22 13L4 23V3Z" />,
  INPUT: <circle cx="14" cy="13" r="9" />,
  OUTPUT: <rect x="6" y="6" width="16" height="14" rx="3" />,
  CLOCK: <path d="M3 17V13H8V6H14V20H19V13H25" fill="none" strokeLinejoin="round" />,
};

// Short abbreviations shown inside the generic IC block for types
// that don't have a hand-drawn gate shape (multiplexers, adders, etc.)
const IC_LABELS = {
  MUX2: "MUX", MUX4: "MUX", MUX8: "MUX",
  DEMUX2: "DMX", DEMUX4: "DMX", DEMUX8: "DMX",
  ENC4: "ENC", ENC8: "ENC",
  DEC4: "DEC", DEC8: "DEC",
  HALF_ADDER: "HA", FULL_ADDER: "FA", ADD4: "ADD", CLADD4: "CLA",
  HALF_SUBTRACTOR: "HS", FULL_SUBTRACTOR: "FS",
};

export default function GateIcon({ type, size = 28 }) {
  if (!PATHS[type]) {
    // Generic IC block glyph with an abbreviation — used for
    // multiplexers, encoders, decoders, adders, subtractors.
    return (
      <svg width={size} height={(size * 26) / 28} viewBox="0 0 28 26" fill="none">
        <rect x="2" y="3" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.08" />
        <text x="14" y="17" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="currentColor" stroke="none">
          {IC_LABELS[type] || "IC"}
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={(size * 26) / 28}
      viewBox="0 0 28 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className="gate-icon"
      aria-hidden="true"
    >
      <g fill="currentColor" fillOpacity="0.08">
        {PATHS[type]}
      </g>
    </svg>
  );
}
