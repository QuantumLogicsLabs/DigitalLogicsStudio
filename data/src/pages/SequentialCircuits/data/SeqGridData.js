let SeqGridData = {
  GeneralModel: [
    {
      icon: "⚙️",
      title: "Combinational Logic",
      line: "Computes the next state and output values from current state and inputs.",
    },
    {
      icon: "💾",
      title: "Memory Elements",
      line: "Flip-flops that hold the current state between clock cycles.",
    },
    {
      icon: "🔄",
      title: "Feedback Path",
      line: "Current state feeds back into the combinational block to influence the next state.",
    },
  ],
  TypesofSequentialCircuits: [
    {
      icon: "⏱️",
      title: "Synchronous",
      line: "State changes only at clock edges. Predictable, easy to design and analyze. Used in virtually all modern digital systems.",
    },
    {
      icon: "⚡",
      title: "Asynchronous",
      line: "State changes respond immediately to inputs — no clock. Faster but prone to hazards and difficult to design correctly.",
    },
  ],
  RealWorldApplications: [
    {
      icon: "🧮",
      title: "Registers & Shift Registers",
      line: "Store and shift data in processors and communication systems.",
    },
    {
      icon: "🔢",
      title: "Counters",
      line: "Ripple, synchronous, and modulo-N counting circuits.",
    },
    {
      icon: "🧠",
      title: "FSMs — Moore & Mealy",
      line: "Control units in CPUs, communication protocols, traffic lights.",
    },
    {
      icon: "💬",
      title: "Serial Communication",
      line: "UART, SPI, I²C interfaces that send data bit-by-bit over time.",
    },
  ],
};

export default SeqGridData;
