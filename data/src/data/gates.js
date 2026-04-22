// Gate symbols as SVG components
export const gateSymbols = {
    'AND': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <path d="M 10 10 L 10 50 L 40 50 Q 65 50 65 30 Q 65 10 40 10 Z"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
            <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'OR': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <path d="M 10 10 Q 25 10 40 30 Q 25 50 10 50 Q 20 30 10 10 Z"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M 40 30 Q 60 30 65 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
            <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'NOT': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <path d="M 10 15 L 10 45 L 55 30 Z"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="60" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="2" />
            <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'NAND': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <path d="M 10 10 L 10 50 L 40 50 Q 60 50 60 30 Q 60 10 40 10 Z"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="65" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
            <line x1="70" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'NOR': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <path d="M 10 10 Q 25 10 40 30 Q 25 50 10 50 Q 20 30 10 10 Z"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M 40 30 Q 55 30 60 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="65" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
            <line x1="70" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'XOR': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <path d="M 5 10 Q 15 30 5 50" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 10 10 Q 25 10 40 30 Q 25 50 10 50 Q 20 30 10 10 Z"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M 40 30 Q 60 30 65 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
            <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'XNOR': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <path d="M 5 10 Q 15 30 5 50" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 10 10 Q 25 10 40 30 Q 25 50 10 50 Q 20 30 10 10 Z"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M 40 30 Q 55 30 60 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="65" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="38" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
            <line x1="70" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'BUFFER': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <path d="M 10 15 L 10 45 L 65 30 Z"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="2" />
            <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'INPUT': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <rect x="15" y="20" width="50" height="20" rx="3"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="65" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    'OUTPUT': (
        <svg viewBox="0 0 80 60" className="gate-symbol">
            <rect x="15" y="20" width="50" height="20" rx="3"
                fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="2" y1="30" x2="15" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
    )
};