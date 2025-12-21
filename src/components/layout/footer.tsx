'use client';

import { ArrowRight, ShieldCheck, Globe, Cpu } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import en from '@/locales/en.json';
import type { Dictionary } from '@/lib/dictionaries';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useShine } from '@/hooks/use-shine';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';

export default function Footer() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['footer']>(en.footer);
  const ctaCardRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  useShine(ctaCardRef);
  useShine(ctaBtnRef);

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const d = await getDictionary(language);
        if (d && d.footer) setDict(d.footer);
      } catch (err) {
        console.error("Footer translation error:", err);
      }
    };
    fetchDict();
    setYear(new Date().getFullYear());
  }, [language]);

  return (
    <footer className="relative pt-32 pb-16 overflow-hidden">
      {/* Living Background */}
      <MeshGradientBackground />

      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[150px]" />
        <div className="absolute bottom-[30%] right-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">

        {/* Main CTA Card - Frosted Glass */}
        <motion.div
          ref={ctaCardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-24 liquid-glass-card rounded-[2.5rem] sm:rounded-[3rem] p-12 sm:p-16 lg:p-20 text-center"
        >
          <div className="max-w-3xl mx-auto">
            {/* Headline - Metallic Gradient */}
            <h3 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
                Start Your Legacy
              </span>
            </h3>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/50 mb-12 font-medium leading-relaxed max-w-xl mx-auto">
              Deploy your world-class portfolio now with crystalline precision.
            </p>

            {/* CTA Button - Liquid Metal */}
            <Link
              ref={ctaBtnRef}
              href="/create"
              className="liquid-button-primary group inline-flex items-center gap-4 h-16 sm:h-20 px-12 sm:px-16 rounded-full text-lg sm:text-xl font-semibold"
            >
              <span className="relative z-10 flex items-center gap-3">
                Launch Now — Free
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-6 text-base sm:text-lg text-white/40 font-medium max-w-sm leading-relaxed">
              {dict.tagline}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-6">
              Product
            </h4>
            <nav className="flex flex-col gap-4">
              {[dict.product.features, dict.product.templates, dict.product.pricing].map(item => (
                <Link
                  key={item}
                  href="#"
                  className="text-white/60 hover:text-white transition-colors font-medium"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-6">
              Company
            </h4>
            <nav className="flex flex-col gap-4">
              {[dict.company.about, dict.company.blog, dict.company.contact].map(item => (
                <Link
                  key={item}
                  href="#"
                  className="text-white/60 hover:text-white transition-colors font-medium"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-6">
              Legal
            </h4>
            <nav className="flex flex-col gap-4">
              <Link
                href="/privacy"
                className="text-white/60 hover:text-white transition-colors font-medium"
              >
                {dict.legal.privacy}
              </Link>
              <Link
                href="/terms"
                className="text-white/60 hover:text-white transition-colors font-medium"
              >
                {dict.legal.terms}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
          <div className="text-sm text-white/30 font-medium">
            © {year} Ultrafolio. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-white/20">
            <ShieldCheck className="w-5 h-5" />
            <Globe className="w-5 h-5" />
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
