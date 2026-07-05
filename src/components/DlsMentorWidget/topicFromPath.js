const TOPIC_OPTIONS = [
  { value: "boolean-algebra", label: "Boolean Algebra" },
  { value: "number-systems", label: "Number Systems" },
  { value: "arithmetic-circuits", label: "Arithmetic Circuits" },
  { value: "memory", label: "Memory" },
  { value: "sequential-circuits", label: "Sequential Circuits" },
];

export function topicFromPath(pathname = "") {
  const path = pathname.toLowerCase();

  if (path.startsWith("/boolean") || path.includes("/kmap") || path.includes("boolforge")) {
    return "boolean-algebra";
  }
  if (path.startsWith("/number-systems") || path.includes("parity") || path.includes("bcd")) {
    return "number-systems";
  }
  if (
    path.startsWith("/arithmetic") ||
    path.includes("adder") ||
    path.includes("subtractor") ||
    path.includes("comparator")
  ) {
    return "arithmetic-circuits";
  }
  if (path.startsWith("/memory")) {
    return "memory";
  }
  if (path.startsWith("/sequential") || path.startsWith("/registers")) {
    return "sequential-circuits";
  }

  return "boolean-algebra";
}

export function formatTopicLabel(slug) {
  return TOPIC_OPTIONS.find((t) => t.value === slug)?.label || slug;
}

export { TOPIC_OPTIONS };
