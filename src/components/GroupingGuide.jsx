import { useState, useEffect, useRef } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { WhiteboardAnimation } from './WhiteboardAnimation';

export const GroupingGuide = ({ groups, variables, numVariables, grid, getColumnLabels, getRowLabels, optimizationType = 'SOP' }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false); 
    const [showWhiteboard, setShowWhiteboard] = useState(true);
    const { speak, cancel, pause, resume } = useSpeechSynthesis();
    const isPlayingRef = useRef(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            cancel();
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [cancel]);

    const explanations = generateExplanations(groups, variables, numVariables, grid, optimizationType);

    const handlePlayExplanation = (index) => {
        cancel();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setCurrentStep(index);
        setIsPlaying(true);
        setIsPaused(false);
        isPlayingRef.current = true;

        speak(explanations[index].text, () => {
            if (!isPlayingRef.current) return;

            if (index < explanations.length - 1) {
                timeoutRef.current = setTimeout(() => {
                    if (isPlayingRef.current) {
                        handlePlayExplanation(index + 1);
                    }
                }, 1500);
            } else {
                setIsPlaying(false);
                isPlayingRef.current = false;
                setIsPaused(false);
            }
        });
    };

    // Toggle Play / Pause / Resume
    const handlePlayPauseToggle = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setIsPaused(true);
            isPlayingRef.current = false; 
            pause(); 
            
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        } else {
            setIsPlaying(true);
            setIsPaused(false);
            isPlayingRef.current = true;

            if (window.speechSynthesis && window.speechSynthesis.paused) {
                resume();
            } else {
                handlePlayExplanation(currentStep);
            }
        }
    };

    const handleRestart = () => {
        handlePlayExplanation(0);
    };

    const handleStepChange = (newIndex) => {
        if (newIndex >= 0 && newIndex < explanations.length) {
            setCurrentStep(newIndex);
            if (isPlaying) {
                handlePlayExplanation(newIndex);
            } else {
                cancel();
                setIsPaused(true);
            }
        }
    };

    const isRestartActive = isPlaying || isPaused || currentStep > 0;
    const isBackActive = currentStep > 0;
    const isForwardActive = currentStep < explanations.length - 1;

    return (
        <div className="kmap-card kmap-grouping-guide">
            <h2 className="kmap-section-title">
                <span className="kmap-voice-icon">🔊</span>
                Interactive Grouping Explanation
            </h2>

            {/* Media Controls Layout */}
            <div className="kmap-guide-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                
                {/* 1. Restart */}
                <button
                    className="kmap-btn kmap-btn-outline"
                    onClick={handleRestart}
                    disabled={!isRestartActive}
                    title="Restart from beginning"
                >
                    ⏪ 
                </button>

                {/* 2. Step Backward */}
                <button
                    className="kmap-btn kmap-btn-outline"
                    onClick={() => handleStepChange(currentStep - 1)}
                    disabled={!isBackActive}
                    title="Previous Step"
                >
                    ⏮️ 
                </button>

                {/* 3. Play / Pause / Resume */}
                <button
                    className={`kmap-btn ${isPlaying ? 'kmap-btn-outline' : 'kmap-btn-primary'}`}
                    onClick={handlePlayPauseToggle}
                    style={{ minWidth: '120px' }}
                >
                    {isPlaying ? '⏸️ Pause' : (isPaused ? '▶️ Resume' : '▶️ Play')}
                </button>

                {/* 4. Step Forward  */}
                <button
                    className="kmap-btn kmap-btn-outline"
                    onClick={() => handleStepChange(currentStep + 1)}
                    disabled={!isForwardActive}
                    title="Next Step"
                >
                    ⏭️ 
                </button>

                {/* 5. Whiteboard Toggle */}
                <button
                    className="kmap-btn kmap-btn-secondary"
                    onClick={() => setShowWhiteboard(!showWhiteboard)}
                    style={{ marginLeft: 'auto' }} 
                >
                    📋 Whiteboard
                </button>
            </div>

            {/* Whiteboard Teaching Animation */}
            {showWhiteboard && (
                <WhiteboardAnimation
                    step={explanations[currentStep]}
                    stepIndex={currentStep}
                    isActive={isPlaying}
                    grid={grid}
                    groups={groups}
                    variables={variables}
                    numVariables={numVariables}
                    getColumnLabels={getColumnLabels}
                    getRowLabels={getRowLabels}
                />
            )}

            <div className="kmap-explanation-steps">
                {explanations.map((explanation, index) => (
                    <div
                        key={index}
                        className={`kmap-explanation-step ${currentStep === index && (isPlaying || isPaused) ? 'active' : ''}`}
                    >
                        <div className="kmap-step-header">
                            <div className="kmap-step-number">Step {index + 1}</div>
                            <button
                                className="kmap-btn-icon"
                                onClick={() => handlePlayExplanation(index)}
                                title="Play this step"
                            >
                                {currentStep === index && isPlaying ? '⏸️' : '🔊'}
                            </button>
                        </div>
                        <div className="kmap-step-content">
                            <h4 className="kmap-step-title">{explanation.title}</h4>
                            <p className="kmap-step-text">{explanation.text}</p>
                            {explanation.visualization && (
                                <div className="kmap-step-visualization">
                                    {explanation.visualization}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="kmap-info-box" style={{ marginTop: 'var(--spacing-lg)' }}>
                {/* ... Rules list remains unchanged ... */}
            </div>
        </div>
    );
};

const generateExplanations = (groups, variables, numVariables, grid, optimizationType = 'SOP') => {
    const explanations = [];
    const isPOS = optimizationType === 'POS';
    const targetValue = isPOS ? 0 : 1;
    const targetType = isPOS ? 'maxterms' : 'minterms';
    const targetOperation = isPOS ? 'Product of Sums' : 'Sum of Products';

    // Introduction
    explanations.push({
        title: `Introduction to ${targetOperation} Grouping`,
        text: `Welcome to Karnaugh Map grouping explanation for ${targetOperation.toLowerCase()}. We have identified ${groups.length} group${groups.length !== 1 ? 's' : ''} in this K-map. The goal is to simplify the Boolean expression by grouping adjacent ${targetValue}s in powers of 2. For ${targetOperation.toLowerCase()}, we group ${targetValue}s to create sum terms that will be multiplied together. Let's examine each group and understand how it contributes to the final simplified expression.`,
        type: 'intro',
        groupData: null
    });

    // Explain each group
    groups.forEach((group, index) => {
        const groupNumber = index + 1;
        const cellsText = group.size === 1 ? '1 cell' : `${group.size} cells`;
        const termsText = group.minterms.join(', ');

        let explanation = `Group ${groupNumber} contains ${cellsText}, covering ${targetType} ${termsText}. `;

        // Analyze which variables are eliminated
        const eliminatedVars = analyzeGroupVariables(group, variables, numVariables, optimizationType);

        if (eliminatedVars.eliminated.length > 0) {
            explanation += `In this group, the variable${eliminatedVars.eliminated.length > 1 ? 's' : ''} ${eliminatedVars.eliminated.join(' and ')} ${eliminatedVars.eliminated.length > 1 ? 'change' : 'changes'} within the group, so ${eliminatedVars.eliminated.length > 1 ? 'they are' : 'it is'} eliminated. `;
        }

        if (eliminatedVars.kept.length > 0) {
            explanation += `The variable${eliminatedVars.kept.length > 1 ? 's' : ''} ${eliminatedVars.kept.join(' and ')} ${eliminatedVars.kept.length > 1 ? 'remain' : 'remains'} constant in this group, contributing to the ${isPOS ? 'sum term' : 'product term'} ${eliminatedVars.term}. `;
        } else {
            explanation += `All variables are eliminated, giving us a constant term of ${isPOS ? '0' : '1'}. `;
        }

        explanation += `This is why this group represents the ${isPOS ? 'sum term' : 'product term'} ${eliminatedVars.term} in our simplified ${targetOperation.toLowerCase()} expression.`;

        explanations.push({
            title: `Group ${groupNumber}: ${cellsText}`,
            text: explanation,
            visualization: `${isPOS ? 'Sum' : 'Product'} Term: ${eliminatedVars.term}`,
            type: 'group',
            groupData: {
                ...group,
                eliminatedVars
            }
        });
    });

    // Final expression
    const finalTerms = groups.map((group) => {
        const eliminatedVars = analyzeGroupVariables(group, variables, numVariables, optimizationType);
        return eliminatedVars.term;
    });

    explanations.push({
        title: 'Final Simplified Expression',
        text: `Combining all the ${isPOS ? 'sum' : 'product'} terms from our groups, we get the final simplified Boolean expression. Each group we identified contributes one term. The terms are: ${finalTerms.join(', ')}. When we combine these with ${isPOS ? 'AND' : 'OR'} operations, we get our complete simplified ${targetOperation.toLowerCase()} expression. This is the most optimized form of the Boolean function based on Karnaugh Map grouping method.`,
        type: 'conclusion',
        groupData: { finalTerms }
    });

    return explanations;
};

const analyzeGroupVariables = (group, variables, numVariables, optimizationType = 'SOP') => {
    const isPOS = optimizationType === 'POS';
    // Convert minterms to binary and analyze
    const binaryMinterms = group.minterms.map(m =>
        m.toString(2).padStart(numVariables, '0')
    );

    const eliminated = [];
    const kept = [];
    let term = '';

    for (let i = 0; i < numVariables; i++) {
        const values = new Set(binaryMinterms.map(b => b[i]));

        if (values.size === 1) {
            // Variable is constant
            const value = Array.from(values)[0];
            kept.push(variables[i]);
            if (isPOS) {
                // For POS: 0 becomes variable, 1 becomes complemented
                term += value === '0' ? variables[i] : `${variables[i]}'`;
            } else {
                // For SOP: 1 becomes variable, 0 becomes complemented
                term += value === '1' ? variables[i] : `${variables[i]}'`;
            }
        } else {
            // Variable changes, so it's eliminated
            eliminated.push(variables[i]);
        }
    }

    if (term === '') {
        term = isPOS ? '0' : '1';
    }

    return { eliminated, kept, term };
};