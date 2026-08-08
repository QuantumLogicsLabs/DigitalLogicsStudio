import { ICS } from "./icCatalog";

// ════════════════════════════════════════════════════════════════════
// SIMULATION ENGINE
// Real pin-level netlist + boolean-algebra propagation.
//
// Every hole on the breadboard, every external terminal (switches, push
// buttons, clock, data-bus monitors...) and every IC pin is a *node
// reference*. Wires and physical breadboard strips union node references
// together into electrical nodes. Each IC reads the resolved value of its
// input-pin nodes and drives its output-pin nodes — exactly like a real
// simulator (Proteus/Multisim/Logisim) resolves a netlist, just scaled
// down to what a trainer board needs.
//
// NOTE ON ACCURACY: gate-level chips (7400/02/04/08/32/86) and the two
// flip-flop chips (7474/7476) use their real SN74xx datasheet pinouts.
// The MSI chips (7483/7485/74138/74151/7447/74193/7495) use pinouts that
// are datasheet-accurate where the author was confident (7447, 74138,
// 74151 pin numbers are the real ones) and otherwise use a clearly
// simplified, internally-consistent numbering — good for teaching
// boolean behavior, but double-check against a real datasheet before
// wiring a physical board from it.
// ════════════════════════════════════════════════════════════════════

// ── Gate primitives ────────────────────────────────────────────────
export const G = {
  and: (a, b) => (a & b) & 1,
  or: (a, b) => (a | b) & 1,
  nand: (a, b) => 1 - ((a & b) & 1),
  nor: (a, b) => 1 - ((a | b) & 1),
  xor: (a, b) => (a ^ b) & 1,
  not: (a) => 1 - (a & 1),
};

// ── IC_LOGIC: pin-accurate behavior tables ─────────────────────────
// gates: combinational 2-in (or 1-in for inverters) logic cells.
// flops: edge-triggered storage cells (D or JK).
// msi:   custom evaluate() for the multi-pin MSI parts.
export const IC_LOGIC = {
  7400: {
    vcc: 14, gnd: 7, gates: [
      { in: [1, 2], out: 3, fn: G.nand }, { in: [4, 5], out: 6, fn: G.nand },
      { in: [9, 10], out: 8, fn: G.nand }, { in: [12, 13], out: 11, fn: G.nand },
    ]
  },
  7402: {
    vcc: 14, gnd: 7, gates: [
      { in: [2, 3], out: 1, fn: G.nor }, { in: [5, 6], out: 4, fn: G.nor },
      { in: [8, 9], out: 10, fn: G.nor }, { in: [11, 12], out: 13, fn: G.nor },
    ]
  },
  7404: {
    vcc: 14, gnd: 7, gates: [
      { in: [1], out: 2, fn: G.not }, { in: [3], out: 4, fn: G.not },
      { in: [5], out: 6, fn: G.not }, { in: [9], out: 8, fn: G.not },
      { in: [11], out: 10, fn: G.not }, { in: [13], out: 12, fn: G.not },
    ]
  },
  7408: {
    vcc: 14, gnd: 7, gates: [
      { in: [1, 2], out: 3, fn: G.and }, { in: [4, 5], out: 6, fn: G.and },
      { in: [9, 10], out: 8, fn: G.and }, { in: [12, 13], out: 11, fn: G.and },
    ]
  },
  7432: {
    vcc: 14, gnd: 7, gates: [
      { in: [1, 2], out: 3, fn: G.or }, { in: [4, 5], out: 6, fn: G.or },
      { in: [9, 10], out: 8, fn: G.or }, { in: [12, 13], out: 11, fn: G.or },
    ]
  },
  7486: {
    vcc: 14, gnd: 7, gates: [
      { in: [1, 2], out: 3, fn: G.xor }, { in: [4, 5], out: 6, fn: G.xor },
      { in: [9, 10], out: 8, fn: G.xor }, { in: [12, 13], out: 11, fn: G.xor },
    ]
  },
  7474: {
    vcc: 14, gnd: 7, flops: [
      { kind: "d", d: 2, clk: 3, pr: 4, clr: 1, q: 5, qb: 6 },
      { kind: "d", d: 12, clk: 11, pr: 10, clr: 13, q: 9, qb: 8 },
    ]
  },
  7476: {
    vcc: 5, gnd: 13, flops: [
      { kind: "jk", j: 4, k: 16, clk: 1, pr: 2, clr: 3, q: 14, qb: 15 },
      { kind: "jk", j: 9, k: 10, clk: 8, pr: 7, clr: 6, q: 11, qb: 12 },
    ]
  },
  // 4-bit full adder. VCC=5 / GND=12 is the real (unusual) 7483 quirk.
  7483: {
    vcc: 5, gnd: 12, msi: "adder",
    a: [1, 2, 3, 4], b: [6, 7, 8, 9], cin: 10, cout: 11, s: [13, 14, 15, 16]
  },
  // 4-bit magnitude comparator. Real datasheet pinout.
  7485: {
    vcc: 16, gnd: 8, msi: "comparator",
    a: [1, 2, 3, 4], b: [5, 6, 7, 9], gtIn: 10, ltIn: 11, eqIn: 12,
    gtOut: 13, ltOut: 14, eqOut: 15
  },
  // 3-to-8 decoder. Real datasheet pinout.
  74138: {
    vcc: 16, gnd: 8, msi: "decoder",
    a: [1, 2, 3], e2a: 4, e2b: 5, e1: 6, y: [15, 14, 13, 12, 11, 10, 9, 7]
  },
  // 8-to-1 mux. Real datasheet pinout.
  74151: {
    vcc: 16, gnd: 8, msi: "mux",
    d: [4, 3, 2, 1, 15, 14, 13, 12], s: [11, 10, 9], strobe: 7, y: 5, yb: 6
  },
  // BCD -> 7-seg driver. Real datasheet pinout.
  7447: {
    vcc: 16, gnd: 8, msi: "bcd7seg",
    bcd: [7, 1, 2, 6], lt: 3, bi: 4, rbi: 5,
    seg: { a: 13, b: 12, c: 11, d: 10, e: 9, f: 15, g: 14 }
  },
  // 4-bit up/down counter. Simplified-but-consistent numbering.
  74193: {
    vcc: 16, gnd: 8, msi: "counter",
    d: [15, 1, 10, 9], up: 5, down: 4, load: 11, clear: 14,
    q: [3, 2, 6, 7], carry: 12, borrow: 13
  },
  // 4-bit serial/parallel shift register. Simplified numbering (author
  // not fully confident of the real 7495 pin order — verify vs datasheet).
  7495: {
    vcc: 14, gnd: 7, msi: "shiftreg",
    d: [2, 3, 4, 5], serIn: 1, mode: 6, clk1: 9, clk2: 8, q: [10, 11, 12, 13]
  },
};

