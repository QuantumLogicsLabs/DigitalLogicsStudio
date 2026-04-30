import React from "react";
import { Layers, GitCompare, Merge, CheckCircle, Sparkles } from "lucide-react";
import SeqLayout from "./SeqLayout";
import SeqTable from "./components/SeqTable";

const original5StateData = {
  headers: ['Present State', 'Next (x=0)', 'Next (x=1)', 'Output'],
  rows: [
    { 'Present State': 'A', 'Next (x=0)': 'B', 'Next (x=1)': 'C', 'Output': '0' },
    { 'Present State': 'B', 'Next (x=0)': 'A', 'Next (x=1)': 'D', 'Output': '0' },
    { 'Present State': 'C', 'Next (x=0)': 'B', 'Next (x=1)': 'C', 'Output': '1' },
    { 'Present State': 'D', 'Next (x=0)': 'A', 'Next (x=1)': 'D', 'Output': '0' },
    { 'Present State': 'E', 'Next (x=0)': 'B', 'Next (x=1)': 'E', 'Output': '1' }
  ]
};

const reduced3StateData = {
  headers: ['Present State', 'Next (x=0)', 'Next (x=1)', 'Output'],
  rows: [
    { 'Present State': 'A', 'Next (x=0)': 'B', 'Next (x=1)': 'C', 'Output': '0' },
    { 'Present State': 'B', 'Next (x=0)': 'A', 'Next (x=1)': 'B', 'Output': '0' },
    { 'Present State': 'C', 'Next (x=0)': 'B', 'Next (x=1)': 'C', 'Output': '1' }
  ]
};

const srExcitationData = {
  headers: ['Q', 'Q⁺', 'S', 'R'],
  rows: [
    { 'Q': '0', 'Q⁺': '0', 'S': '0', 'R': 'X' },
    { 'Q': '0', 'Q⁺': '1', 'S': '1', 'R': '0' },
    { 'Q': '1', 'Q⁺': '0', 'S': '0', 'R': '1' },
    { 'Q': '1', 'Q⁺': '1', 'S': 'X', 'R': '0' }
  ]
};

const jkExcitationData = {
  headers: ['Q', 'Q⁺', 'J', 'K'],
  rows: [
    { 'Q': '0', 'Q⁺': '0', 'J': '0', 'K': 'X' },
    { 'Q': '0', 'Q⁺': '1', 'J': '1', 'K': 'X' },
    { 'Q': '1', 'Q⁺': '0', 'J': 'X', 'K': '1' },
    { 'Q': '1', 'Q⁺': '1', 'J': 'X', 'K': '0' }
  ]
};

const dExcitationData = {
  headers: ['Q', 'Q⁺', 'D'],
  rows: [
    { 'Q': '0', 'Q⁺': '0', 'D': '0' },
    { 'Q': '0', 'Q⁺': '1', 'D': '1' },
    { 'Q': '1', 'Q⁺': '0', 'D': '0' },
    { 'Q': '1', 'Q⁺': '1', 'D': '1' }
  ]
};

const tExcitationData = {
  headers: ['Q', 'Q⁺', 'T'],
  rows: [
    { 'Q': '0', 'Q⁺': '0', 'T': '0' },
    { 'Q': '0', 'Q⁺': '1', 'T': '1' },
    { 'Q': '1', 'Q⁺': '0', 'T': '1' },
    { 'Q': '1', 'Q⁺': '1', 'T': '0' }
  ]
};

const masterExcitationData = {
  headers: ['Q → Q⁺', 'SR: (S,R)', 'JK: (J,K)', 'D', 'T'],
  rows: [
    { 'Q → Q⁺': '0 → 0', 'SR: (S,R)': '(0, X)', 'JK: (J,K)': '(0, X)', 'D': '0', 'T': '0' },
    { 'Q → Q⁺': '0 → 1', 'SR: (S,R)': '(1, 0)', 'JK: (J,K)': '(1, X)', 'D': '1', 'T': '1' },
    { 'Q → Q⁺': '1 → 0', 'SR: (S,R)': '(0, 1)', 'JK: (J,K)': '(X, 1)', 'D': '0', 'T': '1' },
    { 'Q → Q⁺': '1 → 1', 'SR: (S,R)': '(X, 0)', 'JK: (J,K)': '(X, 0)', 'D': '1', 'T': '0' }
  ]
};;

