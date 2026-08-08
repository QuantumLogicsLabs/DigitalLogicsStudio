export const afhdlPages = [
  {
    path: "/arithmetic/binary-adders",
    label: "Binary Adders",
    short: "Adders",
    description: "Half adder, full adder, ripple carry, and carry look-ahead.",
  },
  {
    path: "/arithmetic/binary-subtractor",
    label: "Binary Subtractor",
    short: "Subtractor",
    description: "Borrow flow and two's complement subtraction.",
  },
  {
    path: "/arithmetic/binary-add-subtractor",
    label: "Adder / Subtractor",
    short: "Add/Sub",
    description: "One circuit that switches between addition and subtraction.",
  },
  {
    path: "/arithmetic/binary-multipliers",
    label: "Binary Multipliers",
    short: "Multiply",
    description: "Shift-and-add multiplication with partial products.",
  },
  {
    path: "/arithmetic/code-conversion",
    label: "Code Conversion",
    short: "Convert",
    description: "Translate binary values into decimal and hexadecimal.",
  },
  {
    path: "/arithmetic/magnitude-comparator",
    label: "Magnitude Comparator",
    short: "Compare",
    description: "Check whether A is greater than, smaller than, or equal to B.",
  },
  {
    path: "/arithmetic/parity-generators",
    label: "Parity Generators",
    short: "Parity",
    description: "Simple error-detection using even and odd parity.",
  },
  {
    path: "/arithmetic/complements",
    label: "Complements",
    short: "Complements",
    description: "Build 1's and 2's complements for signed arithmetic.",
  },
  {
    path: "/arithmetic/signed-unsigned",
    label: "Signed & Unsigned",
    short: "Signed",
    description: "Interpret the same bits in two different number systems.",
  },
  {
    path: "/arithmetic/design-applications",
    label: "Design Applications",
    short: "Applications",
    description: "Connect the arithmetic building blocks to real digital systems.",
  },
];

export const AFHDL_PATH_TO_SUBTOPIC_ID = {
  "/arithmetic/binary-adders": "binary-adders",
  "/arithmetic/binary-subtractor": "binary-subtractor",
  "/arithmetic/binary-add-subtractor": "adder-subtractor",
  "/arithmetic/binary-multipliers": "binary-multipliers",
  "/arithmetic/code-conversion": "code-conversion",
  "/arithmetic/magnitude-comparator": "magnitude-comparator",
  "/arithmetic/parity-generators": "parity-generators",
  "/arithmetic/complements": "complements",
  "/arithmetic/signed-unsigned": "signed-unsigned",
  "/arithmetic/design-applications": "design-applications",
};

export const AFHDL_TOPIC = {
  id: "arithmetic-functions-and-hdls",
  title: "ARITHMETIC FUNCTIONS AND HDLS",
  links: Object.values(AFHDL_PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};
