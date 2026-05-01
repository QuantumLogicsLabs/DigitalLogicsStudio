import React, { useMemo, useState } from "react";
import ControlGroup from "../../components/ControlGroup";
import ControlPanel from "../../components/ControlPanel";
import { binaryMultiply, cleanBin } from "../../utils/arithmeticHelpers";
import AFHDLLayout from "./components/AFHDLLayout";
import AFHDLActionRow from "./components/AFHDLActionRow";
import AFHDLCardGroup from "./components/AFHDLCardGroup";
import AFHDLInfoPanel from "./components/AFHDLInfoPanel";
import AFHDLSection from "./components/AFHDLSection";
import AFHDLStepList from "./components/AFHDLStepList";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";

const BinaryMultipliers = () => {
  const [a, setA] = useState("101");
  const [b, setB] = useState("011");
  const [showGuide, setShowGuide] = useState(false);

  const product = binaryMultiply(a, b);

  const partialProducts = useMemo(() => {
    const cleanA = cleanBin(a) || "0";
    const cleanB = cleanBin(b) || "0";

    return cleanB
      .split("")
      .reverse()
      .map((bit, index) => ({
        bit,
        shifted: bit === "1" ? `${cleanA}${"0".repeat(index)}` : "0",
      }));
  }, [a, b]);

  return (
    <AFHDLLayout
      title="Binary Multipliers"
      subtitle="Learn multiplication as repeated shift-and-add operations."
      intro="This page turns multiplication into three simple actions: choose the active multiplier bits, shift the multiplicand into place, and add the partial products."
      highlights={[
        {
          title: "What beginners should notice",
          text: "Each 1 in the multiplier means “include this shifted copy of A”. Each 0 means “skip it”.",
        },
        {
          title: "Why it matters",
          text: "The same idea appears in hardware multipliers, array multipliers, and many ALU datapaths.",
        },
      ]}
    >
      <AFHDLSection
        kicker="Concept"
        title="Binary multiplication rule"
        description={arithmeticDescriptions.multiplier}
      >
        <p>
          Start at the least significant bit of the multiplier. For every bit
          that is <strong>1</strong>, place a shifted copy of the multiplicand
          into the sum. For every bit that is <strong>0</strong>, that row
          contributes nothing.
        </p>
      </AFHDLSection>

      <ControlPanel>
        <ControlGroup label="Multiplicand A">
          <input
            className="tool-input"
            value={a}
            onChange={(event) => setA(cleanBin(event.target.value))}
          />
        </ControlGroup>
        <ControlGroup label="Multiplier B">
          <input
            className="tool-input"
            value={b}
            onChange={(event) => setB(cleanBin(event.target.value))}
          />
        </ControlGroup>
      </ControlPanel>

      <AFHDLCardGroup>
        <AFHDLInfoPanel title="Binary product" content={`A × B = ${product}`} />
        <AFHDLInfoPanel
          title="Decimal check"
          content={`${parseInt(cleanBin(a) || "0", 2)} × ${parseInt(cleanBin(b) || "0", 2)} = ${parseInt(product || "0", 2)}`}
        />
      </AFHDLCardGroup>

      <AFHDLSection
        kicker="Worked Example"
        title="See the partial products"
        description="Use the rows below to see exactly which shifted copies of A are included."
      >
        <AFHDLCardGroup>
          {partialProducts.map((row, index) => (
            <AFHDLInfoPanel
              key={`${row.bit}-${index}`}
              title={`Bit ${index} of B = ${row.bit}`}
              content={
                row.bit === "1"
                  ? `Include ${row.shifted}`
                  : "This row adds 0 because the multiplier bit is 0."
              }
            />
          ))}
        </AFHDLCardGroup>

        <AFHDLActionRow>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setShowGuide((value) => !value)}
          >
            {showGuide ? "Hide" : "Show"} step-by-step guide
          </button>
        </AFHDLActionRow>

        {showGuide ? (
          <AFHDLSection
            title="How to solve it by hand"
            description="Follow the same procedure your circuit follows internally."
          >
            <AFHDLStepList
              steps={[
                "Read the multiplier from right to left so each bit lines up with its place value.",
                "Write a shifted copy of A only when the current multiplier bit is 1.",
                "Add the partial products together to get the final binary result.",
              ]}
            />
          </AFHDLSection>
        ) : null}
      </AFHDLSection>
    </AFHDLLayout>
  );
};

export default BinaryMultipliers;
