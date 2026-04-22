import React, { useEffect, useState } from 'react';

export const WhiteboardAnimation = ({
    step,
    stepIndex,
    isActive,
    grid,
    groups,
    variables,
    numVariables,
    getColumnLabels,
    getRowLabels
}) => {
    const [animationPhase, setAnimationPhase] = useState(0);

    useEffect(() => {
        if (isActive && step.type === 'group') {
            // Animate through phases when playing
            const phases = [0, 1, 2, 3]; // Highlight -> Circle -> Variables -> Term
            let currentPhaseIndex = 0;

            const interval = setInterval(() => {
                currentPhaseIndex++;
                if (currentPhaseIndex < phases.length) {
                    setAnimationPhase(phases[currentPhaseIndex]);
                } else {
                    clearInterval(interval);
                }
            }, 1500); // Change phase every 1.5 seconds

            return () => clearInterval(interval);
        } else {
            setAnimationPhase(0);
        }
    }, [isActive, step, stepIndex]);

    if (!step || !step.groupData) {
        return (
            <div className="whiteboard-container">
                <div className="whiteboard-content">
                    <div className="whiteboard-intro">
                        <h3 className="whiteboard-title">📚 K-Map Simplification Tutorial</h3>
                        <p className="whiteboard-description">
                            This interactive whiteboard will guide you through each step of the
                            grouping process, showing you exactly how we derive the simplified expression.
                        </p>
                        <div className="whiteboard-rules">
                            <div className="rule-item">
                                <span className="rule-icon">1️⃣</span>
                                <span>Identify groups of 1s in powers of 2</span>
                            </div>
                            <div className="rule-item">
                                <span className="rule-icon">2️⃣</span>
                                <span>Make groups as large as possible</span>
                            </div>
                            <div className="rule-item">
                                <span className="rule-icon">3️⃣</span>
                                <span>Determine which variables are eliminated</span>
                            </div>
                            <div className="rule-item">
                                <span className="rule-icon">4️⃣</span>
                                <span>Write the term from constant variables</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step.type === 'group') {
        const groupData = step.groupData;

        return (
            <div className="whiteboard-container">
                <div className="whiteboard-content">
                    <h3 className="whiteboard-title">
                        🎨 Teaching: {step.title}
                    </h3>

                    {/* Mini K-Map visualization */}
                    <div className="whiteboard-kmap">
                        <div className="whiteboard-kmap-title">K-Map with Group Highlighted</div>
                        <table className="whiteboard-table">
                            <thead>
                                <tr>
                                    <th className="whiteboard-corner"></th>
                                    {getColumnLabels().map((label, idx) => (
                                        <th key={idx} className="whiteboard-header">{label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {grid.map((row, rowIdx) => (
                                    <tr key={rowIdx}>
                                        <td className="whiteboard-row-header">{getRowLabels()[rowIdx]}</td>
                                        {row.map((cell, colIdx) => {
                                            const isInGroup = groupData.cells.some(
                                                c => c.row === rowIdx && c.col === colIdx
                                            );
                                            return (
                                                <td
                                                    key={colIdx}
                                                    className={`whiteboard-cell ${cell === 1 ? 'has-one' : 'has-zero'
                                                        } ${isInGroup && animationPhase >= 0 ? 'in-group' : ''}`}
                                                    style={isInGroup ? {
                                                        backgroundColor: groupData.color.bg,
                                                        borderColor: groupData.color.border,
                                                        animation: animationPhase >= 0 ? 'cellPulse 1s ease-in-out infinite' : 'none'
                                                    } : {}}
                                                >
                                                    {cell}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {animationPhase >= 1 && (
                            <div className="whiteboard-annotation" style={{ animationDelay: '0.3s' }}>
                                ✏️ This group contains {groupData.size} cell{groupData.size > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>

                    {/* Variable Analysis */}
                    {animationPhase >= 2 && (
                        <div className="whiteboard-analysis fade-in">
                            <div className="whiteboard-section-title">📊 Variable Analysis</div>
                            <div className="whiteboard-variables">
                                <div className="variable-column">
                                    <div className="variable-label kept">Constant Variables</div>
                                    {groupData.eliminatedVars.kept.length > 0 ? (
                                        groupData.eliminatedVars.kept.map((v, idx) => {
                                            // Check if variable is 1 or 0
                                            const isPositive = !groupData.eliminatedVars.term.includes(v + "'");
                                            return (
                                                <div key={idx} className="variable-item kept-item">
                                                    <span className="var-name">{v}</span>
                                                    <span className="var-value">{isPositive ? '= 1' : '= 0'}</span>
                                                    <span className="var-result">
                                                        → {isPositive ? v : `${v}'`}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="variable-item empty">None</div>
                                    )}
                                </div>
                                <div className="variable-column">
                                    <div className="variable-label eliminated">Eliminated Variables</div>
                                    {groupData.eliminatedVars.eliminated.length > 0 ? (
                                        groupData.eliminatedVars.eliminated.map((v, idx) => (
                                            <div key={idx} className="variable-item eliminated-item">
                                                <span className="var-name">{v}</span>
                                                <span className="var-value">Changes (0 & 1)</span>
                                                <span className="var-result">→ Removed</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="variable-item empty">None (All constant)</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Final Term */}
                    {animationPhase >= 3 && (
                        <div className="whiteboard-result fade-in-delayed">
                            <div className="whiteboard-section-title">✨ Resulting Term</div>
                            <div className="whiteboard-term-box">
                                <div className="term-expression">
                                    {groupData.eliminatedVars.term}
                                </div>
                                <div className="term-explanation">
                                    This term represents all {groupData.minterms.length} minterm{groupData.minterms.length > 1 ? 's' : ''}  in this group
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (step.type === 'conclusion') {
        return (
            <div className="whiteboard-container">
                <div className="whiteboard-content">
                    <h3 className="whiteboard-title">🎯 Final Expression</h3>
                    <div className="whiteboard-conclusion">
                        <div className="conclusion-terms">
                            <div className="terms-list">
                                {step.groupData.finalTerms.map((term, idx) => (
                                    <div key={idx} className="term-item fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                                        <span className="term-number">Group {idx + 1}:</span>
                                        <span className="term-value">{term}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="conclusion-operator">
                            <div className="operator-symbol">⊕</div>
                            <div className="operator-text">OR them together</div>
                        </div>
                        <div className="conclusion-final">
                            <div className="final-label">Simplified Expression:</div>
                            <div className="final-expression">
                                F = {step.groupData.finalTerms.join(' + ')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};