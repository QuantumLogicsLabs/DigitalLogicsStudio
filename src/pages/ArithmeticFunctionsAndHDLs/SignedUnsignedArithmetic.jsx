import React, { useMemo, useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";
import AFHDLSection from "./components/AFHDLSection";
import AFHDLCopyButton from "./components/AFHDLCopyButton";
import AFHDLCard from "./components/AFHDLCard";
import { arithmeticDescriptions } from "./utils/arithmeticDescriptions";
import { toTwosComplement, fromTwosComplement } from "./utils/bitOperations";
import { binToDec, binToHex, binToOct } from "./utils/valueFormatter";
import {
  cleanBin,
  uSignedValue,
  binaryAdd,
  binarySubtract,
  binaryMultiply,
} from "../../utils/arithmeticHelpers";

const SignedUnsignedArithmetic = () => {
  const [a, setA] = useState("0101");
  const [b, setB] = useState("0011");
  const [signed, setSigned] = useState(false);
  const [op, setOp] = useState("add");
  const [showInfo, setShowInfo] = useState(false);

  const aVal = uSignedValue(a, signed);
  const bVal = uSignedValue(b, signed);

  const computed = useMemo(() => {
    let result = "";
    switch (op) {
      case "add":
        result = binaryAdd(a, b).sum;
        break;
      case "subtract":
        result = binarySubtract(a, b).diff;
        break;
      case "multiply":
        result = binaryMultiply(a, b);
        break;
      case "divide":
        result =
          bVal === 0 ? "divide by zero" : String(Math.floor(aVal / bVal));
        break;
      default:
        result = "";
    }
    return result;
  }, [a, b, op, aVal, bVal]);

  return (
    <ToolLayout
      title="Unsigned & Signed Arithmetic"
      subtitle="Arithmetic operations with signed and unsigned meaning"
    >
      <AFHDLSection
        title="Quick summary"
        description={arithmeticDescriptions.signedUnsigned}
      />

      <ExplanationBlock title="Signed vs unsigned values">
        <p>
          Unsigned: straightforward binary integer. Signed: two's complement
          interpretation (MSB as sign). Arithmetic can differ based on signed
          mode and overflow rules.
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
          <select
            value={signed ? "signed" : "unsigned"}
            onChange={(e) => setSigned(e.target.value === "signed")}
          >
            <option value="unsigned">Unsigned</option>
            <option value="signed">Signed (2's complement)</option>
          </select>
        </ControlGroup>
        <ControlGroup label="Operation">
          <select value={op} onChange={(e) => setOp(e.target.value)}>
            <option value="add">Addition</option>
            <option value="subtract">Subtraction</option>
            <option value="multiply">Multiplication</option>
            <option value="divide">Division</option>
          </select>
        </ControlGroup>
      </ControlPanel>

      <AFHDLCard
        title="Numeric conversion"
        subtitle="Signed and unsigned interpretations"
      >
        <p>A value = {aVal}</p>
        <p>B value = {bVal}</p>
        <p>Result = {computed}</p>
        <p>Binary A (two's complement) = {toTwosComplement(a, a.length)}</p>
        <p>Binary B (two's complement) = {toTwosComplement(b, b.length)}</p>
        <p>
          Decimal A = {binToDec(a)}, Hex A = {binToHex(a)}, Octal A ={" "}
          {binToOct(a)}
        </p>
        <p>
          Decimal B = {binToDec(b)}, Hex B = {binToHex(b)}, Octal B ={" "}
          {binToOct(b)}
        </p>
      </AFHDLCard>

      <button
        className="kmap-btn kmap-btn-secondary"
        onClick={() => setShowInfo(!showInfo)}
      >
        {showInfo ? "Hide" : "Show"} signed/unsigned guide
      </button>

      {showInfo && (
        <AFHDLCard title="Signed/Unsigned rules">
          <p>Unsigned range for n bits: 0 to (2^n - 1).</p>
          <p>Signed (two's complement) range: -(2^(n-1)) to (2^(n-1) - 1).</p>
          <p>
            Divide uses integer division; signed behavior may vary by CPU (round
            toward zero vs floor).
          </p>
          <p>A as signed from two's complement: {fromTwosComplement(a)}</p>
          <p>B as signed from two's complement: {fromTwosComplement(b)}</p>
        </AFHDLCard>
      )}
    </ToolLayout>
  );
};

export default SignedUnsignedArithmetic;
