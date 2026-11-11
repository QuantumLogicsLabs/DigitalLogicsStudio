/**
 * MuxPage.jsx — Main Multiplexer page (thin orchestrator).
 *
 * Owns top-level state:
 *   selectedType, dataVals, selVals
 *
 * Arranges sections using <Section>.
 * Contains no rendering logic itself.
 */
import React, { useState } from "react";
import CombinationalLayout from "../../CombinationalLayout";
import { COLORS } from "../shared/theme.js";
import Section from "../shared/components/Section.jsx";
import Quiz from "../shared/components/Quiz.jsx";
import TipsPanel from "../shared/components/TipsPanel.jsx";

import { MUX_TYPES, MUX_QUIZ, MUX_QUIZ_FEEDBACK, MUX_TIPS } from "./muxData.js";
import MuxTypeSelector from "./components/MuxTypeSelector.jsx";
import MuxSimulator from "./components/MuxSimulator.jsx";
import CascadingMuxDemo from "./components/CascadingMuxDemo.jsx";
import BooleanFunctionMux from "./components/BooleanFunctionMux.jsx";

const MuxPage = () => {
  const [selectedType, setSelectedType] = useState("4to1");
  const [dataVals, setDataVals] = useState(Array(8).fill(0));
  const [selVals, setSelVals]   = useState(Array(3).fill(0));

  const config = MUX_TYPES[selectedType];

  return (
    <CombinationalLayout
      title="Multiplexer"
      subtitle="Signal selection, routing control, and logic implementation"
      intro="Explore how multiplexers choose one data path from many candidates and how that selection logic becomes a versatile design primitive."
      highlights={[
        {
          title: "Digital Switching",
          text: "Understand how select lines choose a single active route through the circuit.",
        },
        {
          title: "Function Realization",
          text: "Implement arbitrary Boolean behavior by wiring truth-table values into MUX inputs.",
        },
        {
          title: "Scalable Design",
          text: "Study cascading patterns that grow small multiplexers into larger routing networks.",
        },
      ]}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "inherit" }}>

      {/* Type selector */}
      <MuxTypeSelector selectedType={selectedType} types={MUX_TYPES} onChange={(k) => { setSelectedType(k); setDataVals(Array(8).fill(0)); setSelVals(Array(3).fill(0)); }} />

      {/* Concept & analogy */}
      <Section title={`${config.label} — Concept`} icon="💡" accentColor={COLORS.indigo}>
        <p style={{ color: COLORS.textSecondary, fontSize: "0.9rem", lineHeight: "1.65", marginBottom: "10px" }}>
          {config.description}
        </p>
        <div style={{ padding: "12px 16px", background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "10px" }}>
          <span style={{ color: COLORS.warn, fontWeight: "700", fontSize: "0.8rem" }}>🌍 REAL-WORLD ANALOGY: </span>
          <span style={{ color: COLORS.textSecondary, fontSize: "0.85rem" }}>{config.analogy}</span>
        </div>
      </Section>

      {/* Interactive simulator */}
      <Section title="Interactive Simulator" icon="🎮" accentColor={COLORS.high}>
        <MuxSimulator
          config={config}
          dataVals={dataVals}
          setDataVals={setDataVals}
          selVals={selVals}
          setSelVals={setSelVals}
        />
      </Section>

      {/* Boolean function implementation */}
      <Section title="MUX as a Universal Logic Element" icon="🔧" accentColor={COLORS.purple}>
        <p style={{ color: COLORS.textSecondary, fontSize: "0.88rem", lineHeight: "1.65", marginBottom: "18px" }}>
          Any Boolean function can be implemented with a single MUX by tying its data inputs to
          constants (0 or 1) that match the function's truth table output column.
          Try clicking the cells below to define your own function!
        </p>
        <BooleanFunctionMux />
      </Section>

      {/* Cascading demo */}
      <Section title="Cascading MUXes" icon="🔗" accentColor={COLORS.warn}>
        <p style={{ color: COLORS.textSecondary, fontSize: "0.88rem", lineHeight: "1.65", marginBottom: "18px" }}>
          Need a MUX with more inputs? Join smaller ones together. Two 4-to-1 MUXes plus one
          2-to-1 MUX work together as a single 8-to-1 MUX. Each time you double the number of
          inputs, you need just one more select line.
        </p>
        <CascadingMuxDemo />
      </Section>

      {/* Quiz */}
      <Section title="Knowledge Check" icon="🧠" accentColor={COLORS.blue}>
        <Quiz questions={MUX_QUIZ} feedbackText={MUX_QUIZ_FEEDBACK} />
      </Section>

      <TipsPanel tips={MUX_TIPS} />
    </div>
    </CombinationalLayout>
  );
};

export default MuxPage;
