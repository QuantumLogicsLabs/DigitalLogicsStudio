import React, { useEffect } from 'react';

const ShowWorkToggle = ({ showWork, setShowWork }) => {
  useEffect(() => {
    try { document.documentElement.setAttribute('data-show-work', showWork ? 'true' : 'false'); } catch (e) {}
  }, [showWork]);

  return (
    <button
      className={`seq-sim-toggle ${showWork ? 'on' : 'off'}`}
      onClick={() => setShowWork((s) => !s)}
      aria-pressed={showWork}
      title="Show step-by-step work"
    >
      {showWork ? 'Show Work' : 'Show Result'}
    </button>
  );
};

export default ShowWorkToggle;
