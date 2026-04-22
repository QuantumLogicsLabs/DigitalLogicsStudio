import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import ControlPanel from '../components/ControlPanel';
import ControlGroup from '../components/ControlGroup';
import CircuitModal from '../components/CircuitModal';
import { parseSOP } from '../utils/boolMath';

const toPOSComplement = (s) => {
    const expr = s.replace(/^F\s*=\s*/, '').trim();
    const terms = parseSOP(expr);
    const parts = terms.map(term => {
        const sum = term.map(l => (l.n ? l.v : `${l.v}'`)).join(' + ');
        return `(${sum})`;
    });
    return parts.length ? parts.join(' • ') : '1';
};

const ComplementPage = () => {
    const [expr, setExpr] = useState("F = AB + C");
    const [openOrig, setOpenOrig] = useState(false);
    const [openComp, setOpenComp] = useState(false);

    const variables = Array.from(
        new Set(parseSOP(expr.replace(/^F\s*=\s*/, '').trim()).flatMap(t => t.map(l => l.v)))
    );
    const posComplement = toPOSComplement(expr);

    return (
        <ToolLayout title="Complement, Duality & De Morgan" subtitle="Explanation-first walkthrough and circuit experiment">
            <ExplanationBlock title="Understanding Complement and De Morgan's Laws">
                <p className="explanation-intro">
                    Complement operations and De Morgan's laws are fundamental concepts in Boolean algebra that enable powerful transformations between different logical forms. These principles are essential for circuit optimization and implementing logic with universal gates.
                </p>
                <div className="info-card">
                    <h4>De Morgan's Laws:</h4>
                    <p><strong>First Law:</strong> (X + Y)' = X' • Y'</p>
                    <p><strong>Second Law:</strong> (X • Y)' = X' + Y'</p>
                    <p><strong>Key Insight:</strong> The complement of a sum becomes the product of complements, and vice versa.</p>
                </div>
                <div className="example-box">
                    <h4>Why De Morgan's Laws Matter:</h4>
                    <ul>
                        <li><strong>Universal Gates:</strong> Enable implementation using only NAND or NOR gates</li>
                        <li><strong>Circuit Optimization:</strong> Convert between SOP and POS forms</li>
                        <li><strong>Logic Simplification:</strong> Often reveal simplification opportunities</li>
                        <li><strong>Design Flexibility:</strong> Allow multiple implementation options</li>
                    </ul>
                </div>
                <div className="key-insight">
                    <h4>Practical Application:</h4>
                    <p>Most modern integrated circuits are built using only NAND or NOR gates because they're "universal" - De Morgan's laws show us how to implement any Boolean function using these universal gates.</p>
                </div>
            </ExplanationBlock>
            <ControlPanel>
                <ControlGroup label="Expression (SOP)">
                    <input
                        type="text"
                        className="control-input"
                        value={expr}
                        onChange={(e) => {
                            const v = e.target.value;
                            setExpr(v);
                        }}
                        placeholder="F = AB + C"
                    />
                </ControlGroup>
            </ControlPanel>

            <ExplanationBlock title="De Morgan’s Law">
                <p className="explanation-intro">
                    For sums and products:
                </p>
                <ul>
                    <li>(X + Y)' = X' • Y'</li>
                    <li>(XY)' = X' + Y'</li>
                </ul>
                <p>
                    Complement of a sum of products becomes a product of sums with each literal complemented.
                </p>
            </ExplanationBlock>

            <ExplanationBlock title="Step-by-Step Complement Process">
                <div className="example-box">
                    <h4>Converting SOP to POS Complement:</h4>
                    <p><strong>Example:</strong> F = AB + C</p>
                    <p><strong>Step 1:</strong> Apply De Morgan's law to entire expression:</p>
                    <p>F' = (AB + C)' = (AB)' • C'</p>
                    <p><strong>Step 2:</strong> Apply De Morgan's law to first term:</p>
                    <p>F' = (A' + B') • C'</p>
                    <p><strong>Step 3:</strong> Final POS form:</p>
                    <p>F' = (A' + B') • C'</p>
                </div>
                <div className="interactive-example">
                    <h4>Try These Examples:</h4>
                    <div className="example-buttons">
                        <button className="kmap-btn kmap-btn-secondary" onClick={() => setExpr("F = A + B")}>
                            A + B
                        </button>
                        <button className="kmap-btn kmap-btn-secondary" onClick={() => setExpr("F = AB + CD")}>
                            AB + CD
                        </button>
                        <button className="kmap-btn kmap-btn-secondary" onClick={() => setExpr("F = A'BC + D")}>
                            A'BC + D
                        </button>
                    </div>
                </div>
            </ExplanationBlock>

            <ExplanationBlock title="Complement Conversion (SOP → POS)">
                <p className="explanation-intro">
                    Starting expression: <span className="highlight">{expr.replace(/^F\s*=\s*/, '').trim() || '—'}</span>
                </p>
                <p>
                    Complement (POS form): <span className="highlight">{posComplement}</span>
                </p>
                <div className="info-card">
                    <h4>What This Means:</h4>
                    <p>The complement expression represents the same logic function but in Product of Sums form, where each sum term corresponds to a maxterm (where original function outputs 0).</p>
                </div>
            </ExplanationBlock>

            <ExplanationBlock title="Universal Gate Implementation">
                <div className="comparison-grid">
                    <div className="comparison-card">
                        <h5>NAND Implementation</h5>
                        <p>Using only NAND gates:</p>
                        <ul>
                            <li>NOT: NAND with shorted inputs</li>
                            <li>AND: NAND followed by NOT</li>
                            <li>OR: NAND with complemented inputs</li>
                        </ul>
                    </div>
                    <div className="comparison-card">
                        <h5>NOR Implementation</h5>
                        <p>Using only NOR gates:</p>
                        <ul>
                            <li>NOT: NOR with shorted inputs</li>
                            <li>OR: NOR followed by NOT</li>
                            <li>AND: NOR with complemented inputs</li>
                        </ul>
                    </div>
                </div>
                <div className="key-insight">
                    <h4>Manufacturing Advantage:</h4>
                    <p>Using only one type of gate simplifies manufacturing, reduces costs, and improves reliability. This is why most digital ICs use NAND or NOR as their basic building blocks.</p>
                </div>
            </ExplanationBlock>

            <div className="kmap-card" style={{ display: 'grid', gap: 12 }}>
                <button className="kmap-btn kmap-btn-primary" onClick={() => setOpenOrig(true)}>
                    🔌 Experiment: Original Circuit
                </button>
                <button className="kmap-btn kmap-btn-secondary" onClick={() => setOpenComp(true)}>
                    🔌 Experiment: Complement Circuit
                </button>
            </div>

            <CircuitModal open={openOrig} onClose={() => setOpenOrig(false)} expression={expr} variables={variables.length ? variables : ['A', 'B', 'C']} />
            <CircuitModal open={openComp} onClose={() => setOpenComp(false)} expression={`F = ${posComplement}`} variables={variables.length ? variables : ['A', 'B', 'C']} />
        </ToolLayout>
    );
};

export default ComplementPage;
