export const binToDec = (bin) => {
  const cleaned = (bin || "").replace(/[^01]/g, "");
  return cleaned === "" ? "0" : parseInt(cleaned, 2).toString(10);
};

export const binToHex = (bin) => {
  const cleaned = (bin || "").replace(/[^01]/g, "");
  return cleaned === "" ? "0" : parseInt(cleaned, 2).toString(16).toUpperCase();
};

export const binToOct = (bin) => {
  const cleaned = (bin || "").replace(/[^01]/g, "");
  return cleaned === "" ? "0" : parseInt(cleaned, 2).toString(8);
};
