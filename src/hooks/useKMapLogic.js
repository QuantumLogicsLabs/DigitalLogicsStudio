import { useMemo } from 'react';
import { QuineMcCluskey } from '../utils/QuineMcCluskey';
import { detectGroups } from '../utils/GroupDetector';

export const useKMapLogic = (numVariables, variables, inputValue, dontCares = '', optimizationType = 'SOP') => {
    const inputArray = useMemo(() => {
        return inputValue
            .split(',')
            .map(m => m.trim())
            .filter(m => m !== '')
            .map(m => parseInt(m))
            .filter(m => !isNaN(m) && m >= 0 && m < Math.pow(2, numVariables));
    }, [inputValue, numVariables]);

    const dontCareArray = useMemo(() => {
        return dontCares
            .split(',')
            .map(m => m.trim())
            .filter(m => m !== '')
            .map(m => parseInt(m))
            .filter(m => !isNaN(m) && m >= 0 && m < Math.pow(2, numVariables));
    }, [dontCares, numVariables]);

    const grid = useMemo(() => {
        const rows = numVariables <= 2 ? 2 : (numVariables === 3 ? 2 : 4);
        const cols = numVariables <= 2 ? 2 : 4;
        const gridArray = Array(rows).fill(null).map(() => Array(cols).fill(0));

        // const grayCode2 = [0, 1]; // For 2 variables: 0, 1
        const grayCode4 = [0, 1, 3, 2]; // For 3-4 variables: 00, 01, 11, 10
        const inputSet = new Set(inputArray);
        const dontCareSet = new Set(dontCareArray);
        const isPOS = optimizationType === 'POS';

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let termNum;
                if (numVariables === 2) {
                    termNum = i * 2 + j;
                } else if (numVariables === 3) {
                    termNum = i * 4 + grayCode4[j];
                } else {
                    const rowCode = grayCode4[i];
                    const colCode = grayCode4[j];
                    termNum = rowCode * 4 + colCode;
                }

                if (dontCareSet.has(termNum)) {
                    gridArray[i][j] = 'X';
                } else if (isPOS) {
                    // For POS: inputted numbers are Maxterms (0s), unlisted positions are 1s
                    gridArray[i][j] = inputSet.has(termNum) ? 0 : 1;
                } else {
                    // For SOP: inputted numbers are Minterms (1s), unlisted positions are 0s
                    gridArray[i][j] = inputSet.has(termNum) ? 1 : 0;
                }
            }
        }

        return gridArray;
    }, [inputArray, dontCareArray, numVariables, optimizationType]);

    const expression = useMemo(() => {
        const isPOS = optimizationType === 'POS';
        if (inputArray.length === 0) return isPOS ? 'F = 1' : 'F = 0';
        if (inputArray.length === Math.pow(2, numVariables)) return isPOS ? 'F = 0' : 'F = 1';

        const qm = new QuineMcCluskey(numVariables, variables);
        
        if (isPOS) {
            return qm.simplifyPOS(inputArray, dontCareArray);
        } else {
            return qm.simplify(inputArray, dontCareArray);
        }
    }, [inputArray, dontCareArray, numVariables, variables, optimizationType]);

    const groups = useMemo(() => {
        if (inputArray.length === 0) return [];
        return detectGroups(grid, numVariables, inputArray, optimizationType);
    }, [grid, numVariables, inputArray, optimizationType]);

    const getColumnLabels = () => {
        if (numVariables === 2) return ['0', '1'];
        return ['00', '01', '11', '10'];
    };

    const getRowLabels = () => {
        if (numVariables <= 2) return ['0', '1'];
        if (numVariables === 3) return ['0', '1'];
        return ['00', '01', '11', '10'];
    };

    const getMintermPosition = (minterm) => {
        const grayCode4 = [0, 1, 3, 2];

        if (numVariables === 2) {
            return {
                row: Math.floor(minterm / 2),
                col: minterm % 2
            };
        } else if (numVariables === 3) {
            const row = Math.floor(minterm / 4);
            const colValue = minterm % 4;
            const col = grayCode4.indexOf(colValue);
            return { row, col };
        } else {
            const rowValue = Math.floor(minterm / 4);
            const colValue = minterm % 4;
            const row = grayCode4.indexOf(rowValue);
            const col = grayCode4.indexOf(colValue);
            return { row, col };
        }
    };

    return {
        grid,
        expression,
        groups,
        getColumnLabels,
        getRowLabels,
        getMintermPosition,
        simplifyBoolean: () => expression,
        dontCareArray,
        optimizationType
    };
};
