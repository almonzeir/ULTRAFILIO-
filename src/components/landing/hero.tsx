'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MacbookFrame } from '@/components/shared/device-frames';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';
import { Rocket, Sparkles } from 'lucide-react';
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
    <section className="relative isolate overflow-hidden bg-background">
      {/* Premium Dynamic Aura */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-violet-500/5 blur-[80px] rounded-full animate-bounce [animation-duration:10s]" />
      </div>

      <div className="relative container mx-auto px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:ring-white/10 dark:hover:ring-white/20 transition-all bg-background/50 backdrop-blur-md">
              {dict.badge} <Link href="/create" className="font-semibold text-foreground"><span className="absolute inset-0" aria-hidden="true" />{dict.tryNow} <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl font-headline"
            variants={itemVariants}
          >
            {dict.title}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto"
            variants={itemVariants}
          >
            {dict.subtitle}
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            variants={itemVariants}
          >
            <Link href="/create">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 shadow-xl shadow-black/5 dark:shadow-white/5">
                <Rocket className="mr-2 h-5 w-5" />
                {dict.ctaFree}
              </Button>
            </Link>
            <Link href="/demo-template">
              <Button size="lg" variant="ghost" className="rounded-full px-8 py-6 text-lg group hover:bg-muted font-medium">
                {dict.ctaDemo} <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Button>
            </Link>
          </motion.div>


        </motion.div>

        <motion.div
          className="mt-16 flow-root sm:mt-24"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10 backdrop-blur-3xl shadow-2xl">
            <MacbookFrame>
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="rounded-md w-full h-full object-cover grayscale-[20%]"
              />
            </MacbookFrame>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
