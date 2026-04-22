/**
 * DecoderPage.jsx — Main page component for the Decoder topic
 *
 * This file is intentionally thin: it only wires together the smaller
 * components and sections.  All data lives in decoderData.js; all
 * sub-components live in ./components/.
 *
 * Section layout:
 *   1. Concept & Minterm Explorer
 *   2. Step-by-step Equation Builder
 *   3. Interactive Simulator (type-selectable)
 *   4. 7-Segment Live BCD Demo
 *   5. Decoder as Function Generator
 *   6. Cascading Decoders
 *   7. Real-World Applications
 *   8. Quiz
 */
import React, { useState } from "react";

// ── Shared components ──────────────────────────────────────────────────────────
import Section   from "../shared/components/Section.jsx";
import Quiz      from "../shared/components/Quiz.jsx";
import TipsPanel from "../shared/components/TipsPanel.jsx";

// ── Decoder-specific components ────────────────────────────────────────────────
import TypeSelector          from "./components/TypeSelector.jsx";
import DecoderSimulator      from "./components/DecoderSimulator.jsx";
import FunctionGeneratorDemo from "./components/FunctionGeneratorDemo.jsx";
import BCDDigitPad           from "./components/BCDDigitPad.jsx";
import MintermEquationBuilder from "./components/MintermEquationBuilder.jsx";
import CascadingExplainer    from "./components/CascadingExplainer.jsx";

// ── Data ───────────────────────────────────────────────────────────────────────
import {
  DECODER_TYPES,
  DECODER_TIPS,
  DECODER_QUIZ,
  decoderQuizFeedback,
} from "./decoderData.js";

// ─── Real-world application card ───────────────────────────────────────────────
const AppCard = ({ icon, color, title, items }) => (
  <div
    style={{
      background: "rgba(12,18,35,0.7)",
      border: `1px solid ${color}25`,
      borderRadius: "12px",
      padding: "18px",
    }}
  >
    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{icon}</div>
    <h5 style={{ color, marginBottom: "12px", fontSize: "0.88rem", fontWeight: "700" }}>
      {title}
    </h5>
    <ul style={{ color: "#6b7280", paddingLeft: "18px", margin: 0, lineHeight: "1.7", fontSize: "0.83rem" }}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────
const DecoderPage = () => {
  const [selectedType, setSelectedType] = useState("2to4");
  // inputVals is shared across the simulator — up to 4 bits
  const [inputVals, setInputVals] = useState(Array(4).fill(0));

  const handleTypeChange = (key) => {
    setSelectedType(key);
    setInputVals(Array(4).fill(0)); // reset inputs when switching decoder type
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ color: "#e2e8f0", marginBottom: "8px", fontSize: "1.6rem" }}>
        🔓 Binary Decoders
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "32px", lineHeight: "1.65" }}>
        A decoder converts a binary code to a unique one-hot output.
        Explore the interactive simulator, Boolean equations, and real-world applications below.
      </p>

      {/* ── 1: Concept & Minterm Explorer ── */}
      <Section title="🧠 What Is a Decoder?" accent="#6366f1">
        <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.65", marginBottom: "18px" }}>
          A decoder takes an n-bit binary code and asserts exactly one of 2ⁿ output lines HIGH.
          Each output corresponds to exactly one minterm of the input variables.
        </p>
        <MintermEquationBuilder />
      </Section>

      {/* ── 2: Simulator ── */}
      <Section title="🎮 Interactive Decoder Simulator" accent="#60a5fa">
        <TypeSelector
          selectedType={selectedType}
          types={DECODER_TYPES}
          onChange={handleTypeChange}
        />
        <div
          style={{
            color: "#6b7280", fontSize: "0.8rem", marginBottom: "14px",
            padding: "8px 12px", background: "rgba(251,191,36,0.05)",
            border: "1px solid rgba(251,191,36,0.15)", borderRadius: "8px",
          }}
        >
          💡 <em>Analogy: {DECODER_TYPES[selectedType].analogy}</em>
        </div>
        <DecoderSimulator
          key={selectedType}
          selectedType={selectedType}
          inputVals={inputVals}
          setInputVals={setInputVals}
          types={DECODER_TYPES}
        />
      </Section>

      {/* ── 3: 7-Segment Demo ── */}
      <Section title="🔢 7-Segment Display — Live BCD Demo" accent="#00ff88">
        <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "18px" }}>
          A BCD-to-7-segment decoder converts a 4-bit BCD number to 7 segment control signals.
          Click any digit to see which segments light up.
        </p>
        <BCDDigitPad />
      </Section>

      {/* ── 4: Function Generator ── */}
      <Section title="🧩 Decoder as Function Generator — Zero Extra Gates!" accent="#a78bfa">
        <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "18px" }}>
          Since each output = one minterm, you can implement ANY Boolean function using a
          decoder + a single OR gate. No K-map simplification needed!
        </p>
        <FunctionGeneratorDemo />
      </Section>

      {/* ── 5: Cascading ── */}
      <Section title="🔗 Cascading Decoders — Building Larger Decoders" accent="#fbbf24">
        <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "18px" }}>
          Need 16 outputs but only have 2-to-4 decoders? Cascade them! One top-level decoder
          selects which child decoder is active using the high address bits.
        </p>
        <CascadingExplainer />
      </Section>

      {/* ── 6: Real-World ── */}
      <Section title="🌍 Real-World Applications" accent="#34d399">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
          <AppCard icon="🧠" color="#60a5fa" title="Memory Address Decoding"
            items={["CPU n-bit address → decoder inputs","Each output selects one memory chip","Only active chip drives the bus","74LS138 is the classic chip"]} />
          <AppCard icon="📟" color="#00ff88" title="7-Segment Display (74LS47)"
            items={["BCD from counter register","Decoder drives each LED segment","Used in clocks, meters, scoreboards","Handles all 10 decimal digits"]} />
          <AppCard icon="🔀" color="#a78bfa" title="DEMUX (Demultiplexer)"
            items={["Enable pin = data input line","Address selects destination output","Reconstructs TDM multiplexed signals","Same IC as decoder!"]} />
          <AppCard icon="⚙️" color="#f97316" title="CPU Instruction Decoder"
            items={["Opcode bits → decoder inputs","Each output activates one micro-op","Drives ALU and register controls","Core of hardwired control units"]} />
        </div>
      </Section>

      {/* ── 7: Quiz ── */}
      <Section title="🧪 Test Yourself — Quiz with Hints & Streaks" accent="#6366f1">
        <Quiz questions={DECODER_QUIZ} feedbackText={decoderQuizFeedback} />
      </Section>

      {/* Floating tips button */}
      <TipsPanel tips={DECODER_TIPS} />
    </div>
  );
};

export default DecoderPage;
