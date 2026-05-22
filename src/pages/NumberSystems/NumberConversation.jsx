import React, { useState } from 'react';
import NSLayout from './components/NSLayout';
import { QuaternarySection } from '../../components/Quaternary Section';

export default function NumberConverter() {
    const [decimal, setDecimal] = useState('');
    const [binary, setBinary] = useState('');
    const [octal, setOctal] = useState('');
    const [hexadecimal, setHexadecimal] = useState('');
    const [selectedConversion, setSelectedConversion] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const convertFractionalPart = (fractional, base, precision = 8) => {
        let result = '';
        let steps = [];
        let value = fractional;
        for (let i = 0; i < precision && value > 0; i++) {
            value *= base;
            const digit = Math.floor(value);
            result += digit.toString(base).toUpperCase();
            steps.push({ step: i + 1, digit, remaining: value - digit });
            value = value - digit;
        }
        return { result, steps };
    };

    const fractionalToDecimal = (fractionalStr, base) => {
        let result = 0;
        const steps = [];
        for (let i = 0; i < fractionalStr.length; i++) {
            const digit = parseInt(fractionalStr[i], base);
            const power = -(i + 1);
            const value = digit * Math.pow(base, power);
            result += value;
            steps.push({ position: i + 1, digit: fractionalStr[i] });
        }
        return { result, steps };
    };

    const updateFromDecimal = (value) => {
        if (value === '') { setDecimal(''); setBinary(''); setOctal(''); setHexadecimal(''); return; }
        if (!/^-?\d*\.?\d*$/.test(value)) return;
        const num = parseFloat(value);
        if (isNaN(num)) return;
        setDecimal(value);
        const [intPart, fracPart] = value.split('.');
        const intNum = parseInt(intPart) || 0;
        if (fracPart !== undefined) {
            const fracValue = parseFloat('0.' + fracPart);
            const binInt = Math.abs(intNum).toString(2);
            const binFrac = convertFractionalPart(fracValue, 2).result;
            setBinary((intNum < 0 ? '-' : '') + binInt + (binFrac ? '.' + binFrac : ''));
            const octInt = Math.abs(intNum).toString(8);
            const octFrac = convertFractionalPart(fracValue, 8).result;
            setOctal((intNum < 0 ? '-' : '') + octInt + (octFrac ? '.' + octFrac : ''));
            const hexInt = Math.abs(intNum).toString(16).toUpperCase();
            const hexFrac = convertFractionalPart(fracValue, 16).result;
            setHexadecimal((intNum < 0 ? '-' : '') + hexInt + (hexFrac ? '.' + hexFrac : ''));
        } else {
            setBinary(intNum.toString(2));
            setOctal(intNum.toString(8));
            setHexadecimal(intNum.toString(16).toUpperCase());
        }
    };

    const updateFromBinary = (value) => {
        if (value === '') { setDecimal(''); setBinary(''); setOctal(''); setHexadecimal(''); return; }
        if (!/^-?[01]*\.?[01]*$/.test(value)) return;
        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 2) : 0;
        let decimalValue = intNum;
        if (fracPart) decimalValue += fractionalToDecimal(fracPart, 2).result;
        if (value.startsWith('-')) decimalValue = -decimalValue;
        setDecimal(decimalValue.toString());
        setBinary(value);
        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 2).result;
            setOctal((value.startsWith('-') ? '-' : '') + intNum.toString(8) + ('.' + convertFractionalPart(fracValue, 8).result || ''));
            setHexadecimal((value.startsWith('-') ? '-' : '') + intNum.toString(16).toUpperCase() + ('.' + convertFractionalPart(fracValue, 16).result || ''));
        } else {
            setOctal(intNum.toString(8));
            setHexadecimal(intNum.toString(16).toUpperCase());
        }
    };

    const updateFromOctal = (value) => {
        if (value === '') { setDecimal(''); setBinary(''); setOctal(''); setHexadecimal(''); return; }
        if (!/^-?[0-7]*\.?[0-7]*$/.test(value)) return;
        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 8) : 0;
        let decimalValue = intNum;
        if (fracPart) decimalValue += fractionalToDecimal(fracPart, 8).result;
        if (value.startsWith('-')) decimalValue = -decimalValue;
        setDecimal(decimalValue.toString());
        setOctal(value);
        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 8).result;
            setBinary((value.startsWith('-') ? '-' : '') + intNum.toString(2) + ('.' + convertFractionalPart(fracValue, 2).result || ''));
            setHexadecimal((value.startsWith('-') ? '-' : '') + intNum.toString(16).toUpperCase() + ('.' + convertFractionalPart(fracValue, 16).result || ''));
        } else {
            setBinary(intNum.toString(2));
            setHexadecimal(intNum.toString(16).toUpperCase());
        }
    };

    const updateFromHexadecimal = (value) => {
        if (value === '') { setDecimal(''); setBinary(''); setOctal(''); setHexadecimal(''); return; }
        if (!/^-?[0-9A-Fa-f]*\.?[0-9A-Fa-f]*$/.test(value)) return;
        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 16) : 0;
        let decimalValue = intNum;
        if (fracPart) decimalValue += fractionalToDecimal(fracPart, 16).result;
        if (value.startsWith('-')) decimalValue = -decimalValue;
        setDecimal(decimalValue.toString());
        setHexadecimal(value.toUpperCase());
        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 16).result;
            setBinary((value.startsWith('-') ? '-' : '') + intNum.toString(2) + ('.' + convertFractionalPart(fracValue, 2).result || ''));
            setOctal((value.startsWith('-') ? '-' : '') + intNum.toString(8) + ('.' + convertFractionalPart(fracValue, 8).result || ''));
        } else {
            setBinary(intNum.toString(2));
            setOctal(intNum.toString(8));
        }
    };

    const conversions = [
        { id: 'bin-to-dec', label: 'Binary → Decimal' },
        { id: 'bin-to-oct', label: 'Binary → Octal' },
        { id: 'bin-to-hex', label: 'Binary → Hexadecimal' },
        { id: 'dec-to-bin', label: 'Decimal → Binary' },
        { id: 'dec-to-oct', label: 'Decimal → Octal' },
        { id: 'dec-to-hex', label: 'Decimal → Hexadecimal' },
        { id: 'oct-to-bin', label: 'Octal → Binary' },
        { id: 'oct-to-dec', label: 'Octal → Decimal' },
        { id: 'oct-to-hex', label: 'Octal → Hexadecimal' },
        { id: 'hex-to-bin', label: 'Hexadecimal → Binary' },
        { id: 'hex-to-dec', label: 'Hexadecimal → Decimal' },
        { id: 'hex-to-oct', label: 'Hexadecimal → Octal' },
    ];

    const baseMeta = {
        bin: { name: 'Binary', base: 2, value: binary || '101010' },
        dec: { name: 'Decimal', base: 10, value: decimal || '42' },
        oct: { name: 'Octal', base: 8, value: octal || '52' },
        hex: { name: 'Hexadecimal', base: 16, value: hexadecimal || '2A' },
    };

    const normalizeNumberParts = (value) => {
        const trimmed = String(value || '0').trim();
        const negative = trimmed.startsWith('-');
        const unsigned = negative ? trimmed.slice(1) : trimmed;
        const [integer = '0', fraction = ''] = unsigned.split('.');

        return {
            negative,
            integer: integer || '0',
            fraction,
            display: `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`,
        };
    };

    const digitValue = (digit, base) => parseInt(digit, base);

    const formatBaseResult = (decimalValue, targetBase) => {
        if (targetBase === 10) return decimalValue.toString();

        const sign = decimalValue < 0 ? '-' : '';
        const absolute = Math.abs(decimalValue);
        const integer = Math.trunc(absolute);
        const fraction = absolute - integer;
        const integerPart = integer.toString(targetBase).toUpperCase();
        const fractionPart = fraction > 0
            ? convertFractionalPart(fraction, targetBase).result
            : '';

        return `${sign}${integerPart}${fractionPart ? `.${fractionPart}` : ''}`;
    };

    const explainToDecimal = (source, sourceKey) => {
        const { base, name } = source;
        const parts = normalizeNumberParts(source.value);
        const intDigits = parts.integer.split('');
        const fracDigits = parts.fraction.split('');
        const steps = [
            `Start with ${parts.display} in ${name}. Its base is ${base}.`,
        ];
        let total = 0;

        if (intDigits.length) {
            const highestPower = intDigits.length - 1;
            const integerTerms = intDigits.map((digit, index) => {
                const power = highestPower - index;
                const value = digitValue(digit, base) * Math.pow(base, power);
                total += value;
                return `${digit} x ${base}^${power} = ${value}`;
            });
            steps.push(`Expand the integer part from left to right: ${integerTerms.join(' + ')}.`);
        }

        if (fracDigits.length) {
            const fractionTerms = fracDigits.map((digit, index) => {
                const power = -(index + 1);
                const value = digitValue(digit, base) * Math.pow(base, power);
                total += value;
                return `${digit} x ${base}^${power} = ${value}`;
            });
            steps.push(`Expand the fractional part with negative powers: ${fractionTerms.join(' + ')}.`);
        }

        const signedTotal = parts.negative ? -total : total;
        if (parts.negative) {
            steps.push(`Apply the negative sign: -${total} = ${signedTotal}.`);
        }
        steps.push(`${parts.display} (${sourceKey.toUpperCase()}) = ${signedTotal} (DEC).`);

        return { decimalValue: signedTotal, steps };
    };

    const explainFromDecimal = (source, target) => {
        const decimalValue = Number.parseFloat(source.value || '0');
        const targetBase = target.base;
        const targetName = target.name;
        const steps = [`Start with ${decimalValue} in Decimal.`];
        const sign = decimalValue < 0 ? '-' : '';
        const absolute = Math.abs(decimalValue);
        const integer = Math.trunc(absolute);
        let quotient = integer;
        const remainders = [];

        if (integer === 0) {
            steps.push(`Integer part is 0, so the ${targetName} integer part is 0.`);
        } else {
            while (quotient > 0) {
                const remainder = quotient % targetBase;
                const nextQuotient = Math.floor(quotient / targetBase);
                remainders.push(remainder.toString(targetBase).toUpperCase());
                steps.push(`${quotient} / ${targetBase} = ${nextQuotient} remainder ${remainder.toString(targetBase).toUpperCase()}.`);
                quotient = nextQuotient;
            }
            steps.push(`Read remainders from bottom to top: ${remainders.slice().reverse().join('')}.`);
        }

        let fraction = absolute - integer;
        const fractionDigits = [];
        if (fraction > 0) {
            for (let step = 1; step <= 8 && fraction > 0; step++) {
                const multiplied = fraction * targetBase;
                const digit = Math.floor(multiplied);
                const digitText = digit.toString(targetBase).toUpperCase();
                fractionDigits.push(digitText);
                steps.push(`${fraction.toFixed(10)} x ${targetBase} = ${multiplied.toFixed(10)}; take ${digitText}.`);
                fraction = multiplied - digit;
            }
        }

        const integerPart = integer === 0 ? '0' : remainders.slice().reverse().join('');
        const result = `${sign}${integerPart}${fractionDigits.length ? `.${fractionDigits.join('')}` : ''}`;
        steps.push(`${source.value || '0'} (DEC) = ${result} (${targetName.toUpperCase()}).`);

        return { result, steps };
    };

    const explainGroupedConversion = (source, sourceKey, target, targetKey) => {
        const parts = normalizeNumberParts(source.value);
        const groupSize = targetKey === 'oct' ? 3 : 4;
        const paddedInteger = parts.integer.padStart(Math.ceil(parts.integer.length / groupSize) * groupSize, '0');
        const paddedFraction = parts.fraction
            ? parts.fraction.padEnd(Math.ceil(parts.fraction.length / groupSize) * groupSize, '0')
            : '';
        const integerGroups = paddedInteger.match(new RegExp(`.{1,${groupSize}}`, 'g')) || ['0'];
        const fractionGroups = paddedFraction.match(new RegExp(`.{1,${groupSize}}`, 'g')) || [];
        const convertGroup = (group) => parseInt(group, 2).toString(target.base).toUpperCase();
        const result = `${parts.negative ? '-' : ''}${integerGroups.map(convertGroup).join('').replace(/^0+(?=\w)/, '') || '0'}${fractionGroups.length ? `.${fractionGroups.map(convertGroup).join('')}` : ''}`;
        const steps = [
            `Start with ${parts.display} in ${source.name}.`,
            `${target.name} digits use groups of ${groupSize} binary bits.`,
            `Pad and group the integer part: ${paddedInteger} -> ${integerGroups.join(' ')}.`,
            `Convert each group: ${integerGroups.map((group) => `${group}=${convertGroup(group)}`).join(', ')}.`,
        ];

        if (fractionGroups.length) {
            steps.push(`Pad and group the fractional part: ${paddedFraction} -> ${fractionGroups.join(' ')}.`);
            steps.push(`Convert each fractional group: ${fractionGroups.map((group) => `${group}=${convertGroup(group)}`).join(', ')}.`);
        }

        steps.push(`${parts.display} (${sourceKey.toUpperCase()}) = ${result} (${targetKey.toUpperCase()}).`);
        return steps;
    };

    const explainViaDecimal = (source, sourceKey, target, targetKey) => {
        const decimalExplanation = explainToDecimal(source, sourceKey);
        const targetExplanation = explainFromDecimal(
            { ...baseMeta.dec, value: decimalExplanation.decimalValue.toString() },
            target,
        );

        return [
            ...decimalExplanation.steps,
            `Now convert ${decimalExplanation.decimalValue} from Decimal to ${target.name}.`,
            ...targetExplanation.steps.slice(1),
            `${source.value} (${sourceKey.toUpperCase()}) = ${formatBaseResult(decimalExplanation.decimalValue, target.base)} (${targetKey.toUpperCase()}).`,
        ];
    };

    const getExplanation = (conversion) => {
        const [sourceKey, targetKey] = conversion.id.split('-to-');
        const source = baseMeta[sourceKey];
        const target = baseMeta[targetKey];
        let steps;

        if (targetKey === 'dec') {
            steps = explainToDecimal(source, sourceKey).steps;
        } else if (sourceKey === 'dec') {
            steps = explainFromDecimal(source, target).steps;
        } else if (sourceKey === 'bin' && ['oct', 'hex'].includes(targetKey)) {
            steps = explainGroupedConversion(source, sourceKey, target, targetKey);
        } else {
            steps = explainViaDecimal(source, sourceKey, target, targetKey);
        }

        return { title: conversion.label + ' Conversion', steps };
    };

    const handleConversionClick = (conversion) => { setSelectedConversion(conversion); setShowExplanation(true); };

    const getStepKind = (step, index, totalSteps) => {
        if (index === 0) return 'start';
        if (index === totalSteps - 1) return 'result';
        if (/Expand|Pad and group|Convert each|Read remainders|remainder|take/i.test(step)) return 'work';
        return 'note';
    };

    const stepLabels = {
        start: 'Given',
        work: 'Work',
        note: 'Note',
        result: 'Answer',
    };

    const formatStepText = (step) => (
        step
            .replaceAll(' x ', ' × ')
            .replaceAll(' -> ', ' → ')
    );

    const clearAll = () => {
        setDecimal('');
        setBinary('');
        setOctal('');
        setHexadecimal('');
        setSelectedConversion(null);
        setShowExplanation(false);
    };

    const hasValues = Boolean(decimal || binary || octal || hexadecimal);

    const converterCards = [
        {
            key: 'decimal',
            base: '10',
            title: 'Decimal',
            value: decimal,
            placeholder: 'Enter decimal...',
            info: 'Base 10 - digits 0-9',
            onChange: updateFromDecimal,
        },
        {
            key: 'binary',
            base: '2',
            title: 'Binary',
            value: binary,
            placeholder: 'Enter binary...',
            info: 'Base 2 - digits 0-1',
            onChange: updateFromBinary,
        },
        {
            key: 'octal',
            base: '8',
            title: 'Octal',
            value: octal,
            placeholder: 'Enter octal...',
            info: 'Base 8 - digits 0-7',
            onChange: updateFromOctal,
        },
        {
            key: 'hexadecimal',
            base: '16',
            title: 'Hexadecimal',
            value: hexadecimal,
            placeholder: 'Enter hex...',
            info: 'Base 16 - digits 0-9, A-F',
            onChange: updateFromHexadecimal,
        },
    ];

    return (
        <NSLayout
            title="Number Conversion"
            subtitle="Real-time conversion between binary, octal, decimal, and hexadecimal"
            intro="Type any value in any base and all four representations update instantly. Use the learn panel below for step-by-step conversion guides."
        >
            <div className="converter-toolbar">
                <div>
                    <p className="converter-toolbar-kicker">Live workspace</p>
                    <h2 className="converter-toolbar-title">Type in any base</h2>
                </div>
                <button
                    className="converter-clear-btn"
                    type="button"
                    onClick={clearAll}
                    disabled={!hasValues}
                >
                    Clear values
                </button>
            </div>

            {/* Converter Boxes */}
            <div className="converter-grid">
                {converterCards.map((card) => (
                    <div
                        key={card.key}
                        className={`converter-card ${card.value ? 'is-active' : ''}`}
                    >
                        <div className="card-header">
                            <div className={`base-icon ${card.key}`}>{card.base}</div>
                            <div>
                                <h2 className={`card-title ${card.key}`}>{card.title}</h2>
                                <p className="card-info">{card.info}</p>
                            </div>
                        </div>
                        <input
                            className="converter-input"
                            type="text"
                            value={card.value}
                            onChange={(e) => card.onChange(e.target.value)}
                            placeholder={card.placeholder}
                            aria-label={`${card.title} value`}
                        />
                    </div>
                ))}
            </div>

            <div className="converter-summary">
                <div>
                    <span className="converter-summary-label">Status</span>
                    <strong>{hasValues ? 'Synchronized' : 'Waiting for input'}</strong>
                </div>
                <div>
                    <span className="converter-summary-label">Supported</span>
                    <strong>Integers and fractions</strong>
                </div>
                <div>
                    <span className="converter-summary-label">Precision</span>
                    <strong>8 fractional steps</strong>
                </div>
            </div>

            {/* Explanation Section */}
            <div className="explanation-section">
                <div className="explanation-header">
                    <h2 className="explanation-title">LEARN CONVERSIONS</h2>
                    <p className="explanation-subtitle">Click any conversion to see a detailed step-by-step explanation</p>
                </div>

                <div className="conversion-grid">
                    {conversions.map((conversion) => (
                        <button key={conversion.id} className="conversion-btn"
                            onClick={() => handleConversionClick(conversion)}>
                            {conversion.label}
                        </button>
                    ))}
                </div>

                {showExplanation && selectedConversion && (() => {
                    const explanation = getExplanation(selectedConversion);

                    return (
                        <div className="modal-overlay" onClick={() => setShowExplanation(false)}>
                            <div className="modal-content conversion-explainer" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="modal-close"
                                    type="button"
                                    aria-label="Close conversion explanation"
                                    onClick={() => setShowExplanation(false)}
                                >
                                    ×
                                </button>

                                <div className="modal-heading">
                                    <p className="modal-kicker">Step-by-step conversion</p>
                                    <h3 className="modal-title">{explanation.title}</h3>
                                </div>

                                <div className="steps-container">
                                    {explanation.steps.map((step, index) => {
                                        const kind = getStepKind(step, index, explanation.steps.length);

                                        return (
                                            <div
                                                key={`${kind}-${index}`}
                                                className={`step-item step-${kind} ${index % 2 === 0 ? 'even' : 'odd'}`}
                                            >
                                                <div className="step-marker" aria-hidden="true">
                                                    {String(index + 1).padStart(2, '0')}
                                                </div>
                                                <div className="step-copy">
                                                    <span className="step-label">{stepLabels[kind]}</span>
                                                    <p className="step-text">{formatStepText(step)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pro-tip">
                                    <p className="pro-tip-label">Pro Tip</p>
                                    <p className="pro-tip-text">
                                        Change any converter value above, then reopen this guide to compare the same method with a new number.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>

            <QuaternarySection />
        </NSLayout>
    );
}
