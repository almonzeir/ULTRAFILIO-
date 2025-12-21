'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { PortfolioData } from '@/templates/types';
import {
  sleep,
  cvFileTypeToMime,
  parseCvWithGemini,
  normalizePortfolioData,
  mapToTemplate,
} from '@/lib/portfolio-builder';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Brain, Code2, Palette, CheckCircle2, AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';

interface UploadMeta {
  cvFileUrl: string;
  cvFileType: 'pdf' | 'doc' | 'docx';
  profilePhotoURL?: string;
  fileSizeBytes: number;
}

type BuildState = 'idle' | 'uploaded' | 'template_selected' | 'parsing' | 'mapping' | 'building' | 'ready' | 'error';

const processingStages = [
  { icon: Brain, text: 'Scanning Professional DNA', subtext: 'Neural processing in progress' },
  { icon: Zap, text: 'Extracting Achievements', subtext: 'Identifying your career highlights' },
  { icon: Code2, text: 'Mapping Your Skills', subtext: 'Building your competency matrix' },
  { icon: Palette, text: 'Designing Your Story', subtext: 'Crafting visual narrative' },
  { icon: Sparkles, text: 'Polishing Details', subtext: 'Adding finishing touches' },
  { icon: CheckCircle2, text: 'Almost Ready', subtext: 'Final quality checks' },
];

const inspirationalQuotes = [
  '"Small side projects can change your career."',
  '"Your portfolio is your story, make it count."',
  '"First impressions matter. Make yours unforgettable."',
  '"Design is intelligence made visible."',
  '"Simplicity is the ultimate sophistication."',
];

export default function AIBuildingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [buildState, setBuildState] = useState<BuildState>('idle');
  const [extractedData, setExtractedData] = useState<PortfolioData | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    if (buildState !== 'error' && buildState !== 'ready') {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 3, 95));
      }, 200);
      return () => clearInterval(interval);
    }
    if (buildState === 'ready') {
      setProgress(100);
    }
  }, [buildState]);

  // Rotate stages
  useEffect(() => {
    const stageInterval = setInterval(() => {
      if (buildState !== 'error') {
        setCurrentStageIndex(prev => (prev + 1) % processingStages.length);
      }
    }, 3000);
    return () => clearInterval(stageInterval);
  }, [buildState]);

  // Rotate quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % inspirationalQuotes.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    const startBuild = async () => {
      setBuildState('template_selected');

      const storedUploadMeta = localStorage.getItem('uploadMeta');
      const chosenTemplate = localStorage.getItem('chosenTemplate');
      const storedProfilePhotoURL = localStorage.getItem('profilePhotoURL');

      if (!storedUploadMeta || !chosenTemplate) {
        toast({
          variant: 'destructive',
          title: 'Missing Information',
          description: 'Could not find CV or template. Please start over.',
        });
        router.push('/create');
        return;
      }

      const uploadMeta: UploadMeta = JSON.parse(storedUploadMeta);
      const profilePhotoURL = storedProfilePhotoURL || undefined;

      let currentExtractedData: PortfolioData | null = null;

      const storedExtracted = localStorage.getItem('extracted');
      if (storedExtracted && !isRetrying) {
        currentExtractedData = JSON.parse(storedExtracted);
        setExtractedData(currentExtractedData);
        setBuildState('mapping');
      } else {
        setBuildState('parsing');
        try {
          const mimeType = cvFileTypeToMime(uploadMeta.cvFileType);
          currentExtractedData = await parseCvWithGemini(uploadMeta.cvFileUrl, mimeType);
          setExtractedData(currentExtractedData);
          localStorage.setItem('extracted', JSON.stringify(currentExtractedData));
        } catch (e: any) {
          console.error('Gemini parsing failed:', e);
          setError(e.message || 'We encountered an issue reading your CV. Please try again or upload a DOCX version.');
          setBuildState('error');

          if (uploadMeta.cvFileType === 'pdf') {
            toast({
              title: 'PDF Issue',
              description: 'We could not read this PDF. Please upload a DOCX version for best results.',
              variant: 'destructive',
            });
          }
          return;
        }
      }

      if (!currentExtractedData) {
        setError('Could not extract data from your CV.');
        setBuildState('error');
        return;
      }

      setBuildState('mapping');
      const normalized = normalizePortfolioData(currentExtractedData, profilePhotoURL);
      const mapped = mapToTemplate(normalized, chosenTemplate as 'basic' | 'minimalist' | 'modern');
      setPortfolioData(mapped);
      localStorage.setItem('portfolioData', JSON.stringify(mapped));

      setBuildState('building');
      await sleep(300);

      setBuildState('ready');
      router.push('/portfolio');
    };

    startBuild();
  }, [router, toast, isRetrying]);

  const handleRetry = () => {
    setIsRetrying(true);
    setError(null);
    setProgress(0);
    setBuildState('parsing');
  };

  const handleCancel = () => {
    router.push('/create');
  };

  const CurrentIcon = processingStages[currentStageIndex].icon;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Living Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradientBackground />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[30%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[180px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/15 blur-[150px]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">

        {/* Animated Icon Container */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Outer Rings */}
          <div className="absolute inset-0 w-40 h-40 -m-4 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-0 w-48 h-48 -m-8 rounded-full border border-white/[0.03] animate-[spin_30s_linear_infinite_reverse]" />
          <div className="absolute inset-0 w-56 h-56 -m-12 rounded-full border border-dashed border-white/[0.02] animate-[spin_40s_linear_infinite]" />

          {/* Main Icon Circle */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_60px_-15px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStageIndex}
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                transition={{ duration: 0.5 }}
              >
                <CurrentIcon className="w-12 h-12 text-white/70" strokeWidth={1.5} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pulse Effect */}
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-white/5 animate-ping" style={{ animationDuration: '2s' }} />
        </motion.div>

        {/* Stage Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStageIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              <span className="silver-text">
                {buildState === 'error' ? 'Something Went Wrong' : processingStages[currentStageIndex].text}
              </span>
            </h1>
            <p className="text-sm tracking-[0.3em] uppercase text-white/40 font-medium">
              {buildState === 'error' ? 'Please try again' : processingStages[currentStageIndex].subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        {buildState !== 'error' && (
          <motion.div
            className="w-full max-w-xs mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-slate-400 via-white to-slate-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {buildState === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="liquid-silver-glass rounded-2xl p-6 mb-6 border border-red-500/20">
              <div className="flex items-center gap-3 text-red-400 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Error</span>
              </div>
              <p className="text-white/60 text-sm">{error}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/10 font-semibold hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </motion.div>
        )}

        {/* Inspirational Quote */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentQuoteIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-sm text-white/40 italic max-w-md"
          >
            {inspirationalQuotes[currentQuoteIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Footer Note */}
        <motion.p
          className="mt-12 text-xs text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {buildState === 'error'
            ? 'Need help? Contact support@ultrafolio.com'
            : 'This usually takes 10–30 seconds depending on document size.'}
        </motion.p>
      </div>
    </main>
  );
}