import { validateCircuit } from "./circuitProblemValidator";
import problemsData from "../pages/Problems/ProblemsData";

const halfAdderProblem = {
  inputs: ["A", "B"],
  outputs: ["S", "C"],
  truthTable: [
    { A: 0, B: 0, S: 0, C: 0 },
    { A: 0, B: 1, S: 1, C: 0 },
    { A: 1, B: 0, S: 1, C: 0 },
    { A: 1, B: 1, S: 0, C: 1 },
  ],
};

const validHalfAdderGates = [
  { id: 1, type: "INPUT", label: "A", inputValues: [false] },
  { id: 2, type: "INPUT", label: "B", inputValues: [false] },
  { id: 3, type: "XOR", label: "XOR1" },
  { id: 4, type: "AND", label: "AND1" },
  { id: 5, type: "OUTPUT", label: "S" },
  { id: 6, type: "OUTPUT", label: "C" },
];

const validHalfAdderWires = [
  { fromId: 1, toId: 3, toIndex: 0 },
  { fromId: 2, toId: 3, toIndex: 1 },
  { fromId: 1, toId: 4, toIndex: 0 },
  { fromId: 2, toId: 4, toIndex: 1 },
  { fromId: 3, toId: 5, toIndex: 0 },
  { fromId: 4, toId: 6, toIndex: 0 },
];

test("passes for a functionally correct half adder", () => {
  const result = validateCircuit(
    validHalfAdderGates,
    validHalfAdderWires,
    halfAdderProblem,
  );

  expect(result.pass).toBe(true);
  expect(result.rows).toHaveLength(4);
  expect(result.rows.every((row) => row.pass)).toBe(true);
});

test("fails when the sum output is wired incorrectly", () => {
  const incorrectWires = validHalfAdderWires.map((wire) =>
    wire.toId === 5 ? { ...wire, fromId: 4 } : wire,
  );

  const result = validateCircuit(
    validHalfAdderGates,
    incorrectWires,
    halfAdderProblem,
  );

  expect(result.pass).toBe(false);
  expect(result.rows.some((row) => !row.pass)).toBe(true);
});

test("passes for a functionally correct 3-bit even parity generator", () => {
  const problem31 = problemsData.find((p) => p.id === 31);
  const gates = [
    { id: 1, type: "INPUT", label: "A", inputValues: [false] },
    { id: 2, type: "INPUT", label: "B", inputValues: [false] },
    { id: 3, type: "INPUT", label: "C", inputValues: [false] },
    { id: 4, type: "XOR", label: "XOR1" },
    { id: 5, type: "XOR", label: "XOR2" },
    { id: 6, type: "OUTPUT", label: "P" },
  ];
  const wires = [
    { fromId: 1, toId: 4, toIndex: 0 },
    { fromId: 2, toId: 4, toIndex: 1 },
    { fromId: 4, toId: 5, toIndex: 0 },
    { fromId: 3, toId: 5, toIndex: 1 },
    { fromId: 5, toId: 6, toIndex: 0 },
  ];

  const result = validateCircuit(gates, wires, problem31);
  expect(result.pass).toBe(true);
});
