import React, { useState } from 'react';

export default function ParityBitCalculator() {
    const [rows, setRows] = useState([
        { id: 1, decimal: '' },
        { id: 2, decimal: '' },
        { id: 3, decimal: '' }
    ]);

    const [showEvenTable, setShowEvenTable] = useState(false);
    const [showOddTable, setShowOddTable] = useState(false);

    const calculate7BitBinary = (decimal) => {
        if (!decimal || isNaN(decimal) || decimal === '') return '';
        const num = parseInt(decimal, 10);
        if (num < 0 || num > 127) return 'Out of range';
        return num.toString(2).padStart(7, '0');
    };

    const calculateEvenParityBit = (binary7) => {
        if (!binary7 || binary7 === 'Out of range') return '';
        const ones = binary7.split('').filter(bit => bit === '1').length;
        return ones % 2 === 0 ? '0' : '1';
    };

    const calculateOddParityBit = (binary7) => {
        if (!binary7 || binary7 === 'Out of range') return '';
        const ones = binary7.split('').filter(bit => bit === '1').length;
        return ones % 2 === 0 ? '1' : '0';
    };

    const calculate8BitWithParity = (binary7, parityType = 'even') => {
        if (!binary7 || binary7 === 'Out of range') return '';
        const parityBit = parityType === 'even'
            ? calculateEvenParityBit(binary7)
            : calculateOddParityBit(binary7);
        return parityBit + binary7;
    };

    const binaryToHex = (binary8) => {
        if (!binary8 || binary8 === 'Out of range') return '';
        const decimal = parseInt(binary8, 2);
        return '0x' + decimal.toString(16).toUpperCase().padStart(2, '0');
    };

    const handleDecimalChange = (id, value) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, decimal: value } : row
        ));
    };

    const addRow = () => {
        setRows([...rows, { id: rows.length + 1, decimal: '' }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const evenParityExamples = [
        { decimal: 6, binary7: '0000110', parity: '0', binary8: '00000110', hex: '0x06' },
        { decimal: 15, binary7: '0001111', parity: '1', binary8: '10001111', hex: '0x8F' },
        { decimal: 24, binary7: '0011000', parity: '0', binary8: '00011000', hex: '0x18' }
    ];

    const oddParityExamples = [
        { decimal: 6, binary7: '0000110', parity: '1', binary8: '10000110', hex: '0x86' },
        { decimal: 15, binary7: '0001111', parity: '0', binary8: '00001111', hex: '0x0F' },
        { decimal: 24, binary7: '0011000', parity: '1', binary8: '10011000', hex: '0x98' }
    ];

    return (
        <div className="binary-container">
            <div className="binary-wrapper">
                <h1 className="binary-main-title">Parity Bit Calculator</h1>
                <p className="binary-subtitle">Error Detection using Even & Odd Parity</p>

                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-primary">
                        <span className="binary-dot binary-dot-primary"></span>
                        What is a Parity Bit?
                    </h2>

                    <div className="binary-info-box binary-info-primary">
                        <h3 className="binary-info-heading">Definition:</h3>
                        <p className="binary-text">
                            A <span className="binary-highlight-primary">parity bit</span> is an extra bit added to binary data
                            for error detection. It ensures the total number of 1-bits is either even (even parity) or odd (odd parity).
                        </p>

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">Key Points:</h4>
                            <div className="binary-example-box">
                                <ul className="binary-list">
                                    <li><strong>Purpose:</strong> Detect single-bit errors in data transmission</li>
                                    <li><strong>Position:</strong> Usually added as the leftmost (MSB) or rightmost (LSB) bit</li>
                                    <li><strong>Types:</strong> Even Parity and Odd Parity</li>
                                    <li><strong>Limitation:</strong> Cannot detect even number of bit errors (2, 4, 6...)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-primary">
                        <span className="binary-dot binary-dot-primary"></span>
                        Even Parity
                    </h2>

                    <div className="binary-info-box binary-info-primary">
                        <h3 className="binary-info-heading">How it works:</h3>
                        <p className="binary-text">
                            The parity bit is set so that the <span className="binary-highlight-primary">total number of 1s</span> in
                            the entire data (including parity bit) is <span className="binary-highlight-primary">EVEN</span>.
                        </p>

                        <button
                            className="binary-toggle-btn"
                            onClick={() => setShowEvenTable(!showEvenTable)}
                        >
                            {showEvenTable ? "Hide Even Parity Examples" : "Show Even Parity Examples"}
                        </button>

                        {showEvenTable && (
                            <div className="binary-table-container">
                                <table className="binary-table">
                                    <thead className="binary-table-header">
                                        <tr>
                                            <th className="binary-table-cell-center">Decimal</th>
                                            <th className="binary-table-cell-center">7-Bit Binary</th>
                                            <th className="binary-table-cell-center">Parity Bit</th>
                                            <th className="binary-table-cell-center">8-Bit Result</th>
                                            <th className="binary-table-cell-center">Hexadecimal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evenParityExamples.map((example) => (
                                            <tr key={example.decimal} className="binary-table-row">
                                                <td className="binary-table-cell binary-table-cell-center">{example.decimal}</td>
                                                <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-secondary">
                                                    {example.binary7}
                                                </td>
                                                <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-danger">
                                                    {example.parity}
                                                </td>
                                                <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-primary">
                                                    <span className="binary-table-cell-danger">{example.parity}</span>
                                                    {example.binary7}
                                                </td>
                                                <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-amber">
                                                    {example.hex}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                Example: <span className="binary-highlight-primary">Decimal 6</span>
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li><strong>7-bit binary:</strong> 0000110</li>
                                    <li><strong>Count 1s:</strong> Two 1s (EVEN)</li>
                                    <li><strong>Parity bit:</strong> 0 (to keep total EVEN)</li>
                                    <li><strong>Result:</strong> <span className="binary-highlight-primary">0</span>0000110</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-secondary">
                        <span className="binary-dot binary-dot-secondary"></span>
                        Odd Parity
                    </h2>

                    <div className="binary-info-box binary-info-secondary">
                        <h3 className="binary-info-heading">How it works:</h3>
                        <p className="binary-text">
                            The parity bit is set so that the <span className="binary-highlight-secondary">total number of 1s</span> in
                            the entire data (including parity bit) is <span className="binary-highlight-secondary">ODD</span>.
                        </p>

                        <button
                            className="binary-toggle-btn binary-toggle-btn-secondary"
                            onClick={() => setShowOddTable(!showOddTable)}
                        >
                            {showOddTable ? "Hide Odd Parity Examples" : "Show Odd Parity Examples"}
                        </button>

                        {showOddTable && (
                            <div className="binary-table-container">
                                <table className="binary-table">
                                    <thead className="binary-table-header">
                                        <tr>
                                            <th className="binary-table-cell-center">Decimal</th>
                                            <th className="binary-table-cell-center">7-Bit Binary</th>
                                            <th className="binary-table-cell-center">Parity Bit</th>
                                            <th className="binary-table-cell-center">8-Bit Result</th>
                                            <th className="binary-table-cell-center">Hexadecimal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {oddParityExamples.map((example) => (
                                            <tr key={example.decimal} className="binary-table-row">
                                                <td className="binary-table-cell binary-table-cell-center">{example.decimal}</td>
                                                <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-secondary">
                                                    {example.binary7}
                                                </td>
                                                <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-danger">
                                                    {example.parity}
                                                </td>
                                                <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-primary">
                                                    <span className="binary-table-cell-danger">{example.parity}</span>
                                                    {example.binary7}
                                                </td>
                                                <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-amber">
                                                    {example.hex}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                Example: <span className="binary-highlight-secondary">Decimal 6</span>
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li><strong>7-bit binary:</strong> 0000110</li>
                                    <li><strong>Count 1s:</strong> Two 1s (EVEN)</li>
                                    <li><strong>Parity bit:</strong> 1 (to make total ODD)</li>
                                    <li><strong>Result:</strong> <span className="binary-highlight-secondary">1</span>0000110</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-primary">
                        <span className="binary-dot binary-dot-primary"></span>
                        Interactive Calculator (Even Parity)
                    </h2>

                    <div className="binary-table-container">
                        <table className="binary-input-table">
                            <thead>
                                <tr>
                                    <th>Decimal (0-127)</th>
                                    <th>7-Bit Binary</th>
                                    <th>Parity Bit</th>
                                    <th>8-Bit with Parity</th>
                                    <th>Hexadecimal</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => {
                                    const binary7 = calculate7BitBinary(row.decimal);
                                    const parityBit = calculateEvenParityBit(binary7);
                                    const binary8 = calculate8BitWithParity(binary7, 'even');
                                    const hex = binaryToHex(binary8);

                                    return (
                                        <tr key={row.id}>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="binary-input-table-field"
                                                    value={row.decimal}
                                                    onChange={(e) => handleDecimalChange(row.id, e.target.value)}
                                                    placeholder="0-127"
                                                    min="0"
                                                    max="127"
                                                />
                                            </td>
                                            <td className="binary-table-cell-center binary-table-cell-mono binary-table-cell-secondary binary-input-table-result">
                                                {binary7}
                                            </td>
                                            <td className="binary-table-cell-center binary-table-cell-mono binary-table-cell-danger binary-input-table-result">
                                                {parityBit}
                                            </td>
                                            <td className="binary-table-cell-center binary-table-cell-mono binary-table-cell-primary binary-input-table-result">
                                                {binary8 && (
                                                    <>
                                                        <span className="binary-table-cell-danger">{parityBit}</span>
                                                        {binary7}
                                                    </>
                                                )}
                                            </td>
                                            <td className="binary-table-cell-center binary-table-cell-mono binary-table-cell-amber binary-input-table-result">
                                                {hex}
                                            </td>
                                            <td className="binary-table-cell-center">
                                                <button
                                                    onClick={() => removeRow(row.id)}
                                                    disabled={rows.length === 1}
                                                    className={rows.length === 1 ? 'binary-btn binary-btn-disabled' : 'binary-btn binary-btn-danger'}
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <button
                        className="binary-btn binary-btn-primary"
                        onClick={addRow}
                    >
                        + Add Row
                    </button>
                </section>

                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-secondary">
                        <span className="binary-dot binary-dot-secondary"></span>
                        Even vs Odd Parity Comparison
                    </h2>

                    <div className="binary-info-box binary-info-secondary">
                        <div className="binary-comparison-grid">
                            <div className="binary-comparison-card binary-comparison-card-primary">
                                <h4 className="binary-comparison-title binary-highlight-primary">
                                    EVEN Parity
                                </h4>
                                <ul className="binary-list">
                                    <li>Total 1s must be <strong>EVEN</strong></li>
                                    <li>If data has ODD 1s → parity = <strong>1</strong></li>
                                    <li>If data has EVEN 1s → parity = <strong>0</strong></li>
                                    <li>Used in: RAM, UART</li>
                                </ul>
                            </div>

                            <div className="binary-comparison-card binary-comparison-card-secondary">
                                <h4 className="binary-comparison-title binary-highlight-secondary">
                                    ODD Parity
                                </h4>
                                <ul className="binary-list">
                                    <li>Total 1s must be <strong>ODD</strong></li>
                                    <li>If data has EVEN 1s → parity = <strong>1</strong></li>
                                    <li>If data has ODD 1s → parity = <strong>0</strong></li>
                                    <li>Used in: Serial comm, ASCII</li>
                                </ul>
                            </div>
                        </div>

                        <div className="binary-warning-box">
                            <h4 className="binary-warning-title">
                                ⚠️ Important Notes:
                            </h4>
                            <ul className="binary-list">
                                <li>Both methods detect <strong>single-bit errors</strong> only</li>
                                <li>Cannot detect errors in <strong>even number of bits</strong> (2, 4, 6...)</li>
                                <li>Cannot <strong>correct</strong> errors, only detect them</li>
                                <li>Simple but effective for basic error detection</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
