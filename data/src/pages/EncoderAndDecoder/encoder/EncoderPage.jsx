/**
 * EncoderPage.jsx — Main page component for the Encoder topic
 *
 * Intentionally thin: wires together smaller components and sections.
 * All data lives in encoderData.js; all sub-components in ./components/.
 *
 * Section layout:
 *   1. Core Concept (what is an encoder + binary-index trick)
 *   2. Binary-Index Explorer (interactive)
 *   3. Signal Flow Animation + Type-selectable simulator
 *   4. Full Interactive Simulator
 *   5. Priority Conflict Resolution + Comparison Table
 *   6. Real-World Applications
 *   7. Quiz
 */
import React, { useState, useMemo } from "react";

// ── Shared components ──────────────────────────────────────────────────────────
import Section   from "../shared/components/Section.jsx";
import Quiz      from "../shared/components/Quiz.jsx";
import TipsPanel from "../shared/components/TipsPanel.jsx";

// ── Encoder-specific components ────────────────────────────────────────────────
import EncoderTypeSelector  from "./components/EncoderTypeSelector.jsx";
import EncoderSimulator     from "./components/EncoderSimulator.jsx";
import SignalFlowDiagram    from "./components/SignalFlowDiagram.jsx";
import BinaryIndexExplorer  from "./components/BinaryIndexExplorer.jsx";
import PriorityConflictSim  from "./components/PriorityConflictSim.jsx";
import ComparisonTable      from "./components/ComparisonTable.jsx";

// ── Data ───────────────────────────────────────────────────────────────────────
import {
  ENCODER_TYPES,
  ENCODER_TIPS,
  ENCODER_QUIZ,
  encoderQuizFeedback,
} from "./encoderData.js";

import { COLORS } from "../shared/theme.js";

// ─── Real-world application card ───────────────────────────────────────────────
const AppCard = ({ icon, color, title, items }) => (
  <div style={{ background: "rgba(12,18,35,0.7)", border: `1px solid ${color}25`, borderRadius: "12px", padding: "18px" }}>
    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{icon}</div>
    <h5 style={{ color, marginBottom: "12px", fontSize: "0.88rem", fontWeight: "700" }}>{title}</h5>
    <ul style={{ color: COLORS.textMuted, paddingLeft: "18px", margin: 0, lineHeight: "1.7", fontSize: "0.83rem" }}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
);

// ─── Key property card (used in concept section) ───────────────────────────────
const PropertyCard = ({ icon, label, desc, color }) => (
  <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 14px", background: "rgba(12,18,35,0.6)", borderRadius: "9px", border: `1px solid ${color}20` }}>
    <span style={{ fontSize: "1.2rem" }}>{icon}</span>
    <div>
      <div style={{ color, fontWeight: "700", fontSize: "0.82rem" }}>{label}</div>
      <div style={{ color: COLORS.textMuted, fontSize: "0.78rem" }}>{desc}</div>
    </div>
  </div>
);