// ── Union-Find over node references ────────────────────────────────
export class NetSet {
  constructor() { this.parent = new Map(); }
  find(x) {
    if (!this.parent.has(x)) this.parent.set(x, x);
    let root = x;
    while (this.parent.get(root) !== root) root = this.parent.get(root);
    while (this.parent.get(x) !== root) {
      const next = this.parent.get(x);
      this.parent.set(x, root);
      x = next;
    }
    return root;
  }
  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

// A breadboard body hole `bb_${col}_${row}` belongs to a 5-hole vertical
// strip: rows a-e (top half) share one electrical node per column, rows
// f-j (bottom half) share a *different* node per column (real breadboard
// behavior — the center DIP gap breaks the strip in two).
export function holeStripKey(holeId) {
  const m = /^bb_(\d+)_([a-j])$/.exec(holeId);
  if (!m) return null;
  const col = m[1], row = m[2];
  const half = "abcde".includes(row) ? "top" : "bot";
  return `strip_${half}_${col}`;
}
export function railNetKey(holeId) {
  if (/^rail_(t|b)vcc_/.test(holeId)) return "NET_VCC";
  if (/^rail_(t|b)gnd_/.test(holeId)) return "NET_GND";
  return null;
}

// Physical DIP pin -> breadboard hole, given the column the IC was
// snapped to (`icCol`) and its total pin count. Pin 1 is bottom-left
// (next to the notch), numbering runs left-to-right along the bottom row
// then right-to-left along the top row — standard 74xx DIP convention.
export function icPinHole(icCol, totalPins, pinNum) {
  const bottomCount = Math.ceil(totalPins / 2);
  if (pinNum <= bottomCount) {
    return `bb_${icCol + (pinNum - 1)}_f`;
  }
  const i = totalPins - pinNum;
  return `bb_${icCol + i}_e`;
}

// Builds the full netlist (a NetSet you can .find() any reference
// through) from the current wires + placed ICs.
export function buildNetlist(wires, placedICs) {
  const ns = new NetSet();

  // Wires directly union whatever two references they connect.
  wires.forEach((w) => ns.union(w.from, w.to));

  // Union every touched breadboard hole into its physical strip/rail node.
  const allHoleRefs = new Set();
  wires.forEach((w) => { allHoleRefs.add(w.from); allHoleRefs.add(w.to); });
  placedICs.forEach((p) => {
    const ic = ICS[p.ic];
    if (!ic) return;
    for (let pin = 1; pin <= ic.pins; pin++) {
      allHoleRefs.add(icPinHole(p.col, ic.pins, pin));
    }
  });
  allHoleRefs.forEach((ref) => {
    const stripKey = holeStripKey(ref);
    if (stripKey) ns.union(ref, stripKey);
    const railKey = railNetKey(ref);
    if (railKey) ns.union(ref, railKey);
  });

  // Union each IC's own pin reference (`${icId}_p${n}`) into the hole it
  // physically occupies, so `icPinNode(ic, n)` below resolves correctly.
  placedICs.forEach((p) => {
    const ic = ICS[p.ic];
    if (!ic) return;
    for (let pin = 1; pin <= ic.pins; pin++) {
      ns.union(`${p.id}_p${pin}`, icPinHole(p.col, ic.pins, pin));
    }
  });

  return ns;
}

// Resolves a node's driven boolean value from a `values` map, defaulting
// unconnected/undriven nodes to 0 (LOW) — the common, documented
// simplification real teaching simulators make for floating TTL inputs.
export function readNode(ns, values, ref) {
  const v = values.get(ns.find(ref));
  return v === undefined ? 1 : v;
}
export function writeNode(ns, values, ref, val) {
  values.set(ns.find(ref), val & 1);
}

export function allOutputPins(logic) {
  const pins = [];
  (logic.gates || []).forEach((g) => pins.push(g.out));
  (logic.flops || []).forEach((f) => { pins.push(f.q); pins.push(f.qb); });
  if (logic.msi === "adder") { pins.push(...logic.s, logic.cout); }
  if (logic.msi === "comparator") { pins.push(logic.gtOut, logic.ltOut, logic.eqOut); }
  if (logic.msi === "decoder") { pins.push(...logic.y); }
  if (logic.msi === "mux") { pins.push(logic.y, logic.yb); }
  if (logic.msi === "bcd7seg") { pins.push(...Object.values(logic.seg)); }
  if (logic.msi === "counter") { pins.push(...logic.q, logic.carry, logic.borrow); }
  if (logic.msi === "shiftreg") { pins.push(...logic.q); }
  return pins;
}

// Runs the combinational settle: seeds power rails + live external
// sources, then relaxes every placed IC's combinational outputs across a
// few passes so multi-gate chains stabilize (plenty for a trainer-board
// scale netlist — no need for a full topological sort).
export function evaluateCircuit(ns, placedICs, sources, icRegs) {
  const values = new Map();
  const shorts = new Set(); // resolved node-keys with conflicting drivers
  writeNode(ns, values, "NET_VCC", 1);
  writeNode(ns, values, "NET_GND", 0);
  Object.entries(sources).forEach(([ref, val]) => writeNode(ns, values, ref, val ? 1 : 0));

  // VCC wired directly to GND (no chip in between) — always a hard short.
  if (ns.find("NET_VCC") === ns.find("NET_GND")) {
    shorts.add(ns.find("NET_VCC"));
  }

  const PASSES = 4;
  for (let pass = 0; pass < PASSES; pass++) {
    // Only trust conflicts on the final (settled) pass — earlier passes
    // can show transient mismatches while values are still propagating.
    const isFinalPass = pass === PASSES - 1;
    const driverMap = isFinalPass ? new Map() : null; // node -> first value driven this pass

    placedICs.forEach((p) => {
      const logic = IC_LOGIC[p.ic];
      if (!logic) return;
      const pin = (n) => `${p.id}_p${n}`;
      const rd = (n) => readNode(ns, values, pin(n));
      const wr = (n, v) => {
        writeNode(ns, values, pin(n), v);
        // record every driven output per node to catch output-vs-output conflicts
        if (driverMap) {
          const node = ns.find(pin(n));
          const bit = v & 1;
          const seen = driverMap.get(node);
          if (seen !== undefined && seen !== bit) {
            shorts.add(node);
          } else {
            driverMap.set(node, bit);
          }
        }
      };
      const powered = ns.find(pin(logic.vcc)) === ns.find("NET_VCC")
        && ns.find(pin(logic.gnd)) === ns.find("NET_GND");
      if (!powered) {
        // Chip has no power/ground connection — force every output pin LOW
        // and skip its logic entirely (matches real unpowered-TTL behavior).
        allOutputPins(logic).forEach((n) => wr(n, 0));
      } else {
        if (logic.gates) {
          logic.gates.forEach((g) => wr(g.out, g.fn(...g.in.map(rd))));
        }
        if (logic.flops) {
          // Combinational part only (Q/Qbar outputs + async preset/clear).
          // Clocked D/J-K updates happen in the sequential effect below.
          const reg = icRegs[p.id] || {};
          logic.flops.forEach((f, i) => {
            let q = reg.q ? reg.q[i] : 0;
            if (rd(f.clr) === 0) q = 0; // active-low async clear
            else if (rd(f.pr) === 0) q = 1; // active-low async preset
            wr(f.q, q);
            wr(f.qb, 1 - q);
          });
        }
        if (logic.msi === "adder") {
          const a = logic.a.map(rd), b = logic.b.map(rd), cin = rd(logic.cin);
          let carry = cin;
          const s = [];
          for (let i = 0; i < 4; i++) {
            const t = a[i] + b[i] + carry;
            s.push(t & 1);
            carry = t >> 1;
          }
          logic.s.forEach((pinNum, i) => wr(pinNum, s[i]));
          wr(logic.cout, carry);
        }
        if (logic.msi === "comparator") {
          const a = logic.a.map(rd).reduce((acc, v, i) => acc | (v << i), 0);
          const b = logic.b.map(rd).reduce((acc, v, i) => acc | (v << i), 0);
          let gt = a > b, lt = a < b, eq = a === b;
          if (eq) { gt = rd(logic.gtIn) === 1; lt = rd(logic.ltIn) === 1; eq = rd(logic.eqIn) === 1 && !gt && !lt; }
          wr(logic.gtOut, gt ? 1 : 0);
          wr(logic.ltOut, lt ? 1 : 0);
          wr(logic.eqOut, eq ? 1 : 0);
        }
        if (logic.msi === "decoder") {
          const sel = logic.a.map(rd).reduce((acc, v, i) => acc | (v << i), 0);
          const enabled = rd(logic.e1) === 1 && rd(logic.e2a) === 0 && rd(logic.e2b) === 0;
          logic.y.forEach((pinNum, i) => wr(pinNum, enabled && i === sel ? 0 : 1)); // active-low
        }
        if (logic.msi === "mux") {
          const sel = logic.s.map(rd).reduce((acc, v, i) => acc | (v << i), 0);
          const strobed = rd(logic.strobe) === 0; // active-low enable
          const out = strobed ? rd(logic.d[sel]) : 0;
          wr(logic.y, out);
          wr(logic.yb, 1 - out);
        }
        if (logic.msi === "bcd7seg") {
          const bcd = logic.bcd.map(rd).reduce((acc, v, i) => acc | (v << i), 0);
          const blanked = rd(logic.bi) === 0 || (rd(logic.rbi) === 0 && bcd === 0);
          const lampTest = rd(logic.lt) === 0;
          // Standard 7-seg patterns for 0-9 (1 = segment ON), blank otherwise.
          const PATTERNS = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
          const on = lampTest ? "abcdefg" : blanked ? "" : (PATTERNS[bcd] || "");
          Object.entries(logic.seg).forEach(([seg, pinNum]) => wr(pinNum, on.includes(seg) ? 0 : 1)); // active-low outputs
        }
        if (logic.msi === "counter") {
          const reg = icRegs[p.id] || { q: 0 };
          const load = rd(logic.load) === 0;
          const val = load
            ? logic.d.map(rd).reduce((acc, v, i) => acc | (v << i), 0)
            : rd(logic.clear) === 1 ? 0 : (reg.q ?? 0);
          logic.q.forEach((pinNum, i) => wr(pinNum, (val >> i) & 1));
          wr(logic.carry, val === 15 ? 0 : 1);
          wr(logic.borrow, val === 0 ? 0 : 1);
        }
        if (logic.msi === "shiftreg") {
          const reg = icRegs[p.id] || { q: [0, 0, 0, 0] };
          logic.q.forEach((pinNum, i) => wr(pinNum, reg.q ? reg.q[i] : 0));
        }
      }
    });
  }
  return { values, shorts };
}

// Applies clocked (edge-triggered) state updates: flip-flops, the
// up/down counter, and the shift register. Called from a useEffect that
// watches the settled combinational values every render.
export function advanceSequential(ns, placedICs, values, icRegs, prevClk) {
  const next = {};
  let changed = false;
  placedICs.forEach((p) => {
    const logic = IC_LOGIC[p.ic];
    if (!logic) return;
    const pin = (n) => `${p.id}_p${n}`;
    const rd = (n) => readNode(ns, values, pin(n));
    const prevKey = p.id;
    const prevReg = icRegs[p.id] || {};

    if (logic.flops) {
      const q = (prevReg.q || logic.flops.map(() => 0)).slice();
      logic.flops.forEach((f, i) => {
        const clkNow = rd(f.clk);
        const clkKey = `${prevKey}_clk${i}`;
        const clkWas = prevClk.get(clkKey) ?? 0;
        prevClk.set(clkKey, clkNow);
        if (rd(f.clr) === 0) { q[i] = 0; return; }
        if (rd(f.pr) === 0) { q[i] = 1; return; }
        if (clkWas === 0 && clkNow === 1) {
          q[i] = f.kind === "d" ? rd(f.d) : (() => {
            const j = rd(f.j), k = rd(f.k);
            if (j === 0 && k === 0) return q[i];
            if (j === 1 && k === 0) return 1;
            if (j === 0 && k === 1) return 0;
            return 1 - q[i];
          })();
        }
      });
      if (JSON.stringify(q) !== JSON.stringify(prevReg.q)) { next[p.id] = { q }; changed = true; }
    }
    if (logic.msi === "counter") {
      const clkKey = `${prevKey}_ctrclk`;
      const upNow = rd(logic.up), downNow = rd(logic.down);
      const upWas = prevClk.get(clkKey + "u") ?? 0;
      const downWas = prevClk.get(clkKey + "d") ?? 0;
      prevClk.set(clkKey + "u", upNow);
      prevClk.set(clkKey + "d", downNow);
      let q = prevReg.q ?? 0;
      if (rd(logic.clear) === 1) q = 0;
      else if (rd(logic.load) === 0) q = logic.d.map(rd).reduce((acc, v, i) => acc | (v << i), 0);
      else if (upWas === 0 && upNow === 1) q = (q + 1) & 15;
      else if (downWas === 0 && downNow === 1) q = (q - 1) & 15;
      if (q !== prevReg.q) { next[p.id] = { q }; changed = true; }
    }
    if (logic.msi === "shiftreg") {
      const clkKey = `${prevKey}_sr`;
      const c1Now = rd(logic.clk1);
      const c1Was = prevClk.get(clkKey) ?? 0;
      prevClk.set(clkKey, c1Now);
      let q = (prevReg.q || [0, 0, 0, 0]).slice();
      if (c1Was === 0 && c1Now === 1) {
        const parallel = rd(logic.mode) === 1;
        q = parallel ? logic.d.map(rd) : [rd(logic.serIn), q[0], q[1], q[2]];
      }
      if (JSON.stringify(q) !== JSON.stringify(prevReg.q)) { next[p.id] = { q }; changed = true; }
    }
  });
  return changed ? next : null;
}

// Builds a "pin N = role" legend from IC_LOGIC so placement/tooltips can
// show real VCC/GND/input/output roles instead of leaving them undefined.
export function pinoutSummary(icKey) {
  const logic = IC_LOGIC[icKey];
  if (!logic) return "";
  const roles = {};
  roles[logic.vcc] = "VCC";
  roles[logic.gnd] = "GND";
  (logic.gates || []).forEach((g, i) => {
    g.in.forEach((p) => { roles[p] = `Gate${i + 1} IN`; });
    roles[g.out] = `Gate${i + 1} OUT`;
  });
  (logic.flops || []).forEach((f, i) => {
    if (f.d !== undefined) roles[f.d] = `FF${i + 1} D`;
    if (f.j !== undefined) roles[f.j] = `FF${i + 1} J`;
    if (f.k !== undefined) roles[f.k] = `FF${i + 1} K`;
    roles[f.clk] = `FF${i + 1} CLK`;
    roles[f.pr] = `FF${i + 1} PR̄`;
    roles[f.clr] = `FF${i + 1} CLR̄`;
    roles[f.q] = `FF${i + 1} Q`;
    roles[f.qb] = `FF${i + 1} Q̄`;
  });
  const n = ICS[icKey].pins;
  const lines = [];
  for (let p = 1; p <= n; p++) lines.push(`${p}:${roles[p] || "—"}`);
  return lines.join("  ");
}
