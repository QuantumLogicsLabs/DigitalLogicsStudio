import { useState, useCallback, useRef, useMemo } from "react";
import { IC_META, IC_TYPES } from "../../../shared/data/gates";
import { useToast } from "../../../shared/context/ToastContext";
import {
  MAX_GATE_INPUTS,
  MIN_GATE_INPUTS,
  MULTI_INPUT_GATES,
  GRID_SIZE,
  defaultInputCount,
  getICHeight,
} from "../utils";

// ─── Sheet factory ──────────────────────────────────────────────────────────
// Each sheet stores an independent circuit: gates, wires, id counters, and
// undo/redo history. This mirrors the state previously owned by
// useCircuitState, but now keyed per-sheet so multiple circuits can coexist.
function makeEmptySheet(name, index) {
  return {
    id: `sheet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name || `Sheet ${index}`,
    circuit: {
      gates: [],
      wires: [],
      comments: [],
      gateIdCounter: 0,
      wireIdCounter: 0,
      commentIdCounter: 0,
      inputCounter: 0,
      outputCounter: 0,
      history: [],
      historyIndex: -1,
    },
  };
}

// useSheets owns the collection of sheets and mirrors the "active" sheet's
// circuit into live gates/wires/etc state so that all the existing circuit
// hooks (useCanvasInteractions, useAI, useSimulation, useKeyboardShortcuts)
// keep working unmodified — they just receive these values/setters as before.
export function useSheets({ portNames = null, containerRef, customComponents = [], snapEnabled = true } = {}) {
  const toast = useToast();
  const [sheets, setSheets] = useState(() => [makeEmptySheet("Sheet 1", 1)]);
  const [activeSheetId, setActiveSheetIdState] = useState(() => sheets[0].id);

  // ── Live circuit state (mirrors the active sheet) ─────────────────────
  const activeInit = sheets.find((s) => s.id === activeSheetId)?.circuit;
  const [gates, setGates] = useState(activeInit?.gates ?? []);
  const [wires, setWires] = useState(activeInit?.wires ?? []);
  const [comments, setComments] = useState(activeInit?.comments ?? []);
  const [gateIdCounter, setGateIdCounter] = useState(activeInit?.gateIdCounter ?? 0);
  const [wireIdCounter, setWireIdCounter] = useState(activeInit?.wireIdCounter ?? 0);
  const [commentIdCounter, setCommentIdCounter] = useState(activeInit?.commentIdCounter ?? 0);
  const [inputCounter, setInputCounter] = useState(activeInit?.inputCounter ?? 0);
  const [outputCounter, setOutputCounter] = useState(activeInit?.outputCounter ?? 0);
  const [history, setHistory] = useState(activeInit?.history ?? []);
  const [historyIndex, setHistoryIndex] = useState(activeInit?.historyIndex ?? -1);

  const [selectedGate, setSelectedGate] = useState(null);
  const [selectedGateIds, setSelectedGateIds] = useState([]);
  const [selectedWireIds, setSelectedWireIds] = useState([]);
  const [selectedCommentIds, setSelectedCommentIds] = useState([]);

  const [renamingGate, setRenamingGate] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const copiedDataRef = useRef(null);

  // Always-current snapshot of the live circuit, for persisting into the
  // sheets array on switch (avoids stale-closure issues in setActiveSheetId).
  const liveRef = useRef(null);
  liveRef.current = {
    gates,
    wires,
    comments,
    gateIdCounter,
    wireIdCounter,
    commentIdCounter,
    inputCounter,
    outputCounter,
    history,
    historyIndex,
  };

  const gateMap = useMemo(() => {
    const map = new Map();
    gates.forEach((g) => map.set(g.id, g));
    return map;
  }, [gates]);

  const inputGates = useMemo(() => gates.filter((g) => g.type === "INPUT"), [gates]);
  const outputGates = useMemo(() => gates.filter((g) => g.type === "OUTPUT"), [gates]);

  const customIcMeta = useMemo(
    () =>
      Object.fromEntries(
        customComponents.map((c) => [
          `CUSTOM_${c.id}`,
          {
            inputs: c.inputs.length,
            outputs: c.outputs.length,
            inputLabels: c.inputs.map((p) => p.label),
            outputLabels: c.outputs.map((p) => p.label),
          },
        ]),
      ),
    [customComponents],
  );
  const mergedIcTypes = useMemo(
    () => new Set([...IC_TYPES, ...Object.keys(customIcMeta)]),
    [customIcMeta],
  );

  const generateInputLabel = useCallback(
    (index) => portNames?.inputs?.[index] ?? `I${index}`,
    [portNames]
  );
  const generateOutputLabel = useCallback(
    (index) => portNames?.outputs?.[index] ?? `S${index}`,
    [portNames]
  );

  // ── Sheet switching ─────────────────────────────────────────────────────
  const loadCircuitIntoLiveState = useCallback((circuit) => {
    setGates(circuit.gates || []);
    setWires(circuit.wires || []);
    setComments(circuit.comments || []);
    setGateIdCounter(circuit.gateIdCounter || 0);
    setWireIdCounter(circuit.wireIdCounter || 0);
    setCommentIdCounter(circuit.commentIdCounter || 0);
    setInputCounter(circuit.inputCounter || 0);
    setOutputCounter(circuit.outputCounter || 0);
    setHistory(circuit.history || []);
    setHistoryIndex(circuit.historyIndex ?? -1);
    setSelectedGate(null);
    setSelectedGateIds([]);
    setSelectedWireIds([]);
    setSelectedCommentIds([]);
  }, []);

  const setActiveSheetId = useCallback(
    (id) => {
      if (id === activeSheetId) return;
      setSheets((prev) =>
        prev.map((s) => (s.id === activeSheetId ? { ...s, circuit: liveRef.current } : s))
      );
      const target = sheets.find((s) => s.id === id);
      if (target) loadCircuitIntoLiveState(target.circuit);
      setActiveSheetIdState(id);
    },
    [activeSheetId, sheets, loadCircuitIntoLiveState]
  );

  const addSheet = useCallback(
    (name) => {
      const newSheet = makeEmptySheet(name, sheets.length + 1);
      setSheets((prev) => [
        ...prev.map((s) => (s.id === activeSheetId ? { ...s, circuit: liveRef.current } : s)),
        newSheet,
      ]);
      loadCircuitIntoLiveState(newSheet.circuit);
      setActiveSheetIdState(newSheet.id);
      return newSheet.id;
    },
    [activeSheetId, sheets, loadCircuitIntoLiveState]
  );

  const renameSheet = useCallback((id, newName) => {
    const trimmed = (newName || "").trim();
    if (!trimmed) return;
    setSheets((prev) => prev.map((s) => (s.id === id ? { ...s, name: trimmed } : s)));
  }, []);

  const deleteSheet = useCallback(
    (id) => {
      setSheets((prev) => {
        if (prev.length <= 1) return prev; // always keep at least one sheet
        const targetSheet = prev.find((s) => s.id === id);
        const name = targetSheet ? targetSheet.name : "Sheet";
        const remaining = prev.filter((s) => s.id !== id);
        if (id === activeSheetId) {
          const fallback = remaining[0];
          loadCircuitIntoLiveState(fallback.circuit);
          setActiveSheetIdState(fallback.id);
          toast.success(`Deleted "${name}".`);
          return remaining.map((s) =>
            s.id === fallback.id ? { ...s, circuit: fallback.circuit } : s
          );
        }
        toast.success(`Deleted "${name}".`);
        return remaining;
      });
    },
    [activeSheetId, loadCircuitIntoLiveState, toast]
  );

  // Persisted view of sheets for save/load, always reflecting the live
  // (active) circuit rather than the possibly-stale snapshot in `sheets`.
  const sheetsSnapshot = useMemo(
    () =>
      sheets.map((s) => (s.id === activeSheetId ? { ...s, circuit: liveRef.current } : s)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sheets, activeSheetId, gates, wires, comments, gateIdCounter, wireIdCounter, commentIdCounter, inputCounter, outputCounter, history, historyIndex]
  );

  // Load an entirely new sheets array (used by "Load Project" / import).
  const loadSheets = useCallback(
    (newSheets) => {
      if (!Array.isArray(newSheets) || newSheets.length === 0) return;
      const normalized = newSheets.map((s, i) => ({
        id: s.id || `sheet-${Date.now()}-${i}`,
        name: s.name || `Sheet ${i + 1}`,
        circuit: {
          gates: s.circuit?.gates || s.gates || [],
          wires: s.circuit?.wires || s.wires || [],
          comments: s.circuit?.comments || s.comments || [],
          gateIdCounter: s.circuit?.gateIdCounter ?? s.gateIdCounter ?? 0,
          wireIdCounter: s.circuit?.wireIdCounter ?? s.wireIdCounter ?? 0,
          commentIdCounter: s.circuit?.commentIdCounter ?? s.commentIdCounter ?? 0,
          inputCounter: s.circuit?.inputCounter ?? s.inputCounter ?? 0,
          outputCounter: s.circuit?.outputCounter ?? s.outputCounter ?? 0,
          history: [],
          historyIndex: -1,
        },
      }));
      setSheets(normalized);
      setActiveSheetIdState(normalized[0].id);
      loadCircuitIntoLiveState(normalized[0].circuit);
    },
    [loadCircuitIntoLiveState]
  );

  // ── History ────────────────────────────────────────────────────────────
  const saveToHistory = useCallback(() => {
    const state = {
      gates: JSON.parse(JSON.stringify(gates)),
      wires: JSON.parse(JSON.stringify(wires)),
      comments: JSON.parse(JSON.stringify(comments)),
      gateIdCounter,
      wireIdCounter,
      commentIdCounter,
      inputCounter,
      outputCounter,
    };
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [gates, wires, comments, gateIdCounter, wireIdCounter, commentIdCounter, inputCounter, outputCounter, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setGates(JSON.parse(JSON.stringify(state.gates)));
      setWires(JSON.parse(JSON.stringify(state.wires)));
      setComments(JSON.parse(JSON.stringify(state.comments || [])));
      setGateIdCounter(state.gateIdCounter);
      setWireIdCounter(state.wireIdCounter);
      setCommentIdCounter(state.commentIdCounter || 0);
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
      setCommentIdCounter(state.commentIdCounter || 0);
      setInputCounter(state.inputCounter || 0);
      setOutputCounter(state.outputCounter || 0);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // ── Gate CRUD (identical logic to useCircuitState) ─────────────────────
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
      toast.success(`Deleted ${targets.length} component(s).`);
    },
    [selectedGateIds, gates, saveToHistory, toast]
  );

  const addGate = useCallback(
    (type) => {
      const finalInputs = defaultInputCount(type);
      const isIC = mergedIcTypes.has(type);
      const isCustom = type.startsWith("CUSTOM_");
      const customDef = isCustom
        ? customComponents.find((c) => `CUSTOM_${c.id}` === type)
        : null;
      const hasOutput = type !== "OUTPUT";
      let label = type;
      if (type === "INPUT") {
        label = generateInputLabel(inputCounter);
        setInputCounter((prev) => prev + 1);
      } else if (type === "OUTPUT") {
        label = generateOutputLabel(outputCounter);
        setOutputCounter((prev) => prev + 1);
      } else if (isCustom) {
        label = customDef?.name || type;
      } else if (isIC) label = type;

      const container = containerRef?.current;
      const canvasW = container ? container.clientWidth : 600;
      const GATE_STEP_X = 160;
      const GATE_STEP_Y = isIC ? (isCustom ? Math.max(100, Math.max(customIcMeta[type].inputs, customIcMeta[type].outputs) * 22 + 20) + 40 : getICHeight(type) + 40) : 120;
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
        outputs: isIC ? (isCustom ? customIcMeta[type].outputs : IC_META[type].outputs) : 1,
        hasOutput,
        inputValues: type === "INPUT" ? [false] : [],
        ...(customDef ? { customDefinition: { gates: customDef.gates, wires: customDef.wires, outputs: customDef.outputs } } : {}),
      };
      setGates((prev) => [...prev, newGate]);
      setGateIdCounter((prev) => prev + 1);
      saveToHistory();
    },
    [gates, gateIdCounter, inputCounter, outputCounter, containerRef, generateInputLabel, generateOutputLabel, saveToHistory, customComponents, customIcMeta, mergedIcTypes]
  );

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

  // ── Comment CRUD ────────────────────────────────────────────────────────
  const handleAddComment = useCallback(() => {
    const newComment = {
      id: `comment-${Date.now()}-${commentIdCounter}`,
      x: 100,
      y: 100,
      text: "", // <-- Change this from "New Note" to an empty string
      isEditing: true
    };
    setComments((prev) => [...prev, newComment]);
    setCommentIdCounter((prev) => prev + 1);
    saveToHistory();
  }, [commentIdCounter, saveToHistory]);

  const updateComment = useCallback((id, updates) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    // Save to history when the user finishes editing (loses focus)
    if (updates.isEditing === false) {
      saveToHistory();
    }
  }, [saveToHistory]);

  const deleteComment = useCallback((id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    setSelectedCommentIds((prev) => prev.filter((cid) => cid !== id));
    saveToHistory();
  }, [saveToHistory]);

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
    setComments([]);
    setGateIdCounter(0);
    setWireIdCounter(0);
    setCommentIdCounter(0);
    setInputCounter(0);
    setOutputCounter(0);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  const activeSheet = useMemo(
    () => sheetsSnapshot.find((s) => s.id === activeSheetId) || sheetsSnapshot[0],
    [sheetsSnapshot, activeSheetId]
  );

  return {
    // sheets
    sheets: sheetsSnapshot,
    activeSheetId,
    activeSheet,
    setActiveSheetId,
    addSheet,
    renameSheet,
    deleteSheet,
    loadSheets,

    // live circuit state (mirrors active sheet)
    gates, setGates,
    wires, setWires,
    comments, setComments,
    gateIdCounter, setGateIdCounter,
    wireIdCounter, setWireIdCounter,
    commentIdCounter, setCommentIdCounter,
    inputCounter, setInputCounter,
    outputCounter, setOutputCounter,
    selectedGate, setSelectedGate,
    selectedGateIds, setSelectedGateIds,
    selectedWireIds, setSelectedWireIds,
    selectedCommentIds, setSelectedCommentIds,
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
    startRename, commitRename, cancelRename,
    toggleInput,
    mergeInputGates, deleteWire,
    copySelectedGates, pasteGates, duplicateSelectedGates,
    clearCircuit,
    handleAddComment, updateComment, deleteComment
  };
}