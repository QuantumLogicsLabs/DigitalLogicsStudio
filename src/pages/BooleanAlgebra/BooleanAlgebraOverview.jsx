import React from 'react';
import ToolLayout from '../../components/ToolLayout';
import ExplanationBlock from '../../components/ExplanationBlock';
import InfoCards from './components/InfoCards';

const BooleanAlgebraOverview = () => {
  return (
    <ToolLayout title="Boolean Algebra" subtitle="Interactive Logic Explorer">
      <ExplanationBlock title="What is Boolean Algebra?">
        <p className="explanation-intro">
          Boolean Algebra is a mathematical system developed by George Boole in 1854 that forms the foundation of digital logic and computer science. It deals with binary variables (0 and 1) and logical operations that model how digital circuits process information.
        </p>
        <InfoCards />
      </ExplanationBlock>
    </ToolLayout>
  );
};

export default BooleanAlgebraOverview;
