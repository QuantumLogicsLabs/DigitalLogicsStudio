import React, { useState } from "react";

const AFHDLCopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                padding: "0.4rem 0.8rem",
                fontSize: "0.7rem",
                background: copied ? "rgba(74, 222, 128, 0.2)" : "rgba(148, 163, 184, 0.1)",
                border: `1px solid ${copied ? "#4ade80" : "rgba(148, 163, 184, 0.3)"}`,
                borderRadius: "6px",
                color: copied ? "#4ade80" : "#94a3b8",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                backdropFilter: "blur(4px)",
            }}
        >
            {copied ? "Copied!" : "Copy"}
        </button>
    );
};

export default AFHDLCopyButton;
