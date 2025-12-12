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
import { Loader2, ArrowLeft, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const templates = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Award-winning design with aurora backgrounds, bento grids, and magnetic effects.',
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('portfolioId');
  const { toast } = useToast();
  const { language } = useLanguage();
  const { theme } = useColorTheme();
  const [dict, setDict] = useState<Dictionary['chooseTemplatePage'] | null>(null);

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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow px-4 md:px-6 py-12">
        {/* WIDER CONTAINER */}
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Demo Banner */}
            <a
              href="/demo-template"
              className="group relative inline-flex items-center gap-3 px-6 py-3 mb-8 bg-foreground rounded-full text-background font-semibold shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
            >
              <span>{dict.title} - Demo Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-4">
              {dict.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {dict.subtitle}
            </p>
          </motion.div>

          {/* Template Grid */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {templates.map((template) => {
              const isSelected = selected === template.id;

              return (
                <motion.div key={template.id} variants={itemVariants}>
                  <div
                    onClick={() => setSelected(template.id)}
                    className={`group relative cursor-pointer rounded-2xl transition-all duration-300 ${isSelected
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-[1.02] shadow-2xl'
                      : 'hover:scale-[1.02] hover:shadow-xl'
                      }`}
                  >
                    {/* Card Container */}
                    <div className="bg-card overflow-hidden rounded-2xl border border-border flex flex-col h-full">

                      {/* Live Preview Area */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        {portfolioId ? (
                          <div className="w-[400%] h-[400%] origin-top-left scale-[0.25] select-none pointer-events-none bg-background">
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
                        <div className={`absolute inset-0 transition-all duration-300 ${isSelected ? 'bg-foreground/10' : 'bg-transparent group-hover:bg-foreground/5'}`} />

                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-foreground text-background p-3 rounded-full shadow-lg"
                            >
                              <Check className="w-6 h-6" strokeWidth={3} />
                            </motion.div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="p-4 bg-card border-t border-border">
                        <h3 className="text-lg font-bold tracking-tight text-foreground mb-1 group-hover:opacity-80 transition-opacity">
                          {template.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom Actions */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="border-foreground/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {dict.backButton}
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selected || isLoading}
              className="min-w-[180px] bg-foreground text-background hover:bg-foreground/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>{dict.continueButton}</>
              )}
            </Button>
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
