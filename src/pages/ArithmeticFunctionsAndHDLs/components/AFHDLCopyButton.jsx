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
            className="afhdl-copy-btn"
            style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10 }}
        >
            {copied ? "Copied!" : "Copy"}
        </button>
    );
};

export default AFHDLCopyButton;
