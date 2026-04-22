// Utility to parse Boolean expression and generate circuit
export const parseExpressionToCircuit = (expression, variables) => {
    if (!expression || expression === 'F = 0' || expression === 'F = 1') {
        return { gates: [], wires: [] };
    }

    // Remove "F = " prefix
    let expr = expression.replace(/^F\s*=\s*/, '').trim();
    // Normalize explicit AND operators and remove spaces
    expr = expr.replace(/[•.*]/g, '•').replace(/\s+/g, '');

    // ── Scan which variables appear complemented in the expression ──────────────
    const complementedVars = new Set();
    for (let i = 0; i < expr.length; i++) {
        // A variable letter followed immediately by '
        if (/[A-Za-z]/.test(expr[i]) && expr[i + 1] === "'") {
            complementedVars.add(expr[i]);
        }
    }

    // Helper: split at top-level by a separator (ignoring parentheses)
    const splitTopLevel = (str, sep) => {
        const parts = [];
        let depth = 0;
        let last = 0;
        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            if (ch === '(') depth++;
            else if (ch === ')') depth = Math.max(0, depth - 1);
            else if (ch === sep && depth === 0) {
                parts.push(str.slice(last, i));
                last = i + 1;
            }
        }
        parts.push(str.slice(last));
        return parts.filter(p => p.length > 0);
    };

    const gates = [];
    const wires = [];
    let gateId = 0;
    let wireId = 0;

    // Layout constants
    const inputSpacing = 120;
    const termSpacing = 160;
    const inputStartY = 80;
    const termStartY = 80;

    // ── Create INPUT gates for each variable ────────────────────────────────────
    const inputGates = {};
    variables.forEach((variable, index) => {
        const g = {
            id: gateId++,
            type: 'INPUT',
            label: variable,
            x: 50,
            y: inputStartY + index * inputSpacing,
            inputs: 0,
            hasOutput: true,
            inputValues: [false]
        };
        gates.push(g);
        inputGates[variable] = g.id;
    });

    // ── Create NOT gates ONLY for variables that appear complemented ────────────
    const notGates = {};
    variables.forEach((variable, index) => {
        if (!complementedVars.has(variable)) return; // skip if not needed
        const g = {
            id: gateId++,
            type: 'NOT',
            label: `${variable}'`,
            x: 240,
            y: inputStartY + index * inputSpacing,
            inputs: 1,
            hasOutput: true,
            inputValues: []
        };
        gates.push(g);
        notGates[variable] = g.id;
        wires.push({ id: wireId++, fromId: inputGates[variable], toId: g.id, toIndex: 0 });
    });

    // ── X offset for AND/OR gates: further right if there are NOT gates ─────────
    const hasNotGates = complementedVars.size > 0;
    const andX = hasNotGates ? 430 : 270;
    const orX = hasNotGates ? 620 : 460;

    // ── Helper: resolve a literal token to a gate id ────────────────────────────
    const resolveToken = (token, fallbackY) => {
        if (token === '1' || token === '0') {
            const g = {
                id: gateId++, type: 'INPUT', label: token,
                x: andX, y: fallbackY, inputs: 0, hasOutput: true,
                inputValues: [token === '1']
            };
            gates.push(g);
            return g.id;
        }
        const variable = token.replace("'", "");
        const isInverted = token.endsWith("'");
        return isInverted ? notGates[variable] : inputGates[variable];
    };

    // ── Parse a product term; returns gate id of the term's output ──────────────
    const parseProduct = (term, termIndex) => {
        const termY = termStartY + termIndex * termSpacing;
        const factors = []; // each: { type:'literal'|'gate', token?, id? }

        for (let i = 0; i < term.length; i++) {
            const ch = term[i];
            if (ch === '(') {
                // parenthesised sub-expression
                let j = i + 1, depth = 1;
                while (j < term.length && depth > 0) {
                    if (term[j] === '(') depth++;
                    else if (term[j] === ')') depth--;
                    j++;
                }
                const inner = term.slice(i + 1, j - 1);
                const hasNot = j < term.length && term[j] === "'";
                let subId = buildSubExpression(inner, termIndex);
                if (hasNot) {
                    const ng = {
                        id: gateId++, type: 'NOT', label: `(${inner})'`,
                        x: andX - 80, y: termY, inputs: 1, hasOutput: true, inputValues: []
                    };
                    gates.push(ng);
                    wires.push({ id: wireId++, fromId: subId, toId: ng.id, toIndex: 0 });
                    subId = ng.id;
                    i = j; // consumed ')'
                } else {
                    i = j - 1;
                }
                factors.push({ type: 'gate', id: subId });
            } else if (ch === '•') {
                // explicit AND separator — skip
            } else {
                // variable or constant, possibly followed by '
                let token = ch;
                if (i + 1 < term.length && term[i + 1] === "'") {
                    token += "'";
                    i++;
                }
                factors.push({ type: 'literal', token });
            }
        }

        if (factors.length === 0) return null;

        // Single factor — no AND gate needed
        if (factors.length === 1) {
            const f = factors[0];
            if (f.type === 'gate') return f.id;
            return resolveToken(f.token, termY);
        }

        // Multiple factors — build a SINGLE multi-input AND gate
        const andGate = {
            id: gateId++,
            type: 'AND',
            label: `AND${termIndex}`,
            x: andX,
            y: termY,
            inputs: factors.length,   // ← multi-input
            hasOutput: true,
            inputValues: []
        };
        gates.push(andGate);

        factors.forEach((f, idx) => {
            const srcId = f.type === 'gate' ? f.id : resolveToken(f.token, termY);
            wires.push({ id: wireId++, fromId: srcId, toId: andGate.id, toIndex: idx });
        });

        return andGate.id;
    };

    // ── Build sub-expression inside parentheses (OR of product terms) ────────────
    const buildSubExpression = (inner, termIndex) => {
        const termY = termStartY + termIndex * termSpacing;
        const innerTerms = splitTopLevel(inner, '+');
        const ids = innerTerms.map(t => parseProduct(t, termIndex)).filter(Boolean);
        if (ids.length === 0) return null;
        if (ids.length === 1) return ids[0];

        // Single multi-input OR gate
        const orGate = {
            id: gateId++, type: 'OR', label: `OR${termIndex}_sub`,
            x: andX + 120, y: termY,
            inputs: ids.length, hasOutput: true, inputValues: []
        };
        gates.push(orGate);
        ids.forEach((srcId, idx) => {
            wires.push({ id: wireId++, fromId: srcId, toId: orGate.id, toIndex: idx });
        });
        return orGate.id;
    };

    // ── Parse all top-level SOP terms ───────────────────────────────────────────
    const terms = splitTopLevel(expr, '+');
    const termGateIds = [];

    terms.forEach((term, termIndex) => {
        if (term === '1') {
            const g = {
                id: gateId++, type: 'INPUT', label: '1',
                x: andX, y: termStartY + termIndex * termSpacing,
                inputs: 0, hasOutput: true, inputValues: [true]
            };
            gates.push(g);
            termGateIds.push(g.id);
            return;
        }
        if (term === '0') {
            const g = {
                id: gateId++, type: 'INPUT', label: '0',
                x: andX, y: termStartY + termIndex * termSpacing,
                inputs: 0, hasOutput: true, inputValues: [false]
            };
            gates.push(g);
            termGateIds.push(g.id);
            return;
        }
        const id = parseProduct(term, termIndex);
        if (id !== null && id !== undefined) termGateIds.push(id);
    });

    if (termGateIds.length === 0) return { gates, wires };

    // ── Combine terms with a final OR gate (if >1 term) ────────────────────────
    let outputSourceId;

    if (termGateIds.length === 1) {
        outputSourceId = termGateIds[0];
    } else {
        // Single multi-input OR gate for all top-level terms
        const centerY = termStartY + ((termGateIds.length - 1) * termSpacing) / 2;
        const finalOrGate = {
            id: gateId++,
            type: 'OR',
            label: 'OR',
            x: orX,
            y: centerY,
            inputs: termGateIds.length,   // ← multi-input
            hasOutput: true,
            inputValues: []
        };
        gates.push(finalOrGate);
        termGateIds.forEach((srcId, idx) => {
            wires.push({ id: wireId++, fromId: srcId, toId: finalOrGate.id, toIndex: idx });
        });
        outputSourceId = finalOrGate.id;
    }

    // ── Output gate ─────────────────────────────────────────────────────────────
    const outputGate = {
        id: gateId++,
        type: 'OUTPUT',
        label: 'Z',
        x: orX + 200,
        y: termStartY + ((termGateIds.length - 1) * termSpacing) / 2,
        inputs: 1,
        hasOutput: false,
        inputValues: []
    };
    gates.push(outputGate);
    wires.push({ id: wireId++, fromId: outputSourceId, toId: outputGate.id, toIndex: 0 });

    return {
        gates,
        wires,
        gateIdCounter: gateId,
        wireIdCounter: wireId,
        inputCounter: variables.length,
        outputCounter: 1
    };
};