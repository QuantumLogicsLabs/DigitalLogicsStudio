import React from 'react';
import Boolforge from '../pages/Boolforge';

const CircuitModal = ({ open, onClose, expression, variables }) => {
    if (!open) return null;
    return (
        <div
            className="circuit-modal-overlay"
            onClick={(e) => {
                if (e.target.className === 'circuit-modal-overlay') {
                    onClose();
                }
            }}
        >
            <div className="circuit-modal-container">
                <button
                    className="circuit-modal-close"
                    onClick={onClose}
                    title="Close Circuit Editor"
                >
                    ✕
                </button>
                <Boolforge simplifiedExpression={expression} variables={variables} />
            </div>
            <style jsx>{`
        .circuit-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          backdrop-filter: blur(4px);
        }
        .circuit-modal-container {
          position: relative;
          width: 95vw;
          height: 90vh;
          background: var(--bg-primary, #0f172a);
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          border: 2px solid rgba(99, 102, 241, 0.3);
        }
        .circuit-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .circuit-modal-close:hover {
          background: rgba(220, 38, 38, 1);
          transform: rotate(90deg) scale(1.1);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }
        .circuit-modal-close:active {
          transform: rotate(90deg) scale(0.95);
        }
        @media (max-width: 768px) {
          .circuit-modal-container {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          }
          .circuit-modal-overlay {
            padding: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default CircuitModal;
