import React from 'react';
import { 
  Link as AndIcon, 
  GitBranch as OrIcon, 
  CircleOff as NotIcon, 
  Zap as XorIcon, 
  PlusCircle, 
  MinusCircle 
} from 'lucide-react';

const Controls = ({ vars, expression, setExpression, insertSymbol, addVar, removeVar }) => {
  return (
    <>
      <div className="expression-input-wrapper">
        <input 
          type="text" 
          className="expression-input"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. (A & B) | !C"
        />
      </div>

      <div className="controls-row">
        <button className="glass-btn" onClick={() => insertSymbol(' & ')} title="Logical AND">
          <AndIcon size={16} className="btn-icon" /> AND (&)
        </button>
        <button className="glass-btn" onClick={() => insertSymbol(' | ')} title="Logical OR">
          <OrIcon size={16} className="btn-icon" /> OR (|)
        </button>
        <button className="glass-btn" onClick={() => insertSymbol(' ! ')} title="Logical NOT">
          <NotIcon size={16} className="btn-icon" /> NOT (!)
        </button>
        <button className="glass-btn" onClick={() => insertSymbol(' ^ ')} title="Logical XOR">
          <XorIcon size={16} className="btn-icon" /> XOR (^)
        </button>
        <button className="glass-btn" onClick={() => insertSymbol(' ( ')}>(</button>
        <button className="glass-btn" onClick={() => insertSymbol(' ) ')}>)</button>
        <div style={{ flexGrow: 1 }}></div>
        <button className="glass-btn primary" onClick={addVar} title="Add another variable">
          <PlusCircle size={16} className="btn-icon" /> Variable
        </button>
        <button className="glass-btn" onClick={removeVar} title="Remove last variable">
          <MinusCircle size={16} className="btn-icon" /> Variable
        </button>
      </div>
    </>
  );
};

export default Controls;
