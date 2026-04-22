import React, { useState, useEffect } from 'react';

export default function BinaryRepresentation() {
    const [smInput, setSmInput] = useState('');
    const [smPadding, setSmPadding] = useState(0);
    const [smResult, setSmResult] = useState(null);
    const [smBitsInput, setSmBitsInput] = useState(8);
    const [smRange, setSmRange] = useState({ min: 0, max: 0, distinct: 0 });
    const [showSmChart, setShowSmChart] = useState(false);

    const [tcInput, setTcInput] = useState('');
    const [tcPadding, setTcPadding] = useState(0);
    const [tcResult, setTcResult] = useState(null);
    const [tcBitsInput, setTcBitsInput] = useState(8);
    const [tcRange, setTcRange] = useState({ min: 0, max: 0, distinct: 0 });
    const [showTcChart, setShowTcChart] = useState(false);
    const [unsignedBits, setUnsignedBits] = useState(8);
    const [unsignedRange, setUnsignedRange] = useState({ min: 0, max: 255, distinct: 256 });

    useEffect(() => {
        const n = parseInt(smBitsInput, 10);
        if (!isNaN(n) && n > 0 && n <= 53) {
            const max = Math.pow(2, n - 1) - 1;
            setSmRange({ min: -max, max, distinct: Math.pow(2, n) });
        } else {
            setSmRange(null);
        }
    }, [smBitsInput]);

    useEffect(() => {
        const n = parseInt(tcBitsInput, 10);
        if (!isNaN(n) && n > 0 && n <= 53) {
            const max = Math.pow(2, n - 1) - 1;
            setTcRange({ min: -Math.pow(2, n - 1), max, distinct: Math.pow(2, n) });
        } else {
            setTcRange(null);
        }
    }, [tcBitsInput]);

    useEffect(() => {
        const n = parseInt(unsignedBits, 10);
        if (!isNaN(n) && n > 0 && n <= 53) {
            const max = Math.pow(2, n) - 1;
            setUnsignedRange({ min: 0, max, distinct: Math.pow(2, n) });
        } else {
            setUnsignedRange(null);
        }
    }, [unsignedBits]);

    useEffect(() => {
        if (!smInput || smInput === '-' || smInput === '+') {
            setSmResult(null);
            return;
        }
        const num = parseInt(smInput, 10);
        if (isNaN(num)) return;

        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            setSmResult({ error: "Number too large" });
            return;
        }

        const isNegative = num < 0;
        const magnitude = Math.abs(num);
        let binaryStr = magnitude.toString(2);
        const totalMagnitudeBits = Math.max(binaryStr.length, binaryStr.length + smPadding);

        setSmResult({
            signBit: isNegative ? '1' : '0',
            magnitudeBits: binaryStr.padStart(totalMagnitudeBits, '0'),
            totalBits: totalMagnitudeBits + 1,
            decimal: num.toString(),
            error: null
        });
    }, [smInput, smPadding]);

    useEffect(() => {
        if (!tcInput || tcInput === '-' || tcInput === '+') {
            setTcResult(null);
            return;
        }
        const num = parseInt(tcInput, 10);
        if (isNaN(num)) return;

        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            setTcResult({ error: "Number too large" });
            return;
        }

        let minBits;
        if (num >= 0) {
            minBits = num.toString(2).length + 1;
        } else {
            let abs = Math.abs(num);
            let bits = abs.toString(2).length;
            if (num < -Math.pow(2, bits - 1)) bits++;
            minBits = bits + 1;
        }

        const targetBits = Math.max(minBits, minBits + tcPadding);
        let binary = num >= 0
            ? num.toString(2).padStart(targetBits, '0')
            : (Math.pow(2, targetBits) + num).toString(2);

        setTcResult({
            binary,
            signBit: binary[0],
            remainingBits: binary.slice(1),
            totalBits: targetBits,
            decimal: num.toString(),
            error: null
        });
    }, [tcInput, tcPadding]);

    const generateChartData = (type) => {
        const data = [];
        for (let i = 10; i >= -10; i--) {
            let binary = '';

            if (type === 'SM') {
                const abs = Math.abs(i);
                const bin = abs.toString(2).padStart(4, '0');
                if (i === 0) {
                    binary = `0${bin}`;
                } else {
                    binary = (i < 0 ? '1' : '0') + bin;
                }
            } else {
                if (i >= 0) {
                    binary = i.toString(2).padStart(5, '0');
                } else {
                    binary = (32 + i).toString(2);
                }
            }
            data.push({ dec: i, bin: binary });
        }
        return data;
    };

    return (
        <div className="binary-container">
            <div className="binary-wrapper">
                <h1 className="binary-main-title">Binary Number Representation</h1>
                <p className="binary-subtitle">Standard Precision (Max ±9 Quadrillion)</p>

                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-primary">
                        <span className="binary-dot binary-dot-primary"></span>
                        Signed Magnitude
                    </h2>

                    <div className="binary-info-box binary-info-primary">
                        <h3 className="binary-info-heading">How it works:</h3>
                        <p className="binary-text">
                            <span className="binary-highlight-primary">Leftmost bit</span> is sign (0=+, 1=-). Remaining bits are magnitude.
                        </p>

                        <button
                            className="binary-toggle-btn"
                            onClick={() => setShowSmChart(!showSmChart)}
                        >
                            {showSmChart ? "Hide Reference Chart (-10 to 10)" : "Show Reference Chart (-10 to 10)"}
                        </button>

                        {showSmChart && (
                            <div className="binary-table-container">
                                <table className="binary-table">
                                    <thead className="binary-table-header">
                                        <tr>
                                            <th>Decimal</th>
                                            <th className="binary-table-cell-right">5-Bit Binary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateChartData('SM').map((row) => (
                                            <tr key={row.dec} className="binary-table-row">
                                                <td className="binary-table-cell">{row.dec}</td>
                                                <td className="binary-table-cell binary-table-cell-right binary-table-cell-mono binary-table-cell-primary">
                                                    <span className="binary-table-cell-danger">{row.bin[0]}</span>
                                                    {row.bin.slice(1)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                Example: <span className="binary-highlight-primary">-5</span>
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li><strong>Magnitude:</strong> |−5| = 5</li>
                                    <li><strong>Binary:</strong> 0101</li>
                                    <li><strong>Add Sign:</strong> <span className="binary-highlight-primary">1</span>0101 (1 for negative)</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="binary-info-box binary-info-tertiary">
                        <h3 className="binary-info-heading">Step 1: Calculate Range</h3>
                        <div className="binary-controls-grid">
                            <div className="binary-input-group">
                                <label className="binary-label">Number of Bits (N)</label>
                                <input
                                    type="number"
                                    className="binary-input-field binary-input-primary"
                                    value={smBitsInput}
                                    onChange={(e) => setSmBitsInput(e.target.value)}
                                    min="2"
                                    max="53"
                                />
                            </div>
                            <div className="binary-input-group">
                                {smRange && (
                                    <div className="binary-text">
                                        <div className="binary-highlight-primary">
                                            {smRange.min.toLocaleString()} to +{smRange.max.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <h3 className="binary-info-heading">Step 2: Convert Decimal</h3>
                    <div className="binary-controls-grid">
                        <div className="binary-input-group">
                            <label className="binary-label">Decimal Number</label>
                            <input
                                type="number"
                                className="binary-input-field binary-input-primary"
                                value={smInput}
                                onChange={(e) => setSmInput(e.target.value)}
                                placeholder="Enter integer..."
                            />
                        </div>
                        <div className="binary-input-group">
                            <label className="binary-label">Add Padding</label>
                            <input
                                type="number"
                                className="binary-input-field binary-input-primary"
                                value={smPadding}
                                onChange={(e) => setSmPadding(Math.max(0, parseInt(e.target.value) || 0))}
                                min="0"
                            />
                        </div>
                    </div>

                    {smResult && (
                        <div className="binary-result-box binary-result-primary">
                            {smResult.error ? (
                                <div className="binary-error-msg">{smResult.error}</div>
                            ) : (
                                <>
                                    <div className="binary-bits-display">
                                        <span className="binary-sign-bit binary-sb-primary">{smResult.signBit}</span>
                                        <span className="binary-bits-primary">{smResult.magnitudeBits}</span>
                                    </div>
                                    <div className="binary-details-grid">
                                        <div><strong>Bits:</strong> {smResult.totalBits}</div>
                                        <div><strong>Sign:</strong> {smResult.signBit === '1' ? 'Negative' : 'Positive'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </section>

                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-primary">
                        <span className="binary-dot binary-dot-primary"></span>
                        Unsigned Range (0 to 2ⁿ − 1)
                    </h2>

                    <div className="binary-info-box binary-info-primary">
                        <h3 className="binary-info-heading">Data range of n bits</h3>
                        <p className="binary-text">
                            When all bits are used for <span className="binary-highlight-primary">magnitude only</span>,
                            the smallest value is <strong>0</strong> (all bits 0) and the largest value is when all bits are 1.
                            This gives the classic range:
                            <br />
                            <span className="binary-highlight-primary">0 to 2ⁿ − 1</span>
                        </p>

                        <div className="binary-controls-grid">
                            <div className="binary-input-group">
                                <label className="binary-label">Number of Bits (n)</label>
                                <input
                                    type="number"
                                    className="binary-input-field binary-input-primary"
                                    value={unsignedBits}
                                    onChange={(e) => setUnsignedBits(e.target.value)}
                                    min="1"
                                    max="53"
                                />
                            </div>
                            <div className="binary-input-group">
                                {unsignedRange && (
                                    <div className="binary-text">
                                        <p>
                                            <span className="binary-highlight-primary">
                                                Range: {unsignedRange.min.toLocaleString()} to {unsignedRange.max.toLocaleString()}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Distinct values:</strong> {unsignedRange.distinct.toLocaleString()} (2ⁿ)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="binary-example-box">
                            <h4 className="binary-reference-title">Example: n = 4 bits</h4>
                            <p className="binary-text">
                                4 bits give 2⁴ = 16 distinct patterns, from 0000₂ = 0₁₀ up to 1111₂ = 15₁₀.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-secondary">
                        <span className="binary-dot binary-dot-secondary"></span>
                        2's Complement
                    </h2>

                    <div className="binary-info-box binary-info-secondary">
                        <h3 className="binary-info-heading">Deep Dive:</h3>
                        <p className="binary-text">
                            Standard computer integer math. No double zeros. Easy subtraction.
                        </p>

                        <button
                            className="binary-toggle-btn binary-toggle-btn-secondary"
                            onClick={() => setShowTcChart(!showTcChart)}
                        >
                            {showTcChart ? "Hide Reference Chart (-10 to 10)" : "Show Reference Chart (-10 to 10)"}
                        </button>

                        {showTcChart && (
                            <div className="binary-table-container">
                                <table className="binary-table">
                                    <thead className="binary-table-header">
                                        <tr>
                                            <th>Decimal</th>
                                            <th className="binary-table-cell-right">5-Bit Binary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateChartData('TC').map((row) => (
                                            <tr key={row.dec} className="binary-table-row">
                                                <td className="binary-table-cell">{row.dec}</td>
                                                <td className="binary-table-cell binary-table-cell-right binary-table-cell-mono binary-table-cell-secondary">
                                                    <span className={row.bin[0] === '1' ? 'binary-table-cell-danger' : ''}>
                                                        {row.bin[0]}
                                                    </span>
                                                    {row.bin.slice(1)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                Example: <span className="binary-highlight-secondary">-5</span>
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li><strong>+5:</strong> 0101</li>
                                    <li><strong>Invert:</strong> 1010</li>
                                    <li><strong>Add 1:</strong> <span className="binary-highlight-secondary">1011</span></li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="binary-info-box binary-info-tertiary">
                        <h3 className="binary-info-heading">Step 1: Calculate Range</h3>
                        <div className="binary-controls-grid">
                            <div className="binary-input-group">
                                <label className="binary-label">Number of Bits (N)</label>
                                <input
                                    type="number"
                                    className="binary-input-field binary-input-secondary"
                                    value={tcBitsInput}
                                    onChange={(e) => setTcBitsInput(e.target.value)}
                                    min="2"
                                    max="53"
                                />
                            </div>
                            <div className="binary-input-group">
                                {tcRange && (
                                    <div className="binary-text">
                                        <div className="binary-highlight-secondary">
                                            {tcRange.min.toLocaleString()} to +{tcRange.max.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <h3 className="binary-info-heading">Step 2: Convert Decimal</h3>
                    <div className="binary-controls-grid">
                        <div className="binary-input-group">
                            <label className="binary-label">Decimal Number</label>
                            <input
                                type="number"
                                className="binary-input-field binary-input-secondary"
                                value={tcInput}
                                onChange={(e) => setTcInput(e.target.value)}
                                placeholder="Enter integer..."
                            />
                        </div>
                        <div className="binary-input-group">
                            <label className="binary-label">Add Padding</label>
                            <input
                                type="number"
                                className="binary-input-field binary-input-secondary"
                                value={tcPadding}
                                onChange={(e) => setTcPadding(Math.max(0, parseInt(e.target.value) || 0))}
                                min="0"
                            />
                        </div>
                    </div>

                    {tcResult && (
                        <div className="binary-result-box binary-result-secondary">
                            {tcResult.error ? (
                                <div className="binary-error-msg">{tcResult.error}</div>
                            ) : (
                                <>
                                    <div className="binary-bits-display">
                                        <span className="binary-sign-bit binary-sb-primary">{tcResult.signBit}</span>
                                        <span className="binary-bits-secondary">{tcResult.remainingBits}</span>
                                    </div>
                                    <div className="binary-details-grid">
                                        <div><strong>Bits:</strong> {tcResult.totalBits}</div>
                                        <div><strong>Decimal:</strong> {tcResult.decimal}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
