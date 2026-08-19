import React from "react";

const RenameModal = ({
  renamingGate,
  renameValue,
  setRenameValue,
  cancelRename,
  commitRename,
}) => {
  if (!renamingGate) return null;

  return (
    <div className="modal-overlay" onClick={cancelRename}>
      <div className="rename-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="rename-title">✏️ Rename Gate</h3>
        <p className="rename-text">
          Enter a custom label for this{" "}
          <strong className="gate-type">{renamingGate.type}</strong> gate.
        </p>
        <input
          autoFocus
          className="rename-input"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") cancelRename();
          }}
        />
        <div className="rename-actions">
          <button className="btn cancel-btn" onClick={cancelRename}>
            Cancel
          </button>
          <button className="btn rename-btn" onClick={commitRename}>
            Rename
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;
