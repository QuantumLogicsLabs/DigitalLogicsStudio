/**
 * Single source of truth for every component in the palette.
 * Add a new gate/component by adding one entry here — the sidebar,
 * search, and canvas drop-handler all read from this list.
 */
export const GATE_CATEGORIES = [
  {
    id: "io",
    label: "Input / Output",
    accent: "#4f8cff",
    gates: [
      { type: "INPUT", label: "INPUT" },
      { type: "OUTPUT", label: "OUTPUT" },
      // NOTE: CLOCK has no matching logic in Boolforge.jsx (defaultInputCount,
      // computeGateOutput, IC_META) — placing it will silently do nothing.
      // Leaving it here as-is since it predates this change; flag if you
      // want it implemented or removed.
      { type: "CLOCK", label: "CLOCK" },
    ],
  },
  {
    id: "basic",
    label: "Basic Gates",
    accent: "#35e2a3",
    gates: [
      { type: "AND", label: "AND" },
      { type: "OR", label: "OR" },
      { type: "NOT", label: "NOT" },
      { type: "BUFFER", label: "BUFFER" },
    ],
  },
  {
    id: "universal",
    label: "Universal Gates",
    accent: "#ff9d4d",
    gates: [
      { type: "NAND", label: "NAND" },
      { type: "NOR", label: "NOR" },
    ],
  },
  {
    id: "parity",
    label: "Parity Gates",
    accent: "#7c6cff",
    gates: [
      { type: "XOR", label: "XOR" },
      { type: "XNOR", label: "XNOR" },
    ],
  },
  {
    id: "multiplexers",
    label: "Multiplexers",
    accent: "#c4b5fd",
    gates: [
      { type: "MUX2", label: "MUX 2:1" },
      { type: "MUX4", label: "MUX 4:1" },
      { type: "MUX8", label: "MUX 8:1" },
    ],
  },
  {
    id: "demultiplexers",
    label: "Demultiplexers",
    accent: "#c4b5fd",
    gates: [
      { type: "DEMUX2", label: "DEMUX 1:2" },
      { type: "DEMUX4", label: "DEMUX 1:4" },
      { type: "DEMUX8", label: "DEMUX 1:8" },
    ],
  },
  {
    id: "encoders",
    label: "Encoders",
    accent: "#00d4ff",
    gates: [
      { type: "ENC4", label: "ENC 4:2" },
      { type: "ENC8", label: "ENC 8:3" },
    ],
  },
  {
    id: "decoders",
    label: "Decoders",
    accent: "#00d4ff",
    gates: [
      { type: "DEC4", label: "DEC 2:4" },
      { type: "DEC8", label: "DEC 3:8" },
    ],
  },
  {
    id: "adders",
    label: "Adders",
    accent: "#35e2a3",
    gates: [
      { type: "HALF_ADDER", label: "Half Adder" },
      { type: "FULL_ADDER", label: "Full Adder" },
      { type: "ADD4", label: "4-bit Adder" },
      { type: "CLADD4", label: "Carry LA 4" },
    ],
  },
  {
    id: "subtractors",
    label: "Subtractors",
    accent: "#ff5c72",
    gates: [
      { type: "HALF_SUBTRACTOR", label: "Half Subtractor" },
      { type: "FULL_SUBTRACTOR", label: "Full Subtractor" },
    ],
  },
];

// Flat list with each gate's category accent attached — used for search.
export const ALL_GATES = GATE_CATEGORIES.flatMap((cat) =>
  cat.gates.map((g) => ({ ...g, accent: cat.accent, category: cat.label }))
);