import React from 'react';

export const InputControls = ({
    numVariables,
    variables,
    inputValue,
    dontCares,
    optimizationType,
    onVariablesChange,
    onVariablesUpdate,
    onInputValueChange,
    onDontCaresChange,
    onOptimizationTypeChange,
    onGenerate,
    onExample,
    onReset,
    expression,
    onExperiment,
    showGroupingGuide,  
    onToggleGroupingGuide
}) => {
    const handleVariableNameChange = (index, value) => {
        const newVars = [...variables];
        newVars[index] = value.toUpperCase().charAt(0) || variables[index];
        onVariablesUpdate(newVars);
    };

    const isSOP = optimizationType === "SOP";
    const termLabel = isSOP ? "Minterms" : "Maxterms";
    const examplePlaceholder = isSOP ? "e.g., 0,1,2,5,6,7" : "e.g., 3,4,8,11";

    return (
        <div className="kmap-card">
            <h2 className="kmap-section-title">Configuration</h2>

            <div className="kmap-controls-grid">
                <div className="kmap-control-group">
                    <label className="kmap-label">Number of Variables</label>
                    <select
                        className="kmap-input"
                        value={numVariables}
                        onChange={(e) => onVariablesChange(e.target.value)}
                    >
                        <option value="2">2 Variables</option>
                        <option value="3">3 Variables</option>
                        <option value="4">4 Variables</option>
                    </select>
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label">Variable Names</label>
                    <div className="kmap-var-inputs">
                        {variables.map((variable, index) => (
                            <input
                                key={index}
                                type="text"
                                className="kmap-input kmap-var-input"
                                value={variable}
                                onChange={(e) => handleVariableNameChange(index, e.target.value)}
                                maxLength="1"
                            />
                        ))}
                    </div>
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label" title={`Enter ${termLabel.toLowerCase()} (comma separated)`}>
                        {termLabel}
                    </label>
                    <input
                        type="text"
                        className="kmap-input"
                        value={inputValue}
                        onChange={(e) => onInputValueChange(e.target.value)}
                        placeholder={examplePlaceholder}
                    />
                    <p className="kmap-helper-text">
                        Decimal numbers 0–{Math.pow(2, numVariables) - 1}
                    </p>
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label" title="Optional: terms that can be 0 or 1">
                        Don't Cares
                    </label>
                    <input
                        type="text"
                        className="kmap-input"
                        value={dontCares}
                        onChange={(e) => onDontCaresChange(e.target.value)}
                        placeholder="e.g., 3,4,12"
                    />
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label" title="Select SOP (Sum of Products) or POS (Product of Sums)">
                        Optimization
                    </label>
                    <select
                        className="kmap-input"
                        value={optimizationType}
                        onChange={(e) => onOptimizationTypeChange(e.target.value)}
                    >
                        <option value="SOP">Sum of Products (SOP)</option>
                        <option value="POS">Product of Sums (POS)</option>
                    </select>
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label">Grouping Guide</label>
                    <label className="kmap-toggle">
                        <input
                            type="checkbox"
                            checked={showGroupingGuide}
                            onChange={onToggleGroupingGuide}
                        />
                        <span className="kmap-toggle-slider"></span>
                    </label>
                </div>

                <div className="kmap-btn-row">
                    <button
                        className="kmap-btn kmap-btn-primary"
                        onClick={onGenerate}
                        title="Solve the K‑Map"
                    >
                        🔍 
                    </button>
                    <button
                        className="kmap-btn kmap-btn-secondary"
                        onClick={onExample}
                        title="Load a pre‑filled example"
                    >
                        📋 
                    </button>
                    <button
                        className="kmap-btn kmap-btn-outline"
                        onClick={onReset}
                        title="Clear all inputs"
                    >
                        🔄 
                    </button>
                </div>

                {/* Divider */}
                <div className="kmap-section-divider">
                    <span>Experiment</span>
                </div>

                {/* Circuit experiment button – visible only when a solution exists */}
                {expression && (
                    <button
                        className="kmap-btn kmap-btn-circuit"
                        onClick={onExperiment}
                        title="Open the interactive circuit editor"
                    >
                        🔌 Experiment with Circuit
                    </button>
                )}
            </div>
        </div>
    );
};