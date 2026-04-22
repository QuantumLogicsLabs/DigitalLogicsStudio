import React, { useState } from 'react';
import { ChevronDown, Cpu, Binary, Calculator, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';
import {logic_and_computer_design_fundamental} from 'dld-books'

const ProblemSolver = () => {
    const [expandedProblems, setExpandedProblems] = useState(new Set());
    const [showDetailedExplanation, setShowDetailedExplanation] = useState({});

    const toggleProblem = (id) => {
        const newExpanded = new Set(expandedProblems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedProblems(newExpanded);
    };

    const toggleDetailedExplanation = (id) => {
        setShowDetailedExplanation(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const problems =logic_and_computer_design_fundamental.Ch1;

    return (
        <div className="solver-container">
            <div className="solver-header">
                <div className="header-content">
                    <div className="icon-container">
                        <Cpu size={56} />
                    </div>
                    <div className="header-text">
                        <h1 className="main-title">Computer Systems Problem Solver</h1>
                        <p className="subtitle">Chapter 1: Number Systems & Digital Encoding • All 30 Problems</p>
                    </div>
                </div>
                <div className="binary-decoration">
                    <Binary size={40} />
                </div>
            </div>

            <div className="stats-bar">
                <div className="stat-item">
                    <BookOpen size={20} />
                    <span>30 Problems</span>
                </div>
                <div className="stat-item">
                    <Lightbulb size={20} />
                    <span>Detailed Explanations</span>
                </div>
                <div className="stat-item">
                    <CheckCircle size={20} />
                    <span>Solution Manual Verified</span>
                </div>
            </div>

            <div className="problems-container">
                {problems.map(problem => (
                    <div key={problem.id} className={`problem-card ${expandedProblems.has(problem.id) ? 'expanded' : ''}`}>
                        <button
                            className="problem-header"
                            onClick={() => toggleProblem(problem.id)}
                        >
                            <div className="problem-title-row">
                                <div className="problem-id">PROBLEM {problem.id}</div>
                                <div className="category-tag">{problem.category}</div>
                            </div>
                            <h3 className="problem-title">{problem.title}</h3>
                            <ChevronDown
                                className={`chevron ${expandedProblems.has(problem.id) ? 'rotated' : ''}`}
                                size={24}
                            />
                        </button>

                        {expandedProblems.has(problem.id) && (
                            <div className="problem-content">
                                <div className="question-section">
                                    <div className="section-header">
                                        <BookOpen size={20} />
                                        <h4>Question</h4>
                                    </div>
                                    <p className="question-text">{problem.question}</p>
                                </div>

                                <div className="solution-section">
                                    <div className="section-header">
                                        <Calculator size={20} />
                                        <h4>Solution</h4>
                                    </div>

                                    <div className="short-answer-box">
                                        <h5 className="short-answer-title">
                                            <CheckCircle size={20} />
                                            Answer
                                        </h5>
                                        <div className="short-answer-content">
                                            <p className="answer-text">{problem.shortAnswer}</p>
                                        </div>
                                    </div>

                                    <button
                                        className="explanation-toggle"
                                        onClick={() => toggleDetailedExplanation(problem.id)}
                                    >
                                        <Lightbulb size={18} />
                                        {showDetailedExplanation[problem.id] ? 'Hide Detailed Explanation' : 'Show Detailed Explanation'}
                                    </button>

                                    {showDetailedExplanation[problem.id] && (
                                        <div className="deep-explanation">
                                            <div className="deep-content">
                                                <h5>
                                                    <Lightbulb size={20} />
                                                    Detailed Step-by-Step Explanation
                                                </h5>

                                                {renderDetailedExplanation(problem)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    function renderDetailedExplanation(problem) {
        // Problem 1-1: Wind Sensor
        if (problem.id === '1-1') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 Understanding the Problem</h6>
                        <p className="simple-explanation">
                            Think of an anemometer like a pinwheel that spins faster when the wind blows harder.
                            This pinwheel is connected to a special disk that's half clear (like glass) and half black (opaque).
                        </p>
                        <p className="simple-explanation">
                            There's a light above the disk and a sensor (photodiode) below it. When the clear part is over the sensor,
                            light passes through and the sensor outputs 3V. When the black part is over it, no light passes and it outputs 0V.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (a): Voltage Waveforms</h6>

                        <div className="scenario-box">
                            <h6 className="scenario-title">(1) Wind Calm (0 mph)</h6>
                            <p>When there's no wind, the disk doesn't spin. It stays in one position.</p>
                            <div className="waveform-display">
                                <pre className="waveform-visual">3V ───────────────────
                                    OR
                                    0V ───────────────────</pre>
                            </div>
                            <p className="simple-explanation">
                                The voltage is constant - either 3V or 0V depending on which part of the disk is over the sensor.
                                There's NO up and down pattern because nothing is moving!
                            </p>
                        </div>

                        <div className="scenario-box">
                            <h6 className="scenario-title">(2) Wind at 10 mph</h6>
                            <p>Now the disk rotates slowly. As it spins, the sensor sees clear, then black, then clear again.</p>
                            <div className="waveform-display">
                                <pre className="waveform-visual">
                                    3V
                                    ──┐    ┌──┐   ┌──
                                    │   │    │  │   │
                                    0V  └─── ┘  └───┘  └──
                                    |--- T --|
                                </pre>
                            </div>
                            <p className="simple-explanation">
                                This creates a square wave pattern. T is the period (time for one complete cycle).
                                At 10 mph, the disk spins slowly, so T is relatively long (maybe 0.2 seconds).
                            </p>
                        </div>

                        <div className="scenario-box">
                            <h6 className="scenario-title">(3) Wind at 100 mph</h6>
                            <p>The disk spins VERY fast! The pattern changes much more quickly.</p>
                            <div className="waveform-display">
                                <pre className="waveform-visual">3V ┐┐┐┐┐┐┐┐
                                    ││││││││
                                    0V┘└┘└┘└┘└
                                    |T|</pre>
                            </div>
                            <p className="simple-explanation">
                                Same square wave, but now the changes happen much faster! T is very short (maybe 0.02 seconds).
                                The faster the wind, the faster the pattern repeats.
                            </p>
                        </div>

                        <div className="key-insight">
                            <Lightbulb size={16} />
                            <span><strong>Key Point:</strong> Wind speed = Frequency of the wave. No wind = no frequency. Faster wind = higher frequency!</span>
                        </div>
                    </div>

                    <div className="concept-section">
                        <h6>💻 Part (b): What the Computer Needs to Do</h6>

                        <div className="application-item">
                            <span className="app-bullet">1.</span>
                            <div>
                                <strong>Read the Signal:</strong> The computer needs to detect if the voltage is 3V (HIGH) or 0V (LOW).
                                It uses a special circuit called an ADC (Analog-to-Digital Converter).
                            </div>
                        </div>

                        <div className="application-item">
                            <span className="app-bullet">2.</span>
                            <div>
                                <strong>Count the Changes:</strong> Every time the signal goes from LOW to HIGH (or HIGH to LOW),
                                that's one "edge". The computer counts how many edges happen in one second.
                            </div>
                        </div>

                        <div className="application-item">
                            <span className="app-bullet">3.</span>
                            <div>
                                <strong>Calculate Frequency:</strong> If there are 100 edges in 1 second, and each rotation creates 2 edges,
                                then frequency = 100/2 = 50 rotations per second (50 Hz).
                            </div>
                        </div>

                        <div className="application-item">
                            <span className="app-bullet">4.</span>
                            <div>
                                <strong>Convert to Wind Speed:</strong> Use a formula like: Wind Speed (mph) = Frequency × Calibration Factor.
                                For example: Wind Speed = 0.2 × 50 = 10 mph.
                            </div>
                        </div>

                        <div className="application-item">
                            <span className="app-bullet">5.</span>
                            <div>
                                <strong>Convert to Binary:</strong> Finally, convert the wind speed number to binary so the computer can store it.
                                Example: 10 mph = 1010₂ in binary.
                            </div>
                        </div>

                        <p className="simple-explanation">
                            <strong>Simple Summary:</strong> The computer counts how fast the disk is spinning, then uses math to figure out
                            the wind speed, and saves it as a binary number!
                        </p>
                    </div>
                </>
            );
        }

        // Problem 1-6: Largest Binary Integer
        if (problem.id === '1-6') {
            return (
                <>
                    <div className="concept-section">
                        <h6>🎯 What Does This Mean?</h6>
                        <p className="simple-explanation">
                            Imagine you have a row of light switches. Each switch can be either ON (1) or OFF (0).
                            The question is: what's the biggest number you can make when ALL switches are turned ON?
                        </p>
                        <p className="simple-explanation">
                            For example, with 3 switches: 111 (all ON) = 7, which is bigger than 110 (6), 101 (5), or any other combination.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>🔢 The Magic Formula</h6>
                        <div className="formula-display">
                            <strong>Formula: Largest number with n bits = 2ⁿ - 1</strong>
                        </div>
                        <p className="simple-explanation">
                            Why? Because with n bits, you can represent 2ⁿ different numbers (from 0 to 2ⁿ-1).
                            The largest is 2ⁿ-1 because we start counting from 0!
                        </p>
                        <p className="simple-explanation">
                            Example: With 3 bits, you can represent 2³ = 8 different numbers (0, 1, 2, 3, 4, 5, 6, 7).
                            The largest is 7, which equals 2³ - 1.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (a): 11 bits</h6>

                        <div className="binary-visual">
                            <strong>All 11 switches ON:</strong>
                            <div className="binary-display">11111111111</div>
                        </div>

                        <div className="calculation-steps">
                            <strong>Method 1 - Using the Formula:</strong>
                            <div className="calc-step">2¹¹ - 1</div>
                            <div className="calc-step">= 2,048 - 1</div>
                            <div className="calc-step">= 2,047</div>
                        </div>

                        <div className="calculation-steps">
                            <strong>Method 2 - Adding Place Values:</strong>
                            <div className="calc-step">2¹⁰ + 2⁹ + 2⁸ + 2⁷ + 2⁶ + 2⁵ + 2⁴ + 2³ + 2² + 2¹ + 2⁰</div>
                            <div className="calc-step">= 1024 + 512 + 256 + 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1</div>
                            <div className="calc-step">= 2,047</div>
                        </div>

                        <div className="answer-highlight">
                            <strong>Answer:</strong> <code>2,047</code>
                        </div>

                        <p className="simple-explanation">
                            This makes sense! With 11 bits, we can represent 2,048 different values (0 through 2,047).
                            The largest is 2,047.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📊 Part (b): 25 bits</h6>

                        <div className="binary-visual">
                            <strong>All 25 switches ON:</strong>
                            <div className="binary-display">1111111111111111111111111</div>
                        </div>

                        <div className="calculation-steps">
                            <strong>Using the Formula:</strong>
                            <div className="calc-step">2²⁵ - 1</div>
                            <div className="calc-step">= 33,554,432 - 1</div>
                            <div className="calc-step">= 33,554,431</div>
                        </div>

                        <div className="calculation-steps">
                            <strong>Breaking down 2²⁵:</strong>
                            <div className="calc-step">2²⁵ = 2²⁰ × 2⁵</div>
                            <div className="calc-step">= 1,048,576 × 32</div>
                            <div className="calc-step">= 33,554,432</div>
                        </div>

                        <div className="answer-highlight">
                            <strong>Answer:</strong> <code>33,554,431</code>
                        </div>

                        <p className="simple-explanation">
                            That's about 33.5 million! This could represent 33.5 million different memory addresses in a computer.
                        </p>
                    </div>

                    <div className="concept-section">
                        <h6>📌 Quick Reference</h6>
                        <div className="reference-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Bits</th>
                                        <th>Largest Number</th>
                                        <th>Formula</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>8</td>
                                        <td>255</td>
                                        <td>2⁸ - 1</td>
                                    </tr>
                                    <tr>
                                        <td>16</td>
                                        <td>65,535</td>
                                        <td>2¹⁶ - 1</td>
                                    </tr>
                                    <tr>
                                        <td>32</td>
                                        <td>4,294,967,295</td>
                                        <td>2³² - 1</td>
                                    </tr>
                                    <tr>
                                        <td>64</td>
                                        <td>18,446,744,073,709,551,615</td>
                                        <td>2⁶⁴ - 1</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="key-takeaway">
                        <h6>💡 Remember This!</h6>
                        <p className="simple-explanation">
                            More bits = bigger numbers! That's why modern computers use 64-bit systems - they can handle
                            MUCH larger numbers than old 32-bit systems.
                        </p>
                        <p className="simple-explanation">
                            <strong>The Formula:</strong> Just calculate 2ⁿ - 1 where n is the number of bits. Easy!
                        </p>
                    </div>
                </>
            );
        }

        // Default explanation for other problems
        return (
            <>
                <div className="concept-section">
                    <h6>📖 Understanding the Problem</h6>
                    <p className="simple-explanation">
                        This problem deals with {problem.category.toLowerCase()}. Let me break down the solution step by step.
                    </p>
                </div>

                <div className="concept-section">
                    <h6>✍️ Step-by-Step Solution</h6>
                    <p className="simple-explanation">
                        {problem.shortAnswer}
                    </p>
                </div>

                <div className="concept-section">
                    <h6>🔍 Detailed Breakdown</h6>
                    <p className="simple-explanation">
                        {getProblemExplanation(problem.id)}
                    </p>
                </div>

                <div className="key-takeaway">
                    <h6>💡 Key Takeaway</h6>
                    <p className="simple-explanation">
                        {getKeyTakeaway(problem.id)}
                    </p>
                </div>
            </>
        );
    }

    function getProblemExplanation(id) {
        const explanations = {
            '1-2': 'We convert temperature to voltage using V = (T + 40)/10, then quantize that voltage to an 8-bit digital value (0-255), and finally convert to binary. Each temperature goes through: Temperature → Voltage → Decimal → Binary.',
            '1-3': 'Convert each decimal number to binary, octal, and hex. Binary uses base-2 (0,1), octal uses base-8 (0-7), and hexadecimal uses base-16 (0-9,A-F). Group binary digits by 3 for octal or by 4 for hex.',
            '1-4': 'In computers, K=2¹⁰=1,024 and M=2²⁰=1,048,576 (NOT 1,000 and 1,000,000!). So 128K = 128 × 1,024 and 32M = 32 × 1,048,576. Express as powers of 2 for exact values.',
            '1-5': '1 TB = 2⁴⁰ bytes = 2⁴⁰ × 8 bits = 2⁴³ bits. This is about 8.8 trillion bits! Note: Marketing uses decimal (10¹²) but computers use binary (2⁴⁰).',
            '1-7': 'For each binary number, multiply each bit by its place value (powers of 2). For decimals: 2⁻¹=0.5, 2⁻²=0.25, 2⁻³=0.125, etc. Add all values together.',
            '1-8': 'Divide decimal by 2 repeatedly, recording remainders. Read remainders from bottom to top to get binary. Example: 187÷2=93r1, 93÷2=46r1, etc.',
            '1-9': 'Convert between any bases using binary as intermediate. Decimal→Binary: divide by 2. Binary→Octal: group by 3. Binary→Hex: group by 4. Each direction has its own method.',
            '1-10': 'For integer part: divide by target base, read remainders backward. For fraction: multiply by target base, read integer parts forward. Some fractions repeat infinitely!',
            '1-11': 'Convert from source base to binary first, then from binary to target base. Octal→Binary: each digit becomes 3 bits. Hex→Binary: each digit becomes 4 bits.',
            '1-12': 'Binary multiplication works like decimal: multiply each bit, shift left for each position, then add. Can verify by converting to decimal first.',
            '1-13': 'Binary division like long division: see how many times divisor fits into dividend. Subtract and bring down next bit. Remainder is whats left over.',
            '1-14': 'Base 12 uses dozen=12, gross=144, great gross=1,728. Convert like any base: multiply digit by its position value and sum. 6 gross = 6×144 = 864.',
            '1-15': 'Base 20 uses digits 0-9 and A-J (where J=19). Convert using positional notation: multiply each digit by 20ⁿ where n is position from right.',
            '1-16': 'Set up equation using positional notation, then solve for r. Example: BEE in base r = 11r² + 14r + 14 = 2699. Solve quadratic or test values.',
            '1-17': 'Translate equation to base 10, solve for r. Since r=total toes and chickens have 2 feet, divide r by 2 to get toes per foot.',
            '1-18': 'BCD (Binary Coded Decimal) represents each decimal digit as 4 bits. Convert BCD to decimal first, then to pure binary. Example: 0100 1000 = 48₁₀ = 110000₂.',
            '1-19': 'Split decimal into individual digits, convert each to 4-bit binary. Example: 715 → 7=0111, 1=0001, 5=0101 → 0111 0001 0101.',
            '1-20': 'Use shift-right algorithm: shift BCD right, subtract 0011 from any BCD decade >0111. Repeat until done. Read result from left.',
            '1-21': 'Use shift-left algorithm: shift binary left, add 0011 to any BCD decade >0100. Repeat for all bits. Result is BCD.',
            '1-22': 'Bit 5 (counting from 0) controls case in ASCII. Uppercase has bit 5=0, lowercase has bit 5=1. Toggle with XOR 32 (0x20).',
            '1-23': 'Parity bit makes total number of 1s even (even parity) or odd (odd parity). Count 1s in 7-bit ASCII, set 8th bit accordingly.',
            '1-24': 'Convert each 7-bit pattern to decimal, look up ASCII character. Example: 1000111=71=G, 1101111=111=o, etc.',
            '1-25': 'Same number, 4 representations: (a) pure binary (b) BCD (each digit separate) (c) ASCII (character encoding) (d) ASCII with parity.',
            '1-26': 'Unicode code points: U+0040=@, U+00A2=¢, U+20AC=€ (euro), U+1F6B2=🚲 (bicycle emoji). UTF-8 encoding uses 1-4 bytes.',
            '1-27': 'Gray code: only 1 bit changes between consecutive numbers. Generate by: copy binary MSB, XOR each adjacent pair for remaining bits. Add parity bit.',
            '1-28': 'Apply Gray code algorithm to hex digits 0-F. Pattern: 0,1,3,2,6,7,5,4,C,D,F,E,A,B,9,8. Each adjacent pair differs by 1 bit.',
            '1-29': 'Gray code prevents large errors during transitions. If sensor reads between positions, error is only ±45° (1 bit) vs ±180° (multiple bits) with binary.',
            '1-30': 'Gray code uses slightly MORE power than binary (not less) due to completing full cycle. Advantage is error reduction, not power savings. For n bits: power ≈ (1+1/2ⁿ)×binary.',
        };
        return explanations[id] || 'Follow the solution method shown above. Practice makes perfect!';
    }

    function getKeyTakeaway(id) {
        const takeaways = {
            '1-2': 'Temperature sensors convert physical measurements to digital values through: Physical → Analog Voltage → Digital Value → Binary. This is how all digital sensors work!',
            '1-3': 'Binary, octal, and hex are all related. Octal groups bits by 3, hex groups by 4. They\'re just different ways to write the same number!',
            '1-4': 'Computer memory uses binary prefixes: K=1,024 (not 1,000), M=1,048,576 (not 1,000,000). Always use powers of 2!',
            '1-5': '1 TB is HUGE: 8.8 trillion bits! That\'s why storage and memory specifications matter.',
            '1-7': 'Binary fractions work like decimal but with powers of 2: 2⁻¹=½, 2⁻²=¼, 2⁻³=⅛. Add them up!',
            '1-8': 'To convert decimal to binary: divide by 2, record remainders, read backwards. Simple but powerful!',
            '1-9': 'All number bases are connected through binary. Binary is the bridge between any two bases.',
            '1-10': 'Integer: divide and read backwards. Fraction: multiply and read forwards. Some fractions never end!',
            '1-11': 'Use binary as a stepping stone: Source → Binary → Target. Much easier than direct conversion!',
            '1-12': 'Binary multiplication is just like decimal, but simpler since you only multiply by 0 or 1!',
            '1-13': 'Binary division works like long division. The key is knowing your binary multiplication!',
            '1-14': 'Any base works the same way: multiply each digit by base^position. Base 12 is called dozenal!',
            '1-15': 'Base 20 (vigesimal) was used by Mayans. Same principles as any base: positional notation.',
            '1-16': 'Work backwards from the equation to find the base. Use algebra to solve for r.',
            '1-17': 'Cute problem! Convert to decimal, solve equation, find r, then divide by feet to get toes per foot.',
            '1-18': 'BCD stores each decimal digit separately in binary. Less efficient but easier for humans to read!',
            '1-19': 'BCD is simple: split number into digits, convert each digit to 4-bit binary. 7→0111, 1→0001, 5→0101.',
            '1-20': 'Algorithms make conversion systematic. Shift-right for BCD→binary, shift-left for binary→BCD.',
            '1-21': 'These shift algorithms are what computers actually use internally. Understanding them helps you understand computers!',
            '1-22': 'ASCII was designed cleverly: uppercase and lowercase differ by just 1 bit (bit 5). Easy case conversion!',
            '1-23': 'Parity bits detect errors. If one bit flips, parity changes and we know there\'s an error!',
            '1-24': 'Every character has a number (ASCII code). Computers store text as numbers!',
            '1-25': 'One number, many representations. Each serves a different purpose: binary (computer), BCD (display), ASCII (text).',
            '1-26': 'Unicode represents all world languages plus emojis. UTF-8 encoding is variable-length (1-4 bytes).',
            '1-27': 'Gray code is brilliant: only 1 bit changes between consecutive numbers. Prevents errors in encoders!',
            '1-28': 'Gray code exists for any base. The pattern ensures minimal change between adjacent values.',
            '1-29': 'Real-world application: Gray code in position encoders prevents reading errors. One wrong bit = small error, not huge error!',
            '1-30': 'Gray code trades slightly higher power for much better error prevention. Worth it in critical applications!',
        };
        return takeaways[id] || 'Understanding number systems is fundamental to computer science. Keep practicing!';
    }
};

export default ProblemSolver;