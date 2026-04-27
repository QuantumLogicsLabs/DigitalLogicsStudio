import React from "react";
import { Layers, GitCompare, Merge, CheckCircle, Sparkles } from "lucide-react";
import SeqLayout from "./SeqLayout";

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

      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Present State</th>
              <th>Next (x=0)</th>
              <th>Next (x=1)</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A</td>
              <td>B</td>
              <td>C</td>
              <td>0</td>
            </tr>
            <tr>
              <td>B</td>
              <td>A</td>
              <td>D</td>
              <td>0</td>
            </tr>
            <tr>
              <td>C</td>
              <td>B</td>
              <td>C</td>
              <td>1</td>
            </tr>
            <tr>
              <td>D</td>
              <td>A</td>
              <td>D</td>
              <td>0</td>
            </tr>
            <tr>
              <td>E</td>
              <td>B</td>
              <td>E</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>

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

      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Present State</th>
              <th>Next (x=0)</th>
              <th>Next (x=1)</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A</td>
              <td>B</td>
              <td>C</td>
              <td>0</td>
            </tr>
            <tr>
              <td>B</td>
              <td>A</td>
              <td>B</td>
              <td>0</td>
            </tr>
            <tr>
              <td>C</td>
              <td>B</td>
              <td>C</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>

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
          <div className="seq-table-wrap">
            <table className="seq-table">
              <thead>
                <tr>
                  <th>Q</th>
                  <th>Q⁺</th>
                  <th>S</th>
                  <th>R</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>X</td>
                </tr>
                <tr>
                  <td>0</td>
                  <td>1</td>
                  <td>1</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>0</td>
                  <td>0</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>X</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3>JK Flip-Flop</h3>
          <div className="seq-table-wrap">
            <table className="seq-table">
              <thead>
                <tr>
                  <th>Q</th>
                  <th>Q⁺</th>
                  <th>J</th>
                  <th>K</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>X</td>
                </tr>
                <tr>
                  <td>0</td>
                  <td>1</td>
                  <td>1</td>
                  <td>X</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>0</td>
                  <td>X</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>X</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3>D Flip-Flop</h3>
          <div className="seq-table-wrap">
            <table className="seq-table">
              <thead>
                <tr>
                  <th>Q</th>
                  <th>Q⁺</th>
                  <th>D</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>0</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3>T Flip-Flop</h3>
          <div className="seq-table-wrap">
            <table className="seq-table">
              <thead>
                <tr>
                  <th>Q</th>
                  <th>Q⁺</th>
                  <th>T</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>0</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>0</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h2>Master Reference — All Excitation Tables</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Q → Q⁺</th>
              <th>SR: (S,R)</th>
              <th>JK: (J,K)</th>
              <th>D</th>
              <th>T</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0 → 0</td>
              <td>(0, X)</td>
              <td>(0, X)</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>0 → 1</td>
              <td>(1, 0)</td>
              <td>(1, X)</td>
              <td>1</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1 → 0</td>
              <td>(0, 1)</td>
              <td>(X, 1)</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1 → 1</td>
              <td>(X, 0)</td>
              <td>(X, 0)</td>
              <td>1</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>

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
