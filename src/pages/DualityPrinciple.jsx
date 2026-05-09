import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import ControlPanel from '../components/ControlPanel';
import ControlGroup from '../components/ControlGroup';
import CircuitModal from '../components/CircuitModal';

const applyDuality = (s) => {
    if (!s) return '';
    const expr = s.replace(/^F\s*=\s*/, '').trim();
    return expr.replace(/\+/g, 'TEMP').replace(/•/g, '+').replace(/TEMP/g, '•').replace(/\b1\b/g, '0').replace(/\b0\b/g, '1');
};

const DualityPrinciple = () => {
    const [expr, setExpr] = useState("F = A + B");
    const [dual, setDual] = useState(applyDuality("F = A + B"));
    const [open, setOpen] = useState(false);

    return (
        <ToolLayout title="Duality Principle" subtitle="Swap operators and identity values">
            <ExplanationBlock title="Understanding the Duality Principle">
                <p className="explanation-intro">
                    The Duality Principle is a fundamental concept in Boolean algebra that states: every Boolean expression has a dual, obtained by interchanging OR and AND operations, and interchanging 0s and 1s. If an identity is true, its dual is also true.
                </p>
                <div className="info-card">
                    <h4>Duality Rules:</h4>
                    <ul>
                        <li>Replace OR (+) with AND (•)</li>
                        <li>Replace AND (•) with OR (+)</li>
                        <li>Replace 1 with 0</li>
                        <li>Replace 0 with 1</li>
                        <li>Keep variables and complements unchanged</li>
                    </ul>
                </div>
                <div className="example-box">
                    <h4>Classic Examples:</h4>
                    <ul>
                        <li><strong>Original:</strong> A + 1 = 1 → <strong>Dual:</strong> A • 0 = 0</li>
                        <li><strong>Original:</strong> A + A' = 1 → <strong>Dual:</strong> A • A' = 0</li>
                        <li><strong>Original:</strong> A + (B • C) = (A + B) • (A + C) → <strong>Dual:</strong> A • (B + C) = (A • B) + (A • C)</li>
                    </ul>
                </div>
                <div className="key-insight">
                    <h4>Why Duality Matters:</h4>
                    <p>Duality doubles the power of Boolean algebra. Once you prove an identity, you automatically know its dual is also true. This symmetry is beautiful and practical - it reduces the number of theorems you need to learn and prove.</p>
                </div>
            </ExplanationBlock>
            <ControlPanel>
                <ControlGroup label="Expression">
                    <input
                        type="text"
                        className="control-input"
                        value={expr}
                        onChange={(e) => {
                            const v = e.target.value;
                            setExpr(v);
                            setDual(applyDuality(v));
                        }}
                    />
                </ControlGroup>
            </ControlPanel>

            <ExplanationBlock title="Dual Expression">
                <p className="explanation-intro">
                    Original: <span className="highlight">{expr.replace(/^F\s*=\s*/, '').trim()}</span>
                </p>
                <p className="explanation-intro">
                    Dual: <span className="highlight">{dual}</span>
                </p>
                <div className="example-box">
                    <h4>Verification:</h4>
                    <p>Both expressions will have the same truth table structure, just with 0s and 1s swapped in the final output column.</p>
                </div>
            </ExplanationBlock>

            <div className="interactive-example">
                <h4>Try These Examples:</h4>
                <div className="example-buttons">
                    <button className="kmap-btn kmap-btn-secondary" onClick={() => {
                        const example = "F = A + 1";
                        setExpr(example);
                        setDual(applyDuality(example));
                    }}>A + 1</button>
                    <button className="kmap-btn kmap-btn-secondary" onClick={() => {
                        const example = "F = A • B + C";
                        setExpr(example);
                        setDual(applyDuality(example));
                    }}>A • B + C</button>
                    <button className="kmap-btn kmap-btn-secondary" onClick={() => {
                        const example = "F = (A + B) • (A' + C)";
                        setExpr(example);
                        setDual(applyDuality(example));
                    }}>(A + B) • (A' + C)</button>
                </div>
            </div>

            <div className="kmap-card">
                <button className="kmap-btn kmap-btn-primary kmap-btn-full" onClick={() => setOpen(true)}>
                    🔌 Experiment with Circuit
                </button>
            </div>

            <CircuitModal open={open} onClose={() => setOpen(false)} expression={expr} variables={['A', 'B']} />
        </ToolLayout>
    );
};

export default DualityPrinciple;
