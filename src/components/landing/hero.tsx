'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import en from '@/locales/en.json';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useShine } from '@/hooks/use-shine';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';

export default function Hero() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['hero']>(en.hero);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useShine(ctaBtnRef);
  useShine(mockupRef);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const d = await getDictionary(language);
        if (d && d.hero) setDict(d.hero);
      } catch (err) {
        console.error("Hero translation error:", err);
      }
    };
    fetchDict();
  }, [language]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
    >
      {/* Living Mesh Gradient Background */}
      <MeshGradientBackground />

      {/* Ambient Light Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-slate-400/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-slate-800/10 blur-[200px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 pt-32 pb-32">
        <div className="flex flex-col items-center text-center">

          {/* Main Headline - Pro Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h1 className="hero-title">
              {dict.title || "Turn Your Resume into a Stunning Portfolio"}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg sm:text-xl md:text-2xl text-white/50 max-w-2xl mb-12 font-medium tracking-tight leading-relaxed"
          >
            {dict.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-5"
          >
            {/* Primary CTA - Liquid Metal Button */}
            <Link href="/create">
              <button
                ref={ctaBtnRef}
                className="liquid-button-primary group relative h-14 sm:h-16 px-10 sm:px-14 rounded-full text-base sm:text-lg font-semibold"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {dict.ctaFree}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>

            {/* Secondary CTA - Ghost Glass Button */}
            <Link href="/demo-template">
              <button className="liquid-button-ghost group h-14 sm:h-16 px-10 sm:px-14 rounded-full text-base sm:text-lg font-semibold text-white/80 hover:text-white transition-colors">
                {dict.ctaDemo}
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Glass Mockup - The "Ice Block" */}
        <motion.div
          ref={mockupRef}
          style={{ y, opacity, willChange: 'transform, opacity' }}
          className="mt-20 sm:mt-28 relative mx-auto max-w-6xl aspect-video"
        >
          {/* Outer Glow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-white/5 to-transparent rounded-[4rem] blur-xl" />

          {/* Glass Container */}
          <div className="relative w-full h-full rounded-[2.5rem] sm:rounded-[3rem] liquid-glass-card overflow-hidden">
            {/* Browser Chrome */}
            <div className="absolute inset-x-0 top-0 h-10 sm:h-12 bg-white/[0.03] border-b border-white/[0.08] backdrop-blur-xl z-10 flex items-center px-5 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-6 w-48 rounded-lg bg-white/[0.05] border border-white/[0.08]" />
              </div>
            </div>

            {/* Video Content */}
            <div className="relative w-full h-full pt-10 sm:pt-12">
              <video
                poster="/image.png"
                src={language === 'ar' ? '/hero-video-ar.mp4' : '/hero-video.mp4'}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
