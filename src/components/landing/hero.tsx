'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MacbookFrame } from '@/components/shared/device-frames';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const videoSrc = language === 'ar' ? '/hero-video-ar.mp4' : '/hero-video.mp4';

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
    <section className="relative overflow-hidden bg-background">
      <div className="relative container mx-auto px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline"
            variants={itemVariants}
          >
            {dict.title}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground"
            variants={itemVariants}
          >
            {dict.subtitle}
          </motion.p>
          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            variants={itemVariants}
          >
            <Link href="/create">
              <Button size="lg" className="btn-special">
                <Rocket className="mr-2 h-5 w-5" />
                {dict.ctaFree}
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              {dict.ctaDemo}
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="mt-16 flow-root sm:mt-24"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <div className="rounded-xl bg-muted/10 p-2 ring-1 ring-inset ring-foreground/10 lg:p-4">
            <MacbookFrame>
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="rounded-md w-full h-full object-cover"
              />
            </MacbookFrame>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
