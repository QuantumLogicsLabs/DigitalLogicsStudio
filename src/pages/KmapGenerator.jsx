import React, { useState } from 'react';
import { InputControls } from '../components/InputControls';
import { KMapDisplay } from '../components/KMapDisplay';
import { SimplifiedExpression } from '../components/SimplifiedExpression';
import { GroupingGuide } from '../components/GroupingGuide';
import { TruthTableDisplay } from '../components/TruthTableDisplay';
import { useKMapLogic } from '../hooks/useKMapLogic';
import Boolforge from './Boolforge';

const KMapGenerator = () => {
    const [numVariables, setNumVariables] = useState(3);
    const [variables, setVariables] = useState(['A', 'B', 'C']);
    const [minterms, setMinterms] = useState('');
    const [dontCares, setDontCares] = useState('');
    const [optimizationType, setOptimizationType] = useState('SOP');
    const [showSolution, setShowSolution] = useState(false);
    const [showGroupingGuide, setShowGroupingGuide] = useState(false);
    const [showCircuitModal, setShowCircuitModal] = useState(false);

    const {
        grid,
        expression,
        groups,
        getColumnLabels,
        getRowLabels
    } = useKMapLogic(numVariables, variables, minterms, dontCares, optimizationType);

    const handleVariablesChange = (value) => {
        const num = parseInt(value);
        setNumVariables(num);
        const defaultVars = ['A', 'B', 'C', 'D'];
        setVariables(defaultVars.slice(0, num));
        setShowSolution(false);
    };

    const handleExample = () => {
        if (numVariables === 3) {
            setMinterms('0,1,2,5,6,7');
            setDontCares('3,4');
        } else if (numVariables === 4) {
            setMinterms('0,1,2,5,6,7,8,9,10,14');
            setDontCares('3,11,12,13,15');
        } else {
            setMinterms('0,2,3');
            setDontCares('1');
        }
        setShowSolution(false);
    };

    const handleReset = () => {
        setMinterms('');
        setDontCares('');
        setShowSolution(false);
        setShowGroupingGuide(false);
    };

    return (
        <div className="kmap-page-content">
            <div className="app-section">
                <span className="app-section-kicker">Configuration</span>
                <h2 className="app-section-title">Input Parameters</h2>
                <InputControls
                    numVariables={numVariables}
                    variables={variables}
                    minterms={minterms}
                    dontCares={dontCares}
                    optimizationType={optimizationType}
                    onVariablesChange={handleVariablesChange}
                    onVariablesUpdate={setVariables}
                    onMintermsChange={setMinterms}
                    onDontCaresChange={setDontCares}
                    onOptimizationTypeChange={setOptimizationType}
                    onGenerate={() => setShowSolution(true)}
                    onExample={handleExample}
                    onReset={handleReset}
                />
            </div>

            {showSolution && (
                <div className="app-content-wrap">
                    <div className="app-section">
                        <span className="app-section-kicker">Visualization</span>
                        <h2 className="app-section-title">Interactive K-Map Grid</h2>
                        <KMapDisplay
                            grid={grid}
                            groups={groups}
                            numVariables={numVariables}
                            variables={variables}
                            getColumnLabels={getColumnLabels}
                            getRowLabels={getRowLabels}
                            showGroupingGuide={showGroupingGuide}
                            optimizationType={optimizationType}
                        />
                    </div>

                    <div className="app-card">
                        <SimplifiedExpression
                            expression={expression}
                            showGroupingGuide={showGroupingGuide}
                            onToggleGuide={() => setShowGroupingGuide(!showGroupingGuide)}
                        />
                        
                        <button
                            className="app-btn app-btn-primary"
                            onClick={() => setShowCircuitModal(true)}
                            style={{ width: '100%', marginTop: '1.5rem' }}
                        >
                            🔌 Experiment with Circuit Forge
                        </button>
                    </div>

                    {showGroupingGuide && (
                        <div className="app-section">
                            <span className="app-section-kicker">Step-by-Step</span>
                            <h2 className="app-section-title">Grouping Logic</h2>
                            <GroupingGuide
                                groups={groups}
                                variables={variables}
                                numVariables={numVariables}
                                grid={grid}
                                getColumnLabels={getColumnLabels}
                                getRowLabels={getRowLabels}
                                optimizationType={optimizationType}
                            />
                        </div>
                    )}

                    <div className="app-section">
                        <span className="app-section-kicker">Reference</span>
                        <h2 className="app-section-title">Truth Table Matrix</h2>
                        <TruthTableDisplay
                            numVariables={numVariables}
                            variables={variables}
                            minterms={minterms}
                            dontCares={dontCares}
                            optimizationType={optimizationType}
                        />
                    </div>
                </div>
            )}

            {/* Circuit Modal */}
            {showCircuitModal && (
                <div
                    className="app-modal-overlay"
                    onClick={(e) => {
                        if (e.target.className === 'app-modal-overlay') {
                            setShowCircuitModal(false);
                        }
                    }}
                >
                    <div className="app-modal-content">
                        <button
                            className="app-modal-close"
                            onClick={() => setShowCircuitModal(false)}
                        >
                            ✕
                        </button>
                        <Boolforge
                            simplifiedExpression={expression}
                            variables={variables}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default KMapGenerator;
