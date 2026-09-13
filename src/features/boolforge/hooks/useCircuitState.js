import { useState, useCallback, useRef, useMemo } from "react";
import { IC_META, IC_TYPES } from "../../../shared/data/gates";
import {
  MAX_GATE_INPUTS,
  MIN_GATE_INPUTS,
  MULTI_INPUT_GATES,
  GRID_SIZE,
  defaultInputCount,
  getICHeight,
} from "../utils";

// DEPRECATED: superseded by useSheets.js, which supports multiple
// independent circuit sheets and mirrors this same state shape into a
// single "active" circuit. Kept here as a lightweight, single-circuit
// alternative for any embed/tooling that doesn't need multi-sheet support
// (e.g. a future minimal circuit-only embed), and as a reference for the
// CRUD logic that useSheets duplicates per-sheet.
//
// Centralises gates/wires state, id counters, and undo/redo history, plus
// the CRUD-ish operations that mutate them (add/delete gate, rename,
// copy/paste/duplicate, merge input gates). Canvas interaction (drag,
// pan, wiring) stays in useCanvasInteractions and calls back into these
// setters/helpers.
export function useCircuitState({ portNames = null, containerRef, snapEnabled = true } = {}) {
  const [gates, setGates] = useState([]);
  const [wires, setWires] = useState([]);
  const [gateIdCounter, setGateIdCounter] = useState(0);
  const [wireIdCounter, setWireIdCounter] = useState(0);
  const [inputCounter, setInputCounter] = useState(0);
  const [outputCounter, setOutputCounter] = useState(0);

  const [selectedGate, setSelectedGate] = useState(null);
  const [selectedGateIds, setSelectedGateIds] = useState([]);
  const [selectedWireIds, setSelectedWireIds] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedCommentIds, setSelectedCommentIds] = useState([]);

  const [renamingGate, setRenamingGate] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const copiedDataRef = useRef(null);

  const gateMap = useMemo(() => {
    const map = new Map();
    gates.forEach((g) => map.set(g.id, g));
    return map;
  }, [gates]);

  const inputGates = useMemo(() => gates.filter((g) => g.type === "INPUT"), [gates]);
  const outputGates = useMemo(() => gates.filter((g) => g.type === "OUTPUT"), [gates]);

  const generateInputLabel = useCallback(
    (index) => portNames?.inputs?.[index] ?? `I${index}`,
    [portNames]
  );
  const generateOutputLabel = useCallback(
    (index) => portNames?.outputs?.[index] ?? `S${index}`,
    [portNames]
  );

  // ── History ────────────────────────────────────────────────────────────
  const saveToHistory = useCallback(() => {
    const state = {
      gates: JSON.parse(JSON.stringify(gates)),
      wires: JSON.parse(JSON.stringify(wires)),
      comments: JSON.parse(JSON.stringify(comments)), // <-- Add this
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
  }, [gates, wires, comments, gateIdCounter, wireIdCounter, inputCounter, outputCounter, historyIndex]);



  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setGates(JSON.parse(JSON.stringify(state.gates)));
      setWires(JSON.parse(JSON.stringify(state.wires)));
      setComments(JSON.parse(JSON.stringify(state.comments || []))); // <-- Add this
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
      setComments(JSON.parse(JSON.stringify(state.comments || [])));
      setGateIdCounter(state.gateIdCounter);
      setWireIdCounter(state.wireIdCounter);
      setInputCounter(state.inputCounter || 0);
      setOutputCounter(state.outputCounter || 0);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // ── Gate CRUD ──────────────────────────────────────────────────────────
  const snapToGrid = useCallback(
    (value) => (snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value),
    [snapEnabled]
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
      if (!window.confirm(`Are you sure you want to delete the ${targets.length} selected component(s)?`)) return;

      setGates((prev) => prev.filter((g) => !targets.includes(g.id)));
      setWires((prev) =>
        prev.filter((w) => !targets.includes(w.fromId) && !targets.includes(w.toId))
      );

      let inputDec = 0, outputDec = 0;
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
    [selectedGateIds, gates, saveToHistory]
  );

  const addGate = useCallback(
    (type) => {
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

      const container = containerRef?.current;
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
    },
    [gates, gateIdCounter, inputCounter, outputCounter, containerRef, generateInputLabel, generateOutputLabel, saveToHistory]
  );
  // ── Comment CRUD ────────────────────────────────────────────────────────
  const handleAddComment = useCallback(() => {
    const newComment = {
      id: `comment-${Date.now()}`,
      x: 100, 
      y: 100,
      text: "New Note...",
      isEditing: true
    };
    setComments((prev) => [...prev, newComment]);
    saveToHistory();
  }, [saveToHistory]);

  const updateComment = useCallback((id, updates) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    // Only save to history when they finish editing (isEditing becomes false)
    if (updates.isEditing === false) {
      saveToHistory();
    }
  }, [saveToHistory]);

  const deleteComment = useCallback((id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    setSelectedCommentIds((prev) => prev.filter((cid) => cid !== id));
    saveToHistory();
  }, [saveToHistory]);

  const addInputSlot = useCallback(
    (e, gate) => {
      e.stopPropagation();
      if (!MULTI_INPUT_GATES.has(gate.type) || gate.inputs >= MAX_GATE_INPUTS) return;
      setGates((prev) =>
        prev.map((g) => (g.id === gate.id ? { ...g, inputs: g.inputs + 1 } : g))
      );
      saveToHistory();
    },
    [saveToHistory]
  );

  const removeInputSlot = useCallback(
    (e, gate) => {
      e.stopPropagation();
      if (!MULTI_INPUT_GATES.has(gate.type) || gate.inputs <= MIN_GATE_INPUTS) return;
      const lastIdx = gate.inputs - 1;
      setWires((prev) =>
        prev.filter((w) => !(w.toId === gate.id && w.toIndex === lastIdx))
      );
      setGates((prev) =>
        prev.map((g) => (g.id === gate.id ? { ...g, inputs: g.inputs - 1 } : g))
      );
      saveToHistory();
    },
    [saveToHistory]
  );

  // ── Gate rename ────────────────────────────────────────────────────────
  const startRename = useCallback((e, gate) => {
    e.stopPropagation();
    e.preventDefault();
    setRenamingGate(gate);
    setRenameValue(gate.label || gate.type);
  }, []);

  const commitRename = useCallback(() => {
    setRenamingGate((currentRenamingGate) => {
      if (!currentRenamingGate) return currentRenamingGate;
      setRenameValue((currentRenameValue) => {
        const trimmed = currentRenameValue.trim();
        if (trimmed) {
          setGates((prev) =>
            prev.map((g) => (g.id === currentRenamingGate.id ? { ...g, label: trimmed } : g))
          );
          saveToHistory();
        }
        return "";
      });
      return null;
    });
  }, [saveToHistory]);

  const cancelRename = useCallback(() => {
    setRenamingGate(null);
    setRenameValue("");
  }, []);

  // ── Toggle input ───────────────────────────────────────────────────────
  const toggleInput = useCallback((gate) => {
    setGates((prev) =>
      prev.map((g) =>
        g.id === gate.id ? { ...g, inputValues: [!g.inputValues[0]] } : g
      )
    );
  }, []);

  // ── Wiring helper: merge two INPUT gates into one ─────────────────────
  const mergeInputGates = useCallback(
    (keepId, removeId) => {
      setWires((prev) => {
        const rest = prev.filter((w) => w.fromId !== removeId && w.toId !== removeId);
        const occupied = new Set(rest.map((w) => `${w.toId}:${w.toIndex}`));
        const redirected = prev
          .filter((w) => w.fromId === removeId && w.toId !== removeId)
          .filter((w) => !occupied.has(`${w.toId}:${w.toIndex}`))
          .map((w) => ({ ...w, fromId: keepId }));
        return [...rest, ...redirected];
      });
      setGates((prev) => prev.filter((g) => g.id !== removeId));
      setSelectedGateIds((prev) => prev.filter((id) => id !== removeId));
      setSelectedGate((prev) => (prev?.id === removeId ? null : prev));
      saveToHistory();
    },
    [saveToHistory]
  );

  const deleteWire = useCallback(
    (wireId) => {
      setWires((prev) => prev.filter((w) => w.id !== wireId));
      setSelectedWireIds((prev) => prev.filter((id) => id !== wireId));
      saveToHistory();
    },
    [saveToHistory]
  );

  // ── Copy / Paste / Duplicate ───────────────────────────────────────────
  const copySelectedGates = useCallback(() => {
    if (selectedGateIds.length === 0) return;
    copiedDataRef.current = {
      gates: JSON.parse(JSON.stringify(gates.filter((g) => selectedGateIds.includes(g.id)))),
      wires: JSON.parse(
        JSON.stringify(wires.filter((w) => selectedGateIds.includes(w.fromId) && selectedGateIds.includes(w.toId)))
      ),
    };
  }, [selectedGateIds, gates, wires]);

  const pasteGates = useCallback(() => {
    if (!copiedDataRef.current) return;
    const { gates: copiedGates, wires: copiedWires } = copiedDataRef.current;
    if (copiedGates.length === 0) return;

    const idMap = {};
    let currentGateId = gateIdCounter, currentWireId = wireIdCounter;
    let newInputCounter = inputCounter, newOutputCounter = outputCounter;

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
  }, [gateIdCounter, wireIdCounter, inputCounter, outputCounter, saveToHistory, generateInputLabel, generateOutputLabel]);

  const duplicateSelectedGates = useCallback(() => {
    if (selectedGateIds.length === 0) return;
    const selectedGatesList = gates.filter((g) => selectedGateIds.includes(g.id));
    const selectedWiresList = wires.filter(
      (w) => selectedGateIds.includes(w.fromId) && selectedGateIds.includes(w.toId)
    );

    const idMap = {};
    let currentGateId = gateIdCounter, currentWireId = wireIdCounter;
    let newInputCounter = inputCounter, newOutputCounter = outputCounter;

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
  }, [selectedGateIds, gates, wires, gateIdCounter, wireIdCounter, inputCounter, outputCounter, saveToHistory, generateInputLabel, generateOutputLabel]);

  const clearCircuit = useCallback(() => {
    setGates([]);
    setWires([]);
    setGateIdCounter(0);
    setWireIdCounter(0);
    setInputCounter(0);
    setOutputCounter(0);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  return {
    // state
    gates, setGates,
    wires, setWires,
    comments, setComments, // <-- ADD THIS
    gateIdCounter, setGateIdCounter,
    wireIdCounter, setWireIdCounter,
    inputCounter, setInputCounter,
    outputCounter, setOutputCounter,
    selectedGate, setSelectedGate,
    selectedGateIds, setSelectedGateIds,
    selectedWireIds, setSelectedWireIds,
    selectedCommentIds, setSelectedCommentIds, // <-- ADD THIS
    renamingGate, renameValue, setRenameValue,
    history, setHistory, historyIndex, setHistoryIndex,
    // derived
    gateMap, inputGates, outputGates,
    generateInputLabel, generateOutputLabel,
    // history
    saveToHistory, undo, redo,
    // grid
    snapToGrid,
    // CRUD
    deleteGate, addGate, addInputSlot, removeInputSlot,
    handleAddComment, updateComment, deleteComment, // <-- ADD THIS
    startRename, commitRename, cancelRename,
    toggleInput,
    mergeInputGates, deleteWire,
    copySelectedGates, pasteGates, duplicateSelectedGates,
    clearCircuit,
  };
}
