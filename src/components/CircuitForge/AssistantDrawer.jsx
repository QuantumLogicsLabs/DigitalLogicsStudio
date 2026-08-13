import React, { useState } from "react";
import { X, Lightbulb, Wand2 } from "lucide-react";
import "./AssistantDrawer.css";

export default function AssistantDrawer({ open, onClose, onHint, onGenerate }) {
  const [prompt, setPrompt] = useState("");

  return (
    <>
      <div
        className={`cf-drawer-backdrop ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`cf-drawer ${open ? "is-open" : ""}`}>
        <div className="cf-drawer__header">
          <span className="cf-drawer__title">CircuitMind Assistant</span>
          <button type="button" className="cf-drawer__close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <p className="cf-drawer__hint">
          Describe the circuit you want — e.g. "half adder" or "A AND B OR C".
        </p>

        <textarea
          className="cf-drawer__textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the circuit…"
          rows={4}
        />

        <div className="cf-drawer__actions">
          <button type="button" className="cf-drawer__btn cf-drawer__btn--hint" onClick={() => onHint?.(prompt)}>
            <Lightbulb size={15} /> Get hint
          </button>
          <button type="button" className="cf-drawer__btn cf-drawer__btn--generate" onClick={() => onGenerate?.(prompt)}>
            <Wand2 size={15} /> AI generate
          </button>
        </div>
      </aside>
    </>
  );
}
