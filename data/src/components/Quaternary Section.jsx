import React, { useState } from 'react';

export function QuaternarySection() {
    const [isOpen, setIsOpen] = useState(false);
    const [hexValue, setHexValue] = useState('');
    const [quatValue, setQuatValue] = useState('');

    // Logic to convert Hex to Quaternary
    const handleHexInput = (val) => {
        const cleaned = val.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
        setHexValue(cleaned);
        if (cleaned === '') {
            setQuatValue('');
            return;
        }
        // Hex -> Dec -> Quat
        const decimal = parseInt(cleaned, 16);
        if (!isNaN(decimal)) {
            setQuatValue(decimal.toString(4));
        }
    };

    // Logic to convert Quaternary to Hex
    const handleQuatInput = (val) => {
        const cleaned = val.replace(/[^0-3]/g, '');
        setQuatValue(cleaned);
        if (cleaned === '') {
            setHexValue('');
            return;
        }
        // Quat -> Dec -> Hex
        const decimal = parseInt(cleaned, 4);
        if (!isNaN(decimal)) {
            setHexValue(decimal.toString(16).toUpperCase());
        }
    };

    return (
        <div className="quat-container">
            <div className="quat-dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="quat-title">Brain Teaser</h3>
                <span className={`quat-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="quat-content">
                    <div className="quat-info-text">
                        <p>
                            🧠 <strong>Welcome to a number-system brain teaser!</strong><br />
                            The <strong>Quaternary system (Base-4)</strong> only uses four digits:
                            <strong> 0, 1, 2, 3</strong>.
                            The fun twist? Each Quaternary digit secretly represents
                            <strong> two bits</strong>.
                            So yes — it’s binary in disguise 😎
                        </p>

                        <p style={{ marginTop: '10px' }}>
                            🚀 <strong>The chill Hex → Quat idea:</strong><br />
                            Every Hex digit contains exactly <strong>4 bits</strong>,
                            and Quaternary eats bits in <strong>pairs of 2</strong>.
                            That’s why this conversion fits together perfectly.
                        </p>
                    </div>

                    <div className="quat-interactive-grid">
                        <div className="quat-input-group">
                            <label className="quat-label">Hexadecimal (Base-16)</label>
                            <input
                                type="text"
                                className="quat-input"
                                placeholder="Try something like AF2"
                                value={hexValue}
                                onChange={(e) => handleHexInput(e.target.value)}
                            />
                        </div>

                        <div className="quat-input-group">
                            <label className="quat-label">Quaternary (Base-4)</label>
                            <input
                                type="text"
                                className="quat-input"
                                placeholder="Watch the Base-4 magic ✨"
                                value={quatValue}
                                onChange={(e) => handleQuatInput(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* NEW SECTION — DIRECT CONVERSION EXPLANATION */}
                    <div className="quat-info-text" style={{ marginTop: '20px' }}>
                        <p>
                            🎯 <strong>Convert Hex → Quat WITHOUT any middle steps:</strong><br />
                            You don’t actually need to think about binary or decimal at all.
                            Just memorize this simple rule:
                        </p>

                        <p style={{ marginTop: '10px' }}>
                            👉 <strong>Each Hex digit maps directly to TWO Quaternary digits.</strong><br />
                            Why? Because both represent the same 4 bits — just grouped differently.
                        </p>

                        <p style={{ marginTop: '10px' }}>
                            🔍 <strong>Example:</strong><br />
                            Hex <strong>A</strong> has a value of <strong>10</strong>.<br />
                            Divide it by 4:<br />
                            10 ÷ 4 = 2 remainder 2 → so it becomes <strong>22</strong> in Quaternary.
                        </p>

                        <p style={{ marginTop: '10px' }}>
                            Another one:<br />
                            Hex <strong>F</strong> = 15 → 15 ÷ 4 = 3 remainder 3 → <strong>33</strong> 🔥
                        </p>

                        <p style={{ marginTop: '10px' }}>
                            Now do this digit-by-digit and simply <strong>join the results</strong>.<br />
                            Example: <strong>AF</strong> → A = 22, F = 33 → <strong>2233</strong>
                        </p>
                    </div>

                    <div className="instructions" style={{ marginTop: '20px' }}>
                        <p>
                            💡 <strong>Golden Rule:</strong><br />
                            1 Hex digit → <strong>2 Quaternary digits</strong>, always.<br />
                            Once this clicks, conversions feel like cheating 😉
                        </p>
                    </div>
                </div>
            )}
        </div>

    );
}