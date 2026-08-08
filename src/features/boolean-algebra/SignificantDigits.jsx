import React, { useState } from "react";
import BALayout from "./BALayout";

const countSignificantDigits = (value) => {
  if (!value || /^\s*$/.test(value))
    return { count: 0, msd: null, lsd: null, cleaned: "" };

  let str = value.trim();

  // Handle scientific notation by normalizing the significand
  const sciMatch = str.match(/^([+-]?\d*\.?\d+)[eE]([+-]?\d+)$/);
  if (sciMatch) {
    const significand = sciMatch[1].replace(/[+-]/g, "");
    const digitsOnly = significand.replace(".", "");
    const stripped = digitsOnly.replace(/^0+/, ").replace(/0+$/, ");
    if (!stripped) return { count: 0, msd: null, lsd: null, cleaned: "" };
    return {
      count: stripped.length,
      msd: stripped[0],
      lsd: stripped[stripped.length - 1],
      cleaned: stripped,
    };
  }

  // Regular decimal representation
  const signless = str.replace(/[+-]/g, "");
  if (!/^\d*\.?\d*$/.test(signless)) {
    return { count: 0, msd: null, lsd: null, cleaned: "" };
  }

  if (!signless.includes(".")) {
    // Integer: trailing zeros are not significant unless explicitly specified by a decimal point
    const withoutLeading = signless.replace(/^0+/, "");
    const core = withoutLeading.replace(/0+$/, "");
    if (!core) return { count: 0, msd: null, lsd: null, cleaned: "" };
    return {
      count: core.length,
      msd: core[0],
      lsd: core[core.length - 1],
      cleaned: core,
    };
  }

  // Number with decimal point
  const [intPart, fracPart] = signless.split(".");
  const intNoLeading = intPart.replace(/^0+/, "");
  let combined;

  if (intNoLeading) {
    combined = intNoLeading + fracPart;
    combined = combined.replace(/0+$/, "");
  } else {
    const fracNoLeading = fracPart.replace(/^0+/, "");
    combined = fracNoLeading;
  }

  if (!combined) return { count: 0, msd: null, lsd: null, cleaned: "" };

  return {
    count: combined.length,
    msd: combined[0],
    lsd: combined[combined.length - 1],
    cleaned: combined,
  };
};

const SignificantDigits = () => {
  const [input, setInput] = useState("");
  const result = countSignificantDigits(input);

  return (
    <BALayout
      title="Significant Digits"
      subtitle="Count significant figures, MSD, and LSD for any number"
      intro="Significant digits represent the meaningful precision of a measured or calculated value. Understanding which digits are significant is essential for accurate scientific and engineering calculations."
    >
      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Significant Digit Explorer</h2>
          <p className="ba-section-description">
            Enter any number to analyse its significant digits.
          </p>
        </div>
        <div className="ba-field-group">
          <label className="ba-field-label">Enter a number</label>
          <input
            type="text"
            className="ba-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Examples: 0.004500 , 1200 , 3.40 , 6.02e23"
          />
        </div>

        {input && (
          <div className="ba-card" style={{ marginTop: "1rem" }}>
            <h3 className="ba-card-title">Result Summary</h3>
            <div className="ba-card-content">
              {result.count === 0 ? (
                <p>
                  <span className="highlight">No significant digits found</span>{" "}
                  under standard conventions. Check the format and try again.
                </p>
              ) : (
                <>
                  <div className="ba-data-row">
                    <span className="ba-data-label">
                      Total significant digits
                    </span>
                    <span className="ba-data-value highlight">
                      {result.count}
                    </span>
                  </div>
                  <div className="ba-data-row">
                    <span className="ba-data-label">
                      Most Significant Digit (MSD)
                    </span>
                    <span className="ba-data-value highlight">
                      {result.msd}
                    </span>
                  </div>
                  <div className="ba-data-row">
                    <span className="ba-data-label">
                      Least Significant Digit (LSD)
                    </span>
                    <span className="ba-data-value highlight">
                      {result.lsd}
                    </span>
                  </div>
                  <p style={{ marginTop: "0.75rem" }}>
                    Non-significant leading and trailing zeros are stripped,
                    leaving only the{" "}
                    <span className="highlight">meaningful digits</span> that
                    affect measured precision.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Quick Rules</h2>
        </div>
        <div className="ba-card-group">
          <div className="ba-card">
            <h3 className="ba-card-title">Always Significant</h3>
            <div className="ba-card-content">
              <p>All non-zero digits are always significant.</p>
              <p>
                Example: <span className="highlight">1234</span> → 4 sig. digits
              </p>
            </div>
          </div>
          <div className="ba-card">
            <h3 className="ba-card-title">Sandwiched Zeros</h3>
            <div className="ba-card-content">
              <p>Zeros between non-zero digits are significant.</p>
              <p>
                Example: <span className="highlight">1005</span> → 4 sig. digits
              </p>
            </div>
          </div>
          <div className="ba-card">
            <h3 className="ba-card-title">Leading Zeros</h3>
            <div className="ba-card-content">
              <p>Leading zeros are never significant.</p>
              <p>
                Example: <span className="highlight">0.0034</span> → 2 sig.
                digits
              </p>
            </div>
          </div>
          <div className="ba-card">
            <h3 className="ba-card-title">Trailing Zeros</h3>
            <div className="ba-card-content">
              <p>Trailing zeros after a decimal point are significant.</p>
              <p>
                Example: <span className="highlight">2.300</span> → 4 sig.
                digits
              </p>
            </div>
          </div>
          <div className="ba-card">
            <h3 className="ba-card-title">Scientific Notation</h3>
            <div className="ba-card-content">
              <p>Only digits in the coefficient count as significant.</p>
              <p>
                Example: <span className="highlight">6.02×10²³</span> → 3 sig.
                digits
              </p>
            </div>
          </div>
        </div>
      </section>
    </BALayout>
  );
};

export default SignificantDigits;
