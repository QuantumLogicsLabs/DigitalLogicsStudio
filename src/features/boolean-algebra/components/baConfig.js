export const baPages = [
  {
    path: "/boolean/overview",
    label: "Boolean Algebra",
    short: "Overview",
    description:
      "What Boolean algebra is and why it powers every digital circuit.",
  },
  {
    path: "/boolean/identities",
    label: "Boolean Identities",
    short: "Identities",
    description: "Idempotent, identity, domination, complementarity, and more.",
  },
  {
    path: "/boolean/laws",
    label: "Boolean Laws",
    short: "Laws",
    description:
      "Commutative, associative, distributive, absorption, De Morgan.",
  },
  {
    path: "/boolean/complement",
    label: "Complement",
    short: "Complement",
    description:
      "Complementing single variables and entire Boolean expressions.",
  },
  {
    path: "/boolean/duality",
    label: "Duality Principle",
    short: "Duality",
    description:
      "Swap operators and identity values — every identity has a dual.",
  },
  {
    path: "/boolean/consensus",
    label: "Consensus Theorem",
    short: "Consensus",
    description: "Eliminate redundant terms using the consensus theorem.",
  },
  {
    path: "/boolean/minterms",
    label: "Minterms",
    short: "Minterms",
    description: "Sum of products: every row of a truth table as a minterm.",
  },
  {
    path: "/boolean/maxterms",
    label: "Maxterms",
    short: "Maxterms",
    description: "Product of sums: the dual representation of minterms.",
  },
  {
    path: "/boolean/minterms-maxterms",
    label: "Minterms & Maxterms",
    short: "Min/Max",
    description: "How minterms and maxterms relate and complement each other.",
  },
  {
    path: "/boolean/significant-digits",
    label: "Significant Digits",
    short: "Sig. Digits",
    description: "Count significant figures, MSD, and LSD for any number.",
  },
];

export const BA_PATH_TO_SUBTOPIC_ID = {
  "/boolean/overview": "overview",
  "/boolean/identities": "identities",
  "/boolean/laws": "laws",
  "/boolean/duality": "duality",
  "/boolean/consensus": "consensus",
  "/boolean/complement": "complement",
  "/boolean/minterms": "minterms",
  "/boolean/maxterms": "maxterms",
  "/boolean/minterms-maxterms": "relation",
  "/boolean/significant-digits": "significant-digits",
};

export const BA_TOPIC = {
  id: "boolean-algebra",
  title: "BOOLEAN ALGEBRA",
  links: Object.values(BA_PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};
