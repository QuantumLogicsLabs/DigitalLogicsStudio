import React, { useMemo, useState } from "react";
import ToolLayout from "../components/ToolLayout";
import ExplanationBlock from "../components/ExplanationBlock";
import ControlPanel from "../components/ControlPanel";
import ControlGroup from "../components/ControlGroup";

const cleanBin = (v) => v.trim().replace(/[^01]/g, "");

const halfAdder = (a, b) => {
  const A = Number(a);
  const B = Number(b);
  return { sum: (A ^ B).toString(), carry: (A & B).toString() };
};

const fullAdder = (a, b, cin) => {
  const A = Number(a);
  const B = Number(b);
  const C = Number(cin);
  const sum = A ^ B ^ C;
  const carry = (A & B) | (B & C) | (A & C);
  return { sum: sum.toString(), carry: carry.toString() };
};

const binaryAdd = (a, b, cin = "0") => {
  const x = cleanBin(a);
  const y = cleanBin(b);
  const n = Math.max(x.length, y.length);
  let carry = Number(cin);
  let result = "";
  for (let i = 0; i < n; i++) {
    const ai = Number(x[x.length - 1 - i] || "0");
    const bi = Number(y[y.length - 1 - i] || "0");
    const fa = fullAdder(ai, bi, carry);
    result = fa.sum + result;
    carry = Number(fa.carry);
  }
  return { sum: (carry ? "1" : "") + result, carry: carry.toString() };
};

const binarySubtract = (a, b) => {
  const A = parseInt(cleanBin(a) || "0", 2);
  const B = parseInt(cleanBin(b) || "0", 2);
  const diff = A - B;
  const signed = diff < 0 ? "-" : "";
  const abs = Math.abs(diff);
  return { diff: signed + abs.toString(2), borrow: A < B ? "1" : "0" };
};

const binaryMultiply = (a, b) => {
  const A = parseInt(cleanBin(a) || "0", 2);
  const B = parseInt(cleanBin(b) || "0", 2);
  const p = A * B;
  return p.toString(2);
};

const compareMagnitude = (a, b) => {
  const A = parseInt(cleanBin(a) || "0", 2);
  const B = parseInt(cleanBin(b) || "0", 2);
  if (A > B) return "A > B";
  if (A < B) return "A < B";
  return "A = B";
};

const parity = (s, type) => {
  const bits = cleanBin(s)
    .split("")
    .map((v) => Number(v));
  const sum = bits.reduce((acc, v) => acc + v, 0);
  if (type === "even") return sum % 2 === 0 ? "OK" : "Error";
  return sum % 2 === 1 ? "OK" : "Error";
};

const uSignedValue = (s, signed = false) => {
  const n = cleanBin(s).length;
  if (n === 0) return 0;
  const u = parseInt(cleanBin(s), 2);
  if (!signed) return u;
  const msb = s[0] === "1";
  return msb ? u - Math.pow(2, n) : u;
};

