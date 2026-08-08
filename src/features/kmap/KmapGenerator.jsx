import '../../shared/styles/KMapGenerator.css';
import React, { useState } from 'react';
import { InputControls } from './components/InputControls';
import { KMapDisplay } from './components/KMapDisplay';
import { SimplifiedExpression } from './components/SimplifiedExpression';
import { GroupingGuide } from './components/GroupingGuide';
import { TruthTableDisplay } from './components/TruthTableDisplay';
import { useKMapLogic } from '../../shared/hooks/useKMapLogic';
import Boolforge from '../boolforge/Boolforge';
import RelatedSeoLinks from '../../shared/seo/RelatedSeoLinks';
import { trackToolInteraction } from '../../shared/utils/analytics';
import Navbar from '../../shared/components/Navbar';
import { useTheme } from '../../shared/context/ThemeContext';
import {
    CirclePlus, 
    X, 
    Plug,
} from 'lucide-react';

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

    // "Committed" snapshot — only updates when Generate/Reset is clicked,
    // so the results section doesn't recompute on every keystroke.
    const [committedNumVariables, setCommittedNumVariables] = useState(numVariables);
    const [committedVariables, setCommittedVariables] = useState(variables);
    const [committedInputValue, setCommittedInputValue] = useState('');
    const [committedDontCares, setCommittedDontCares] = useState('');
    const [committedOptimizationType, setCommittedOptimizationType] = useState(optimizationType);

    const {
        grid,
        expression,
        groups,
        getColumnLabels,
        getRowLabels
    } = useKMapLogic(committedNumVariables, committedVariables, committedInputValue, committedDontCares, committedOptimizationType);

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

    const getIntermediateTerms = (expr, type, inputVars) => {
        if (!expr || expr === '1' || expr === '0') return [];
        
        const cleanExpr = expr.includes('=') ? expr.split('=')[1].trim() : expr;
        
        let terms = [];
        if (type === 'SOP') {
            // Split by '+' for SOP
            terms = cleanExpr.split('+').map(t => t.trim()).filter(Boolean);
        } else {
            // Extract groupings for POS
            const matches = cleanExpr.match(/\([^)]+\)/g);
            if (matches) {
                terms = matches.map(m => m.replace(/[()]/g, '').trim());
            }
        }
        terms = terms.filter(term => !inputVars.includes(term));

        return terms;
    };

    const intermediateTerms = getIntermediateTerms(expression, committedOptimizationType, committedVariables);

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
                        setCommittedNumVariables(numVariables);
                        setCommittedVariables(variables);
                        setCommittedInputValue(inputValue);
                        setCommittedDontCares(dontCares);
                        setCommittedOptimizationType(optimizationType);
                        setShowSolution(true);
                        }}
                        onExample={handleExample}
                        onReset={handleReset} 
                    />
                </div>
            </aside>

            {/* RIGHT CANVAS — scrollable results workspace */}
            <div className="kmap-canvas">
                {/* Empty state shown before first generation */}
                <p className="kmap-sidebar-label">Karnaugh Map</p>
                {!showSolution && (
                    <div className="kmap-empty-state">
                        <div className="kmap-empty-icon">
                            <CirclePlus className="h-5 w-5" />
                        </div>
                        <h2 className="kmap-empty-title">Your K-Map will appear here</h2>
                        <p className="kmap-empty-hint">
                        Configure your variables and minterms in the panel on the left,
                        then click <strong>Generate K-Map</strong>.
                        </p>
                    </div>
                )}

                {showSolution && (
                <div className="kmap-results-stack">
                    
                    <SimplifiedExpression
                    expression={expression}
                    />

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
                    
                    <TruthTableDisplay
                    numVariables={numVariables}
                    variables={variables}
                    inputValue={inputValue}
                    dontCares={dontCares}
                    optimizationType={optimizationType}
                    intermediateTerms={intermediateTerms}
                    expression={expression}
                    />

                    {/* Divider */}
                    <div className="kmap-section-divider">
                        <span></span>
                    </div>

                    <button
                        className="kmap-btn kmap-btn-outline kmap-btn-full"
                        onClick={() => setShowGroupingGuide(!showGroupingGuide)}
                        style={{ marginTop: 'var(--spacing-lg)' }}
                    >
                        {showGroupingGuide ? 'Hide' : 'Show'} Grouping Guide
                    </button>

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

                    <button
                        className="kmap-btn kmap-btn-circuit"
                        onClick={() => setShowCircuitModal(true)}
                        title="Open the interactive circuit editor"
                    >
                        <Plug className="h-4 w-4" /> Experiment with Circuit
                    </button>

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
                    <X className="h-4 w-4" />
                </button>
                <Boolforge
                    simplifiedExpression={expression}
                    variables={variables}
                    embedded={true}
                />
                </div>
            </div>
            )}
            <RelatedSeoLinks />
        </main>
        </div>
    );
};

export default KMapGenerator;