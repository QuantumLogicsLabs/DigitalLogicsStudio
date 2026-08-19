import React, { useState, useRef, useEffect, useCallback } from "react";
import { IC_META, IC_TYPES } from "../../shared/data/gates";
import { parseExpressionToCircuit } from "../../shared/utils/expressionParser";
import RelatedSeoLinks from "../../shared/seo/RelatedSeoLinks";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import { useTheme } from "../../shared/context/ThemeContext";
import { getCircuitHint } from "../../shared/services/circuitMindService";
import { generateAiCircuit } from "../../shared/services/aiService";
import {
  MAX_GATE_INPUTS,
  MIN_GATE_INPUTS,
  MULTI_INPUT_GATES,
  GRID_SIZE,
  SNAP_TO_GRID,
} from "./constants";
import { defaultInputCount, getICHeight, getInputY, getOutputY } from "./geometry";
import { computeGateOutput } from "./gateLogic";
import Sidebar from "./Sidebar";
import CanvasArea from "./CanvasArea";
import ControlPanel from "./ControlPanel";
import RenameModal from "./RenameModal";
import "./Boolforge.css";

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
      <Sidebar
        selectionToolActive={selectionToolActive}
        setSelectionToolActive={setSelectionToolActive}
        simplifiedExpression={simplifiedExpression}
        addGate={addGate}
      />

      <CanvasArea
        containerRef={containerRef}
        canvasRef={canvasRef}
        handleCanvasContextMenu={handleCanvasContextMenu}
        handleCanvasMouseDown={handleCanvasMouseDown}
        isPanning={isPanning}
        spacePressed={spacePressed}
        selectionToolActive={selectionToolActive}
        setSelectionToolActive={setSelectionToolActive}
        panOffset={panOffset}
        setIsPanning={setIsPanning}
        setPanStart={setPanStart}
        isSelecting={isSelecting}
        selectionStart={selectionStart}
        selectionEnd={selectionEnd}
        zoom={zoom}
        setZoom={setZoom}
        setPanOffset={setPanOffset}
        gates={gates}
        connectingFrom={connectingFrom}
        selectedGateIds={selectedGateIds}
        evaluateGate={evaluateGate}
        startDrag={startDrag}
        startRename={startRename}
        deleteGate={deleteGate}
        removeInputSlot={removeInputSlot}
        addInputSlot={addInputSlot}
        startConnection={startConnection}
        completeConnection={completeConnection}
        fitToView={fitToView}
      />

      <ControlPanel
        embedded={embedded}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        handleRequestHint={handleRequestHint}
        hintLoading={hintLoading}
        handleGenerateCircuit={handleGenerateCircuit}
        isGenLoading={isGenLoading}
        hint={hint}
        hintError={hintError}
        setHint={setHint}
        setHintError={setHintError}
        inputGates={inputGates}
        outputGates={outputGates}
        toggleInput={toggleInput}
        evaluateGate={evaluateGate}
        truthTable={truthTable}
        undo={undo}
        redo={redo}
        historyIndex={historyIndex}
        history={history}
        gates={gates}
        wires={wires}
        gateIdCounter={gateIdCounter}
        wireIdCounter={wireIdCounter}
        inputCounter={inputCounter}
        outputCounter={outputCounter}
        setGates={setGates}
        setWires={setWires}
        setGateIdCounter={setGateIdCounter}
        setWireIdCounter={setWireIdCounter}
        setInputCounter={setInputCounter}
        setOutputCounter={setOutputCounter}
        saveToHistory={saveToHistory}
        clearCircuit={clearCircuit}
        zoom={zoom}
        setZoom={setZoom}
        setPanOffset={setPanOffset}
        fitToView={fitToView}
      />

      <RenameModal
        renamingGate={renamingGate}
        renameValue={renameValue}
        setRenameValue={setRenameValue}
        cancelRename={cancelRename}
        commitRename={commitRename}
      />

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
