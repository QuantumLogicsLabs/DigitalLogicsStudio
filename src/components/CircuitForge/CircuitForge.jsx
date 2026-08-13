import React, { useCallback, useState } from "react";
import "./circuitTheme.css";
import "./CircuitForge.css";
import Toolbar from "./Toolbar";
import ComponentSidebar from "./ComponentSidebar";
import Canvas from "./Canvas";
import StatusBar from "./StatusBar";
import AssistantDrawer from "./AssistantDrawer";

export default function CircuitForge() {
  const [selectionMode, setSelectionMode] = useState(false);
  const [gridOn, setGridOn] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [placedGates, setPlacedGates] = useState([]);
  const [history, setHistory] = useState({ past: [], future: [] });

  const commit = useCallback((next) => {
    setHistory((h) => ({ past: [...h.past, placedGates], future: [] }));
    setPlacedGates(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedGates]);

  const handleAddGate = (type, position = { x: 120, y: 120 }) => {
    commit([...placedGates, { id: `${type}-${Date.now()}`, type, position }]);
  };

  const handleUndo = () => {
    setHistory((h) => {
      if (!h.past.length) return h;
      const previous = h.past[h.past.length - 1];
      setPlacedGates(previous);
      return { past: h.past.slice(0, -1), future: [placedGates, ...h.future] };
    });
  };

  const handleRedo = () => {
    setHistory((h) => {
      if (!h.future.length) return h;
      const next = h.future[0];
      setPlacedGates(next);
      return { past: [...h.past, placedGates], future: h.future.slice(1) };
    });
  };

  const handleClear = () => commit([]);

  return (
    <div className="cf-page">
      <Toolbar
        selectionMode={selectionMode}
        onToggleSelection={() => setSelectionMode((v) => !v)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onRun={() => console.log("Simulate circuit", placedGates)}
        onSave={() => console.log("Save project", placedGates)}
        onLoad={() => console.log("Load project")}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.4))}
        onToggleGrid={() => setGridOn((v) => !v)}
        gridOn={gridOn}
        onExport={() => console.log("Export circuit")}
        onOpenAssistant={() => setAssistantOpen(true)}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
      />

      <div className="cf-page__body">
        <ComponentSidebar onAddGate={handleAddGate} />

        <div className="cf-page__canvas-wrap">
          <Canvas gridOn={gridOn} zoom={zoom} onDropGate={handleAddGate}>
            {placedGates.map((g) => (
              <div
                key={g.id}
                className="cf-placed-gate"
                style={{ left: g.position.x, top: g.position.y }}
              >
                {g.type}
              </div>
            ))}
          </Canvas>
          <StatusBar
            zoom={zoom}
            gridOn={gridOn}
            componentCount={placedGates.length}
            selectionMode={selectionMode}
          />
        </div>
      </div>

      <AssistantDrawer
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onHint={(prompt) => console.log("Get hint for", prompt)}
        onGenerate={(prompt) => console.log("AI generate for", prompt)}
      />
    </div>
  );
}
