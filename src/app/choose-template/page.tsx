'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

const templates = [
  {
    id: 'modern',
    title: 'Modern Template',
    desc: 'Sleek and stylish layout with bold typography and smooth spacing.',
    imageUrl: '/placeholders/template-modern.jpg',
  },
  {
    id: 'minimalist',
    title: 'Minimalist Template',
    desc: 'Clean and simple, focusing purely on your content.',
    imageUrl: '/placeholders/template-minimalist.jpg',
  },
  {
    id: 'basic',
    title: 'Basic Template',
    desc: 'A straightforward, classic resume-style layout.',
    imageUrl: '/placeholders/template-basic.jpg',
  },
];

export default function ChooseTemplatePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check for uploadMeta instead of cvFile
    const uploadMeta = localStorage.getItem('uploadMeta');
    if (!uploadMeta) {
      toast({
        variant: 'destructive',
        title: 'CV not found!',
        description: 'Please upload your CV before choosing a template.',
      });
      router.push('/create'); // Redirect to the consolidated upload page
    }
  }, [router, toast]);

  const handleContinue = () => {
    if (!selected) return;
    // Persist chosenTemplate
    localStorage.setItem('chosenTemplate', selected);
    router.push('/ai-building');
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-inter px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-4">Choose a Template</h1>
      <p className="text-center text-gray-500 mb-12">
        Select a design for your portfolio. You can customize colors later.
      </p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {templates.map((t) => (
          <Card
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition text-left hover:shadow-xl hover:-translate-y-1 ${
              selected === t.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-800'
            }`}
          >
            <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden">
                {/* Placeholder for image preview */}
                <Image src="https://picsum.photos/seed/1/400/300" alt={t.title} width={400} height={300} className="object-cover w-full h-full" />
            </div>
            <h2 className="text-xl font-semibold mb-1">{t.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t.desc}</p>
          </Card>
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