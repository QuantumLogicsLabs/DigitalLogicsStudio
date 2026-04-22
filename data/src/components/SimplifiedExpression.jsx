import React from 'react';

export const SimplifiedExpression = ({ expression, showGroupingGuide, onToggleGuide }) => {
    return (
        <div className="kmap-card">
            <h2 className="kmap-section-title">Simplified Expression</h2>
            <div className="kmap-expression-box">
                <div className="kmap-expression">
                    {expression}
                </div>
            </div>

            <div className="kmap-info-box">
                <p className="kmap-info-title">Simplification Algorithm:</p>
                <ul className="kmap-info-list">
                    <li className="kmap-info-item">Uses Quine-McCluskey method for optimal minimization</li>
                    <li className="kmap-info-item">Identifies all prime implicants through systematic combination</li>
                    <li className="kmap-info-item">Selects essential prime implicants for minimal coverage</li>
                    <li className="kmap-info-item">Applies Boolean algebra absorption law (A + AB = A)</li>
                </ul>
            </div>

            <button
                className="kmap-btn kmap-btn-outline kmap-btn-full"
                onClick={onToggleGuide}
                style={{ marginTop: 'var(--spacing-lg)' }}
            >
                {showGroupingGuide ? 'Hide' : 'Show'} Grouping Guide
            </button>
        </div>
    );
};
