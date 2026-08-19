import React from "react";
import { gateSymbols, IC_META, IC_TYPES } from "../../shared/data/gates";
import { MULTI_INPUT_GATES, MIN_GATE_INPUTS, MAX_GATE_INPUTS } from "./constants";
import { getICHeight } from "./geometry";

const GateNode = ({
  gate,
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
}) => {
  const canExpand = MULTI_INPUT_GATES.has(gate.type);
  const canAddInput = canExpand && gate.inputs < MAX_GATE_INPUTS;
  const canRemoveInput = canExpand && gate.inputs > MIN_GATE_INPUTS;
  const isIC = IC_TYPES.has(gate.type);
  const icMeta = isIC ? IC_META[gate.type] : null;
  const icH = isIC ? getICHeight(gate.type) : 100;
  const cfGateId = connectingFrom?.gate?.id ?? connectingFrom?.id;

  return (
    <div
      data-gate-id={gate.id}
      className={`gate ${gate.type === "OUTPUT" ? "output-gate" : ""} ${isIC ? "gate--ic" : ""} ${selectedGateIds.includes(gate.id) ? "selected" : ""} ${gate.type === "OUTPUT" && evaluateGate(gate) ? "active" : ""}`}
      style={{ left: gate.x, top: gate.y, height: isIC ? icH : undefined }}
      onMouseDown={(e) => startDrag(e, gate)}
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          e.stopPropagation();
          startDrag(e.touches[0], gate);
        }
      }}
      onDoubleClick={(e) => startRename(e, gate)}
      onContextMenu={(e) => {
        e.preventDefault();
        deleteGate(gate);
      }}
    >
      <div className="gate-content">
        {gateSymbols[gate.type]}
        {!isIC && <div className="gate-label">{gate.label || gate.type}</div>}
      </div>

      {canExpand && (
        <div className="gate-input-controls">
          <button
            className="gate-input-btn"
            title={
              canRemoveInput
                ? `Remove input (${gate.inputs - 1} inputs)`
                : `Minimum ${MIN_GATE_INPUTS} inputs`
            }
            disabled={!canRemoveInput}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => removeInputSlot(e, gate)}
          >
            −
          </button>
          <span className="gate-input-count">{gate.inputs}</span>
          <button
            className="gate-input-btn"
            title={
              canAddInput
                ? `Add input (${gate.inputs + 1} inputs)`
                : `Maximum ${MAX_GATE_INPUTS} inputs`
            }
            disabled={!canAddInput}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => addInputSlot(e, gate)}
          >
            +
          </button>
        </div>
      )}

      {/* IC outputs */}
      {isIC &&
        Array.from({ length: icMeta.outputs }).map((_, outIdx) => {
          const n = icMeta.outputs,
            topPct = n === 1 ? 50 : 10 + (outIdx / (n - 1)) * 80;
          const isConnecting =
            cfGateId === gate.id && connectingFrom?.outputIndex === outIdx;
          return (
            <div
              key={`out-${outIdx}`}
              className={`connection-point output-point ic-output-point ${isConnecting ? "active" : ""} ${evaluateGate(gate, outIdx) ? "ic-output-point--high" : ""}`}
              style={{ top: `${topPct}%` }}
              title={icMeta.outputLabels[outIdx]}
              onClick={() => startConnection(gate, outIdx)}
            >
              <span className="ic-pin-label">{icMeta.outputLabels[outIdx]}</span>
            </div>
          );
        })}

      {/* Standard output */}
      {!isIC && gate.hasOutput && (
        <div
          className={`connection-point output-point ${cfGateId === gate.id ? "active" : ""}`}
          onClick={() => startConnection(gate, 0)}
        />
      )}

      {/* IC inputs */}
      {isIC &&
        Array.from({ length: icMeta.inputs }).map((_, idx) => {
          const n = icMeta.inputs,
            topPct = n === 1 ? 50 : 10 + (idx / (n - 1)) * 80;
          return (
            <div
              key={`in-${idx}`}
              className={`connection-point input-point ic-input-point ${connectingFrom ? "active" : ""}`}
              style={{ top: `${topPct}%` }}
              title={icMeta.inputLabels[idx]}
              onClick={() => completeConnection(gate, idx)}
            >
              <span className="ic-pin-label ic-pin-label--left">
                {icMeta.inputLabels[idx]}
              </span>
            </div>
          );
        })}

      {/* Standard inputs */}
      {!isIC &&
        gate.inputs >= 2 &&
        Array.from({ length: gate.inputs }).map((_, idx) => {
          const n = gate.inputs,
            topPct = n === 2 ? (idx === 0 ? 35 : 65) : 15 + (idx / (n - 1)) * 70;
          return (
            <div
              key={idx}
              className={`connection-point input-point ${connectingFrom ? "active" : ""}`}
              style={{ top: `${topPct}%` }}
              onClick={() => completeConnection(gate, idx)}
            />
          );
        })}
      {!isIC && gate.inputs === 1 && (
        <div
          className={`connection-point input-point ${connectingFrom ? "active" : ""}`}
          style={{ top: "50%" }}
          onClick={() => completeConnection(gate, 0)}
        />
      )}
    </div>
  );
};

export default GateNode;
