function evalGate(
  gate,
  gatesArray,
  wiresArray,
  depth = 0,
  visited = new Set(),
) {
  if (depth > 100 || !gate || !gate.id || visited.has(gate.id)) return false;
  if (gate.type === "INPUT") return (gate.inputValues && gate.inputValues[0]) || false;

  const newVisited = new Set(visited);
  newVisited.add(gate.id);
  const inputs = [];

  (wiresArray || []).forEach((wire) => {
    if (wire && wire.toId === gate.id) {
      const fromGate = (gatesArray || []).find((candidate) => candidate && candidate.id === wire.fromId);
      if (fromGate) {
        inputs[wire.toIndex] = evalGate(
          fromGate,
          gatesArray,
          wiresArray,
          depth + 1,
          newVisited,
        );
      }
    }
  });

  const connectedInputs = inputs.filter((value) => value !== undefined);

  switch (gate.type) {
    case "AND":
      return connectedInputs.length > 0 && connectedInputs.every(Boolean);
    case "OR":
      return connectedInputs.some(Boolean);
    case "NOT":
      return inputs[0] !== undefined ? !inputs[0] : false;
    case "NAND":
      return !(connectedInputs.length > 0 && connectedInputs.every(Boolean));
    case "NOR":
      return !connectedInputs.some(Boolean);
    case "XOR":
      return (
        connectedInputs.length >= 2 &&
        connectedInputs.reduce((accumulator, value) => accumulator !== value, false)
      );
    case "XNOR":
      return (
        connectedInputs.length >= 2 &&
        !connectedInputs.reduce((accumulator, value) => accumulator !== value, false)
      );
    case "BUFFER":
    case "OUTPUT":
      return inputs[0] ?? false;
    default:
      return false;
  }
}

function validateCircuit(gates, wires, problem, assignment = null) {
  if (!gates) gates = [];
  if (!wires) wires = [];
  if (!problem) {
    return {
      pass: false,
      rows: [],
      error: "No problem definition provided for validation.",
    };
  }

  const inputGates = gates.filter((gate) => gate && gate.type === "INPUT");
  const outputGates = gates.filter((gate) => gate && gate.type === "OUTPUT");

  const problemInputs = problem.inputs || [];
  const problemOutputs = problem.outputs || [];

  if (inputGates.length !== problemInputs.length) {
    return {
      pass: false,
      rows: [],
      error: `Circuit has ${inputGates.length} INPUT gate(s) but problem needs ${problemInputs.length}.`,
    };
  }

  if (outputGates.length !== problemOutputs.length) {
    return {
      pass: false,
      rows: [],
      error: `Circuit has ${outputGates.length} OUTPUT gate(s) but problem needs ${problemOutputs.length}.`,
    };
  }

  const tryLabelMatch = (portNames, gateList) => {
    if (!portNames || !gateList) return null;
    const matched = portNames.map((name) =>
      gateList.find((gate) => gate && gate.label === name),
    );

    return matched.every(Boolean) ? matched : null;
  };

  let orderedInputs;
  let orderedOutputs;

  if (
    assignment &&
    assignment.inputMap &&
    assignment.outputMap &&
    (Object.keys(assignment.inputMap).length > 0 ||
      Object.keys(assignment.outputMap).length > 0)
  ) {
    orderedInputs = problemInputs.map((name) =>
      gates.find((gate) => gate && gate.id === assignment.inputMap[name]),
    );
    orderedOutputs = problemOutputs.map((name) =>
      gates.find((gate) => gate && gate.id === assignment.outputMap[name]),
    );
  } else {
    orderedInputs = tryLabelMatch(problemInputs, inputGates) ?? inputGates;
    orderedOutputs = tryLabelMatch(problemOutputs, outputGates) ?? outputGates;
  }

  if (orderedInputs.some((gate) => !gate) || orderedOutputs.some((gate) => !gate)) {
    return {
      pass: false,
      rows: [],
      error: "Assignment is incomplete. Please map all inputs and outputs.",
    };
  }

  if (!problem.truthTable || !Array.isArray(problem.truthTable) || problem.truthTable.length === 0) {
    return {
      pass: false,
      rows: [],
      error: "No truth table available for automatic validation on this problem.",
    };
  }

  const rows = [];
  let allPass = true;

  for (const truthRow of problem.truthTable) {
    if (!truthRow) continue;
    const tempGates = gates.map((gate) => {
      if (!gate) return gate;
      const inputIndex = orderedInputs.findIndex(
        (inputGate) => inputGate && inputGate.id === gate.id,
      );

      if (inputIndex !== -1 && problemInputs[inputIndex] !== undefined) {
        return {
          ...gate,
          inputValues: [!!truthRow[problemInputs[inputIndex]]],
        };
      }

      return gate;
    });

    const gotValues = {};
    let rowPass = true;

    for (let outputIndex = 0; outputIndex < orderedOutputs.length; outputIndex += 1) {
      const targetOutput = orderedOutputs[outputIndex];
      if (!targetOutput) continue;
      const outGate = tempGates.find(
        (gate) => gate && gate.id === targetOutput.id,
      );
      const got = evalGate(outGate, tempGates, wires) ? 1 : 0;
      const expected = truthRow[problemOutputs[outputIndex]] !== undefined ? truthRow[problemOutputs[outputIndex]] : 0;

      gotValues[problemOutputs[outputIndex]] = got;

      if (got !== expected) {
        rowPass = false;
      }
    }

    if (!rowPass) {
      allPass = false;
    }

    rows.push({
      inputs: truthRow,
      expected: truthRow,
      got: gotValues,
      pass: rowPass,
    });
  }

  return {
    pass: allPass,
    rows,
    error: null,
  };
}

export { evalGate, validateCircuit };
