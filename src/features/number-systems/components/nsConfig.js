export const nsPages = [
  {
    path: "/number-systems/binary-representation",
    label: "Binary Representation",
    short: "Binary",
    description: "How integers are stored as sequences of 0s and 1s.",
  },
  {
    path: "/number-systems/number-conversion",
    label: "Number Conversion",
    short: "Conversion",
    description: "Convert freely between binary, octal, decimal, and hex.",
  },
  {
    path: "/number-systems/bit-extension",
    label: "Bit Extension",
    short: "Extension",
    description: "Sign-extend or zero-extend values to wider bit widths.",
  },
  {
    path: "/number-systems/bcd-notation",
    label: "BCD Notation",
    short: "BCD",
    description: "Binary Coded Decimal: each digit encoded in 4 bits.",
  },
  {
    path: "/number-systems/ascii-notation",
    label: "ASCII Notation",
    short: "ASCII",
    description: "The 7-bit character encoding behind every text string.",
  },
  {
    path: "/number-systems/bit-converter",
    label: "Bit Converter",
    short: "Converter",
    description: "Convert storage units across bits, bytes, and binary prefixes.",
  },
  {
    path: "/number-systems/calculator",
    label: "Number System Calculator",
    short: "Calculator",
    description: "Arithmetic operations across all number bases.",
  },
];

export const NS_PATH_TO_SUBTOPIC_ID = {
  "/number-systems/binary-representation": "binary-visualizer",
  "/number-systems/number-conversion": "base-converter",
  "/number-systems/bit-extension": "bit-extension",
  "/number-systems/bcd-notation": "bcd",
  "/number-systems/ascii-notation": "ascii",
  "/number-systems/bit-converter": "bit-converter",
  "/number-systems/calculator": "calculator",
};

export const NS_LEGACY_SUBTOPIC_ALIASES = {
  "binary-representation": "binary-visualizer",
  "number-conversion": "base-converter",
  "bcd-notation": "bcd",
  "ascii-notation": "ascii",
};

export const NS_TOPIC = {
  id: "number-systems",
  title: "NUMBER SYSTEMS",
  links: Object.values(NS_PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
  subtopicAliases: NS_LEGACY_SUBTOPIC_ALIASES,
};

export const NS_DEFAULT_HIGHLIGHTS = {
  "Binary Representation": [
    {
      title: "Signed formats",
      text: "Compare signed magnitude, two's complement, and unsigned ranges in one workspace.",
    },
    {
      title: "Live ranges",
      text: "Change bit width and see limits update immediately.",
    },
    {
      title: "Reference tables",
      text: "Open compact charts when you need a quick encoding check.",
    },
  ],
  "Number Conversion": [
    {
      title: "Four bases",
      text: "Decimal, binary, octal, and hexadecimal stay synced as you type.",
    },
    {
      title: "Fraction support",
      text: "Convert whole numbers and fractional values with consistent precision.",
    },
    {
      title: "Learning mode",
      text: "Use quick conversion prompts to reinforce the pattern behind each base.",
    },
  ],
  "Bit Extension": [
    {
      title: "Signed vs unsigned",
      text: "Switch between sign extension and zero extension without changing screens.",
    },
    {
      title: "Width checks",
      text: "Target bit widths are validated before the result is shown.",
    },
    {
      title: "Bit-by-bit reasoning",
      text: "The explanation keeps the original and extended forms visible together.",
    },
  ],
  "BCD Notation": [
    {
      title: "Digit groups",
      text: "Every decimal digit is encoded into its own 4-bit group.",
    },
    {
      title: "Boundary clarity",
      text: "The full BCD word keeps digit boundaries visible for easier decoding.",
    },
    {
      title: "Instant table",
      text: "Input any non-negative integer and review each digit row.",
    },
  ],
  "ASCII Notation": [
    {
      title: "Character rows",
      text: "Each typed character becomes decimal, hex, and binary output.",
    },
    {
      title: "7-bit context",
      text: "See how classic ASCII fits inside the byte-sized representation.",
    },
    {
      title: "Input freedom",
      text: "Words, spaces, and phrases are handled in one live table.",
    },
  ],
  "Bit Converter": [
    {
      title: "Storage units",
      text: "Move between bits, bytes, and binary prefixes with precision.",
    },
    {
      title: "Reference table",
      text: "Reveal the full unit ladder only when you need the details.",
    },
    {
      title: "Readable output",
      text: "Large values are formatted for quick scanning.",
    },
  ],
  "NS Calculator": [
    {
      title: "Base arithmetic",
      text: "Run addition, subtraction, multiplication, and division across common bases.",
    },
    {
      title: "Signed binary",
      text: "Choose two's complement or signed magnitude for binary operations.",
    },
    {
      title: "Column visualizer",
      text: "Carry and borrow rows make the calculation path easier to inspect.",
    },
  ],
};
