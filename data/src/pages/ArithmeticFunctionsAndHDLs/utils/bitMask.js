export const maskBits = (bin, mask) => {
  const cleanBin = (bin || "").replace(/[^01]/g, "");
  const cleanMask = (mask || "").replace(/[^01]/g, "");
  const n = Math.max(cleanBin.length, cleanMask.length);
  let out = "";
  for (let i = 0; i < n; i += 1) {
    const b = cleanBin[i] || "0";
    const m = cleanMask[i] || "0";
    out += m === "1" ? b : "0";
  }
  return out;
};
