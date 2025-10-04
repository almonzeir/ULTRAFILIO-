import React, { useContext } from 'react';
import { PortfolioData } from './types';
import { ThemeContext } from '../context/ThemeContext';

export default function ModernTemplate({ data }: { data: PortfolioData }) {
  const { theme, accent } = useContext(ThemeContext);

  return (
    <main
      className={`max-w-6xl mx-auto px-8 py-20 font-inter transition bg-gradient-to-b ${
        theme === 'dark'
          ? 'from-gray-900 to-black text-gray-100'
          : 'from-white to-gray-50 text-gray-900'
      }`}
    >
      <section className="text-center mb-16">
        <h1
          className={`text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${
            accent === 'blue'
              ? 'from-blue-500 to-sky-400'
              : accent === 'purple'
              ? 'from-purple-500 to-indigo-400'
              : accent === 'teal'
              ? 'from-teal-400 to-emerald-300'
              : accent === 'gold'
              ? 'from-amber-500 to-yellow-400'
              : 'from-rose-500 to-pink-400'
          }`}
        >
          {data.name}
        </h1>
        <p className="text-lg opacity-80">{data.title}</p>
        <p className="mt-6 text-gray-500 max-w-2xl mx-auto">{data.summary}</p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-semibold">{exp.role}</h3>
              <p className="text-sm opacity-70">
                {exp.company} — {exp.start} to {exp.end}
              </p>
              <p className="opacity-80 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          {data.projects.map((p, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="opacity-80 mt-2">{p.description}</p>
              {p.link && (
                <a
                  href={p.link}
                  className={`text-sm font-medium hover:underline bg-gradient-to-r ${
                    accent === 'blue'
                      ? 'from-blue-400 to-blue-500'
                      : accent === 'purple'
                      ? 'from-purple-400 to-indigo-500'
                      : 'from-teal-400 to-emerald-500'
                  } bg-clip-text text-transparent`}
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, i) => (
            <span
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${
                accent === 'blue'
                  ? 'from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700'
                  : accent === 'purple'
                  ? 'from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-700'
                  : 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
