// ─── Geometry helpers ─────────────────────────────────────────────────────────
import { IC_META, IC_TYPES } from "../../shared/data/gates";
import { IC_HEIGHTS, SINGLE_INPUT_GATES } from "./constants";

export function defaultInputCount(type) {
  if (type === "INPUT") return 0;
  if (SINGLE_INPUT_GATES.has(type)) return 1;
  if (IC_TYPES.has(type)) return IC_META[type].inputs;
  return 2;
}

export function getICHeight(type) {
  return IC_HEIGHTS[type] ?? 100;
}

export function getInputY(gate, inputIndex) {
  if (IC_TYPES.has(gate.type)) {
    const n = IC_META[gate.type].inputs;
    const h = getICHeight(gate.type);
    if (n === 1) return gate.y + h / 2;
    return gate.y + (10 / 100) * h + (inputIndex / (n - 1)) * (0.8 * h);
  }
  const n = gate.inputs;
  if (n === 1) return gate.y + 50;
  if (n === 2) return gate.y + (inputIndex === 0 ? 35 : 65);
  const gateTop = gate.y + 15;
  const gateBottom = gate.y + 85;
  return gateTop + (inputIndex / (n - 1)) * (gateBottom - gateTop);
}

export function getOutputY(gate, outputIndex) {
  if (!IC_TYPES.has(gate.type)) return gate.y + 50;
  const n = IC_META[gate.type].outputs;
  const h = getICHeight(gate.type);
  if (n === 1) return gate.y + h / 2;
  return gate.y + (10 / 100) * h + (outputIndex / (n - 1)) * (0.8 * h);
}