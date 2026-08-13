import React from "react";
import "./StatusBar.css";

export default function StatusBar({ zoom, gridOn, componentCount = 0, selectionMode }) {
  return (
    <footer className="cf-status">
      <span>{selectionMode ? "SELECT" : "PLACE"}</span>
      <span className="cf-status__sep" />
      <span>ZOOM {Math.round(zoom * 100)}%</span>
      <span className="cf-status__sep" />
      <span>GRID {gridOn ? "ON" : "OFF"}</span>
      <span className="cf-status__sep" />
      <span>{componentCount} COMPONENT{componentCount === 1 ? "" : "S"}</span>
      <span className="cf-status__spacer" />
      <span className="cf-status__brand">BOOLFORGE · CIRCUIT FORGE</span>
    </footer>
  );
}
