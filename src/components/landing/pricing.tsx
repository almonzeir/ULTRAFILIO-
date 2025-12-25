'use client';

import { Check, Rocket, ArrowRight, Gift, Sparkles, Trophy } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import en from '@/locales/en.json';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useShine } from '@/hooks/use-shine';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { usePaddle } from '@/hooks/use-paddle';

function PricingCard({ plan, index }: { plan: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useShine(cardRef);

  const isPro = plan.id === 'pro';
  const isAnnual = plan.id === 'pro_annual';
  const isHighlighted = isPro || isAnnual;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.4 } }}
      className={`relative liquid-glass-card rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 flex flex-col transition-all duration-500 overflow-visible ${isHighlighted
        ? 'ring-1 ring-white/20 shadow-[0_0_60px_-15px_rgba(255,255,255,0.15)]'
        : ''
        }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
          <span className="px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase shadow-lg bg-gradient-to-r from-white/90 to-white/70 text-black/80 backdrop-blur-sm border border-white/20">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="flex-1">
        {/* Plan Name */}
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white/60">
          {plan.name}
        </h3>

        {/* Savings Badge */}
        {plan.savings && (
          <div className="mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/20">
              {plan.savings}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          {plan.originalPrice && (
            <span className="text-2xl text-white/30 line-through font-medium">
              {plan.originalPrice}
            </span>
          )}
          <span className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            {plan.price}
          </span>
        </div>
        <p className="text-sm text-white/40 font-medium mb-8">
          {plan.period}
        </p>

        {/* Features */}
        <ul className="space-y-4 mb-10">
          {plan.features.map((feature: any, i: number) => (
            <li key={i} className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-white/70 font-medium leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={plan.onClick}
        className={`group w-full h-14 sm:h-16 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-500 relative z-20 ${isHighlighted
          ? 'liquid-button-primary'
          : 'liquid-button-ghost text-white/80 hover:text-white'
          }`}
      >
        {plan.buttonText}
        {isHighlighted && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
    </motion.div>
  );
}

export default function Pricing() {
  const { user } = useUser(); // Simplified - only need user for redirect logic
  const { language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const { openCheckout } = usePaddle();
  const [dict, setDict] = useState<Dictionary['pricing']>(en.pricing);


  useEffect(() => {
    const fetchDict = async () => {
      try {
        const d = await getDictionary(language);
        if (d && d.pricing) setDict(d.pricing);
      } catch (err) {
        console.error("Pricing translation error:", err);
      }
    };
    fetchDict();
  }, [language]);

  // PRO CONSTRAINTS DISABLED - Everything is free for first 1000 users
  // Simply redirect users to signup or dashboard
  const handleSubscribe = async (planId: string) => {
    // If user is logged in, go to dashboard
    if (user) {
      router.push('/dashboard');
      return;
    }

    // Otherwise, go to signup
    router.push('/signup');
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '1 Portfolio',
        'Basic Templates',
        'AI CV Parsing',
        'Live Editor',
        'Subdomain Hosting',
      ],
      buttonText: 'Get Started Free',
      onClick: () => handleSubscribe('free'),
    },
    {
      id: 'pro',
      name: 'Pro Monthly',
      price: '$0',
      originalPrice: '$5',
      period: 'Early Bird Special',
      badge: 'Popular',
      features: [
        'Unlimited Portfolios',
        'All Premium Templates',
        'Custom Domain',
        'Download Source Code',
        'Priority Support',
        'No Watermark',
      ],
      buttonText: 'Claim Free Access',
      onClick: () => handleSubscribe('pro_monthly'),
    },
    {
      id: 'pro_annual',
      name: 'Annual Pro',
      price: '$0',
      originalPrice: '$45',
      period: 'Early Bird Special',
      badge: 'Best Value',
      features: [
        'Everything in Pro Monthly',
        'Annual Commitment',
        'All Future Templates',
        'Priority Support',
        'Early Access to Features',
      ],
      buttonText: 'Claim Free Year',
      onClick: () => handleSubscribe('pro_annual'),
    },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32 lg:py-20 overflow-hidden">
      {/* Living Background */}
      <MeshGradientBackground />

      {/* Ambient Light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-slate-400/10 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-slate-500/8 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase liquid-glass-pill text-white/60 mb-6">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {dict.title || 'Simple, transparent pricing'}
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10">
            {dict.subtitle || 'Start for free, upgrade when you need more power.'}
          </p>

          {/* Silver Liquid Glass Banner - Grand Opening */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(255,255,255,0.15)] mt-14 mb-16 relative overflow-hidden group"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-inner group-hover:bg-white/15 transition-colors">
              <Trophy className="w-8 h-8 text-white/80" />
            </div>

            <div className="text-center sm:text-left">
              <div className="text-2xl font-black text-white flex items-center gap-2 justify-center sm:justify-start tracking-tighter">
                GRAND OPENING SPECIAL
                <span className="flex h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
              </div>
              <p className="text-white/60 font-medium text-lg max-w-lg">
                For the <span className="text-white font-black underline decoration-white/30">first 1000 users</span>, all Pro features are now open for $0.
              </p>
            </div>

            <div className="hidden sm:block h-12 w-px bg-white/10 mx-2" />

            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-white/70 uppercase tracking-widest shadow-sm">
                Limited Time
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section >
  );
};
