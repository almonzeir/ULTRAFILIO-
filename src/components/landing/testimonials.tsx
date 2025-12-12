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
      name: 'Amro Alsharafi',
      title: dict.testimonial1.title,
      image: '/amro.png', // Custom image
      avatarId: 'testimonial-avatar-1',
    },
    {
      quote: dict.testimonial2.quote,
      name: 'Abdalhafith',
      title: dict.testimonial2.title,
      avatarId: 'testimonial-avatar-2',
    },
    {
      quote: dict.testimonial3.quote,
      name: 'Mohammed Moota',
      title: dict.testimonial3.title,
      avatarId: 'testimonial-avatar-3',
    },
    {
      quote: dict.testimonial4.quote, // Using the 4th testimonial text from dictionary
      name: 'Osama Alrusabi',
      title: dict.testimonial4.title,
      avatarId: 'testimonial-avatar-4',
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
      className="py-24 sm:py-32 bg-background text-foreground overflow-hidden relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16 relative z-10">
        <motion.div className="mx-auto max-w-2xl text-center" variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-foreground">{dict.title}</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {dict.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative flex overflow-x-hidden group">

        {/* Gradients to fade edges - Monochrome */}
        <div className="absolute top-0 bottom-0 left-0 w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div className="py-12 animate-marquee flex space-x-8 whitespace-nowrap">
          {[...testimonialsData, ...testimonialsData].map((testimonial, index) => { // Duplicate for seamless loop
            const avatar = PlaceHolderImages.find((p) => p.id === testimonial.avatarId);
            const imageUrl = testimonial.image || (avatar ? avatar.imageUrl : '');

            return (
              <div key={index} className="w-[350px] sm:w-[500px] flex-shrink-0 inline-block px-1">
                {/* Monochrome Card */}
                <div className="h-full bg-background border border-border p-8 rounded-2xl hover:border-foreground/20 transition-colors shadow-sm">
                  <blockquote className="text-lg leading-7 tracking-tight text-foreground whitespace-normal mb-6 font-medium">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="flex items-center gap-x-4">
                    {imageUrl && (
                      <Image
                        className="h-12 w-12 rounded-full bg-muted object-cover ring-2 ring-border"
                        src={imageUrl}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                      />
                    )}
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    </div>
                  </figcaption>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
