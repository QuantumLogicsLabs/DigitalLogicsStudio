export const cleanBin = (v) =>
  (v || "").toString().trim().replace(/[^01]/g, "");

export const halfAdder = (a, b) => {
  const A = Number(cleanBin(a) || "0");
  const B = Number(cleanBin(b) || "0");
  return { sum: (A ^ B).toString(), carry: (A & B).toString() };
};

export const fullAdder = (a, b, cin) => {
  const A = Number(cleanBin(a) || "0");
  const B = Number(cleanBin(b) || "0");
  const C = Number(cleanBin(cin) || "0");
  const sum = A ^ B ^ C;
  const carry = (A & B) | (B & C) | (A & C);
  return { sum: sum.toString(), carry: carry.toString() };
};

export const binaryAdd = (a, b, cin = "0") => {
  const x = cleanBin(a);
  const y = cleanBin(b);
  const n = Math.max(x.length, y.length);
  let carry = Number(cleanBin(cin) || "0");
  let result = "";

  for (let i = 0; i < n; i++) {
    const ai = Number(x[x.length - 1 - i] || "0");
    const bi = Number(y[y.length - 1 - i] || "0");
    const { sum, carry: c } = fullAdder(
      ai.toString(),
      bi.toString(),
      carry.toString(),
    );
    result = sum + result;
    carry = Number(c);
  }

  return { sum: (carry ? "1" : "") + result, carry: carry.toString() };
};

export const binarySubtract = (a, b) => {
  const A = parseInt(cleanBin(a) || "0", 2);
  const B = parseInt(cleanBin(b) || "0", 2);
  const diff = A - B;
  return {
    diff: (diff < 0 ? "-" : "") + Math.abs(diff).toString(2),
    borrow: A < B ? "1" : "0",
  };
};

export const binaryMultiply = (a, b) => {
  const A = parseInt(cleanBin(a) || "0", 2);
  const B = parseInt(cleanBin(b) || "0", 2);
  return (A * B).toString(2);
};

export const compareMagnitude = (a, b) => {
  const A = parseInt(cleanBin(a) || "0", 2);
  const B = parseInt(cleanBin(b) || "0", 2);
  if (A > B) return "A > B";
  if (A < B) return "A < B";
  return "A = B";
};

export const parity = (s, type) => {
  const bits = cleanBin(s).split("").map(Number);
  const total = bits.reduce((sum, bit) => sum + bit, 0);
  return type === "even"
    ? total % 2 === 0
      ? "even parity OK"
      : "even parity error"
    : total % 2 === 1
      ? "odd parity OK"
      : "odd parity error";
};

export const uSignedValue = (s, signed = false) => {
  const v = cleanBin(s);
  if (!v) return 0;
  const uns = parseInt(v, 2);
  if (!signed) return uns;
  const msb = v[0] === "1";
  return msb ? uns - Math.pow(2, v.length) : uns;
};
