import { cleanBin } from "../../utils/arithmeticHelpers";

export const isBinary = (s) => /^(0|1)+$/.test(cleanBin(s));

export const alignWidths = (...bins) => {
  const cleaned = bins.map((b) => cleanBin(b));
  const max = Math.max(...cleaned.map((b) => b.length));
  return cleaned.map((b) => b.padStart(max, "0"));
};

export const addZeros = (s, width) => cleanBin(s).padStart(width, "0");