const ArithmeticFunctions = () => {
  const [a, setA] = useState("1011");
  const [b, setB] = useState("0101");
  const [cin, setCin] = useState("0");
  const [value, setValue] = useState("1011");
  const [compareA, setCompareA] = useState("1001");
  const [compareB, setCompareB] = useState("0110");
  const [parityBits, setParityBits] = useState("101010");
  const [signedMode, setSignedMode] = useState("unsigned");
  const [mathOp, setMathOp] = useState("add");

  const half = halfAdder(a.slice(-1) || "0", b.slice(-1) || "0");
  const full = fullAdder(a.slice(-1) || "0", b.slice(-1) || "0", cin);
  const ripple = binaryAdd(a, b, cin);
  const subtotal = binarySubtract(a, b);
  const mult = binaryMultiply(a, b);
  const comparator = compareMagnitude(compareA, compareB);
  const parityEven = parity(parityBits, "even");
  const parityOdd = parity(parityBits, "odd");
  const complement1 = cleanBin(value)
    .split("")
    .map((bit) => (bit === "1" ? "0" : "1"))
    .join("");
  const complement2 = (parseInt(complement1 || "0", 2) + 1).toString(2);

  const converter = useMemo(() => {
    if (!value) return { bin: "-", dec: "-", hex: "-" };
    const binary = cleanBin(value);
    if (binary.length === 0) return { bin: "-", dec: "-", hex: "-" };
    const dec = parseInt(binary, 2);
    return {
      bin: binary,
      dec: String(dec),
      hex: dec.toString(16).toUpperCase(),
    };
  }, [value]);

  const opResult = useMemo(() => {
    const aVal = uSignedValue(a, signedMode === "signed");
    const bVal = uSignedValue(b, signedMode === "signed");
    let result;
    switch (mathOp) {
      case "add":
        result = aVal + bVal;
        break;
      case "subtract":
        result = aVal - bVal;
        break;
      case "multiply":
        result = aVal * bVal;
        break;
      case "divide":
        if (bVal === 0) return "Division by zero";
        result = Math.floor(aVal / bVal);
        break;
      default:
        result = 0;
    }
    return `${result} (bin ${result >= 0 ? result.toString(2) : "-" + Math.abs(result).toString(2)})`;
  }, [a, b, signedMode, mathOp]);

  return (
    <ToolLayout
      title="Arithmetic Functions and HDL"
      subtitle="Interactive exploration of adders, subtraction, multiplication, code conversion, and number systems"
    >
      <ExplanationBlock title="Binary Adders (Half / Full / Ripple / CLA)">
        <p>Input A and B as binary numbers and optional carry-in.</p>
        <ControlPanel>
          <ControlGroup label="A (bin)">
            <input value={a} onChange={(e) => setA(cleanBin(e.target.value))} />
          </ControlGroup>
          <ControlGroup label="B (bin)">
            <input value={b} onChange={(e) => setB(cleanBin(e.target.value))} />
          </ControlGroup>
          <ControlGroup label="Carry-in">
            <input
              value={cin}
              maxLength={1}
              onChange={(e) => setCin(e.target.value.replace(/[^01]/g, ""))}
            />
          </ControlGroup>
        </ControlPanel>
        <div className="info-card">
          <p>
            Half adder (LSB): sum={half.sum}, carry={half.carry}
          </p>
          <p>
            Full adder (LSB with carry-in): sum={full.sum}, carry={full.carry}
          </p>
          <p>
            Ripple carry add result: {ripple.sum} (carry-out = {ripple.carry})
          </p>
          <p>Carry Lookahead demonstration (computed by G/P):</p>
          <p>
            G_{a}=A&amp;B, P_{a}=A^B
          </p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Binary Subtractor and Adder/Subtractor">
        <p>Subtraction uses two’s complement or borrow logic.</p>
        <div className="info-card">
          <p>
            A - B result = {subtotal.diff} (borrow={subtotal.borrow})
          </p>
          <p>
            Adder/Subtractor mode can also be implemented with a mode bit; this
            section uses direct decimal from sign-aware interpretation.
          </p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Binary Multipliers">
        <ControlPanel>
          <ControlGroup label="Multiplier A">
            <input value={a} onChange={(e) => setA(cleanBin(e.target.value))} />
          </ControlGroup>
          <ControlGroup label="Multiplier B">
            <input value={b} onChange={(e) => setB(cleanBin(e.target.value))} />
          </ControlGroup>
        </ControlPanel>
        <div className="info-card">
          <p>A × B = {mult}</p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Code Conversion">
        <ControlPanel>
          <ControlGroup label="Binary value">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^01]/g, ""))}
            />
          </ControlGroup>
        </ControlPanel>
        <div className="info-card">
          <p>Binary: {converter.bin}</p>
          <p>Decimal: {converter.dec}</p>
          <p>Hexadecimal: {converter.hex}</p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Magnitude Comparator">
        <ControlPanel>
          <ControlGroup label="A (bin)">
            <input
              value={compareA}
              onChange={(e) => setCompareA(cleanBin(e.target.value))}
            />
          </ControlGroup>
          <ControlGroup label="B (bin)">
            <input
              value={compareB}
              onChange={(e) => setCompareB(cleanBin(e.target.value))}
            />
          </ControlGroup>
        </ControlPanel>
        <div className="info-card">
          <p>Comparison: {comparator}</p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Parity Generators / Checkers">
        <ControlPanel>
          <ControlGroup label="Bit sequence">
            <input
              value={parityBits}
              onChange={(e) => setParityBits(cleanBin(e.target.value))}
            />
          </ControlGroup>
        </ControlPanel>
        <div className="info-card">
          <p>Even parity check: {parityEven}</p>
          <p>Odd parity check: {parityOdd}</p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="1's and 2's Complements">
        <ControlPanel>
          <ControlGroup label="Binary value">
            <input
              value={value}
              onChange={(e) => setValue(cleanBin(e.target.value))}
            />
          </ControlGroup>
        </ControlPanel>
        <div className="info-card">
          <p>1's complement: {complement1 || "-"}</p>
          <p>2's complement: {complement2 || "-"}</p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Unsigned and Signed Arithmetic Operations">
        <ControlPanel>
          <ControlGroup label="Signed mode">
            <select
              value={signedMode}
              onChange={(e) => setSignedMode(e.target.value)}
            >
              <option value="unsigned">Unsigned</option>
              <option value="signed">Two's complement</option>
            </select>
          </ControlGroup>
          <ControlGroup label="Operation">
            <select value={mathOp} onChange={(e) => setMathOp(e.target.value)}>
              <option value="add">Addition</option>
              <option value="subtract">Subtraction</option>
              <option value="multiply">Multiplication</option>
              <option value="divide">Division</option>
            </select>
          </ControlGroup>
        </ControlPanel>
        <div className="info-card">
          <p>
            A ({signedMode}): {uSignedValue(a, signedMode === "signed")}
          </p>
          <p>
            B ({signedMode}): {uSignedValue(b, signedMode === "signed")}
          </p>
          <p>Result: {opResult}</p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Design Applications">
        <p>
          Use these building blocks to design ALU circuits, digital calculators,
          signal processors, and control logic. Combine half/full adders,
          subtractors, multiplexers, and comparators to make practical CPU
          datapaths.
        </p>
      </ExplanationBlock>
    </ToolLayout>
  );
};

export default ArithmeticFunctions;
