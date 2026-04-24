import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";

import AFHDLSection from "./components/AFHDLSection";
import AFHDLCopyButton from "./components/AFHDLCopyButton";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";
import { cleanBin, binaryMultiply } from "../../utils/arithmeticHelpers";

const BinaryMultipliers = () => {
  const [a, setA] = useState("101");
  const [b, setB] = useState("011");
  const [showGuide, setShowGuide] = useState(false);
  const product = binaryMultiply(a, b);

  return (
    <ToolLayout
      title="Binary Multipliers"
      subtitle="Multiplication using binary operations"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.multiplier}
      />

      <ExplanationBlock title="Binary multiplication rules">
        <p>
          Multiply using shift-and-add method. Each bit of B selects A shifted;
          then sum partial products.
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
      </ControlPanel>

      <div className="info-card">
        <p>Product = {product}</p>
        <button
          className="kmap-btn kmap-btn-secondary"
          onClick={() => setShowGuide(!showGuide)}
        >
          {showGuide ? "Hide" : "Show"} multiplication steps
        </button>
        {showGuide && (
          <div className="info-card" style={{ marginTop: 10 }}>
            <h4>Step-by-step multiplier</h4>
            <p>1. Multiply each bit of B by A (partial product).</p>
            <p>2. Shift partial products left per bit position.</p>
            <p>3. Add all partial products to get final result.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default BinaryMultipliers;
