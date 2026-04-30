import React from 'react';
import ExplanationBlock from '../../../components/ExplanationBlock';

const InfoCards = ({ varsLength, combinations }) => {
  return (
    <ExplanationBlock title="Understanding the Basics">
      <div className="comparison-grid">
        <div className="info-card">
          <h4>Variables & Combinations</h4>
          <p>For {varsLength} variables, there are 2<sup>{varsLength}</sup> = {combinations} possible input combinations.</p>
          <ul>
            <li><strong>Literal:</strong> A variable (A) or its complement (A')</li>
            <li><strong>Minterm:</strong> A product term (AND) containing all variables</li>
            <li><strong>Maxterm:</strong> A sum term (OR) containing all variables</li>
          </ul>
        </div>
        
        <div className="key-insight">
          <h4>Standard Operators</h4>
          <ul>
            <li><strong>AND (&, •):</strong> 1 only if all inputs are 1</li>
            <li><strong>OR (|, +):</strong> 1 if at least one input is 1</li>
            <li><strong>NOT (!, '):</strong> Inverts the input (0→1, 1→0)</li>
            <li><strong>XOR (^):</strong> 1 if inputs are different</li>
          </ul>
        </div>
      </div>
    </ExplanationBlock>
  );
};

export default InfoCards;
