import React from "react";
import GateIcon from "./GateIcon";
import "./GateCard.css";

/**
 * GateCard — one draggable entry in the component palette.
 * `onAdd` fires on click (tap-to-place); `draggable` enables drag-to-canvas.
 */
export default function GateCard({ gate, onAdd }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("application/cf-gate", gate.type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <button
      type="button"
      className="cf-gate-card"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onAdd?.(gate.type)}
      style={{ "--accent": gate.accent }}
    >
      <span className="cf-gate-card__icon">
        <GateIcon type={gate.type} />
      </span>
      <span className="cf-gate-card__label">{gate.label}</span>
    </button>
  );
}
