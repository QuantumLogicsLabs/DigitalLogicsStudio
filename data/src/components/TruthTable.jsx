import { useState } from 'react';

export function TruthTableGenerator({ truthTable }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!truthTable?.headers || truthTable.headers.length === 0) {
        return null;
    }

    return (
        <>
            <button
                className="tt-button"
                onClick={() => setIsOpen(true)}
            >
                View Truth Table
            </button>

            {isOpen && (
                <div
                    className="tt-overlay"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="tt-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="tt-close"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>

                        <h2 className="tt-title">Truth Table</h2>
                        <table className="tt-table">
                            <thead>
                                <tr>
                                    {truthTable.headers.map((header, i) => (
                                        <th key={i}>{header}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {truthTable.rows.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </>
    );
}