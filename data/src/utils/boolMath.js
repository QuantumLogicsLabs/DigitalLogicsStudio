export const parseSOP = (expression) => {
  if (!expression) return [];
  const expr = expression.replace(/^F\s*=\s*/, '').trim();
  return expr.split('+').map(t => {
    const trimmed = t.trim();
    const lits = [];
    let i = 0;
    while (i < trimmed.length) {
      const ch = trimmed[i];
      if (ch === ' ') {
        i++;
        continue;
      }
      const neg = (i + 1 < trimmed.length && trimmed[i + 1] === "'");
      lits.push({ v: ch.toUpperCase(), n: neg });
      i += neg ? 2 : 1;
    }
    return lits;
  }).filter(term => term.length > 0);
};

const matchesTerm = (term, assign) => {
  for (const lit of term) {
    const val = !!assign[lit.v];
    if (lit.n ? val !== false : val !== true) {
      return false;
    }
  }
  return true;
};

export const evaluateSOP = (terms, assign) => {
  for (const term of terms) {
    if (matchesTerm(term, assign)) return 1;
  }
  return 0;
};

export const generateTruthTable = (variables, expression) => {
  const terms = parseSOP(expression);
  const headers = [...variables, 'F'];
  const rows = [];
  const n = variables.length;
  const total = Math.pow(2, n);
  for (let i = 0; i < total; i++) {
    const assign = {};
    for (let b = 0; b < n; b++) {
      const bit = (i >> (n - 1 - b)) & 1;
      assign[variables[b]] = bit === 1;
    }
    const f = evaluateSOP(terms, assign);
    rows.push([...variables.map(v => assign[v] ? 1 : 0), f]);
  }
  return { headers, rows };
};
