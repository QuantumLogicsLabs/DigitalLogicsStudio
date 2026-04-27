export default function SeqDiagram() {
  return (
    <>
      <div className="seq-diagram">
        <svg
          viewBox="0 0 620 270"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <defs>
            <marker
              id="a0"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3z" fill="#6366f1" />
            </marker>
            <filter id="glow0">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Input */}
          <line
            x1="20"
            y1="135"
            x2="90"
            y2="135"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#a0)"
          />
          <text x="12" y="122" fontSize="11" fill="#94a3b8">
            Inputs
          </text>
          {/* Combinational box */}
          <rect
            x="90"
            y="80"
            width="170"
            height="110"
            rx="10"
            fill="rgba(30,27,75,0.9)"
            stroke="#6366f1"
            strokeWidth="2"
          />
          <rect
            x="90"
            y="80"
            width="170"
            height="4"
            rx="2"
            fill="#6366f1"
            opacity="0.6"
          />
          <text
            x="175"
            y="132"
            fontSize="12"
            fill="#a5b4fc"
            textAnchor="middle"
            fontWeight="700"
          >
            Combinational
          </text>
          <text
            x="175"
            y="150"
            fontSize="11"
            fill="#64748b"
            textAnchor="middle"
          >
            Logic Block
          </text>
          {/* Output */}
          <line
            x1="240"
            y1="110"
            x2="400"
            y2="110"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#a0)"
            filter="url(#glow0)"
          />
          <text x="365" y="100" fontSize="11" fill="#10b981" fontWeight="700">
            Outputs
          </text>
          {/* Next state */}
          <line
            x1="260"
            y1="160"
            x2="320"
            y2="160"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#a0)"
          />
          <text x="265" y="152" fontSize="9" fill="#818cf8">
            Next State
          </text>
          {/* Memory box */}
          <rect
            x="320"
            y="110"
            width="150"
            height="100"
            rx="10"
            fill="rgba(30,27,75,0.9)"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <rect
            x="320"
            y="110"
            width="150"
            height="4"
            rx="2"
            fill="#f59e0b"
            opacity="0.6"
          />
          <text
            x="395"
            y="158"
            fontSize="12"
            fill="#fbbf24"
            textAnchor="middle"
            fontWeight="700"
          >
            Memory
          </text>
          <text
            x="395"
            y="175"
            fontSize="11"
            fill="#64748b"
            textAnchor="middle"
          >
            (Flip-Flops)
          </text>
          {/* Feedback */}
          <line
            x1="395"
            y1="210"
            x2="395"
            y2="250"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="6"
          />
          <line
            x1="395"
            y1="250"
            x2="60"
            y2="250"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="6"
          />
          <line
            x1="60"
            y1="250"
            x2="60"
            y2="155"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="6"
          />
          <line
            x1="60"
            y1="155"
            x2="90"
            y2="155"
            stroke="#818cf8"
            strokeWidth="1.5"
            markerEnd="url(#a0)"
          />
          <text
            x="200"
            y="268"
            fontSize="9"
            fill="#818cf8"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            CURRENT STATE FEEDBACK
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 1 — General block diagram of a synchronous sequential circuit
        </p>
      </div>
    </>
  );
}
