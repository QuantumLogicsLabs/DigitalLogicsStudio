const TOPIC_OPTIONS = [
  { value: "boolean-algebra", label: "Boolean Algebra" },
  { value: "number-systems", label: "Number Systems" },
  { value: "arithmetic-circuits", label: "Arithmetic Circuits" },
  { value: "memory", label: "Memory" },
  { value: "sequential-circuits", label: "Sequential Circuits" },
];

export function topicFromPath(pathname = "") {
  const path = pathname.toLowerCase();

  if (
    path.startsWith("/boolean") ||
    path.includes("/kmap") ||
    path.includes("/gates") ||
    path.includes("/standard-forms") ||
    path.includes("/boolforge")
  ) {
    return "boolean-algebra";
  }

  if (
    path.startsWith("/number-systems") ||
    path.includes("/binary") ||
    path.includes("/bcd") ||
    path.includes("/ascii") ||
    path.includes("/bitconvertor") ||
    path.includes("/numbersystem")
  ) {
    return "number-systems";
  }

  if (
    path.startsWith("/arithmetic") ||
    path.includes("/encoder") ||
    path.includes("/decoder") ||
    path.includes("/mux") ||
    path.includes("/demux") ||
    path.includes("/parity")
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

export function topicLabel(slug) {
  return TOPIC_OPTIONS.find((topic) => topic.value === slug)?.label || "Digital Logic";
}

export { TOPIC_OPTIONS };
