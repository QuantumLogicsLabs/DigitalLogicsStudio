import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button className="seq-theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ThemeToggle;
