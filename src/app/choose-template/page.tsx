'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { useColorTheme } from '@/context/color-theme-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Check, ArrowRight, Sparkles, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const templates = [
  {
    description: 'Award-winning design with aurora backgrounds, bento grids, and magnetic effects.',
  },
  {
    id: 'liquid-silk',
    name: 'Liquid Silk',
    description: 'Architectural minimalism with mesh gradients and fluid architectural typography.',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Premium & Dynamic design with smooth animations and modern aesthetics.',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional & Bold design with glassmorphism effects for senior professionals.',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic & Unique with bold gradients and playful animations.',
  },
  {
    id: 'minimal-plus',
    name: 'Minimal Plus',
    description: 'Clean & Elegant with sophistical interactions. Perfect for developers.',
  },
  {
    id: 'generated',
    name: 'Futuristic',
    description: 'Tech-Forward design with cutting-edge styling and modern components.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Ultra Simple and distraction-free. Focus on your content.',
  },

  {
    id: 'cyber',
    name: 'Cyber 3D',
    description: 'Experimental 3D Interactive Experience with scrolling particle effects.',
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Classic Resume style. Clean, professional, and traditional.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Loading component - use explicit colors as fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" style={{ color: '#000000' }} />
        <p style={{ color: '#666666' }}>Loading templates...</p>
      </div>
    </div>
  );
}

