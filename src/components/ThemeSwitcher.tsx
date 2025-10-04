'use client';
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const accentColors: { key: any; label: string; class: string }[] = [
  { key: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { key: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { key: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { key: 'gold', label: 'Gold', class: 'bg-amber-500' },
  { key: 'rose', label: 'Rose', class: 'bg-rose-500' },
];

export default function ThemeSwitcher() {
  const { theme, accent, toggleTheme, setAccent } = useContext(ThemeContext);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium"
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <div className="flex gap-2">
        {accentColors.map((c) => (
          <button
            key={c.key}
            onClick={() => setAccent(c.key)}
            className={`w-5 h-5 rounded-full ${c.class} ${
              accent === c.key ? 'ring-2 ring-offset-2 ring-gray-700 dark:ring-white' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
