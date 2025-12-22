'use client';

import { UploadCloud, Wand2, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import en from '@/locales/en.json';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useShine } from '@/hooks/use-shine';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';

interface StepData {
  name: string;
  description: string;
  icon: LucideIcon;
  id: string;
}

function StepCard({ step, index }: { step: StepData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useShine(cardRef);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.4 } }}
      className="group relative liquid-glass-card rounded-[2rem] p-8 sm:p-10 h-full transition-all duration-500"
    >
      {/* Step Number */}
      <div className="absolute top-6 right-6 text-6xl font-bold text-white/[0.03] select-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Icon */}
      <div className="relative mb-8 inline-flex w-16 h-16 rounded-2xl items-center justify-center liquid-glass-pill">
        <step.icon className="w-7 h-7 text-white/80" />
      </div>

      {/* Content */}
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight">
        {step.name}
      </h3>
      <p className="text-base text-white/50 font-medium leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['howItWorks']>(en.howItWorks);

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const d = await getDictionary(language);
        if (d && d.howItWorks) setDict(d.howItWorks);
      } catch (err) {
        console.error("HowItWorks translation error:", err);
      }
    };
    fetchDict();
  }, [language]);

  const steps: StepData[] = [
    {
      id: 'upload',
      name: dict.step1?.title || 'Upload Your CV',
      description: dict.step1?.description || 'Simply upload your existing resume or CV in PDF format.',
      icon: UploadCloud,
    },
    {
      id: 'generate',
      name: dict.step2?.title || 'AI Magic',
      description: dict.step2?.description || 'Our AI extracts your information and generates a beautiful portfolio.',
      icon: Wand2,
    },
    {
      id: 'publish',
      name: dict.step3?.title || 'Go Live',
      description: dict.step3?.description || 'Publish your portfolio with one click and share it with the world.',
      icon: Rocket,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 lg:py-48 overflow-hidden">
      {/* Living Background */}
      <MeshGradientBackground />

      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] rounded-full bg-slate-500/8 blur-[150px]" />
        <div className="absolute bottom-[30%] left-[15%] w-[400px] h-[400px] rounded-full bg-slate-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase liquid-glass-pill text-white/60 mb-6">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {dict.title || 'Three simple steps'}
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {dict.subtitle || 'From resume to stunning portfolio in minutes.'}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
