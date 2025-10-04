'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';

export default function Pricing() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['pricing'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.pricing);
    };
    fetchDictionary();
  }, [language]);

  if (!dict) return null;

  const unlimitedFeatures = [
      dict.premium.features.all,
      dict.premium.features.download,
      dict.premium.features.templates,
      dict.premium.features.support,
      "Unlimited Portfolio Generations",
      "Unlimited Deployments",
  ];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">{dict.title}</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {dict.subtitle}
          </p>
        </div>
        <div className="mx-auto mt-16 flex justify-center max-w-lg">
          
          <Card className="relative ring-2 ring-primary w-full">
            <div className="absolute top-0 right-4 -mt-3">
                <div className="flex items-center justify-center h-6 px-3 text-xs font-semibold tracking-wider text-primary-foreground uppercase bg-primary rounded-full">
                    {dict.mostPopular}
                </div>
            </div>
            <CardHeader>
              <CardTitle className="font-headline">Unlimited</CardTitle>
              <CardDescription>Get everything you need for one simple price.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight">$5</span>
                <span className="ml-1 text-sm font-semibold leading-6 text-muted-foreground">/ one-time</span>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {unlimitedFeatures.map(feature => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full btn-special">{dict.premium.cta}</Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </section>
  );
}
