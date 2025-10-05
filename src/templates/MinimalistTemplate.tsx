import React, { useContext } from 'react';
import { PortfolioData } from './types';
import { ThemeContext } from '../context/ThemeContext';

export default function MinimalistTemplate({ data }: { data: PortfolioData }) {
  const { theme } = useContext(ThemeContext);
  return (
    <main
      className={`max-w-4xl mx-auto px-6 py-20 font-sans transition ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div className="text-center">
        <h1 className="text-5xl font-bold">{data.personalInfo.fullName}</h1>
        <p className="text-lg opacity-80 mb-8">{data.personalInfo.title}</p>
      </div>
      <p className="opacity-70 mb-8 text-center">{data.about.extendedBio}</p>
      <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-medium">{exp.role}</h3>
            <p className="text-sm opacity-70">
              {exp.company} — {exp.start} to {exp.end}
            </p>
            <p className="opacity-80">{exp.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
