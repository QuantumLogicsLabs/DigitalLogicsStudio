import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import AFHDLSection from "./components/AFHDLSection";
import AFHDLCopyButton from "./components/AFHDLCopyButton";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";

const DesignApplications = () => {
  const [showChecklist, setShowChecklist] = useState(false);
  return (
    <ToolLayout
      title="Design Applications"
      subtitle="Using arithmetic building blocks in real systems"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.applications}
      />

      <ExplanationBlock title="Typical digital system applications">
        <p>
          Binary adders, subtractors, comparators and multipliers are the heart
          of ALUs, digital signal processors, control units and embedded
          systems. Design apps: calculator, CPU datapath, arithmetic
          co-processor, address generation, parity-based memory protection.
        </p>
        <ol>
          <li>
            Use half/full adders to make n-bit ripple carry and carry lookahead
            adders.
          </li>
          <li>
            Use adder + XOR + carry-in to implement adder/subtractor with one
            control bit.
          </li>
          <li>
            Use comparator logic for branch and conditional execution in CPU.
          </li>
          <li>
            Use parity generator/checker for memory and network link integrity
            checks.
          </li>
        </ol>
      </ExplanationBlock>
      <ExplanationBlock title="Interactive checklist">
        <p>Add theoretical or project notes here from your design practice.</p>
        <button
          className="kmap-btn kmap-btn-secondary"
          onClick={() => setShowChecklist(!showChecklist)}
        >
          {showChecklist ? "Hide" : "Show"} advanced use cases
        </button>
        {showChecklist && (
          <div className="info-card" style={{ marginTop: 10 }}>
            <p>
              - Build an ALU pipeline: input registers → adder/subtractor →
              shifter → comparator.
            </p>
            <p>
              - Implement overflow detection and signed/unsigned mode switch.
            </p>
            <p>- Use parity generation for data integrity in block transfer.</p>
          </div>
        )}
      </ExplanationBlock>
    </ToolLayout>
  );
};

export default DesignApplications;
