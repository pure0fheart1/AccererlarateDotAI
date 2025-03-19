import React, { createContext, useState, useEffect, useContext } from 'react';

// Create theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or use dark as default
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  
  // Update body class and localStorage when theme changes
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Function to toggle between dark and light themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };
  
  // Context value
  const value = {
    theme,
    isDarkTheme: theme === 'dark',
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 