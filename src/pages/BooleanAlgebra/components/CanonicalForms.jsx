import React from 'react';
import { Info } from 'lucide-react';

const CanonicalForms = ({ canonical }) => {
  return (
    <div className="canonical-forms">
      <div className="canonical-card">
        <div className="card-header">
          <h4>Sum of Products (SOP)</h4>
          <span className="beginner-hint"><Info size={12} /> Combines rows where output is 1</span>
        </div>
        
        <div className="logic-diagram-wrapper">
          <svg width="180" height="100" viewBox="0 0 180 100" className="neon-logic-svg sop-circuit">
            {/* Inputs */}
            <line x1="10" y1="20" x2="40" y2="20" className="wire" />
            <line x1="10" y1="35" x2="40" y2="35" className="wire" />
            <line x1="10" y1="65" x2="40" y2="65" className="wire" />
            <line x1="10" y1="80" x2="40" y2="80" className="wire" />
            
            {/* AND Gates */}
            <path d="M40,15 L60,15 A12,12 0 0,1 60,40 L40,40 Z" className="logic-gate" />
            <path d="M40,60 L60,60 A12,12 0 0,1 60,85 L40,85 Z" className="logic-gate" />
            
            {/* Intermediate Wires */}
            <line x1="72" y1="27" x2="110" y2="40" className="wire" />
            <line x1="72" y1="72" x2="110" y2="60" className="wire" />
            
            {/* OR Gate */}
            <path d="M110,35 C115,35 125,40 125,50 C125,60 115,65 110,65 C115,60 115,40 110,35 M125,50 L145,50" className="logic-gate" />
            
            {/* Final Output */}
            <line x1="145" y1="50" x2="170" y2="50" className="wire" />
            <circle cx="170" cy="50" r="3" className="output-node" />
          </svg>
        </div>

        <div className="canonical-expr">{canonical.sop}</div>
        <div className="subtext" style={{marginTop: '0.5rem', color: 'var(--secondary-text)'}}>{canonical.minterms}</div>
      </div>

      <div className="canonical-card" style={{ borderLeftColor: 'var(--accent-color, #8b5cf6)' }}>
        <div className="card-header">
          <h4>Product of Sums (POS)</h4>
          <span className="beginner-hint"><Info size={12} /> Combines rows where output is 0</span>
        </div>

        <div className="logic-diagram-wrapper">
          <svg width="180" height="100" viewBox="0 0 180 100" className="neon-logic-svg pos-circuit">
            {/* Inputs */}
            <line x1="10" y1="20" x2="40" y2="20" className="wire" />
            <line x1="10" y1="35" x2="40" y2="35" className="wire" />
            <line x1="10" y1="65" x2="40" y2="65" className="wire" />
            <line x1="10" y1="80" x2="40" y2="80" className="wire" />
            
            {/* OR Gates */}
            <path d="M40,15 C45,15 55,20 55,27.5 C55,35 45,40 40,40 C45,35 45,20 40,15 M55,27.5 L70,27.5" className="logic-gate" />
            <path d="M40,60 C45,60 55,65 55,72.5 C55,80 45,85 40,85 C45,80 45,65 40,60 M55,72.5 L70,72.5" className="logic-gate" />
            
            {/* Intermediate Wires */}
            <line x1="70" y1="27.5" x2="110" y2="40" className="wire" />
            <line x1="70" y1="72.5" x2="110" y2="60" className="wire" />
            
            {/* AND Gate */}
            <path d="M110,35 L130,35 A12,12 0 0,1 130,65 L110,65 Z" className="logic-gate" />
            
            {/* Final Output */}
            <line x1="142" y1="50" x2="170" y2="50" className="wire" />
            <circle cx="170" cy="50" r="3" className="output-node" />
          </svg>
        </div>

        <div className="canonical-expr">{canonical.pos}</div>
        <div className="subtext" style={{marginTop: '0.5rem', color: 'var(--secondary-text)'}}>{canonical.maxterms}</div>
      </div>
    </div>
  );
};

export default CanonicalForms;
