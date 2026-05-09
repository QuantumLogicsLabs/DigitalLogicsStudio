import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../components/ToolLayout';
import ControlPanel from '../components/ControlPanel';
import ControlGroup from '../components/ControlGroup';
import ExplanationBlock from '../components/ExplanationBlock';

const NumberSystemCalculator = () => {
    const [numberSystem, setNumberSystem] = useState('');
    const [binaryRepresentation, setBinaryRepresentation] = useState('twos-complement');
    const [operation, setOperation] = useState('');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [result, setResult] = useState(null);
    const [steps, setSteps] = useState([]);

    const numberSystems = [
        { value: 'decimal', label: 'Decimal (Base 10)' },
        { value: 'binary', label: 'Binary (Base 2)' },
        { value: 'octal', label: 'Octal (Base 8)' },
        { value: 'hexadecimal', label: 'Hexadecimal (Base 16)' }
    ];

    const binaryRepresentations = [
        { value: 'twos-complement', label: "2's Complement" },
        { value: 'signed-magnitude', label: 'Signed Magnitude' }
    ];

    const operations = [
        { value: 'addition', label: 'Addition (+)' },
        { value: 'subtraction', label: 'Subtraction (−)' },
        { value: 'multiplication', label: 'Multiplication (×)' },
        { value: 'division', label: 'Division (÷)' }
    ];

    const getBase = (system) => ({ decimal: 10, binary: 2, octal: 8, hexadecimal: 16 }[system]);

    const isValidInput = (value, system) => {
        if (!value) return true;
        const patterns = {
            decimal: /^[0-9]+$/,
            binary: /^[01]+$/,
            octal: /^[0-7]+$/,
            hexadecimal: /^[0-9A-Fa-f]+$/
        };
        return patterns[system].test(value);
    };

    const toDecimal = (value, base) => parseInt(value.toUpperCase(), base);
    const fromDecimal = (value, base) => value.toString(base).toUpperCase();

    // Binary-specific conversions (fixed 8-bit with proper extension/truncation)
    const decimalToBinaryOutput = useCallback((num, bits = 8) => {
        if (binaryRepresentation === 'twos-complement') {
            if (num >= 0) {
                return num.toString(2).padStart(bits, '0');
            }
            const positive = -num;
            let bin = positive.toString(2).padStart(bits, '0');
            bin = bin.split('').map(b => b === '0' ? '1' : '0').join('');
            return (parseInt(bin, 2) + 1).toString(2).padStart(bits, '0');
        }
        const sign = num < 0 ? '1' : '0';
        const magnitude = Math.abs(num).toString(2).padStart(bits - 1, '0');
        return sign + magnitude;
    }, [binaryRepresentation]);

    // Pure operations (memoized, no dependencies)
    const performAddition = useCallback((num1Str, num2Str, base) => {
        const digits1 = num1Str.split('').reverse();
        const digits2 = num2Str.split('').reverse();
        const maxLen = Math.max(digits1.length, digits2.length);

        let carry = 0;
        const resultDigits = [];
        const stepData = [];

        for (let i = 0; i < maxLen || carry > 0; i++) {
            const d1 = i < digits1.length ? toDecimal(digits1[i], base) : 0;
            const d2 = i < digits2.length ? toDecimal(digits2[i], base) : 0;
            const sum = d1 + d2 + carry;
            const digit = sum % base;
            const newCarry = Math.floor(sum / base);

            stepData.push({ position: i, digit1: digits1[i] || '0', digit2: digits2[i] || '0', carry, sum, resultDigit: fromDecimal(digit, base), newCarry });
            resultDigits.push(fromDecimal(digit, base));
            carry = newCarry;
        }

        const resultStr = resultDigits.reverse().join('').replace(/^0+/, '') || '0';
        const decimalValue = toDecimal(num1Str, base) + toDecimal(num2Str, base);

        return { result: resultStr, steps: stepData, decimal: decimalValue };
    }, []);

    const performSubtraction = useCallback((num1Str, num2Str, base) => {
        const dec1 = toDecimal(num1Str, base);
        const dec2 = toDecimal(num2Str, base);
        const resultDecimal = dec1 - dec2;
        const isNegative = resultDecimal < 0;

        let larger = isNegative ? num2Str : num1Str;
        let smaller = isNegative ? num1Str : num2Str;

        const digits1 = larger.split('').reverse();
        const digits2 = smaller.split('').reverse();

        let borrow = 0;
        const resultDigits = [];
        const stepData = [];

        for (let i = 0; i < digits1.length || borrow > 0; i++) {
            let d1 = i < digits1.length ? toDecimal(digits1[i], base) : 0;
            const d2 = i < digits2.length ? toDecimal(digits2[i], base) : 0;
            d1 -= borrow;

            let diff, newBorrow = 0;
            if (d1 < d2) {
                diff = d1 + base - d2;
                newBorrow = 1;
            } else {
                diff = d1 - d2;
            }

            stepData.push({ position: i, digit1: digits1[i] || '0', digit2: digits2[i] || '0', borrow, diff, resultDigit: fromDecimal(diff, base), newBorrow });
            resultDigits.push(fromDecimal(diff, base));
            borrow = newBorrow;
        }

        const resultStr = resultDigits.reverse().join('').replace(/^0+/, '') || '0';

        return { result: resultStr, steps: stepData, isNegative, decimal: resultDecimal };
    }, []);

    const performMultiplication = useCallback((num1Str, num2Str, base) => {
        const digits1 = num1Str.split('').reverse();
        const digits2 = num2Str.split('').reverse();
        const partialProducts = [];
        const stepData = [];

        for (let i = 0; i < digits2.length; i++) {
            const d2 = toDecimal(digits2[i], base);
            let carry = 0;
            let product = Array(i).fill('0');

            for (let j = 0; j < digits1.length || carry > 0; j++) {
                const d1 = j < digits1.length ? toDecimal(digits1[j], base) : 0;
                const mult = d1 * d2 + carry;
                const digit = mult % base;
                carry = Math.floor(mult / base);
                product.push(fromDecimal(digit, base));
            }
            partialProducts.push(product.reverse().join(''));
        }

        let finalResult = '0';
        for (const partial of partialProducts) {
            finalResult = performAddition(finalResult, partial, base).result;
        }

        const decimalValue = toDecimal(num1Str, base) * toDecimal(num2Str, base);

        return { result: finalResult.replace(/^0+/, '') || '0', partialProducts, steps: stepData, decimal: decimalValue };
    }, [performAddition]);

    const performDivision = useCallback((num1Str, num2Str, base) => {
        const dec1 = toDecimal(num1Str, base);
        const dec2 = toDecimal(num2Str, base);

        if (dec2 === 0) {
            return { error: 'Division by zero is undefined.' };
        }

        const quotientDec = Math.trunc(dec1 / dec2);
        const remainderDec = dec1 % dec2;

        const quotientStr = fromDecimal(Math.abs(quotientDec), base);
        const signedQuotientStr = quotientDec < 0 ? '-' + quotientStr : quotientStr;

        const remainderStr = fromDecimal(Math.abs(remainderDec), base);

        return {
            result: signedQuotientStr,
            decimal: quotientDec,
            remainder: remainderDec,
            remainderStr,
            steps: []
        };
    }, []);

    const performBinaryOperation = useCallback((in1, in2, op) => {
        const bits = 8;

        // Sign-extend or pad for both representations
        let padded1, padded2;
        if (binaryRepresentation === 'twos-complement') {
            const sign1 = in1[0] === '1' ? '1' : '0';
            padded1 = in1.padStart(bits, sign1);
            const sign2 = in2[0] === '1' ? '1' : '0';
            padded2 = in2.padStart(bits, sign2);
        } else {
            const sign1 = in1.length > 0 ? in1[0] : '0';
            padded1 = sign1 + (in1.substring(1) || '').padStart(bits - 1, '0');
            const sign2 = in2.length > 0 ? in2[0] : '0';
            padded2 = sign2 + (in2.substring(1) || '').padStart(bits - 1, '0');
        }

        let num1 = parseInt(padded1, 2);
        let num2 = parseInt(padded2, 2);

        if (binaryRepresentation === 'twos-complement') {
            if (padded1[0] === '1') num1 -= (1 << bits);
            if (padded2[0] === '1') num2 -= (1 << bits);
        } else {
            if (padded1[0] === '1') num1 = -num1;
            if (padded2[0] === '1') num2 = -num2;
        }

        let resultDecimal;
        let operationName;
        switch (op) {
            case 'addition': resultDecimal = num1 + num2; operationName = 'Addition'; break;
            case 'subtraction': resultDecimal = num1 - num2; operationName = 'Subtraction'; break;
            case 'multiplication': resultDecimal = num1 * num2; operationName = 'Multiplication'; break;
            case 'division':
                operationName = 'Division';
                if (num2 === 0) {
                    return { error: 'Division by zero is undefined.' };
                }
                resultDecimal = Math.trunc(num1 / num2);
                break;
            default: resultDecimal = 0; operationName = '';
        }

        const binary1 = decimalToBinaryOutput(num1, bits);
        const binary2 = decimalToBinaryOutput(num2, bits);
        const binaryResult = decimalToBinaryOutput(resultDecimal, bits);

        return {
            result: binaryResult,
            decimal: resultDecimal,
            steps: {
                original1: in1,
                original2: in2,
                padded1,
                padded2,
                decimal1: num1,
                decimal2: num2,
                binary1,
                binary2,
                binaryResult,
                operation: operationName
            }
        };
    }, [binaryRepresentation, decimalToBinaryOutput]);

    const handleCalculate = useCallback(() => {
        if (!numberSystem || !operation || !input1 || !input2) {
            setResult(null);
            setSteps([]);
            return;
        }

        try {
            let calcResult;
            if (numberSystem === 'binary') {
                calcResult = performBinaryOperation(input1, input2, operation);
            } else {
                const n1 = input1.toUpperCase();
                const n2 = input2.toUpperCase();
                const base = getBase(numberSystem);

                if (operation === 'addition') calcResult = performAddition(n1, n2, base);
                else if (operation === 'subtraction') calcResult = performSubtraction(n1, n2, base);
                else if (operation === 'multiplication') calcResult = performMultiplication(n1, n2, base);
                else if (operation === 'division') calcResult = performDivision(n1, n2, base);
            }

            setResult(calcResult);
            setSteps((calcResult && calcResult.steps) || []);
        } catch (err) {
            console.error(err);
            setResult({ error: 'Invalid input or calculation' });
        }
    }, [input1, input2, operation, numberSystem, performAddition, performSubtraction, performMultiplication, performBinaryOperation, performDivision]);

    useEffect(() => {
        handleCalculate();
    }, [handleCalculate]);

    const getOperatorSymbol = () => {
        if (operation === 'addition') return '+';
        if (operation === 'subtraction') return '−';
        if (operation === 'multiplication') return '×';
        if (operation === 'division') return '÷';
        return '';
    };

    const buildVisualDigits = () => {
        if (!result || !operation) return null;

        let top = '';
        let bottom = '';
        let res = '';

        if (numberSystem === 'binary' && result.steps) {
            const s = result.steps;
            top = s.binary1 || '0';
            bottom = s.binary2 || '0';
            res = s.binaryResult || result.result || '0';
        } else {
            top = (input1 || '0').toString().toUpperCase();
            bottom = (input2 || '0').toString().toUpperCase();
            res = (result.result || '0').toString().toUpperCase();
            if (numberSystem !== 'binary' && result.isNegative) {
                res = '-' + res;
            }
        }

        const maxLength = Math.max(top.length, bottom.length, res.length);
        const paddedTop = top.padStart(maxLength, ' ');
        const paddedBottom = bottom.padStart(maxLength, ' ');
        const paddedRes = res.padStart(maxLength, ' ');

        const carryRow = new Array(maxLength).fill('');
        const borrowRow = new Array(maxLength).fill('');

        if (operation === 'addition' && steps.length) {
            steps.forEach(step => {
                if (step.newCarry) {
                    const colFromRight = step.position + 1;
                    const idx = maxLength - 1 - colFromRight;
                    if (idx >= 0 && idx < maxLength) {
                        carryRow[idx] = '1';
                    }
                }
            });
        }

        if (operation === 'subtraction' && steps.length) {
            steps.forEach(step => {
                if (step.newBorrow) {
                    const colFromRight = step.position + 1;
                    const idx = maxLength - 1 - colFromRight;
                    if (idx >= 0 && idx < maxLength) {
                        borrowRow[idx] = '1';
                    }
                }
            });
        }

        return { paddedTop, paddedBottom, paddedRes, carryRow, borrowRow };
    };

    const renderResult = () => {
        if (!result) return null;
        if (result.error) {
            return (
                <div className="explanation">
                    <h3 className="explanation-title">Result Summary</h3>
                    <p className="explanation-intro">
                        <span className="highlight">Error:</span>{' '}
                        <span className="binary-highlight">{result.error}</span>
                    </p>
                </div>
            );
        }

        let displayResult = result.result || '';
        if (numberSystem !== 'binary' && result.isNegative) {
            displayResult = '-' + displayResult;
        }

        return (
            <div className="explanation">
                <h3 className="explanation-title">Result Summary</h3>
                <p className="explanation-intro">
                    <span className="highlight">Result ({numberSystem || 'n/a'}):</span>{' '}
                    <span className="binary-highlight">{displayResult}</span>
                </p>
                <div className="explanation-content">
                    <p><span className="highlight">Decimal equivalent:</span> {result.decimal ?? 'N/A'}</p>
                    {operation === 'division' && result.remainder !== undefined && (
                        <p>
                            <span className="highlight">Remainder:</span>{' '}
                            {result.remainder} {numberSystem !== 'decimal' && `(= ${result.remainderStr} in base ${getBase(numberSystem)})`}
                        </p>
                    )}
                    {numberSystem === 'binary' && result.steps && (
                        <p>
                            Showing an 8‑bit signed interpretation using{' '}
                            <span className="highlight">
                                {binaryRepresentation === 'twos-complement' ? "2's complement" : 'signed magnitude'}
                            </span>.
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const renderVisualization = () => {
        if (!result || !operation) return null;

        const digits = buildVisualDigits();
        if (!digits) return null;

        const { paddedTop, paddedBottom, paddedRes, carryRow } = digits;
        const opSymbol = getOperatorSymbol();

        return (
            <div className="calculation-visual">
                <div className="visual-work">
                    {(operation === 'addition' || operation === 'subtraction') && (
                        <div className={`digit-row ${operation === 'addition' ? 'carry-row' : 'borrow-row'}`}>
                            <div className="operator-space" />
                            {carryRow.map((c, idx) => (
                                <div key={`c-${idx}`} className="digit-cell">
                                    {c && operation === 'addition' && (
                                        <span className="carry-indicator">1</span>
                                    )}
                                    {c && operation === 'subtraction' && (
                                        <span className="borrow-indicator">1</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="digit-row">
                        <div className="operator-space" />
                        {Array.from(paddedTop).map((ch, idx) => (
                            <div key={`t-${idx}`} className="digit-cell">
                                {ch.trim() || ''}
                            </div>
                        ))}
                    </div>

                    <div className="digit-row">
                        <div className="operator-space">{opSymbol}</div>
                        {Array.from(paddedBottom).map((ch, idx) => (
                            <div key={`b-${idx}`} className="digit-cell">
                                {ch.trim() || ''}
                            </div>
                        ))}
                    </div>

                    <div className="separator-line" />

                    <div className="digit-row result-row">
                        <div className="operator-space">=</div>
                        {Array.from(paddedRes).map((ch, idx) => (
                            <div key={`r-${idx}`} className="digit-cell">
                                <span className="result-digit">{ch.trim() || ''}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const handleClear = () => {
        setInput1('');
        setInput2('');
        setResult(null);
        setSteps([]);
    };

    const handleSwap = () => {
        setInput1(input2);
        setInput2(input1);
    };

    return (
        <ToolLayout
            title="Number System Calculator"
            subtitle="Visual arithmetic across different bases"
        >
            <ControlPanel>
                <ControlGroup label="Number System">
                    <select className="control-select" value={numberSystem} onChange={e => { setNumberSystem(e.target.value); setInput1(''); setInput2(''); setOperation(''); }}>
                        <option value="">Select a number system...</option>
                        {numberSystems.map(sys => <option key={sys.value} value={sys.value}>{sys.label}</option>)}
                    </select>
                </ControlGroup>

                {numberSystem === 'binary' && (
                    <ControlGroup label="Binary Representation" className="fade-in">
                        <select className="control-select" value={binaryRepresentation} onChange={e => setBinaryRepresentation(e.target.value)}>
                            {binaryRepresentations.map(rep => <option key={rep.value} value={rep.value}>{rep.label}</option>)}
                        </select>
                        <p className="hint">Use up to 8 bits (automatically sign-extended/padded for signed interpretation).</p>
                    </ControlGroup>
                )}

                {numberSystem && (
                    <ControlGroup label="Operation" className="fade-in">
                        <select className="control-select" value={operation} onChange={e => setOperation(e.target.value)}>
                            <option value="">Select an operation...</option>
                            {operations.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                        </select>
                    </ControlGroup>
                )}

                {operation && (
                    <div className="input-group fade-in">
                        <ControlGroup label="First Number">
                            <input
                                type="text"
                                className="control-input"
                                value={input1}
                                onChange={e => {
                                    let val = e.target.value.toUpperCase();
                                    if (numberSystem === 'binary') {
                                        if (val.length > 8) val = val.slice(0, 8);
                                    }
                                    if (isValidInput(val, numberSystem)) setInput1(val);
                                }}
                                placeholder={`Enter ${numberSystem} number...`}
                            />
                        </ControlGroup>

                        <ControlGroup label="Second Number">
                            <input
                                type="text"
                                className="control-input"
                                value={input2}
                                onChange={e => {
                                    let val = e.target.value.toUpperCase();
                                    if (numberSystem === 'binary') {
                                        if (val.length > 8) val = val.slice(0, 8);
                                    }
                                    if (isValidInput(val, numberSystem)) setInput2(val);
                                }}
                                placeholder={`Enter ${numberSystem} number...`}
                            />
                        </ControlGroup>
                    </div>
                )}
            </ControlPanel>

            {operation && (
                <div className="controls-row">
                    <button className="btn" type="button" onClick={handleSwap}>
                        Swap Inputs
                    </button>
                    <button className="btn danger" type="button" onClick={handleClear}>
                        Clear
                    </button>
                </div>
            )}

            {result && (
                <div className="results-section fade-in">
                    <div className="result-card">
                        <h2 className="result-title">Calculation Result</h2>
                        <ExplanationBlock>
                            {renderResult()}
                        </ExplanationBlock>
                        {renderVisualization()}
                    </div>
                </div>
            )}
        </ToolLayout>
    );
};

export default NumberSystemCalculator;
