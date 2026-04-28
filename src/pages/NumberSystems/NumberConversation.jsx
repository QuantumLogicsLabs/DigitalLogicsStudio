import React, { useState } from 'react';
import { QuaternarySection } from '../../components/Quaternary Section';

export default function NumberConverter() {
    const [decimal, setDecimal] = useState('');
    const [binary, setBinary] = useState('');
    const [octal, setOctal] = useState('');
    const [hexadecimal, setHexadecimal] = useState('');

    const [selectedConversion, setSelectedConversion] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Helper function to convert fractional part to any base
    const convertFractionalPart = (fractional, base, precision = 8) => {
        let result = '';
        let steps = [];
        let value = fractional;

        for (let i = 0; i < precision && value > 0; i++) {
            value *= base;
            const digit = Math.floor(value);
            result += digit.toString(base).toUpperCase();
            steps.push({
                step: i + 1,
                multiplication: `${fractional.toFixed(precision)} × ${base} = ${value.toFixed(precision)}`,
                digit: digit,
                remaining: value - digit
            });
            value = value - digit;
        }

        return { result, steps };
    };

    // Helper function to convert any base fractional to decimal
    const fractionalToDecimal = (fractionalStr, base) => {
        let result = 0;
        const steps = [];

        for (let i = 0; i < fractionalStr.length; i++) {
            const digit = parseInt(fractionalStr[i], base);
            const power = -(i + 1);
            const value = digit * Math.pow(base, power);
            result += value;
            steps.push({
                position: i + 1,
                digit: fractionalStr[i],
                calculation: `${fractionalStr[i]} × ${base}^${power} = ${digit} × ${Math.pow(base, power).toFixed(8)} = ${value.toFixed(8)}`
            });
        }

        return { result, steps };
    };

    // Conversion functions
    const updateFromDecimal = (value) => {
        if (value === '') {
            setDecimal('');
            setBinary('');
            setOctal('');
            setHexadecimal('');
            return;
        }

        // Allow decimal point
        if (!/^-?\d*\.?\d*$/.test(value)) return;

        const num = parseFloat(value);
        if (isNaN(num)) return;

        setDecimal(value);

        // Handle integer and fractional parts separately
        const [intPart, fracPart] = value.split('.');
        const intNum = parseInt(intPart) || 0;

        if (fracPart !== undefined) {
            const fracValue = parseFloat('0.' + fracPart);

            // Binary
            const binInt = Math.abs(intNum).toString(2);
            const binFrac = convertFractionalPart(fracValue, 2).result;
            setBinary((intNum < 0 ? '-' : '') + binInt + (binFrac ? '.' + binFrac : ''));

            // Octal
            const octInt = Math.abs(intNum).toString(8);
            const octFrac = convertFractionalPart(fracValue, 8).result;
            setOctal((intNum < 0 ? '-' : '') + octInt + (octFrac ? '.' + octFrac : ''));

            // Hexadecimal
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
        if (value === '') {
            setDecimal('');
            setBinary('');
            setOctal('');
            setHexadecimal('');
            return;
        }

        // Validate binary input (allow decimal point)
        if (!/^-?[01]*\.?[01]*$/.test(value)) return;

        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 2) : 0;
        let decimalValue = intNum;

        if (fracPart) {
            const fracDecimal = fractionalToDecimal(fracPart, 2).result;
            decimalValue += fracDecimal;
        }

        if (value.startsWith('-')) decimalValue = -decimalValue;

        setDecimal(decimalValue.toString());
        setBinary(value);

        // Convert to other bases
        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 2).result;
            const octInt = intNum.toString(8);
            const octFrac = convertFractionalPart(fracValue, 8).result;
            setOctal((value.startsWith('-') ? '-' : '') + octInt + (octFrac ? '.' + octFrac : ''));

            const hexInt = intNum.toString(16).toUpperCase();
            const hexFrac = convertFractionalPart(fracValue, 16).result;
            setHexadecimal((value.startsWith('-') ? '-' : '') + hexInt + (hexFrac ? '.' + hexFrac : ''));
        } else {
            setOctal(intNum.toString(8));
            setHexadecimal(intNum.toString(16).toUpperCase());
        }
    };

    const updateFromOctal = (value) => {
        if (value === '') {
            setDecimal('');
            setBinary('');
            setOctal('');
            setHexadecimal('');
            return;
        }

        // Validate octal input
        if (!/^-?[0-7]*\.?[0-7]*$/.test(value)) return;

        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 8) : 0;
        let decimalValue = intNum;

        if (fracPart) {
            const fracDecimal = fractionalToDecimal(fracPart, 8).result;
            decimalValue += fracDecimal;
        }

        if (value.startsWith('-')) decimalValue = -decimalValue;

        setDecimal(decimalValue.toString());
        setOctal(value);

        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 8).result;
            const binInt = intNum.toString(2);
            const binFrac = convertFractionalPart(fracValue, 2).result;
            setBinary((value.startsWith('-') ? '-' : '') + binInt + (binFrac ? '.' + binFrac : ''));

            const hexInt = intNum.toString(16).toUpperCase();
            const hexFrac = convertFractionalPart(fracValue, 16).result;
            setHexadecimal((value.startsWith('-') ? '-' : '') + hexInt + (hexFrac ? '.' + hexFrac : ''));
        } else {
            setBinary(intNum.toString(2));
            setHexadecimal(intNum.toString(16).toUpperCase());
        }
    };

    const updateFromHexadecimal = (value) => {
        if (value === '') {
            setDecimal('');
            setBinary('');
            setOctal('');
            setHexadecimal('');
            return;
        }

        // Validate hex input
        if (!/^-?[0-9A-Fa-f]*\.?[0-9A-Fa-f]*$/.test(value)) return;

        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 16) : 0;
        let decimalValue = intNum;

        if (fracPart) {
            const fracDecimal = fractionalToDecimal(fracPart, 16).result;
            decimalValue += fracDecimal;
        }

        if (value.startsWith('-')) decimalValue = -decimalValue;

        setDecimal(decimalValue.toString());
        setHexadecimal(value.toUpperCase());

        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 16).result;
            const binInt = intNum.toString(2);
            const binFrac = convertFractionalPart(fracValue, 2).result;
            setBinary((value.startsWith('-') ? '-' : '') + binInt + (binFrac ? '.' + binFrac : ''));

            const octInt = intNum.toString(8);
            const octFrac = convertFractionalPart(fracValue, 8).result;
            setOctal((value.startsWith('-') ? '-' : '') + octInt + (octFrac ? '.' + octFrac : ''));
        } else {
            setBinary(intNum.toString(2));
            setOctal(intNum.toString(8));
        }
    };

    const conversions = [
        { id: 'bin-to-dec', label: 'Binary → Decimal', from: 'Binary', to: 'Decimal' },
        { id: 'bin-to-oct', label: 'Binary → Octal', from: 'Binary', to: 'Octal' },
        { id: 'bin-to-hex', label: 'Binary → Hexadecimal', from: 'Binary', to: 'Hexadecimal' },
        { id: 'dec-to-bin', label: 'Decimal → Binary', from: 'Decimal', to: 'Binary' },
        { id: 'dec-to-oct', label: 'Decimal → Octal', from: 'Decimal', to: 'Octal' },
        { id: 'dec-to-hex', label: 'Decimal → Hexadecimal', from: 'Decimal', to: 'Hexadecimal' },
        { id: 'oct-to-bin', label: 'Octal → Binary', from: 'Octal', to: 'Binary' },
        { id: 'oct-to-dec', label: 'Octal → Decimal', from: 'Octal', to: 'Decimal' },
        { id: 'oct-to-hex', label: 'Octal → Hexadecimal', from: 'Octal', to: 'Hexadecimal' },
        { id: 'hex-to-bin', label: 'Hexadecimal → Binary', from: 'Hexadecimal', to: 'Binary' },
        { id: 'hex-to-dec', label: 'Hexadecimal → Decimal', from: 'Hexadecimal', to: 'Decimal' },
        { id: 'hex-to-oct', label: 'Hexadecimal → Octal', from: 'Hexadecimal', to: 'Octal' },
    ];

    const getExplanation = (conversion) => {
        const examples = {
            decimal: decimal || '42.625',
            binary: binary || '101010.101',
            octal: octal || '52.5',
            hexadecimal: hexadecimal || '2A.A'
        };

        // Split into integer and fractional parts for explanations
        const getPartsWithDefaults = (value, defaultValue) => {
            const [int, frac] = (value || defaultValue).split('.');
            return { int: int || '0', frac: frac || '' };
        };

        const decParts = getPartsWithDefaults(examples.decimal, '42.625');
        const binParts = getPartsWithDefaults(examples.binary, '101010.101');
        const octParts = getPartsWithDefaults(examples.octal, '52.5');
        const hexParts = getPartsWithDefaults(examples.hexadecimal, '2A.A');

        const explanations = {
            'bin-to-dec': {
                title: 'Binary to Decimal Conversion',
                steps: [
                    'Binary uses base-2 (only 0s and 1s)',
                    `Let's convert ${examples.binary} to decimal:`,
                    '',
                    '=== INTEGER PART: ' + binParts.int + ' ===',
                    'Each position represents a power of 2 (right to left: 2⁰, 2¹, 2², 2³...)',
                    ...binParts.int.split('').reverse().map((bit, idx) =>
                        `Position ${idx}: ${bit} × 2^${idx} = ${bit} × ${Math.pow(2, idx)} = ${bit * Math.pow(2, idx)}`
                    ),
                    `Integer sum: ${binParts.int.split('').reverse().map((bit, idx) => bit * Math.pow(2, idx)).join(' + ')} = ${parseInt(binParts.int, 2)}`,
                    ...(binParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: .' + binParts.frac + ' ===',
                        'Each position represents a NEGATIVE power of 2 (left to right: 2⁻¹, 2⁻², 2⁻³...)',
                        'Formula: digit × base^(-position)',
                        ...binParts.frac.split('').map((bit, idx) =>
                            `Position ${idx + 1}: ${bit} × 2^(-${idx + 1}) = ${bit} × ${Math.pow(2, -(idx + 1)).toFixed(8)} = ${(bit * Math.pow(2, -(idx + 1))).toFixed(8)}`
                        ),
                        `Fractional sum: ${binParts.frac.split('').map((bit, idx) => (bit * Math.pow(2, -(idx + 1))).toFixed(8)).join(' + ')} = ${fractionalToDecimal(binParts.frac, 2).result.toFixed(8)}`,
                        '',
                        `FINAL RESULT: ${parseInt(binParts.int, 2)} + ${fractionalToDecimal(binParts.frac, 2).result.toFixed(8)} = ${(parseInt(binParts.int, 2) + fractionalToDecimal(binParts.frac, 2).result).toFixed(8)}`
                    ] : []),
                    `Result: ${examples.binary}₂ = ${binParts.frac ? (parseInt(binParts.int, 2) + fractionalToDecimal(binParts.frac, 2).result).toFixed(8) : parseInt(binParts.int, 2)}₁₀`
                ]
            },
            'bin-to-oct': {
                title: 'Binary to Octal Conversion',
                steps: [
                    'Group binary digits in sets of 3 (from right to left)',
                    `Converting ${examples.binary}:`,
                    '',
                    '=== INTEGER PART: ' + binParts.int + ' ===',
                    'Each group of 3 binary digits equals one octal digit',
                    `Binary: ${binParts.int.padStart(Math.ceil(binParts.int.length / 3) * 3, '0')}`,
                    'Grouped: ' + binParts.int.padStart(Math.ceil(binParts.int.length / 3) * 3, '0').match(/.{1,3}/g).join(' '),
                    'Convert each group: ' + binParts.int.padStart(Math.ceil(binParts.int.length / 3) * 3, '0').match(/.{1,3}/g).map(g => parseInt(g, 2)).join(' '),
                    `Integer result: ${parseInt(binParts.int, 2).toString(8)}`,
                    ...(binParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: .' + binParts.frac + ' ===',
                        'Group from left to right (pad with zeros on the right if needed)',
                        'Each group of 3 binary digits equals one octal digit',
                        'Padded binary: ' + (binParts.frac + '0'.repeat((3 - binParts.frac.length % 3) % 3)),
                        'Grouped: ' + (binParts.frac + '0'.repeat((3 - binParts.frac.length % 3) % 3)).match(/.{1,3}/g).join(' '),
                        'Convert each group: ' + (binParts.frac + '0'.repeat((3 - binParts.frac.length % 3) % 3)).match(/.{1,3}/g).map(g => parseInt(g, 2)).join(''),
                        `Fractional result: .${(binParts.frac + '0'.repeat((3 - binParts.frac.length % 3) % 3)).match(/.{1,3}/g).map(g => parseInt(g, 2)).join('')}`
                    ] : []),
                    `Result: ${examples.binary}₂ = ${parseInt(binParts.int, 2).toString(8)}${binParts.frac ? '.' + (binParts.frac + '0'.repeat((3 - binParts.frac.length % 3) % 3)).match(/.{1,3}/g).map(g => parseInt(g, 2)).join('') : ''}₈`
                ]
            },
            'bin-to-hex': {
                title: 'Binary to Hexadecimal Conversion',
                steps: [
                    'Group binary digits in sets of 4 (from right to left)',
                    `Converting ${examples.binary}:`,
                    '',
                    '=== INTEGER PART: ' + binParts.int + ' ===',
                    'Each group of 4 binary digits equals one hex digit',
                    `Binary: ${binParts.int.padStart(Math.ceil(binParts.int.length / 4) * 4, '0')}`,
                    'Grouped: ' + binParts.int.padStart(Math.ceil(binParts.int.length / 4) * 4, '0').match(/.{1,4}/g).join(' '),
                    'Convert each group: ' + binParts.int.padStart(Math.ceil(binParts.int.length / 4) * 4, '0').match(/.{1,4}/g).map(g => parseInt(g, 2).toString(16).toUpperCase()).join(' '),
                    `Integer result: ${parseInt(binParts.int, 2).toString(16).toUpperCase()}`,
                    ...(binParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: .' + binParts.frac + ' ===',
                        'Group from left to right (pad with zeros on the right if needed)',
                        'Each group of 4 binary digits equals one hex digit',
                        'Padded binary: ' + (binParts.frac + '0'.repeat((4 - binParts.frac.length % 4) % 4)),
                        'Grouped: ' + (binParts.frac + '0'.repeat((4 - binParts.frac.length % 4) % 4)).match(/.{1,4}/g).join(' '),
                        'Convert each group: ' + (binParts.frac + '0'.repeat((4 - binParts.frac.length % 4) % 4)).match(/.{1,4}/g).map(g => parseInt(g, 2).toString(16).toUpperCase()).join(''),
                        `Fractional result: .${(binParts.frac + '0'.repeat((4 - binParts.frac.length % 4) % 4)).match(/.{1,4}/g).map(g => parseInt(g, 2).toString(16).toUpperCase()).join('')}`
                    ] : []),
                    `Result: ${examples.binary}₂ = ${parseInt(binParts.int, 2).toString(16).toUpperCase()}${binParts.frac ? '.' + (binParts.frac + '0'.repeat((4 - binParts.frac.length % 4) % 4)).match(/.{1,4}/g).map(g => parseInt(g, 2).toString(16).toUpperCase()).join('') : ''}₁₆`
                ]
            },
            'dec-to-bin': {
                title: 'Decimal to Binary Conversion',
                steps: [
                    `Converting ${examples.decimal} to binary:`,
                    '',
                    '=== INTEGER PART: ' + decParts.int + ' ===',
                    'Method: Repeatedly divide by 2 and track remainders',
                    'Read remainders from BOTTOM to TOP to get the binary result',
                    ...generateDivisionSteps(parseInt(decParts.int), 2),
                    `Integer result: ${parseInt(decParts.int).toString(2)}`,
                    ...(decParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: 0.' + decParts.frac + ' ===',
                        'Method: Repeatedly multiply by 2 and extract the integer part',
                        'Read the integer parts from TOP to BOTTOM to get the binary result',
                        ...(() => {
                            const fracValue = parseFloat('0.' + decParts.frac);
                            const { steps } = convertFractionalPart(fracValue, 2, 8);
                            let currentValue = fracValue;
                            return steps.map((s, i) => {
                                const multiplied = currentValue * 2;
                                const intPart = Math.floor(multiplied);
                                const result = `Step ${s.step}: ${currentValue.toFixed(8)} × 2 = ${multiplied.toFixed(8)} → Integer part: ${intPart}, Remaining: ${(multiplied - intPart).toFixed(8)}`;
                                currentValue = multiplied - intPart;
                                return result;
                            });
                        })(),
                        `Fractional result: .${convertFractionalPart(parseFloat('0.' + decParts.frac), 2).result}`,
                        '',
                        `FINAL RESULT: ${parseInt(decParts.int).toString(2)}.${convertFractionalPart(parseFloat('0.' + decParts.frac), 2).result}`
                    ] : []),
                    `Result: ${examples.decimal}₁₀ = ${decParts.frac ? parseInt(decParts.int).toString(2) + '.' + convertFractionalPart(parseFloat('0.' + decParts.frac), 2).result : parseInt(decParts.int).toString(2)}₂`
                ]
            },
            'dec-to-oct': {
                title: 'Decimal to Octal Conversion',
                steps: [
                    `Converting ${examples.decimal} to octal:`,
                    '',
                    '=== INTEGER PART: ' + decParts.int + ' ===',
                    'Method: Repeatedly divide by 8 and track remainders',
                    'Read remainders from BOTTOM to TOP',
                    ...generateDivisionSteps(parseInt(decParts.int), 8),
                    `Integer result: ${parseInt(decParts.int).toString(8)}`,
                    ...(decParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: 0.' + decParts.frac + ' ===',
                        'Method: Repeatedly multiply by 8 and extract the integer part',
                        'Read the integer parts from TOP to BOTTOM',
                        ...(() => {
                            const fracValue = parseFloat('0.' + decParts.frac);
                            const { steps } = convertFractionalPart(fracValue, 8, 8);
                            let currentValue = fracValue;
                            return steps.map((s) => {
                                const multiplied = currentValue * 8;
                                const intPart = Math.floor(multiplied);
                                const result = `Step ${s.step}: ${currentValue.toFixed(8)} × 8 = ${multiplied.toFixed(8)} → Integer part: ${intPart}, Remaining: ${(multiplied - intPart).toFixed(8)}`;
                                currentValue = multiplied - intPart;
                                return result;
                            });
                        })(),
                        `Fractional result: .${convertFractionalPart(parseFloat('0.' + decParts.frac), 8).result}`,
                        '',
                        `FINAL RESULT: ${parseInt(decParts.int).toString(8)}.${convertFractionalPart(parseFloat('0.' + decParts.frac), 8).result}`
                    ] : []),
                    `Result: ${examples.decimal}₁₀ = ${decParts.frac ? parseInt(decParts.int).toString(8) + '.' + convertFractionalPart(parseFloat('0.' + decParts.frac), 8).result : parseInt(decParts.int).toString(8)}₈`
                ]
            },
            'dec-to-hex': {
                title: 'Decimal to Hexadecimal Conversion',
                steps: [
                    `Converting ${examples.decimal} to hexadecimal:`,
                    'Hex digits: 0-9, A(10), B(11), C(12), D(13), E(14), F(15)',
                    '',
                    '=== INTEGER PART: ' + decParts.int + ' ===',
                    'Method: Repeatedly divide by 16 and track remainders',
                    'Read remainders from BOTTOM to TOP',
                    ...generateDivisionSteps(parseInt(decParts.int), 16),
                    `Integer result: ${parseInt(decParts.int).toString(16).toUpperCase()}`,
                    ...(decParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: 0.' + decParts.frac + ' ===',
                        'Method: Repeatedly multiply by 16 and extract the integer part',
                        'Read the integer parts from TOP to BOTTOM',
                        ...(() => {
                            const fracValue = parseFloat('0.' + decParts.frac);
                            const { steps } = convertFractionalPart(fracValue, 16, 8);
                            let currentValue = fracValue;
                            return steps.map((s) => {
                                const multiplied = currentValue * 16;
                                const intPart = Math.floor(multiplied);
                                const hexDigit = intPart.toString(16).toUpperCase();
                                const result = `Step ${s.step}: ${currentValue.toFixed(8)} × 16 = ${multiplied.toFixed(8)} → Integer part: ${intPart} (${hexDigit}), Remaining: ${(multiplied - intPart).toFixed(8)}`;
                                currentValue = multiplied - intPart;
                                return result;
                            });
                        })(),
                        `Fractional result: .${convertFractionalPart(parseFloat('0.' + decParts.frac), 16).result}`,
                        '',
                        `FINAL RESULT: ${parseInt(decParts.int).toString(16).toUpperCase()}.${convertFractionalPart(parseFloat('0.' + decParts.frac), 16).result}`
                    ] : []),
                    `Result: ${examples.decimal}₁₀ = ${decParts.frac ? parseInt(decParts.int).toString(16).toUpperCase() + '.' + convertFractionalPart(parseFloat('0.' + decParts.frac), 16).result : parseInt(decParts.int).toString(16).toUpperCase()}₁₆`
                ]
            },
            'oct-to-bin': {
                title: 'Octal to Binary Conversion',
                steps: [
                    'Each octal digit converts to exactly 3 binary digits',
                    `Converting ${examples.octal}:`,
                    '',
                    '=== INTEGER PART: ' + octParts.int + ' ===',
                    'Convert each octal digit to 3-bit binary:',
                    ...octParts.int.split('').map(d => `${d}₈ = ${parseInt(d, 8)}₁₀ = ${parseInt(d, 8).toString(2).padStart(3, '0')}₂`),
                    `Integer result: ${parseInt(octParts.int, 8).toString(2)}`,
                    ...(octParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: .' + octParts.frac + ' ===',
                        'Convert each octal digit to 3-bit binary:',
                        ...octParts.frac.split('').map(d => `${d}₈ = ${parseInt(d, 8)}₁₀ = ${parseInt(d, 8).toString(2).padStart(3, '0')}₂`),
                        `Fractional result: .${octParts.frac.split('').map(d => parseInt(d, 8).toString(2).padStart(3, '0')).join('')}`
                    ] : []),
                    `Result: ${examples.octal}₈ = ${parseInt(octParts.int, 8).toString(2)}${octParts.frac ? '.' + octParts.frac.split('').map(d => parseInt(d, 8).toString(2).padStart(3, '0')).join('') : ''}₂`
                ]
            },
            'oct-to-dec': {
                title: 'Octal to Decimal Conversion',
                steps: [
                    'Octal uses base-8 (digits 0-7)',
                    `Converting ${examples.octal}:`,
                    '',
                    '=== INTEGER PART: ' + octParts.int + ' ===',
                    'Each position represents a power of 8 (right to left: 8⁰, 8¹, 8², 8³...)',
                    'Formula: digit × base^position',
                    ...octParts.int.split('').reverse().map((digit, idx) =>
                        `Position ${idx}: ${digit} × 8^${idx} = ${digit} × ${Math.pow(8, idx)} = ${digit * Math.pow(8, idx)}`
                    ),
                    `Integer sum: ${octParts.int.split('').reverse().map((digit, idx) => digit * Math.pow(8, idx)).join(' + ')} = ${parseInt(octParts.int, 8)}`,
                    ...(octParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: .' + octParts.frac + ' ===',
                        'Each position represents a NEGATIVE power of 8 (left to right: 8⁻¹, 8⁻², 8⁻³...)',
                        'Formula: digit × base^(-position)',
                        ...octParts.frac.split('').map((digit, idx) =>
                            `Position ${idx + 1}: ${digit} × 8^(-${idx + 1}) = ${digit} × ${Math.pow(8, -(idx + 1)).toFixed(8)} = ${(digit * Math.pow(8, -(idx + 1))).toFixed(8)}`
                        ),
                        `Fractional sum: ${octParts.frac.split('').map((digit, idx) => (digit * Math.pow(8, -(idx + 1))).toFixed(8)).join(' + ')} = ${fractionalToDecimal(octParts.frac, 8).result.toFixed(8)}`,
                        '',
                        `FINAL RESULT: ${parseInt(octParts.int, 8)} + ${fractionalToDecimal(octParts.frac, 8).result.toFixed(8)} = ${(parseInt(octParts.int, 8) + fractionalToDecimal(octParts.frac, 8).result).toFixed(8)}`
                    ] : []),
                    `Result: ${examples.octal}₈ = ${octParts.frac ? (parseInt(octParts.int, 8) + fractionalToDecimal(octParts.frac, 8).result).toFixed(8) : parseInt(octParts.int, 8)}₁₀`
                ]
            },
            'oct-to-hex': {
                title: 'Octal to Hexadecimal Conversion',
                steps: [
                    'Convert: Octal → Binary → Hexadecimal',
                    `Converting ${examples.octal}:`,
                    '',
                    'Step 1: Octal to Binary',
                    'Each octal digit = 3 binary digits',
                    ...octParts.int.split('').map(d => `${d} → ${parseInt(d, 8).toString(2).padStart(3, '0')}`),
                    `Binary integer: ${parseInt(octParts.int, 8).toString(2)}`,
                    ...(octParts.frac ? [
                        ...octParts.frac.split('').map(d => `${d} → ${parseInt(d, 8).toString(2).padStart(3, '0')}`),
                        `Binary fractional: .${octParts.frac.split('').map(d => parseInt(d, 8).toString(2).padStart(3, '0')).join('')}`,
                    ] : []),
                    '',
                    'Step 2: Binary to Hexadecimal',
                    'Group binary in sets of 4 for integer (right to left)',
                    'Group binary in sets of 4 for fraction (left to right)',
                    `Result: ${examples.octal}₈ = ${parseInt(octParts.int, 8).toString(16).toUpperCase()}${octParts.frac ? '.' + convertFractionalPart(fractionalToDecimal(octParts.frac, 8).result, 16).result : ''}₁₆`
                ]
            },
            'hex-to-bin': {
                title: 'Hexadecimal to Binary Conversion',
                steps: [
                    'Each hex digit converts to exactly 4 binary digits',
                    `Converting ${examples.hexadecimal}:`,
                    'Hex reference: 0-9 same, A=10, B=11, C=12, D=13, E=14, F=15',
                    '',
                    '=== INTEGER PART: ' + hexParts.int + ' ===',
                    'Convert each hex digit to 4-bit binary:',
                    ...hexParts.int.split('').map(d => `${d}₁₆ = ${parseInt(d, 16)}₁₀ = ${parseInt(d, 16).toString(2).padStart(4, '0')}₂`),
                    `Integer result: ${parseInt(hexParts.int, 16).toString(2)}`,
                    ...(hexParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: .' + hexParts.frac + ' ===',
                        'Convert each hex digit to 4-bit binary:',
                        ...hexParts.frac.split('').map(d => `${d}₁₆ = ${parseInt(d, 16)}₁₀ = ${parseInt(d, 16).toString(2).padStart(4, '0')}₂`),
                        `Fractional result: .${hexParts.frac.split('').map(d => parseInt(d, 16).toString(2).padStart(4, '0')).join('')}`
                    ] : []),
                    `Result: ${examples.hexadecimal}₁₆ = ${parseInt(hexParts.int, 16).toString(2)}${hexParts.frac ? '.' + hexParts.frac.split('').map(d => parseInt(d, 16).toString(2).padStart(4, '0')).join('') : ''}₂`
                ]
            },
            'hex-to-dec': {
                title: 'Hexadecimal to Decimal Conversion',
                steps: [
                    'Hexadecimal uses base-16 (0-9, A-F where A=10, B=11, C=12, D=13, E=14, F=15)',
                    `Converting ${examples.hexadecimal}:`,
                    '',
                    '=== INTEGER PART: ' + hexParts.int + ' ===',
                    'Each position represents a power of 16 (right to left: 16⁰, 16¹, 16², 16³...)',
                    'Formula: digit_value × base^position',
                    ...hexParts.int.split('').reverse().map((digit, idx) =>
                        `Position ${idx}: ${digit} (${parseInt(digit, 16)}) × 16^${idx} = ${parseInt(digit, 16)} × ${Math.pow(16, idx)} = ${parseInt(digit, 16) * Math.pow(16, idx)}`
                    ),
                    `Integer sum: ${hexParts.int.split('').reverse().map((digit, idx) => parseInt(digit, 16) * Math.pow(16, idx)).join(' + ')} = ${parseInt(hexParts.int, 16)}`,
                    ...(hexParts.frac ? [
                        '',
                        '=== FRACTIONAL PART: .' + hexParts.frac + ' ===',
                        'Each position represents a NEGATIVE power of 16 (left to right: 16⁻¹, 16⁻², 16⁻³...)',
                        'Formula: digit_value × base^(-position)',
                        ...hexParts.frac.split('').map((digit, idx) =>
                            `Position ${idx + 1}: ${digit} (${parseInt(digit, 16)}) × 16^(-${idx + 1}) = ${parseInt(digit, 16)} × ${Math.pow(16, -(idx + 1)).toFixed(8)} = ${(parseInt(digit, 16) * Math.pow(16, -(idx + 1))).toFixed(8)}`
                        ),
                        `Fractional sum: ${hexParts.frac.split('').map((digit, idx) => (parseInt(digit, 16) * Math.pow(16, -(idx + 1))).toFixed(8)).join(' + ')} = ${fractionalToDecimal(hexParts.frac, 16).result.toFixed(8)}`,
                        '',
                        `FINAL RESULT: ${parseInt(hexParts.int, 16)} + ${fractionalToDecimal(hexParts.frac, 16).result.toFixed(8)} = ${(parseInt(hexParts.int, 16) + fractionalToDecimal(hexParts.frac, 16).result).toFixed(8)}`
                    ] : []),
                    `Result: ${examples.hexadecimal}₁₆ = ${hexParts.frac ? (parseInt(hexParts.int, 16) + fractionalToDecimal(hexParts.frac, 16).result).toFixed(8) : parseInt(hexParts.int, 16)}₁₀`
                ]
            },
            'hex-to-oct': {
                title: 'Hexadecimal to Octal Conversion',
                steps: [
                    'Convert: Hexadecimal → Binary → Octal',
                    `Converting ${examples.hexadecimal}:`,
                    '',
                    'Step 1: Hexadecimal to Binary',
                    'Each hex digit = 4 binary digits',
                    ...hexParts.int.split('').map(d => `${d} → ${parseInt(d, 16).toString(2).padStart(4, '0')}`),
                    `Binary integer: ${parseInt(hexParts.int, 16).toString(2)}`,
                    ...(hexParts.frac ? [
                        ...hexParts.frac.split('').map(d => `${d} → ${parseInt(d, 16).toString(2).padStart(4, '0')}`),
                        `Binary fractional: .${hexParts.frac.split('').map(d => parseInt(d, 16).toString(2).padStart(4, '0')).join('')}`,
                    ] : []),
                    '',
                    'Step 2: Binary to Octal',
                    'Group binary in sets of 3 for integer (right to left)',
                    'Group binary in sets of 3 for fraction (left to right)',
                    `Result: ${examples.hexadecimal}₁₆ = ${parseInt(hexParts.int, 16).toString(8)}${hexParts.frac ? '.' + convertFractionalPart(fractionalToDecimal(hexParts.frac, 16).result, 8).result : ''}₈`
                ]
            }
        };

        return explanations[conversion.id];
    };

    const generateDivisionSteps = (num, base) => {
        const steps = [];
        let current = num;
        while (current > 0) {
            const remainder = current % base;
            const quotient = Math.floor(current / base);
            const remainderDisplay = base === 16 ? (remainder > 9 ? String.fromCharCode(65 + remainder - 10) : remainder) : remainder;
            steps.push(`${current} ÷ ${base} = ${quotient} remainder ${remainderDisplay}`);
            current = quotient;
        }
        return steps;
    };

    const handleConversionClick = (conversion) => {
        setSelectedConversion(conversion);
        setShowExplanation(true);
    };

    return (
        <div className="converter-container">
            {/* Title */}
            <div className="title-section">
                <h1 className="main-title">BASE CONVERTER</h1>
                <p className="subtitle">Real-time Number System Conversion</p>
            </div>

            {/* Converter Boxes */}
            <div className="converter-grid">
                {/* Decimal */}
                <div className="converter-card">
                    <div className="card-header">
                        <div className="base-icon decimal">10</div>
                        <h2 className="card-title decimal">DECIMAL</h2>
                    </div>
                    <input
                        className="converter-input"
                        type="text"
                        value={decimal}
                        onChange={(e) => updateFromDecimal(e.target.value)}
                        placeholder="Enter decimal..."
                    />
                    <p className="card-info">Base 10 • Digits: 0-9</p>
                </div>

                {/* Binary */}
                <div className="converter-card">
                    <div className="card-header">
                        <div className="base-icon binary">2</div>
                        <h2 className="card-title binary">BINARY</h2>
                    </div>
                    <input
                        className="converter-input"
                        type="text"
                        value={binary}
                        onChange={(e) => updateFromBinary(e.target.value)}
                        placeholder="Enter binary..."
                    />
                    <p className="card-info">Base 2 • Digits: 0-1</p>
                </div>

                {/* Octal */}
                <div className="converter-card">
                    <div className="card-header">
                        <div className="base-icon octal">8</div>
                        <h2 className="card-title octal">OCTAL</h2>
                    </div>
                    <input
                        className="converter-input"
                        type="text"
                        value={octal}
                        onChange={(e) => updateFromOctal(e.target.value)}
                        placeholder="Enter octal..."
                    />
                    <p className="card-info">Base 8 • Digits: 0-7</p>
                </div>

                {/* Hexadecimal */}
                <div className="converter-card">
                    <div className="card-header">
                        <div className="base-icon hexadecimal">16</div>
                        <h2 className="card-title hexadecimal">HEXADECIMAL</h2>
                    </div>
                    <input
                        className="converter-input"
                        type="text"
                        value={hexadecimal}
                        onChange={(e) => updateFromHexadecimal(e.target.value)}
                        placeholder="Enter hex..."
                    />
                    <p className="card-info">Base 16 • Digits: 0-9, A-F</p>
                </div>
            </div>

            {/* Explanation Section */}
            <div className="explanation-section">
                <div className="explanation-header">
                    <h2 className="explanation-title">LEARN CONVERSIONS</h2>
                    <p className="explanation-subtitle">
                        Click any conversion to see a detailed step-by-step explanation
                    </p>
                </div>

                {/* Conversion Grid */}
                <div className="conversion-grid">
                    {conversions.map((conversion) => (
                        <button
                            key={conversion.id}
                            className="conversion-btn"
                            onClick={() => handleConversionClick(conversion)}
                        >
                            {conversion.label}
                        </button>
                    ))}
                </div>

                {/* Explanation Modal */}
                {showExplanation && selectedConversion && (
                    <div className="modal-overlay" onClick={() => setShowExplanation(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="modal-close"
                                onClick={() => setShowExplanation(false)}
                            >
                                ×
                            </button>

                            <h3 className="modal-title">
                                {getExplanation(selectedConversion).title}
                            </h3>

                            <div className="steps-container">
                                {getExplanation(selectedConversion).steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`step-item ${index % 2 === 0 ? 'even' : 'odd'}`}
                                    >
                                        {step}
                                    </div>
                                ))}
                            </div>

                            <div className="pro-tip">
                                <p className="pro-tip-label">💡 Pro Tip</p>
                                <p className="pro-tip-text">
                                    Try entering different values in the converter boxes above to see how numbers change across different bases in real-time!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <QuaternarySection />
        </div>
    );
}