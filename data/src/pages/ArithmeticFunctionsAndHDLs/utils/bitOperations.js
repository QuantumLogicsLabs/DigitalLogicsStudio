export const normalizeBits = (bin, width) => {
  const cleaned = (bin || "").replace(/[^01]/g, "");
  if (!width || width < cleaned.length) return cleaned;
  return cleaned.padStart(width, "0");
};

export const toTwosComplement = (bin, width = bin.length) => {
  const n = normalizeBits(bin, width);
  const inverted = n
    .split("")
    .map((b) => (b === "1" ? "0" : "1"))
    .join("");
  const asNumber = parseInt(inverted, 2) + 1;
  return normalizeBits(asNumber.toString(2), width);
};

export const fromTwosComplement = (bin) => {
  const cleaned = normalizeBits(bin, bin.length);
  if (cleaned === "") return 0;
  const value = parseInt(cleaned, 2);
  const msb = cleaned[0] === "1";
  if (!msb) return value;
  return value - 2 ** cleaned.length;
};
