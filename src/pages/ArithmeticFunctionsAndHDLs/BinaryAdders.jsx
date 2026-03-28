import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";
import AFHDLSection from "./components/AFHDLSection";
import AFHDLCard from "./components/AFHDLCard";
import AFHDLToggle from "./components/AFHDLToggle";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";
import {
  cleanBin,
  halfAdder,
  fullAdder,
  binaryAdd,
} from "../../utils/arithmeticHelpers";

const BinaryAdders = () => {
  const [a, setA] = useState("1010");
  const [b, setB] = useState("0101");
  const [cin, setCin] = useState("0");
  const [showSteps, setShowSteps] = useState(false);

  const h = halfAdder(a.slice(-1), b.slice(-1));
  const f = fullAdder(a.slice(-1), b.slice(-1), cin);
  const ripple = binaryAdd(a, b, cin);

  return (
    <ToolLayout
      title="Binary Adders"
      subtitle="Half adder, full adder, ripple carry and CLA concept"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.adders}
      />

      <ExplanationBlock title="What is an Adder?">
        <p>
          Binary adders compute sum and carry bits for digital circuits. Start
          with half adder and full adder, then build a ripple carry chain. Carry
          Lookahead Adder (CLA) reduces delay by precomputing generate and
          propagate signals.
        </p>
      </ExplanationBlock>

      <ControlPanel>
        <ControlGroup label="A (binary)">
          <input
            className="tool-input"
            value={a}
            onChange={(e) => setA(cleanBin(e.target.value))}
          />
        </ControlGroup>
        <ControlGroup label="B (binary)">
          <input
            className="tool-input"
            value={b}
            onChange={(e) => setB(cleanBin(e.target.value))}
          />
        </ControlGroup>
        <ControlGroup label="Carry in">
          <input
            className="tool-input"
            maxLength={1}
            value={cin}
            onChange={(e) => setCin(cleanBin(e.target.value).slice(-1) || "0")}
          />
        </ControlGroup>
      </ControlPanel>

      <AFHDLCard
        title="Adder results"
        subtitle="Half adder, full adder, and ripple-carry outputs"
      >
        <p>
          Half adder (LSB): sum = {h.sum}, carry = {h.carry}
        </p>
        <p>
          Full adder (LSB): sum = {f.sum}, carry = {f.carry}
        </p>
        <p>
          Ripple carry adder result: sum = {ripple.sum}, carry out ={" "}
          {ripple.carry}
        </p>
        <p>
          CLA signals: generate = A&B, propagate = A^B; C[i+1]=G[i]+P[i]*C[i].
        </p>
      </AFHDLCard>

      <AFHDLToggle
        checked={showSteps}
        label="Show step-by-step guide"
        onChange={() => setShowSteps(!showSteps)}
      />

      {showSteps && (
        <AFHDLCard title="Step-by-step details">
          <p>1. Align input bit widths to same length.</p>
          <p>2. Compute bit sum and carry at each stage.</p>
          <p>3. Ripple carry waits for the previous stage carry.</p>
          <p>4. CLA precomputes Gi/Pi to reduce delay.</p>
        </AFHDLCard>
      )}
    </ToolLayout>
  );
};

export default BinaryAdders;
