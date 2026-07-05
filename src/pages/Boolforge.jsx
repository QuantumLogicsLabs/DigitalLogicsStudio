
import React, { useState, useRef, useEffect, useCallback } from "react";
import { gateSymbols, IC_META, IC_TYPES } from "../data/gates";
import { TruthTableGenerator } from "../components/TruthTable";
import { SaveAndLoad } from "../components/SaveAndLoad";
import { parseExpressionToCircuit } from "../utils/expressionParser";
import RelatedSeoLinks from "../components/seo/RelatedSeoLinks";
import { Navbar } from "./Home/Navbar";
import Footer from "./Home/Footer";
import { useTheme } from "../context/ThemeContext";
import "./../assets/css/Boolforge.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_GATE_INPUTS = 8; // Maximum inputs any logic gate can have
const MIN_GATE_INPUTS = 2; // Minimum inputs for multi-input gates

// Gates that support variable numbers of inputs (2–MAX_GATE_INPUTS)
const MULTI_INPUT_GATES = new Set(["AND", "OR", "NAND", "NOR", "XOR", "XNOR"]);

// Gates that are always single-input
const SINGLE_INPUT_GATES = new Set(["NOT", "BUFFER", "OUTPUT"]);

const GRID_SIZE = 20;
const SNAP_TO_GRID = true;

// ─── Helper: compute input count for a gate type ──────────────────────────────
function defaultInputCount(type) {
  if (type === "INPUT") return 0;
  if (SINGLE_INPUT_GATES.has(type)) return 1;
  if (IC_TYPES.has(type)) return IC_META[type].inputs;
  return 2; // default for multi-input gates
}

// ── IC height lookup (module-level — used by helpers below) ──────────────────
const IC_HEIGHTS = {
  MUX2: 100, MUX4: 120, MUX8: 160,
  DEMUX2: 100, DEMUX4: 120, DEMUX8: 160,
  ENC4: 100, ENC8: 140,
  DEC4: 100, DEC8: 140,
  HALF_ADDER: 80, FULL_ADDER: 100,
  ADD4: 160, CLADD4: 160,
  HALF_SUBTRACTOR: 80, FULL_SUBTRACTOR: 100,
};

function getICHeight(type) {
  return IC_HEIGHTS[type] ?? 100;
}

function getInputY(gate, inputIndex) {
  if (IC_TYPES.has(gate.type)) {
    const n = IC_META[gate.type].inputs;
    const h = getICHeight(gate.type);
    if (n === 1) return gate.y + h / 2;
    return gate.y + (10 / 100) * h + (inputIndex / (n - 1)) * (0.80 * h);
  }
  const n = gate.inputs;
  if (n === 1) return gate.y + 50;
  if (n === 2) return gate.y + (inputIndex === 0 ? 35 : 65);
  const gateTop = gate.y + 15;
  const gateBottom = gate.y + 85;
  return gateTop + (inputIndex / (n - 1)) * (gateBottom - gateTop);
}

function getOutputY(gate, outputIndex) {
  if (!IC_TYPES.has(gate.type)) return gate.y + 50;
  const n = IC_META[gate.type].outputs;
  const h = getICHeight(gate.type);
  if (n === 1) return gate.y + h / 2;
  return gate.y + (10 / 100) * h + (outputIndex / (n - 1)) * (0.80 * h);
}

