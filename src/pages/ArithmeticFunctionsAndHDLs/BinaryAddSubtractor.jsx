import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";

import AFHDLSection from "./components/AFHDLSection";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";
import {
  cleanBin,
  binaryAdd,
  binarySubtract,
} from "../../utils/arithmeticHelpers";

const BinaryAddSubtractor = () => {
  const [a, setA] = useState("1011");
  const [b, setB] = useState("0101");
  const [mode, setMode] = useState("add");
  const [showTips, setShowTips] = useState(false);

  const addR = binaryAdd(a, b);
  const subR = binarySubtract(a, b);
  const result =
    mode === "add"
      ? `${addR.sum} (carry=${addR.carry})`
      : `${subR.diff} (borrow=${subR.borrow})`;

  return (
    <ToolLayout
      title="Binary Adder/Subtractor"
      subtitle="Mode switch between add and subtract"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.addSub}
      />

      <ExplanationBlock title="Ad du/sbv with a mode input">
        <p>
          Use mode=0 for add, mode=1 for subtract. In hardware, XOR A with mode
          then add B and mode as carry-in for two's complement subtract.
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
        <ControlGroup label="Mode">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>
        </ControlGroup>
      </ControlPanel>

      <div className="info-card">
        <p>{mode === "add" ? "Addition mode" : "Subtraction mode"}</p>
        <p>Result: {result}</p>
        <button
          className="kmap-btn kmap-btn-secondary"
          onClick={() => setShowTips(!showTips)}
        >
          {showTips ? "Hide" : "Show"} formula tips
        </button>
        {showTips && (
          <div className="info-card" style={{ marginTop: 10 }}>
            <h4>Hardware mapping</h4>
            <p>Add mode: apply A+B and Cin=0.</p>
            <p>
              Subtract mode: XOR A with 1 (B), set Cin=1 to form 2's complement.
            </p>
            <p>This reuses adder circuitry for both operations.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default BinaryAddSubtractor;
