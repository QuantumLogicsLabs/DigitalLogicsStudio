// ─── SVG: 4-to-2 Encoder Internal Circuit ────────────────────────────────────
export const Encoder4to2SVG = ({ inputVals, result }) => {
  const w = (v) => (v ? "#00ff88" : "#1e3a2f");
  const wA = (v) => (v ? "#fbbf24" : "#3a2e0a");
  const glow = (v) => (v ? { filter: "drop-shadow(0 0 4px #00ff88)" } : {});
  const [i0, i1, i2, i3] = inputVals.slice(0, 4);
  const A1 = result.A1 ?? 0;
  const A0 = result.A0 ?? 0;
  const V = result.V ?? 0;

  // OR gate path
  const OrGate = ({ cx, cy, active, label }) => (
    <g style={glow(active)}>
      <path
        d={`M${cx - 20} ${cy - 16} Q${cx - 8} ${cy - 16} ${cx + 16} ${cy} Q${cx - 8} ${cy + 16} ${cx - 20} ${cy + 16} Q${cx - 8} ${cy} ${cx - 20} ${cy - 16} Z`}
        fill="rgba(20,30,50,0.95)"
        stroke={w(active)}
        strokeWidth={active ? 2 : 1.5}
      />
      <text
        x={cx - 2}
        y={cy + 4}
        textAnchor="middle"
        fill={active ? "#00ff88" : "#4b5563"}
        fontSize="8"
        fontFamily="monospace"
      >
        OR
      </text>
    </g>
  );
  const AndGate = ({ cx, cy, active }) => (
    <g style={glow(active)}>
      <path
        d={`M${cx - 16} ${cy - 14} L${cx} ${cy - 14} Q${cx + 14} ${cy - 14} ${cx + 14} ${cy} Q${cx + 14} ${cy + 14} ${cx} ${cy + 14} L${cx - 16} ${cy + 14} Z`}
        fill="rgba(20,30,50,0.95)"
        stroke={w(active)}
        strokeWidth={active ? 2 : 1.5}
      />
      <text
        x={cx - 1}
        y={cy + 4}
        textAnchor="middle"
        fill={active ? "#00ff88" : "#4b5563"}
        fontSize="8"
        fontFamily="monospace"
      >
        AND
      </text>
    </g>
  );
  const NotGate = ({ cx, cy, active }) => (
    <g>
      <path
        d={`M${cx - 12} ${cy - 9} L${cx - 12} ${cy + 9} L${cx + 6} ${cy} Z`}
        fill="rgba(20,30,50,0.9)"
        stroke={w(active)}
        strokeWidth="1.5"
      />
      <circle
        cx={cx + 9}
        cy={cy}
        r="3"
        fill="none"
        stroke={w(active)}
        strokeWidth="1.5"
      />
    </g>
  );

  return (
    <svg
      viewBox="0 0 560 260"
      width="100%"
      style={{
        maxWidth: "560px",
        fontFamily: "monospace",
        fontSize: "11px",
        display: "block",
      }}
    >
      <rect
        width="560"
        height="260"
        rx="10"
        fill="rgba(8,12,22,0.97)"
        stroke="rgba(99,102,241,0.25)"
        strokeWidth="1.5"
      />

      {/* Input circles */}
      {[
        ["I0", 40, 55, i0],
        ["I1", 40, 100, i1],
        ["I2", 40, 145, i2],
        ["I3", 40, 190, i3],
      ].map(([lbl, x, y, v]) => (
        <g key={lbl}>
          <circle
            cx={x}
            cy={y}
            r="14"
            fill={v ? "rgba(0,255,136,0.18)" : "rgba(20,30,50,0.8)"}
            stroke={w(v)}
            strokeWidth="1.5"
            style={glow(v)}
          />
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill={v ? "#00ff88" : "#6b7280"}
            fontWeight="bold"
            fontSize="11"
          >
            {lbl}
          </text>
          <line
            x1={x + 14}
            y1={y}
            x2={x + 30}
            y2={y}
            stroke={w(v)}
            strokeWidth="2"
          />
          <circle cx={x + 30} cy={y} r="3" fill={w(v)} />
        </g>
      ))}

      {/* Distribution lines */}
      <line x1="70" y1="55" x2="70" y2="230" stroke={w(i0)} strokeWidth="1" />
      <line x1="85" y1="100" x2="85" y2="230" stroke={w(i1)} strokeWidth="1" />
      <line
        x1="100"
        y1="145"
        x2="100"
        y2="230"
        stroke={w(i2)}
        strokeWidth="1"
      />
      <line
        x1="115"
        y1="190"
        x2="115"
        y2="230"
        stroke={w(i3)}
        strokeWidth="1"
      />

      {/* A1 = OR(I2, I3) */}
      <OrGate cx={230} cy={90} active={A1} />
      <line
        x1="100"
        y1="145"
        x2="145"
        y2="145"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      <line
        x1="145"
        y1="145"
        x2="145"
        y2="83"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      <line
        x1="145"
        y1="83"
        x2="210"
        y2="83"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      <line
        x1="115"
        y1="190"
        x2="150"
        y2="190"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="150"
        y1="190"
        x2="150"
        y2="97"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="150"
        y1="97"
        x2="210"
        y2="97"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line x1="246" y1="90" x2="310" y2="90" stroke={wA(A1)} strokeWidth="2" />

      {/* NOT I2 for A0 priority */}
      <NotGate cx={170} cy={145} active={!i2 ? 1 : 0} />
      <line
        x1="100"
        y1="145"
        x2="158"
        y2="145"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      {/* AND(I1, NOT I2) for A0 lower path */}
      <AndGate cx={230} cy={155} active={i1 && !i2 ? 1 : 0} />
      <line
        x1="182"
        y1="145"
        x2="195"
        y2="145"
        stroke={w(!i2 ? 1 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="195"
        y1="145"
        x2="195"
        y2="149"
        stroke={w(!i2 ? 1 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="195"
        y1="149"
        x2="214"
        y2="149"
        stroke={w(!i2 ? 1 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="85"
        y1="100"
        x2="140"
        y2="100"
        stroke={w(i1)}
        strokeWidth="1.5"
      />
      <line
        x1="140"
        y1="100"
        x2="140"
        y2="161"
        stroke={w(i1)}
        strokeWidth="1.5"
      />
      <line
        x1="140"
        y1="161"
        x2="214"
        y2="161"
        stroke={w(i1)}
        strokeWidth="1.5"
      />

      {/* A0 = OR(I3, AND(I1,I2')) */}
      <OrGate cx={295} cy={150} active={A0} />
      <line
        x1="244"
        y1="155"
        x2="275"
        y2="155"
        stroke={w(i1 && !i2 ? 1 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="115"
        y1="190"
        x2="155"
        y2="190"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="155"
        y1="190"
        x2="155"
        y2="170"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="155"
        y1="170"
        x2="275"
        y2="145"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="311"
        y1="150"
        x2="340"
        y2="150"
        stroke={wA(A0)}
        strokeWidth="2"
      />

      {/* V = OR all */}
      <OrGate cx={230} cy={215} active={V} />
      <line x1="70" y1="55" x2="70" y2="208" stroke={w(i0)} strokeWidth="1" />
      <line
        x1="70"
        y1="208"
        x2="210"
        y2="208"
        stroke={w(i0)}
        strokeWidth="1.5"
      />
      <line x1="85" y1="100" x2="85" y2="213" stroke={w(i1)} strokeWidth="1" />
      <line
        x1="85"
        y1="213"
        x2="210"
        y2="213"
        stroke={w(i1)}
        strokeWidth="1.5"
      />
      <line
        x1="100"
        y1="145"
        x2="100"
        y2="218"
        stroke={w(i2)}
        strokeWidth="1"
      />
      <line
        x1="100"
        y1="218"
        x2="210"
        y2="218"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      <line
        x1="115"
        y1="190"
        x2="115"
        y2="222"
        stroke={w(i3)}
        strokeWidth="1"
      />
      <line
        x1="115"
        y1="222"
        x2="210"
        y2="222"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="246"
        y1="215"
        x2="310"
        y2="215"
        stroke={wA(V)}
        strokeWidth="2"
      />

      {/* Output labels */}
      {[
        ["A1", 310, 90, A1],
        ["A0", 340, 150, A0],
        ["V", 310, 215, V],
      ].map(([lbl, x, y, v]) => (
        <g key={lbl} style={glow(v)}>
          <rect
            x={x}
            y={y - 13}
            width="46"
            height="26"
            rx="6"
            fill={v ? "rgba(251,191,36,0.15)" : "rgba(15,25,45,0.8)"}
            stroke={wA(v)}
            strokeWidth={v ? 2 : 1}
          />
          <text
            x={x + 23}
            y={y + 4}
            textAnchor="middle"
            fill={v ? "#fbbf24" : "#6b7280"}
            fontSize="11"
            fontWeight={v ? "bold" : "normal"}
          >
            {lbl}={v}
          </text>
        </g>
      ))}

      <text x="280" y="250" textAnchor="middle" fill="#374151" fontSize="9">
        4-to-2 Priority Encoder — Live Gate-Level Circuit
      </text>
    </svg>
  );
};
