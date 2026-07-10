import React, { useState } from "react";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";

const INSTRUCTION_DATABASE = [
    {
        id: "sub",
        instruction: "SUB",
        category: "Arithmetic",
        function: "Subtract Source from Destination",
        difficulty: "Beginner",
        syntax: "SUB destination, source",
        description: "Subtracts the source operand from the destination operand and stores the result in the destination.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "ZF, SF, CF, OF, AF, PF",
        examples: "SUB AX, BX ; AX = AX - BX\nSUB CX, 5 ; CX = CX - 5",
        commonMistakes: "Cannot subtract memory from memory directly (e.g., SUB [SI], [DI] is invalid)."
    },
    {
        id: "add",
        instruction: "ADD",
        category: "Arithmetic",
        function: "Add Destination and Source",
        difficulty: "Beginner",
        syntax: "ADD destination, source",
        description: "Adds the source operand to the destination operand and stores the result in the destination.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "ZF, SF, CF, OF, AF, PF",
        examples: "ADD AX, BX ; AX = AX + BX\nADD DX, 10 ; DX = DX + 10",
        commonMistakes: "Destination cannot be an immediate constant (e.g., ADD 5, AX is invalid)."
    },
    {
        id: "inc",
        instruction: "INC",
        category: "Arithmetic",
        function: "Increment Destination by 1",
        difficulty: "Beginner",
        syntax: "INC destination",
        description: "Adds 1 to the destination operand. Note that it does NOT affect the Carry Flag (CF).",
        operands: "Register, Memory",
        affectedFlags: "ZF, SF, OF, AF, PF (CF is NOT affected)",
        examples: "INC AX ; AX = AX + 1\nINC BYTE PTR [BX] ; Explicit size pointer required for memory counters",
        commonMistakes: "INC cannot be used directly on immediate values (e.g., INC 5 is invalid). Forgetting memory size pointer (e.g., INC [BX]) will fail to compile."
    },
    {
        id: "mov",
        instruction: "MOV",
        category: "Data Transfer",
        function: "Move / Copy Data",
        difficulty: "Beginner",
        syntax: "MOV destination, source",
        description: "Copies the data from the source operand into the destination operand. The source value remains unchanged.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "None",
        examples: "MOV AX, BX ; Copy BX into AX\nMOV CX, 0x0F ; Load immediate hex value into CX",
        commonMistakes: "Cannot move data directly from memory to memory (e.g., MOV [BX], [SI] is invalid). CS and IP registers cannot be targeted directly."
    },
    {
        id: "cmp",
        instruction: "CMP",
        category: "Arithmetic",
        function: "Compare Operands",
        difficulty: "Beginner",
        syntax: "CMP destination, source",
        description: "Compares destination and source by subtracting source from destination. It modifies status flags but does NOT store the arithmetic result.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "ZF, SF, CF, OF, AF, PF",
        examples: "CMP AX, BX ; Modifies flags based on AX - BX\nCMP CX, 0  ; Checks if CX is zero",
        commonMistakes: "Often confused with SUB; remember that CMP leaves the original value of the destination completely untouched."
    },
    {
        id: "push",
        instruction: "PUSH",
        category: "Data Transfer",
        function: "Push Word onto Stack",
        difficulty: "Intermediate",
        syntax: "PUSH source",
        description: "Decrements the Stack Pointer (SP) by 2 (in 16-bit) and copies the source operand onto the top of the stack.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "None",
        examples: "PUSH AX ; Push contents of AX to stack\nPUSH 10 ; Push immediate value onto stack",
        commonMistakes: "Cannot push an 8-bit register alone (e.g., PUSH AL is invalid). Stack operations must match word size."
    },
    {
        id: "pop",
        instruction: "POP",
        category: "Data Transfer",
        function: "Pop Word from Stack",
        difficulty: "Intermediate",
        syntax: "POP destination",
        description: "Copies the word from the top of the stack into the destination operand, then increments the Stack Pointer (SP) by 2.",
        operands: "Register, Memory",
        affectedFlags: "None",
        examples: "POP AX ; Restore AX from top of stack\nPOP [BX] ; Pop top of stack into memory pointer",
        commonMistakes: "Cannot pop into an immediate value or the CS (Code Segment) register directly."
    },
    {
        id: "and",
        instruction: "AND",
        category: "Logical / Shift",
        function: "Bitwise AND",
        difficulty: "Beginner",
        syntax: "AND destination, source",
        description: "Performs a bitwise logical AND operation between destination and source, storing the output in the destination.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "ZF, SF, PF (CF and OF are cleared to 0)",
        examples: "AND AX, 0x0F ; Clear upper nibble of AX\nAND BX, CX   ; Bitwise AND of BX and CX",
        commonMistakes: "Clears CF and OF automatically, which might break pending conditional jumps depending on carry states."
    },
    {
        id: "or",
        instruction: "OR",
        category: "Logical / Shift",
        function: "Bitwise Inclusive OR",
        difficulty: "Beginner",
        syntax: "OR destination, source",
        description: "Performs a bitwise logical inclusive OR operation between destination and source, storing the result in the destination.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "ZF, SF, PF (CF and OF are cleared to 0)",
        examples: "OR AX, 1 ; Set the lowest bit of AX\nOR BX, CX ; Bitwise OR of BX and CX",
        commonMistakes: "Like AND, it resets CF and OF back to 0, which can interfere with condition testing loops if not anticipated."
    },
    {
        id: "xor",
        instruction: "XOR",
        category: "Logical / Shift",
        function: "Bitwise Exclusive OR",
        difficulty: "Beginner",
        syntax: "XOR destination, source",
        description: "Performs a bitwise logical exclusive OR operation between destination and source. Identical bits result in 0, differing bits result in 1.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "ZF, SF, PF (CF and OF are cleared to 0)",
        examples: "XOR AX, AX ; Clears AX efficiently to 0\nXOR BX, 0xFFFF ; Inverts all bits of BX",
        commonMistakes: "Using XOR AX, AX is a great optimization trick, but don't forget it alters the Zero Flag (ZF) to 1, unlike a MOV AX, 0 instruction."
    },
    {
        id: "not",
        instruction: "NOT",
        category: "Logical / Shift",
        function: "Bitwise One's Complement",
        difficulty: "Beginner",
        syntax: "NOT destination",
        description: "Inverts all bits of the destination operand (0s become 1s, and 1s become 0s).",
        operands: "Register, Memory",
        affectedFlags: "None",
        examples: "NOT AX ; Invert all bits inside AX\nNOT BYTE PTR [BX] ; Complement memory byte values",
        commonMistakes: "Unlike NEG (Two's Complement), the NOT instruction has absolutely no effect on any CPU flags."
    },
    {
        id: "shl",
        instruction: "SHL",
        category: "Logical / Shift",
        function: "Shift Left Logical",
        difficulty: "Intermediate",
        syntax: "SHL destination, count",
        description: "Shifts bits of the destination operand to the left by 'count' times. Vacated bits are filled with 0. The last bit shifted out is stored in the Carry Flag.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "CF, ZF, SF, PF, OF (OF is modified for 1-bit shifts only)",
        examples: "SHL AX, 1 ; Multiply AX by 2\nSHL BX, CL ; Shift BX by value in CL",
        commonMistakes: "In older 8086/80186 x86 processors, count must be either 1 or the CL register."
    },
    {
        id: "sal",
        instruction: "SAL",
        category: "Logical / Shift",
        function: "Shift Left Arithmetic",
        difficulty: "Intermediate",
        syntax: "SAL destination, count",
        description: "Shifts bits to the left. In x86, SAL and SHL perform the exact same operation at the binary level, sharing identical opcodes and internal circuitry.",
        operands: "Register, Memory, Immediate",
        affectedFlags: "CF, ZF, SF, PF, OF (OF is modified for 1-bit shifts only)",
        examples: "SAL AX, 1 ; Shifts AX left by 1",
        commonMistakes: "Logically identical to SHL, but often confused with SAR (Shift Right, which preserves the sign bit)."
    },
    {
        id: "jmp",
        instruction: "JMP",
        category: "Control Transfer",
        function: "Unconditional Jump",
        difficulty: "Intermediate",
        syntax: "JMP target",
        description: "Unconditionally transfers control (jumps) to the specified target address, register pointer, or label by modifying the Instruction Pointer (IP/EIP).",
        operands: "Label, Register, Memory",
        affectedFlags: "None",
        examples: "JMP MY_LOOP ; Direct jump to label\nJMP AX ; Indirect jump to address inside AX",
        commonMistakes: "Jumping too far across segments requires a FAR jump variant; regular short/near jumps have distance limitations."
    },
    {
        id: "call",
        instruction: "CALL",
        category: "Control Transfer",
        function: "Call Procedure / Subroutine",
        difficulty: "Advanced",
        syntax: "CALL target",
        description: "Pushes the current return address (IP) onto the Stack and then jumps to the target procedure or pointer address.",
        operands: "Procedure Label, Register, Memory",
        affectedFlags: "None",
        examples: "CALL MY_FUNC ; Direct call to subroutine\nCALL SI ; Indirect call through pointer register",
        commonMistakes: "Forgetting to put a 'RET' instruction at the end of the called procedure will cause the processor to continue executing subsequent memory sequential code, corrupting the execution flow."
    },
    {
        id: "ret",
        instruction: "RET",
        category: "Control Transfer",
        function: "Return from Procedure",
        difficulty: "Advanced",
        syntax: "RET",
        description: "Pops the return address from the top of the stack back into the Instruction Pointer (IP), resuming execution directly after the corresponding CALL instruction.",
        operands: "None (or optional immediate byte pop count)",
        affectedFlags: "None",
        examples: "RET ; Simple pop IP return\nRET 4 ; Pop return address and clean up 4 bytes of parameters from stack",
        commonMistakes: "If stack values pushed during the subroutine aren't popped out beforehand, RET will pull junk data into the Instruction Pointer, crashing execution."
    }
];

