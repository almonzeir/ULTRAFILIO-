
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    titleKey: 'modernTitle',
    descKey: 'modernDesc',
    imageUrl: '/placeholders/template-modern.jpg',
  },
  {
    id: 'minimalist',
    titleKey: 'minimalistTitle',
    descKey: 'minimalistDesc',
    imageUrl: '/placeholders/template-minimalist.jpg',
  },
  {
    id: 'basic',
    titleKey: 'basicTitle',
    descKey: 'basicDesc',
    imageUrl: '/placeholders/template-basic.jpg',
  },
];

export default function ChooseTemplatePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['chooseTemplatePage'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.chooseTemplatePage);
    };
    fetchDictionary();
  }, [language]);


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

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow bg-white dark:bg-black text-gray-900 dark:text-white font-inter px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{dict.title}</h1>
            <p className="text-center text-gray-500 mb-12">
              {dict.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                    <Image src="https://picsum.photos/seed/1/400/300" alt={dict[t.titleKey]} width={400} height={300} className="object-cover w-full h-full" />
                </div>
                <h2 className="text-xl font-semibold mb-1">{dict[t.titleKey]}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{dict[t.descKey]}</p>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-16">
            <Button
              variant="outline"
              onClick={() => router.push('/create')}
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              <span className="mx-2">{dict.backButton}</span>
            </Button>
            <button
              onClick={handleContinue}
              disabled={!selected}
              className={`px-8 py-3 rounded-xl text-white font-semibold transition ${
                selected
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              }`}
            >
              {dict.generateButton} →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
