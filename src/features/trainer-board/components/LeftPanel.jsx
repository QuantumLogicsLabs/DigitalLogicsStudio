import { memo } from "react";
import Section from "./Section";
import Seg7 from "./Seg7";
import LED from "./LED";
import { F } from "../utils/constants";

// ── Left panel — 7-seg readout, clock generator, push switches,
//    logic probe, potentiometers ─────────────────────────────────
function LeftPanel({
  dec,
  clkHz, setClkHz,
  clkOn, setClkOn,
  clk,
  pulseClock,
  pushBtns, setPush,
}) {
  return (
    <div>
      {/* 4-digit 7-seg */}
      <Section title="7-Segment Display">
        <div
          style={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            background: "#050200",
            padding: 7,
            borderRadius: 5,
            border: "1px solid #1a0a00",
          }}
        >
          {[
            Math.floor(dec / 1000) % 10,
            Math.floor(dec / 100) % 10,
            Math.floor(dec / 10) % 10,
            dec % 10,
          ].map((v, i) => (
            <Seg7 key={i} val={v} h={44} />
          ))}
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 7,
            color: "#666",
            marginTop: 4,
            fontFamily: F,
          }}
        >
          {String(dec).padStart(4, "0")} · 0x
          {dec.toString(16).toUpperCase().padStart(2, "0")} ·{" "}
          {dec.toString(2).padStart(8, "0")}b
        </div>
      </Section>

      {/* Clock */}
      <Section title="Clock Generator">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 5,
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#000",
              border: "1px solid #181818",
              borderRadius: 3,
              padding: "3px 8px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: clkOn && clk ? "#ff8800" : "#332",
                fontFamily: F,
              }}
            >
              {clkHz}Hz
            </span>
            <div
              className={clkOn && clk ? "clk-blink" : ""}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                marginLeft: "auto",
                background: clkOn && clk ? "#ff8800" : "#1a1a1a",
                boxShadow: clkOn && clk ? "0 0 8px #ff8800" : "none",
                border: "1px solid #333",
              }}
            />
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={64}
          value={clkHz}
          onChange={(e) => setClkHz(+e.target.value)}
          style={{
            width: "100%",
            accentColor: "#ff8800",
            marginBottom: 5,
            cursor: "pointer",
          }}
        />
        <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
          {[1, 4, 16, 64].map((hz) => (
            <button
              key={hz}
              onClick={() => setClkHz(hz)}
              style={{
                flex: 1,
                background: clkHz === hz ? "#2a1800" : "#0a0a0a",
                color: clkHz === hz ? "#ff8800" : "#443322",
                border: `1px solid ${clkHz === hz ? "#ff8800" : "#221100"}`,
                borderRadius: 3,
                padding: "2px 0",
                fontSize: 7,
                fontFamily: F,
                cursor: "pointer",
              }}
            >
              {hz}Hz
            </button>
          ))}
        </div>
        <button
          onClick={() => setClkOn((v) => !v)}
          style={{
            width: "100%",
            background: clkOn ? "#0f300f" : "#300f0f",
            color: clkOn ? "#00ee44" : "#ff4444",
            border: `1px solid ${clkOn ? "#00ee44" : "#ff4444"}`,
            borderRadius: 4,
            padding: "5px 0",
            fontSize: 9,
            fontFamily: F,
            cursor: "pointer",
          }}
        >
          {clkOn ? "● CLK ON" : "○ CLK OFF"}
        </button>
        <button
          onClick={pulseClock}
          style={{
            width: '100%',
            background: '#1a1a00',
            color: '#ffcc00',
            border: '1px solid #ffcc00',
            borderRadius: 4,
            padding: '5px 0',
            fontSize: 9,
            fontFamily: 'monospace',
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          ⚡ SINGLE PULSE
        </button>
      </Section>

      {/* Push switches */}
      <Section title="Push Switches">
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {[0, 1].map((i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <button
                onMouseDown={() =>
                  setPush((p) => {
                    const n = [...p];
                    n[i] = 1;
                    return n;
                  })
                }
                onMouseUp={() =>
                  setPush((p) => {
                    const n = [...p];
                    n[i] = 0;
                    return n;
                  })
                }
                onMouseLeave={() =>
                  setPush((p) => {
                    const n = [...p];
                    n[i] = 0;
                    return n;
                  })
                }
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: pushBtns[i] ? "#bb3300" : "#2a1000",
                  border: "3px solid #886644",
                  cursor: "pointer",
                  boxShadow: pushBtns[i]
                    ? "inset 0 2px 4px rgba(0,0,0,.5)"
                    : "0 4px 0 #000",
                  transform: pushBtns[i] ? "translateY(3px)" : "none",
                  transition: "transform .07s,box-shadow .07s",
                  color: "#ffaa44",
                  fontSize: 9,
                  fontFamily: F,
                }}
              >
                S{i + 1}
              </button>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <LED on={!!pushBtns[i]} c="Y" />
                <span
                  style={{
                    fontSize: 6,
                    color: "#777",
                    fontFamily: F,
                  }}
                >
                  Q
                </span>
                <LED on={!pushBtns[i]} c="G" />
                <span
                  style={{
                    fontSize: 6,
                    color: "#777",
                    fontFamily: F,
                  }}
                >
                  Q̄
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Logic Probe */}
      <Section title="Logic Probe">
        {[
          ["HI", clk === 1, "G"],
          ["LO", clk === 0, "R"],
          ["PULSE", clkOn, "Y"],
          ["HI-Z", false, "B"],
        ].map(([lbl, on, c]) => (
          <div
            key={lbl}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 5,
            }}
          >
            <LED on={on} c={c} size={11} />
            <span
              style={{ fontSize: 8, color: "#aaa", fontFamily: F }}
            >
              {lbl}
            </span>
          </div>
        ))}
      </Section>

      {/* Potentiometers */}
      <Section title="Potentiometers">
        <div
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          {[
            ["1K", 110],
            ["10K", 200],
          ].map(([lbl, angle]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  margin: "0 auto 4px",
                  background:
                    "radial-gradient(circle at 36% 34%,#999,#2a2a2a)",
                  border: "2px solid #555",
                  position: "relative",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,.8)",
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 3,
                    height: 11,
                    background: "#e0e0e0",
                    borderRadius: 2,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 7,
                  color: "#d4a843",
                  fontFamily: F,
                }}
              >
                {lbl}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default memo(LeftPanel);
