import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();
  
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
    >
      {isDarkTheme ? (
        <span className="toggle-icon">☀️</span>
      ) : (
        <span className="toggle-icon">🌙</span>
      )}
    </button>
  );
};

export default ThemeToggle; 