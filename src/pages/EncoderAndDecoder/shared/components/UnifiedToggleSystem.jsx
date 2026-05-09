import React, { useState, useMemo } from "react";
import { ArrowRightLeft, Binary, Cpu, Info } from "lucide-react";
import { COLORS, glassCardStyle } from "../theme.js";

const UnifiedToggleSystem = () => {
  const [isEncoderMode, setIsEncoderMode] = useState(true);
  const [inputs, setInputs] = useState(isEncoderMode ? [0, 0, 0, 0] : [0, 0]);

  const handleModeToggle = () => {
    setIsEncoderMode(!isEncoderMode);
    setInputs(!isEncoderMode ? [0, 0, 0, 0] : [0, 0]);
  };

  const toggleInput = (index) => {
    const newInputs = [...inputs];
    if (isEncoderMode) {
      newInputs[index] = newInputs[index] === 1 ? 0 : 1;
    } else {
      newInputs[index] = newInputs[index] === 1 ? 0 : 1;
    }
    setInputs(newInputs);
  };

  const results = useMemo(() => {
    if (isEncoderMode) {
      let highest = -1;
      for (let i = 3; i >= 0; i--) {
        if (inputs[i] === 1) {
          highest = i;
          break;
        }
      }
      if (highest === -1) return [0, 0, 0];
      const binary = highest.toString(2).padStart(2, "0");
      return [parseInt(binary[0]), parseInt(binary[1]), 1];
    } else {
      const binaryStr = inputs.join("");
      const index = parseInt(binaryStr, 2);
      const outputs = [0, 0, 0, 0];
      outputs[index] = 1;
      return outputs.reverse();
    }
  }, [inputs, isEncoderMode]);

  return (
    <div style={{ ...glassCardStyle(isEncoderMode ? COLORS.indigo : COLORS.blue), padding: "24px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h3 style={{ margin: 0, color: COLORS.textPrimary, fontSize: "1.2rem", fontWeight: "700" }}>
            {isEncoderMode ? "4-to-2 Priority Encoder" : "2-to-4 Binary Decoder"}
          </h3>
          <p style={{ margin: "4px 0 0", color: COLORS.textSecondary, fontSize: "0.85rem" }}>
            {isEncoderMode ? "Signal Line → Binary Code" : "Binary Code → Signal Line"}
          </p>
        </div>

        <button
          onClick={handleModeToggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: isEncoderMode ? "rgba(99,102,241,0.15)" : "rgba(96,165,250,0.15)",
            border: `1px solid ${isEncoderMode ? COLORS.indigo : COLORS.blue}40`,
            borderRadius: "30px",
            color: isEncoderMode ? COLORS.indigoLight : COLORS.blue,
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.85rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ArrowRightLeft size={16} />
          Switch to {isEncoderMode ? "Decoder" : "Encoder"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "800", color: COLORS.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>Inputs</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            {inputs.map((val, idx) => (
              <button
                key={idx}
                onClick={() => toggleInput(idx)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: val ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.2)",
                  border: `1px solid ${val ? (isEncoderMode ? COLORS.indigo : COLORS.blue) : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: val ? COLORS.glowShadow(isEncoderMode ? COLORS.indigo : COLORS.blue) : "none",
                }}
              >
                <span style={{ color: val ? COLORS.textPrimary : COLORS.textSecondary, fontWeight: "600", fontSize: "0.9rem" }}>
                  {isEncoderMode ? `Line I${idx}` : `Bit B${inputs.length - 1 - idx}`}
                </span>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  background: val ? (isEncoderMode ? COLORS.indigo : COLORS.blue) : "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: val ? "#fff" : COLORS.textDim,
                  fontSize: "0.8rem",
                  fontWeight: "800"
                }}>
                  {val}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `2px dashed ${isEncoderMode ? COLORS.indigo : COLORS.blue}30`,
            animation: "spin 10s linear infinite",
          }} />
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
          `}</style>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "15px",
            background: isEncoderMode ? "linear-gradient(135deg, #6366f1, #a855f7)" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 10px 25px -5px ${isEncoderMode ? COLORS.indigo : COLORS.blue}50`,
            zIndex: 2,
            animation: "pulse 2s ease-in-out infinite"
          }}>
            <Cpu color="#fff" size={30} />
          </div>
          <div style={{ position: "absolute", top: "50%", left: "-30px", width: "30px", height: "2px", background: `linear-gradient(to right, transparent, ${isEncoderMode ? COLORS.indigo : COLORS.blue}40)` }} />
          <div style={{ position: "absolute", top: "50%", right: "-30px", width: "30px", height: "2px", background: `linear-gradient(to left, transparent, ${isEncoderMode ? COLORS.indigo : COLORS.blue}40)` }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "800", color: COLORS.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>Outputs</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            {(isEncoderMode ? results.slice(0, 2) : results).map((val, idx) => {
              let label = isEncoderMode ? `Output A${1 - idx}` : `Signal Y${idx}`;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: val ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.2)",
                    border: `1px solid ${val ? COLORS.high : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px",
                    transition: "all 0.3s",
                    boxShadow: val ? `0 0 15px ${COLORS.high}30` : "none",
                  }}
                >
                  <span style={{ color: val ? COLORS.high : COLORS.textSecondary, fontWeight: "600", fontSize: "0.9rem" }}>
                    {label}
                  </span>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: val ? COLORS.high : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: val ? "#0a0f1a" : COLORS.textDim,
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    boxShadow: val ? `0 0 10px ${COLORS.high}` : "none"
                  }}>
                    {val}
                  </div>
                </div>
              );
            })}
            {isEncoderMode && (
               <div style={{ 
                marginTop: "4px",
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                padding: "8px 12px", 
                background: "rgba(0,0,0,0.2)", 
                borderRadius: "8px",
                border: `1px solid ${results[2] ? COLORS.high + "40" : "rgba(255,255,255,0.05)"}`
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: results[2] ? COLORS.high : COLORS.textDim }} />
                <span style={{ fontSize: "0.75rem", color: results[2] ? COLORS.textPrimary : COLORS.textDim, fontWeight: "600" }}>Valid Flag (V)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: "24px", 
        padding: "12px", 
        background: "rgba(0,0,0,0.2)", 
        borderRadius: "10px", 
        display: "flex", 
        gap: "10px", 
        alignItems: "flex-start",
        borderLeft: `3px solid ${isEncoderMode ? COLORS.indigo : COLORS.blue}`
      }}>
        <Info size={16} color={isEncoderMode ? COLORS.indigoLight : COLORS.blue} style={{ marginTop: "2px", flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: "0.8rem", color: COLORS.textSecondary, lineHeight: "1.5" }}>
          {isEncoderMode 
            ? "In Encoding mode, multiple inputs can be active. The system uses 'Priority Logic' where the input with the highest index takes precedence."
            : "In Decoding mode, the 2-bit binary input (B1B0) is translated into a single active output line among the 4 possible signals."
          }
        </p>
      </div>
    </div>
  );
};

export default UnifiedToggleSystem;
