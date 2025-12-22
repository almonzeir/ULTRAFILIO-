'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import en from '@/locales/en.json';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useShine } from '@/hooks/use-shine';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  image?: string;
  avatarId: string;
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
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
      className="group relative liquid-glass-card rounded-[2rem] p-8 sm:p-10 transition-all duration-500"
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 text-white/[0.05]">
        <Quote className="w-12 h-12" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-lg sm:text-xl font-medium mb-8 text-white/80 leading-relaxed">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10">
          <Image
            src={testimonial.image || `https://i.pravatar.cc/150?u=${testimonial.avatarId}`}
            alt={testimonial.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-sm text-white/40">{testimonial.title}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['testimonials']>(en.testimonials);

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const d = await getDictionary(language);
        if (d && d.testimonials) setDict(d.testimonials);
      } catch (err) {
        console.error("Testimonials translation error:", err);
      }
    };
    fetchDict();
  }, [language]);

  const testimonialsData: Testimonial[] = [
    {
      quote: "UltraFolio is a game-changer. I had a stunning portfolio live in 15 minutes without writing a single line of code. The templates are absolutely beautiful.",
      name: "Amro Alsharafi",
      title: "UX Designer",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      avatarId: "amro-alsharafi",
    },
    {
      quote: "As a developer, I appreciate good design. UltraFolio delivers an Apple-level experience. The ability to download the code is a huge plus for me.",
      name: "Abdalhafith",
      title: "Full-Stack Engineer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      avatarId: "abdalhafith-dev",
    },
    {
      quote: "The Arabic language support with proper RTL is fantastic. It's rare to see this level of quality and attention to detail for a global audience.",
      name: "Mohammed Moota",
      title: "Product Manager",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      avatarId: "mohammed-moota",
    },
    {
      quote: "UltraFolio saves me hours of work every time I need to update my portfolio. It's fast, intuitive, and makes me look great. A truly essential tool.",
      name: "Osama Alrusabi",
      title: "Freelance Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      avatarId: "osama-alrusabi",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 lg:py-48 overflow-hidden">
      {/* Living Background */}
      <MeshGradientBackground />

      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[25%] w-[500px] h-[500px] rounded-full bg-slate-400/10 blur-[150px]" />
        <div className="absolute bottom-[25%] right-[15%] w-[450px] h-[450px] rounded-full bg-slate-500/8 blur-[130px]" />
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
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {dict.title || 'Loved by professionals'}
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {dict.subtitle || 'See what our users have to say about their experience.'}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
