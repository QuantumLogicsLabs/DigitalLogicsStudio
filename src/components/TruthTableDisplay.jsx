import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

const evaluateLogic = (expression, variables, binaryStr) => {
    let expr = expression;
    const sortedVars = [...variables].map((v, i) => ({ v, i })).sort((a, b) => b.v.length - a.v.length);
    sortedVars.forEach(({ v, i }) => {
        const bit = binaryStr[i];
        expr = expr.split(v + "'").join(`(!${bit})`);
        expr = expr.split(v).join(`${bit}`);
    });
    expr = expr.replace(/·/g, '&&').replace(/\./g, '&&').replace(/\+/g, '||').replace(/⊕/g, '^');
    expr = expr.replace(/(\d|\))(?=\(|\d|!)/g, '$1&&');
    try {
        // eslint-disable-next-line no-eval
        return eval(expr) ? 1 : 0;
    } catch (e) {
        return '-'; 
    }
};

export const TruthTableDisplay = ({ 
    numVariables, variables, inputValue, dontCares, 
    optimizationType = 'SOP', intermediateTerms = [], expression = "" 
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const cleanExpression = expression.includes('=') ? expression.split('=')[1].trim() : expression;
    const inputSet = new Set(inputValue.split(',').map(m => m.trim()).filter(m => m !== '').map(m => parseInt(m)));
    const dontCareSet = new Set(dontCares.split(',').map(m => m.trim()).filter(m => m !== '').map(m => parseInt(m)));
    const isPOS = optimizationType === 'POS';

    const renderTable = (showIntermediate) => (
        <table className="kmap-truth-table" style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th>Minterm</th>
                    {variables.map((v, idx) => <th key={`var-${idx}`}>{v}</th>)}
                    {showIntermediate && intermediateTerms.map((term, idx) => <th key={`term-head-${idx}`}>{term}</th>)}
                    <th>F</th>
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: Math.pow(2, numVariables) }, (_, i) => {
                    const binary = i.toString(2).padStart(numVariables, '0');
                    let output;
                    
                    if (dontCareSet.has(i)) {
                        if (showIntermediate && cleanExpression) {
                            output = evaluateLogic(cleanExpression, variables, binary);
                        } else {
                            output = 'X'; 
                        }
                    } else if (isPOS) {
                        output = inputSet.has(i) ? 0 : 1;
                    } else {
                        output = inputSet.has(i) ? 1 : 0;
                    }

                    return (
                        <tr key={i}>
                            <td className="input-term-cell">{isPOS ? 'M' : 'm'}{i}</td>
                            {binary.split('').map((bit, idx) => <td key={`bit-${idx}`}>{bit}</td>)}
                            {showIntermediate && intermediateTerms.map((term, idx) => (
                                <td key={`term-val-${idx}`} className="intermediate-cell">
                                    {evaluateLogic(term, variables, binary)}
                                </td>
                            ))}
                            <td className={`output-cell ${output === 1 ? 'output-1' : output === 0 ? 'output-0' : 'output-x'}`}>
                                {output}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <>
            <div className="kmap-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="kmap-section-title" style={{ margin: 0 }}>Truth Table</h2>
                    {intermediateTerms.length > 0 && (
                        <button 
                            className="tt-expand-btn"
                            onClick={() => setIsModalOpen(true)}
                            title="Expand to see step-by-step Truth Table"
                        >
                            <Maximize2 className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <div className="kmap-truth-table-wrap">{renderTable(false)}</div>
            </div>

            {isModalOpen && (
                <div className="circuit-modal-overlay tt-overlay-fixed" onClick={(e) => { if (e.target.classList.contains('circuit-modal-overlay')) setIsModalOpen(false); }}>
                    <div className="circuit-modal-container tt-modal-inner">
                        <button className="circuit-modal-close" onClick={() => setIsModalOpen(false)} title="Close Truth Table">
                            <X className="h-4 w-4" />
                        </button>
                        <div className="tt-modal-header">
                            <h2>Step-by-Step Truth Table</h2>
                        </div>
                        <div className="kmap-truth-table-wrap tt-modal-body">
                            {renderTable(true)}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};