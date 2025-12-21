'use client';

import { Check, Rocket, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import en from '@/locales/en.json';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useShine } from '@/hooks/use-shine';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { initializePaddle, openPaddleCheckout, PADDLE_PRICES } from '@/lib/paddle';
import { useUser } from '@/hooks/useUser';

function PricingCard({ plan, index }: { plan: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useShine(cardRef);

  const isPro = plan.id === 'pro';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.4 } }}
      className={`relative liquid-glass-card rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 flex flex-col transition-all duration-500 ${isPro
        ? 'ring-1 ring-white/20 shadow-[0_0_60px_-15px_rgba(139,92,246,0.3)]'
        : ''
        }`}
    >
      {/* Popular Badge */}
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex-1">
        {/* Plan Name */}
        <h3 className="text-lg sm:text-xl font-semibold mb-6 text-white/60">
          {plan.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            {plan.price}
          </span>
          <span className="text-sm text-white/40 font-medium">
            {plan.period}
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-10">
          {plan.features.map((feature: any, i: number) => (
            <li key={i} className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-400" />
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
        onClick={plan.onClick}
        className={`group w-full h-14 sm:h-16 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-500 ${isPro
          ? 'liquid-button-primary'
          : 'liquid-button-ghost text-white/80 hover:text-white'
          }`}
      >
        {plan.buttonText}
        {isPro && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
    </motion.div>
  );
}

export default function Pricing() {
  const { language } = useLanguage();
  const router = useRouter();
  const { user } = useUser();
  const [dict, setDict] = useState<Dictionary['pricing']>(en.pricing);
  const [paddleReady, setPaddleReady] = useState(false);

  // Initialize Paddle
  useEffect(() => {
    initializePaddle().then(() => setPaddleReady(true));
  }, []);

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

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      router.push('/signup');
      return;
    }

    // Require login for paid plans
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (!paddleReady) {
      console.error('Paddle not ready');
      return;
    }

    // Open Paddle checkout
    const priceId = planId === 'pro_monthly'
      ? PADDLE_PRICES.pro_monthly
      : PADDLE_PRICES.pro_lifetime;

    await openPaddleCheckout({
      priceId,
      userId: user.id,
      userEmail: user.email || '',
      userName: user.user_metadata?.display_name,
    });
  };

  const plans = [
    {
      id: 'free',
      name: 'Essential',
      price: '$0',
      period: 'forever',
      features: dict.free.features ? Object.values(dict.free.features) : [],
      buttonText: 'Get Started Free',
      onClick: () => handleSubscribe('free'),
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$2',
      period: '/month first month, then $5',
      features: dict.premium.features ? Object.values(dict.premium.features).slice(0, 6) : [],
      buttonText: 'Upgrade to Pro',
      onClick: () => handleSubscribe('pro_monthly'),
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$15',
      period: 'one-time',
      features: ['Everything in Pro', 'Lifetime updates', 'Priority support'],
      buttonText: 'Get Lifetime Access',
      onClick: () => handleSubscribe('pro_lifetime'),
    },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32 lg:py-48 overflow-hidden">
      {/* Living Background */}
      <MeshGradientBackground />

      {/* Ambient Light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-slate-400/10 blur-[120px]" />
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
              Simple, transparent pricing
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Start for free, upgrade when you need more power.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
