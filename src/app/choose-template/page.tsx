'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const templates = [
  {
    id: 'modern',
    title: 'Modern Template',
    desc: 'Sleek and stylish layout with bold typography and smooth spacing.',
  },
  {
    id: 'minimalist',
    title: 'Minimalist Template',
    desc: 'Clean and simple, focusing purely on your content.',
  },
  {
    id: 'basic',
    title: 'Basic Template',
    desc: 'A straightforward, classic resume-style layout.',
  },
];

export default function ChooseTemplatePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (!selected) return;
    localStorage.setItem('selectedTemplate', selected);
    router.push('/template-preview');
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-inter px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-4">Choose a Template</h1>
      <p className="text-center text-gray-500 mb-12">
        Select a design for your portfolio. You can customize colors later.
      </p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {templates.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`cursor-pointer p-8 rounded-2xl border transition text-left hover:shadow-xl ${
              selected === t.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <h2 className="text-2xl font-semibold mb-2">{t.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`px-8 py-3 rounded-xl text-white font-semibold transition ${
            selected
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          }`}
        >
          Preview My Portfolio →
        </button>
      </div>
    </main>
  );
}
