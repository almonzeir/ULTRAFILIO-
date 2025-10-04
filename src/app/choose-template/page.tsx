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
    desc: 'Clean black and white design with balanced whitespace and structure.',
  },
  {
    id: 'basic',
    title: 'Basic Template',
    desc: 'Classic and professional resume-style layout with clear sections.',
  },
];

export default function TemplateSelectionPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handlePreview = () => {
    if (!selected) return;
    localStorage.setItem('selectedTemplate', selected);
    router.push('/template-preview');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20 font-inter">
      <h1 className="text-4xl font-bold text-center mb-4">Choose Your Template</h1>
      <p className="text-center text-gray-500 mb-12">Pick a base layout for your portfolio.</p>

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
          onClick={handlePreview}
          disabled={!selected}
          className={`px-8 py-3 rounded-xl text-white font-semibold transition ${
            selected
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          }`}
        >
          Preview Template →
        </button>
      </div>
    </main>
  );
}
