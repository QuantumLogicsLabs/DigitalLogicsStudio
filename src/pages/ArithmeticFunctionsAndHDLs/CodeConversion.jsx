import React, { useMemo, useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";

import AFHDLSection from "./components/AFHDLSection";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";
import { cleanBin } from "../../utils/arithmeticHelpers";

const CodeConversion = () => {
  const [bin, setBin] = useState("101101");
  const [showExplain, setShowExplain] = useState(false);

  const values = useMemo(() => {
    const b = cleanBin(bin);
    if (!b) return { bin: "0", dec: "0", hex: "0" };
    const dec = parseInt(b, 2);
    return { bin: b, dec: String(dec), hex: dec.toString(16).toUpperCase() };
  }, [bin]);

  return (
    <ToolLayout
      title="Code Conversion"
      subtitle="Binary, decimal, hexadecimal conversion"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.conversion}
      />

      <ExplanationBlock title="Convert binary to common codes">
        <p>
          Type binary and view decimal and hexadecimal values. Supports unsigned
          conversion and step-by-step reference values.
        </p>
      </ExplanationBlock>

      <ControlPanel>
        <ControlGroup label="Binary input">
          <input
            className="tool-input"
            value={bin}
            onChange={(e) => setBin(cleanBin(e.target.value))}
          />
        </ControlGroup>
      </ControlPanel>

      <div className="info-card">
        <p>Binary: {values.bin}</p>
        <p>Decimal: {values.dec}</p>
        <p>Hex: {values.hex}</p>
        <button
          className="kmap-btn kmap-btn-secondary"
          onClick={() => setShowExplain(!showExplain)}
        >
          {showExplain ? "Hide" : "Show"} conversion notes
        </button>
        {showExplain && (
          <div className="info-card" style={{ marginTop: 10 }}>
            <h4>Conversion notes</h4>
            <p>Decimal = sum of bits × powers of 2.</p>
            <p>Hex = group bits in 4, then map to 0–F.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default CodeConversion;
