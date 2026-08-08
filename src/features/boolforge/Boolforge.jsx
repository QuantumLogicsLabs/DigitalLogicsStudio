import React, { useState, useRef, useEffect, useCallback } from "react";
import { gateSymbols, IC_META, IC_TYPES } from "../../shared/data/gates";
import { TruthTableGenerator } from "./components/TruthTable";
import { SaveAndLoad } from "./components/SaveAndLoad";
import { parseExpressionToCircuit } from "../../shared/utils/expressionParser";
import RelatedSeoLinks from "../../shared/seo/RelatedSeoLinks";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { useTheme } from "../../shared/context/ThemeContext";
import { getCircuitHint } from "../../shared/services/circuitMindService";
import { generateAiCircuit } from "../../shared/services/aiService";
import "./Boolforge.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_GATE_INPUTS = 8;
const MIN_GATE_INPUTS = 2;
const MULTI_INPUT_GATES = new Set(["AND", "OR", "NAND", "NOR", "XOR", "XNOR"]);
const SINGLE_INPUT_GATES = new Set(["NOT", "BUFFER", "OUTPUT"]);
const GRID_SIZE = 20;
const SNAP_TO_GRID = true;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function defaultInputCount(type) {
  if (type === "INPUT") return 0;
  if (SINGLE_INPUT_GATES.has(type)) return 1;
  if (IC_TYPES.has(type)) return IC_META[type].inputs;
  return 2;
}

