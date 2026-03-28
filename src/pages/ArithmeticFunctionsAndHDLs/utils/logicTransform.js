export const expandToMinterms = (expr) => {
  // simple simulation for 2-var and 3-var expressions; placeholder for expansions
  if (!expr) return [];
  const lower = expr.trim().toLowerCase();
  if (lower === "a&b") return ["110"];
  if (lower === "a|b") return ["01?"]; // wildcard indicates "don't care"
  return [];
};

export const canonicalize = (expr) =>
  expr.trim().toLowerCase().replace(/\s+/g, "");
