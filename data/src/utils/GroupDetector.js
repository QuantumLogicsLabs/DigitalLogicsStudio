export const detectGroups = (grid, numVariables, mintermArray, optimizationType = 'SOP') => {
    const groups = [];
    const rows = grid.length;
    const cols = grid[0].length;
    // const grayCode2 = [0, 1];
    const grayCode4 = [0, 1, 3, 2];

    // Helper to get minterm from grid position
    const getMintermFromPosition = (row, col) => {
        if (numVariables === 2) {
            return row * 2 + col;
        } else if (numVariables === 3) {
            return row * 4 + grayCode4[col];
        } else {
            const rowCode = grayCode4[row];
            const colCode = grayCode4[col];
            return rowCode * 4 + colCode;
        }
    };

    // Helper to check if a cell contains the target value (1 for SOP, 0 for POS)
    const isTargetValue = (row, col) => {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
        const cellValue = grid[row][col];
        // For POS, we group 0s (excluding don't cares)
        // For SOP, we group 1s (including don't cares as 1s)
        if (optimizationType === 'POS') {
            return cellValue === 0;
        } else {
            return cellValue === 1 || cellValue === 'X';
        }
    };

    // Try to find groups of different sizes
    const groupSizes = [
        { rows: 4, cols: 4, size: 16 },
        { rows: 4, cols: 2, size: 8 },
        { rows: 2, cols: 4, size: 8 },
        { rows: 4, cols: 1, size: 4 },
        { rows: 1, cols: 4, size: 4 },
        { rows: 2, cols: 2, size: 4 },
        { rows: 2, cols: 1, size: 2 },
        { rows: 1, cols: 2, size: 2 },
        { rows: 1, cols: 1, size: 1 }
    ];

    // const covered = new Set();
    const usedMinterms = new Set();

    for (const { rows: gRows, cols: gCols, size } of groupSizes) {
        if (gRows > rows || gCols > cols) continue;

        for (let startRow = 0; startRow < rows; startRow++) {
            for (let startCol = 0; startCol < cols; startCol++) {
                const cells = [];
                const minterms = [];
                let allTargetValues = true;
                let hasUncovered = false;

                for (let r = 0; r < gRows; r++) {
                    for (let c = 0; c < gCols; c++) {
                        const row = (startRow + r) % rows;
                        const col = (startCol + c) % cols;

                        if (isTargetValue(row, col)) {
                            allTargetValues = true;
                        } else {
                            allTargetValues = false;
                            break;
                        }

                        const minterm = getMintermFromPosition(row, col);
                        cells.push({ row, col });
                        minterms.push(minterm);

                        if (!usedMinterms.has(minterm)) {
                            hasUncovered = true;
                        }
                    }
                    if (!allTargetValues) break;
                }

                // Only add group if it's valid and covers new minterms
                if (allTargetValues && hasUncovered && minterms.length === size) {
                    const groupId = `group-${groups.length}`;
                    groups.push({
                        id: groupId,
                        cells,
                        minterms,
                        size,
                        rows: gRows,
                        cols: gCols,
                        startRow,
                        startCol,
                        color: getGroupColor(groups.length)
                    });

                    minterms.forEach(m => usedMinterms.add(m));
                }
            }
        }
    }

    return groups;
};

const getGroupColor = (index) => {
    const colors = [
        { bg: 'rgba(59, 130, 246, 0.3)', border: 'rgba(59, 130, 246, 0.8)' },   // blue
        { bg: 'rgba(239, 68, 68, 0.3)', border: 'rgba(239, 68, 68, 0.8)' },     // red
        { bg: 'rgba(34, 197, 94, 0.3)', border: 'rgba(34, 197, 94, 0.8)' },     // green
        { bg: 'rgba(168, 85, 247, 0.3)', border: 'rgba(168, 85, 247, 0.8)' },   // purple
        { bg: 'rgba(251, 191, 36, 0.3)', border: 'rgba(251, 191, 36, 0.8)' },   // amber
        { bg: 'rgba(236, 72, 153, 0.3)', border: 'rgba(236, 72, 153, 0.8)' },   // pink
        { bg: 'rgba(14, 165, 233, 0.3)', border: 'rgba(14, 165, 233, 0.8)' },   // cyan
        { bg: 'rgba(249, 115, 22, 0.3)', border: 'rgba(249, 115, 22, 0.8)' }    // orange
    ];
    return colors[index % colors.length];
};