// ─── Main page ─────────────────────────────────────────────────────────────────
const EncoderPage = () => {
  const [selectedType, setSelectedType] = useState("4to2");
  // A single flat array of up to 10 input bits shared across sections
  const [inputVals, setInputVals] = useState(Array(10).fill(0));

  const config     = ENCODER_TYPES[selectedType];
  const activeVals = inputVals.slice(0, config.inputs.length);
  const result     = useMemo(() => config.encode(activeVals), [config, activeVals]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setInputVals(Array(10).fill(0));
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: COLORS.pageBg,
        minHeight: "100vh",
        color: COLORS.textPrimary,
        padding: "28px 20px 80px",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(15,23,42,0.3); }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
        button:hover { filter: brightness(1.1); }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto 32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "6px 14px", borderRadius: "20px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", marginBottom: "16px" }}>
          <span style={{ color: COLORS.indigoLight, fontSize: "0.78rem", fontWeight: "700", letterSpacing: "0.1em" }}>DIGITAL LOGIC</span>
        </div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "800", background: "linear-gradient(135deg, #a5b4fc, #38bdf8, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 12px", lineHeight: 1.2 }}>
          Encoders — Complete Guide
        </h1>
        <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
          Interactive simulator • Signal flow animations • Priority conflict resolver • Binary-index explorer • Quiz with hints
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* ── Section 1: Core Concept ── */}
        <Section title="📖 What is an Encoder? — Core Concept" accent={COLORS.indigo}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <p style={{ color: COLORS.textSecondary, lineHeight: "1.7", fontSize: "0.92rem", margin: "0 0 16px" }}>
                An <strong style={{ color: COLORS.textPrimary }}>encoder</strong> is a combinational circuit that
                converts an active input signal into a compact binary code. It is the{" "}
                <em>opposite of a decoder</em>: given up to 2ⁿ input lines, it outputs n bits.
              </p>
              <p style={{ color: COLORS.textSecondary, lineHeight: "1.7", fontSize: "0.92rem", margin: 0 }}>
                Think of it as a{" "}
                <strong style={{ color: COLORS.warn }}>barcode scanner for signals</strong>{" "}
                — you present one active line, and it outputs the binary "label" of that line.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <PropertyCard icon="📉" label="Compression"    desc="2ⁿ inputs → n output bits"          color="#34d399" />
              <PropertyCard icon="⭐" label="Priority"       desc="Highest active input wins"            color={COLORS.warn} />
              <PropertyCard icon="✅" label="Valid Flag"      desc="V=1 means output is meaningful"      color={COLORS.blue} />
              <PropertyCard icon="⚡" label="Combinational"  desc="No memory — instant output"          color={COLORS.purple} />
            </div>
          </div>

          {/* Binary-Index Trick explainer */}
          <div style={{ padding: "18px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "12px", marginBottom: "16px" }}>
            <h4 style={{ color: COLORS.warn, marginBottom: "12px", fontSize: "0.9rem" }}>
              🎯 The Binary-Index Trick — Write Any Encoder Equation in 30 Seconds
            </h4>
            <ol style={{ color: COLORS.textSecondary, paddingLeft: "18px", margin: 0, lineHeight: "1.8", fontSize: "0.88rem" }}>
              <li>List all input indices from 0 to 2ⁿ−1</li>
              <li>For output bit Aₖ, find every index where <strong style={{ color: COLORS.warn }}>bit k = 1</strong> in binary</li>
              <li>OR those input lines together — that's your equation!</li>
            </ol>
            <div style={{ marginTop: "14px", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.87rem" }}>
              <span style={{ color: COLORS.warn }}>Example — A0 in 8-to-3 encoder:</span><br />
              <span style={{ color: COLORS.textSecondary }}>Indices 0–7 in binary: </span>
              <span style={{ color: COLORS.textDim }}>000 001 010 011 100 101 110 111</span><br />
              <span style={{ color: COLORS.textSecondary }}>Bit-0 = 1 for: </span>
              <span style={{ color: COLORS.purple }}>1, 3, 5, 7 (odd indices)</span><br />
              <span style={{ color: COLORS.high, fontWeight: "700" }}>∴ A0 = I1 + I3 + I5 + I7 ✅</span>
            </div>
          </div>

          {/* Encoder vs Decoder note */}
          <div style={{ padding: "16px", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: "12px" }}>
            <h4 style={{ color: "#86efac", marginBottom: "8px", fontSize: "0.88rem" }}>
              🔄 Encoder vs Decoder — Two Sides of the Same Coin
            </h4>
            <p style={{ color: COLORS.textSecondary, margin: 0, fontSize: "0.87rem", lineHeight: "1.6" }}>
              <strong style={{ color: COLORS.blue }}>Decoder:</strong> n-bit code → one of 2ⁿ output lines HIGH (expand — like a tree branching out)<br />
              <strong style={{ color: COLORS.warn }}>Encoder:</strong> one of 2ⁿ inputs HIGH → n-bit code (compress — like a funnel)<br />
              They are <strong style={{ color: COLORS.high }}>mathematical inverses</strong>. Decoder followed by Encoder = original code back.
            </p>
          </div>
        </Section>

        {/* ── Section 2: Binary-Index Explorer ── */}
        <Section title="🔬 Interactive Binary-Index Explorer — See the Trick in Action" accent={COLORS.purple}>
          <p style={{ color: COLORS.textSecondary, fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "18px" }}>
            Select how many inputs and which output bit to examine. The table highlights exactly which
            inputs contribute to that output and shows the resulting equation automatically.
          </p>
          <BinaryIndexExplorer />
        </Section>

        {/* ── Section 3: Signal Flow ── */}
        <Section title="⚡ Signal Flow — How Data Moves Through the Circuit" accent={COLORS.blue}>
          <p style={{ color: COLORS.textSecondary, fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "18px" }}>
            Use the simulator below, then watch the animated signal flow to understand what happens
            inside the encoder step by step.
          </p>
          <EncoderTypeSelector selectedType={selectedType} types={ENCODER_TYPES} onChange={handleTypeChange} />
          <div style={{ color: COLORS.textMuted, fontSize: "0.8rem", marginBottom: "12px", padding: "8px 12px", background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: "8px" }}>
            💡 <em>Analogy: {config.analogy}</em>
          </div>
          <SignalFlowDiagram result={result} />
        </Section>

        {/* ── Section 4: Full Simulator ── */}
        <Section title="🎮 Interactive Encoder Simulator" accent="#34d399">
          <EncoderTypeSelector selectedType={selectedType} types={ENCODER_TYPES} onChange={handleTypeChange} />
          <EncoderSimulator
            key={selectedType}
            config={config}
            inputVals={inputVals}
            setInputVals={setInputVals}
          />
        </Section>

        {/* ── Section 5: Priority Conflict ── */}
        <Section title="⚔️ Priority Conflict Resolution — What Happens with Multiple Inputs?" accent="#f97316">
          <p style={{ color: COLORS.textSecondary, fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "18px" }}>
            Basic encoders break when two inputs are HIGH simultaneously. Priority encoders solve
            this by always picking the highest-numbered input. Try it yourself:
          </p>
          <PriorityConflictSim />
          <div style={{ marginTop: "20px" }}>
            <ComparisonTable />
          </div>
        </Section>

        {/* ── Section 6: Real-World Applications ── */}
        <Section title="🌍 Real-World Applications" accent={COLORS.warn}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
            <AppCard icon="⌨️" color={COLORS.blue}   title="Computer Keyboard"         items={["74 key presses → 7-bit ASCII encoder","One keypress = one active input","Output sent to CPU via serial","Priority handles stuck-key scenarios"]} />
            <AppCard icon="🚨" color="#f97316"        title="CPU Interrupt Controller"  items={["Multiple devices request CPU attention","Priority encoder picks highest-priority","8259A PIC chip encodes 8 IRQs → 3 bits","OS interrupt table indexed by output"]} />
            <AppCard icon="📡" color="#34d399"        title="ADC (Analog-to-Digital)"   items={["Flash ADC uses 2ⁿ comparators","Each comparator = one input line","Encoder converts thermometer code → binary","Fastest ADC architecture"]} />
            <AppCard icon="🔀" color={COLORS.purple}  title="Multiplexer Control"       items={["Select lines for MUX/DEMUX","Encoder generates select bits","Reduces control wires","Used in memory address logic"]} />
          </div>
        </Section>

        {/* ── Section 7: Quiz ── */}
        <Section title="🧪 Test Yourself — Quiz with Hints & Streaks" accent={COLORS.indigo}>
          <Quiz questions={ENCODER_QUIZ} feedbackText={encoderQuizFeedback} />
        </Section>

      </div>

      {/* Floating tips button */}
      <TipsPanel tips={ENCODER_TIPS} />
    </div>
  );
};

export default EncoderPage;
