import { SINGLE_INPUT_GATES, GATE_HEIGHT, GATE_WIDTH, IC_HEIGHTS, GRID_SIZE } from './constants';
import { IC_META, IC_TYPES } from "../../../shared/data/gates";

export function defaultInputCount(type) {
  if (type === "INPUT") return 0;
  if (SINGLE_INPUT_GATES.has(type)) return 1;
  if (IC_TYPES.has(type)) return IC_META[type].inputs;
  return 2;
}

export function getICHeight(type) {
  return IC_HEIGHTS[type] ?? 100;
}

export function getGateHeight(gate, customIcMeta = {}) {
  if (gate.type?.startsWith("CUSTOM_") && customIcMeta[gate.type]) {
    const meta = customIcMeta[gate.type];
    // Changed multiplier from 22 to 20 to ensure total height stays on grid
    return Math.max(100, Math.max(meta.inputs, meta.outputs) * 20 + 20);
  }
  return IC_TYPES.has(gate.type) ? getICHeight(gate.type) : GATE_HEIGHT;
}

export function getInputY(gate, inputIndex, customIcMeta = {}) {
  const h = getGateHeight(gate, customIcMeta);
  let n = gate.inputs;

  // IC Grid Aligned Port Positioning
  if (gate.type?.startsWith("CUSTOM_") && customIcMeta[gate.type]) {
    n = customIcMeta[gate.type].inputs;
    if (n === 1) return gate.y + h / 2;
    const span = (n - 1) * 20;
    const startY = (h - span) / 2;
    return gate.y + startY + inputIndex * 20;
  }
  if (IC_TYPES.has(gate.type)) {
    n = IC_META[gate.type].inputs;
    if (n === 1) return gate.y + h / 2;
    const span = (n - 1) * 20;
    const startY = (h - span) / 2;
    return gate.y + startY + inputIndex * 20;
  }
  
  // Standard Gate Grid Aligned Port Positioning (Assuming h = 100)
  if (n === 1) return gate.y + h / 2;
  
  if (h === 100) {
    if (n === 2) return gate.y + (inputIndex === 0 ? 30 : 70);
    if (n === 3) return gate.y + (inputIndex === 0 ? 20 : inputIndex === 1 ? 50 : 80);
    if (n === 4) return gate.y + 20 + inputIndex * 20;
    if (n === 5) return gate.y + 10 + inputIndex * 20;
  }

  // Fallback
  if (n === 2) return gate.y + (inputIndex === 0 ? 0.35 : 0.65) * h;
  return gate.y + 0.15 * h + (inputIndex / (n - 1)) * 0.7 * h;
}


export function getOutputY(gate, outputIndex, customIcMeta = {}) {
  const h = getGateHeight(gate, customIcMeta);
  
  // IC Grid Aligned Port Positioning
  if (gate.type?.startsWith("CUSTOM_") && customIcMeta[gate.type]) {
    const n = customIcMeta[gate.type].outputs;
    if (n === 1) return gate.y + h / 2;
    const span = (n - 1) * 20;
    const startY = (h - span) / 2;
    return gate.y + startY + outputIndex * 20;
  }
  
  if (IC_TYPES.has(gate.type)) {
    const n = IC_META[gate.type].outputs;
    if (n === 1) return gate.y + h / 2;
    const span = (n - 1) * 20;
    const startY = (h - span) / 2;
    return gate.y + startY + outputIndex * 20;
  }
  
  return gate.y + h / 2;
}

export function getCurvePoints(fromX, fromY, toX, toY) {
  const dx = toX - fromX;
  const distance = Math.hypot(dx, toY - fromY) || 1;
  const controlDistance = Math.max(40, Math.min(Math.abs(dx) / 2, distance / 3));
  return {
    orthogonal: false,
    fromX, fromY, toX, toY,
    cp1x: fromX + controlDistance, cp1y: fromY,
    cp2x: toX - controlDistance, cp2y: toY,
  };
}

export function getOrthogonalPoints(fromX, fromY, toX, toY, gridSize = GRID_SIZE) {
  const midX = Math.round((fromX + toX) / 2 / gridSize) * gridSize;
  return { orthogonal: true, fromX, fromY, midX, toX, toY };
}

export function getWirePoints(fromGate, toGate, fromOutputIndex, toIndex, snap = false, customIcMeta = {}) {
  const fromX = fromGate.x + GATE_WIDTH;
  const fromY = getOutputY(fromGate, fromOutputIndex ?? 0, customIcMeta);
  const toX = toGate.x;
  const toY = getInputY(toGate, toIndex, customIcMeta);
  return snap
    ? getOrthogonalPoints(fromX, fromY, toX, toY)
    : getCurvePoints(fromX, fromY, toX, toY);
}

export function wirePathD(pts) {
  if (pts.orthogonal) {
    return `M ${pts.fromX} ${pts.fromY} L ${pts.midX} ${pts.fromY} L ${pts.midX} ${pts.toY} L ${pts.toX} ${pts.toY}`;
  }
  return `M ${pts.fromX} ${pts.fromY} C ${pts.cp1x} ${pts.cp1y}, ${pts.cp2x} ${pts.cp2y}, ${pts.toX} ${pts.toY}`;
}

export function hitWireAt(x, y, wires, gateMap, radius = 12, snap = false, customIcMeta = {}) {
  for (const wire of wires) {
    const fromGate = gateMap.get(wire.fromId);
    const toGate = gateMap.get(wire.toId);
    if (!fromGate || !toGate) continue;
    const pts = getWirePoints(fromGate, toGate, wire.fromOutputIndex, wire.toIndex, snap, customIcMeta);

    if (pts.orthogonal) {
      const segments = [
        [pts.fromX, pts.fromY, pts.midX, pts.fromY],
        [pts.midX, pts.fromY, pts.midX, pts.toY],
        [pts.midX, pts.toY, pts.toX, pts.toY],
      ];
      for (const [x1, y1, x2, y2] of segments) {
        const steps = Math.max(4, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 8));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
          if (Math.hypot(px - x, py - y) <= radius) return wire;
        }
      }
      continue;
    }

    const SAMPLES = 64;

    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const mt = 1 - t;
      const bx =
        mt ** 3 * pts.fromX +
        3 * mt ** 2 * t * pts.cp1x +
        3 * mt * t ** 2 * pts.cp2x +
        t ** 3 * pts.toX;
      const by =
        mt ** 3 * pts.fromY +
        3 * mt ** 2 * t * pts.cp1y +
        3 * mt * t ** 2 * pts.cp2y +
        t ** 3 * pts.toY;
      if (Math.hypot(bx - x, by - y) <= radius) return wire;
    }
  }
  return null;
}