import React from "react";
import BALayout from "./BALayout";

const InfoCards = () => (
  <div className="comparison-grid">
    <div className="info-card">
      <h4>Variables & Combinations</h4>
      <ul>
        <li>
          <strong>Literal:</strong> A variable (A) or its complement (A')
        </li>
        <li>
          <strong>Minterm:</strong> A product term (AND) containing all
          variables
        </li>
        <li>
          <strong>Maxterm:</strong> A sum term (OR) containing all variables
        </li>
      </ul>
    </div>
    <div className="key-insight">
      <h4>Standard Operators</h4>
      <ul>
        <li>
          <strong>AND (&, •):</strong> 1 only if all inputs are 1
        </li>
        <li>
          <strong>OR (|, +):</strong> 1 if at least one input is 1
        </li>
        <li>
          <strong>NOT (!, '):</strong> Inverts the input (0→1, 1→0)
        </li>
        <li>
          <strong>XOR (^):</strong> 1 if inputs are different
        </li>
      </ul>
    </div>
  </div>
);

const BooleanAlgebraOverview = () => (
  <BALayout
    title="Boolean Algebra"
    subtitle="Interactive Logic Explorer"
    intro="Boolean Algebra is a mathematical system developed by George Boole in 1854 that forms the foundation of digital logic and computer science. It deals with binary variables (0 and 1) and logical operations that model how digital circuits process information."
    highlights={[
      {
        title: "Binary Variables",
        text: "Every value is either 0 or 1 — false or true, off or on.",
      },
      {
        title: "Three Operations",
        text: "AND, OR, and NOT combine to express any logic function.",
      },
      {
        title: "Circuit Foundation",
        text: "Every gate, flip-flop, and processor is built from these rules.",
      },
    ]}
  >
    <section className="ba-section">
      <div className="ba-section-header">
        <h2 className="ba-section-title">What is Boolean Algebra?</h2>
      </div>
      <InfoCards />
    </section>

    <section className="ba-section">
      <div className="ba-section-header">
        <h2 className="ba-section-title">Why It Matters</h2>
      </div>
      <div className="comparison-grid">
        <div className="info-card">
          <h4>Digital Design</h4>
          <p className="explanation-intro">
            Every AND gate, OR gate, and flip-flop in your CPU implements a
            Boolean operation. Mastering these rules is mastering hardware
            design.
          </p>
        </div>
        <div className="info-card">
          <h4>Circuit Optimization</h4>
          <p className="explanation-intro">
            Boolean identities let designers reduce gate count, cut power
            consumption, and shorten propagation delays — saving millions of
            transistors at scale.
          </p>
        </div>
        <div className="info-card">
          <h4>Universal Language</h4>
          <p className="explanation-intro">
            From VHDL and Verilog to logic synthesis tools, Boolean algebra is
            the common language spoken by every layer of the digital stack.
          </p>
        </div>
      </div>
    </section>
  </BALayout>
);

export default BooleanAlgebraOverview;
