import React from "react";

const AFHDLSection = ({ title, description, children }) => {
  return (
    <section className="arithmetic-tools" style={{ marginBottom: "1rem" }}>
      <h4>{title}</h4>
      <p>{description}</p>
      {children}
    </section>
  );
};

export default AFHDLSection;
