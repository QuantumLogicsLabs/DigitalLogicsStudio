import React, { useState } from 'react';
import { InputControls } from '../components/InputControls';
import { KMapDisplay } from '../components/KMapDisplay';
import { SimplifiedExpression } from '../components/SimplifiedExpression';
import { GroupingGuide } from '../components/GroupingGuide';
import { TruthTableDisplay } from '../components/TruthTableDisplay';
import { useKMapLogic } from '../hooks/useKMapLogic';
import Boolforge from './Boolforge';
import RelatedSeoLinks from '../components/seo/RelatedSeoLinks';
import { trackToolInteraction } from '../utils/analytics';
import { Navbar } from './Home/Navbar';
import { useTheme } from '../context/ThemeContext';

const KMapGenerator = () => {
    const { theme, toggle: toggleTheme } = useTheme();
    const [numVariables, setNumVariables] = useState(3);
    const [variables, setVariables] = useState(['A', 'B', 'C']);
    const [inputValue, setInputValue] = useState('');
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
    } = useKMapLogic(numVariables, variables, inputValue, dontCares, optimizationType);

    const handleVariablesChange = (value) => {
        const num = parseInt(value);
        setNumVariables(num);
        const defaultVars = ['A', 'B', 'C', 'D'];
        setVariables(defaultVars.slice(0, num));
        setShowSolution(false);
    };

    const handleExample = () => {
        trackToolInteraction('kmap_generator', 'load_example', {
            variable_count: numVariables,
        });
        if (numVariables === 3) {
            setInputValue('0,1,2,5,6,7');
            setDontCares('3,4');
        } else if (numVariables === 4) {
            setInputValue('0,1,2,5,6,7,8,9,10,14');
            setDontCares('3,11,12,13,15');
        } else {
            setInputValue('0,2,3');
            setDontCares('1');
        }
        setShowSolution(false);
    };

    const handleReset = () => {
        trackToolInteraction('kmap_generator', 'reset', {
            variable_count: numVariables,
        });
        setInputValue('');
        setDontCares('');
        setShowSolution(false);
        setShowGroupingGuide(false);
    };

    return (
        <div className={`kmap-page theme-${theme}`}>
        <div className="grid-background" />
        <Navbar toggleTheme={toggleTheme} theme={theme} />

        <main className="kmap-page-main">

            <div className="kmap-workspace">
            {/* LEFT SIDEBAR — sticky control panel */}
            <aside className="kmap-sidebar">
                <div className="kmap-sidebar-inner">
                {/* Sidebar label — workspace ergonomics */}
                    <p className="kmap-sidebar-label">⚙ Configuration</p>
                    <InputControls
                        numVariables={numVariables}
                        variables={variables}
                        inputValue={inputValue}
                        dontCares={dontCares}
                        optimizationType={optimizationType}
                        onVariablesChange={handleVariablesChange}
                        onVariablesUpdate={setVariables}
                        onInputValueChange={setInputValue}
                        onDontCaresChange={setDontCares}
                        onOptimizationTypeChange={setOptimizationType}
                        onGenerate={() => {
                        trackToolInteraction('kmap_generator', 'generate_solution', {
                            variable_count: numVariables,
                            optimization_type: optimizationType,
                        });
                        setShowSolution(true);
                        }}
                        onExample={handleExample}
                        onReset={handleReset}
                        showGroupingGuide={showGroupingGuide}
                        onToggleGroupingGuide={() => setShowGroupingGuide(!showGroupingGuide)}
                        expression={expression}
                        onExperiment={() => setShowCircuitModal(true)}  
                    />
                </div>
            </aside>

            {/* RIGHT CANVAS — scrollable results workspace */}
            <div className="kmap-canvas">
                {/* Empty state shown before first generation */}
                <p className="kmap-sidebar-label">Karnaugh Map</p>
                {!showSolution && (
                    <div className="kmap-empty-state">
                        <div className="kmap-empty-icon">⊕</div>
                        <h2 className="kmap-empty-title">Your K-Map will appear here</h2>
                        <p className="kmap-empty-hint">
                        Configure your variables and minterms in the panel on the left,
                        then click <strong>Generate K-Map</strong>.
                        </p>
                    </div>
                )}

                {/* Results stack — unchanged components, new container */}
                {showSolution && (
                <div className="kmap-results-stack">
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

                    <SimplifiedExpression
                    expression={expression}
                    showGroupingGuide={showGroupingGuide}
                    onToggleGuide={() => setShowGroupingGuide(!showGroupingGuide)}
                    />

                    {showGroupingGuide && (
                    <GroupingGuide
                        groups={groups}
                        variables={variables}
                        numVariables={numVariables}
                        grid={grid}
                        getColumnLabels={getColumnLabels}
                        getRowLabels={getRowLabels}
                        optimizationType={optimizationType}
                    />
                    )}

                    <TruthTableDisplay
                    numVariables={numVariables}
                    variables={variables}
                    inputValue={inputValue}
                    dontCares={dontCares}
                    optimizationType={optimizationType}
                    />

                    <RelatedSeoLinks />
                </div>
                )}
            </div>
            </div>

            {/* Circuit Modal */}
            {showCircuitModal && (
            <div
                className="circuit-modal-overlay"
                onClick={(e) => {
                if (e.target.className === 'circuit-modal-overlay') {
                    setShowCircuitModal(false);
                }
                }}
            >
                <div className="circuit-modal-container">
                <button
                    className="circuit-modal-close"
                    onClick={() => setShowCircuitModal(false)}
                    title="Close Circuit Editor"
                >
                    ✕
                </button>
                <Boolforge
                    simplifiedExpression={expression}
                    variables={variables}
                    embedded={true}
                />
                </div>
            </div>
            )}

            <style jsx>{`
            .circuit-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
                backdrop-filter: blur(4px);
            }

            .circuit-modal-container {
                position: relative;
                width: 95vw;
                height: 90vh;
                background: var(--bg-primary, #0f172a);
                border-radius: 16px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                overflow: hidden;
                border: 2px solid rgba(99, 102, 241, 0.3);
            }

            .circuit-modal-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(239, 68, 68, 0.9);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.2);
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: all 0.2s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .circuit-modal-close:hover {
                background: rgba(220, 38, 38, 1);
                transform: rotate(90deg) scale(1.1);
                box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
            }

            .circuit-modal-close:active {
                transform: rotate(90deg) scale(0.95);
            }

            @media (max-width: 768px) {
                .circuit-modal-container {
                width: 100vw;
                height: 100vh;
                border-radius: 0;
                }

                .circuit-modal-overlay {
                padding: 0;
                }
            }
            `}</style>
            <RelatedSeoLinks />
        </main>
        </div>
    );
};

export default KMapGenerator;