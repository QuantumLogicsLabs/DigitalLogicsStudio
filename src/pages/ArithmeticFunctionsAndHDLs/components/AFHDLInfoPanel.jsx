import React from "react";

const AFHDLInfoPanel = ({ title, content, children }) => (
  <article className="afhdl-info-panel">
    {title ? <h4 className="afhdl-info-title">{title}</h4> : null}
    <div className="afhdl-info-content">
      {children || <p className="afhdl-info-body">{content}</p>}
    </div>
  </article>
);

export default AFHDLInfoPanel;
