import React, { useState, useRef, useEffect, useCallback } from "react";
import { gateSymbols } from "../data/gates";
import { TruthTableGenerator } from "../components/TruthTable";
import { SaveAndLoad } from "../components/SaveAndLoad";
import { parseExpressionToCircuit } from "../utils/expressionParser";
import "./../assets/css/Boolforge.css";

const Boolforge = ({ simplifiedExpression = null, variables = [] }) => {
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

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const GRID_SIZE = 20;
  const SNAP_TO_GRID = true;

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

  const snapToGrid = (value) => {
    return SNAP_TO_GRID ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  const gateMap = React.useMemo(() => {
    const map = new Map();
    gates.forEach((gate) => map.set(gate.id, gate));
    return map;
  }, [gates]);

  const evaluateGate = useCallback(
    (gate, memo = new Map(), depth = 0) => {
      // Prevent infinite recursion
      if (depth > 100) {
        console.warn("Max recursion depth reached in evaluateGate");
        return false;
      }

      if (!gate) return false;

      if (memo.has(gate.id)) {
        return memo.get(gate.id);
      }

      if (gate.type === "INPUT") {
        const result = gate.inputValues[0] || false;
        memo.set(gate.id, result);
        return result;
      }

      const inputs = [];

      wires.forEach((wire) => {
        if (wire.toId === gate.id) {
          const fromGate = gateMap.get(wire.fromId);
          if (fromGate) {
            const sourceOutput = evaluateGate(fromGate, memo, depth + 1);
            inputs[wire.toIndex] = sourceOutput;
          }
        }
      });

      let result = false;
      const connectedInputs = inputs.filter((v) => v !== undefined);
      switch (gate.type) {
        case "AND":
          result = connectedInputs.length > 0 && connectedInputs.every(Boolean);
          break;
        case "OR":
          result = connectedInputs.some(Boolean);
          break;
        case "NOT":
          result = !inputs[0];
          break;
        case "NAND":
          result = !(
            connectedInputs.length > 0 && connectedInputs.every(Boolean)
          );
          break;
        case "NOR":
          result = !connectedInputs.some(Boolean);
          break;
        case "XOR":
          result = inputs.length === 2 && inputs[0] !== inputs[1];
          break;
        case "XNOR":
          result = inputs.length === 2 && inputs[0] === inputs[1];
          break;
        case "BUFFER":
          result = inputs[0] || false;
          break;
        case "OUTPUT":
          result = inputs[0] || false;
          break;
        default:
          result = false;
      }

      memo.set(gate.id, result);
      return result;
    },
    [wires, gateMap],
  );

  const drawWires = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context and apply transformations
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoom, zoom);

      const memo = new Map();

      wires.forEach((wire) => {
        try {
          const fromGate = gateMap.get(wire.fromId);
          const toGate = gateMap.get(wire.toId);

          if (!fromGate || !toGate) return;

          // Output point is always at the right-center of the gate
          const fromX = fromGate.x + 120;
          const fromY = fromGate.y + 50;

          // Input point position depends on number of inputs and which input
          const toX = toGate.x;
          let toY;

          if (toGate.inputs === 1) {
            toY = toGate.y + 50;
          } else if (toGate.inputs === 2) {
            toY = toGate.y + (wire.toIndex === 0 ? 35 : 65);
          } else {
            // Spread N inputs evenly across gate height (20px top margin, 80px height)
            const n = toGate.inputs;
            const gateTop = toGate.y + 15;
            const gateBottom = toGate.y + 85;
            toY = gateTop + (wire.toIndex / (n - 1)) * (gateBottom - gateTop);
          }

          const isActive = evaluateGate(fromGate, memo);

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
        } catch (wireError) {
          console.error("Error drawing wire:", wireError);
        }
      });

      // Restore context
      ctx.restore();
    } catch (error) {
      console.error("Error in drawWires:", error);
    }
  }, [wires, gateMap, evaluateGate, zoom, panOffset]);

  // Redraw wires when dependencies change
  useEffect(() => {
    const redraw = () => {
      try {
        drawWires();
      } catch (error) {
        console.error("Error redrawing wires:", error);
      }
    };

    redraw();
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
      }, 100); // Debounce resize by 100ms
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearTimeout(resizeTimeout);
    };
  }, [drawWires]);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        redo();
      } else if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (e.key === "Delete" && selectedGate) {
        deleteGate(selectedGate);
      } else if (e.key === "Escape") {
        setConnectingFrom(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, selectedGate, deleteGate]);

  // Handle zoom with mouse wheel
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

      // Adjust pan to zoom towards mouse position
      const zoomRatio = newZoom / zoom;
      const newPanX = mouseX - (mouseX - panOffset.x) * zoomRatio;
      const newPanY = mouseY - (mouseY - panOffset.y) * zoomRatio;

      setZoom(newZoom);
      setPanOffset({ x: newPanX, y: newPanY });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoom, panOffset]);

  // Handle canvas drag to pan
  const handleCanvasMouseDown = (e) => {
    // Only pan if clicking on canvas background (not on gates)
    if (e.target === canvasRef.current) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const addGate = (type) => {
    const hasOutput = type !== "OUTPUT";
    const inputs =
      type === "INPUT" ? 0 : type === "NOT" || type === "BUFFER" ? 1 : 2;

    // Override inputs for OUTPUT to be exactly 1
    const finalInputs = type === "OUTPUT" ? 1 : inputs;

    let label = type;
    if (type === "INPUT") {
      // Use sequential alphabet labeling: A-Z, AA-AZ, BA-BZ, etc.
      label = generateInputLabel(inputCounter);
      setInputCounter((prev) => prev + 1);
    } else if (type === "OUTPUT") {
      // Use reverse sequential labeling: Z, Y, X, ..., A, ZZ, ZY, etc.
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

  const startDrag = (e, gate) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    // Prevent panning when starting to drag a gate
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

    const container = containerRef.current;
    if (!container) return;

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

  const startConnection = (gate) => {
    if (!gate.hasOutput) return;
    setConnectingFrom(gate);
  };

  const completeConnection = (toGate, toIndex) => {
    if (!connectingFrom || connectingFrom.id === toGate.id) {
      setConnectingFrom(null);
      return;
    }

    // Remove any existing wire to this input point
    const filteredWires = wires.filter(
      (w) => !(w.toId === toGate.id && w.toIndex === toIndex),
    );

    // For OUTPUT gates, remove ALL existing wires (since they should only have one input)
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

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const wire of wires) {
      const fromGate = gateMap.get(wire.fromId);
      const toGate = gateMap.get(wire.toId);

      if (!fromGate || !toGate) continue;

      const fromX = fromGate.x + 120;
      const fromY = fromGate.y + 50;
      const toX = toGate.x;
      const toY =
        toGate.y + (toGate.inputs === 1 ? 50 : wire.toIndex === 0 ? 35 : 65);

      const distance =
        Math.abs(
          (toY - fromY) * x - (toX - fromX) * y + toX * fromY - toY * fromX,
        ) / Math.sqrt((toY - fromY) ** 2 + (toX - fromX) ** 2);

      if (distance < 10) {
        setWires((prev) => prev.filter((w) => w.id !== wire.id));
        saveToHistory();
        return;
      }
    }
  };

  const toggleInput = (gate) => {
    setGates((prev) =>
      prev.map((g) =>
        g.id === gate.id ? { ...g, inputValues: [!g.inputValues[0]] } : g,
      ),
    );
  };

  const evaluateGateWithGates = useCallback(
    (gate, gatesArray, depth = 0, visited = new Set()) => {
      if (depth > 100) {
        console.warn("Max recursion depth in evaluateGateWithGates");
        return false;
      }

      if (!gate) return false;

      // Detect circular dependencies
      if (visited.has(gate.id)) {
        console.warn("Circular dependency detected in circuit");
        return false;
      }

      if (gate.type === "INPUT") {
        return gate.inputValues[0] || false;
      }

      const inputs = [];
      const newVisited = new Set(visited);
      newVisited.add(gate.id);

      wires.forEach((wire) => {
        if (wire.toId === gate.id) {
          const fromGate = gatesArray.find((g) => g.id === wire.fromId);
          if (fromGate) {
            const sourceOutput = evaluateGateWithGates(
              fromGate,
              gatesArray,
              depth + 1,
              newVisited,
            );
            inputs[wire.toIndex] = sourceOutput;
          }
        }
      });

      const connectedInputs2 = inputs.filter((v) => v !== undefined);
      switch (gate.type) {
        case "AND":
          return connectedInputs2.length > 0 && connectedInputs2.every(Boolean);
        case "OR":
          return connectedInputs2.some(Boolean);
        case "NOT":
          return !inputs[0];
        case "NAND":
          return !(
            connectedInputs2.length > 0 && connectedInputs2.every(Boolean)
          );
        case "NOR":
          return !connectedInputs2.some(Boolean);
        case "XOR":
          return inputs.length === 2 && inputs[0] !== inputs[1];
        case "XNOR":
          return inputs.length === 2 && inputs[0] === inputs[1];
        case "BUFFER":
          return inputs[0] || false;
        case "OUTPUT":
          return inputs[0] || false;
        default:
          return false;
      }
    },
    [wires],
  );

  const generateTruthTable = useCallback(() => {
    const inputs = gates.filter((g) => g.type === "INPUT");
    const outputs = gates.filter((g) => g.type === "OUTPUT");

    if (inputs.length === 0 || outputs.length === 0) {
      return { headers: [], rows: [] };
    }

    const numCombinations = Math.pow(2, inputs.length);
    const rows = [];

    for (let i = 0; i < numCombinations; i++) {
      const inputValues = inputs.map((_, index) => {
        return (i >> (inputs.length - 1 - index)) & 1 ? true : false;
      });

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

    const headers = [
      ...inputs.map((g) => g.label),
      ...outputs.map((g) => g.label),
    ];

    return { headers, rows };
  }, [gates, evaluateGateWithGates]);

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

  // Generate input label: A-M, then AA-AM, BA-BM, ..., MA-MM, then AAA-AAM, etc.
  const generateInputLabel = (index) => {
    const alphabet = "ABCDEFGHIJKLM"; // A to M (13 letters)
    const base = alphabet.length;

    if (index < base) {
      // Single letter: A-M
      return alphabet[index];
    }

    // For multi-letter labels
    let label = "";
    let remaining = index - base; // Offset for double letters starting after M
    let length = 2; // Start with double letters

    // Find the appropriate length (2, 3, 4, etc.)
    let maxForLength = Math.pow(base, length);
    while (remaining >= maxForLength) {
      remaining -= maxForLength;
      length++;
      maxForLength = Math.pow(base, length);
    }

    // Generate the label for the current length
    for (let i = 0; i < length; i++) {
      label = alphabet[remaining % base] + label;
      remaining = Math.floor(remaining / base);
    }

    return label;
  };

  // Generate output label: Z-N, then ZZ-ZN, YZ-YN, ..., NZ-NN, then ZZZ-ZZN, etc.
  const generateOutputLabel = (index) => {
    const alphabet = "ZYXWVUTSRQPON"; // Z to N reversed (13 letters)
    const base = alphabet.length;

    if (index < base) {
      // Single letter: Z-N
      return alphabet[index];
    }

    // For multi-letter labels
    let label = "";
    let remaining = index - base; // Offset for double letters starting after N
    let length = 2; // Start with double letters

    // Find the appropriate length (2, 3, 4, etc.)
    let maxForLength = Math.pow(base, length);
    while (remaining >= maxForLength) {
      remaining -= maxForLength;
      length++;
      maxForLength = Math.pow(base, length);
    }

    // Generate the label for the current length
    for (let i = 0; i < length; i++) {
      label = alphabet[remaining % base] + label;
      remaining = Math.floor(remaining / base);
    }

    return label;
  };

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

  // Track if circuit has been auto-built
  const hasAutoBuilt = useRef(false);

  // Auto-build circuit from simplified expression
  useEffect(() => {
    if (simplifiedExpression && variables.length > 0 && !hasAutoBuilt.current) {
      const circuit = parseExpressionToCircuit(simplifiedExpression, variables);
      if (circuit.gates && circuit.gates.length > 0) {
        setGates(circuit.gates);
        setWires(circuit.wires);
        setGateIdCounter(circuit.gateIdCounter || circuit.gates.length);
        setWireIdCounter(circuit.wireIdCounter || circuit.wires.length);

        // Count actual INPUT and OUTPUT gates from the generated circuit
        const inputCount = circuit.gates.filter(
          (g) => g.type === "INPUT",
        ).length;
        const outputCount = circuit.gates.filter(
          (g) => g.type === "OUTPUT",
        ).length;
        setInputCounter(inputCount);
        setOutputCounter(outputCount);

        hasAutoBuilt.current = true;

        // Save to history after a short delay to ensure state is updated
        setTimeout(() => {
          const state = {
            gates: circuit.gates,
            wires: circuit.wires,
            gateIdCounter: circuit.gateIdCounter || circuit.gates.length,
            wireIdCounter: circuit.wireIdCounter || circuit.wires.length,
            inputCounter: inputCount,
            outputCounter: outputCount,
          };
          setHistory([state]);
          setHistoryIndex(0);
        }, 100);
      }
    }
  }, [simplifiedExpression, variables]);

  return (
    <div
      className="container circuit-maker"
      onMouseMove={(e) => {
        if (isPanning) {
          handleMouseMove(e);
        } else {
          onDrag(e);
        }
      }}
      onMouseUp={() => {
        stopDrag();
        handleMouseUp();
      }}
    >
      <div className="sidebar">
        <h2>Logic Gates</h2>

        {/* Display Simplified Expression */}
        {simplifiedExpression && (
          <div className="simplified-expression-display">
            <h3>📐 K-Map Simplified Expression</h3>
            <div className="expression-content">{simplifiedExpression}</div>
            <p className="expression-hint">Circuit auto-generated below! ✨</p>
          </div>
        )}

        <div className="gate-palette">
          <button className="gate-btn" onClick={() => addGate("INPUT")}>
            INPUT
          </button>
          <button className="gate-btn" onClick={() => addGate("OUTPUT")}>
            OUTPUT
          </button>
          <button className="gate-btn" onClick={() => addGate("AND")}>
            AND
          </button>
          <button className="gate-btn" onClick={() => addGate("OR")}>
            OR
          </button>
          <button className="gate-btn" onClick={() => addGate("NOT")}>
            NOT
          </button>
          <button className="gate-btn" onClick={() => addGate("NAND")}>
            NAND
          </button>
          <button className="gate-btn" onClick={() => addGate("NOR")}>
            NOR
          </button>
          <button className="gate-btn" onClick={() => addGate("XOR")}>
            XOR
          </button>
          <button className="gate-btn" onClick={() => addGate("XNOR")}>
            XNOR
          </button>
          <button className="gate-btn" onClick={() => addGate("BUFFER")}>
            BUFFER
          </button>
        </div>

        <div className="instructions">
          <p>
            <strong>Controls:</strong>
          </p>
          <p>• Click gate buttons to add gates</p>
          <p>• Drag gates to move them</p>
          <p>• Drag canvas background to pan</p>
          <p>• Click output → input to connect</p>
          <p>• Click wire to delete it</p>
          <p>• Right-click gate to delete</p>
          <p>• Scroll to zoom in/out</p>
          <p>
            <strong>Keyboard Shortcuts:</strong>
          </p>
          <p>• Ctrl+Z: Undo</p>
          <p>• Ctrl+Shift+Z: Redo</p>
          <p>• Delete: Remove selected gate</p>
          <p>• Escape: Cancel connection</p>
        </div>
      </div>

      <div className="canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
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
          {gates.map((gate) => (
            <div
              key={gate.id}
              className={`gate ${gate.type === "OUTPUT" ? "output-gate" : ""} ${selectedGate?.id === gate.id ? "selected" : ""} ${gate.type === "OUTPUT" && evaluateGate(gate) ? "active" : ""}`}
              style={{ left: gate.x, top: gate.y }}
              onMouseDown={(e) => startDrag(e, gate)}
              onContextMenu={(e) => {
                e.preventDefault();
                deleteGate(gate);
              }}
            >
              <div className="gate-content">
                {gateSymbols[gate.type]}
                <div className="gate-label">{gate.label || gate.type}</div>
              </div>

              {gate.hasOutput && (
                <div
                  className={`connection-point output-point ${connectingFrom?.id === gate.id ? "active" : ""}`}
                  onClick={() => startConnection(gate)}
                />
              )}

              {gate.inputs >= 2 &&
                Array.from({ length: gate.inputs }).map((_, idx) => {
                  const n = gate.inputs;
                  const topPct =
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

              {gate.inputs === 1 && (
                <>
                  <div
                    className={`connection-point input-point ${connectingFrom ? "active" : ""}`}
                    style={{ top: "50%" }}
                    onClick={() => completeConnection(gate, 0)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default Boolforge;
