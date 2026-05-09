import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";

import AFHDLSection from "./components/AFHDLSection";
import { arithmeticDescriptions } from './utils/arithmeticDescriptions';
import { cleanBin, compareMagnitude } from "../../utils/arithmeticHelpers";

const MagnitudeComparator = () => {
  const [a, setA] = useState("1100");
  const [b, setB] = useState("1010");
  const [showDetail, setShowDetail] = useState(false);
  const status = compareMagnitude(a, b);

  return (
    <ToolLayout
      title="Magnitude Comparator"
      subtitle="Compare A and B in binary"
    >
      <AFHDLSection title="Quick summary" description={arithmeticDescriptions.comparator} />

      <ExplanationBlock title="Binary comparator behavior">
        <p>
          Output indicates A&gt;B, A&lt;B or A=B. Implemented with logic
          circuits: for n-bit compare, use cascaded equal and greater signals.
        </p>
      </ExplanationBlock>

      <ControlPanel>
        <ControlGroup label="A (binary)">
          <input className="tool-input" value={a} onChange={(e) => setA(cleanBin(e.target.value))} />
        </ControlGroup>
        <ControlGroup label="B (binary)">
          <input className="tool-input" value={b} onChange={(e) => setB(cleanBin(e.target.value))} />
        </ControlGroup>
      </ControlPanel>

      <div className="info-card">
        <p>Result: {status}</p>
        <button className="kmap-btn kmap-btn-secondary" onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? "Hide" : "Show"} fast comparator theory
        </button>
        {showDetail && (
          <div className="info-card" style={{ marginTop: 10 }}>
            <h4>Comparator formula</h4>
            <p>Hierarchy: A > B if first MSB difference is 1 vs 0. A = B when all bits equal.</p>
            <p>In hardware use bitwise equality, greater-than cascade, and generate-equal signals.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default MagnitudeComparator;


