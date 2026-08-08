import { memo } from "react";
import Section from "./Section";
import LED from "./LED";
import { F } from "../utils/constants";

// ── Right panel — state monitors, Q/Q̄ outputs, I/O terminals,
//    board info ─────────────────────────────────────────────────
function RightPanel({
  switches,
  monitor,
  handleExternalPinDown,
  dec,
  wires, placedICs,
  clkOn, clkHz,
}) {
  return (
    <div>
      {/* State monitors */}
      <Section title="State Monitors (8)">
        <div
          style={{
            fontSize: 6,
            color: "#f44",
            marginBottom: 3,
            letterSpacing: 1,
            fontFamily: F,
          }}
        >
          DATA BUS D0–D7
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 4,
            marginBottom: 7,
          }}
        >
          {switches.map((_, i) => (
            <div
              key={i}
              style={{ textAlign: "center", cursor: "crosshair" }}
              onMouseDown={(e) => handleExternalPinDown(`databus_${i}`, e)}
            >
              <LED on={!!monitor(`databus_${i}`)} c="R" size={11} />
              <div
                style={{
                  fontSize: 6,
                  color: "#888",
                  fontFamily: F,
                  marginTop: 1,
                }}
              >
                D{i}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 6,
            color: "#4e4",
            marginBottom: 3,
            letterSpacing: 1,
            fontFamily: F,
          }}
        >
          LOGIC OUT Y0–Y7
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 4,
            marginBottom: 7,
          }}
        >
          {switches.map((_, i) => (
            <div
              key={i}
              style={{ textAlign: "center", cursor: "crosshair" }}
              onMouseDown={(e) => handleExternalPinDown(`logicout_${i}`, e)}
            >
              <LED on={!!monitor(`logicout_${i}`)} c="G" size={11} />
              <div
                style={{
                  fontSize: 6,
                  color: "#888",
                  fontFamily: F,
                  marginTop: 1,
                }}
              >
                Y{i}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 6,
            color: "#fc0",
            marginBottom: 3,
            letterSpacing: 1,
            fontFamily: F,
          }}
        >
          FLAGS
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 4,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              style={{ textAlign: "center", cursor: "crosshair" }}
              onMouseDown={(e) => handleExternalPinDown(`flag_${i}`, e)}
            >
              <LED on={!!(i === 7 ? dec > 127 : monitor(`flag_${i}`))} c="Y" size={11} />
              <div
                style={{
                  fontSize: 5,
                  color: "#888",
                  fontFamily: F,
                  marginTop: 1,
                }}
              >
                {["CK", "P1", "P2", "—", "—", "—", "—", "OV"][i]}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Complement outputs */}
      <Section title="Q / Q̄ Outputs">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginBottom: 5,
              cursor: "crosshair",
            }}
            onMouseDown={(e) => handleExternalPinDown(`qbar_${i}`, e)}
          >
            <span
              style={{
                fontSize: 8,
                color: "#d4a843",
                fontFamily: F,
                width: 14,
              }}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <LED on={!!monitor(`qbar_${i}`)} c="G" />
            <span
              style={{ fontSize: 6, color: "#666", fontFamily: F }}
            >
              Q
            </span>
            <div style={{ flex: 1 }} />
            <LED on={!monitor(`qbar_${i}`)} c="R" />
            <span
              style={{ fontSize: 6, color: "#666", fontFamily: F }}
            >
              Q̄
            </span>
          </div>
        ))}
      </Section>

      {/* I/O Terminals */}
      <Section title="I/O Terminals">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
          }}
        >
          {[
            "VCC",
            "GND",
            "+5V",
            "-5V",
            "+15V",
            "-15V",
            "CLK",
            "CLK̄",
          ].map((lbl) => (
            <div
              key={lbl}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 2,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#aaa,#555)",
                  border: "1px solid #333",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 7,
                    height: 1.5,
                    background: "#222",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 1.5,
                    height: 7,
                    background: "#222",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 6.5,
                  color: "#999",
                  fontFamily: F,
                }}
              >
                {lbl}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Board info */}
      <Section title="Board Info">
        <div
          style={{
            fontSize: 7,
            color: "#446",
            lineHeight: 2,
            fontFamily: F,
          }}
        >
          <div>
            Wires:{" "}
            <span style={{ color: "#6699ff" }}>{wires.length}</span>
          </div>
          <div>
            ICs on board:{" "}
            <span style={{ color: "#bb44ff" }}>
              {placedICs.length}
            </span>
          </div>
          <div>
            Rail +: <span style={{ color: "#f44" }}>+5V DC</span>
          </div>
          <div>
            Rail −: <span style={{ color: "#66f" }}>GND</span>
          </div>
          <div>
            Clock:{" "}
            <span style={{ color: "#ff8800" }}>
              {clkOn ? `${clkHz}Hz` : "OFF"}
            </span>
          </div>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 6,
            color: "#2a3a2a",
            lineHeight: 1.8,
            fontFamily: F,
          }}
        >
          1. Click WIRE mode
          <br />
          2. Click hole → click hole
          <br />
          3. Drag IC from tray below
          <br />
          4. Release over breadboard
        </div>
      </Section>
    </div>
  );
}

export default memo(RightPanel);
