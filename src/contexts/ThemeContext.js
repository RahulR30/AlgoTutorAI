import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const [isSystemTheme, setIsSystemTheme] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Update localStorage
    if (!isSystemTheme) {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  }, [theme, isSystemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (isSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [isSystemTheme]);

  const setLightTheme = () => {
    setTheme('light');
    setIsSystemTheme(false);
  };

  const setDarkTheme = () => {
    setTheme('dark');
    setIsSystemTheme(false);
  };

  const setSystemTheme = () => {
    setIsSystemTheme(true);
    // Set theme based on current system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const toggleTheme = () => {
    if (isSystemTheme) {
      // If using system theme, switch to manual light
      setLightTheme();
    } else {
      // Toggle between light and dark
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  const value = {
    theme,
    isSystemTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
