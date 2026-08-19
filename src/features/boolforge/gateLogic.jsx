// ─── Gate logic ───────────────────────────────────────────────────────────────
export function computeGateOutput(gate, inputs, outputIndex = 0) {
  const ci = inputs.filter((v) => v !== undefined);
  switch (gate.type) {
    case "INPUT":
      return gate.inputValues[0] || false;
    case "AND": {
      const n = gate.inputs || 2;
      let allHigh = true;
      for (let i = 0; i < n; i++)
        if (!(inputs[i] ?? false)) {
          allHigh = false;
          break;
        }
      return allHigh;
    }
    case "OR":
      return ci.some(Boolean);
    case "NOT":
      return inputs[0] !== undefined ? !inputs[0] : false;
    case "NAND": {
      const n = gate.inputs || 2;
      let allHigh = true;
      for (let i = 0; i < n; i++)
        if (!(inputs[i] ?? false)) {
          allHigh = false;
          break;
        }
      return !allHigh;
    }
    case "NOR":
      return !ci.some(Boolean);
    case "XOR":
      return ci.length >= 2 && ci.reduce((acc, v) => acc !== v, false);
    case "XNOR":
      return ci.length >= 2 && !ci.reduce((acc, v) => acc !== v, false);
    case "BUFFER":
    case "OUTPUT":
      return inputs[0] ?? false;
    case "MUX2": {
      const s = inputs[2] ?? false;
      return s ? (inputs[1] ?? false) : (inputs[0] ?? false);
    }
    case "MUX4": {
      const s0 = inputs[4] ?? false,
        s1 = inputs[5] ?? false;
      const sel = (s1 ? 2 : 0) + (s0 ? 1 : 0);
      return inputs[sel] ?? false;
    }
    case "MUX8": {
      const s0 = inputs[8] ?? false,
        s1 = inputs[9] ?? false,
        s2 = inputs[10] ?? false;
      const sel = (s2 ? 4 : 0) + (s1 ? 2 : 0) + (s0 ? 1 : 0);
      return inputs[sel] ?? false;
    }
    case "DEMUX2": {
      const d = inputs[0] ?? false,
        s = inputs[1] ?? false;
      if (outputIndex === 0) return !s && d;
      if (outputIndex === 1) return s && d;
      return false;
    }
    case "DEMUX4": {
      const d = inputs[0] ?? false,
        s0 = inputs[1] ?? false,
        s1 = inputs[2] ?? false;
      const sel = (s1 ? 2 : 0) + (s0 ? 1 : 0);
      return sel === outputIndex && d;
    }
    case "DEMUX8": {
      const d = inputs[0] ?? false,
        s0 = inputs[1] ?? false,
        s1 = inputs[2] ?? false,
        s2 = inputs[3] ?? false;
      const sel = (s2 ? 4 : 0) + (s1 ? 2 : 0) + (s0 ? 1 : 0);
      return sel === outputIndex && d;
    }
    case "ENC4": {
      let code = 0;
      for (let i = 3; i >= 0; i--) {
        if (inputs[i]) {
          code = i;
          break;
        }
      }
      return outputIndex === 0 ? Boolean(code & 2) : Boolean(code & 1);
    }
    case "ENC8": {
      let code = 0;
      for (let i = 7; i >= 0; i--) {
        if (inputs[i]) {
          code = i;
          break;
        }
      }
      return outputIndex === 0
        ? Boolean(code & 4)
        : outputIndex === 1
          ? Boolean(code & 2)
          : Boolean(code & 1);
    }
    case "DEC4": {
      const sel = ((inputs[1] ?? false) ? 2 : 0) + ((inputs[0] ?? false) ? 1 : 0);
      return sel === outputIndex;
    }
    case "DEC8": {
      const sel =
        ((inputs[2] ?? false) ? 4 : 0) +
        ((inputs[1] ?? false) ? 2 : 0) +
        ((inputs[0] ?? false) ? 1 : 0);
      return sel === outputIndex;
    }
    case "HALF_ADDER": {
      const a = inputs[0] ?? false,
        b = inputs[1] ?? false;
      return outputIndex === 0 ? a !== b : a && b;
    }
    case "FULL_ADDER": {
      const a = inputs[0] ?? false,
        b = inputs[1] ?? false,
        cin = inputs[2] ?? false;
      const sum = (a !== b) !== cin;
      const cout = (a && b) || (cin && a !== b);
      return outputIndex === 0 ? sum : cout;
    }
    case "ADD4": {
      const a = [inputs[0], inputs[1], inputs[2], inputs[3]].map((v) => v ?? false);
      const b = [inputs[4], inputs[5], inputs[6], inputs[7]].map((v) => v ?? false);
      let carry = inputs[8] ?? false;
      const sums = [];
      for (let i = 0; i < 4; i++) {
        const xor_ab = a[i] !== b[i];
        sums[i] = xor_ab !== carry;
        carry = (a[i] && b[i]) || (carry && xor_ab);
      }
      return outputIndex === 4 ? carry : sums[outputIndex];
    }
    case "CLADD4": {
      const a = [inputs[0], inputs[1], inputs[2], inputs[3]].map((v) => v ?? false);
      const b = [inputs[4], inputs[5], inputs[6], inputs[7]].map((v) => v ?? false);
      const cin = inputs[8] ?? false;
      const g = a.map((ai, i) => ai && b[i]);
      const p = a.map((ai, i) => ai !== b[i]);
      const c = [cin];
      for (let i = 0; i < 4; i++) c[i + 1] = g[i] || (p[i] && c[i]);
      const sums = p.map((pi, i) => pi !== c[i]);
      return outputIndex === 4 ? c[4] : sums[outputIndex];
    }
    case "HALF_SUBTRACTOR": {
      const a = inputs[0] ?? false,
        b = inputs[1] ?? false;
      return outputIndex === 0 ? a !== b : !a && b;
    }
    case "FULL_SUBTRACTOR": {
      const a = inputs[0] ?? false,
        b = inputs[1] ?? false,
        bin = inputs[2] ?? false;
      const diff = (a !== b) !== bin;
      const bout = (!a && b) || (!a && bin) || (b && bin);
      return outputIndex === 0 ? diff : bout;
    }
    default:
      return false;
  }
}