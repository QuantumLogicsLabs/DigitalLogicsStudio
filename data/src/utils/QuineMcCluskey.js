export class QuineMcCluskey {
    constructor(numVariables, variables) {
        this.numVariables = numVariables;
        this.variables = variables;
    }

    countOnes(binary) {
        return binary.split('').filter(b => b === '1').length;
    }

    canCombine(term1, term2) {
        let differences = 0;
        let diffPos = -1;

        for (let i = 0; i < term1.length; i++) {
            if (term1[i] !== term2[i]) {
                if (term1[i] === '-' || term2[i] === '-') return -1;
                differences++;
                diffPos = i;
            }
        }

        return differences === 1 ? diffPos : -1;
    }

    combinTerms(term1, term2, pos) {
        return term1.substring(0, pos) + '-' + term1.substring(pos + 1);
    }

    applyAbsorption(terms) {
        const result = [];

        for (let i = 0; i < terms.length; i++) {
            let absorbed = false;
            const term1 = terms[i];

            for (let j = 0; j < terms.length; j++) {
                if (i === j) continue;
                const term2 = terms[j];

                if (term2.length < term1.length) {
                    let canAbsorb = true;

                    for (let k = 0; k < term2.length; k++) {
                        const char = term2[k];
                        if (char === "'" || /[A-Z]/.test(char)) {
                            if (char === "'") {
                                if (!term1.includes(term2[k - 1] + "'")) {
                                    canAbsorb = false;
                                    break;
                                }
                            } else if (/[A-Z]/.test(char)) {
                                const nextChar = term2[k + 1];
                                if (nextChar === "'") {
                                    if (!term1.includes(char + "'")) {
                                        canAbsorb = false;
                                        break;
                                    }
                                } else {
                                    if (!term1.includes(char) || term1.includes(char + "'")) {
                                        canAbsorb = false;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (canAbsorb) {
                        absorbed = true;
                        break;
                    }
                }
            }

            if (!absorbed && !result.includes(term1)) {
                result.push(term1);
            }
        }

        return result.length > 0 ? result : terms;
    }

    binaryToAlgebraic(binary) {
        let result = '';
        for (let i = 0; i < binary.length; i++) {
            if (binary[i] === '1') {
                result += this.variables[i];
            } else if (binary[i] === '0') {
                result += this.variables[i] + "'";
            }
        }
        return result || '1';
    }

    binaryToAlgebraicPOS(binary) {
        let result = '';
        for (let i = 0; i < binary.length; i++) {
            if (binary[i] === '0') {
                result += this.variables[i];
            } else if (binary[i] === '1') {
                result += this.variables[i] + "'";
            }
        }
        return result || '0';
    }

    simplify(mintermArray, dontCareArray = []) {
        if (mintermArray.length === 0) return 'F = 0';
        if (mintermArray.length === Math.pow(2, this.numVariables)) return 'F = 1';

        // Combine minterms and don't cares for grouping, but only use minterms for final selection
        const allTerms = [...mintermArray, ...dontCareArray];
        const mintermSet = new Set(mintermArray);

        let currentGroup = allTerms.map(m => ({
            binary: m.toString(2).padStart(this.numVariables, '0'),
            minterms: [m],
            used: false,
            isDontCare: dontCareArray.includes(m)
        }));

        const allPrimeImplicants = [];

        while (true) {
            const groups = {};

            currentGroup.forEach(term => {
                const ones = this.countOnes(term.binary);
                if (!groups[ones]) groups[ones] = [];
                groups[ones].push(term);
            });

            const nextGroup = [];
            const groupKeys = Object.keys(groups).map(Number).sort((a, b) => a - b);

            for (let i = 0; i < groupKeys.length - 1; i++) {
                const currentKey = groupKeys[i];
                const nextKey = groupKeys[i + 1];

                if (nextKey - currentKey !== 1) continue;

                groups[currentKey].forEach(term1 => {
                    groups[nextKey].forEach(term2 => {
                        const pos = this.canCombine(term1.binary, term2.binary);
                        if (pos !== -1) {
                            term1.used = true;
                            term2.used = true;

                            const newBinary = this.combinTerms(term1.binary, term2.binary, pos);
                            const newMinterms = [...new Set([...term1.minterms, ...term2.minterms])].sort((a, b) => a - b);
                            const isDontCare = newMinterms.every(m => dontCareArray.includes(m));

                            const exists = nextGroup.some(t =>
                                t.binary === newBinary &&
                                JSON.stringify(t.minterms) === JSON.stringify(newMinterms)
                            );

                            if (!exists) {
                                nextGroup.push({
                                    binary: newBinary,
                                    minterms: newMinterms,
                                    used: false,
                                    isDontCare
                                });
                            }
                        }
                    });
                });
            }

            currentGroup.forEach(term => {
                if (!term.used) {
                    const exists = allPrimeImplicants.some(pi =>
                        pi.binary === term.binary &&
                        JSON.stringify(pi.minterms) === JSON.stringify(term.minterms)
                    );
                    if (!exists) {
                        allPrimeImplicants.push(term);
                    }
                }
            });

            if (nextGroup.length === 0) break;
            currentGroup = nextGroup;
        }

        // Filter out prime implicants that only cover don't cares
        const usefulPIs = allPrimeImplicants.filter(pi => 
            pi.minterms.some(m => mintermSet.has(m))
        );

        // Find essential prime implicants
        const coverage = new Map();
        mintermArray.forEach(m => coverage.set(m, []));

        usefulPIs.forEach((pi, idx) => {
            pi.minterms.forEach(m => {
                if (coverage.has(m)) {
                    coverage.get(m).push(idx);
                }
            });
        });

        const essentialPIs = new Set();
        coverage.forEach((pis, minterm) => {
            if (pis.length === 1) {
                essentialPIs.add(pis[0]);
            }
        });

        const selected = Array.from(essentialPIs).map(idx => usefulPIs[idx]);
        const coveredMinterms = new Set();
        selected.forEach(pi => {
            pi.minterms.forEach(m => coveredMinterms.add(m));
        });

        // Cover remaining minterms
        const remaining = mintermArray.filter(m => !coveredMinterms.has(m));
        if (remaining.length > 0) {
            const unusedPIs = usefulPIs.filter((_, idx) => !essentialPIs.has(idx));
            unusedPIs.sort((a, b) => b.minterms.length - a.minterms.length);

            for (const pi of unusedPIs) {
                if (pi.minterms.some(m => remaining.includes(m))) {
                    selected.push(pi);
                    pi.minterms.forEach(m => {
                        const idx = remaining.indexOf(m);
                        if (idx > -1) remaining.splice(idx, 1);
                    });
                    if (remaining.length === 0) break;
                }
            }
        }

        const algebraicTerms = selected.map(pi => this.binaryToAlgebraic(pi.binary));
        const simplifiedTerms = this.applyAbsorption(algebraicTerms);

        return 'F = ' + simplifiedTerms.join(' + ');
    }

    simplifyPOS(maxterms, dontCareArray = []) {
        if (maxterms.length === 0) return 'F = 1';
        if (maxterms.length === Math.pow(2, this.numVariables)) return 'F = 0';

        // For POS, we work with maxterms and don't cares
        const allTerms = [...maxterms, ...dontCareArray];
        const maxtermSet = new Set(maxterms);

        let currentGroup = allTerms.map(m => ({
            binary: m.toString(2).padStart(this.numVariables, '0'),
            maxterms: [m],
            used: false,
            isDontCare: dontCareArray.includes(m)
        }));

        const allPrimeImplicants = [];

        while (true) {
            const groups = {};

            currentGroup.forEach(term => {
                const ones = this.countOnes(term.binary);
                if (!groups[ones]) groups[ones] = [];
                groups[ones].push(term);
            });

            const nextGroup = [];
            const groupKeys = Object.keys(groups).map(Number).sort((a, b) => a - b);

            for (let i = 0; i < groupKeys.length - 1; i++) {
                const currentKey = groupKeys[i];
                const nextKey = groupKeys[i + 1];

                if (nextKey - currentKey !== 1) continue;

                groups[currentKey].forEach(term1 => {
                    groups[nextKey].forEach(term2 => {
                        const pos = this.canCombine(term1.binary, term2.binary);
                        if (pos !== -1) {
                            term1.used = true;
                            term2.used = true;

                            const newBinary = this.combinTerms(term1.binary, term2.binary, pos);
                            const newMaxterms = [...new Set([...term1.maxterms, ...term2.maxterms])].sort((a, b) => a - b);
                            const isDontCare = newMaxterms.every(m => dontCareArray.includes(m));

                            const exists = nextGroup.some(t =>
                                t.binary === newBinary &&
                                JSON.stringify(t.maxterms) === JSON.stringify(newMaxterms)
                            );

                            if (!exists) {
                                nextGroup.push({
                                    binary: newBinary,
                                    maxterms: newMaxterms,
                                    used: false,
                                    isDontCare
                                });
                            }
                        }
                    });
                });
            }

            currentGroup.forEach(term => {
                if (!term.used) {
                    const exists = allPrimeImplicants.some(pi =>
                        pi.binary === term.binary &&
                        JSON.stringify(pi.maxterms) === JSON.stringify(term.maxterms)
                    );
                    if (!exists) {
                        allPrimeImplicants.push(term);
                    }
                }
            });

            if (nextGroup.length === 0) break;
            currentGroup = nextGroup;
        }

        // Filter out prime implicants that only cover don't cares
        const usefulPIs = allPrimeImplicants.filter(pi => 
            pi.maxterms.some(m => maxtermSet.has(m))
        );

        // Find essential prime implicants
        const coverage = new Map();
        maxterms.forEach(m => coverage.set(m, []));

        usefulPIs.forEach((pi, idx) => {
            pi.maxterms.forEach(m => {
                if (coverage.has(m)) {
                    coverage.get(m).push(idx);
                }
            });
        });

        const essentialPIs = new Set();
        coverage.forEach((pis, maxterm) => {
            if (pis.length === 1) {
                essentialPIs.add(pis[0]);
            }
        });

        const selected = Array.from(essentialPIs).map(idx => usefulPIs[idx]);
        const coveredMaxterms = new Set();
        selected.forEach(pi => {
            pi.maxterms.forEach(m => coveredMaxterms.add(m));
        });

        // Cover remaining maxterms
        const remaining = maxterms.filter(m => !coveredMaxterms.has(m));
        if (remaining.length > 0) {
            const unusedPIs = usefulPIs.filter((_, idx) => !essentialPIs.has(idx));
            unusedPIs.sort((a, b) => b.maxterms.length - a.maxterms.length);

            for (const pi of unusedPIs) {
                if (pi.maxterms.some(m => remaining.includes(m))) {
                    selected.push(pi);
                    pi.maxterms.forEach(m => {
                        const idx = remaining.indexOf(m);
                        if (idx > -1) remaining.splice(idx, 1);
                    });
                    if (remaining.length === 0) break;
                }
            }
        }

        const algebraicTerms = selected.map(pi => this.binaryToAlgebraicPOS(pi.binary));
        const simplifiedTerms = this.applyAbsorption(algebraicTerms);

        return 'F = ' + simplifiedTerms.join(' · ');
    }
}
