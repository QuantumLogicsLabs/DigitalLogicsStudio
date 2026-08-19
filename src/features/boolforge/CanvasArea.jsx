import React from "react";
import GateNode from "./GateNode";

const CanvasArea = ({
  containerRef,
  canvasRef,
  handleCanvasContextMenu,
  handleCanvasMouseDown,
  isPanning,
  spacePressed,
  selectionToolActive,
  setSelectionToolActive,
  panOffset,
  setIsPanning,
  setPanStart,
  isSelecting,
  selectionStart,
  selectionEnd,
  zoom,
  setZoom,
  setPanOffset,
  gates,
  connectingFrom,
  selectedGateIds,
  evaluateGate,
  startDrag,
  startRename,
  deleteGate,
  removeInputSlot,
  addInputSlot,
  startConnection,
  completeConnection,
  fitToView,
}) => {
  return (
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

        {gates.map((gate) => (
          <GateNode
            key={gate.id}
            gate={gate}
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
          />
        ))}
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
  );
};

export default CanvasArea;
