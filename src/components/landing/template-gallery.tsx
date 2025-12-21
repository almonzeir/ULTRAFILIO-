'use client';

import Link from 'next/link';
import { ArrowRight, Monitor, Smartphone, Tablet, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import en from '@/locales/en.json';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useShine } from '@/hooks/use-shine';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';

interface Template {
  key: string;
  name: string;
  description: string;
  isPro: boolean;
}

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  useShine(cardRef);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.4 } }}
      className="group relative"
    >
      <Link href={`/preview/${template.key}`}>
        {/* Liquid Silver Glass Card */}
        <div className="relative aspect-[4/3] liquid-silver-glass rounded-[2rem] overflow-hidden transition-all duration-700 p-8 flex flex-col justify-between">

          {/* Pro Badge */}
          {template.isPro && (
            <div className="absolute top-5 right-5 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase liquid-silver-pill">
                <Sparkles className="w-3 h-3" />
                Pro
              </span>
            </div>
          )}

          {/* Background Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Floating Ring Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/[0.1] opacity-40 group-hover:scale-150 group-hover:opacity-20 transition-all duration-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/[0.05] opacity-30 group-hover:scale-125 group-hover:opacity-10 transition-all duration-700" />

          {/* Template Name - Large Typography */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-center silver-text">
              {template.name}
            </h3>
          </div>

          {/* Bottom Info */}
          <div className="relative z-10 pt-4 border-t border-white/[0.08]">
            <p className="text-sm text-white/40 text-center font-medium line-clamp-2">
              {template.description}
            </p>

            {/* View Button */}
            <div className="mt-4 flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-white/50 group-hover:text-white/80 transition-colors duration-500">
                Preview Template
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TemplateGallery() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['templateGallery']>(en.templateGallery);

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const d = await getDictionary(language);
        if (d && d.templateGallery) setDict(d.templateGallery);
      } catch (err) {
        console.error("Gallery translation error:", err);
      }
    };
    fetchDict();
  }, [language]);

  const templates: Template[] = [
    { key: 'aurora', name: 'Aurora', description: 'Northern lights inspired design with dynamic gradients', isPro: true },
    { key: 'modern', name: 'Modern', description: 'Clean and professional with smooth animations', isPro: false },
    { key: 'executive', name: 'Executive', description: 'Sophisticated design for business professionals', isPro: false },
    { key: 'creative', name: 'Creative', description: 'Bold and expressive for artists and designers', isPro: false },
    { key: 'minimalPlus', name: 'Minimal+', description: 'Elegantly simple with subtle refinements', isPro: false },
    { key: 'cyber', name: 'Cyber', description: 'Futuristic 3D design with matrix aesthetics', isPro: true },
  ];

  return (
    <section id="templates" className="relative py-24 sm:py-32 lg:py-48 overflow-hidden">
      {/* Living Background */}
      <MeshGradientBackground />

      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[40%] left-[10%] w-[500px] h-[500px] rounded-full bg-slate-400/10 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase liquid-silver-pill mb-6">
              Templates
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="silver-text">
                {dict.title}
              </span>
            </h2>
          </motion.div>

          {/* Device Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            {[Monitor, Tablet, Smartphone].map((Icon, i) => (
              <div
                key={i}
                className="p-3 liquid-silver-pill hover:scale-110 transition-transform duration-300 cursor-pointer"
              >
                <Icon className="w-5 h-5 text-white/60" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {templates.map((template, index) => (
            <TemplateCard key={template.key} template={template} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/demo-template"
            className="inline-flex items-center gap-3 px-8 py-4 liquid-silver-button rounded-full text-sm font-semibold tracking-wide group"
          >
            View All Templates
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