const Boolforge = ({
  simplifiedExpression = null,
  variables = [],
  onCircuitChange,
  portNames = null, // { inputs: string[], outputs: string[] } — from problem
  embedded = false, // true when used inside a modal/host page — skips Navbar + Footer
}) => {
  const { theme, toggle: toggleTheme } = useTheme();
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);
  const [gates, setGates] = useState([]);
  const [wires, setWires] = useState([]);
  const [selectedGate, setSelectedGate] = useState(null);
  const [selectedGateIds, setSelectedGateIds] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // eslint-disable-line no-unused-vars
  const [gateIdCounter, setGateIdCounter] = useState(0);
  const [wireIdCounter, setWireIdCounter] = useState(0);
  const [inputCounter, setInputCounter] = useState(0);
  const [outputCounter, setOutputCounter] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [renamingGate, setRenamingGate] = useState(null); // { id, currentLabel }
  const [renameValue, setRenameValue] = useState("");

  // Multi-Selection and group dragging state/refs
  const [dragStartPositions, setDragStartPositions] = useState({});
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  const [selectionToolActive, setSelectionToolActive] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const [selectionStartIds, setSelectionStartIds] = useState([]);

  const hasMovedRef = useRef(false);
  const wasCtrlClickRef = useRef(false);
  const copiedDataRef = useRef(null);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // ── Stable gate state for feedback/latch circuits ─────────────────────────
  // Stores the last converged output value per gate id.
  // This breaks cyclic dependency during recursive evaluation so that
  // feedback circuits (SR latch, D latch, etc.) simulate correctly.
  const gateStateRef = useRef(new Map());

  // SNAP_TO_GRID and GRID_SIZE are module-level constants (defined above the component)

  // ── History ────────────────────────────────────────────────────────────────
  const saveToHistory = useCallback(() => {
    const state = {
      gates: JSON.parse(JSON.stringify(gates)),
      wires: JSON.parse(JSON.stringify(wires)),
      gateIdCounter,
      wireIdCounter,
      inputCounter,
      outputCounter,
    };
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [
    gates,
    wires,
    gateIdCounter,
    wireIdCounter,
    inputCounter,
    outputCounter,
    historyIndex,
  ]);

  // ── Gate deletion ──────────────────────────────────────────────────────────
  const deleteGate = useCallback(
    (gateOrId = null) => {
      let targets = [];
      if (gateOrId) {
        const id = typeof gateOrId === "object" ? gateOrId.id : gateOrId;
        targets = selectedGateIds.includes(id) ? selectedGateIds : [id];
      } else {
        targets = selectedGateIds;
      }
      
      if (targets.length === 0) return;

      const confirmDelete = window.confirm(
        `Are you sure you want to delete the ${targets.length} selected component(s)?`
      );
      if (!confirmDelete) return;

      setGates((prev) => prev.filter((g) => !targets.includes(g.id)));
      setWires((prev) =>
        prev.filter((w) => !targets.includes(w.fromId) && !targets.includes(w.toId)),
      );

      let inputDec = 0;
      let outputDec = 0;
      gates.forEach((g) => {
        if (targets.includes(g.id)) {
          if (g.type === "INPUT") inputDec++;
          if (g.type === "OUTPUT") outputDec++;
        }
      });

      if (inputDec > 0) setInputCounter((prev) => Math.max(0, prev - inputDec));
      if (outputDec > 0) setOutputCounter((prev) => Math.max(0, prev - outputDec));

      setSelectedGateIds((prev) => prev.filter((id) => !targets.includes(id)));
      setSelectedGate(null);
      saveToHistory();
    },
    [selectedGateIds, gates, saveToHistory],
  );

  // ── Snap to grid ──────────────────────────────────────────────────────────
  const snapToGrid = useCallback(
    (value) => (SNAP_TO_GRID ? Math.round(value / GRID_SIZE) * GRID_SIZE : value),
    [],
  );

  // ── Gate map ───────────────────────────────────────────────────────────────
  const gateMap = React.useMemo(() => {
    const map = new Map();
    gates.forEach((gate) => map.set(gate.id, gate));
    return map;
  }, [gates]);

  // ── Gate logic: compute a single gate's output from resolved inputs ──────────
  const computeGateOutput = (gate, inputs, outputIndex = 0) => {
    const ci = inputs.filter((v) => v !== undefined);
    switch (gate.type) {
      case "INPUT":
        return gate.inputValues[0] || false;
      case "AND":
        return ci.length > 0 && ci.every(Boolean);
      case "OR":
        return ci.some(Boolean);
      case "NOT":
        return inputs[0] !== undefined ? !inputs[0] : false;
      case "NAND":
        return !(ci.length > 0 && ci.every(Boolean));
      case "NOR":
        return !ci.some(Boolean);
      case "XOR":
        return ci.length >= 2 && ci.reduce((acc, v) => acc !== v, false);
      case "XNOR":
        return ci.length >= 2 && !ci.reduce((acc, v) => acc !== v, false);
      case "BUFFER":
      case "OUTPUT":
        return inputs[0] ?? false;

      // ── Multiplexers ───────────────────────────────────────────────────────
      case "MUX2": {
        // inputs[0]=D0, inputs[1]=D1, inputs[2]=S
        const s = inputs[2] ?? false;
        return s ? (inputs[1] ?? false) : (inputs[0] ?? false);
      }
      case "MUX4": {
        // inputs[0-3]=D0-D3, inputs[4]=S0, inputs[5]=S1
        const s0 = inputs[4] ?? false;
        const s1 = inputs[5] ?? false;
        const sel = (s1 ? 2 : 0) + (s0 ? 1 : 0);
        return inputs[sel] ?? false;
      }
      case "MUX8": {
        // inputs[0-7]=D0-D7, inputs[8]=S0, inputs[9]=S1, inputs[10]=S2
        const s0 = inputs[8] ?? false;
        const s1 = inputs[9] ?? false;
        const s2 = inputs[10] ?? false;
        const sel = (s2 ? 4 : 0) + (s1 ? 2 : 0) + (s0 ? 1 : 0);
        return inputs[sel] ?? false;
      }

      // ── Demultiplexers ─────────────────────────────────────────────────────
      case "DEMUX2": {
        // inputs[0]=D, inputs[1]=S  →  outputIndex 0=Y0, 1=Y1
        const d = inputs[0] ?? false;
        const s = inputs[1] ?? false;
        if (outputIndex === 0) return !s && d;
        if (outputIndex === 1) return  s && d;
        return false;
      }
      case "DEMUX4": {
        // inputs[0]=D, inputs[1]=S0, inputs[2]=S1  →  outputIndex 0-3
        const d  = inputs[0] ?? false;
        const s0 = inputs[1] ?? false;
        const s1 = inputs[2] ?? false;
        const sel = (s1 ? 2 : 0) + (s0 ? 1 : 0);
        return sel === outputIndex && d;
      }
      case "DEMUX8": {
      // inputs[0] = D, inputs[1] = S0, inputs[2] = S1, inputs[3] = S2
      const d  = inputs[0] ?? false;
      const s0 = inputs[1] ?? false;
      const s1 = inputs[2] ?? false;
      const s2 = inputs[3] ?? false;
      const sel = (s2 ? 4 : 0) + (s1 ? 2 : 0) + (s0 ? 1 : 0); // 0..7
      return sel === outputIndex && d;
    }

      // ── Encoders (priority encoder — highest active input wins) ───────────
      case "ENC4": {
        // inputs[0-3]=I0-I3  →  outputIndex 0=A(MSB) 1=B(LSB)
        let code = 0;
        for (let i = 3; i >= 0; i--) { if (inputs[i]) { code = i; break; } }
        return outputIndex === 0 ? Boolean(code & 2) : Boolean(code & 1);
      }
      case "ENC8": {
        // inputs[0-7]=I0-I7  →  outputIndex 0=A(MSB) 1=B 2=C(LSB)
        let code = 0;
        for (let i = 7; i >= 0; i--) { if (inputs[i]) { code = i; break; } }
        return outputIndex === 0 ? Boolean(code & 4)
             : outputIndex === 1 ? Boolean(code & 2)
             :                     Boolean(code & 1);
      }

      // ── Decoders (active-high, enable assumed) ────────────────────────────
      case "DEC4": {
        // inputs[0]=A, inputs[1]=B  →  outputIndex 0-3 = Y0-Y3
        const sel = ((inputs[1] ?? false) ? 2 : 0) + ((inputs[0] ?? false) ? 1 : 0);
        return sel === outputIndex;
      }
      case "DEC8": {
        // inputs[0]=A, inputs[1]=B, inputs[2]=C  →  outputIndex 0-7 = Y0-Y7
        const sel = ((inputs[2] ?? false) ? 4 : 0)
                  + ((inputs[1] ?? false) ? 2 : 0)
                  + ((inputs[0] ?? false) ? 1 : 0);
        return sel === outputIndex;
      }

    // ── Adders & Subtractors ────────────────────────────────────────────────
      case 'HALF_ADDER': {
        const a = inputs[0] ?? false;
        const b = inputs[1] ?? false;
        // outputIndex 0 = Sum (XOR), 1 = Carry (AND)
        return outputIndex === 0 ? (a !== b) : (a && b);
      }
      case 'FULL_ADDER': {
        const a = inputs[0] ?? false;
        const b = inputs[1] ?? false;
        const cin = inputs[2] ?? false;
        // Sum = a XOR b XOR cin
        const sum = (a !== b) !== cin;
        // Cout = (a AND b) OR (cin AND (a XOR b))
        const cout = (a && b) || (cin && (a !== b));
        return outputIndex === 0 ? sum : cout;
      }
      case 'ADD4': {
        // ripple-carry adder: A0..A3, B0..B3, Cin
        const a = [inputs[0], inputs[1], inputs[2], inputs[3]].map(v => v ?? false);
        const b = [inputs[4], inputs[5], inputs[6], inputs[7]].map(v => v ?? false);
        let carry = inputs[8] ?? false;
        const sums = [];
        for (let i = 0; i < 4; i++) {
          const xor_ab = a[i] !== b[i];
          sums[i] = xor_ab !== carry;
          carry = (a[i] && b[i]) || (carry && xor_ab);
        }
        // outputIndex 0-3 = S0..S3, 4 = Cout
        return outputIndex === 4 ? carry : sums[outputIndex];
      }
      case 'CLADD4': {
        // carry look-ahead: same pinout, same outputs
        const a = [inputs[0], inputs[1], inputs[2], inputs[3]].map(v => v ?? false);
        const b = [inputs[4], inputs[5], inputs[6], inputs[7]].map(v => v ?? false);
        const cin = inputs[8] ?? false;

        const g = a.map((ai, i) => ai && b[i]);   // generate
        const p = a.map((ai, i) => ai !== b[i]);  // propagate

        // carry look-ahead
        const c = [cin]; // c[0] = cin, c[1..4] are carries into each stage
        for (let i = 0; i < 4; i++) {
          c[i+1] = g[i] || (p[i] && c[i]);
        }
        const sums = p.map((pi, i) => pi !== c[i]); // S_i = P_i XOR C_i
        const cout = c[4];
        return outputIndex === 4 ? cout : sums[outputIndex];
      }
      case 'HALF_SUBTRACTOR': {
        const a = inputs[0] ?? false;
        const b = inputs[1] ?? false;
        // Diff = A XOR B, Borrow = !A AND B
        return outputIndex === 0 ? (a !== b) : (!a && b);
      }
      case 'FULL_SUBTRACTOR': {
        const a = inputs[0] ?? false;
        const b = inputs[1] ?? false;
        const bin = inputs[2] ?? false;
        // Diff = A XOR B XOR Bin
        const diff = (a !== b) !== bin;
        // Bout = (!A AND B) OR (!A AND Bin) OR (B AND Bin)
        const bout = (!a && b) || (!a && bin) || (b && bin);
        return outputIndex === 0 ? diff : bout;
      }

      default:
        return false;
    }
  };

  // ── Iterative double-buffered simulation (synchronous, runs during render) ──
  const gateValues = React.useMemo(() => {
    // Build incoming-wire lookup: toId → [{ fromId, fromOutputIndex, toIndex }]
    const incomingWires = new Map();
    gates.forEach((g) => incomingWires.set(g.id, []));
    wires.forEach((w) => {
      if (incomingWires.has(w.toId)) incomingWires.get(w.toId).push(w);
    });

    let prev = new Map();
    gates.forEach((g) => {
      if (g.type === "INPUT") {
        prev.set(g.id, g.inputValues[0] || false);
      } else if (IC_TYPES.has(g.type)) {
        // multi-output ICs: store array of output values
        const numOut = IC_META[g.type].outputs;
        const cached = gateStateRef.current.get(g.id);
        prev.set(g.id, Array.isArray(cached) ? cached : Array(numOut).fill(false));
      } else {
        prev.set(g.id, gateStateRef.current.get(g.id) ?? false);
      }
    });

    const MAX_ITER = 100;
    for (let iter = 0; iter < MAX_ITER; iter++) {
      const next = new Map(prev);
      let changed = false;

      for (const gate of gates) {
        if (gate.type === "INPUT") {
          const v = gate.inputValues[0] || false;
          if (prev.get(gate.id) !== v) { next.set(gate.id, v); changed = true; }
          continue;
        }

        // Resolve inputs — for wires from multi-output ICs, read the correct
        // output slot from the source gate's array value.
        const inputs = [];
        for (const w of incomingWires.get(gate.id) || []) {
          const srcVal = prev.get(w.fromId);
          if (IC_TYPES.has(gateMap.get(w.fromId)?.type) && Array.isArray(srcVal)) {
            inputs[w.toIndex] = srcVal[w.fromOutputIndex ?? 0] ?? false;
          } else {
            inputs[w.toIndex] = srcVal ?? false;
          }
        }

        if (IC_TYPES.has(gate.type)) {
          const numOut = IC_META[gate.type].outputs;
          const newVals = Array.from({ length: numOut }, (_, i) =>
            computeGateOutput(gate, inputs, i)
          );
          const oldVals = prev.get(gate.id);
          if (!Array.isArray(oldVals) || newVals.some((v, i) => v !== oldVals[i])) {
            next.set(gate.id, newVals);
            changed = true;
          }
        } else {
          const newVal = computeGateOutput(gate, inputs);
          next.set(gate.id, newVal);
          if (prev.get(gate.id) !== newVal) changed = true;
        }
      }

      prev = next;
      if (!changed) break;
    }

    gateStateRef.current = prev;
    return prev;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gates, wires]);

  // ── Gate evaluation — reads from the synchronously computed state map ──────
  const evaluateGate = useCallback(
    (gate, outputIndex = 0) => {
      if (!gate) return false;
      const val = gateValues.get(gate.id);
      if (Array.isArray(val)) return val[outputIndex] ?? false;
      return val ?? false;
    },
    [gateValues],
  );

  // ── Draw wires ─────────────────────────────────────────────────────────────
  const drawWires = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoom, zoom);

      wires.forEach((wire) => {
        try {
          const fromGate = gateMap.get(wire.fromId);
          const toGate = gateMap.get(wire.toId);
          if (!fromGate || !toGate) return;

          const fromX = fromGate.x + 120;
          const fromY = IC_TYPES.has(fromGate.type)
            ? getOutputY(fromGate, wire.fromOutputIndex ?? 0)
            : fromGate.y + 50;
          const toX = toGate.x;
          const toY = getInputY(toGate, wire.toIndex);

          const outIdx = wire.fromOutputIndex ?? 0;
          const isActive = evaluateGate(fromGate, outIdx);
          ctx.strokeStyle = isActive ? "#00ff88" : "#334155";
          ctx.lineWidth = 3 / zoom;
          ctx.shadowBlur = isActive ? 12 / zoom : 0;
          ctx.shadowColor = isActive ? "#00ff88" : "transparent";

          ctx.beginPath();
          ctx.moveTo(fromX, fromY);

          const dx = toX - fromX;
          const dy = toY - fromY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const controlDistance = Math.min(Math.abs(dx) / 2, distance / 3);

          ctx.bezierCurveTo(
            fromX + controlDistance, fromY,
            toX - controlDistance,  toY,
            toX, toY,
          );
          ctx.stroke();
          ctx.shadowBlur = 0;
        } catch (e) {
          console.error("Error drawing wire:", e);
        }
      });
      ctx.restore();
    } catch (e) {
      console.error("Error in drawWires:", e);
    }
  }, [wires, gateMap, evaluateGate, zoom, panOffset]);

  useEffect(() => {
    try {
      drawWires();
    } catch (e) {
      console.error(e);
    }
  }, [drawWires]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    let resizeTimeout;
    const resizeCanvas = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w > 0 && h > 0) {
          canvas.width = w;
          canvas.height = h;
          drawWires();
        }
      }, 100);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ResizeObserver handles layout shifts (e.g. mobile stacking) that
    // window resize events miss.
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(resizeCanvas);
      ro.observe(container);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearTimeout(resizeTimeout);
      if (ro) ro.disconnect();
    };
  }, [drawWires]);

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setGates(JSON.parse(JSON.stringify(state.gates)));
      setWires(JSON.parse(JSON.stringify(state.wires)));
      setGateIdCounter(state.gateIdCounter);
      setWireIdCounter(state.wireIdCounter);
      setInputCounter(state.inputCounter || 0);
      setOutputCounter(state.outputCounter || 0);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setGates(JSON.parse(JSON.stringify(state.gates)));
      setWires(JSON.parse(JSON.stringify(state.wires)));
      setGateIdCounter(state.gateIdCounter);
      setWireIdCounter(state.wireIdCounter);
      setInputCounter(state.inputCounter || 0);
      setOutputCounter(state.outputCounter || 0);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // ── Spacebar key listeners for panning ─────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === " ") {
        setSpacePressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === " ") {
        setSpacePressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // ── Copy/Paste and Duplicate helpers ───────────────────────────────────────
  const copySelectedGates = useCallback(() => {
    if (selectedGateIds.length === 0) return;
    const selectedGatesList = gates.filter((g) => selectedGateIds.includes(g.id));
    const selectedWiresList = wires.filter(
      (w) => selectedGateIds.includes(w.fromId) && selectedGateIds.includes(w.toId)
    );
    copiedDataRef.current = {
      gates: JSON.parse(JSON.stringify(selectedGatesList)),
      wires: JSON.parse(JSON.stringify(selectedWiresList)),
    };
  }, [selectedGateIds, gates, wires]);

  const pasteGates = useCallback(() => {
    if (!copiedDataRef.current) return;
    const { gates: copiedGates, wires: copiedWires } = copiedDataRef.current;
    if (copiedGates.length === 0) return;

    const idMap = {};
    let currentGateId = gateIdCounter;
    let currentWireId = wireIdCounter;
    let newInputCounter = inputCounter;
    let newOutputCounter = outputCounter;

    const pastedGates = copiedGates.map((g) => {
      const newId = currentGateId++;
      idMap[g.id] = newId;

      let newLabel = g.label;
      if (g.type === "INPUT") {
        newLabel = generateInputLabel(newInputCounter++);
      } else if (g.type === "OUTPUT") {
        newLabel = generateOutputLabel(newOutputCounter++);
      }

      return {
        ...g,
        id: newId,
        label: newLabel,
        x: g.x + 40,
        y: g.y + 40,
        inputValues: g.type === "INPUT" ? [false] : [],
      };
    });

    const pastedWires = copiedWires.map((w) => ({
      ...w,
      id: currentWireId++,
      fromId: idMap[w.fromId],
      toId: idMap[w.toId],
    }));

    setGates((prev) => [...prev, ...pastedGates]);
    setWires((prev) => [...prev, ...pastedWires]);
    setGateIdCounter(currentGateId);
    setWireIdCounter(currentWireId);
    setInputCounter(newInputCounter);
    setOutputCounter(newOutputCounter);

    const pastedIds = pastedGates.map((g) => g.id);
    setSelectedGateIds(pastedIds);
    saveToHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gates, wires, gateIdCounter, wireIdCounter, inputCounter, outputCounter, saveToHistory]);

  const duplicateSelectedGates = useCallback(() => {
    if (selectedGateIds.length === 0) return;
    const selectedGatesList = gates.filter((g) => selectedGateIds.includes(g.id));
    const selectedWiresList = wires.filter(
      (w) => selectedGateIds.includes(w.fromId) && selectedGateIds.includes(w.toId)
    );

    const idMap = {};
    let currentGateId = gateIdCounter;
    let currentWireId = wireIdCounter;
    let newInputCounter = inputCounter;
    let newOutputCounter = outputCounter;

    const duplicatedGates = selectedGatesList.map((g) => {
      const newId = currentGateId++;
      idMap[g.id] = newId;

      let newLabel = g.label;
      if (g.type === "INPUT") {
        newLabel = generateInputLabel(newInputCounter++);
      } else if (g.type === "OUTPUT") {
        newLabel = generateOutputLabel(newOutputCounter++);
      }

      return {
        ...g,
        id: newId,
        label: newLabel,
        x: g.x + 40,
        y: g.y + 40,
        inputValues: g.type === "INPUT" ? [false] : [],
      };
    });

    const duplicatedWires = selectedWiresList.map((w) => ({
      ...w,
      id: currentWireId++,
      fromId: idMap[w.fromId],
      toId: idMap[w.toId],
    }));

    setGates((prev) => [...prev, ...duplicatedGates]);
    setWires((prev) => [...prev, ...duplicatedWires]);
    setGateIdCounter(currentGateId);
    setWireIdCounter(currentWireId);
    setInputCounter(newInputCounter);
    setOutputCounter(newOutputCounter);

    const duplicatedIds = duplicatedGates.map((g) => g.id);
    setSelectedGateIds(duplicatedIds);
    saveToHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGateIds, gates, wires, gateIdCounter, wireIdCounter, inputCounter, outputCounter, saveToHistory]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return;
      }

      if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        redo();
      } else if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        setSelectedGateIds(gates.map((g) => g.id));
      } else if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        copySelectedGates();
      } else if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        pasteGates();
      } else if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        duplicateSelectedGates();
      } else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedGateIds.length > 0
      ) {
        e.preventDefault();
        deleteGate();
      } else if (e.key === "Escape") {
        setConnectingFrom(null);
        setSelectedGateIds([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, gates, selectedGateIds, deleteGate, copySelectedGates, pasteGates, duplicateSelectedGates]);

  // ── Zoom with mouse wheel ──────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
      const zoomRatio = newZoom / zoom;
      setZoom(newZoom);
      setPanOffset({
        x: mouseX - (mouseX - panOffset.x) * zoomRatio,
        y: mouseY - (mouseY - panOffset.y) * zoomRatio,
      });
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoom, panOffset]);

  // ── Pan and Drag Selection with canvas drag ────────────────────────────────
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      e.preventDefault();
      
      const rect = containerRef.current.getBoundingClientRect();
      const startX = (e.clientX - rect.left - panOffset.x) / zoom;
      const startY = (e.clientY - rect.top - panOffset.y) / zoom;
      
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isMiddleClick = e.button === 1;
      
      // Middle click, Space held, or Shift always pans
      if (spacePressed || isMiddleClick) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      } else if (e.button === 0) {
        // When selection tool is OFF (default): left-drag pans the canvas
        // When selection tool is ON or Shift held: left-drag draws a selection rectangle
        if (!selectionToolActive && !isShift) {
          setIsPanning(true);
          setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        } else {
          // Selection mode: box-select
          setIsSelecting(true);
          setSelectionStart({ x: startX, y: startY });
          setSelectionEnd({ x: startX, y: startY });
          setSelectionStartIds(isCtrl ? selectedGateIds : []);
          
          if (!isCtrl) {
            setSelectedGateIds([]);
            setSelectedGate(null);
          }
        }
      }
    }
  };
  
  const handleMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (isSelecting) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left - panOffset.x) / zoom;
      const currentY = (e.clientY - rect.top - panOffset.y) / zoom;
      setSelectionEnd({ x: currentX, y: currentY });
      
      const left = Math.min(selectionStart.x, currentX);
      const top = Math.min(selectionStart.y, currentY);
      const width = Math.abs(selectionStart.x - currentX);
      const height = Math.abs(selectionStart.y - currentY);
      
      const box = { x1: left, y1: top, x2: left + width, y2: top + height };
      
      const intersectingIds = gates.filter((g) => {
        const gH = IC_TYPES.has(g.type) ? getICHeight(g.type) : 100;
        const gateBox = { x1: g.x, y1: g.y, x2: g.x + 120, y2: g.y + gH };
        return gateBox.x1 < box.x2 && gateBox.x2 > box.x1 && gateBox.y1 < box.y2 && gateBox.y2 > box.y1;
      }).map((g) => g.id);
      
      const isCtrl = e.ctrlKey || e.metaKey;
      if (isCtrl) {
        setSelectedGateIds(Array.from(new Set([...selectionStartIds, ...intersectingIds])));
      } else {
        setSelectedGateIds(intersectingIds);
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsSelecting(false);
  };

  // ── Touch support: pan canvas and drag gates ───────────────────────────────
  const touchStateRef = useRef({ type: null, id: null, startX: 0, startY: 0 });

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;

    // Check if touch is on a gate element
    const gateEl = touch.target.closest?.(".gate");
    if (gateEl) {
      // Find which gate this corresponds to
      const gateId = parseInt(gateEl.dataset.gateId, 10);
      const gate = gates.find((g) => g.id === gateId);
      if (gate) {
        e.preventDefault();
        
        let nextSelection = [...selectedGateIds];
        if (!selectedGateIds.includes(gate.id)) {
          nextSelection = [gate.id];
        }
        setSelectedGateIds(nextSelection);
        setSelectedGate(gate);

        const startDragPositions = {};
        gates.forEach((g) => {
          if (nextSelection.includes(g.id)) {
            startDragPositions[g.id] = { x: g.x, y: g.y };
          }
        });
        setDragStartPositions(startDragPositions);

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = (touch.clientX - rect.left - panOffset.x) / zoom;
        const mouseY = (touch.clientY - rect.top - panOffset.y) / zoom;
        setDragStartMouse({ x: mouseX, y: mouseY });

        touchStateRef.current = {
          type: "drag",
          id: gateId,
          startX: touch.clientX,
          startY: touch.clientY,
        };
        setDragging(true);
        setDragOffset({
          x: touch.clientX - gate.x * zoom - panOffset.x,
          y: touch.clientY - gate.y * zoom - panOffset.y,
        });
      }
      return;
    }

    // Touch on canvas — pan
    if (touch.target === canvas || touch.target.classList.contains("gates-container")) {
      e.preventDefault();
      touchStateRef.current = { type: "pan", id: null, startX: 0, startY: 0 };
      setIsPanning(true);
      setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
    }
  }, [gates, zoom, panOffset, selectedGateIds]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const state = touchStateRef.current;

    if (state.type === "pan") {
      e.preventDefault();
      setPanOffset({ x: touch.clientX - panStart.x, y: touch.clientY - panStart.y });
    } else if (state.type === "drag") {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (touch.clientX - rect.left - panOffset.x) / zoom;
      const mouseY = (touch.clientY - rect.top - panOffset.y) / zoom;
      const dx = mouseX - dragStartMouse.x;
      const dy = mouseY - dragStartMouse.y;
      
      setGates((prev) =>
        prev.map((g) => {
          if (selectedGateIds.includes(g.id)) {
            const startPos = dragStartPositions[g.id];
            if (startPos) {
              const targetX = snapToGrid(startPos.x + dx);
              const targetY = snapToGrid(startPos.y + dy);
              return { ...g, x: targetX, y: targetY };
            }
          }
          return g;
        }),
      );
    }
  }, [panStart, zoom, panOffset, snapToGrid, selectedGateIds, dragStartMouse, dragStartPositions]);

  const handleTouchEnd = useCallback(() => {
    const state = touchStateRef.current;
    if (state.type === "drag" && dragging) {
      setDragging(false);
      saveToHistory();
    }
    if (state.type === "pan") {
      setIsPanning(false);
    }
    touchStateRef.current = { type: null, id: null, startX: 0, startY: 0 };
  }, [dragging, saveToHistory]);

  // ── Register touch listeners as non-passive so preventDefault works ────────
  // React's synthetic onTouchStart/Move are passive by default in modern
  // browsers; we need { passive: false } to call e.preventDefault() inside
  // them (required to stop the page from scrolling while panning/dragging).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // ── Fit all gates into view ────────────────────────────────────────────────
  const fitToView = useCallback(() => {
    const container = containerRef.current;
    if (!container || gates.length === 0) return;

    const GATE_W = 130;
    const GATE_H = 100;
    const PADDING = 40;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    gates.forEach((g) => {
      minX = Math.min(minX, g.x);
      minY = Math.min(minY, g.y);
      maxX = Math.max(maxX, g.x + GATE_W);
      maxY = Math.max(maxY, g.y + GATE_H);
    });

    const contentW = maxX - minX + PADDING * 2;
    const contentH = maxY - minY + PADDING * 2;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;

    const scaleX = containerW / contentW;
    const scaleY = containerH / contentH;
    const newZoom = Math.min(scaleX, scaleY, 1.5);

    setZoom(newZoom);
    setPanOffset({
      x: PADDING * newZoom - minX * newZoom,
      y: PADDING * newZoom - minY * newZoom,
    });
  }, [gates]);

  // ── Add gate ───────────────────────────────────────────────────────────────
  const addGate = (type) => {
    const finalInputs = defaultInputCount(type);
    const isIC = IC_TYPES.has(type);
    const hasOutput = type !== "OUTPUT";

    let label = type;
    if (type === "INPUT") {
      label = generateInputLabel(inputCounter);
      setInputCounter((prev) => prev + 1);
    } else if (type === "OUTPUT") {
      label = generateOutputLabel(outputCounter);
      setOutputCounter((prev) => prev + 1);
    } else if (isIC) {
      label = type; // e.g. "MUX4"
    }

    const container = containerRef.current;
    const canvasW = container ? container.clientWidth : 600;
    const GATE_STEP_X = 160;
    const GATE_STEP_Y = isIC ? (getICHeight(type) + 40) : 120;
    const COLS = Math.max(1, Math.floor((canvasW - 60) / GATE_STEP_X));
    const col = gates.length % COLS;
    const row = Math.floor(gates.length / COLS);

    const newGate = {
      id: gateIdCounter,
      type,
      label,
      x: 30 + col * GATE_STEP_X,
      y: 30 + row * GATE_STEP_Y,
      inputs: finalInputs,
      outputs: isIC ? IC_META[type].outputs : 1,
      hasOutput,
      inputValues: type === "INPUT" ? [false] : [],
    };

    setGates((prev) => [...prev, newGate]);
    setGateIdCounter((prev) => prev + 1);
    saveToHistory();
  };

  // ── Add / remove input slot on a gate ─────────────────────────────────────
  const addInputSlot = useCallback(
    (e, gate) => {
      e.stopPropagation();
      if (!MULTI_INPUT_GATES.has(gate.type)) return;
      if (gate.inputs >= MAX_GATE_INPUTS) return;
      setGates((prev) =>
        prev.map((g) =>
          g.id === gate.id ? { ...g, inputs: g.inputs + 1 } : g,
        ),
      );
      saveToHistory();
    },
    [saveToHistory],
  );

  const removeInputSlot = useCallback(
    (e, gate) => {
      e.stopPropagation();
      if (!MULTI_INPUT_GATES.has(gate.type)) return;
      if (gate.inputs <= MIN_GATE_INPUTS) return;
      const lastIdx = gate.inputs - 1;
      // Remove any wires connected to the last (now-removed) input slot
      setWires((prev) =>
        prev.filter((w) => !(w.toId === gate.id && w.toIndex === lastIdx)),
      );
      setGates((prev) =>
        prev.map((g) =>
          g.id === gate.id ? { ...g, inputs: g.inputs - 1 } : g,
        ),
      );
      saveToHistory();
    },
    [saveToHistory],
  );

  // ── Drag gates ─────────────────────────────────────────────────────────────
  const startDrag = (e, gate) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setIsPanning(false);

    const isCtrl = e.ctrlKey || e.metaKey;
    let nextSelection = [...selectedGateIds];
    
    if (isCtrl) {
      if (selectedGateIds.includes(gate.id)) {
        nextSelection = nextSelection.filter(id => id !== gate.id);
      } else {
        nextSelection.push(gate.id);
      }
    } else {
      if (!selectedGateIds.includes(gate.id)) {
        nextSelection = [gate.id];
      }
    }
    
    setSelectedGateIds(nextSelection);
    setSelectedGate(gate);
    wasCtrlClickRef.current = isCtrl;
    hasMovedRef.current = false;

    const startDragPositions = {};
    gates.forEach((g) => {
      if (nextSelection.includes(g.id)) {
        startDragPositions[g.id] = { x: g.x, y: g.y };
      }
    });
    setDragStartPositions(startDragPositions);

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoom;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoom;
    setDragStartMouse({ x: mouseX, y: mouseY });

    setDragging(true);
    setDragOffset({
      x: e.clientX - gate.x * zoom - panOffset.x,
      y: e.clientY - gate.y * zoom - panOffset.y,
    });
  };

  const onDrag = (e) => {
    if (!dragging || selectedGateIds.length === 0 || isPanning) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoom;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoom;
    
    const dx = mouseX - dragStartMouse.x;
    const dy = mouseY - dragStartMouse.y;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      hasMovedRef.current = true;
    }

    setGates((prev) =>
      prev.map((g) => {
        if (selectedGateIds.includes(g.id)) {
          const startPos = dragStartPositions[g.id];
          if (startPos) {
            const targetX = snapToGrid(startPos.x + dx);
            const targetY = snapToGrid(startPos.y + dy);
            return { ...g, x: targetX, y: targetY };
          }
        }
        return g;
      })
    );
  };

  const stopDrag = () => {
    if (dragging) {
      setDragging(false);
      
      if (!hasMovedRef.current && selectedGate) {
        if (!wasCtrlClickRef.current) {
          setSelectedGateIds([selectedGate.id]);
        }
      }
      
      saveToHistory();
    }
  };

  // ── Wire connections ───────────────────────────────────────────────────────
  const startConnection = (gate, outputIndex = 0) => {
    if (!gate.hasOutput) return;
    setConnectingFrom({ gate, outputIndex });
  };

  const completeConnection = (toGate, toIndex) => {
    if (!connectingFrom || connectingFrom.gate.id === toGate.id) {
      setConnectingFrom(null);
      return;
    }
    const fromGate = connectingFrom.gate;
    const fromOutputIndex = connectingFrom.outputIndex ?? 0;

    // Remove any existing wire to this specific input point
    const filteredWires = wires.filter(
      (w) => !(w.toId === toGate.id && w.toIndex === toIndex),
    );
    // OUTPUT gates take only one input
    const finalWires =
      toGate.type === "OUTPUT"
        ? filteredWires.filter((w) => w.toId !== toGate.id)
        : filteredWires;

    const newWire = {
      id: wireIdCounter,
      fromId: fromGate.id,
      fromOutputIndex,
      toId: toGate.id,
      toIndex,
    };
    setWires([...finalWires, newWire]);
    setWireIdCounter((prev) => prev + 1);
    setConnectingFrom(null);
    saveToHistory();
  };

  // ── Right-click canvas to delete wires ───────────────────────────────────
  const handleCanvasContextMenu = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    for (const wire of wires) {
      const fromGate = gateMap.get(wire.fromId);
      const toGate = gateMap.get(wire.toId);
      if (!fromGate || !toGate) continue;

      const fromX = fromGate.x + 120;
      const fromY = IC_TYPES.has(fromGate.type)
        ? getOutputY(fromGate, wire.fromOutputIndex ?? 0)
        : fromGate.y + 50;
      const toX = toGate.x;
      const toY = getInputY(toGate, wire.toIndex);

      // Compute the same control points used in drawWires
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const controlDistance = Math.min(Math.abs(dx) / 2, distance / 3);
      const cp1x = fromX + controlDistance;
      const cp1y = fromY;
      const cp2x = toX - controlDistance;
      const cp2y = toY;

      // Sample the Bézier curve and check if click is within threshold
      const SAMPLES = 60;
      const HIT_RADIUS = 8;
      let hit = false;
      for (let i = 0; i <= SAMPLES; i++) {
        const t = i / SAMPLES;
        const mt = 1 - t;
        const bx =
          mt * mt * mt * fromX +
          3 * mt * mt * t * cp1x +
          3 * mt * t * t * cp2x +
          t * t * t * toX;
        const by =
          mt * mt * mt * fromY +
          3 * mt * mt * t * cp1y +
          3 * mt * t * t * cp2y +
          t * t * t * toY;
        if (Math.sqrt((bx - x) ** 2 + (by - y) ** 2) < HIT_RADIUS) {
          hit = true;
          break;
        }
      }

      if (hit) {
        e.preventDefault();
        setWires((prev) => prev.filter((w) => w.id !== wire.id));
        saveToHistory();
        return;
      }
    }
    // If no wire was hit, let the default context menu appear (or suppress it)
    e.preventDefault();
  };

  // ── Toggle input value ─────────────────────────────────────────────────────
  const toggleInput = (gate) => {
    setGates((prev) =>
      prev.map((g) =>
        g.id === gate.id ? { ...g, inputValues: [!g.inputValues[0]] } : g,
      ),
    );
  };

  // ── Rename gate ────────────────────────────────────────────────────────────
  const startRename = (e, gate) => {
    e.stopPropagation();
    e.preventDefault();
    setRenamingGate(gate);
    setRenameValue(gate.label || gate.type);
  };

  const commitRename = () => {
    if (!renamingGate) return;
    const trimmed = renameValue.trim();
    if (trimmed) {
      setGates((prev) =>
        prev.map((g) =>
          g.id === renamingGate.id ? { ...g, label: trimmed } : g,
        ),
      );
      saveToHistory();
    }
    setRenamingGate(null);
    setRenameValue("");
  };

  const cancelRename = () => {
    setRenamingGate(null);
    setRenameValue("");
  };

  const evaluateGateWithGates = useCallback(
    (gate, gatesArray, outputIndex = 0) => {
      const localGateMap = new Map();
      gatesArray.forEach((g) => localGateMap.set(g.id, g));

      const incomingWires = new Map();
      gatesArray.forEach((g) => incomingWires.set(g.id, []));
      wires.forEach((w) => {
        if (incomingWires.has(w.toId)) incomingWires.get(w.toId).push(w);
      });

      let prev = new Map();
      gatesArray.forEach((g) => {
        if (g.type === "INPUT") {
          prev.set(g.id, g.inputValues[0] || false);
        } else if (IC_TYPES.has(g.type)) {
          prev.set(g.id, Array(IC_META[g.type].outputs).fill(false));
        } else {
          prev.set(g.id, false);
        }
      });

      for (let iter = 0; iter < 100; iter++) {
        const next = new Map(prev);
        let changed = false;
        for (const g of gatesArray) {
          if (g.type === "INPUT") continue;
          const inputs = [];
          for (const w of incomingWires.get(g.id) || []) {
            const srcVal = prev.get(w.fromId);
            if (IC_TYPES.has(localGateMap.get(w.fromId)?.type) && Array.isArray(srcVal)) {
              inputs[w.toIndex] = srcVal[w.fromOutputIndex ?? 0] ?? false;
            } else {
              inputs[w.toIndex] = srcVal ?? false;
            }
          }
          if (IC_TYPES.has(g.type)) {
            const numOut = IC_META[g.type].outputs;
            const newVals = Array.from({ length: numOut }, (_, i) => computeGateOutput(g, inputs, i));
            const oldVals = prev.get(g.id);
            if (!Array.isArray(oldVals) || newVals.some((v, i) => v !== oldVals[i])) {
              next.set(g.id, newVals); changed = true;
            }
          } else {
            const newVal = computeGateOutput(g, inputs);
            next.set(g.id, newVal);
            if (prev.get(g.id) !== newVal) changed = true;
          }
        }
        prev = next;
        if (!changed) break;
      }

      const val = prev.get(gate.id);
      if (Array.isArray(val)) return val[outputIndex] ?? false;
      return val ?? false;
    },
    [wires],
  );

  // ── Truth table generation ─────────────────────────────────────────────────
  const generateTruthTable = useCallback(() => {
    const inputs = gates.filter((g) => g.type === "INPUT");
    const outputs = gates.filter((g) => g.type === "OUTPUT");
    if (inputs.length === 0 || outputs.length === 0)
      return { headers: [], rows: [] };

    const numCombinations = Math.pow(2, inputs.length);
    const rows = [];
    for (let i = 0; i < numCombinations; i++) {
      const inputValues = inputs.map((_, index) =>
        Boolean((i >> (inputs.length - 1 - index)) & 1),
      );
      const tempGates = gates.map((g) => {
        if (g.type === "INPUT") {
          const index = inputs.findIndex((inp) => inp.id === g.id);
          return { ...g, inputValues: [inputValues[index]] };
        }
        return g;
      });
      const outputValues = outputs.map((outGate) => {
        const gate = tempGates.find((g) => g.id === outGate.id);
        return evaluateGateWithGates(gate, tempGates) ? 1 : 0;
      });
      rows.push([...inputValues.map((v) => (v ? 1 : 0)), ...outputValues]);
    }
    return {
      headers: [...inputs.map((g) => g.label), ...outputs.map((g) => g.label)],
      rows,
    };
  }, [gates, evaluateGateWithGates]);

  // ── Clear circuit ──────────────────────────────────────────────────────────
  const clearCircuit = () => {
    setGates([]);
    setWires([]);
    setGateIdCounter(0);
    setWireIdCounter(0);
    setInputCounter(0);
    setOutputCounter(0);
    setHistory([]);
    setHistoryIndex(-1);
  };

  // ── Label generators ───────────────────────────────────────────────────────
  // If a problem is loaded, use its exact port names in order.
  // Otherwise fall back to I0, I1, … / S0, S1, …
  const generateInputLabel = (index) =>
    portNames?.inputs?.[index] ?? `I${index}`;
  const generateOutputLabel = (index) =>
    portNames?.outputs?.[index] ?? `S${index}`;

  // ── Derived state ──────────────────────────────────────────────────────────
  const inputGates = React.useMemo(
    () => gates.filter((g) => g.type === "INPUT"),
    [gates],
  );
  const outputGates = React.useMemo(
    () => gates.filter((g) => g.type === "OUTPUT"),
    [gates],
  );
  const truthTable = React.useMemo(
    () => generateTruthTable(),
    [generateTruthTable],
  );

  // ── Auto-build from expression ─────────────────────────────────────────────
  const hasAutoBuilt = useRef(false);
  useEffect(() => {
    if (simplifiedExpression && variables.length > 0 && !hasAutoBuilt.current) {
      const circuit = parseExpressionToCircuit(simplifiedExpression, variables);
      if (circuit.gates && circuit.gates.length > 0) {
        setGates(circuit.gates);
        setWires(circuit.wires);
        setGateIdCounter(circuit.gateIdCounter || circuit.gates.length);
        setWireIdCounter(circuit.wireIdCounter || circuit.wires.length);
        const inputCount = circuit.gates.filter(
          (g) => g.type === "INPUT",
        ).length;
        const outputCount = circuit.gates.filter(
          (g) => g.type === "OUTPUT",
        ).length;
        setInputCounter(inputCount);
        setOutputCounter(outputCount);
        hasAutoBuilt.current = true;
        setTimeout(() => {
          setHistory([
            {
              gates: circuit.gates,
              wires: circuit.wires,
              gateIdCounter: circuit.gateIdCounter || circuit.gates.length,
              wireIdCounter: circuit.wireIdCounter || circuit.wires.length,
              inputCounter: inputCount,
              outputCounter: outputCount,
            },
          ]);
          setHistoryIndex(0);
        }, 100);
      }
    }
  }, [simplifiedExpression, variables]);

  // ── Notify parent of circuit changes ──────────────────────────────────────
  useEffect(() => {
    if (typeof onCircuitChange === "function") onCircuitChange(gates, wires);
  }, [gates, wires, onCircuitChange]);

  // ── Render ─────────────────────────────────────────────────────────────────
  // The circuit tool itself
  const circuitTool = (
    <div
      className="container circuit-maker"
      onMouseMove={(e) => {
        if (isPanning || isSelecting) {
          handleMouseMove(e);
        } else {
          onDrag(e);
        }
      }}
      onMouseUp={() => {
        stopDrag();
        handleMouseUp();
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          if (isPanning) {
            handleMouseMove(touch);
          } else {
            onDrag(touch);
          }
        }
      }}
      onTouchEnd={() => {
        stopDrag();
        handleMouseUp();
      }}
    >
      {/* ── Sidebar ── */}
      <div className="sidebar">
        <h2>Circuit Forge</h2>

        {/* ── Selection Tool Toggle ── */}
        <button
          onClick={() => setSelectionToolActive((v) => !v)}
          title={selectionToolActive ? "Selection Tool ON — click to switch to Pan mode" : "Selection Tool OFF — click to enable box-select"}
          style={{
            width: "100%",
            padding: "10px 14px",
            marginBottom: "16px",
            background: selectionToolActive ? "var(--accent-primary, #00ff88)" : "transparent",
            color: selectionToolActive ? "var(--bg-dark, #0a0e1a)" : "var(--accent-primary, #00ff88)",
            border: "2px solid var(--accent-primary, #00ff88)",
            borderRadius: "4px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "1px",
            textTransform: "uppercase",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>{selectionToolActive ? "✦" : "⬚"}</span>
          {selectionToolActive ? "Selection ON" : "Selection OFF"}
        </button>

        {simplifiedExpression && (
          <div className="simplified-expression-display">
            <h3>📐 K-Map Simplified Expression</h3>
            <div className="expression-content">{simplifiedExpression}</div>
            <p className="expression-hint">Circuit auto-generated below! ✨</p>
          </div>
        )}

        <div className="palette-section">
          <div className="palette-section-title">Logic Gates</div>
          <div className="gate-palette">
            {["INPUT","OUTPUT","AND","OR","NOT","NAND","NOR","XOR","XNOR","BUFFER"].map((type) => (
              <button key={type} className="gate-btn" onClick={() => addGate(type)}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="palette-section">
          <div className="palette-section-title">Multiplexers</div>
          <div className="gate-palette">
            {[
              { type: "MUX2",  label: "MUX 2:1" },
              { type: "MUX4",  label: "MUX 4:1" },
              { type: "MUX8",  label: "MUX 8:1" },
            ].map(({ type, label }) => (
              <button key={type} className="gate-btn gate-btn--ic" onClick={() => addGate(type)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="palette-section">
          <div className="palette-section-title">Demultiplexers</div>
          <div className="gate-palette">
            {[
              { type: "DEMUX2", label: "DEMUX 1:2" },
              { type: "DEMUX4", label: "DEMUX 1:4" },
              { type: "DEMUX8", label: "DEMUX 1:8" },
            ].map(({ type, label }) => (
              <button key={type} className="gate-btn gate-btn--ic" onClick={() => addGate(type)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="palette-section">
          <div className="palette-section-title">Encoders</div>
          <div className="gate-palette">
            {[
              { type: "ENC4", label: "ENC 4:2" },
              { type: "ENC8", label: "ENC 8:3" },
            ].map(({ type, label }) => (
              <button key={type} className="gate-btn gate-btn--ic" onClick={() => addGate(type)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="palette-section">
          <div className="palette-section-title">Decoders</div>
          <div className="gate-palette">
            {[
              { type: "DEC4", label: "DEC 2:4" },
              { type: "DEC8", label: "DEC 3:8" },
            ].map(({ type, label }) => (
              <button key={type} className="gate-btn gate-btn--ic" onClick={() => addGate(type)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="palette-section">
          <div className="palette-section-title">Adders </div>
          <div className="gate-palette">
            {[
              { type: "HALF_ADDER",        label: "Half Adder" },
              { type: "FULL_ADDER",        label: "Full Adder" },
              { type: "ADD4",              label: "4 bit Adder" },
              { type: "CLADD4",            label: "Carry LA 4" },
            ].map(({ type, label }) => (
              <button key={type} className="gate-btn gate-btn--ic" onClick={() => addGate(type)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="palette-section">
          <div className="palette-section-title">Subtractors</div>
          <div className="gate-palette">
            {[
              { type: "HALF_SUBTRACTOR",   label: "Half Subtractor" },
              { type: "FULL_SUBTRACTOR",   label: "Full Subtractor" },
            ].map(({ type, label }) => (
              <button key={type} className="gate-btn gate-btn--ic" onClick={() => addGate(type)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="instructions">
          <p><strong>Controls:</strong></p>
          <p>• Click buttons to add components</p>
          <p>• Drag gates to move them (Group Drag supported!)</p>
          <p>• <strong>Drag empty space</strong> to pan the canvas (default)</p>
          <p>• Enable <strong>⬚ Selection Tool</strong> (top-left overlay) to box-select components</p>
          <p>• Hold <strong>Space</strong> or drag with <strong>Middle Button</strong> to pan anytime</p>
          <p>• Ctrl + Click to add/remove individual gates</p>
          <p>• Click output dot → input dot to wire</p>
          <p>• Right-click wire to delete it</p>
          <p>• Right-click gate to delete (deletes selection)</p>
          <p>• Double-click gate to rename it</p>
          <p>• Scroll to zoom in/out</p>
          <p>• Click <strong>+</strong> / <strong>−</strong> to resize inputs</p>
          <p><strong>Shortcuts:</strong></p>
          <p>• Ctrl + Z: Undo &nbsp; Ctrl + Shift + Z: Redo</p>
          <p>• Ctrl + A: Select All &nbsp; Ctrl + D: Duplicate</p>
          <p>• Ctrl + C: Copy &nbsp; Ctrl + V: Paste</p>
          <p>• Delete / Backspace: Remove selected</p>
          <p>• Esc: Cancel wire / Clear selection</p>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div
        className="canvas-container"
        ref={containerRef}
      >
        <canvas
          ref={canvasRef}
          onContextMenu={handleCanvasContextMenu}
          onMouseDown={handleCanvasMouseDown}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              const touch = e.touches[0];
              setIsPanning(true);
              setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
            }
          }}
          style={{
            pointerEvents: "auto",
            cursor: isPanning ? "grabbing" : (spacePressed ? "grab" : (selectionToolActive ? "crosshair" : "grab")),
          }}
        />

        <div
          className="gates-container"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {isSelecting && (
            <div
              className="selection-rectangle"
              style={{
                position: "absolute",
                left: Math.min(selectionStart.x, selectionEnd.x),
                top: Math.min(selectionStart.y, selectionEnd.y),
                width: Math.abs(selectionStart.x - selectionEnd.x),
                height: Math.abs(selectionStart.y - selectionEnd.y),
                border: "1.5px dashed var(--accent-secondary, #00d4ff)",
                background: "rgba(0, 212, 255, 0.12)",
                pointerEvents: "none",
                zIndex: 1000,
                borderRadius: "3px",
                boxShadow: "0 0 8px rgba(0, 212, 255, 0.2)",
              }}
            />
          )}
          {gates.map((gate) => {
            const canExpand = MULTI_INPUT_GATES.has(gate.type);
            const canAddInput = canExpand && gate.inputs < MAX_GATE_INPUTS;
            const canRemoveInput = canExpand && gate.inputs > MIN_GATE_INPUTS;
            const isIC = IC_TYPES.has(gate.type);
            const icMeta = isIC ? IC_META[gate.type] : null;
            const icH = isIC ? getICHeight(gate.type) : 100;
            // connectingFrom is now { gate, outputIndex } for ICs, or gate for legacy
            const cfGateId = connectingFrom?.gate?.id ?? connectingFrom?.id;

            return (
              <div
                key={gate.id}
                data-gate-id={gate.id}
                className={`gate ${gate.type === "OUTPUT" ? "output-gate" : ""} ${isIC ? "gate--ic" : ""} ${selectedGateIds.includes(gate.id) ? "selected" : ""} ${gate.type === "OUTPUT" && evaluateGate(gate) ? "active" : ""}`}
                style={{ left: gate.x, top: gate.y, height: isIC ? icH : undefined }}
                onMouseDown={(e) => startDrag(e, gate)}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    e.stopPropagation();
                    startDrag(e.touches[0], gate);
                  }
                }}
                onDoubleClick={(e) => startRename(e, gate)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  deleteGate(gate);
                }}
              >
                <div className="gate-content">
                  {gateSymbols[gate.type]}
                  {!isIC && <div className="gate-label">{gate.label || gate.type}</div>}
                </div>

                {/* ── Input-count controls (+ / −) — only for expandable gates ── */}
                {canExpand && (
                  <div className="gate-input-controls">
                    <button
                      className="gate-input-btn"
                      title={canRemoveInput ? `Remove input (${gate.inputs - 1} inputs)` : `Minimum ${MIN_GATE_INPUTS} inputs`}
                      disabled={!canRemoveInput}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => removeInputSlot(e, gate)}
                    >−</button>
                    <span className="gate-input-count">{gate.inputs}</span>
                    <button
                      className="gate-input-btn"
                      title={canAddInput ? `Add input (${gate.inputs + 1} inputs)` : `Maximum ${MAX_GATE_INPUTS} inputs`}
                      disabled={!canAddInput}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => addInputSlot(e, gate)}
                    >+</button>
                  </div>
                )}

                {/* ── IC: multiple output dots on right side ── */}
                {isIC && Array.from({ length: icMeta.outputs }).map((_, outIdx) => {
                  const n = icMeta.outputs;
                  const topPct = n === 1 ? 50 : 10 + (outIdx / (n - 1)) * 80;
                  const isConnecting = cfGateId === gate.id && connectingFrom?.outputIndex === outIdx;
                  return (
                    <div
                      key={`out-${outIdx}`}
                      className={`connection-point output-point ic-output-point ${isConnecting ? "active" : ""} ${evaluateGate(gate, outIdx) ? "ic-output-point--high" : ""}`}
                      style={{ top: `${topPct}%` }}
                      title={icMeta.outputLabels[outIdx]}
                      onClick={() => startConnection(gate, outIdx)}
                    >
                      <span className="ic-pin-label">{icMeta.outputLabels[outIdx]}</span>
                    </div>
                  );
                })}

                {/* ── Single output dot for regular gates ── */}
                {!isIC && gate.hasOutput && (
                  <div
                    className={`connection-point output-point ${cfGateId === gate.id ? "active" : ""}`}
                    onClick={() => startConnection(gate, 0)}
                  />
                )}

                {/* ── IC: input dots on left side with pin labels ── */}
                {isIC && Array.from({ length: icMeta.inputs }).map((_, idx) => {
                  const n = icMeta.inputs;
                  const topPct = n === 1 ? 50 : 10 + (idx / (n - 1)) * 80;
                  return (
                    <div
                      key={`in-${idx}`}
                      className={`connection-point input-point ic-input-point ${connectingFrom ? "active" : ""}`}
                      style={{ top: `${topPct}%` }}
                      title={icMeta.inputLabels[idx]}
                      onClick={() => completeConnection(gate, idx)}
                    >
                      <span className="ic-pin-label ic-pin-label--left">{icMeta.inputLabels[idx]}</span>
                    </div>
                  );
                })}

                {/* ── Regular gate: N evenly-spaced input dots ── */}
                {!isIC && gate.inputs >= 2 &&
                  Array.from({ length: gate.inputs }).map((_, idx) => {
                    const n = gate.inputs;
                    const topPct = n === 2 ? (idx === 0 ? 35 : 65) : 15 + (idx / (n - 1)) * 70;
                    return (
                      <div
                        key={idx}
                        className={`connection-point input-point ${connectingFrom ? "active" : ""}`}
                        style={{ top: `${topPct}%` }}
                        onClick={() => completeConnection(gate, idx)}
                      />
                    );
                  })}

                {!isIC && gate.inputs === 1 && (
                  <div
                    className={`connection-point input-point ${connectingFrom ? "active" : ""}`}
                    style={{ top: "50%" }}
                    onClick={() => completeConnection(gate, 0)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Floating canvas controls overlay (mobile-friendly) ── */}
        <div className="canvas-overlay-controls">
          <button
            className={`canvas-overlay-btn${selectionToolActive ? " canvas-overlay-btn--active" : ""}`}
            onClick={() => setSelectionToolActive((v) => !v)}
            title={selectionToolActive ? "Selection Tool ON — click to switch to Pan mode" : "Selection Tool OFF — click to enable box-select"}
            onTouchEnd={(e) => { e.preventDefault(); setSelectionToolActive((v) => !v); }}
            style={{
              background: selectionToolActive ? "var(--accent-primary, #7c3aed)" : undefined,
              color: selectionToolActive ? "#fff" : undefined,
              borderColor: selectionToolActive ? "var(--accent-primary, #7c3aed)" : undefined,
            }}
          >
            ⬚
          </button>
          <button
            className="canvas-overlay-btn"
            onClick={fitToView}
            title="Fit all gates into view"
            onTouchEnd={(e) => { e.preventDefault(); fitToView(); }}
          >
            ⊡
          </button>
          <button
            className="canvas-overlay-btn"
            onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
            title="Zoom In"
            onTouchEnd={(e) => { e.preventDefault(); setZoom((z) => Math.min(3, z * 1.2)); }}
          >
            +
          </button>
          <button
            className="canvas-overlay-btn"
            onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))}
            title="Zoom Out"
            onTouchEnd={(e) => { e.preventDefault(); setZoom((z) => Math.max(0.3, z * 0.8)); }}
          >
            −
          </button>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="truth-table-panel">
        <h2>Circuit Control</h2>

        {inputGates.length > 0 && (
          <div className="input-controls">
            <h3
              style={{
                fontSize: "12px",
                color: "var(--accent-primary)",
                marginBottom: "10px",
              }}
            >
              Input Toggles
            </h3>
            {inputGates.map((gate) => (
              <div key={gate.id} className="input-toggle">
                <label>{gate.label}</label>
                <div
                  className={`toggle-btn ${gate.inputValues[0] ? "on" : ""}`}
                  onClick={() => toggleInput(gate)}
                />
              </div>
            ))}
          </div>
        )}

        {outputGates.length > 0 && (
          <div className="output-display">
            <h3>Output Values</h3>
            {outputGates.map((gate) => (
              <div key={gate.id} className="output-item">
                <label>{gate.label}</label>
                <div
                  className={`output-value ${evaluateGate(gate) ? "high" : "low"}`}
                >
                  {evaluateGate(gate) ? "1" : "0"}
                </div>
              </div>
            ))}
          </div>
        )}

        <TruthTableGenerator truthTable={truthTable} />

        <div className="controls">
          <button className="btn" onClick={undo} disabled={historyIndex <= 0}>
            ↶ Undo
          </button>
          <button
            className="btn"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            ↷ Redo
          </button>
          <SaveAndLoad
            data={{
              gates,
              wires,
              gateIdCounter,
              wireIdCounter,
              inputCounter,
              outputCounter,
            }}
            setGates={setGates}
            setWires={setWires}
            setGateIdCounter={setGateIdCounter}
            setWireIdCounter={setWireIdCounter}
            setInputCounter={setInputCounter}
            setOutputCounter={setOutputCounter}
            saveToHistory={saveToHistory}
          />
          <button className="btn danger" onClick={clearCircuit}>
            🗑️ Clear All
          </button>
        </div>

        <div className="zoom-controls">
          <button
            className="btn zoom-btn"
            onClick={() => setZoom(Math.min(3, zoom * 1.2))}
            title="Zoom In"
          >
            🔍+
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button
            className="btn zoom-btn"
            onClick={() => setZoom(Math.max(0.1, zoom * 0.8))}
            title="Zoom Out"
          >
            🔍−
          </button>
          <button
            className="btn zoom-btn"
            onClick={() => {
              setZoom(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            title="Reset Zoom"
          >
            ⟲
          </button>
          <button
            className="btn zoom-btn"
            onClick={fitToView}
            title="Fit all gates into view"
            style={{ flex: 1 }}
          >
            ⊡ Fit
          </button>
        </div>

        <div className="stats">
          <div>
            <span>Gates:</span> <strong>{gates.length}</strong>
          </div>
          <div>
            <span>Wires:</span> <strong>{wires.length}</strong>
          </div>
          <div>
            <span>Inputs:</span> <strong>{inputGates.length}</strong>
          </div>
          <div>
            <span>Outputs:</span> <strong>{outputGates.length}</strong>
          </div>
        </div>
      </div>
      {/* ── Rename Modal ── */}
      {renamingGate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 5000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={cancelRename}
        >
          <div
            style={{
              background: "var(--bg-medium, #141b2d)",
              border: "1px solid var(--border-color, #2a3550)",
              borderRadius: "12px",
              padding: "1.5rem",
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: 0,
                color: "var(--text-color, #e8f0ff)",
                fontSize: "1rem",
              }}
            >
              ✏️ Rename Gate
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "var(--secondary-text, #8899aa)",
              }}
            >
              Enter a custom label for this{" "}
              <strong style={{ color: "var(--accent-secondary, #00d4ff)" }}>
                {renamingGate.type}
              </strong>{" "}
              gate.
            </p>
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") cancelRename();
              }}
              style={{
                background: "var(--bg-light, #1e2842)",
                border: "1px solid var(--accent-secondary, #00d4ff)",
                borderRadius: "6px",
                padding: "0.5rem 0.75rem",
                color: "var(--text-color, #e8f0ff)",
                fontSize: "1rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={cancelRename}
                style={{
                  background: "none",
                  border: "1px solid var(--border-color, #2a3550)",
                  color: "var(--secondary-text, #8899aa)",
                  borderRadius: "6px",
                  padding: "0.4rem 0.9rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Cancel
              </button>
              <button
                onClick={commitRename}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "0.4rem 0.9rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
      <RelatedSeoLinks />
      </div>
  );

  // When embedded inside a modal (e.g. K-Map circuit experiment), skip the
  // page shell — just return the raw circuit tool.
  if (embedded) return circuitTool;

  // Standalone routed page — full shell with Navbar and Footer.
  return (
    <div className={`boolforge-page theme-${theme}`}>
      <div className="grid-background" />
      {navbarVisible && (
        <Navbar
          toggleTheme={toggleTheme}
          theme={theme}
          onToggleNavbar={() => setNavbarVisible(false)}
        />
      )}
      {!navbarVisible && (
        <button
          className="navbar-restore-btn"
          onClick={() => setNavbarVisible(true)}
          aria-label="Show navbar"
          title="Show navbar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
          </svg>
        </button>
      )}
      <main className={`boolforge-main${navbarVisible ? "" : " boolforge-main--fullscreen"}`}>
        {circuitTool}
      </main>
      {footerVisible && (
        <Footer onToggleFooter={() => setFooterVisible(false)} />
      )}
      {!footerVisible && (
        <button
          className="footer-restore-btn"
          onClick={() => setFooterVisible(true)}
          aria-label="Show footer"
          title="Show footer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="15" x2="21" y2="15" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Boolforge;