const COMPARISON_DATA = {
    inc_add: {
        title: "INC vs ADD destination, 1",
        metric: "Flag Preservation Difference",
        desc1: "INC AX adds 1 to the register but leaves the Carry Flag (CF) completely untouched, preserving its previous state.",
        desc2: "ADD AX, 1 performs standard addition and will reset or set the Carry Flag (CF) based on whether an unsigned overflow occurs.",
        verdict: "Use INC inside loops when you want to increment counters without breaking conditional jumps (like JC or JNC) that rely on the Carry Flag."
    },
    shl_sal: {
        title: "SHL vs SAL",
        metric: "Binary Execution Identity",
        desc1: "SHL (Shift Left Logical) is semantic shorthand for unsigned numbers, shifting zeroes into the lowest-order positions.",
        desc2: "SAL (Shift Left Arithmetic) is semantic shorthand for signed numbers. It performs the exact same mechanical operation as SHL, meaning the sign bit is shifted out regardless.",
        verdict: "The assembler supports both mnemonics to help engineers document intended math logic. Mechanically and structurally, they map to identical machine code instructions and hardware execution units."
    },
    jmp_call: {
        title: "JMP vs CALL",
        metric: "Control Transfer & Stack Flow",
        desc1: "JMP simply overwrites the Instruction Pointer (IP) to change execution paths. It does not track execution history.",
        desc2: "CALL pushes the current return address onto the Stack before updating the Instruction Pointer, enabling a safe return path.",
        verdict: "Use JMP for infinite loops, loop structures, and localized conditional branches; use CALL for modular, reusable functions and procedures."
    },
    mov_pushpop: {
        title: "MOV vs PUSH/POP",
        metric: "Direct Copying vs Stack Memory",
        desc1: "MOV copies data directly between registers or memory locations without altering stack structures or pointer registers.",
        desc2: "PUSH and POP explicitly interact with Stack Memory, reducing or increasing the Stack Pointer (SP) by 2 bytes with every operation.",
        verdict: "Use MOV for general variable assignments and quick data copying; use PUSH/POP to temporarily preserve register states before calling functions."
    },
    and_xor: {
        title: "AND vs XOR",
        metric: "Bit Masking vs Register Clearing",
        desc1: "AND performs logical multiplication bit-by-bit, commonly used as a 'mask' to turn specific bits off or isolate them.",
        desc2: "XOR performs exclusive OR logic. Executing 'XOR AX, AX' cancels all matching bits, clearing the entire register to 0.",
        verdict: "While both clear the Carry Flag, 'XOR AX, AX' is a highly optimized x86 idiom that executes faster and uses fewer machine bytes than 'MOV AX, 0'."
    }

};


function InstructionLaboratoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");
    const [selectedInstruction, setSelectedInstruction] = useState(INSTRUCTION_DATABASE[0]);

    const [showDemo, setShowDemo] = useState(false);
    const [regAX, setRegAX] = useState("10");
    const [regBX, setRegBX] = useState("5");
    const [regCX, setRegCX] = useState("0"); // 👈 Add this
    const [regDX, setRegDX] = useState("0"); // 👈 Add this
    const [simOutput, setSimOutput] = useState(null);
    const [isHex, setIsHex] = useState(false);

    // NEW STATE: Tracks active tab inside the comparison panel
    const [activeCompareTab, setActiveCompareTab] = useState("inc_add");

    // START: Hex & Dec formatter utilities (YAHAN DALNA HAI 🌟)
    const formatValue = (val) => {
        const num = parseInt(val, 10) || 0;
        return isHex ? `0x${num.toString(16).toUpperCase()}` : num.toString(10);
    };

    const parseInputValue = (val) => {
        if (typeof val === "string" && val.startsWith("0x")) {
            return parseInt(val.substring(2), 16) || 0;
        }
        return parseInt(val, 10) || 0;
    };

    const filteredInstructions = INSTRUCTION_DATABASE.filter((item) => {
        const matchesSearch = item.instruction.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.function.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === "All" || item.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const runSimulation = () => {
        const valAX = parseInt(regAX, 10) || 0;
        const valBX = parseInt(regBX, 10) || 0;
        const valCX = parseInt(regCX, 10) || 0;
        const valDX = parseInt(regDX, 10) || 0;
        let finalAX = valAX;
        let finalBX = valBX;
        let finalCX = valCX;
        let finalDX = valDX;
        let explanation = "";

        // Flags update behavior tracking variables
        let modifyFlags = true;
        let forceCFZero = false;

        if (selectedInstruction.id === "sub") {
            finalAX = valAX - valBX;
            explanation = `Executed: SUB AX, BX. Traced math operation: ${valAX} - ${valBX} = ${finalAX}. The original contents of AX have been overwritten.`;
        } else if (selectedInstruction.id === "add") {
            finalAX = valAX + valBX;
            explanation = `Executed: ADD AX, BX. Traced math operation: ${valAX} + ${valBX} = ${finalAX}.`;
        } else if (selectedInstruction.id === "inc") {
            finalAX = valAX + 1;
            explanation = `Executed: INC AX. Added 1 to destination contents: ${valAX} + 1 = ${finalAX}.`;
            // Note: INC changes ZF and SF, but physically NEVER affects the Carry Flag (CF) in x86 hardware.
        } else if (selectedInstruction.id === "mov") {
            finalAX = valBX; // BX ki value AX me copy ho gayi
            explanation = `Executed: MOV AX, BX. Copied the value of BX (${valBX}) into AX. Register BX remains unchanged, and data transfer does not alter any flags.`;
            modifyFlags = false; // MOV flags ko change nahi karta
        } else if (selectedInstruction.id === "cmp") {
            const cmpResult = valAX - valBX; // Calculation temporary hoti hai
            explanation = `Executed: CMP AX, BX. Subtracted BX (${valBX}) from AX (${valAX}) internally. Flags updated based on result (${cmpResult}), but AX value remains untouched as ${valAX}.`;
            // Flags update honge based on subtraction result, temporary value update karenge parameters ke liye
            finalAX = cmpResult;
        } else if (selectedInstruction.id === "push") {
            explanation = `Executed: PUSH AX. Decremented the Stack Pointer (SP) by 2 and pushed the value of AX (${valAX}) onto the top of the stack storage.`;
            modifyFlags = false; // Stack push leaves flags unaffected
        } else if (selectedInstruction.id === "pop") {
            finalAX = 42; // Stack se generic mock value pop karwa di
            explanation = `Executed: POP AX. Pulled the top value from the Stack Frame (simulated as 42) into AX, then incremented the Stack Pointer (SP) by 2.`;
            modifyFlags = false;
        } else if (selectedInstruction.id === "and") {
            finalAX = valAX & valBX;
            explanation = `Executed: AND AX, BX. Performed bitwise logical AND. Only bits that are 1 in both registers remain 1. New value is ${finalAX}.`;
            forceCFZero = true; // Logical operations always clear CF and OF
        } else if (selectedInstruction.id === "or") {
            finalAX = valAX | valBX;
            explanation = `Executed: OR AX, BX. Performed bitwise inclusive OR. Bits are set to 1 if they are 1 in either register. New value is ${finalAX}.`;
            forceCFZero = true;
        } else if (selectedInstruction.id === "xor") {
            finalAX = valAX ^ valBX;
            explanation = `Executed: XOR AX, BX. Performed bitwise exclusive OR. Identical bits cancel out to 0; differing bits set to 1. New value is ${finalAX}.`;
            forceCFZero = true;
        } else if (selectedInstruction.id === "not") {
            finalAX = ~valAX;
            explanation = `Executed: NOT AX. Performed bitwise inversion (One's Complement) on AX. All 0s flipped to 1s and vice versa. Result is ${finalAX}.`;
            modifyFlags = false; // NOT instruction does not modify any flags
        }
        // ////////////////////////////////////////////////////////
        // START: Fixed SHL/SAL to use Register CX as the shift count
        else if (selectedInstruction.id === "shl") {
            const shiftCount = valCX; // Asal assembly me shift count CX (CL) se aata hai
            finalAX = valAX << shiftCount;
            explanation = `Executed: SHL AX, CL. Shifted AX bits left by ${shiftCount} positions using the count from Register CX. New value is ${finalAX}.`;
        } else if (selectedInstruction.id === "sal") {
            const shiftCount = valCX;
            finalAX = valAX << shiftCount;
            explanation = `Executed: SAL AX, CL. Shifted AX bits arithmetically left by ${shiftCount} positions using the count from Register CX. New value is ${finalAX}.`;
            // END: Fixed SHL/SAL to use Register CX as the shift count
            // ////////////////////////////////////////////////////////
        } else if (selectedInstruction.id === "jmp") {
            explanation = `Executed: JMP MY_LOOP. The Instruction Pointer (IP) was updated to 'MY_LOOP'. Registers AX (${valAX}) and BX (${valBX}) remain unchanged.`;
            modifyFlags = false;
        } else if (selectedInstruction.id === "call") {
            explanation = `Executed: CALL MY_FUNC. Pushed return sequential address onto the Stack, then updated IP to 'MY_FUNC'. Registers are untouched.`;
            modifyFlags = false;
        } else if (selectedInstruction.id === "ret") {
            explanation = `Executed: RET. Popped the return address from the top of the stack back into the Instruction Pointer (IP), resuming workflow.`;
            modifyFlags = false;
        }

        // Flags logic block calculation
        let flags;
        if (!modifyFlags) {
            // Agar instruction flags change nahi karti (jaise MOV, NOT, PUSH, POP, JMP, CALL, RET)
            flags = {
                ZF: "0 (Unchanged)",
                SF: "0 (Unchanged)",
                CF: "0 (Unchanged)"
            };
        } else {
            flags = {
                ZF: finalAX === 0 ? "1 (Active)" : "0 (Clear)",
                SF: finalAX < 0 ? "1 (Negative)" : "0 (Positive)",
                CF: forceCFZero
                    ? "0 (Cleared)"
                    : (selectedInstruction.id === "inc" ? "0 (Unaffected)" : (finalAX < 0 || finalAX > 255 ? "1 (Triggered)" : "0 (Normal)"))
            };
        }

        // CMP ke case mein graphical UI pe AX ki real value revert karne ke liye check
        const displayAX = selectedInstruction.id === "cmp" ? valAX : finalAX;
        setSimOutput({ finalAX: displayAX, finalBX, finalCX, finalDX, flags, explanation });
    };

    const currentCompare = COMPARISON_DATA[activeCompareTab];

    return (
        <div style={{ padding: "40px", color: "#f3f4f6", background: "#0b0f19", minHeight: "100vh", fontFamily: "sans-serif" }}>

            {/* 1. NAVBAR ADDED HERE */}
            <Navbar />

            {/* HEADER SECTION */}
            <div style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 10px 0", color: "#ffffff" }}>
                    Instruction Laboratory
                </h1>
                <p style={{ color: "#9ca3af", margin: "0 0 20px 0", fontSize: "15px" }}>A complete searchable database for interactive x86 architectures.</p>

                {/* GLOBAL BACK NAVIGATION BUTTON */}
                <button
                    onClick={() => window.history.back()}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                        color: "#fff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                        transition: "all 0.2s ease"
                    }}
                >
                    ← Back to Practical
                </button>
            </div> {/* End of HEADER SECTION */}

            {/* MAIN TWO-COLUMN SPLIT GRID */}
            <div style={{ display: "flex", gap: "30px", alignItems: "flex-start", marginBottom: "40px" }}>

                {/* LEFT COLUMN (60%) */}
                <div style={{ flex: "3", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", gap: "15px", background: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "#9ca3af" }}>Search Fields</label>
                            <input
                                type="text"
                                placeholder="Type opcode or action..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setShowDemo(false); setSimOutput(null); }}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", background: "#111827", color: "#fff", boxSizing: "border-box" }}
                            />
                        </div>
                        <div style={{ width: "160px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "#9ca3af" }}>Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => { setSelectedCategory(e.target.value); setShowDemo(false); setSimOutput(null); }}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", background: "#111827", color: "#fff" }}
                            >
                                <option value="All">All Categories</option>
                                <option value="Arithmetic">Arithmetic</option>
                                <option value="Data Transfer">Data Transfer</option>
                                <option value="Logical / Shift">Logical / Shift</option>
                                <option value="Control Transfer">Control Transfer</option>
                            </select>
                        </div>
                        <div style={{ width: "160px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "#9ca3af" }}>Difficulty</label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => { setSelectedDifficulty(e.target.value); setShowDemo(false); setSimOutput(null); }}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", background: "#111827", color: "#fff" }}
                            >
                                <option value="All">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            maxHeight: "65vh",       // Box screen ke 65% se bada nahi hoga
                            overflowY: "auto",       // Commands zyada hone par khud scrollbar aa jayega
                            paddingRight: "8px"      // Scrollbar text ke upar na chade
                        }}
                    >

                        <h3 style={{ margin: "5px 0", fontSize: "16px", color: "#9ca3af" }}>Search Results ({filteredInstructions.length})</h3>
                        {filteredInstructions.map((item) => {
                            const isSelected = selectedInstruction?.id === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => { setSelectedInstruction(item); setShowDemo(false); setSimOutput(null); }}
                                    style={{
                                        background: isSelected ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.02)",
                                        padding: "20px",
                                        borderRadius: "10px",
                                        border: isSelected ? "1px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.05)",
                                        cursor: "pointer"
                                    }}
                                >
                                    <div style={{ float: "right", display: "flex", gap: "8px" }}>
                                        <span style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af", padding: "3px 8px", borderRadius: "5px", fontSize: "11px" }}>{item.difficulty}</span>
                                        <span style={{ background: "#10b981", color: "#064e3b", padding: "3px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: "700" }}>{item.category}</span>
                                    </div>
                                    {/*<h2 style={{ margin: "0 0 6px 0", fontSize: "20px", color: isSelected ? "#60a5fa" : "#fff" }}>{item.instruction}</h2>*/}
                                    {/*  Corrected Line */}
                                    <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "700", color: isSelected ? "#60a5fa" : "#ffffff" }}>
                                        {item.instruction}
                                    </h2>
                                    <p style={{ margin: "0", color: "#9ca3af", fontSize: "14px" }}>{item.function}</p>
                                </div>
                            );
                        })}
                    </div>
                </div> {/* End of LEFT COLUMN */}

                {/* RIGHT COLUMN: SANDBOX PANEL (40%) */}
                <div style={{ flex: "2", position: "sticky", top: "40px", background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)", padding: "25px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(12px)" }}>
                    {selectedInstruction && (
                        <div>
                            {!showDemo ? (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
                                        <h2 style={{ margin: 0, fontSize: "28px", color: "#3b82f6" }}>{selectedInstruction.instruction}</h2>
                                        <span style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>{selectedInstruction.syntax}</span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                        <div>
                                            <h4 style={{ margin: "0 0 4px 0", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>Description</h4>
                                            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#d1d5db" }}>{selectedInstruction.description}</p>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                            <div>
                                                <h4 style={{ margin: "0 0 4px 0", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>Valid Operands</h4>
                                                <p style={{ margin: 0, fontSize: "14px", color: "#f3f4f6" }}>{selectedInstruction.operands}</p>
                                            </div>
                                            <div>
                                                <h4 style={{ margin: "0 0 4px 0", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>Affected Flags</h4>
                                                <p style={{ margin: 0, fontSize: "14px", color: "#f43f5e", fontWeight: "600" }}>{selectedInstruction.affectedFlags}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 style={{ margin: "0 0 4px 0", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>Code Examples</h4>
                                            <pre style={{ margin: 0, padding: "12px", background: "#030712", borderRadius: "6px", color: "#34d399", fontFamily: "monospace", fontSize: "13px" }}>{selectedInstruction.examples}</pre>
                                        </div>
                                        <div>
                                            <h4 style={{ margin: "0 0 4px 0", color: "#ef4444", fontSize: "12px", textTransform: "uppercase" }}>Common Pitfalls</h4>
                                            <p style={{ margin: 0, fontSize: "13px", color: "#fca5a5", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>{selectedInstruction.commonMistakes}</p>
                                        </div>
                                        <button onClick={() => setShowDemo(true)} style={{ marginTop: "10px", width: "100%", padding: "12px", borderRadius: "8px", background: "linear-gradient(90deg, #3b82f6, #2563eb)", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer" }}>
                                            Launch Live Demonstration →
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
                                        <h2 style={{ margin: 0, fontSize: "22px", color: "#10b981" }}>⚡ Live Sandbox: {selectedInstruction.instruction}</h2>
                                        {/* //////////////////////////////////////////////////////// */}
                                        {/* START: Hex vs Dec Toggle Switch UI */}
                                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                                            <div style={{ display: "inline-flex", background: "#111827", padding: "4px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                                                <button
                                                    onClick={() => setIsHex(false)}
                                                    style={{ padding: "6px 12px", borderRadius: "6px", border: "none", background: !isHex ? "#3b82f6" : "transparent", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                                                >
                                                    DEC
                                                </button>
                                                <button
                                                    onClick={() => setIsHex(true)}
                                                    style={{ padding: "6px 12px", borderRadius: "6px", border: "none", background: isHex ? "#3b82f6" : "transparent", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                                                >
                                                    HEX
                                                </button>
                                            </div>
                                        </div>
                                        {/* END: Hex vs Dec Toggle Switch UI */}
                                        {/* //////////////////////////////////////////////////////// */}
                                        <button onClick={() => { setShowDemo(false); setSimOutput(null); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#9ca3af", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>← Back</button>
                                    </div>
                                    {/* UPDATED REGISTER INPUTS: DISPLAYING ALL 4 COAL REGISTERS */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#9ca3af" }}>Register AX</label>
                                            <input type="number" value={regAX} onChange={(e) => setRegAX(e.target.value)} style={{ width: "100%", padding: "10px", background: "#111827", border: "1px solid #1e293b", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }} />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#9ca3af" }}>Register BX</label>
                                            <input type="number" value={regBX} onChange={(e) => setRegBX(e.target.value)} style={{ width: "100%", padding: "10px", background: "#111827", border: "1px solid #1e293b", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }} />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#9ca3af" }}>Register CX</label>
                                            <input type="number" value={regCX} onChange={(e) => setRegCX(e.target.value)} style={{ width: "100%", padding: "10px", background: "#111827", border: "1px solid #1e293b", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }} />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#9ca3af" }}>Register DX</label>
                                            <input type="number" value={regDX} onChange={(e) => setRegDX(e.target.value)} style={{ width: "100%", padding: "10px", background: "#111827", border: "1px solid #1e293b", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }} />
                                        </div>
                                    </div>
                                    <div style={{ background: "#030712", padding: "12px", borderRadius: "6px", fontFamily: "monospace", color: "#60a5fa", marginBottom: "20px", border: "1px solid #1e293b" }}>
                                        {selectedInstruction.id === "inc"
                                            ? `INC AX`
                                            : (selectedInstruction.id === "shl" || selectedInstruction.id === "sal")
                                                ? `${selectedInstruction.instruction} AX, CL`
                                                : `${selectedInstruction.instruction} AX, BX`
                                        }
                                    </div>
                                    <button onClick={runSimulation} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#10b981", border: "none", color: "#064e3b", fontWeight: "700", cursor: "pointer", marginBottom: "20px" }}>Execute Instruction 🚀</button>

                                    {simOutput && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                            <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#9ca3af", textTransform: "uppercase" }}>Register Changes</h4>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px", fontFamily: "monospace" }}>
                                                    {/* START: Updated Dynamic Output formatting */}
                                                    <div>AX: <span style={{ color: "#34d399", fontWeight: "bold" }}>{formatValue(simOutput.finalAX)}</span></div>
                                                    <div>BX: <span style={{ color: "#cbd5e1" }}>{formatValue(simOutput.finalBX)}</span></div>
                                                    <div>CX: <span style={{ color: "#cbd5e1" }}>{formatValue(simOutput.finalCX)}</span></div>
                                                    <div>DX: <span style={{ color: "#cbd5e1" }}>{formatValue(simOutput.finalDX)}</span></div>
                                                    {/* END: Updated Dynamic Output formatting */}
                                                </div>
                                            </div>
                                            <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#9ca3af", textTransform: "uppercase" }}>Status Flag Changes</h4>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "13px", fontFamily: "monospace" }}>
                                                    <div>ZF: <span style={{ color: simOutput.flags.ZF.startsWith("1") ? "#f43f5e" : "#9ca3af" }}>{simOutput.flags.ZF}</span></div>
                                                    <div>SF: <span style={{ color: simOutput.flags.SF.startsWith("1") ? "#f43f5e" : "#9ca3af" }}>{simOutput.flags.SF}</span></div>
                                                    <div>CF: <span style={{ color: simOutput.flags.CF.startsWith("1") ? "#f43f5e" : "#9ca3af" }}>{simOutput.flags.CF}</span></div>
                                                </div>
                                            </div>
                                            <div style={{ background: "rgba(59, 130, 246, 0.05)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(59, 130, 246, 0.15)" }}>
                                                <h4 style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#60a5fa", textTransform: "uppercase" }}>Step Explanation</h4>
                                                <p style={{ margin: 0, fontSize: "13px", color: "#d1d5db", lineHeight: "1.4" }}>{simOutput.explanation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div> {/* End of RIGHT COLUMN */}
            </div> {/* End of MAIN TWO-COLUMN SPLIT GRID */}


            {/* ─── NEW FEATURE: INSTRUCTION COMPARISON HUB ─── */}
            <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <h2 style={{ margin: "0 0 20px 0", fontSize: "22px", color: "#fff" }}>📋 Architectural Comparison Hub</h2>

                {/* TAB SWITCHERS */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid #1e293b", paddingBottom: "15px" }}>
                    <button onClick={() => setActiveCompareTab("inc_add")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: activeCompareTab === "inc_add" ? "#3b82f6" : "#1e293b", color: "#fff", cursor: "pointer", fontWeight: "600" }}>INC vs ADD 1</button>
                    <button onClick={() => setActiveCompareTab("shl_sal")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: activeCompareTab === "shl_sal" ? "#3b82f6" : "#1e293b", color: "#fff", cursor: "pointer", fontWeight: "600" }}>SHL vs SAL</button>
                    <button onClick={() => setActiveCompareTab("jmp_call")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: activeCompareTab === "jmp_call" ? "#3b82f6" : "#1e293b", color: "#fff", cursor: "pointer", fontWeight: "600" }}>JMP vs CALL</button>
                    <button onClick={() => setActiveCompareTab("mov_pushpop")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: activeCompareTab === "mov_pushpop" ? "#3b82f6" : "#1e293b", color: "#fff", cursor: "pointer", fontWeight: "600" }}>MOV vs PUSH/POP</button>
                    <button onClick={() => setActiveCompareTab("and_xor")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: activeCompareTab === "and_xor" ? "#3b82f6" : "#1e293b", color: "#fff", cursor: "pointer", fontWeight: "600" }}>AND vs XOR</button>
                </div> {/* End of TAB SWITCHERS */}

                {/* COMPARISON RESULTS VIEWER CONTAINER */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>

                    <div style={{ background: "#0f172a", padding: "20px", borderRadius: "10px", border: "1px solid #1e293b" }}>
                        <h3 style={{ margin: "0 0 10px 0", color: "#60a5fa", fontSize: "16px" }}>{currentCompare.title.split(" vs ")[0]}</h3>
                        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#cbd5e1" }}>{currentCompare.desc1}</p>
                    </div>

                    <div style={{ background: "#0f172a", padding: "20px", borderRadius: "10px", border: "1px solid #1e293b" }}>
                        <h3 style={{ margin: "0 0 10px 0", color: "#a78bfa", fontSize: "16px" }}>{currentCompare.title.split(" vs ")[1]}</h3>
                        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#cbd5e1" }}>{currentCompare.desc2}</p>
                    </div>

                    <div style={{ gridColumn: "1 / -1", background: "rgba(16, 185, 129, 0.04)", padding: "15px 20px", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                        <strong style={{ color: "#10b981", display: "block", fontSize: "12px", textTransform: "uppercase", marginBottom: "4px" }}>Core Architectural Verdict ({currentCompare.metric})</strong>
                        <p style={{ margin: 0, fontSize: "14px", color: "#d1d5db" }}>{currentCompare.verdict}</p>
                    </div>

                </div> {/* End of COMPARISON RESULTS VIEWER CONTAINER */}

            </div> {/* End of INSTRUCTION COMPARISON HUB */}

            {/* 2. FOOTER ADDED HERE (Right before global page container closing div) */}
            <Footer />

        </div> /* End of Global Page Container */
    );
}

export default InstructionLaboratoryPage;