const IC_HEIGHTS = {
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

function getICHeight(type) {
  return IC_HEIGHTS[type] ?? 100;
}

function getInputY(gate, inputIndex) {
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

function getOutputY(gate, outputIndex) {
  if (!IC_TYPES.has(gate.type)) return gate.y + 50;
  const n = IC_META[gate.type].outputs;
  const h = getICHeight(gate.type);
  if (n === 1) return gate.y + h / 2;
  return gate.y + (10 / 100) * h + (outputIndex / (n - 1)) * (0.8 * h);
}

// ─── Component ────────────────────────────────────────────────────────────────
const Boolforge = ({
  simplifiedExpression = null,
  variables = [],
  onCircuitChange,
  portNames = null,
  embedded = false,
  initialGates = null,
  initialWires = null,
}) => {
  const { theme, toggle: toggleTheme } = useTheme();

  // ── UI & Canvas state ──────────────────────────────────────────────────────
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  const [selectionToolActive, setSelectionToolActive] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const [selectionStartIds, setSelectionStartIds] = useState([]);

  // ── Gate & Wire state ──────────────────────────────────────────────────────
  const [gates, setGates] = useState([]);
  const [wires, setWires] = useState([]);
  const [selectedGate, setSelectedGate] = useState(null);
  const [selectedGateIds, setSelectedGateIds] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [gateIdCounter, setGateIdCounter] = useState(0);
  const [wireIdCounter, setWireIdCounter] = useState(0);
  const [inputCounter, setInputCounter] = useState(0);
  const [outputCounter, setOutputCounter] = useState(0);
  const [dragStartPositions, setDragStartPositions] = useState({});
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });

  // ── Rename & AI state ──────────────────────────────────────────────────────
  const [renamingGate, setRenamingGate] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState("");
  const [isGenLoading, setIsGenLoading] = useState(false);

  // ── History ────────────────────────────────────────────────────────────────
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const hasMovedRef = useRef(false);
  const wasCtrlClickRef = useRef(false);
  const copiedDataRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gateStateRef = useRef(new Map());
  const touchStateRef = useRef({ type: null, id: null, startX: 0, startY: 0 });
  const hasAutoBuilt = useRef(false);
  const lastSyncKeyRef = useRef(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const gateMap = React.useMemo(() => {
    const map = new Map();
    gates.forEach((g) => map.set(g.id, g));
    return map;
  }, [gates]);

  const inputGates = React.useMemo(
    () => gates.filter((g) => g.type === "INPUT"),
    [gates],
  );
  const outputGates = React.useMemo(
    () => gates.filter((g) => g.type === "OUTPUT"),
    [gates],
  );

  // ── Label helpers (stable references) ──────────────────────────────────────
  const generateInputLabel = useCallback(
    (index) => portNames?.inputs?.[index] ?? `I${index}`,
    [portNames],
  );
  const generateOutputLabel = useCallback(
    (index) => portNames?.outputs?.[index] ?? `S${index}`,
    [portNames],
  );

  // ── Gate logic ─────────────────────────────────────────────────────────────
  const computeGateOutput = (gate, inputs, outputIndex = 0) => {
    const ci = inputs.filter((v) => v !== undefined);
    switch (gate.type) {
      case "INPUT":
        return gate.inputValues[0] || false;
      case "AND": {
        const n = gate.inputs || 2;
        let allHigh = true;
        for (let i = 0; i < n; i++)
          if (!(inputs[i] ?? false)) {
            allHigh = false;
            break;
          }
        return allHigh;
      }
      case "OR":
        return ci.some(Boolean);
      case "NOT":
        return inputs[0] !== undefined ? !inputs[0] : false;
      case "NAND": {
        const n = gate.inputs || 2;
        let allHigh = true;
        for (let i = 0; i < n; i++)
          if (!(inputs[i] ?? false)) {
            allHigh = false;
            break;
          }
        return !allHigh;
      }
      case "NOR":
        return !ci.some(Boolean);
      case "XOR":
        return ci.length >= 2 && ci.reduce((acc, v) => acc !== v, false);
      case "XNOR":
        return ci.length >= 2 && !ci.reduce((acc, v) => acc !== v, false);
      case "BUFFER":
      case "OUTPUT":
        return inputs[0] ?? false;
      case "MUX2": {
        const s = inputs[2] ?? false;
        return s ? (inputs[1] ?? false) : (inputs[0] ?? false);
      }
      case "MUX4": {
        const s0 = inputs[4] ?? false,
          s1 = inputs[5] ?? false;
        const sel = (s1 ? 2 : 0) + (s0 ? 1 : 0);
        return inputs[sel] ?? false;
      }
      case "MUX8": {
        const s0 = inputs[8] ?? false,
          s1 = inputs[9] ?? false,
          s2 = inputs[10] ?? false;
        const sel = (s2 ? 4 : 0) + (s1 ? 2 : 0) + (s0 ? 1 : 0);
        return inputs[sel] ?? false;
      }
      case "DEMUX2": {
        const d = inputs[0] ?? false,
          s = inputs[1] ?? false;
        if (outputIndex === 0) return !s && d;
        if (outputIndex === 1) return s && d;
        return false;
      }
      case "DEMUX4": {
        const d = inputs[0] ?? false,
          s0 = inputs[1] ?? false,
          s1 = inputs[2] ?? false;
        const sel = (s1 ? 2 : 0) + (s0 ? 1 : 0);
        return sel === outputIndex && d;
      }
      case "DEMUX8": {
        const d = inputs[0] ?? false,
          s0 = inputs[1] ?? false,
          s1 = inputs[2] ?? false,
          s2 = inputs[3] ?? false;
        const sel = (s2 ? 4 : 0) + (s1 ? 2 : 0) + (s0 ? 1 : 0);
        return sel === outputIndex && d;
      }
      case "ENC4": {
        let code = 0;
        for (let i = 3; i >= 0; i--) {
          if (inputs[i]) {
            code = i;
            break;
          }
        }
        return outputIndex === 0 ? Boolean(code & 2) : Boolean(code & 1);
      }
      case "ENC8": {
        let code = 0;
        for (let i = 7; i >= 0; i--) {
          if (inputs[i]) {
            code = i;
            break;
          }
        }
        return outputIndex === 0
          ? Boolean(code & 4)
          : outputIndex === 1
            ? Boolean(code & 2)
            : Boolean(code & 1);
      }
      case "DEC4": {
        const sel = ((inputs[1] ?? false) ? 2 : 0) + ((inputs[0] ?? false) ? 1 : 0);
        return sel === outputIndex;
      }
      case "DEC8": {
        const sel =
          ((inputs[2] ?? false) ? 4 : 0) +
          ((inputs[1] ?? false) ? 2 : 0) +
          ((inputs[0] ?? false) ? 1 : 0);
        return sel === outputIndex;
      }
      case "HALF_ADDER": {
        const a = inputs[0] ?? false,
          b = inputs[1] ?? false;
        return outputIndex === 0 ? a !== b : a && b;
      }
      case "FULL_ADDER": {
        const a = inputs[0] ?? false,
          b = inputs[1] ?? false,
          cin = inputs[2] ?? false;
        const sum = (a !== b) !== cin;
        const cout = (a && b) || (cin && a !== b);
        return outputIndex === 0 ? sum : cout;
      }
      case "ADD4": {
        const a = [inputs[0], inputs[1], inputs[2], inputs[3]].map((v) => v ?? false);
        const b = [inputs[4], inputs[5], inputs[6], inputs[7]].map((v) => v ?? false);
        let carry = inputs[8] ?? false;
        const sums = [];
        for (let i = 0; i < 4; i++) {
          const xor_ab = a[i] !== b[i];
          sums[i] = xor_ab !== carry;
          carry = (a[i] && b[i]) || (carry && xor_ab);
        }
        return outputIndex === 4 ? carry : sums[outputIndex];
      }
      case "CLADD4": {
        const a = [inputs[0], inputs[1], inputs[2], inputs[3]].map((v) => v ?? false);
        const b = [inputs[4], inputs[5], inputs[6], inputs[7]].map((v) => v ?? false);
        const cin = inputs[8] ?? false;
        const g = a.map((ai, i) => ai && b[i]);
        const p = a.map((ai, i) => ai !== b[i]);
        const c = [cin];
        for (let i = 0; i < 4; i++) c[i + 1] = g[i] || (p[i] && c[i]);
        const sums = p.map((pi, i) => pi !== c[i]);
        return outputIndex === 4 ? c[4] : sums[outputIndex];
      }
      case "HALF_SUBTRACTOR": {
        const a = inputs[0] ?? false,
          b = inputs[1] ?? false;
        return outputIndex === 0 ? a !== b : !a && b;
      }
      case "FULL_SUBTRACTOR": {
        const a = inputs[0] ?? false,
          b = inputs[1] ?? false,
          bin = inputs[2] ?? false;
        const diff = (a !== b) !== bin;
        const bout = (!a && b) || (!a && bin) || (b && bin);
        return outputIndex === 0 ? diff : bout;
      }
      default:
        return false;
    }
  };

  // ── Simulation ─────────────────────────────────────────────────────────────
  const gateValues = React.useMemo(() => {
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
          if (prev.get(gate.id) !== v) {
            next.set(gate.id, v);
            changed = true;
          }
          continue;
        }
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
            computeGateOutput(gate, inputs, i),
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
  }, [gates, wires, gateMap]);

  const evaluateGate = useCallback(
    (gate, outputIndex = 0) => {
      if (!gate) return false;
      const val = gateValues.get(gate.id);
      if (Array.isArray(val)) return val[outputIndex] ?? false;
      return val ?? false;
    },
    [gateValues],
  );

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

  // ── Gate CRUD ──────────────────────────────────────────────────────────────
  const snapToGrid = useCallback(
    (value) => (SNAP_TO_GRID ? Math.round(value / GRID_SIZE) * GRID_SIZE : value),
    [],
  );

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
      if (
        !window.confirm(
          `Are you sure you want to delete the ${targets.length} selected component(s)?`,
        )
      )
        return;

      setGates((prev) => prev.filter((g) => !targets.includes(g.id)));
      setWires((prev) =>
        prev.filter((w) => !targets.includes(w.fromId) && !targets.includes(w.toId)),
      );

      let inputDec = 0,
        outputDec = 0;
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
    } else if (isIC) label = type;

    const container = containerRef.current;
    const canvasW = container ? container.clientWidth : 600;
    const GATE_STEP_X = 160;
    const GATE_STEP_Y = isIC ? getICHeight(type) + 40 : 120;
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

  const addInputSlot = useCallback(
    (e, gate) => {
      e.stopPropagation();
      if (!MULTI_INPUT_GATES.has(gate.type) || gate.inputs >= MAX_GATE_INPUTS) return;
      setGates((prev) =>
        prev.map((g) => (g.id === gate.id ? { ...g, inputs: g.inputs + 1 } : g)),
      );
      saveToHistory();
    },
    [saveToHistory],
  );

  const removeInputSlot = useCallback(
    (e, gate) => {
      e.stopPropagation();
      if (!MULTI_INPUT_GATES.has(gate.type) || gate.inputs <= MIN_GATE_INPUTS) return;
      const lastIdx = gate.inputs - 1;
      setWires((prev) =>
        prev.filter((w) => !(w.toId === gate.id && w.toIndex === lastIdx)),
      );
      setGates((prev) =>
        prev.map((g) => (g.id === gate.id ? { ...g, inputs: g.inputs - 1 } : g)),
      );
      saveToHistory();
    },
    [saveToHistory],
  );

  // ── Gate rename ────────────────────────────────────────────────────────────
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
        prev.map((g) => (g.id === renamingGate.id ? { ...g, label: trimmed } : g)),
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

  // ── Toggle input ───────────────────────────────────────────────────────────
  const toggleInput = (gate) => {
    setGates((prev) =>
      prev.map((g) =>
        g.id === gate.id ? { ...g, inputValues: [!g.inputValues[0]] } : g,
      ),
    );
  };

  // ── Drag (single & group) ─────────────────────────────────────────────────
  const startDrag = (e, gate) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setIsPanning(false);

    const isCtrl = e.ctrlKey || e.metaKey;
    let nextSelection = [...selectedGateIds];
    if (isCtrl) {
      if (selectedGateIds.includes(gate.id))
        nextSelection = nextSelection.filter((id) => id !== gate.id);
      else nextSelection.push(gate.id);
    } else {
      if (!selectedGateIds.includes(gate.id)) nextSelection = [gate.id];
    }
    setSelectedGateIds(nextSelection);
    setSelectedGate(gate);
    wasCtrlClickRef.current = isCtrl;
    hasMovedRef.current = false;

    const startPositions = {};
    gates.forEach((g) => {
      if (nextSelection.includes(g.id)) startPositions[g.id] = { x: g.x, y: g.y };
    });
    setDragStartPositions(startPositions);

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoom;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoom;
    setDragStartMouse({ x: mouseX, y: mouseY });
    setDragging(true);
  };

  const onDrag = (e) => {
    if (!dragging || selectedGateIds.length === 0 || isPanning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoom;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoom;
    const dx = mouseX - dragStartMouse.x;
    const dy = mouseY - dragStartMouse.y;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMovedRef.current = true;

    setGates((prev) =>
      prev.map((g) => {
        if (selectedGateIds.includes(g.id)) {
          const startPos = dragStartPositions[g.id];
          if (startPos) {
            return {
              ...g,
              x: snapToGrid(startPos.x + dx),
              y: snapToGrid(startPos.y + dy),
            };
          }
        }
        return g;
      }),
    );
  };

  const stopDrag = () => {
    if (dragging) {
      setDragging(false);
      if (!hasMovedRef.current && selectedGate && !wasCtrlClickRef.current) {
        setSelectedGateIds([selectedGate.id]);
      }
      saveToHistory();
    }
  };

  // ── Wire connections ──────────────────────────────────────────────────────
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
    const filteredWires = wires.filter(
      (w) => !(w.toId === toGate.id && w.toIndex === toIndex),
    );
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

  // ── Wire hit‑test & delete (right‑click on canvas) ────────────────────────
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

      const dx = toX - fromX,
        dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const controlDistance = Math.min(Math.abs(dx) / 2, distance / 3);
      const cp1x = fromX + controlDistance,
        cp1y = fromY;
      const cp2x = toX - controlDistance,
        cp2y = toY;

      const SAMPLES = 60,
        HIT_RADIUS = 8;
      for (let i = 0; i <= SAMPLES; i++) {
        const t = i / SAMPLES,
          mt = 1 - t;
        const bx =
          mt ** 3 * fromX +
          3 * mt ** 2 * t * cp1x +
          3 * mt * t ** 2 * cp2x +
          t ** 3 * toX;
        const by =
          mt ** 3 * fromY +
          3 * mt ** 2 * t * cp1y +
          3 * mt * t ** 2 * cp2y +
          t ** 3 * toY;
        if (Math.sqrt((bx - x) ** 2 + (by - y) ** 2) < HIT_RADIUS) {
          e.preventDefault();
          setWires((prev) => prev.filter((w) => w.id !== wire.id));
          saveToHistory();
          return;
        }
      }
    }
    e.preventDefault();
  };

  // ── Canvas events (pan, select, zoom) ──────────────────────────────────────
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const startX = (e.clientX - rect.left - panOffset.x) / zoom;
      const startY = (e.clientY - rect.top - panOffset.y) / zoom;
      const isCtrl = e.ctrlKey || e.metaKey;
      const isMiddleClick = e.button === 1;

      if (spacePressed || isMiddleClick) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      } else if (e.button === 0) {
        if (!selectionToolActive && !e.shiftKey) {
          setIsPanning(true);
          setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        } else {
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

      const intersectingIds = gates
        .filter((g) => {
          const gH = IC_TYPES.has(g.type) ? getICHeight(g.type) : 100;
          const gateBox = { x1: g.x, y1: g.y, x2: g.x + 120, y2: g.y + gH };
          return (
            gateBox.x1 < box.x2 &&
            gateBox.x2 > box.x1 &&
            gateBox.y1 < box.y2 &&
            gateBox.y2 > box.y1
          );
        })
        .map((g) => g.id);

      if (e.ctrlKey || e.metaKey) {
        setSelectedGateIds(
          Array.from(new Set([...selectionStartIds, ...intersectingIds])),
        );
      } else {
        setSelectedGateIds(intersectingIds);
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsSelecting(false);
  };

  // ── Touch support ──────────────────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      const gateEl = touch.target.closest?.(".gate");
      if (gateEl) {
        const gateId = parseInt(gateEl.dataset.gateId, 10);
        const gate = gates.find((g) => g.id === gateId);
        if (gate) {
          e.preventDefault();
          let nextSelection = [...selectedGateIds];
          if (!selectedGateIds.includes(gate.id)) nextSelection = [gate.id];
          setSelectedGateIds(nextSelection);
          setSelectedGate(gate);

          const startPositions = {};
          gates.forEach((g) => {
            if (nextSelection.includes(g.id)) startPositions[g.id] = { x: g.x, y: g.y };
          });
          setDragStartPositions(startPositions);

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
          return;
        }
      }
      if (touch.target === canvas || touch.target.classList.contains("gates-container")) {
        e.preventDefault();
        touchStateRef.current = { type: "pan", id: null, startX: 0, startY: 0 };
        setIsPanning(true);
        setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
      }
    },
    [gates, zoom, panOffset, selectedGateIds],
  );

  const handleTouchMove = useCallback(
    (e) => {
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
                return {
                  ...g,
                  x: snapToGrid(startPos.x + dx),
                  y: snapToGrid(startPos.y + dy),
                };
              }
            }
            return g;
          }),
        );
      }
    },
    [
      panStart,
      zoom,
      panOffset,
      snapToGrid,
      selectedGateIds,
      dragStartMouse,
      dragStartPositions,
    ],
  );

  const handleTouchEnd = useCallback(() => {
    if (touchStateRef.current.type === "drag" && dragging) {
      setDragging(false);
      saveToHistory();
    }
    if (touchStateRef.current.type === "pan") setIsPanning(false);
    touchStateRef.current = { type: null, id: null, startX: 0, startY: 0 };
  }, [dragging, saveToHistory]);

  // ── Fit to view ────────────────────────────────────────────────────────────
  const fitToView = useCallback(() => {
    const container = containerRef.current;
    if (!container || gates.length === 0) return;
    const GATE_W = 130,
      GATE_H = 100,
      PADDING = 40;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
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

  // ── Copy / Paste / Duplicate ───────────────────────────────────────────────
  const copySelectedGates = useCallback(() => {
    if (selectedGateIds.length === 0) return;
    copiedDataRef.current = {
      gates: JSON.parse(
        JSON.stringify(gates.filter((g) => selectedGateIds.includes(g.id))),
      ),
      wires: JSON.parse(
        JSON.stringify(
          wires.filter(
            (w) => selectedGateIds.includes(w.fromId) && selectedGateIds.includes(w.toId),
          ),
        ),
      ),
    };
  }, [selectedGateIds, gates, wires]);

  const pasteGates = useCallback(() => {
    if (!copiedDataRef.current) return;
    const { gates: copiedGates, wires: copiedWires } = copiedDataRef.current;
    if (copiedGates.length === 0) return;

    const idMap = {};
    let currentGateId = gateIdCounter,
      currentWireId = wireIdCounter;
    let newInputCounter = inputCounter,
      newOutputCounter = outputCounter;

    const pastedGates = copiedGates.map((g) => {
      const newId = currentGateId++;
      idMap[g.id] = newId;
      let newLabel = g.label;
      if (g.type === "INPUT") newLabel = generateInputLabel(newInputCounter++);
      else if (g.type === "OUTPUT") newLabel = generateOutputLabel(newOutputCounter++);
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
    setSelectedGateIds(pastedGates.map((g) => g.id));
    saveToHistory();
  }, [
    gateIdCounter,
    wireIdCounter,
    inputCounter,
    outputCounter,
    saveToHistory,
    generateInputLabel,
    generateOutputLabel,
  ]);

  const duplicateSelectedGates = useCallback(() => {
    if (selectedGateIds.length === 0) return;
    const selectedGatesList = gates.filter((g) => selectedGateIds.includes(g.id));
    const selectedWiresList = wires.filter(
      (w) => selectedGateIds.includes(w.fromId) && selectedGateIds.includes(w.toId),
    );

    const idMap = {};
    let currentGateId = gateIdCounter,
      currentWireId = wireIdCounter;
    let newInputCounter = inputCounter,
      newOutputCounter = outputCounter;

    const duplicatedGates = selectedGatesList.map((g) => {
      const newId = currentGateId++;
      idMap[g.id] = newId;
      let newLabel = g.label;
      if (g.type === "INPUT") newLabel = generateInputLabel(newInputCounter++);
      else if (g.type === "OUTPUT") newLabel = generateOutputLabel(newOutputCounter++);
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
    setSelectedGateIds(duplicatedGates.map((g) => g.id));
    saveToHistory();
  }, [
    selectedGateIds,
    gates,
    wires,
    gateIdCounter,
    wireIdCounter,
    inputCounter,
    outputCounter,
    saveToHistory,
    generateInputLabel,
    generateOutputLabel,
  ]);

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

  // ── Truth table / expression helpers ───────────────────────────────────────
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
        if (g.type === "INPUT") prev.set(g.id, g.inputValues[0] || false);
        else if (IC_TYPES.has(g.type))
          prev.set(g.id, Array(IC_META[g.type].outputs).fill(false));
        else prev.set(g.id, false);
      });

      for (let iter = 0; iter < 100; iter++) {
        const next = new Map(prev);
        let changed = false;
        for (const g of gatesArray) {
          if (g.type === "INPUT") continue;
          const inputs = [];
          for (const w of incomingWires.get(g.id) || []) {
            const srcVal = prev.get(w.fromId);
            if (IC_TYPES.has(localGateMap.get(w.fromId)?.type) && Array.isArray(srcVal))
              inputs[w.toIndex] = srcVal[w.fromOutputIndex ?? 0] ?? false;
            else inputs[w.toIndex] = srcVal ?? false;
          }
          if (IC_TYPES.has(g.type)) {
            const numOut = IC_META[g.type].outputs;
            const newVals = Array.from({ length: numOut }, (_, i) =>
              computeGateOutput(g, inputs, i),
            );
            const oldVals = prev.get(g.id);
            if (!Array.isArray(oldVals) || newVals.some((v, i) => v !== oldVals[i])) {
              next.set(g.id, newVals);
              changed = true;
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

  const deriveExpression = useCallback(
    (gate, gatesArray, depth = 0, visited = new Set()) => {
      if (!gate || depth > 20 || visited.has(gate.id)) return "?";
      const newVisited = new Set(visited);
      newVisited.add(gate.id);
      if (gate.type === "INPUT") return gate.label;

      const incomingForGate = wires.filter((w) => w.toId === gate.id);
      const slotExprs = {};
      incomingForGate.forEach((w) => {
        const src = gatesArray.find((g) => g.id === w.fromId);
        slotExprs[w.toIndex] = deriveExpression(src, gatesArray, depth + 1, newVisited);
      });
      const slots = Object.keys(slotExprs)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => slotExprs[k]);
      if (slots.length === 0) return gate.label || gate.type;

      const wrap = (expr) =>
        expr.includes("+") || expr.includes("⊕") ? `(${expr})` : expr;
      switch (gate.type) {
        case "OUTPUT":
        case "BUFFER":
          return slots[0];
        case "NOT":
          return `${wrap(slots[0])}'`;
        case "AND":
          return slots.map(wrap).join(".");
        case "NAND":
          return `(${slots.map(wrap).join(".")})'`;
        case "OR":
          return slots.join("+");
        case "NOR":
          return `(${slots.join("+")})'`;
        case "XOR":
          return slots.join("⊕");
        case "XNOR":
          return `(${slots.join("⊕")})'`;
        default:
          return `${gate.type}(${slots.join(",")})`;
      }
    },
    [wires],
  );

  const generateTruthTable = useCallback(() => {
    const inputs = gates.filter((g) => g.type === "INPUT");
    const outputs = gates.filter((g) => g.type === "OUTPUT");
    if (inputs.length === 0 || outputs.length === 0) return { headers: [], rows: [] };

    const intermediates = gates
      .filter((g) => g.type !== "INPUT" && g.type !== "OUTPUT")
      .sort((a, b) => a.x - b.x);
    const visibleIntermediates = intermediates.filter((g) => {
      const outgoingWires = wires.filter((w) => w.fromId === g.id);
      return (
        outgoingWires.length > 0 &&
        outgoingWires.some((w) => !outputs.some((o) => o.id === w.toId))
      );
    });

    const rawLabels = visibleIntermediates.map((g) => g.label || g.type);
    const labelCount = {};
    rawLabels.forEach((l) => {
      labelCount[l] = (labelCount[l] || 0) + 1;
    });
    const labelSeen = {};
    const getIntermediateLabel = (gate) => {
      const base = gate.label || gate.type;
      if (labelCount[base] > 1) {
        labelSeen[base] = (labelSeen[base] || 0) + 1;
        return `${base}${labelSeen[base]}`;
      }
      return base;
    };

    const numCombinations = 1 << inputs.length;
    const rows = [];
    for (let i = 0; i < numCombinations; i++) {
      const inputValues = inputs.map((_, idx) =>
        Boolean((i >> (inputs.length - 1 - idx)) & 1),
      );
      const tempGates = gates.map((g) => {
        if (g.type === "INPUT") {
          const index = inputs.findIndex((inp) => inp.id === g.id);
          return { ...g, inputValues: [inputValues[index]] };
        }
        return g;
      });

      const intermediateValues = visibleIntermediates.map((intGate) => {
        const gate = tempGates.find((g) => g.id === intGate.id);
        if (IC_TYPES.has(intGate.type)) {
          const numOut = IC_META[intGate.type].outputs;
          return Array.from({ length: numOut }, (_, oi) =>
            evaluateGateWithGates(gate, tempGates, oi) ? 1 : 0,
          ).join("/");
        }
        return evaluateGateWithGates(gate, tempGates) ? 1 : 0;
      });

      const outputValues = outputs.map((outGate) => {
        const gate = tempGates.find((g) => g.id === outGate.id);
        return evaluateGateWithGates(gate, tempGates) ? 1 : 0;
      });

      rows.push([
        ...inputValues.map((v) => (v ? 1 : 0)),
        ...intermediateValues,
        ...outputValues,
      ]);
    }

    return {
      headers: [
        ...inputs.map((g) => g.label),
        ...visibleIntermediates.map(getIntermediateLabel),
        ...outputs.map((g) => {
          const expr = deriveExpression(g, gates);
          return expr && expr !== g.label ? `${g.label}=${expr}` : g.label;
        }),
      ],
      rows,
    };
  }, [gates, wires, evaluateGateWithGates, deriveExpression]);

  const truthTable = React.useMemo(() => generateTruthTable(), [generateTruthTable]);

  // ── AI integration (CircuitMind) ───────────────────────────────────────────
  const isCircuitComplete =
    gates.length > 0 &&
    wires.length > 0 &&
    inputGates.length > 0 &&
    outputGates.length > 0;

  const applyGeneratedCircuit = useCallback(
    (data) => {
      if (!data || !Array.isArray(data.gates) || data.gates.length === 0) {
        alert("AI generated no gates. Try describing the circuit differently.");
        return false;
      }
      const rawGates = data.gates;
      const rawWires = data.wires || [];
      const genInputNodes = rawGates.filter(
        (g) =>
          (g.type || "").toUpperCase() === "INPUT" ||
          (g.label && g.label.toLowerCase().includes("input")),
      );
      const genOutputNodes = rawGates.filter(
        (g) =>
          (g.type || "").toUpperCase() === "OUTPUT" ||
          (g.label &&
            (g.label.toLowerCase().includes("output") ||
              g.label.toLowerCase().includes("sum") ||
              g.label.toLowerCase().includes("carry"))),
      );
      const genLogicNodes = rawGates.filter(
        (g) => !genInputNodes.includes(g) && !genOutputNodes.includes(g),
      );

      const finalInputs = genInputNodes.map((g, i) => ({
        id: g.id ?? i,
        type: "INPUT",
        x: g.x ?? 80,
        y: g.y ?? 80 + i * 100,
        label: g.label || `A${i + 1}`,
        inputs: 0,
        hasOutput: true,
        inputValues: [false],
      }));
      const finalOutputs = genOutputNodes.map((g, i) => ({
        id: g.id ?? 100 + i,
        type: "OUTPUT",
        x: g.x ?? 750,
        y: g.y ?? 80 + i * 100,
        label: g.label || `Y${i + 1}`,
        inputs: 1,
        hasOutput: false,
        inputValues: [],
      }));
      const formattedLogic = genLogicNodes.map((g, idx) => {
        const typeUpper = (g.type || "AND").toUpperCase();
        let numInputs = g.inputs;
        if (
          numInputs === undefined ||
          numInputs === null ||
          (numInputs === 1 && !["NOT", "BUFFER"].includes(typeUpper))
        ) {
          numInputs = ["NOT", "BUFFER"].includes(typeUpper) ? 1 : 2;
        }
        return {
          id: g.id ?? 200 + idx,
          type: typeUpper,
          x: g.x ?? 300 + idx * 160,
          y: g.y ?? 100 + (idx % 2) * 80,
          label: g.label || typeUpper,
          inputs: numInputs,
          hasOutput: true,
          inputValues: [],
        };
      });

      const finalGates = [...finalInputs, ...formattedLogic, ...finalOutputs];
      const maxGateId = Math.max(...finalGates.map((g) => Number(g.id) || 0), 0) + 1;
      const maxWireId = Math.max(...rawWires.map((w) => Number(w.id) || 0), 0) + 1;

      setGates(finalGates);
      setWires(rawWires);
      setGateIdCounter(maxGateId);
      setWireIdCounter(maxWireId);
      setInputCounter(finalInputs.length);
      setOutputCounter(finalOutputs.length);
      setTimeout(() => saveToHistory(), 0);
      return true;
    },
    [saveToHistory],
  );

  const runAiGenerate = useCallback(
    async (description, sendCurrentCircuit) => {
      if (isGenLoading) return;
      setIsGenLoading(true);
      try {
        const res = await generateAiCircuit({
          problem_title: description || "Custom circuit",
          problem_description: description || "",
          prompt: description ? `make a ${description} circuit` : "make a logic circuit",
          inputs: inputGates.map((g) => g.label),
          outputs: outputGates.map((g) => g.label),
          truthTable: [],
          ...(sendCurrentCircuit ? { circuit: { gates, wires } } : {}),
        });
        const data = res?.data || res;
        applyGeneratedCircuit(data);
      } catch (error) {
        alert(
          error.message || "Could not generate circuit. Make sure backend is running.",
        );
      } finally {
        setIsGenLoading(false);
      }
    },
    [isGenLoading, inputGates, outputGates, gates, wires, applyGeneratedCircuit],
  );

  const handleGenerateCircuit = useCallback(() => {
    if (isGenLoading) return;
    if (isCircuitComplete) {
      // Circuit is complete – send current circuit along with the prompt
      runAiGenerate(aiPrompt, true);
    } else {
      // Circuit is incomplete – use the prompt only to generate from scratch
      if (!aiPrompt.trim()) return;
      runAiGenerate(aiPrompt, false);
    }
  }, [isGenLoading, isCircuitComplete, aiPrompt, runAiGenerate]);

  const handleRequestHint = useCallback(async () => {
    if (hintLoading) return;
    setHintLoading(true);
    setHintError("");
    try {
      const problemContext = {
        title: aiPrompt || "Custom circuit",
        description: aiPrompt || "",
        inputs: inputGates.map((g) => g.label),
        outputs: outputGates.map((g) => g.label),
        truthTable: [],
      };
      const data = await getCircuitHint({
        problem: problemContext,
        gates,
        wires,
        result: null,
      });
      setHint(data.hint);
    } catch (error) {
      setHint(null);
      setHintError(error.message || "Couldn't get a hint right now.");
    } finally {
      setHintLoading(false);
    }
  }, [hintLoading, aiPrompt, inputGates, outputGates, gates, wires]);

  // ── Effects ────────────────────────────────────────────────────────────────
  // Auto‑build from simplified expression
  useEffect(() => {
    if (simplifiedExpression && variables.length > 0 && !hasAutoBuilt.current) {
      const circuit = parseExpressionToCircuit(simplifiedExpression, variables);
      if (circuit.gates && circuit.gates.length > 0) {
        setGates(circuit.gates);
        setWires(circuit.wires);
        setGateIdCounter(circuit.gateIdCounter || circuit.gates.length);
        setWireIdCounter(circuit.wireIdCounter || circuit.wires.length);
        const inputCount = circuit.gates.filter((g) => g.type === "INPUT").length;
        const outputCount = circuit.gates.filter((g) => g.type === "OUTPUT").length;
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

  // Sync with parent props (initialGates/initialWires)
  useEffect(() => {
    if (Array.isArray(initialGates) && initialGates.length > 0) {
      const key = JSON.stringify({ g: initialGates, w: initialWires || [] });
      if (lastSyncKeyRef.current === key) return;
      lastSyncKeyRef.current = key;
      setGates(initialGates);
      setWires(Array.isArray(initialWires) ? initialWires : []);
      const maxGateId = Math.max(...initialGates.map((g) => Number(g.id) || 0), 0) + 1;
      const maxWireId =
        Math.max(...(initialWires || []).map((w) => Number(w.id) || 0), 0) + 1;
      setGateIdCounter(maxGateId);
      setWireIdCounter(maxWireId);
    }
  }, [initialGates, initialWires]);

  // Notify parent of circuit changes
  useEffect(() => {
    if (typeof onCircuitChange === "function") {
      lastSyncKeyRef.current = JSON.stringify({ g: gates, w: wires });
      onCircuitChange(gates, wires);
    }
  }, [gates, wires, onCircuitChange]);

  // Draw wires whenever relevant state changes
  const drawWires = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    wires.forEach((wire) => {
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
      const dx = toX - fromX,
        dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const controlDistance = Math.min(Math.abs(dx) / 2, distance / 3);
      ctx.bezierCurveTo(
        fromX + controlDistance,
        fromY,
        toX - controlDistance,
        toY,
        toX,
        toY,
      );
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    ctx.restore();
  }, [wires, gateMap, evaluateGate, zoom, panOffset]);

  useEffect(() => {
    drawWires();
  }, [drawWires]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    let resizeTimeout;
    const resizeCanvas = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const w = container.clientWidth,
          h = container.clientHeight;
        if (w > 0 && h > 0) {
          canvas.width = w;
          canvas.height = h;
          drawWires();
        }
      }, 100);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
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

  // Keyboard: space for panning
  useEffect(() => {
    const down = (e) => {
      if (
        e.key === " " &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      )
        setSpacePressed(true);
    };
    const up = (e) => {
      if (e.key === " ") setSpacePressed(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Keyboard shortcuts (undo, copy, etc.)
  useEffect(() => {
    const handler = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;
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
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    undo,
    redo,
    gates,
    selectedGateIds,
    deleteGate,
    copySelectedGates,
    pasteGates,
    duplicateSelectedGates,
  ]);

  // Mouse wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const wheelHandler = (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left,
        mouseY = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
      const ratio = newZoom / zoom;
      setZoom(newZoom);
      setPanOffset({
        x: mouseX - (mouseX - panOffset.x) * ratio,
        y: mouseY - (mouseY - panOffset.y) * ratio,
      });
    };
    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [zoom, panOffset]);

  // Touch listeners
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

  // ── Render ─────────────────────────────────────────────────────────────────
  const circuitTool = (
    <div
      className="container circuit-maker"
      onMouseMove={(e) => {
        if (isPanning || isSelecting) handleMouseMove(e);
        else onDrag(e);
      }}
      onMouseUp={() => {
        stopDrag();
        handleMouseUp();
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          if (isPanning) handleMouseMove(t);
          else onDrag(t);
        }
      }}
      onTouchEnd={() => {
        stopDrag();
        handleMouseUp();
      }}
    >
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Circuit Forge</h2>
        <button
          onClick={() => setSelectionToolActive((v) => !v)}
          className={`toggle-selection-btn${selectionToolActive ? " active" : ""}`}
        >
          <span className="icon">{selectionToolActive ? "✦" : "⬚"}</span>
          {selectionToolActive ? "Selection ON" : "Selection OFF"}
        </button>

        {simplifiedExpression && (
          <div className="simplified-expression-display">
            <h3>📐 K-Map Simplified Expression</h3>
            <div className="expression-content">{simplifiedExpression}</div>
            <p className="expression-hint">Circuit auto-generated below! ✨</p>
          </div>
        )}

        {/* Palettes */}
        <div className="palette-section">
          <div className="palette-section-title">Logic Gates</div>
          <div className="gate-palette">
            {[
              "INPUT",
              "OUTPUT",
              "AND",
              "OR",
              "NOT",
              "NAND",
              "NOR",
              "XOR",
              "XNOR",
              "BUFFER",
            ].map((type) => (
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
              { type: "MUX2", label: "MUX 2:1" },
              { type: "MUX4", label: "MUX 4:1" },
              { type: "MUX8", label: "MUX 8:1" },
            ].map(({ type, label }) => (
              <button
                key={type}
                className="gate-btn gate-btn--ic"
                onClick={() => addGate(type)}
              >
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
              <button
                key={type}
                className="gate-btn gate-btn--ic"
                onClick={() => addGate(type)}
              >
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
              <button
                key={type}
                className="gate-btn gate-btn--ic"
                onClick={() => addGate(type)}
              >
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
              <button
                key={type}
                className="gate-btn gate-btn--ic"
                onClick={() => addGate(type)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="palette-section">
          <div className="palette-section-title">Adders</div>
          <div className="gate-palette">
            {[
              { type: "HALF_ADDER", label: "Half Adder" },
              { type: "FULL_ADDER", label: "Full Adder" },
              { type: "ADD4", label: "4 bit Adder" },
              { type: "CLADD4", label: "Carry LA 4" },
            ].map(({ type, label }) => (
              <button
                key={type}
                className="gate-btn gate-btn--ic"
                onClick={() => addGate(type)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="palette-section">
          <div className="palette-section-title">Subtractors</div>
          <div className="gate-palette">
            {[
              { type: "HALF_SUBTRACTOR", label: "Half Subtractor" },
              { type: "FULL_SUBTRACTOR", label: "Full Subtractor" },
            ].map(({ type, label }) => (
              <button
                key={type}
                className="gate-btn gate-btn--ic"
                onClick={() => addGate(type)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="instructions">
          <p>
            <strong>Controls:</strong>
          </p>
          <p>• Click buttons to add components</p>
          <p>• Drag gates to move them (Group Drag supported!)</p>
          <p>
            • <strong>Drag empty space</strong> to pan the canvas (default)
          </p>
          <p>
            • Enable <strong>⬚ Selection Tool</strong> to box-select components
          </p>
          <p>
            • Hold <strong>Space</strong> or drag with <strong>Middle Button</strong> to
            pan anytime
          </p>
          <p>• Ctrl + Click to add/remove individual gates</p>
          <p>• Click output dot → input dot to wire</p>
          <p>• Right-click wire to delete it</p>
          <p>• Right-click gate to delete (deletes selection)</p>
          <p>• Double-click gate to rename it</p>
          <p>• Scroll to zoom in/out</p>
          <p>
            • Click <strong>+</strong> / <strong>−</strong> to resize inputs
          </p>
          <p>
            <strong>Shortcuts:</strong>
          </p>
          <p>• Ctrl + Z: Undo &nbsp; Ctrl + Shift + Z: Redo</p>
          <p>• Ctrl + A: Select All &nbsp; Ctrl + D: Duplicate</p>
          <p>• Ctrl + C: Copy &nbsp; Ctrl + V: Paste</p>
          <p>• Delete / Backspace: Remove selected</p>
          <p>• Esc: Cancel wire / Clear selection</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          onContextMenu={handleCanvasContextMenu}
          onMouseDown={handleCanvasMouseDown}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              const t = e.touches[0];
              setIsPanning(true);
              setPanStart({ x: t.clientX - panOffset.x, y: t.clientY - panOffset.y });
            }
          }}
          style={{
            cursor: isPanning
              ? "grabbing"
              : spacePressed
                ? "grab"
                : selectionToolActive
                  ? "crosshair"
                  : "grab",
          }}
        />

        <div
          className="gates-container"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
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

                {canExpand && (
                  <div className="gate-input-controls">
                    <button
                      className="gate-input-btn"
                      title={
                        canRemoveInput
                          ? `Remove input (${gate.inputs - 1} inputs)`
                          : `Minimum ${MIN_GATE_INPUTS} inputs`
                      }
                      disabled={!canRemoveInput}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => removeInputSlot(e, gate)}
                    >
                      −
                    </button>
                    <span className="gate-input-count">{gate.inputs}</span>
                    <button
                      className="gate-input-btn"
                      title={
                        canAddInput
                          ? `Add input (${gate.inputs + 1} inputs)`
                          : `Maximum ${MAX_GATE_INPUTS} inputs`
                      }
                      disabled={!canAddInput}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => addInputSlot(e, gate)}
                    >
                      +
                    </button>
                  </div>
                )}

                {/* IC outputs */}
                {isIC &&
                  Array.from({ length: icMeta.outputs }).map((_, outIdx) => {
                    const n = icMeta.outputs,
                      topPct = n === 1 ? 50 : 10 + (outIdx / (n - 1)) * 80;
                    const isConnecting =
                      cfGateId === gate.id && connectingFrom?.outputIndex === outIdx;
                    return (
                      <div
                        key={`out-${outIdx}`}
                        className={`connection-point output-point ic-output-point ${isConnecting ? "active" : ""} ${evaluateGate(gate, outIdx) ? "ic-output-point--high" : ""}`}
                        style={{ top: `${topPct}%` }}
                        title={icMeta.outputLabels[outIdx]}
                        onClick={() => startConnection(gate, outIdx)}
                      >
                        <span className="ic-pin-label">
                          {icMeta.outputLabels[outIdx]}
                        </span>
                      </div>
                    );
                  })}

                {/* Standard output */}
                {!isIC && gate.hasOutput && (
                  <div
                    className={`connection-point output-point ${cfGateId === gate.id ? "active" : ""}`}
                    onClick={() => startConnection(gate, 0)}
                  />
                )}

                {/* IC inputs */}
                {isIC &&
                  Array.from({ length: icMeta.inputs }).map((_, idx) => {
                    const n = icMeta.inputs,
                      topPct = n === 1 ? 50 : 10 + (idx / (n - 1)) * 80;
                    return (
                      <div
                        key={`in-${idx}`}
                        className={`connection-point input-point ic-input-point ${connectingFrom ? "active" : ""}`}
                        style={{ top: `${topPct}%` }}
                        title={icMeta.inputLabels[idx]}
                        onClick={() => completeConnection(gate, idx)}
                      >
                        <span className="ic-pin-label ic-pin-label--left">
                          {icMeta.inputLabels[idx]}
                        </span>
                      </div>
                    );
                  })}

                {/* Standard inputs */}
                {!isIC &&
                  gate.inputs >= 2 &&
                  Array.from({ length: gate.inputs }).map((_, idx) => {
                    const n = gate.inputs,
                      topPct =
                        n === 2 ? (idx === 0 ? 35 : 65) : 15 + (idx / (n - 1)) * 70;
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

        <div className="canvas-overlay-controls">
          <button
            className={`canvas-overlay-btn${selectionToolActive ? " canvas-overlay-btn--active" : ""}`}
            onClick={() => setSelectionToolActive((v) => !v)}
            style={
              selectionToolActive
                ? {
                    background: "var(--accent-primary, #7c3aed)",
                    color: "#fff",
                    borderColor: "var(--accent-primary, #7c3aed)",
                  }
                : {}
            }
          >
            ⬚
          </button>
          <button className="canvas-overlay-btn" onClick={fitToView}>
            ⊡
          </button>
          <button
            className="canvas-overlay-btn"
            onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
          >
            +
          </button>
          <button
            className="canvas-overlay-btn"
            onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))}
          >
            −
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="truth-table-panel">
        <h2>Circuit Control</h2>

        {!embedded && (
          <div className="ai-assistant-section">
            <h3 className="ai-title">🤖 CircuitMind Assistant</h3>
            <textarea
              className="ai-textarea"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the circuit (e.g. 'half adder', 'A AND B OR C')…"
              rows={2}
            />
            <div className="controls">
              <button
                className="btn hint-btn"
                onClick={handleRequestHint}
                disabled={hintLoading}
                style={{ cursor: hintLoading ? "wait" : "pointer" }}
              >
                {hintLoading ? "💡 Thinking…" : "💡 Get Hint"}
              </button>
              <button
                className="btn generate-btn"
                onClick={handleGenerateCircuit}
                disabled={isGenLoading}
                style={{ cursor: isGenLoading ? "wait" : "pointer" }}
              >
                {isGenLoading ? "⚡ Generating…" : "⚡ AI Generate"}
              </button>
            </div>
            {(hint || hintError) && (
              <div className={`ai-response ${hintError ? "error" : ""}`}>
                {hintError || hint}
                <button
                  className="dismiss-hint"
                  onClick={() => {
                    setHint(null);
                    setHintError("");
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

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
                <div className={`output-value ${evaluateGate(gate) ? "high" : "low"}`}>
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

      {/* Rename Modal */}
      {renamingGate && (
        <div className="modal-overlay" onClick={cancelRename}>
          <div className="rename-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="rename-title">✏️ Rename Gate</h3>
            <p className="rename-text">
              Enter a custom label for this{" "}
              <strong className="gate-type">{renamingGate.type}</strong> gate.
            </p>
            <input
              autoFocus
              className="rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") cancelRename();
              }}
            />
            <div className="rename-actions">
              <button className="btn cancel-btn" onClick={cancelRename}>
                Cancel
              </button>
              <button className="btn rename-btn" onClick={commitRename}>
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      <RelatedSeoLinks />
    </div>
  );

  // ── Page Shell ──────────────────────────────────────────────────────────────
  if (embedded) return circuitTool;

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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
          </svg>
        </button>
      )}
      <main
        className={`boolforge-main${navbarVisible ? "" : " boolforge-main--fullscreen"}`}
      >
        {circuitTool}
      </main>
      {footerVisible && <Footer onToggleFooter={() => setFooterVisible(false)} />}
      {!footerVisible && (
        <button
          className="footer-restore-btn"
          onClick={() => setFooterVisible(true)}
          aria-label="Show footer"
          title="Show footer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="15" x2="21" y2="15" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Boolforge;
