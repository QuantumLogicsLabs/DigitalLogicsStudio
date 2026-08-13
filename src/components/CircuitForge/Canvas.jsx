import React, { useRef } from "react";
import "./Canvas.css";

export default function Canvas({ gridOn, zoom, onDropGate, children }) {
  const canvasRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/cf-gate");
    if (!type || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    onDropGate?.(type, { x, y });
  };

  return (
    <div
      ref={canvasRef}
      className={`cf-canvas ${gridOn ? "cf-canvas--grid" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="cf-canvas__surface" style={{ transform: `scale(${zoom})` }}>
        {children}
      </div>

      {!children && (
        <div className="cf-canvas__empty">
          <p>Drag a component from the left panel, or click one to place it here.</p>
        </div>
      )}
    </div>
  );
}
