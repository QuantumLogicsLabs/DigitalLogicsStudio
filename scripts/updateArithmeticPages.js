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
for (const file of Object.keys(map)) {
  const filePath = path.join(folder, file);
  let text = fs.readFileSync(filePath, "utf8");
  let changed = false;

  if (/\bControlGroup\b/.test(text) && !/import ControlGroup/.test(text)) {
    text = text.replace(
      /(import ControlPanel from "\.\.\/\.\.\/components\/ControlPanel";)/,
      '$1\nimport ControlGroup from "../../components/ControlGroup";',
    );
    changed = true;
  }
  if (!/import AFHDLSection/.test(text)) {
    if (/import ControlGroup/.test(text)) {
      text = text.replace(
        /(import ControlGroup from "\.\.\/\.\.\/components\/ControlGroup";)/,
        '$1\nimport AFHDLSection from "./components/AFHDLSection";\nimport { arithmeticDescriptions } from "./utils/arithmeticDescriptions";',
      );
    } else if (/import ControlPanel/.test(text)) {
      text = text.replace(
        /(import ControlPanel from "\.\.\/\.\.\/components\/ControlPanel";)/,
        '$1\nimport AFHDLSection from "./components/AFHDLSection";\nimport { arithmeticDescriptions } from "./utils/arithmeticDescriptions";',
      );
    }
    changed = true;
  }

  if (!/<AFHDLSection/.test(text) && /<ExplanationBlock/.test(text)) {
    const key = map[file] || "adders";
    text = text.replace(
      /(<ToolLayout[\s\S]*?>\s*)(<ExplanationBlock)/,
      `$1    <AFHDLSection title="Quick summary" description={arithmeticDescriptions.${key}} />\n\n    $2`,
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, text, "utf8");
    console.log("Updated", file);
  }
}