// Main component content
function ChooseTemplateContent() {
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('portfolioId');
  const { toast } = useToast();
  const { language } = useLanguage();
  const { theme } = useColorTheme();
  const [dict, setDict] = useState<Dictionary['chooseTemplatePage'] | null>(null);

  // Detect mobile to prevent heavy iframe loading
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.chooseTemplatePage);
    };
    fetchDictionary();
  }, [language]);

  useEffect(() => {
    if (mounted && !portfolioId) {
      toast({
        variant: 'destructive',
        title: 'Portfolio not found!',
        description: 'Please create a portfolio first.',
      });
      router.push('/create');
    }
  }, [portfolioId, router, toast, mounted]);

  const handleContinue = async () => {
    if (!selected || !portfolioId) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ template_id: selected })
        .eq('id', portfolioId);

      if (error) {
        console.error('Error saving template:', error);
      }

      router.push(`/preview/${portfolioId}`);
    } catch (e) {
      console.error('Navigation error', e);
      router.push(`/preview/${portfolioId}`);
    }
  };

  // Show loading until mounted and dict is ready
  if (!mounted || !dict) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <Header />

      {/* --- PREMIUM DYNAMIC AURA --- */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-blue-500/5 blur-[100px] rounded-full" />
        <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] bg-violet-500/5 blur-[80px] rounded-full animate-bounce [animation-duration:20s]" />
      </div>

      <main className="flex-grow px-4 md:px-6 py-12 md:py-20 relative z-10">
        {/* WIDER CONTAINER */}
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            className="text-center mb-16 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Design System Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest mb-6"
            >
              <Sparkles className="w-3 h-3" />
              Expert-Crafted Design Systems
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 font-headline">
              {dict.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {dict.subtitle}
            </p>
          </motion.div>

          {/* Template Grid */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {templates.map((template, index) => {
              const isSelected = selected === template.id;
              // Randomly assign badges for demo purposes
              const isNew = template.id === 'aurora' || template.id === 'cyber' || template.id === 'liquid-silk';
              const isPopular = template.id === 'modern' || template.id === 'executive';

              return (
                <motion.div key={template.id} variants={itemVariants} className="h-full">
                  <div
                    onClick={() => setSelected(template.id)}
                    className={cn(
                      "group relative cursor-pointer rounded-3xl transition-all duration-500 h-full",
                      isSelected
                        ? 'ring-4 ring-primary ring-offset-4 ring-offset-background scale-[1.03] shadow-2xl'
                        : 'hover:scale-[1.02] hover:shadow-2xl shadow-sm'
                    )}
                  >
                    {/* Badge */}
                    {(isNew || isPopular) && (
                      <div className="absolute -top-3 -right-3 z-20">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg ring-1 ring-white/10",
                          isNew ? "bg-indigo-500 text-white" : "bg-emerald-500 text-white"
                        )}>
                          {isNew ? 'New' : 'Popular'}
                        </span>
                      </div>
                    )}

                    {/* Card Container */}
                    <div className="bg-card overflow-hidden rounded-[calc(1.5rem-2px)] border border-border flex flex-col h-full bg-gradient-to-b from-card to-muted/20">

                      {/* Live Preview Area */}
                      <div className="relative aspect-[16/11] overflow-hidden bg-muted group-hover:bg-muted/50 transition-colors">
                        {isMobile ? (
                          /* Mobile: Beautiful template-specific preview */
                          <div className={cn(
                            "absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500",
                            template.id === 'aurora' && "bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-cyan-400/30",
                            template.id === 'liquid-silk' && "bg-gradient-to-br from-violet-600/20 via-indigo-500/30 to-purple-400/20",
                            template.id === 'modern' && "bg-gradient-to-br from-blue-600/30 via-indigo-500/20 to-purple-500/30",
                            template.id === 'executive' && "bg-gradient-to-br from-slate-800/40 via-gray-700/30 to-slate-600/40",
                            template.id === 'creative' && "bg-gradient-to-br from-orange-500/30 via-pink-500/20 to-yellow-400/30",
                            template.id === 'minimal-plus' && "bg-gradient-to-br from-emerald-500/20 via-teal-400/10 to-green-500/20",
                            template.id === 'generated' && "bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-teal-400/30",
                            template.id === 'minimalist' && "bg-gradient-to-br from-neutral-400/20 via-gray-300/10 to-neutral-500/20",
                            template.id === 'cyber' && "bg-gradient-to-br from-green-500/30 via-emerald-400/20 to-lime-500/30",
                            template.id === 'basic' && "bg-gradient-to-br from-slate-500/20 via-gray-400/10 to-slate-600/20",
                          )}>
                            <div className="w-full max-w-[200px] space-y-3 backdrop-blur-sm bg-background/40 p-4 rounded-xl border border-white/10">
                              {/* Mini template mockup */}
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 mx-auto" />
                              <div className="h-2 w-3/4 mx-auto rounded-full bg-foreground/20" />
                              <div className="h-1.5 w-1/2 mx-auto rounded-full bg-foreground/10" />
                              <div className="grid grid-cols-3 gap-1 pt-2">
                                <div className="h-6 rounded bg-foreground/10" />
                                <div className="h-6 rounded bg-foreground/10" />
                                <div className="h-6 rounded bg-foreground/10" />
                              </div>
                            </div>
                            <div className="mt-4 text-sm font-bold text-foreground/80">{template.name}</div>
                          </div>
                        ) : portfolioId ? (
                          <div className="w-[400%] h-[400%] origin-top-left scale-[0.25] select-none pointer-events-none bg-background transition-transform duration-700 group-hover:scale-[0.27]">
                            <iframe
                              src={`/render/${portfolioId}?template=${template.id}&theme=${theme || 'modern'}`}
                              className="w-full h-full border-0"
                              tabIndex={-1}
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-muted animate-pulse" />
                        )}

                        {/* Selection Overlay */}
                        <div className={cn(
                          "absolute inset-0 transition-all duration-500",
                          isSelected ? 'bg-primary/10' : 'bg-transparent group-hover:bg-primary/5'
                        )} />

                        {/* Quick View Button on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {!isSelected && (
                            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md text-foreground px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              Select Template
                            </div>
                          )}
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-primary text-primary-foreground p-3 rounded-full shadow-2xl ring-4 ring-primary/20"
                            >
                              <Check className="w-6 h-6" strokeWidth={3} />
                            </motion.div>
                          </div>
                        )}

                        {/* Decorative Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
                      </div>

                      {/* Card Footer - Glassmorphism style */}
                      <div className="p-6 md:p-8 flex flex-col flex-grow bg-card transition-colors group-hover:bg-muted/10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl md:text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                            {template.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom Actions - Fixed to Bottom or Scrolling? Let's make it a floating bar for better UX */}
          <motion.div
            className="sticky bottom-8 left-0 right-0 z-50 flex items-center justify-center gap-4 mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-background/80 backdrop-blur-2xl border border-border p-2 rounded-2xl shadow-2xl flex items-center gap-3">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.back()}
                className="rounded-xl hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {dict.backButton}
              </Button>

              <div className="h-6 w-[1px] bg-border mx-2" />

              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!selected || isLoading}
                className={cn(
                  "min-w-[200px] rounded-xl font-bold text-base transition-all duration-500",
                  selected
                    ? "bg-primary text-primary-foreground hover:scale-105 shadow-xl shadow-primary/20"
                    : "bg-muted text-muted-foreground opacity-50"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {selected ? 'Ready to Launch' : dict.continueButton}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Export with Suspense wrapper
export default function ChooseTemplatePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ChooseTemplateContent />
    </Suspense>
  );
}
