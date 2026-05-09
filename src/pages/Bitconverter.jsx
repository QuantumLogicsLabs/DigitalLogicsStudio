import React, { useState } from "react";

export default function BitConverter() {
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("MB");
  const [toUnit, setToUnit] = useState("KB");
  const [result, setResult] = useState("");
  const [showTable, setShowTable] = useState(false);

  const units = {
    bit: {
      toBits: 1,
      power: 0,
      label: "Bit",
      category: "base",
    },
    B: { toBits: 8, power: 3, label: "Byte", category: "byte" },
    KB: { toBits: 8 * 1024, power: 13, label: "Kilobyte", category: "byte" },
    MB: {
      toBits: 8 * 1024 * 1024,
      power: 23,
      label: "Megabyte",
      category: "byte",
    },
    GB: {
      toBits: 8 * 1024 * 1024 * 1024,
      power: 33,
      label: "Gigabyte",
      category: "byte",
    },
    TB: {
      toBits: 8 * Math.pow(1024, 4),
      power: 43,
      label: "Terabyte",
      category: "byte",
    },
    PB: {
      toBits: 8 * Math.pow(1024, 5),
      power: 53,
      label: "Petabyte",
      category: "byte",
    },
    Kib: { toBits: 1024, power: 10, label: "Kibibit", category: "bit" },
    Mib: { toBits: 1024 * 1024, power: 20, label: "Mebibit", category: "bit" },
    Gib: {
      toBits: 1024 * 1024 * 1024,
      power: 30,
      label: "Gibibit",
      category: "bit",
    },
    Tib: {
      toBits: Math.pow(1024, 4),
      power: 40,
      label: "Tebibit",
      category: "bit",
    },
    Pib: {
      toBits: Math.pow(1024, 5),
      power: 50,
      label: "Pebibit",
      category: "bit",
    },
  };

  const handleConvert = () => {
    if (!inputValue || isNaN(inputValue)) {
      setResult("");
      return;
    }

    const fromBits = units[fromUnit].toBits;
    const toBits = units[toUnit].toBits;

    const totalBits = parseFloat(inputValue) * fromBits;
    const converted = totalBits / toBits;

    setResult(converted.toLocaleString("en-US", { maximumFractionDigits: 10 }));
  };

  const formatNumber = (num) => {
    if (num >= 1e15) {
      return num.toExponential(2);
    }
    return num.toLocaleString("en-US");
  };

  const tableData = [
    { unit: "Bit", symbol: "bit", power: 0, bits: 1, category: "base" },
    { unit: "Byte", symbol: "B", power: 3, bits: 8, category: "base" },
    {
      unit: "Kibibit",
      symbol: "Kib",
      power: 10,
      bits: units.Kib.toBits,
      category: "binary-bits",
    },
    {
      unit: "Mebibit",
      symbol: "Mib",
      power: 20,
      bits: units.Mib.toBits,
      category: "binary-bits",
    },
    {
      unit: "Gibibit",
      symbol: "Gib",
      power: 30,
      bits: units.Gib.toBits,
      category: "binary-bits",
    },
    {
      unit: "Tebibit",
      symbol: "Tib",
      power: 40,
      bits: units.Tib.toBits,
      category: "binary-bits",
    },
    {
      unit: "Pebibit",
      symbol: "Pib",
      power: 50,
      bits: units.Pib.toBits,
      category: "binary-bits",
    },
    {
      unit: "Kilobyte",
      symbol: "KB",
      power: 13,
      bits: units.KB.toBits,
      category: "bytes",
    },
    {
      unit: "Megabyte",
      symbol: "MB",
      power: 23,
      bits: units.MB.toBits,
      category: "bytes",
    },
    {
      unit: "Gigabyte",
      symbol: "GB",
      power: 33,
      bits: units.GB.toBits,
      category: "bytes",
    },
    {
      unit: "Terabyte",
      symbol: "TB",
      power: 43,
      bits: units.TB.toBits,
      category: "bytes",
    },
    {
      unit: "Petabyte",
      symbol: "PB",
      power: 53,
      bits: units.PB.toBits,
      category: "bytes",
    },
  ];

  const groupedData = {
    "Base Units": tableData.filter((d) => d.category === "base"),
    "Binary Bits (1024-based)": tableData.filter(
      (d) => d.category === "binary-bits",
    ),
    "Bytes (1024-based)": tableData.filter((d) => d.category === "bytes"),
  };

  return (
    <div className="binary-container">
      <div className="binary-wrapper">
        <h1 className="binary-main-title">Bit & Byte Converter</h1>
        <p className="binary-subtitle">
          Convert between digital storage units with precision
        </p>

        <section className="binary-card">
          <h2 className="binary-section-title binary-title-primary">
            <span className="binary-dot binary-dot-primary"></span>
            Unit Conversion
          </h2>

          <div className="binary-info-box binary-info-primary">
            <h3 className="binary-info-heading">How it works:</h3>
            <p className="binary-text">
              Select your{" "}
              <span className="binary-highlight-primary">source unit</span>,
              enter a value, then choose the{" "}
              <span className="binary-highlight-primary">target unit</span> for
              conversion.
            </p>

            <div className="binary-reference-section">
              <h4 className="binary-reference-title">Quick Reference:</h4>
              <div className="binary-example-box">
                <ul className="binary-list">
                  <li>
                    <strong>1 Byte</strong> = 8 bits
                  </li>
                  <li>
                    <strong>Binary units</strong> use 1024 (2<sup>10</sup>) as
                    base
                  </li>
                  <li>
                    <strong>Decimal units</strong> use 1000 (10<sup>3</sup>) as
                    base
                  </li>
                  <li>
                    <strong>IEC standard:</strong> KB/MB/GB (binary) vs kB/mB/gB
                    (decimal)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="binary-info-heading">Convert Your Value</h3>

          <div className="binary-controls-grid">
            <div className="binary-input-group">
              <label className="binary-label">From Unit</label>
              <select
                className="binary-input-field binary-input-primary binary-select"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
              >
                <optgroup label="Bytes">
                  <option value="B">Byte (B)</option>
                  <option value="KB">Kilobyte (KB)</option>
                  <option value="MB">Megabyte (MB)</option>
                  <option value="GB">Gigabyte (GB)</option>
                  <option value="TB">Terabyte (TB)</option>
                  <option value="PB">Petabyte (PB)</option>
                </optgroup>
                <optgroup label="Bits">
                  <option value="bit">Bit</option>
                  <option value="Kib">Kibibit (Kib)</option>
                  <option value="Mib">Mebibit (Mib)</option>
                  <option value="Gib">Gibibit (Gib)</option>
                  <option value="Tib">Tebibit (Tib)</option>
                  <option value="Pib">Pebibit (Pib)</option>
                </optgroup>
              </select>
            </div>

            <div className="binary-input-group">
              <label className="binary-label">Value</label>
              <input
                type="number"
                className="binary-input-field binary-input-primary"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value..."
              />
            </div>

            <div className="binary-input-group">
              <label className="binary-label">To Unit</label>
              <select
                className="binary-input-field binary-input-primary binary-select"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              >
                <optgroup label="Bytes">
                  <option value="B">Byte (B)</option>
                  <option value="KB">Kilobyte (KB)</option>
                  <option value="MB">Megabyte (MB)</option>
                  <option value="GB">Gigabyte (GB)</option>
                  <option value="TB">Terabyte (TB)</option>
                  <option value="PB">Petabyte (PB)</option>
                </optgroup>
                <optgroup label="Bits">
                  <option value="bit">Bit</option>
                  <option value="Kib">Kibibit (Kib)</option>
                  <option value="Mib">Mebibit (Mib)</option>
                  <option value="Gib">Gibibit (Gib)</option>
                  <option value="Tib">Tebibit (Tib)</option>
                  <option value="Pib">Pebibit (Pib)</option>
                </optgroup>
              </select>
            </div>
          </div>

          <button
            className="binary-btn binary-btn-primary binary-btn-full"
            onClick={handleConvert}
          >
            Convert
          </button>

          {result && (
            <div className="binary-result-box binary-result-primary">
              <div className="binary-bits-display">
                {result} {units[toUnit].label}
              </div>
              <div className="binary-details-grid">
                <div>
                  <strong>From:</strong> {inputValue} {units[fromUnit].label}
                </div>
                <div>
                  <strong>To:</strong> {result} {units[toUnit].label}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="binary-card">
          <h2 className="binary-section-title binary-title-secondary">
            <span className="binary-dot binary-dot-secondary"></span>
            Reference Information
          </h2>

          <div className="binary-info-box binary-info-secondary">
            <h3 className="binary-info-heading">
              Understanding Digital Storage Units
            </h3>
            <p className="binary-text">
              Digital storage uses{" "}
              <span className="binary-highlight-secondary">
                binary prefixes
              </span>{" "}
              based on powers of 2. Each step up multiplies by 1024 (2
              <sup>10</sup>).
            </p>

            <button
              className="binary-toggle-btn binary-toggle-btn-secondary"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable
                ? "Hide Complete Reference Table"
                : "Show Complete Reference Table"}
            </button>

            {showTable && (
              <div className="binary-table-container">
                <table className="binary-table">
                  <thead className="binary-table-header">
                    <tr>
                      <th>Unit</th>
                      <th className="binary-table-cell-center">Symbol</th>
                      <th className="binary-table-cell-center">
                        2<sup>n</sup> Bits
                      </th>
                      <th className="binary-table-cell-right">Total Bits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedData).map(([category, items]) => (
                      <React.Fragment key={category}>
                        <tr>
                          <td colSpan="4" className="binary-table-category">
                            {category}
                          </td>
                        </tr>
                        {items.map((row) => (
                          <tr key={row.symbol} className="binary-table-row">
                            <td className="binary-table-cell">{row.unit}</td>
                            <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-secondary">
                              {row.symbol}
                            </td>
                            <td className="binary-table-cell binary-table-cell-center binary-table-cell-mono binary-table-cell-amber">
                              2<sup>{row.power}</sup>
                            </td>
                            <td className="binary-table-cell binary-table-cell-right binary-table-cell-mono binary-table-cell-primary">
                              {formatNumber(row.bits)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="binary-reference-section">
              <h4 className="binary-reference-title">
                Example:{" "}
                <span className="binary-highlight-secondary">
                  1 Megabyte (MB)
                </span>
              </h4>
              <div className="binary-example-box">
                <ol className="binary-list">
                  <li>
                    <strong>1 MB</strong> = 1024 KB
                  </li>
                  <li>
                    <strong>1 MB</strong> = 1,048,576 Bytes
                  </li>
                  <li>
                    <strong>1 MB</strong> ={" "}
                    <span className="binary-highlight-secondary">
                      8,388,608 bits
                    </span>
                  </li>
                  <li>
                    <strong>Power:</strong> 2<sup>23</sup> bits
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
