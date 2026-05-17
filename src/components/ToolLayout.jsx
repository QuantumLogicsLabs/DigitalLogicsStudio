import React from 'react';
import RelatedSeoLinks from './seo/RelatedSeoLinks';

const ToolLayout = ({ title, subtitle, children }) => {
  return (
    <div className="calculator-container">
      <div className="grid-background"></div>

      <header className="header">
        <div className="header-content">
          <h1 className="title">{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
      </header>

      <div className="main-content">
        {children}
        <RelatedSeoLinks />
      </div>
    </div>
  );
};

export default ToolLayout;
