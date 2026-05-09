import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import CircuitModal from '../components/CircuitModal';

const laws = [
    { 
        name: 'Commutative', 
        example: 'A + B = B + A; AB = BA',
        explanation: 'Order of operands doesn\'t affect result',
        application: 'Useful for rearranging terms to match patterns'
    },
    { 
        name: 'Associative', 
        example: 'A + (B + C) = (A + B) + C',
        explanation: 'Grouping of operands doesn\'t affect result',
        application: 'Allows flexible grouping in complex expressions'
    },
    { 
        name: 'Distributive', 
        example: 'A(B + C) = AB + AC',
        explanation: 'AND distributes over OR',
        application: 'Key for converting between SOP and POS forms'
    },
    { 
        name: 'Identity', 
        example: 'A + 0 = A; A1 = A',
        explanation: '0 is identity for OR, 1 for AND',
        application: 'Used for circuit initialization and reset'
    },
    { 
        name: 'Complement', 
        example: 'A + A\' = 1; AA\' = 0',
        explanation: 'Variable and its complement cover all cases',
        application: 'Fundamental for logic simplification'
    },
    { 
        name: 'Absorption', 
        example: 'A + AB = A; A(A + B) = A',
        explanation: 'A absorbs redundant combinations',
        application: 'Powerful for reducing term count'
    },
    { 
        name: 'De Morgan', 
        example: '(AB)\' = A\' + B\'; (A + B)\' = A\'B\'',
        explanation: 'Complement of product equals sum of complements',
        application: 'Essential for NAND/NOR gate implementations'
    }
];

const BooleanLaws = () => {
    const [open, setOpen] = useState(false);
    return (
        <ToolLayout title="Boolean Algebraic Laws" subtitle="Core properties with examples and applications">
            <ExplanationBlock title="Understanding Boolean Laws">
                <p className="explanation-intro">
                    Boolean algebraic laws are fundamental rules that govern how Boolean expressions can be manipulated. These laws are not just mathematical curiosities - they are the foundation for digital circuit design, optimization, and implementation.
                </p>
                <div className="info-card">
                    <h4>Why These Laws Matter:</h4>
                    <ul>
                        <li><strong>Circuit Minimization:</strong> Reduce gate count and complexity</li>
                        <li><strong>Power Optimization:</strong> Lower power consumption in digital systems</li>
                        <li><strong>Speed Enhancement:</strong> Reduce propagation delays</li>
                        <li><strong>Cost Reduction:</strong> Minimize silicon area and manufacturing costs</li>
                        <li><strong>Design Verification:</strong> Prove circuit equivalence</li>
                    </ul>
                </div>
            </ExplanationBlock>
            
            <ExplanationBlock title="Fundamental Laws">
                <div className="laws-grid">
                    {laws.map(l => (
                        <div key={l.name} className="law-card">
                            <h4 className="law-name">{l.name}</h4>
                            <p className="law-example"><strong>Example:</strong> {l.example}</p>
                            <p className="law-explanation">{l.explanation}</p>
                            <p className="law-application"><strong>Application:</strong> {l.application}</p>
                        </div>
                    ))}
                </div>
            </ExplanationBlock>
            <ExplanationBlock title="Practical Example: Circuit Optimization">
                <div className="example-box">
                    <h4>Problem: Simplify F = AB + AB' + A'B</h4>
                    <p><strong>Step 1:</strong> Apply distributive law to first two terms: A(B + B') = A(1) = A</p>
                    <p><strong>Step 2:</strong> Expression becomes: F = A + A'B</p>
                    <p><strong>Step 3:</strong> Apply absorption: A + A'B = A + B</p>
                    <p><strong>Result:</strong> Reduced from 3 terms with 6 literals to 2 terms with 2 literals!</p>
                    <p><strong>Impact:</strong> 67% reduction in gate count and complexity.</p>
                </div>
            </ExplanationBlock>
            
            <div className="interactive-example">
                <h4>Try It Yourself:</h4>
                <p>Can you simplify: F = A + AB + A'B'?</p>
                <details>
                    <summary>Show Solution</summary>
                    <p><strong>Solution:</strong> F = A + B'</p>
                    <p><strong>Steps:</strong> A + AB = A (absorption), so F = A + A'B' = A + B' (by consensus theorem)</p>
                </details>
            </div>
            
            <div className="kmap-card">
                <button className="kmap-btn kmap-btn-primary kmap-btn-full" onClick={() => setOpen(true)}>
                    🔌 Visualize Circuit Example
                </button>
            </div>
            <CircuitModal open={open} onClose={() => setOpen(false)} expression={"F = AB + AC"} variables={['A', 'B', 'C']} />
        </ToolLayout>
    );
};

export default BooleanLaws;
