import React from "react";

const AFHDLCard = ({ title, subtitle, children }) => (
  <article className="afhdl-card">
    {title ? <h3 className="afhdl-card-title">{title}</h3> : null}
    {subtitle ? <p className="afhdl-card-subtitle">{subtitle}</p> : null}
    <div className="afhdl-card-content">{children}</div>
  </article>
);

export default AFHDLCard;
