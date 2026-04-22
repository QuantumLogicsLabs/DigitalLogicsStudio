import React, { useState } from 'react';

const InteractiveDemo = ({ 
  title, 
  description, 
  inputs, 
  outputs, 
  onInputChange,
  showTruthTable = false,
  truthTableData = null
}) => {
  const [inputValues, setInputValues] = useState(
    inputs.reduce((acc, input) => ({ ...acc, [input.name]: false }), {})
  );

  const handleInputChange = (inputName, value) => {
    const newValues = { ...inputValues, [inputName]: value };
    setInputValues(newValues);
    if (onInputChange) {
      onInputChange(newValues);
    }
  };

  return (
    <div className="interactive-demo">
      <h3 className="demo-title">{title}</h3>
      {description && <p className="demo-description">{description}</p>}
      
      <div className="demo-content">
        <div className="input-section">
          <h4>Inputs</h4>
          <div className="input-grid">
            {inputs.map((input) => (
              <div key={input.name} className="input-control">
                <label className="input-label">{input.label || input.name}</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={inputValues[input.name]}
                    onChange={(e) => handleInputChange(input.name, e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-value">
                    {inputValues[input.name] ? '1' : '0'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {outputs && outputs.length > 0 && (
          <div className="output-section">
            <h4>Outputs</h4>
            <div className="output-grid">
              {outputs.map((output) => (
                <div key={output.name} className="output-display">
                  <span className="output-label">{output.label || output.name}</span>
                  <span className="output-value">
                    {output.value !== undefined ? (output.value ? '1' : '0') : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTruthTable && truthTableData && (
          <div className="truth-table-section">
            <h4>Truth Table</h4>
            <div className="truth-table">
              <table>
                <thead>
                  <tr>
                    {inputs.map(input => (
                      <th key={input.name}>{input.label || input.name}</th>
                    ))}
                    {outputs.map(output => (
                      <th key={output.name}>{output.label || output.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {truthTableData.map((row, index) => (
                    <tr key={index}>
                      {inputs.map(input => (
                        <td key={input.name}>{row.inputs[input.name] ? '1' : '0'}</td>
                      ))}
                      {outputs.map(output => (
                        <td key={output.name}>{row.outputs[output.name] ? '1' : '0'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .interactive-demo {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .demo-title {
          color: #e2e8f0;
          margin-bottom: 12px;
        }
        
        .demo-description {
          color: #9ca3af;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }
        
        .demo-content {
          display: grid;
          gap: 20px;
        }
        
        .input-section h4,
        .output-section h4,
        .truth-table-section h4 {
          color: #93c5fd;
          margin-bottom: 12px;
        }
        
        .input-grid,
        .output-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
        }
        
        .input-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .input-label {
          color: #cbd5e1;
          font-weight: 500;
        }
        
        .toggle-switch {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .toggle-switch input[type="checkbox"] {
          width: 50px;
          height: 24px;
          appearance: none;
          background: #475569;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .toggle-switch input[type="checkbox"]:checked {
          background: #6366f1;
        }
        
        .toggle-switch input[type="checkbox"]::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.3s ease;
        }
        
        .toggle-switch input[type="checkbox"]:checked::before {
          transform: translateX(26px);
        }
        
        .toggle-value {
          color: #e2e8f0;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
        }
        
        .output-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
        }
        
        .output-label {
          color: #cbd5e1;
          font-weight: 500;
        }
        
        .output-value {
          color: #e2e8f0;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          font-size: 1.2rem;
        }
        
        .truth-table {
          overflow-x: auto;
        }
        
        .truth-table table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .truth-table th,
        .truth-table td {
          padding: 12px;
          text-align: center;
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
        }
        
        .truth-table th {
          background: rgba(99, 102, 241, 0.2);
          color: #93c5fd;
          font-weight: 600;
        }
        
        .truth-table tr:hover {
          background: rgba(99, 102, 241, 0.05);
        }
      `}</style>
    </div>
  );
};

export default InteractiveDemo;
