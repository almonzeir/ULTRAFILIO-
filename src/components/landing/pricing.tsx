'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
  
  const freeFeatures = [
      dict.free.features.generate,
      dict.free.features.editor,
      dict.free.features.deploy,
      dict.free.features.github,
  ];

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
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-stretch gap-8 sm:mt-20 lg:max-w-4xl lg:grid-cols-2">
          
          <Card className="flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
             <CardHeader>
              <CardTitle className="font-headline">{dict.free.title}</CardTitle>
              <CardDescription>{dict.free.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight">{dict.free.price}</span>
                <span className="ml-1 text-sm font-semibold leading-6 text-muted-foreground">/{dict.free.period}</span>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {freeFeatures.map(feature => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-foreground" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black" variant="outline">{dict.free.cta}</Button>
            </CardFooter>
          </Card>

          <Card className="relative border-2 border-black dark:border-white flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 dark:bg-neutral-900">
            <div className="absolute top-0 right-4 -mt-3">
                <div className="flex items-center justify-center h-6 px-3 text-xs font-semibold tracking-wider bg-black text-white dark:bg-white dark:text-black uppercase rounded-full">
                    {dict.mostPopular}
                </div>
            </div>
            <CardHeader>
              <CardTitle className="font-headline">{dict.premium.title}</CardTitle>
              <CardDescription>{dict.premium.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight">$5</span>
                <span className="ml-1 text-sm font-semibold leading-6 text-muted-foreground">/ one-time</span>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {unlimitedFeatures.map(feature => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-foreground" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className={cn("w-full btn-special", "dark:bg-white dark:text-black")}>{dict.premium.cta}</Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </section>
  );
}
