import { ICS } from "./icCatalog";

// ── Breadboard constants ──────────────────────────────────────────
export const COLS = 30;
export const ROWS_A = ["a", "b", "c", "d", "e"];
export const ROWS_B = ["f", "g", "h", "i", "j"];
export const HOLE_PX = 12; // hole spacing px — increased for visibility
export const GAP_AFTER = new Set([4, 9, 14, 19, 24]);

export function colXForBB(col) {
  const extra = [...GAP_AFTER].filter((g) => g < col).length * 6;
  return 36 + col * (HOLE_PX + 2) + extra + HOLE_PX / 2;
}

// ── Breadboard dimensions (must match Breadboard component) ───────
export function getBBDimensions() {
  const ROW_H = 14,
    TOP_RAIL_Y = 6;
  const BODY_Y = TOP_RAIL_Y + 36;
  const TOP_ROWS_H = 5 * ROW_H;
  const CENTER_Y = BODY_Y + TOP_ROWS_H + 2;
  const BOT_START = CENTER_Y + 18;
  const BOT_ROWS_H = 5 * ROW_H;
  const BOT_RAIL_Y = BOT_START + BOT_ROWS_H + 6;
  const BOT_GND_Y = BOT_RAIL_Y + 18;
  const H = BOT_GND_Y + 16;
  const W = 36 + COLS * (HOLE_PX + 2) + 5 * 6 + HOLE_PX + 16;
  return { W, H };
}

// A real DIP chip can ONLY sit straddling the center gap — that's the
// entire point of the socket. So placement is a single-axis (column)
// snap, not a free x/y drop: Y is always locked to the gap, and the
// returned `col` is the *real* breadboard column its pin-1 side lands on
// (used by the simulation engine to resolve which holes each pin touches).
export function snapICPosition(dropX, dropY, pinCount, placedICs = [], excludeId = null) {
  const ROW_H = 14;
  const IC_PIN_H = 7;
  const TOP_RAIL_Y = 6;

  const BODY_Y = TOP_RAIL_Y + 36;
  const TOP_ROWS_H = 5 * ROW_H;
  const CENTER_Y = BODY_Y + TOP_ROWS_H + 2;
  const lockedY = CENTER_Y - IC_PIN_H;

  const cols = Math.ceil(pinCount / 2);

  const colX = colXForBB;

  const occupiedCols = new Set();
  placedICs.forEach((p) => {
    if (p.id === excludeId || p.col === undefined) return;
    const otherCols = Math.ceil(ICS[p.ic].pins / 2);
    for (let c = p.col; c < p.col + otherCols; c++) occupiedCols.add(c);
  });

  const isFree = (c) => {
    for (let i = c; i < c + cols; i++) if (occupiedCols.has(i)) return false;
    return true;
  };

  const wantedCol = Math.round((dropX - 32) / (HOLE_PX + 2));
  let best = null;
  for (let c = 0; c <= COLS - cols; c++) {
    if (!isFree(c)) continue;
    const d = Math.abs(c - wantedCol);
    if (!best || d < best.dist) best = { col: c, dist: d };
  }

  if (!best) return null; // no free slot anywhere — placement rejected

  return { x: colX(best.col) - 4, y: lockedY, col: best.col };
}
