'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MacbookFrame } from '@/components/shared/device-frames';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';

export default function Hero() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['hero'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.hero);
    };
    fetchDictionary();
  }, [language]);

  if (!dict) return null;

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative container mx-auto px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
            {dict.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {dict.subtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/create">
              <Button size="lg" className="btn-special">
                <Rocket className="mr-2 h-5 w-5" />
                {dict.ctaFree}
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              {dict.ctaDemo}
            </Button>
          </div>
        </div>
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-muted/10 p-2 ring-1 ring-inset ring-foreground/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <MacbookFrame>
              <video
                src="https://cdn.dribbble.com/userupload/11311029/file/original-5a7f999333946059341d3a584995f7c3.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="rounded-md w-full h-full object-cover"
              />
            </MacbookFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
