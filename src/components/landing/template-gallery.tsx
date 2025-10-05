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
    {
      key: 'modern',
      name: dict.modern.name,
      description: dict.modern.description,
      imageId: 'template-modern',
    },
    {
      key: 'minimalist',
      name: dict.minimalist.name,
      description: dict.minimalist.description,
      imageId: 'template-minimalist',
    },
    {
      key: 'basic',
      name: dict.basic.name,
      description: dict.basic.description,
      imageId: 'template-basic',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-black text-white dark:bg-white dark:text-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">{dict.title}</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {dict.subtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const image = PlaceHolderImages.find(p => p.id === template.imageId);
            return (
              <Card key={template.key} className="group relative overflow-hidden bg-card text-card-foreground border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="overflow-hidden rounded-lg">
                    <MacbookFrame>
                      {image && (
                         <Image
                            src={image.imageUrl}
                            alt={image.description}
                            data-ai-hint={image.imageHint}
                            width={1200}
                            height={800}
                            className="rounded-md transition-transform duration-500 group-hover:scale-105"
                          />
                      )}
                    </MacbookFrame>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg font-headline">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  </div>
                </CardContent>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="lg" variant="secondary" className="dark:text-black">
                    <Eye className="mr-2 h-4 w-4" />
                    {dict.preview}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
