const fs = require("fs");
const path = require("path");

const folder = path.join(
  __dirname,
  "..",
  "src",
  "pages",
  "ArithmeticFunctionsAndHDLs",
);

const map = {
  "BinaryAdders.jsx": "adders",
  "BinarySubtractor.jsx": "subtractor",
  "BinaryAddSubtractor.jsx": "addSub",
  "BinaryMultipliers.jsx": "multiplier",
  "CodeConversion.jsx": "conversion",
  "MagnitudeComparator.jsx": "comparator",
  "ParityGenerators.jsx": "parity",
  "DesignApplications.jsx": "applications",
  "Complements.jsx": "complements",
  "SignedUnsignedArithmetic.jsx": "signedUnsigned",
};

const NEW_S = `const S = {
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#f8fafc",
    margin: "1.5rem 0 0.5rem",
    letterSpacing: "-0.01em",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  body: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    lineHeight: 1.7,
    margin: "0.4rem 0"
  },
  card: {
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "16px",
    padding: "1.25rem",
    marginTop: "0.75rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  formula: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "12px",
    padding: "1rem",
    fontFamily: "'Fira Code', monospace",
    fontSize: "0.85rem",
    color: "#818cf8",
    margin: "0.75rem 0",
    lineHeight: 1.6,
    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all"
  },
  codeBlock: {
    background: "#0f172a",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "12px",
    padding: "1rem",
    overflowX: "auto",
    position: "relative",
  },
  resultBanner: {
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "16px",
    padding: "1rem 1.5rem",
    margin: "1rem 0",
    backdropFilter: "blur(8px)",
  },
  tabPanel: {
    background: "rgba(30, 41, 59, 0.3)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "0 16px 16px 16px",
    padding: "1.5rem",
    minHeight: "200px",
  },
  note: (c) => ({
    background: \`\${c}08\`,
    borderLeft: \`4px solid \${c}\`,
    borderRadius: "8px",
    padding: "1rem",
    fontSize: "0.85rem",
    color: "#e2e8f0",
    lineHeight: 1.6,
    margin: "0.75rem 0",
  }),
  signalBox: (c) => ({
    background: \`\${c}05\`,
    border: \`1px solid \${c}20\`,
    borderRadius: "12px",
    padding: "0.75rem",
    textAlign: "center",
    transition: "transform 0.2s ease",
  }),
  conceptCard: (c) => ({
    background: "rgba(30, 41, 59, 0.4)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderTop: \`4px solid \${c}\`,
    borderRadius: "12px",
    padding: "1rem",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }),
  bitBtn: (bit, c) => ({
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: \`2px solid \${bit === "1" ? c : "rgba(148, 163, 184, 0.1)"}\`,
    background: bit === "1" ? \`\${c}15\` : "rgba(15, 23, 42, 0.4)",
    color: bit === "1" ? c : "#64748b",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  tabBtn: (active, c) => ({
    padding: "0.6rem 1.25rem",
    borderRadius: "10px 10px 0 0",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.875rem",
    background: active ? c : "transparent",
    color: active ? "#ffffff" : "#94a3b8",
    transition: "all 0.2s ease",
    borderBottom: active ? "none" : "1px solid rgba(148, 163, 184, 0.1)",
  }),
};`;

for (const file of Object.keys(map)) {
  const filePath = path.join(folder, file);
  if (!fs.existsSync(filePath)) continue;

  let text = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // 1. Basic Replacements (from previous script version)
  if (/\bControlGroup\b/.test(text) && !/import ControlGroup/.test(text)) {
    text = text.replace(
      /(import ControlPanel from "\.\.\/\.\.\/components\/ControlPanel";)/,
      '$1\nimport ControlGroup from "../../components/ControlGroup";',
    );
    changed = true;
  }
  if (!/import AFHDLSection/.test(text)) {
    const importTarget =
      /import ControlGroup/.test(text)
        ? 'ControlGroup'
        : 'ControlPanel';

    text = text.replace(
      new RegExp(`(import ${importTarget} from "\\.\\.\\/\\.\\.\\/components\\/${importTarget}";)`),
      '$1\nimport AFHDLSection from "./components/AFHDLSection";\nimport { arithmeticDescriptions } from "./utils/arithmeticDescriptions";'
    );
    changed = true;
  }

  // 2. Add AFHDLCopyButton
  if (!/import AFHDLCopyButton/.test(text)) {
    text = text.replace(
      /(import AFHDLSection from "\.\/components\/AFHDLSection";)/,
      `$1\nimport AFHDLCopyButton from "./components/AFHDLCopyButton";`
    );
    changed = true;
  }

  // 3. Inject AFHDLSection if missing
  if (!/<AFHDLSection/.test(text) && /<ExplanationBlock/.test(text)) {
    const key = map[file] || "adders";
    text = text.replace(
      /(<ToolLayout[\s\S]*?>\s*)(<ExplanationBlock)/,
      `$1    <AFHDLSection title="Quick summary" description={arithmeticDescriptions.${key}} />\n\n    $2`,
    );
    changed = true;
  }

  // 4. Replace style object S (Premium Upgrade)
  const sMatch = text.match(/\/\* ── STYLES ──+ \*\/[\s\S]*?const S = \{[\s\S]*?\};/);
  if (sMatch) {
    text = text.replace(sMatch[0], `/* ── STYLES ──────────────────────────────────────────────── */\n${NEW_S}`);
    changed = true;
  } else {
    const sMatchSimple = text.match(/const S = \{[\s\S]*?\};/);
    if (sMatchSimple) {
      text = text.replace(sMatchSimple[0], NEW_S);
      changed = true;
    }
  }

  // 5. Inject CopyButton into code blocks
  const codeBlockRegex = /<div style=\{S\.codeBlock\}>[\s\S]*?<pre[\s\S]*?>(?:\{`|")([\s\S]*?)(?:`\}|")<\/pre>[\s\S]*?<\/div>/g;
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const codeContent = match[1].replace(/\${/g, "\\${"); // Escape template literals
    if (!fullMatch.includes("AFHDLCopyButton")) {
      const injected = fullMatch.replace(
        /<pre/,
        `<AFHDLCopyButton text={\`${codeContent}\`} />\n          <pre`
      );
      text = text.replace(fullMatch, injected);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, text, "utf8");
    console.log("Updated & Beautified", file);
  }
}
