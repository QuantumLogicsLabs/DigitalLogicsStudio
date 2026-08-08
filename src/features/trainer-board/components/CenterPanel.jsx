import { memo } from "react";
import Section from "./Section";
import ToggleSW from "./ToggleSW";
import LED from "./LED";
import Breadboard from "./Breadboard";
import WireOverlay from "./WireOverlay";
import TrayIC from "./TrayIC";
import { ICS } from "../utils/icCatalog";
import { F } from "../utils/constants";

// ── Center panel — breadboard, input switches, IC tray ─────────────
function CenterPanel({
  bbWrapRef, bbW, bbH,
  wireStart, wires, placedICs,
  onHoleClick, handleICMouseDown, handleICContextMenu, mode, handleICDelete, poweredIds,
  preview, onWireDelete,
  switches, onToggleSwitch, handleExternalPinDown,
  dec,
  startTrayDrag, handleTrayContextMenu,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Section title="Solderless Breadboard — 2×30 columns × 10 rows + 4 power rails" style={{ overflow: "visible" }}>
        <div className="breadboard-scroll-wrapper" style={{ overflow: "visible" }}>
          {/* bbWrapRef is the coordinate origin for all wires */}
          <div
            ref={bbWrapRef}
            style={{ position: "relative", display: "inline-block", minWidth: `${bbW}px`, overflow: "visible", zIndex: 1 }}
          >
            <Breadboard
              wireStart={wireStart}
              wires={wires}
              placedICs={placedICs}
              onHoleClick={onHoleClick}
              onICMouseDown={handleICMouseDown}
              onICContextMenu={handleICContextMenu}
              mode={mode}
              onICDelete={handleICDelete}
              poweredIds={poweredIds}
            />
            {/* WireOverlay uses SVG-local coords — rendered over the SVG */}
            <WireOverlay
              wires={wires}
              preview={preview}
              width={bbW}
              height={bbH}
              onWireClick={onWireDelete}
            />
          </div>
        </div>
      </Section>

      {/* 8-bit switches */}
      <Section title="Logic Input Switches  A – H  (8-bit)">
        <div
          style={{
            display: "flex",
            gap: 5,
            justifyContent: "center",
          }}
        >
          {switches.map((v, i) => (
            <ToggleSW
              key={i}
              label={String.fromCharCode(65 + i)}
              val={v}
              onToggle={() => onToggleSwitch(i)}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 5,
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          {switches.map((v, i) => (
            <div
              key={i}
              onMouseDown={(e) => handleExternalPinDown(`swled_${i}`, e)}
              style={{ cursor: "crosshair" }}
            >
              <LED on={!!v} c="G" />
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: F,
            fontSize: 16,
            color: "#00ee44",
            background: "#000",
            padding: "5px 10px",
            borderRadius: 3,
            textAlign: "center",
            letterSpacing: 4,
            border: "1px solid #0a1a0a",
            marginTop: 5,
          }}
        >
          {switches.slice().reverse().join("")}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 4,
            fontSize: 9,
            color: "#5a7a5a",
            fontFamily: F,
          }}
        >
          <span>DEC: {dec}</span>
          <span>
            HEX: 0x{dec.toString(16).toUpperCase().padStart(2, "0")}
          </span>
          <span>OCT: {dec.toString(8).padStart(3, "0")}</span>
        </div>
      </Section>

      {/* IC Tray */}
      <Section title="IC Component Tray — drag onto breadboard">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {Object.keys(ICS).map((k) => (
            <TrayIC key={k} icKey={k} onMouseDown={startTrayDrag} onContextMenu={handleTrayContextMenu} />
          ))}
        </div>
        <div
          style={{
            fontSize: 7,
            color: "#334",
            fontFamily: F,
            marginTop: 5,
            textAlign: "center",
          }}
        >
          Hold + drag IC chip → release over breadboard to place
        </div>
      </Section>
    </div>
  );
}

export default memo(CenterPanel);
