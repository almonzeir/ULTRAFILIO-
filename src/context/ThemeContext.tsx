'use client';
import React, { createContext, useState, useEffect } from 'react';

interface ThemeContextProps {
  theme: 'light' | 'dark';
  accent: keyof typeof accents;
  toggleTheme: () => void;
  setAccent: (accent: keyof typeof accents) => void;
}

const accents = {
  blue: 'from-blue-500 to-blue-400',
  purple: 'from-purple-500 to-indigo-400',
  teal: 'from-teal-500 to-emerald-400',
  gold: 'from-amber-500 to-yellow-400',
  rose: 'from-rose-500 to-pink-400',
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  accent: 'blue',
  toggleTheme: () => {},
  setAccent: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [accent, setAccent] = useState<keyof typeof accents>('blue');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};
