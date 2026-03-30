import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";

import AFHDLSection from "./components/AFHDLSection";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";
import { cleanBin, parity } from "../../utils/arithmeticHelpers";

const ParityGenerators = () => {
  const [bits, setBits] = useState("101001");
  const [showHelp, setShowHelp] = useState(false);
  const even = parity(bits, "even");
  const odd = parity(bits, "odd");

  return (
    <ToolLayout
      title="Parity Generators / Checkers"
      subtitle="Even and odd parity for error detection"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.parity}
      />

      <ExplanationBlock title="Parity basics">
        <p>
          Even parity: total number of 1s must be even. Odd parity: total number
          of 1s must be odd. Check bits are widely used for simple error
          detection in memory and communication links.
        </p>
      </ExplanationBlock>

      <ControlPanel>
        <ControlGroup label="Bit string">
          <input
            className="tool-input"
            value={bits}
            onChange={(e) => setBits(cleanBin(e.target.value))}
          />
        </ControlGroup>
      </ControlPanel>

      <div className="info-card">
        <p>Even parity check: {even}</p>
        <p>Odd parity check: {odd}</p>
        <button
          className="kmap-btn kmap-btn-secondary"
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? "Hide" : "Show"} usage example
        </button>
        {showHelp && (
          <div className="info-card" style={{ marginTop: 10 }}>
            <p>
              Example: 101001 has 3 ones so odd parity = OK, even parity =
              Error.
            </p>
            <p>
              Set parity bit to enforce a desired parity and detect single-bit
              error.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default ParityGenerators;
