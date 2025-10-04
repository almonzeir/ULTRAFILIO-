import React, { useContext } from 'react';
import { PortfolioData } from './types';
import { ThemeContext } from '../context/ThemeContext';

export default function BasicTemplate({ data }: { data: PortfolioData }) {
  const { theme } = useContext(ThemeContext);

  return (
    <main
      className={`max-w-3xl mx-auto border rounded-lg px-10 py-12 transition ${
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100 border-gray-800'
          : 'bg-white text-gray-900 border-gray-200'
      }`}
    >
      <header className="mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="opacity-70">{data.title}</p>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p className="opacity-80">{data.summary}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-3">
            <strong>{exp.role}</strong> – {exp.company}
            <div className="text-sm opacity-70">
              {exp.start} to {exp.end}
            </div>
            <p className="text-sm opacity-80">{exp.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
