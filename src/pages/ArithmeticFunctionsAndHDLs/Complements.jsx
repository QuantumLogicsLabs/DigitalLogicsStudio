import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";
import AFHDLSection from "./components/AFHDLSection";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";
import { cleanBin } from "../../utils/arithmeticHelpers";

const Complements = () => {
  const [value, setValue] = useState("1011");
  const [showInfo, setShowInfo] = useState(false);
  const bin = cleanBin(value);
  const ones = bin
    .split("")
    .map((c) => (c === "1" ? "0" : "1"))
    .join("");
  const twos = (parseInt(ones || "0", 2) + 1).toString(2);
  return (
    <ToolLayout
      title="1's and 2's Complements"
      subtitle="Foundations of signed number representation"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.complements}
      />

      <ExplanationBlock title="Complement concepts">
        <p>
          1's complement inverts each bit. 2's complement adds 1 to the 1's
          complement. Handles negative numbers with a single zero issue in 1's
          complement and easy arithmetic in 2's complement.
        </p>
      </ExplanationBlock>

      <ControlPanel>
        <ControlGroup label="Binary input">
          <input
            className="tool-input"
            value={value}
            onChange={(e) => setValue(cleanBin(e.target.value))}
          />
        </ControlGroup>
      </ControlPanel>

      <div className="info-card">
        <p>1's complement: {ones || "0"}</p>
        <p>2's complement: {twos || "0"}</p>
        <button
          className="kmap-btn kmap-btn-secondary"
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? "Hide" : "Show"} complement rules
        </button>
        {showInfo && (
          <div className="info-card" style={{ marginTop: 10 }}>
            <p>1's complement: flip all bits.</p>
            <p>2's complement: add 1 to 1's complement.</p>
            <p>Common for signed negative numbers in hardware.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default Complements;
