import React, { useState } from 'react';

const InteractiveCalculator = ({ 
  title, 
  description, 
  inputLabel, 
  inputPlaceholder, 
  onCalculate, 
  result, 
  example,
  onExample
}) => {
  const [input, setInput] = useState('');

  const handleCalculate = () => {
    if (input.trim()) {
      onCalculate(input);
    }
  };

  const handleExample = () => {
    if (example) {
      setInput(example);
      onCalculate(example);
    }
  };

  const handleReset = () => {
    setInput('');
    onCalculate('');
  };

  return (
    <div className="kmap-card">
      <h3 className="calculator-title">{title}</h3>
      {description && <p className="calculator-description">{description}</p>}
      
      <div className="calculator-input-group">
        <label className="calculator-label">{inputLabel}</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          className="calculator-input"
        />
      </div>

      <div className="calculator-buttons">
        <button 
          className="kmap-btn kmap-btn-primary"
          onClick={handleCalculate}
          disabled={!input.trim()}
        >
          Calculate
        </button>
        
        {example && (
          <button 
            className="kmap-btn kmap-btn-secondary"
            onClick={handleExample}
          >
            Example
          </button>
        )}
        
        <button 
          className="kmap-btn kmap-btn-outline"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {result && (
        <div className="calculator-result">
          <h4>Result:</h4>
          <div className="result-content">
            {result}
          </div>
        </div>
      )}

      <style jsx>{`
        .calculator-title {
          color: #e2e8f0;
          margin-bottom: 12px;
        }
        
        .calculator-description {
          color: #9ca3af;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }
        
        .calculator-input-group {
          margin-bottom: 20px;
        }
        
        .calculator-label {
          display: block;
          color: #cbd5e1;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .calculator-input {
          width: 100%;
          padding: 12px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        
        .calculator-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .calculator-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .calculator-result {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          padding: 16px;
        }
        
        .calculator-result h4 {
          color: #93c5fd;
          margin-bottom: 12px;
        }
        
        .result-content {
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          font-size: 0.95rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default InteractiveCalculator;
