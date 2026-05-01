import React from "react";

const AFHDLSection = ({ kicker, title, description, children, className = "" }) => {
  return (
    <section className={`afhdl-section ${className}`.trim()}>
      {(kicker || title || description) && (
        <div className="afhdl-section-header">
          {kicker ? <p className="afhdl-section-kicker">{kicker}</p> : null}
          {title ? <h2 className="afhdl-section-title">{title}</h2> : null}
          {description ? (
            <p className="afhdl-section-description">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
};

export default AFHDLSection;
