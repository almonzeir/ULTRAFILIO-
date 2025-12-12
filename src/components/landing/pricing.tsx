'use client';

import { Check, Sparkles, Zap, Crown, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PLANS } from '@/lib/plans';
import { useRouter } from 'next/navigation';

export default function Pricing() {
  const { language } = useLanguage();
  const router = useRouter();
  const [dict, setDict] = useState<Dictionary['pricing'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.pricing);
    };
    fetchDictionary();
  }, [language]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const handleSubscribe = (planId: string) => {
    // Redirect to checkout page which shows "FREE access during early access"
    router.push('/checkout');
  };

  return (
    <motion.section
      id="pricing"
      className="py-24 sm:py-32 bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div className="mx-auto max-w-2xl text-center mb-16" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Choose Your Plan
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when you need more. Pro plans help us cover hosting & AI API costs.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="mx-auto grid max-w-sm md:max-w-none grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          variants={containerVariants}
        >
          {/* FREE PLAN */}
          <motion.div variants={itemVariants}>
            <Card className="h-full flex flex-col bg-background border-2 border-border hover:border-foreground/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <CardTitle className="font-headline text-2xl">Free</CardTitle>
                <CardDescription className="text-base">
                  Perfect for trying things out
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight">$0</span>
                  <span className="ml-2 text-sm text-muted-foreground">forever</span>
                </div>
                <ul className="space-y-3 text-sm">
                  {PLANS.free.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 items-start text-muted-foreground">
                      <Check className="h-5 w-5 flex-none text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full h-12 rounded-xl text-base"
                  variant="outline"
                  onClick={() => handleSubscribe('free')}
                >
                  Get Started Free
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* PRO MONTHLY - Most Popular */}
          <motion.div variants={itemVariants} className="relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-0 right-0 mx-auto w-max z-20">
              <div className="px-4 py-1.5 text-xs font-bold tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 text-white uppercase rounded-full shadow-lg shadow-violet-500/30">
                Most Popular
              </div>
            </div>

            <Card className="h-full flex flex-col bg-gradient-to-b from-violet-600 to-indigo-700 text-white border-0 shadow-2xl shadow-violet-500/20 relative overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              <CardHeader className="pb-4 relative">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="font-headline text-2xl text-white">Pro Monthly</CardTitle>
                <CardDescription className="text-white/80 text-base">
                  Full power, cancel anytime
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6 relative">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-white">$5</span>
                  <span className="ml-2 text-sm text-white/70">/month</span>
                </div>

                {/* First month promo */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="font-bold text-yellow-100">First month only $3!</span>
                  </div>
                </div>

                <ul className="space-y-3 text-sm">
                  {PLANS.pro_monthly.features.slice(0, 6).map((feature, i) => (
                    <li key={i} className="flex gap-3 items-start text-white/90">
                      <div className="p-0.5 rounded-full bg-white/20 mt-0.5">
                        <Check className="h-4 w-4 flex-none text-white" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="relative">
                <Button
                  className="w-full h-12 rounded-xl text-base font-bold bg-white text-violet-700 hover:bg-white/90 shadow-lg"
                  onClick={() => handleSubscribe('pro_monthly')}
                >
                  Start Pro - $3 First Month
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* PRO LIFETIME - Best Value */}
          <motion.div variants={itemVariants} className="relative">
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-0 right-0 mx-auto w-max z-20">
              <div className="px-4 py-1.5 text-xs font-bold tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white uppercase rounded-full shadow-lg shadow-amber-500/30">
                Best Value
              </div>
            </div>

            <Card className="h-full flex flex-col bg-foreground text-background border-0 shadow-2xl relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="font-headline text-2xl text-background">Pro Lifetime</CardTitle>
                <CardDescription className="text-background/70 text-base">
                  Pay once, own forever
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-background">$15</span>
                  <span className="ml-2 text-sm text-background/60">one-time</span>
                </div>

                {/* Savings badge */}
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Save $45/year vs monthly
                </div>

                <ul className="space-y-3 text-sm">
                  {PLANS.pro_lifetime.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 items-start text-background/80">
                      <div className="p-0.5 rounded-full bg-background/10 mt-0.5">
                        <Check className="h-4 w-4 flex-none text-background" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full h-12 rounded-xl text-base font-bold bg-background text-foreground hover:bg-background/90"
                  onClick={() => handleSubscribe('pro_lifetime')}
                >
                  Get Lifetime Access - $15
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-12 max-w-lg mx-auto"
          variants={itemVariants}
        >
          Pro plans help us cover server hosting and AI API costs. Your support keeps UltraFolio running!
        </motion.p>
      </div>
    </motion.section>
  );
}
