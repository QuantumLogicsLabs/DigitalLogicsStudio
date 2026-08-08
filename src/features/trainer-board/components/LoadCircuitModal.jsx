import { memo } from "react";
import { F } from "../utils/constants";

// ── My Circuits — load/delete modal ────────────────────────────────
// Lists the authenticated user's saved circuits (via listCircuits) and
// lets them pull one back onto the board (getCircuit) or remove it
// (deleteCircuit).
function LoadCircuitModal({
  browser,
  onClose,
  onLoad,
  onDelete,
  loadingId,
  currentId,
}) {
  if (!browser.open) return null;
  const { loading, error, circuits } = browser;

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(420px, 92vw)",
          maxHeight: "76vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg,#0c1420,#050a10)",
          border: "1px solid #2ee6a8",
          borderRadius: 8,
          boxShadow: "0 20px 50px rgba(0,0,0,.85)",
          fontFamily: F,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "9px 12px",
            background: "linear-gradient(90deg,#08221e,#050a10)",
            borderBottom: "1px solid #1e3344",
          }}
        >
          <span style={{ fontSize: 11, color: "#2ee6a8", letterSpacing: 1, fontWeight: "bold" }}>
            📂 MY CIRCUITS
          </span>
          <span
            onClick={onClose}
            style={{ cursor: "pointer", color: "#f66", fontSize: 13, fontWeight: "bold", padding: "0 4px" }}
          >
            ✕
          </span>
        </div>

        <div style={{ padding: 10, overflowY: "auto", flex: 1 }}>
          {loading && (
            <div style={{ fontSize: 9, color: "#8aaacf", textAlign: "center", padding: "20px 0" }}>
              Loading…
            </div>
          )}

          {!loading && error && (
            <div style={{ fontSize: 9, color: "#f66", textAlign: "center", padding: "20px 0" }}>
              ⚠ {error}
            </div>
          )}

          {!loading && !error && circuits.length === 0 && (
            <div style={{ fontSize: 9, color: "#556", textAlign: "center", padding: "20px 0", lineHeight: 1.6 }}>
              No saved circuits yet.
              <br />
              Build something and hit 💾 SAVE.
            </div>
          )}

          {!loading && !error && circuits.map((c) => {
            const id = c._id || c.id;
            const isCurrent = id === currentId;
            const isLoadingThis = loadingId === id;
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 8px",
                  marginBottom: 6,
                  background: isCurrent ? "#0e2436" : "#0a1520",
                  border: `1px solid ${isCurrent ? "#4fc3f7" : "#1e3344"}`,
                  borderRadius: 5,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#cde",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.name || "Untitled Circuit"} {isCurrent && <span style={{ color: "#4fc3f7" }}>· open</span>}
                  </div>
                  {(c.updatedAt || c.createdAt) && (
                    <div style={{ fontSize: 7, color: "#556", marginTop: 2 }}>
                      {new Date(c.updatedAt || c.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onLoad(id)}
                  disabled={isLoadingThis}
                  style={{
                    background: "#08221e",
                    color: "#2ee6a8",
                    border: "1px solid #2ee6a8",
                    borderRadius: 3,
                    padding: "3px 8px",
                    cursor: isLoadingThis ? "wait" : "pointer",
                    fontSize: 8,
                    fontFamily: F,
                    opacity: isLoadingThis ? 0.6 : 1,
                  }}
                >
                  {isLoadingThis ? "…" : "LOAD"}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${c.name || "Untitled Circuit"}"? This can't be undone.`)) {
                      onDelete(id);
                    }
                  }}
                  style={{
                    background: "#1e0808",
                    color: "#f66",
                    border: "1px solid #f66",
                    borderRadius: 3,
                    padding: "3px 7px",
                    cursor: "pointer",
                    fontSize: 8,
                    fontFamily: F,
                  }}
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(LoadCircuitModal);
