import React from 'react';

export const TruthTableDisplay = ({ numVariables, variables, inputValue, dontCares, optimizationType = 'SOP' }) => {
    
    const inputSet = new Set(
        inputValue
            .split(',')
            .map(m => m.trim())
            .filter(m => m !== '')
            .map(m => parseInt(m))
    );
    
    const dontCareSet = new Set(
        dontCares
            .split(',')
            .map(m => m.trim())
            .filter(m => m !== '')
            .map(m => parseInt(m))
    );

    const isPOS = optimizationType === 'POS';

    return (
        <div className="kmap-card">
            <h2 className="kmap-section-title">Truth Table</h2>
            <div className="kmap-truth-table-wrap">
                <table className="kmap-truth-table">
                    <thead>
                        <tr>
                            <th>Minterm</th>
                            {variables.map((v, idx) => (
                                <th key={idx}>{v}</th>
                            ))}
                            <th>F</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: Math.pow(2, numVariables) }, (_, i) => {
                            const binary = i.toString(2).padStart(numVariables, '0');
                            let output;
                            
                            if (dontCareSet.has(i)) {
                                output = 'X';
                            } else if (isPOS) {
                                output = inputSet.has(i) ? 0 : 1;
                            } else {
                                output = inputSet.has(i) ? 1 : 0;
                            }

                            return (
                                <tr key={i}>
                                    <td className="input-term-cell">{isPOS ? 'M' : 'm'}{i}</td>
                                    {binary.split('').map((bit, idx) => (
                                        <td key={idx}>{bit}</td>
                                    ))}
                                    <td className={`output-cell ${
                                        output === 1 ? 'output-1' : 
                                        output === 0 ? 'output-0' : 
                                        'output-x'
                                    }`}>
                                        {output}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
