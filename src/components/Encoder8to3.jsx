// ─── SVG: 8-to-3 Encoder Block Diagram ───────────────────────────────────────
export const Encoder8to3SVG = ({ inputVals, result }) => {
  const w = (v) => (v ? "#00ff88" : "#1e3a2f");
  const wA = (v) => (v ? "#fbbf24" : "#3a2e0a");
  const glow = (v) => (v ? { filter: `drop-shadow(0 0 4px #00ff88)` } : {});

  return (
    <svg
      viewBox="0 0 520 370"
      width="100%"
      style={{
        maxWidth: "520px",
        fontFamily: "monospace",
        fontSize: "11px",
        display: "block",
      }}
    >
      <rect
        width="520"
        height="370"
        rx="10"
        fill="rgba(8,12,22,0.97)"
        stroke="rgba(99,102,241,0.25)"
        strokeWidth="1.5"
      />

      {/* Encoder box */}
      <rect
        x="180"
        y="25"
        width="130"
        height="280"
        rx="8"
        fill="rgba(15,22,40,0.95)"
        stroke="rgba(99,102,241,0.5)"
        strokeWidth="2"
      />
      <text
        x="245"
        y="48"
        textAnchor="middle"
        fill="#60a5fa"
        fontSize="13"
        fontWeight="bold"
      >
        8-to-3
      </text>
      <text x="245" y="62" textAnchor="middle" fill="#60a5fa" fontSize="11">
        ENCODER
      </text>
      <line
        x1="180"
        y1="70"
        x2="310"
        y2="70"
        stroke="rgba(99,102,241,0.3)"
        strokeWidth="1"
      />

      {/* Input lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 80 + i * 28;
        const v = inputVals[i] || 0;
        return (
          <g key={i}>
            <circle
              cx="40"
              cy={y}
              r="14"
              fill={v ? "rgba(0,255,136,0.18)" : "rgba(20,30,50,0.8)"}
              stroke={w(v)}
              strokeWidth="1.5"
              style={glow(v)}
            />
            <text
              x="40"
              y={y + 4}
              textAnchor="middle"
              fill={v ? "#00ff88" : "#6b7280"}
              fontWeight="bold"
              fontSize="9"
            >
              I{i}
            </text>
            <line
              x1="54"
              y1={y}
              x2="180"
              y2={y}
              stroke={v ? "#00ff88" : "#1e3a2f"}
              strokeWidth={v ? 2 : 1.5}
            />
            {v && (
              <circle
                cx="58"
                cy={y}
                r="4"
                fill="#00ff88"
                style={{ filter: "drop-shadow(0 0 4px #00ff88)" }}
              />
            )}
            <text
              x="116"
              y={y - 4}
              fill="#374151"
              fontSize="8"
              textAnchor="middle"
            >
              I{i} ({i})
            </text>
          </g>
        );
      })}

      {/* Output lines */}
      {[
        ["A2", result.A2 || 0, 85],
        ["A1", result.A1 || 0, 150],
        ["A0", result.A0 || 0, 215],
        ["V", result.V || 0, 280],
      ].map(([lbl, v, y]) => (
        <g key={lbl}>
          <line
            x1="310"
            y1={y}
            x2="380"
            y2={y}
            stroke={wA(v)}
            strokeWidth={v ? 3 : 1.5}
            style={v ? { filter: "drop-shadow(0 0 3px #fbbf24)" } : {}}
          />
          <rect
            x="380"
            y={y - 14}
            width="60"
            height="28"
            rx="6"
            fill={v ? "rgba(251,191,36,0.2)" : "rgba(10,16,30,0.9)"}
            stroke={wA(v)}
            strokeWidth={v ? 2 : 1}
          />
          <text
            x="410"
            y={y + 4}
            textAnchor="middle"
            fill={v ? "#fbbf24" : "#4b5563"}
            fontSize="11"
            fontWeight={v ? "bold" : "normal"}
          >
            {lbl}={v}
          </text>
          {v && (
            <circle
              cx="315"
              cy={y}
              r="5"
              fill="#fbbf24"
              style={{ filter: "drop-shadow(0 0 5px #fbbf24)" }}
            />
          )}
        </g>
      ))}

      {/* Active annotation — positioned in the expanded lower area */}
      {result.active >= 0 ? (
        <g>
          <rect
            x="6"
            y="316"
            width="174"
            height="42"
            rx="6"
            fill="rgba(0,255,136,0.08)"
            stroke="rgba(0,255,136,0.3)"
            strokeWidth="1"
          />
          <text
            x="93"
            y="333"
            textAnchor="middle"
            fill="#00ff88"
            fontSize="9"
            fontWeight="bold"
          >
            Active: I{result.active} →{" "}
            {[result.A2 || 0, result.A1 || 0, result.A0 || 0].join("")}₂
          </text>
          <text x="93" y="348" textAnchor="middle" fill="#9ca3af" fontSize="8">
            Priority: highest active input wins
          </text>
        </g>
      ) : (
        <g>
          <rect
            x="6"
            y="316"
            width="174"
            height="42"
            rx="6"
            fill="rgba(30,40,60,0.5)"
            stroke="rgba(99,102,241,0.15)"
            strokeWidth="1"
          />
          <text x="93" y="333" textAnchor="middle" fill="#6b7280" fontSize="9">
            No inputs active
          </text>
          <text x="93" y="348" textAnchor="middle" fill="#4b5563" fontSize="8">
            V=0 — outputs indeterminate
          </text>
        </g>
      )}

      {/* Watermark — moved to bottom-right, away from annotation */}
      <text x="514" y="362" textAnchor="end" fill="#374151" fontSize="9">
        8-to-3 Priority Encoder — Block Diagram
      </text>
    </svg>
  );
};
