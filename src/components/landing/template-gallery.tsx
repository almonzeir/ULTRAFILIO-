'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MacbookFrame } from '@/components/shared/device-frames';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Eye } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';
import PortfolioCarousel from './portfolio-carousel';

export default function TemplateGallery() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['templateGallery'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.templateGallery);
    };
    fetchDictionary();
  }, [language]);

  if (!dict) return null;

  const templates = [
    { key: 'aurora', name: dict.aurora?.name || 'Aurora', description: dict.aurora?.description || 'Award-winning design with aurora backgrounds.', image: '/templates/aurora.png', isPro: true },
    { key: 'modern', name: dict.modern.name, description: dict.modern.description, image: '/templates/modern.png', isPro: false },
    { key: 'executive', name: dict.executive.name, description: dict.executive.description, image: '/templates/executive.png', isPro: false },
    { key: 'creative', name: dict.creative.name, description: dict.creative.description, image: '/templates/creative.png', isPro: false },
    { key: 'minimalPlus', name: dict.minimalPlus.name, description: dict.minimalPlus.description, image: '/templates/minimal-plus.png', isPro: false },
    { key: 'generated', name: dict.generated.name, description: dict.generated.description, image: '/templates/futuristic.png', isPro: false },
    { key: 'minimalist', name: dict.minimalist.name, description: dict.minimalist.description, image: '/templates/minimalist.png', isPro: false },
    { key: 'cyber', name: dict.cyber.name, description: dict.cyber.description, image: '/templates/cyber.png', isPro: true },
    { key: 'basic', name: dict.basic.name, description: dict.basic.description, image: '/templates/basic.png', isPro: false },
  ];

  return (
    <section id="templates" className="py-24 sm:py-32 bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-indigo-900/10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{dict.title}</h2>
          <p className="mt-6 text-xl leading-8 text-gray-400">
            {dict.subtitle}
          </p>
        </div>

        <div className="mt-16">
          <PortfolioCarousel items={templates} />
        </div>
      </div>
    </section>
  );
}
