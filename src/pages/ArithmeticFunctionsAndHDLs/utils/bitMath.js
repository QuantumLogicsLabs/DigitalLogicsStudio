export const popcount = (bin) =>
  (bin || "")
    .replace(/[^01]/g, "")
    .split("")
    .filter((b) => b === "1").length;

export const hammingDistance = (a, b) => {
  const cleanA = (a || "").replace(/[^01]/g, "");
  const cleanB = (b || "").replace(/[^01]/g, "");
  const n = Math.max(cleanA.length, cleanB.length);
  let dist = 0;
  for (let i = 0; i < n; i += 1) {
    if ((cleanA[i] || "0") !== (cleanB[i] || "0")) dist += 1;
  }
  return dist;
};

export const isPowerOfTwo = (bin) => {
  const value = parseInt((bin || "").replace(/[^01]/g, ""), 2);
  return !!value && (value & (value - 1)) === 0;
};
