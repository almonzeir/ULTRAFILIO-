'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';

export default function Testimonials() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['testimonials'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.testimonials);
    };
    fetchDictionary();
  }, [language]);

  if (!dict) return null;

  const testimonialsData = [
    {
      quote: dict.testimonial1.quote,
      name: "Sarah K.",
      title: dict.testimonial1.title,
      avatarId: "testimonial-avatar-1",
    },
    {
      quote: dict.testimonial2.quote,
      name: "Alex D.",
      title: dict.testimonial2.title,
      avatarId: "testimonial-avatar-2",
    },
    {
      quote: dict.testimonial3.quote,
      name: "Fatima A.",
      title: dict.testimonial3.title,
      avatarId: "testimonial-avatar-3",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-foreground text-background dark:bg-white dark:text-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">{dict.title}</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground dark:text-gray-600">
            {dict.subtitle}
          </p>
        </div>
        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((testimonial) => {
            const avatar = PlaceHolderImages.find(p => p.id === testimonial.avatarId);
            return (
              <Card key={testimonial.name} className="flex flex-col bg-card text-card-foreground border-border/50">
                <CardContent className="flex flex-col flex-grow p-6">
                  <blockquote className="flex-grow text-lg leading-7 tracking-tight text-card-foreground">
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    {avatar && (
                        <Image
                        className="h-12 w-12 rounded-full bg-muted"
                        src={avatar.imageUrl}
                        alt={testimonial.name}
                        data-ai-hint={avatar.imageHint}
                        width={48}
                        height={48}
                      />
                    )}
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    </div>
                  </figcaption>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
