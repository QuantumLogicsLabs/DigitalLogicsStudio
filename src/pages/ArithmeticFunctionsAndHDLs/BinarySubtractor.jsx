import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";
import AFHDLSection from "./components/AFHDLSection";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";
import { cleanBin, binarySubtract } from "../../utils/arithmeticHelpers";

const BinarySubtractor = () => {
  const [a, setA] = useState("1100");
  const [b, setB] = useState("0011");
  const [showDetails, setShowDetails] = useState(false);
  const result = binarySubtract(a, b);

  return (
    <ToolLayout
      title="Binary Subtractor"
      subtitle="Subtraction and borrow logic"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.subtractor}
      />

      <ExplanationBlock title="How binary subtraction works">
        <p>
          Subtract B from A in binary, with borrow bit when A&lt;B. A-B result
          can be represented as two's complement if needed.
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
        <p>Difference = {result.diff}</p>
        <p>Borrow = {result.borrow}</p>
        <button
          className="kmap-btn kmap-btn-secondary"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide" : "Show"} subtraction explanation
        </button>
        {showDetails && (
          <div className="info-card" style={{ marginTop: 10 }}>
            <h4>Subtraction details</h4>
            <p>1. Compare A and B bit by bit from LSB, borrow if needed.</p>
            <p>2. Borrow is taken when current A bit is 0 and B bit is 1.</p>
            <p>
              3. The subtraction result can be moved to two's complement if
              negative.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default BinarySubtractor;
