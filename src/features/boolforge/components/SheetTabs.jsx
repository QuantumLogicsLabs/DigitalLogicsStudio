import React from 'react';

export const SheetTabs = ({
  sheets,
  activeSheetId,
  onSwitchSheet,
  onAddSheet,
  onRenameSheet,
  onDeleteSheet
}) => {
  return (
    <div
      className="sheet-tabs-wrapper"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        display: 'flex',
        background: 'var(--bg-medium, #1a2540)',
        borderTopRightRadius: '12px',
        borderTop: '1px solid var(--border-color, #2a3550)',
        borderRight: '1px solid var(--border-color, #2a3550)',
        zIndex: 100,
        padding: '6px 12px 0 8px',
        gap: '4px',
        boxShadow: '2px -2px 10px rgba(0,0,0,0.2)'
      }}
    >
      {sheets.map((sheet) => (
        <div
          key={sheet.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: activeSheetId === sheet.id ? 'var(--accent-primary, #7c3aed)' : 'transparent',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            transition: 'background 0.2s',
          }}
        >
          <button
            onClick={() => onSwitchSheet(sheet.id)}
            onDoubleClick={() => onRenameSheet(sheet.id, sheet.name)}
            title="Double-click to rename"
            style={{
              padding: '8px 10px 8px 18px',
              background: 'transparent',
              color: activeSheetId === sheet.id ? '#fff' : 'var(--secondary-text, #8899aa)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeSheetId === sheet.id ? 'bold' : '500',
              fontSize: '0.85rem',
            }}
          >
            {sheet.name}
          </button>
          
          {/* 🚀 THE CROSS SIGN (DELETE BUTTON) */}
          {sheets.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents clicking the 'x' from switching the sheet
                onDeleteSheet(sheet.id);
              }}
              title="Close sheet"
              style={{
                padding: '0 12px 0 2px',
                background: 'transparent',
                border: 'none',
                color: activeSheetId === sheet.id ? '#e2e8f0' : 'var(--secondary-text, #8899aa)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                lineHeight: '1',
                opacity: 0.6,
                transition: 'opacity 0.2s, color 0.2s'
              }}
              onMouseOver={(e) => { e.target.style.opacity = 1; e.target.style.color = '#ef4444'; }}
              onMouseOut={(e) => { e.target.style.opacity = 0.6; e.target.style.color = activeSheetId === sheet.id ? '#e2e8f0' : 'var(--secondary-text, #8899aa)'; }}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAddSheet}
        title="Add New Sheet"
        style={{
          padding: '4px 12px',
          background: 'transparent',
          color: 'var(--secondary-text, #8899aa)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
        }}
        onMouseOver={(e) => (e.target.style.color = '#fff')}
        onMouseOut={(e) => (e.target.style.color = 'var(--secondary-text, #8899aa)')}
      >
        +
      </button>
    </div>
  );
};