export const arithmeticDescriptions = {
  adders:
    "Adders combine binary values with carry propagation. Half adders compute one bit and carry out; full adders chain these with carry in. CLA is a speed optimization for large n-bit adders.",
  subtractor:
    "Binary subtraction is implemented using borrow logic or 2's complement. Here we show the brute force difference with borrow and highlight how negative results can be represented.",
  addSub:
    "A single adder hardware block can serve as both addition and subtraction by XORing B with mode bit and using mode as carry-in (2's complement method).",
  multiplier:
    "Multiply by shifting and adding partial products. In hardware each bit of multiplier selects a shifted version of multiplicand.",
  conversion:
    "Conversion between binary/decimal/hex helps fluency in digital design and debugging values in logic circuits.",
  comparator:
    "Comparators tell you if A > B, A < B, or A = B. They are essential for branch conditions and conditional operations in CPUs.",
  parity:
    "Parity is a lightweight error-detect mechanism. Even/odd parity provides single-bit error detection with minimal hardware.",
  applications:
    "These building blocks are the foundation of ALU, processor cores, memory checks, and communication links. Practice with a few worked-case applications.",
  complements:
    "1's complement flips bits; 2's complement adds one. This is how negative numbers are commonly encoded in digital computers.",
  signedUnsigned:
    "Unsigned and signed arithmetic differ in range and overflow behavior. Understanding both helps you design safe ALU control paths.",
  helperTools:
    "Use modular components (cards, badges, toggle, info panels) to structure interactive teaching pages cleanly. Good UI blocks also help explain step-by-step solutions and debugging tips.",
};
