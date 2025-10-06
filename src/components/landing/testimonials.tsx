'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

  if (!dict) {
    return (
      <section className="py-24 sm:py-32 bg-foreground text-background dark:bg-white dark:text-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="h-8 w-48 mx-auto bg-gray-600/30 rounded animate-pulse" />
            <div className="h-6 w-80 mx-auto mt-6 bg-gray-500/30 rounded animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const testimonialsData = [
    {
      quote: dict.testimonial1.quote,
      name: 'Sarah K.',
      title: dict.testimonial1.title,
      avatarId: 'testimonial-avatar-1',
    },
    {
      quote: dict.testimonial2.quote,
      name: 'Alex D.',
      title: dict.testimonial2.title,
      avatarId: 'testimonial-avatar-2',
    },
    {
      quote: dict.testimonial3.quote,
      name: 'Fatima A.',
      title: dict.testimonial3.title,
      avatarId: 'testimonial-avatar-3',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      className="py-24 sm:py-32 bg-foreground text-background dark:bg-white dark:text-black"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl text-center" variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">{dict.title}</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground dark:text-gray-600">
            {dict.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          variants={containerVariants}
        >
          {testimonialsData.map((testimonial, index) => {
            const avatar = PlaceHolderImages.find((p) => p.id === testimonial.avatarId);
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full flex flex-col">
                  <CardContent className="flex flex-col flex-grow p-6 text-left rtl:text-right">
                    <blockquote className="flex-grow text-lg leading-7 tracking-tight text-card-foreground">
                      <p>“{testimonial.quote}”</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      {avatar && (
                        <Image
                          className="h-12 w-12 rounded-full bg-muted object-cover"
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