const SeqStateReduction = () => (
  <SeqLayout
    title="State Reduction & Excitation Tables"
    subtitle="Minimize states to reduce hardware, then use excitation tables to derive flip-flop input equations."
  >
    <div className="seq-content-body">
      {/* ════════ STATE REDUCTION ════════ */}
      <div className="seq-box">
        <span className="seq-box-title">Why Reduce States?</span>
        <p>
          Fewer states means fewer flip-flops and simpler combinational logic —
          lower area, power, and cost. State reduction finds and merges{" "}
          <strong>equivalent states</strong> that produce identical behavior for
          all possible input sequences.
        </p>
      </div>

      <h2>Equivalent States — Definition</h2>
      <p>
        Two states <strong>Sᵢ</strong> and <strong>Sⱼ</strong> are equivalent if
        and only if:
      </p>
      <ol>
        <li>
          They produce the <strong>same output</strong> for every input
          combination, <em>and</em>
        </li>
        <li>
          For every input, they transition to{" "}
          <strong>equivalent next states</strong>.
        </li>
      </ol>
      <p>This is recursive — equivalence must be verified transitively.</p>

      <h2>Method 1 — Row Matching</h2>
      <p>
        Scan the state table for rows with identical output and identical
        next-state entries (or next states that are themselves equivalent).
        Merge matching rows and repeat.
      </p>

      <div className="seq-box info">
        <span className="seq-box-title">Worked Example</span>
        <p>Original 5-state table with one input x:</p>
      </div>

      <SeqTable data={original5StateData} className="seq-flip-table" />

      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <span className="seq-feature-icon">
            <Layers size={32} />
          </span>
          <p className="seq-feature-title">Group by Output</p>
          <p className="seq-feature-desc">
            {"{A, B, D}"} → output=0 &nbsp;|&nbsp; {"{C, E}"} → output=1. States
            with different outputs are never equivalent.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">
            <GitCompare size={32} />
          </span>
          <p className="seq-feature-title">Compare Transitions</p>
          <p className="seq-feature-desc">
            B (x=0→A, x=1→D) and D (x=0→A, x=1→D) are identical →{" "}
            <strong>B ≡ D</strong>. C and E both go to B and themselves →{" "}
            <strong>C ≡ E</strong>.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">
            <Merge size={32} />
          </span>
          <p className="seq-feature-title">Merge & Replace</p>
          <p className="seq-feature-desc">
            Replace D with B everywhere. Replace E with C everywhere. Recheck
            for further equivalences.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">
            <CheckCircle size={32} />
          </span>
          <p className="seq-feature-title">Reduced Table</p>
          <p className="seq-feature-desc">
            5 states → 3 states. One less flip-flop and simpler logic.
          </p>
        </div>
      </div>

      <SeqTable data={reduced3StateData} className="seq-flip-table" />

      <h2>Method 2 — Implication Chart</h2>
      <p>
        A triangular table listing all state pairs. More systematic than row
        matching, guaranteed to find all equivalences in larger machines.
      </p>
      <ol>
        <li>
          Mark a cell X if the two states produce different outputs (cannot be
          equivalent)
        </li>
        <li>
          Fill remaining cells with the <strong>implied pairs</strong> — the
          next-state pairs that must also be equivalent
        </li>
        <li>Mark any cell whose implied pair is already X</li>
        <li>Repeat until no new X's appear</li>
        <li>Unmarked cells = equivalent pairs → merge them</li>
      </ol>

      <div className="seq-box warning">
        <span className="seq-box-title">When to Use Which Method</span>
        <p>
          <strong>Row matching</strong> is fast for small tables (≤6 states)
          with obvious equivalences.
          <br />
          <strong>Implication chart</strong> is more rigorous and scales to
          larger machines.
        </p>
      </div>

      {/* ════════ EXCITATION TABLES ════════ */}
      <h2>Excitation Tables</h2>

      <div className="seq-box">
        <span className="seq-box-title">What is an Excitation Table?</span>
        <p>
          An excitation table answers:{" "}
          <em>
            "What input do I apply to this flip-flop to achieve a specific Q →
            Q⁺ transition?"
          </em>{" "}
          It is the <strong>inverse</strong> of the characteristic table and is
          essential for deriving flip-flop input equations.
        </p>
      </div>

      <div className="seq-grid-2">
        <div>
          <h3>SR Flip-Flop</h3>
          <SeqTable data={srExcitationData} className="seq-flip-table" />
        </div>
        <div>
          <h3>JK Flip-Flop</h3>
          <SeqTable data={jkExcitationData} className="seq-flip-table" />
        </div>
        <div>
          <h3>D Flip-Flop</h3>
          <SeqTable data={dExcitationData} className="seq-flip-table" />
        </div>
        <div>
          <h3>T Flip-Flop</h3>
          <SeqTable data={tExcitationData} className="seq-flip-table" />
        </div>
      </div>

      <h2>Master Reference — All Excitation Tables</h2>
      <SeqTable data={masterExcitationData} className="seq-flip-table" />

      <h2>Using Excitation Tables in Design</h2>
      <ol>
        <li>
          For each row in the assigned state table, identify Q(t) and Q⁺ for
          every flip-flop
        </li>
        <li>Look up the required FF inputs using the excitation table</li>
        <li>
          Build a combined table with columns for all FF inputs and the output
        </li>
        <li>
          Apply K-maps to minimize each FF input equation (X = don't-care)
        </li>
        <li>Implement the minimized equations as combinational gates</li>
      </ol>

      <div className="seq-box info">
        <span className="seq-box-title">JK Don't-Cares Advantage</span>
        <p>
          The JK excitation table has 2 don't-cares per row (the most of any
          flip-flop), which gives K-maps more flexibility to simplify. This can
          yield simpler input equations than D flip-flops — though at the cost
          of more complex wiring and a two-input FF.
        </p>
      </div>

      <div className="seq-box success">
        <span className="seq-box-title"><Sparkles size={20} style={{ display: "inline-block", marginRight: "0.5rem" }} /> Sequential Circuits Complete</span>
        <p>
          You have now covered the full theory of sequential circuits — from
          basic latches and flip-flops, through analysis and design, to state
          minimization and excitation tables. These concepts are the backbone of
          every digital system with memory: processors, controllers,
          communication interfaces, and beyond.
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqStateReduction;
