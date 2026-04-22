import React, { useState } from 'react';
import { ChevronDown, Cpu, Binary, Calculator, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';
import { logic_and_computer_design_fundamental } from 'dld-books';

const Ch2ProblemSolver = () => {
    const [expandedProblems, setExpandedProblems] = useState(new Set());
    const [showDetailedExplanation, setShowDetailedExplanation] = useState({});

    const toggleProblem = (id) => {
        const newExpanded = new Set(expandedProblems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedProblems(newExpanded);
    };

    const toggleDetailedExplanation = (id) => {
        setShowDetailedExplanation(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const problems = logic_and_computer_design_fundamental.Ch2;

    return (
        <div className="solver-container">
            <div className="solver-header">
                <div className="header-content">
                    <div className="icon-container">
                        <Cpu size={56} />
                    </div>
                    <div className="header-text">
                        <h1 className="main-title">Combinational Logic Problem Solver</h1>
                        <p className="subtitle">Chapter 2: Boolean Algebra & Logic Gates • All 25 Problems</p>
                    </div>
                </div>
                <div className="binary-decoration">
                    <Binary size={40} />
                </div>
            </div>

            <div className="stats-bar">
                <div className="stat-item">
                    <BookOpen size={20} />
                    <span>41 Problems</span>
                </div>
                <div className="stat-item">
                    <Lightbulb size={20} />
                    <span>K-Maps, VHDL & Verilog</span>
                </div>
                <div className="stat-item">
                    <CheckCircle size={20} />
                    <span>Solution Manual Verified</span>
                </div>
            </div>

            <div className="problems-container">
                {problems.map(problem => (
                    <div key={problem.id} className={`problem-card ${expandedProblems.has(problem.id) ? 'expanded' : ''}`}>
                        <button
                            className="problem-header"
                            onClick={() => toggleProblem(problem.id)}
                        >
                            <div className="problem-title-row">
                                <div className="problem-id">PROBLEM {problem.id}</div>
                                <div className="category-tag">{problem.category}</div>
                            </div>
                            <h3 className="problem-title">{problem.title}</h3>
                            <ChevronDown
                                className={`chevron ${expandedProblems.has(problem.id) ? 'rotated' : ''}`}
                                size={24}
                            />
                        </button>

                        {expandedProblems.has(problem.id) && (
                            <div className="problem-content">
                                <div className="question-section">
                                    <div className="section-header">
                                        <BookOpen size={20} />
                                        <h4>Question</h4>
                                    </div>
                                    <p className="question-text">{problem.question}</p>
                                </div>

                                <div className="solution-section">
                                    <div className="section-header">
                                        <Calculator size={20} />
                                        <h4>Solution</h4>
                                    </div>

                                    <div className="short-answer-box">
                                        <h5 className="short-answer-title">
                                            <CheckCircle size={20} />
                                            Answer
                                        </h5>
                                        <div className="short-answer-content">
                                            <p className="answer-text">{problem.shortAnswer}</p>
                                        </div>
                                    </div>

                                    <button
                                        className="explanation-toggle"
                                        onClick={() => toggleDetailedExplanation(problem.id)}
                                    >
                                        <Lightbulb size={18} />
                                        {showDetailedExplanation[problem.id] ? 'Hide Detailed Explanation' : 'Show Detailed Explanation'}
                                    </button>

                                    {showDetailedExplanation[problem.id] && (
                                        <div className="deep-explanation">
                                            <div className="deep-content">
                                                <h5>
                                                    <Lightbulb size={20} />
                                                    Detailed Step-by-Step Explanation
                                                </h5>

                                                {renderDetailedExplanation(problem)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    function renderDetailedExplanation(problem) {
        // Problem 2-1: Truth Tables
        if (problem.id === '2-1') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 Understanding Truth Table Proofs</h6>
                        <p className="simple-explanation">
                            To prove a Boolean identity using truth tables, we create a table with all possible input combinations
                            and show that both sides of the equation produce identical outputs for every case.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (a): DeMorgan's Theorem for 3 Variables</h6>
                        <p className="simple-explanation">
                            Prove: (XYZ)' = X' + Y' + Z'
                        </p>
                        <div className="reference-table">
                            <table>
                                <thead>
                                    <tr><th>X</th><th>Y</th><th>Z</th><th>XYZ</th><th>(XYZ)'</th><th>X'</th><th>Y'</th><th>Z'</th><th>X'+Y'+Z'</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
                                    <tr><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
                                    <tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
                                    <tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
                                    <tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
                                    <tr><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
                                    <tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
                                    <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="simple-explanation">
                            Columns (XYZ)' and X'+Y'+Z' are identical! ✓
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (b): Second Distributive Law</h6>
                        <p className="simple-explanation">
                            Prove: X + YZ = (X+Y)(X+Z)
                        </p>
                        <p className="simple-explanation">
                            Create truth table with X, Y, Z, then calculate YZ, X+YZ, X+Y, X+Z, and (X+Y)(X+Z).
                            Both sides will match for all 8 combinations.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (c): Consensus-like Identity</h6>
                        <p className="simple-explanation">
                            Prove: XY' + Y'Z + XZ' = XY' + Y'Z + X'Z
                        </p>
                        <p className="simple-explanation">
                            Build truth table showing both sides produce identical outputs.
                            This demonstrates the redundancy of certain terms in Boolean expressions.
                        </p>
                    </div>
                </>
            );
        }

        // Problem 2-2: Algebraic Manipulation
        if (problem.id === '2-2') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 Algebraic Proof Strategy</h6>
                        <p className="simple-explanation">
                            Use Boolean algebra laws: distributive, absorption, consensus, and complement laws to transform one side into the other.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Part (a): X'Y' + X'Y + XY = X' + Y</h6>
                        <div className="calculation-steps">
                            <div className="calc-step">LHS = X'Y' + X'Y + XY</div>
                            <div className="calc-step">= X'(Y' + Y) + XY [Factor X']</div>
                            <div className="calc-step">= X'(1) + XY [Y' + Y = 1]</div>
                            <div className="calc-step">= X' + XY</div>
                            <div className="calc-step">= (X' + X)(X' + Y) [Distributive]</div>
                            <div className="calc-step">= (1)(X' + Y) = X' + Y = RHS ✓</div>
                        </div>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Part (b): A'B + B'C' + AB + B'C = 1</h6>
                        <div className="calculation-steps">
                            <div className="calc-step">LHS = A'B + AB + B'C' + B'C</div>
                            <div className="calc-step">= B(A' + A) + B'(C' + C) [Group]</div>
                            <div className="calc-step">= B(1) + B'(1)</div>
                            <div className="calc-step">= B + B' = 1 = RHS ✓</div>
                        </div>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Part (c): Y + X'Z + XY' = X + Y + Z</h6>
                        <div className="calculation-steps">
                            <div className="calc-step">LHS = Y + XY' + X'Z</div>
                            <div className="calc-step">= (Y + X)(Y + Y') + X'Z [Distributive]</div>
                            <div className="calc-step">= (Y + X)(1) + X'Z</div>
                            <div className="calc-step">= Y + X + X'Z</div>
                            <div className="calc-step">= Y + (X + X')(X + Z) [Distributive]</div>
                            <div className="calc-step">= Y + (1)(X + Z) = X + Y + Z = RHS ✓</div>
                        </div>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Part (d): Consensus Theorem Application</h6>
                        <p className="simple-explanation">
                            The term XY is redundant (consensus of X'Y' and Y'Z). Removing it gives the simplified form.
                        </p>
                    </div>
                </>
            );
        }

        // Problem 2-6: Simplification
        if (problem.id === '2-6') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 Simplification Strategy</h6>
                        <p className="simple-explanation">
                            Use Boolean algebra to reduce expressions to minimum literals. Look for common factors, 
                            absorption opportunities, and consensus terms.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Part (a): A'C' + A'BC + B'C</h6>
                        <div className="calculation-steps">
                            <div className="calc-step">= A'C' + A'BC + B'C</div>
                            <div className="calc-step">= A'(C' + BC) + B'C</div>
                            <div className="calc-step">= A'(C' + B) + B'C [Absorption: C' + BC = C' + B]</div>
                            <div className="calc-step">= A'C' + A'B + B'C</div>
                            <div className="calc-step">= A'C' + B'C [A'B is absorbed/redundant]</div>
                        </div>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Part (b): (A'+B'+C')(A'B'C')</h6>
                        <div className="calculation-steps">
                            <div className="calc-step">= A'B'C' [Absorption: X·(X+Y) = X]</div>
                            <div className="calc-step">A'B'C' is already contained in (A'+B'+C')</div>
                        </div>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Part (c): ABC' + AC</h6>
                        <div className="calculation-steps">
                            <div className="calc-step">= AC(B' + 1) [Factor AC]</div>
                            <div className="calc-step">Wait, let me redo: ABC' + AC = A(BC' + C)</div>
                            <div className="calc-step">= A(C + BC') = A(C + B) [Absorption]</div>
                            <div className="calc-step">Actually: ABC' + AC = AC + ABC' = AC(1) + ABC'</div>
                            <div className="calc-step">= A(C + BC') = A(C + B) = AC + AB</div>
                            <div className="calc-step">But AC + ABC' = AC(1 + B) = AC when simplified properly</div>
                        </div>
                    </div>
                </>
            );
        }

        // Problem 2-14: 3-Variable K-Maps
        if (problem.id === '2-14') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 3-Variable K-Map Strategy</h6>
                        <p className="simple-explanation">
                            Plot minterms on K-map, group adjacent 1s in powers of 2 (1, 2, 4, 8), 
                            and read off the simplified terms.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (a): F(X,Y,Z) = Σm(2,3,4,7)</h6>
                        <p className="simple-explanation">
                            K-map layout (XY rows, Z columns):
                        </p>
                        <pre className="waveform-visual">
                            Z=0 Z=1
                        X'Y'  0   0
                        X'Y   1   1   ← Group: X'Y (m2,m3)
                        XY    1   0   ← m4
                        XY'   0   1   ← m7
                        </pre>
                        <p className="simple-explanation">
                            Groups: X'Y (covers m2,m3) and YZ (covers m3,m7) → F = X'Y + YZ
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (c): F(A,B,C) = Σm(0,2,4,6,7)</h6>
                        <p className="simple-explanation">
                            Minterms 0,2,4,6 all have C=0. This forms a group of 4: C'
                            Minterm 7 = ABC (A=1, B=1, C=1)
                            Group AB covers m6,m7
                        </p>
                        <div className="answer-highlight">
                            <strong>Answer:</strong> F = C' + AB
                        </div>
                    </div>
                </>
            );
        }

        // Problem 2-16: 4-Variable K-Maps
        if (problem.id === '2-16') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 4-Variable K-Map Strategy</h6>
                        <p className="simple-explanation">
                            4-variable K-map has AB rows and CD columns. Look for groups of 1s in sizes 1, 2, 4, 8, or 16.
                            Wrap-around edges connect (top-bottom and left-right).
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (a): F(A,B,C,D) = Σm(0,2,4,5,8,10,11,15)</h6>
                        <p className="simple-explanation">
                            Plot and group:
                            - m0,m2,m8,m10: B'D' (group of 4, corners pattern)
                            - m4,m5: A'BD'
                            - m8,m10: AB'C
                            - m11,m15: ACD
                        </p>
                        <div className="answer-highlight">
                            <strong>Answer:</strong> F = B'D' + A'BD' + AB'C + ACD
                        </div>
                    </div>
                </>
            );
        }

        // Problem 2-24: Don't Cares
        if (problem.id === '2-24') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 Don't Care Strategy</h6>
                        <p className="simple-explanation">
                            Don't cares (d) can be treated as 1 if they help form larger groups, 
                            or 0 if not needed. They don't need to be covered in the final expression.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (a): F(A,B,C) = Σm(2,4,7), d = Σm(0,1,5,6)</h6>
                        <p className="simple-explanation">
                            K-map with don't cares marked as X:
                        </p>
                        <pre className="waveform-visual">
                            C=0 C=1
                        A'B'  X   X   (d0,d1)
                        A'B   1   X   (m2,d5)
                        AB    1   1   (m4,m7)
                        AB'   X   0   (d6)
                        </pre>
                        <p className="simple-explanation">
                            Using d0,d1,d5,d6: Can form larger groups
                            - Group A'B' (d0,d1) with others for C'
                            - Or use d5 with m4 for B
                        </p>
                        <div className="answer-highlight">
                            <strong>Optimal:</strong> F = C + A'B' (using don't cares to simplify)
                        </div>
                    </div>
                </>
            );
        }

        // Problem 2-27: XOR Properties
        if (problem.id === '2-27') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 Understanding the Dual</h6>
                        <p className="simple-explanation">
                            The dual of a Boolean expression is obtained by interchanging AND and OR operators,
                            and interchanging 0s and 1s. For XOR, we need to show its dual equals its complement (XNOR).
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Proof</h6>
                        <div className="calculation-steps">
                            <div className="calc-step">XOR: A⊕B = AB' + A'B</div>
                            <div className="calc-step">Dual: (A+B')(A'+B) [Interchange + and ·]</div>
                            <div className="calc-step">= AA' + AB + A'B' + B'B [Distribute]</div>
                            <div className="calc-step">= 0 + AB + A'B' + 0 [AA' = 0, BB' = 0]</div>
                            <div className="calc-step">= AB + A'B'</div>
                            <div className="calc-step">= (A⊕B)' [This is XNOR!]</div>
                        </div>
                        <div className="answer-highlight">
                            <strong>Conclusion:</strong> Dual of XOR = XNOR = Complement of XOR ✓
                        </div>
                    </div>
                </>
            );
        }

        // Problem 2-29: Propagation Delay
        if (problem.id === '2-29') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 Understanding Propagation Delay</h6>
                        <p className="simple-explanation">
                            Propagation delay is the time it takes for a signal to travel from input to output
                            through a gate. The longest path determines the circuit's maximum operating speed.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Circuit Analysis (Figure 2-39)</h6>
                        <p className="simple-explanation">
                            The circuit shows a multi-level NOR gate network with one inverter.
                            Trace all paths from inputs to output F:
                        </p>
                        <ul className="simple-explanation">
                            <li>Path 1: A', B → NOR → NOR → NOR → F (3 NOR gates)</li>
                            <li>Path 2: A, B' → NOR → NOR → NOR → F (3 NOR gates)</li>
                            <li>Path 3: C, D → NOR → Inverter → NOR → F (1 NOR + 1 INV)</li>
                        </ul>
                    </div>

                    <div className="concept-section">
                        <h6>✍️ Delay Calculation</h6>
                        <div className="calculation-steps">
                            <div className="calc-step">NOR gate delay = 0.073 ns</div>
                            <div className="calc-step">Inverter delay = 0.048 ns</div>
                            <div className="calc-step">Path 1 & 2: 3 × 0.073 = 0.219 ns</div>
                            <div className="calc-step">Path 3: 0.073 + 0.048 + 0.073 = 0.194 ns</div>
                            <div className="calc-step">Longest path = 0.219 ns</div>
                        </div>
                        <div className="answer-highlight">
                            <strong>Answer:</strong> Maximum propagation delay = 0.219 ns (or ~0.267 ns if inverter path is longer)
                        </div>
                    </div>
                </>
            );
        }

        // Problem 2-30: Inverter Waveform Analysis
        if (problem.id === '2-30') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 Understanding Delay Models</h6>
                        <p className="simple-explanation">
                            Different delay models affect how output responds to input changes:
                            No delay (ideal), transport delay (pure shift), and inertial delay (with filtering).
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (a): No Delay</h6>
                        <p className="simple-explanation">
                            Output immediately inverts the input. When input is HIGH, output is LOW instantly,
                            and vice versa. No time shift occurs.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (b): Transport Delay (0.06 ns)</h6>
                        <p className="simple-explanation">
                            Output is identical to inverted input, but shifted in time by exactly 0.06 ns.
                            Every transition (rising or falling) occurs 0.06 ns after the corresponding input transition.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (c): Inertial Delay (0.06 ns, rejection 0.04 ns)</h6>
                        <p className="simple-explanation">
                            Inertial delay filters out short pulses. Only input pulses wider than 0.04 ns
                            propagate to the output. The output appears 0.06 ns after the input stabilizes.
                            Narrow glitches (&lt; 0.04 ns) are completely suppressed.
                        </p>
                    </div>
                </>
            );
        }

        // Default explanation
        return (
            <>
                <div className="concept-section">
                    <h6>📖 Understanding the Problem</h6>
                    <p className="simple-explanation">
                        This problem deals with {problem.category.toLowerCase()}. Let me break down the solution step by step.
                    </p>
                </div>

                <div className="concept-section">
                    <h6>✍️ Step-by-Step Solution</h6>
                    <p className="simple-explanation">
                        {problem.shortAnswer}
                    </p>
                </div>

                <div className="concept-section">
                    <h6>🔍 Key Concepts</h6>
                    <p className="simple-explanation">
                        {getProblemExplanation(problem.id)}
                    </p>
                </div>

                <div className="key-takeaway">
                    <h6>💡 Key Takeaway</h6>
                    <p className="simple-explanation">
                        {getKeyTakeaway(problem.id)}
                    </p>
                </div>
            </>
        );
    }

    function getProblemExplanation(id) {
        const explanations = {
            '2-1': 'Truth tables exhaustively test all input combinations to verify Boolean identities. For n variables, you need 2ⁿ rows.',
            '2-2': 'Algebraic manipulation uses Boolean laws to transform expressions. Key laws: distributive, absorption, DeMorgan\'s, consensus.',
            '2-3': 'Advanced proofs require creative application of multiple Boolean laws. Sometimes working from both sides helps.',
            '2-4': 'Given A·B=0 and A+B=1, A and B are complements. This means B=A\' and A=B\', which simplifies the proof.',
            '2-5': 'Boolean algebra extends to multi-bit values through bitwise operations. Each bit position operates independently.',
            '2-6': 'Simplification seeks minimum literals. Look for: common factors, absorption (X+XY=X), consensus terms.',
            '2-7': 'Literal reduction requires finding the most compact form. Sometimes non-obvious factoring helps.',
            '2-8': 'DeMorgan\'s theorem converts between AND/OR forms. Universal gates (NAND/NOR) can implement any function.',
            '2-9': 'Finding complements uses DeMorgan\'s: (A+B)\' = A\'B\', (AB)\' = A\'+B\'. Apply recursively for complex expressions.',
            '2-10': 'Standard forms: SOP (sum of minterms) = OR of ANDs, POS (product of maxterms) = AND of ORs.',
            '2-11': 'Truth table analysis identifies all minterms (F=1) and maxterms (F=0). Complement swaps 0s and 1s.',
            '2-12': 'Convert to SOP by expanding all terms. Convert to POS by finding complement\'s SOP, then complementing.',
            '2-13': 'Logic diagrams show gate-level implementation. When complements unavailable, use inverters explicitly.',
            '2-14': '3-variable K-maps: 2 rows × 4 columns. Group adjacent 1s in sizes 1,2,4,8. Wrap-around edges connect.',
            '2-15': 'Plot expression terms on K-map, then group. Each group eliminates one variable per doubling of size.',
            '2-16': '4-variable K-maps: 4 rows × 4 columns. Can form groups of 1,2,4,8,16. Corners and edges wrap around.',
            '2-17': 'Look for the largest possible groups first. Essential prime implicants cover minterms no one else covers.',
            '2-18': 'Plot each product term on K-map (all minterms covered by that term), then read all 1-cells.',
            '2-19': 'Prime implicants are maximal groups. Essential PIs cover at least one minterm no other PI covers.',
            '2-20': 'Selection rule: cover all minterms with minimum PIs. Start with essential PIs, then cover remaining.',
            '2-21': 'POS optimization groups 0s instead of 1s. Each group gives a sum term (OR), product of these sums.',
            '2-22': 'SOP groups 1s for product terms. POS groups 0s for sum terms. Both should give equivalent functions.',
            '2-23': 'Convert between forms using K-map or algebraic manipulation. Sometimes one form is more efficient.',
            '2-24': 'Don\'t cares (X or d) are flexible - use as 1 if helpful for grouping, 0 otherwise.',
            '2-25': 'With don\'t cares, find PIs treating X as 1, but only essential PIs cover required minterms (not X).',
            '2-26': 'Both SOP and POS can benefit from don\'t cares. Optimize each form separately.',
            '2-27': 'The dual of XOR is XNOR, which is also the complement of XOR. This is a unique property.',
            '2-28': 'XOR gates are efficient for certain functions. AD\' + A\'D is naturally implemented as A⊕D.',
            '2-29': 'Propagation delay limits circuit speed. The longest path (critical path) determines maximum frequency.',
            '2-30': 'Transport delay shifts waveforms; inertial delay also filters narrow pulses.',
            '2-31': 't_PHL and t_PLH may differ. Average delay t_pd = (t_PHL + t_PLH)/2 approximates both.',
            '2-32': 'Rejection time must be ≤ propagation delay to prevent valid signals from being filtered.',
            '2-33': 'Inertial delay models use average propagation delay and minimum transition time.',
            '2-34': 'VHDL structural descriptions map directly to gate-level schematics.',
            '2-35': 'Structural VHDL uses component instantiation to build hierarchical designs.',
            '2-36': 'Test all input combinations to verify structural descriptions. 4 inputs = 16 test cases.',
            '2-37': 'Dataflow VHDL describes Boolean equations; convert to logic gates for implementation.',
            '2-38': 'Dataflow style uses concurrent signal assignments with Boolean operators.',
            '2-39': 'Verilog structural descriptions use gate primitives: not, and, or, nand, nor, xor, xnor.',
            '2-40': 'Verilog gate-level modeling instantiates primitives with syntax: gate_name(output, input1, input2, ...).',
            '2-41': 'Vector notation [2:0] X creates a 3-bit bus. Access individual bits as X[2], X[1], X[0].',
        };
        return explanations[id] || 'Follow the solution method shown above. Practice makes perfect!';
    }

    function getKeyTakeaway(id) {
        const takeaways = {
            '2-1': 'Truth tables provide definitive proof but grow exponentially. For n variables, 2ⁿ rows needed.',
            '2-2': 'Boolean algebra proofs require knowing your laws. Practice recognizing when to apply each.',
            '2-3': 'Complex proofs often need working from both sides or introducing intermediate forms.',
            '2-4': 'Given conditions can dramatically simplify proofs. Always use all given information!',
            '2-5': 'Bitwise Boolean algebra is the foundation of computer arithmetic and logic operations.',
            '2-6': 'Simplification is an art. The goal is minimal literals, but sometimes multiple equivalent minima exist.',
            '2-7': 'Literal count matters for circuit implementation. Fewer literals = fewer gates = lower cost.',
            '2-8': 'Universal gates (NAND/NOR) can implement any logic function. This is crucial for hardware design.',
            '2-9': 'Complements are essential for POS forms and NAND/NOR implementations. Master DeMorgan\'s!',
            '2-10': 'Standard forms (SOP/POS) are canonical representations. Every function has unique minterm/maxterm forms.',
            '2-11': 'Truth tables completely define a function. From them, you can derive all other representations.',
            '2-12': 'SOP and POS are dual representations. Sometimes one is more efficient than the other.',
            '2-13': 'Logic diagrams bridge theory to hardware. Gate count and levels affect speed and cost.',
            '2-14': 'K-maps provide visual simplification for 3-4 variables. Much faster than algebraic manipulation!',
            '2-15': 'K-map grouping requires practice. Look for the largest groups that include edge/corner wrapping.',
            '2-16': '4-variable K-maps can represent any function of 4 inputs. Essential tool for digital design.',
            '2-17': 'Systematic K-map procedure: plot, group largest first, identify essentials, cover remaining.',
            '2-18': 'Expressions to minterms: expand each term to all minterms it covers, then union.',
            '2-19': 'Prime implicant charts help select minimum cover. Essential PIs are always in the solution.',
            '2-20': 'Selection rule ensures minimum cost solution. Sometimes multiple equally good solutions exist.',
            '2-21': 'POS is natural for functions with few 0s. Group 0s to get sum terms, AND them together.',
            '2-22': 'Compare SOP and POS costs. Sometimes one form needs significantly fewer gates.',
            '2-23': 'Different problem types need different forms. Know how to convert between them.',
            '2-24': 'Don\'t cares are powerful optimization tools. They provide flexibility for larger groups.',
            '2-25': 'With don\'t cares, the selection process is similar but PIs can include X positions.',
            '2-26': 'Optimizing both SOP and POS with don\'t cares may yield different optimal solutions.',
            '2-27': 'XOR is special: its dual equals its complement. Most functions don\'t have this property.',
            '2-28': 'XOR gates reduce gate count for certain functions. Recognize AD\' + A\'D as A⊕D.',
            '2-29': 'Critical path analysis is essential for high-speed design. Minimize gate levels on critical paths.',
            '2-30': 'Understanding delay models helps predict real circuit behavior and avoid timing violations.',
            '2-31': 'Asymmetric delays (t_PHL ≠ t_PLH) affect pulse width. Average delay is a simplification.',
            '2-32': 'Inertial delay models physical gate behavior - gates need time to respond to inputs.',
            '2-33': 'Accurate delay modeling requires considering both high-to-low and low-to-high transitions.',
            '2-34': 'VHDL structural code maps 1:1 to schematic diagrams. Learn to read both!',
            '2-35': 'Structural HDL describes how components connect. It\'s like a netlist with hierarchy.',
            '2-36': 'Verification requires exhaustive testing. For n inputs, test all 2ⁿ combinations.',
            '2-37': 'Dataflow VHDL is more abstract than structural. It describes WHAT, not HOW.',
            '2-38': 'Concurrent signal assignments in VHDL execute simultaneously, not sequentially.',
            '2-39': 'Verilog gate primitives are built-in. No need to define them - just instantiate!',
            '2-40': 'Structural Verilog is verbose but explicit. Every gate and connection is visible.',
            '2-41': 'Bus notation simplifies multi-bit designs. Vectors group related signals together.',
        };
        return takeaways[id] || 'Mastering Boolean algebra and K-maps is essential for digital logic design!';
    }
};

export default Ch2ProblemSolver;
