// ─── Constants ────────────────────────────────────────────────────────────────
export const MAX_GATE_INPUTS = 8;
export const MIN_GATE_INPUTS = 2;
export const MULTI_INPUT_GATES = new Set(["AND", "OR", "NAND", "NOR", "XOR", "XNOR"]);
export const SINGLE_INPUT_GATES = new Set(["NOT", "BUFFER", "OUTPUT"]);
export const GRID_SIZE = 20;
export const SNAP_TO_GRID = true;

export const IC_HEIGHTS = {
  MUX2: 100,
  MUX4: 120,
  MUX8: 160,
  DEMUX2: 100,
  DEMUX4: 120,
  DEMUX8: 160,
  ENC4: 100,
  ENC8: 140,
  DEC4: 100,
  DEC8: 140,
  HALF_ADDER: 80,
  FULL_ADDER: 100,
  ADD4: 160,
  CLADD4: 160,
  HALF_SUBTRACTOR: 80,
  FULL_SUBTRACTOR: 100,
};