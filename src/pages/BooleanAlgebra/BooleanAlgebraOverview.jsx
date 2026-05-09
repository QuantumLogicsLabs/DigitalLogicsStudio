import React, { useState, useMemo } from 'react';
import { generateTruthTable, getCanonicalForms } from '../../utils/boolMath';
import './BooleanAlgebra.css';

import Controls from './components/Controls';
import TruthTable from './components/TruthTable';
import CanonicalForms from './components/CanonicalForms';
import InfoCards from './components/InfoCards';

import { 
  Link as AndIcon, 
  GitBranch as OrIcon, 
  CircleOff as NotIcon, 
  Zap as XorIcon 
} from 'lucide-react';

import UnifiedToggleSystem from '../EncoderAndDecoder/shared/components/UnifiedToggleSystem';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const BooleanAlgebraOverview = () => {
  const [vars, setVars] = useState(['A', 'B']);
  const [expression, setExpression] = useState('A & B');

  const combinations = Math.pow(2, vars.length);
  const tt = useMemo(() => generateTruthTable(vars, expression), [vars, expression]);
  const canonical = useMemo(() => getCanonicalForms(vars, tt.rows), [vars, tt.rows]);

  const addVar = () => {
    if (vars.length < 8) {
      const next = letters[vars.length] || `V${vars.length + 1}`;
      setVars([...vars, next]);
    }
  };

  const removeVar = () => {
    if (vars.length > 1) setVars(vars.slice(0, -1));
  };

  const insertSymbol = (sym) => {
    setExpression(prev => prev + sym);
  };

  return (
    <div className="boolean-algebra-container">
      <div className="app-section">
        <span className="app-section-kicker">Evaluator</span>
        <h2 className="app-section-title">Logic Expression Evaluator</h2>
        
        <div className="app-card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <p className="app-body-text" style={{ marginBottom: '1rem' }}>
            Enter a boolean expression using variables ({vars.join(', ')}) and operators. 
            The truth table and canonical forms will update in real-time.
          </p>

          <div className="symbol-guide">
            <span className="guide-item"><AndIcon size={14} /> <code>&</code> AND</span>
            <span className="guide-item"><OrIcon size={14} /> <code>|</code> OR</span>
            <span className="guide-item"><NotIcon size={14} /> <code>!</code> NOT</span>
            <span className="guide-item"><XorIcon size={14} /> <code>^</code> XOR</span>
          </div>
          
          <Controls 
            vars={vars}
            expression={expression}
            setExpression={setExpression}
            insertSymbol={insertSymbol}
            addVar={addVar}
            removeVar={removeVar}
          />

          <TruthTable tt={tt} />

          <CanonicalForms canonical={canonical} />
        </div>
      </div>

      <InfoCards varsLength={vars.length} combinations={combinations} />

      <div className="app-section" style={{ marginTop: '40px' }}>
        <span className="app-section-kicker">Application</span>
        <h2 className="app-section-title">Encoder-Decoder System</h2>
        <p className="app-body-text" style={{ marginBottom: '1.5rem' }}>
          See Boolean logic in action! This system uses priority logic to encode 4 inputs into binary, 
          and decoding logic to translate binary back into signal lines.
        </p>
        <UnifiedToggleSystem />
      </div>
    </div>
  );
};

export default BooleanAlgebraOverview;
