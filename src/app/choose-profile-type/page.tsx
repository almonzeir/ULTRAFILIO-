'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const profiles = [
  {
    id: 'professional',
    title: 'Professional Profile',
    desc: 'Perfect for job seekers or corporate professionals.',
  },
  {
    id: 'creative',
    title: 'Creative Portfolio',
    desc: 'Ideal for designers, photographers, and creative minds.',
  },
  {
    id: 'personal',
    title: 'Personal Brand',
    desc: 'Focused on storytelling and personal achievements.',
  },
];

export default function ChooseProfileTypePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (!selected) return;
    localStorage.setItem('profileType', selected);
    router.push('/ai-building');
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-inter px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-4">Choose Your Profile Type</h1>
      <p className="text-center text-gray-500 mb-12">
        Select what type of portfolio you want the AI to design.
      </p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`p-8 rounded-2xl border transition text-left hover:shadow-xl ${
              selected === p.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <h2 className="text-2xl font-semibold mb-2">{p.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{p.desc}</p>
          </button>
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
          Generate My Portfolio →
        </button>
      </div>
    </main>
  );
}
