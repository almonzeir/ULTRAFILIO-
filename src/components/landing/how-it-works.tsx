'use client';

import { UploadCloud, Edit2, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState }from 'react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section 
      className="py-24 sm:py-32 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl lg:text-center" variants={itemVariants}>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline mb-2">{dict.eyebrow}</h2>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            {dict.title}
          </h3>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {dict.subtitle}
          </p>
        </motion.div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <motion.dl 
            className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div key={step.name} className="relative flex flex-col p-8 border border-gray-200 dark:border-gray-700 rounded-2xl" variants={itemVariants}>
                <dt className="flex-shrink-0 text-base font-semibold leading-7 text-foreground">
                  <div className="absolute top-8 left-8 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                    <step.icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                  </div>
                  <span className="ps-16">{step.name}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto ps-16">{step.description}</p>
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </motion.section>
  );
}
