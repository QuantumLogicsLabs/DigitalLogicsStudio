/**
 * muxCircuits.js — Ready-built MUX circuits for the circuit editor (Boolforge).
 *
 * Each circuit is { title, description, inputs, outputs, gates, wires } in the
 * shape Boolforge stores, so <CircuitModal circuit={...}> opens it with the
 * MUX blocks already placed and wired to labelled inputs and an output.
 *
 * Built once at module load, so each circuit object keeps a stable identity
 * (CircuitModal reloads the circuit whenever the object it is given changes).
 */
import { IC_META } from "../../../../../shared/data/gates";
import { IC_HEIGHTS } from "../../../../boolforge/utils/constants";

// ── Layout ────────────────────────────────────────────────────────────────────
// INPUT/OUTPUT nodes are 120×100. Inputs are stacked in two staggered columns,
// one row every 60px: even rows on the left, odd rows on the right. That keeps
// an 8-to-1 MUX (11 inputs) on one screen, and each left-column wire runs
// through the 20px gap between its right-column neighbours.
const NODE_H = 100;
const STEP_Y = 60;
const TOP = 40;
const INPUT_COLUMNS_X = [40, 200];
const FIRST_IC_X = 520;
const IC_STEP_X = 260;

const snap = (v) => Math.round(v / 20) * 20;

// Vertical centre of the input rows `first`..`last` (inclusive).
const rowsCenterY = (first, last) =>
  TOP + (first * STEP_Y + last * STEP_Y + NODE_H) / 2;

const createBuilder = () => {
  const gates = [];
  const wires = [];
  let nextGateId = 1;
  let nextWireId = 1;

  const add = (gate) => {
    const id = nextGateId++;
    gates.push({ id, hasOutput: true, inputValues: [], ...gate });
    return id;
  };

  return {
    gates,
    wires,
    input: (label, row) =>
      add({
        type: "INPUT",
        label,
        x: INPUT_COLUMNS_X[row % 2],
        y: TOP + row * STEP_Y,
        inputs: 0,
        inputValues: [false],
      }),
    // `centerY` is where the block's single output pin should sit.
    ic: (type, x, centerY) => {
      const y = snap(centerY - IC_HEIGHTS[type] / 2);
      const id = add({
        type,
        label: type,
        x,
        y,
        inputs: IC_META[type].inputs,
        outputs: IC_META[type].outputs,
      });
      return { id, outY: y + IC_HEIGHTS[type] / 2 };
    },
    // Placed level with the pin feeding it, so that wire is a straight line.
    output: (label, x, pinY) =>
      add({
        type: "OUTPUT",
        label,
        x,
        y: pinY - NODE_H / 2,
        inputs: 1,
        hasOutput: false,
      }),
    wire: (fromId, toId, toIndex) =>
      wires.push({ id: nextWireId++, fromId, fromOutputIndex: 0, toId, toIndex }),
  };
};

// ── Single MUX: one block, every pin wired to its own input ──────────────────
const buildSingleMux = (type, title, description) => {
  // Boolforge pin order is D0..Dn-1 then S0, S1, …; inputs follow that order
  // top to bottom so the wires fan in without crossing.
  const labels = IC_META[type].inputLabels;
  const b = createBuilder();
  const inputIds = labels.map((label, row) => b.input(label, row));

  const mux = b.ic(type, FIRST_IC_X, rowsCenterY(0, labels.length - 1));
  inputIds.forEach((id, pin) => b.wire(id, mux.id, pin));

  const y = b.output("Y", FIRST_IC_X + IC_STEP_X, mux.outY);
  b.wire(mux.id, y, 0);

  return { title, description, inputs: labels, outputs: ["Y"], gates: b.gates, wires: b.wires };
};

export const MUX_CIRCUITS = {
  "2to1": buildSingleMux(
    "MUX2",
    "2-to-1 MUX",
    "Open Simulate in the toolbar and switch the inputs on and off. S = 0 sends D0 to Y; S = 1 sends D1 to Y.",
  ),
  "4to1": buildSingleMux(
    "MUX4",
    "4-to-1 MUX",
    "Open Simulate in the toolbar. Set S1 S0 to a binary number (00 to 11), then flip the D inputs: Y always copies the D input with that number.",
  ),
  "8to1": buildSingleMux(
    "MUX8",
    "8-to-1 MUX",
    "Open Simulate in the toolbar. Set S2 S1 S0 to a binary number (000 to 111), then flip the D inputs: Y always copies the D input with that number.",
  ),
};

// ── Cascade: 8-to-1 built from two 4-to-1 MUXes and one 2-to-1 MUX ──────────
const buildCascadedMux = () => {
  const b = createBuilder();

  // S0 and S1 sit between the two data groups because both 4-to-1 MUXes use them.
  const rows = ["D0", "D1", "D2", "D3", "S0", "S1", "D4", "D5", "D6", "D7", "S2"];
  const id = Object.fromEntries(rows.map((label, row) => [label, b.input(label, row)]));

  // MUX4 pins: D0, D1, D2, D3, S0, S1. Each block is centred on its own rows.
  const lower = b.ic("MUX4", FIRST_IC_X, rowsCenterY(0, 5)); // D0–D3, S0, S1
  const upper = b.ic("MUX4", FIRST_IC_X, rowsCenterY(4, 9)); // S0, S1, D4–D7
  ["D0", "D1", "D2", "D3", "S0", "S1"].forEach((label, pin) => b.wire(id[label], lower.id, pin));
  ["D4", "D5", "D6", "D7", "S0", "S1"].forEach((label, pin) => b.wire(id[label], upper.id, pin));

  // MUX2 pins: D0, D1, S. S2 picks which 4-to-1 result goes through.
  const final = b.ic("MUX2", FIRST_IC_X + IC_STEP_X, (lower.outY + upper.outY) / 2);
  b.wire(lower.id, final.id, 0);
  b.wire(upper.id, final.id, 1);
  b.wire(id.S2, final.id, 2);

  const y = b.output("Y", FIRST_IC_X + IC_STEP_X * 2, final.outY);
  b.wire(final.id, y, 0);

  return {
    title: "8-to-1 MUX from two 4-to-1 MUXes",
    description:
      "Both 4-to-1 MUXes use S1 S0: the top one picks from D0–D3, the bottom one from D4–D7. The 2-to-1 MUX then uses S2 to choose which result reaches Y. Open Simulate in the toolbar to try it.",
    inputs: rows,
    outputs: ["Y"],
    gates: b.gates,
    wires: b.wires,
  };
};

export const CASCADED_MUX_CIRCUIT = buildCascadedMux();
