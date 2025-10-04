'use client';

import { UploadCloud, Edit2, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';

interface Step {
  name: string;
  description: string;
  icon: LucideIcon;
}

export default function HowItWorks() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['howItWorks'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.howItWorks);
    };
    fetchDictionary();
  }, [language]);

  if (!dict) return null;

  const steps: Step[] = [
    {
      name: dict.step1.title,
      description: dict.step1.description,
      icon: UploadCloud,
    },
    {
      name: dict.step2.title,
      description: dict.step2.description,
      icon: Edit2,
    },
    {
      name: dict.step3.title,
      description: dict.step3.description,
      icon: Rocket,
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-base font-semibold leading-7 text-primary">{dict.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            {dict.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {dict.subtitle}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.name} className="relative flex flex-col">
                <dt className="flex-shrink-0 text-base font-semibold leading-7 text-foreground">
                  <div className="absolute start-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <span className="ps-16">{step.name}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto ps-16">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
