import React, { useState, useRef, useEffect, useCallback } from "react";
import { gateSymbols } from "../data/gates";
import { TruthTableGenerator } from "../components/TruthTable";
import { SaveAndLoad } from "../components/SaveAndLoad";
import { parseExpressionToCircuit } from "../utils/expressionParser";
import RelatedSeoLinks from "../components/seo/RelatedSeoLinks";
import "./../assets/css/Boolforge.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_GATE_INPUTS = 8; // Maximum inputs any logic gate can have
const MIN_GATE_INPUTS = 2; // Minimum inputs for multi-input gates

// Gates that support variable numbers of inputs (2–MAX_GATE_INPUTS)
const MULTI_INPUT_GATES = new Set(["AND", "OR", "NAND", "NOR", "XOR", "XNOR"]);

// Gates that are always single-input
const SINGLE_INPUT_GATES = new Set(["NOT", "BUFFER", "OUTPUT"]);

// ─── Helper: compute input count for a gate type ──────────────────────────────
function defaultInputCount(type) {
  if (type === "INPUT") return 0;
  if (SINGLE_INPUT_GATES.has(type)) return 1;
  return 2; // default for multi-input gates
}

const Boolforge = ({
  simplifiedExpression = null,
  variables = [],
  onCircuitChange,
  portNames = null, // { inputs: string[], outputs: string[] } — from problem
}) => {
  const [gates, setGates] = useState([]);
  const [wires, setWires] = useState([]);
  const [selectedGate, setSelectedGate] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // ── Stable gate state for feedback/latch circuits ─────────────────────────
  // Stores the last converged output value per gate id.
  // This breaks cyclic dependency during recursive evaluation so that
  // feedback circuits (SR latch, D latch, etc.) simulate correctly.
  const gateStateRef = useRef(new Map());

  const GRID_SIZE = 20;
  const SNAP_TO_GRID = true;

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
    (gate) => {
      setGates((prev) => prev.filter((g) => g.id !== gate.id));
      setWires((prev) =>
        prev.filter((w) => w.fromId !== gate.id && w.toId !== gate.id),
      );
      if (gate.type === "INPUT")
        setInputCounter((prev) => Math.max(0, prev - 1));
      if (gate.type === "OUTPUT")
        setOutputCounter((prev) => Math.max(0, prev - 1));
      setSelectedGate(null);
      saveToHistory();
    },
    [setGates, setWires, setSelectedGate, saveToHistory],
  );

  // ── Snap to grid ──────────────────────────────────────────────────────────
  const snapToGrid = (value) =>
    SNAP_TO_GRID ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;

  // ── Gate map ───────────────────────────────────────────────────────────────
  const gateMap = React.useMemo(() => {
    const map = new Map();
    gates.forEach((gate) => map.set(gate.id, gate));
    return map;
  }, [gates]);

  // ── Gate logic: compute a single gate's output from resolved inputs ──────────
  const computeGateOutput = (gate, inputs) => {
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
      default:
        return false;
    }
  };

  // ── Iterative double-buffered simulation (synchronous, runs during render) ──
  //
  // WHY useMemo, not useEffect:
  //   evaluateGate is called during render (JSX). useEffect fires *after*
  //   the render, so a ref updated there is always one frame stale.
  //   useMemo runs synchronously before the JSX is produced, so the values
  //   are ready when the render reads them.
  //
  // WHY double-buffering (prev → next):
  //   Each pass reads exclusively from the *previous* pass's values and writes
  //   to a *new* map. This is the correct way to simulate feedback loops:
  //   gate A's new value depends on gate B's *old* value, not on B's
  //   already-updated new value. Without this, a NOR-NOR SR latch collapses
  //   to (false, false) because both gates see each other's updated outputs
  //   within the same pass.
  //
  // HOW latches work with this approach:
  //   The previous stable state lives in gateStateRef. When inputs change,
  //   the first pass reads the old Q/Q̄ values from gateStateRef as the
  //   initial "prev" map. The loop then converges to the new stable state
  //   over a few passes (typically 2–4 for an SR latch).
  const gateValues = React.useMemo(() => {
    // Build incoming-wire lookup: toId → [{ fromId, toIndex }]
    const incomingWires = new Map();
    gates.forEach((g) => incomingWires.set(g.id, []));
    wires.forEach((w) => {
      if (incomingWires.has(w.toId)) incomingWires.get(w.toId).push(w);
    });

    // Seed the initial "previous" map from:
    //   - INPUT gates: their live toggle value
    //   - all other gates: the last converged value stored in gateStateRef
    //     (this is what carries latch memory across renders)
    let prev = new Map();
    gates.forEach((g) => {
      if (g.type === "INPUT") {
        prev.set(g.id, g.inputValues[0] || false);
      } else {
        prev.set(g.id, gateStateRef.current.get(g.id) ?? false);
      }
    });

    // Double-buffered iteration: read from prev, write to next
    const MAX_ITER = 100;
    for (let iter = 0; iter < MAX_ITER; iter++) {
      const next = new Map(prev);
      let changed = false;

      for (const gate of gates) {
        let newVal;
        if (gate.type === "INPUT") {
          newVal = gate.inputValues[0] || false;
        } else {
          const inputs = [];
          for (const w of incomingWires.get(gate.id) || []) {
            inputs[w.toIndex] = prev.get(w.fromId) ?? false; // read from PREV
          }
          newVal = computeGateOutput(gate, inputs);
        }

        next.set(gate.id, newVal); // write to NEXT

        if (prev.get(gate.id) !== newVal) changed = true;
      }

      prev = next;
      if (!changed) break;
    }

    // Persist the converged state so the next render seeds from it
    // (this is what gives latches their memory)
    gateStateRef.current = prev;

    return prev;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gates, wires]);

  // ── Gate evaluation — reads from the synchronously computed state map ──────
  const evaluateGate = useCallback(
    (gate) => {
      if (!gate) return false;
      return gateValues.get(gate.id) ?? false;
    },
    [gateValues],
  );

  // ── Wire Y position helper ─────────────────────────────────────────────────
  // Returns the Y coordinate of an input slot for a gate, given the input index.
  const getInputY = (gate, inputIndex) => {
    const n = gate.inputs;
    if (n === 1) return gate.y + 50;
    if (n === 2) return gate.y + (inputIndex === 0 ? 35 : 65);
    // N inputs spread evenly: 15% – 85% of gate height (100px)
    const gateTop = gate.y + 15;
    const gateBottom = gate.y + 85;
    return gateTop + (inputIndex / (n - 1)) * (gateBottom - gateTop);
  };

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
          const fromY = fromGate.y + 50;
          const toX = toGate.x;
          const toY = getInputY(toGate, wire.toIndex);

          const isActive = evaluateGate(fromGate);
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
            fromX + controlDistance,
            fromY,
            toX - controlDistance,
            toY,
            toX,
            toY,
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
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawWires();
      }, 100);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearTimeout(resizeTimeout);
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

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        redo();
      } else if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedGate
      ) {
        deleteGate(selectedGate);
      } else if (e.key === "Escape") {
        setConnectingFrom(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, selectedGate, deleteGate]);

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

  // ── Pan with canvas drag ───────────────────────────────────────────────────
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };
  const handleMouseMove = (e) => {
    if (isPanning)
      setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };
  const handleMouseUp = () => setIsPanning(false);

  // ── Add gate ───────────────────────────────────────────────────────────────
  const addGate = (type) => {
    const finalInputs = defaultInputCount(type);
    const hasOutput = type !== "OUTPUT";

    let label = type;
    if (type === "INPUT") {
      label = generateInputLabel(inputCounter);
      setInputCounter((prev) => prev + 1);
    } else if (type === "OUTPUT") {
      label = generateOutputLabel(outputCounter);
      setOutputCounter((prev) => prev + 1);
    }

    const newGate = {
      id: gateIdCounter,
      type,
      label,
      x: 100 + (gates.length % 5) * 140,
      y: 100 + Math.floor(gates.length / 5) * 120,
      inputs: finalInputs,
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
    setDragging(true);
    setSelectedGate(gate);
    setDragOffset({
      x: e.clientX - gate.x * zoom - panOffset.x,
      y: e.clientY - gate.y * zoom - panOffset.y,
    });
  };
  const onDrag = (e) => {
    if (!dragging || !selectedGate || isPanning) return;
    const x = snapToGrid((e.clientX - dragOffset.x - panOffset.x) / zoom);
    const y = snapToGrid((e.clientY - dragOffset.y - panOffset.y) / zoom);
    setGates((prev) =>
      prev.map((g) => (g.id === selectedGate.id ? { ...g, x, y } : g)),
    );
  };
  const stopDrag = () => {
    if (dragging) {
      setDragging(false);
      saveToHistory();
    }
  };

  // ── Wire connections ───────────────────────────────────────────────────────
  const startConnection = (gate) => {
    if (!gate.hasOutput) return;
    setConnectingFrom(gate);
  };

  const completeConnection = (toGate, toIndex) => {
    if (!connectingFrom || connectingFrom.id === toGate.id) {
      setConnectingFrom(null);
      return;
    }
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
      fromId: connectingFrom.id,
      toId: toGate.id,
      toIndex,
    };
    setWires([...finalWires, newWire]);
    setWireIdCounter((prev) => prev + 1);
    setConnectingFrom(null);
    saveToHistory();
  };

  // ── Right-click canvas to delete wires ───────────────────────────────────
  // Samples points along the actual Bézier curve for accurate hit-testing.
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
      const fromY = fromGate.y + 50;
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
    (gate, gatesArray) => {
      // Build wire lookup
      const incomingWires = new Map();
      gatesArray.forEach((g) => incomingWires.set(g.id, []));
      wires.forEach((w) => {
        if (incomingWires.has(w.toId)) incomingWires.get(w.toId).push(w);
      });

      // Double-buffered: seed prev from INPUT values, non-inputs default false
      let prev = new Map();
      gatesArray.forEach((g) => {
        prev.set(g.id, g.type === "INPUT" ? g.inputValues[0] || false : false);
      });

      // Iterate to convergence using double-buffering (read prev, write next)
      for (let iter = 0; iter < 100; iter++) {
        const next = new Map(prev);
        let changed = false;
        for (const g of gatesArray) {
          if (g.type === "INPUT") continue;
          const inputs = [];
          for (const w of incomingWires.get(g.id) || []) {
            inputs[w.toIndex] = prev.get(w.fromId) ?? false; // read from PREV
          }
          const newVal = computeGateOutput(g, inputs);
          next.set(g.id, newVal); // write to NEXT
          if (prev.get(g.id) !== newVal) changed = true;
        }
        prev = next;
        if (!changed) break;
      }

      return prev.get(gate.id) ?? false;
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
  return (
    <div
      className="container circuit-maker"
      onMouseMove={(e) => {
        isPanning ? handleMouseMove(e) : onDrag(e);
      }}
      onMouseUp={() => {
        stopDrag();
        handleMouseUp();
      }}
    >
      {/* ── Sidebar ── */}
      <div className="sidebar">
        <h2>Logic Gates</h2>

        {simplifiedExpression && (
          <div className="simplified-expression-display">
            <h3>📐 K-Map Simplified Expression</h3>
            <div className="expression-content">{simplifiedExpression}</div>
            <p className="expression-hint">Circuit auto-generated below! ✨</p>
          </div>
        )}

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
            <button
              key={type}
              className="gate-btn"
              onClick={() => addGate(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="instructions">
          <p>
            <strong>Controls:</strong>
          </p>
          <p>• Click gate buttons to add gates</p>
          <p>• Drag gates to move them</p>
          <p>• Drag canvas background to pan</p>
          <p>• Click output → input to connect</p>
          <p>• Right-click wire to delete it</p>
          <p>• Right-click gate to delete</p>
          <p>• Double-click gate to rename it</p>
          <p>• Scroll to zoom in/out</p>
          {/* ← NEW instructions for multi-input */}
          <p>
            • Click <strong>+</strong> on a gate to add an input (max{" "}
            {MAX_GATE_INPUTS})
          </p>
          <p>
            • Click <strong>−</strong> on a gate to remove an input (min{" "}
            {MIN_GATE_INPUTS})
          </p>
          <p>
            <strong>Keyboard Shortcuts:</strong>
          </p>
          <p>• Ctrl+Z: Undo</p>
          <p>• Ctrl+Shift+Z: Redo</p>
          <p>• Delete: Remove selected gate</p>
          <p>• Escape: Cancel connection</p>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          onContextMenu={handleCanvasContextMenu}
          onMouseDown={handleCanvasMouseDown}
          style={{
            pointerEvents: "auto",
            cursor: isPanning ? "grabbing" : "grab",
          }}
        />

        <div
          className="gates-container"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {gates.map((gate) => {
            const canExpand = MULTI_INPUT_GATES.has(gate.type);
            const canAddInput = canExpand && gate.inputs < MAX_GATE_INPUTS;
            const canRemoveInput = canExpand && gate.inputs > MIN_GATE_INPUTS;

            return (
              <div
                key={gate.id}
                className={`gate ${gate.type === "OUTPUT" ? "output-gate" : ""} ${selectedGate?.id === gate.id ? "selected" : ""} ${gate.type === "OUTPUT" && evaluateGate(gate) ? "active" : ""}`}
                style={{ left: gate.x, top: gate.y }}
                onMouseDown={(e) => startDrag(e, gate)}
                onDoubleClick={(e) => startRename(e, gate)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  deleteGate(gate);
                }}
              >
                <div className="gate-content">
                  {gateSymbols[gate.type]}
                  <div className="gate-label">{gate.label || gate.type}</div>
                </div>

                {/* ── Input-count controls (+ / −) shown on multi-input gates ── */}
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

                {/* ── Output connection point ── */}
                {gate.hasOutput && (
                  <div
                    className={`connection-point output-point ${connectingFrom?.id === gate.id ? "active" : ""}`}
                    onClick={() => startConnection(gate)}
                  />
                )}

                {/* ── Input connection points — N evenly-spaced slots ── */}
                {gate.inputs >= 2 &&
                  Array.from({ length: gate.inputs }).map((_, idx) => {
                    const n = gate.inputs;
                    const topPct =
                      n === 2
                        ? idx === 0
                          ? 35
                          : 65
                        : 15 + (idx / (n - 1)) * 70;
                    return (
                      <div
                        key={idx}
                        className={`connection-point input-point ${connectingFrom ? "active" : ""}`}
                        style={{ top: `${topPct}%` }}
                        onClick={() => completeConnection(gate, idx)}
                      />
                    );
                  })}

                {gate.inputs === 1 && (
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
};

export default Boolforge;
