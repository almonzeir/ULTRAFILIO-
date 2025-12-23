'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const PORTFOLIO_FACTS = [
    "Your portfolio speaks louder than your résumé.",
    "Small side-projects can change your career.",
    "Your portfolio shapes people's perception instantly.",
    "Portfolios beat degrees in creative fields.",
    "Digital portfolios are global branding power.",
    "One great project can open a thousand doors.",
    "Your work tells your story better than words.",
    "Recruiters spend 7 seconds on a résumé, 2 minutes on a portfolio.",
    "The best portfolios show process, not just results.",
    "A portfolio is your 24/7 sales pitch."
];

const PROCESSING_STEPS = [
    { label: "Initializing Neural Engine", duration: 2500 },
    { label: "Scanning Professional DNA", duration: 3000 },
    { label: "Extracting Semantic Insights", duration: 4000 },
    { label: "Optimizing Layout Matrix", duration: 3500 },
    { label: "Synthesizing Design System", duration: 3000 },
    { label: "Finalizing Your UltraFolio", duration: 2000 },
];

export default function ProcessingScreen() {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [factIndex, setFactIndex] = React.useState(0);

    // Rotate through facts
    React.useEffect(() => {
        const factInterval = setInterval(() => {
            setFactIndex((prev) => (prev + 1) % PORTFOLIO_FACTS.length);
        }, 4000);
        return () => clearInterval(factInterval);
    }, []);

    // Step progression
    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        const runSteps = (index: number) => {
            if (index >= PROCESSING_STEPS.length) return;
            setCurrentStep(index);
            timeout = setTimeout(() => {
                runSteps(index + 1);
            }, PROCESSING_STEPS[index].duration);
        };
        runSteps(0);
        return () => clearTimeout(timeout);
    }, []);

    const progress = (currentStep / (PROCESSING_STEPS.length - 1)) * 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0f1012] text-white">
            {/* --- Ambient Background (Matches Landing) --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.08),_transparent_70%)]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-6">

                {/* --- Central Intelligence Orb --- */}
                <div className="relative w-40 h-40 mb-16 flex items-center justify-center">

                    {/* Spinning Rings (Subtle) */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-white/10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-4 rounded-full border border-white/5 border-t-white/20"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Core Glow */}
                    <motion.div
                        className="absolute inset-0 bg-white/5 blur-3xl rounded-full"
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* The Icon */}
                    <div className="relative bg-gradient-to-br from-white/10 to-transparent p-6 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
                        <Sparkles className="w-12 h-12 text-white/90" />
                    </div>
                </div>

                {/* --- Typography & Status --- */}
                <div className="text-center space-y-8 w-full">

                    {/* Step Label */}
                    <div className="space-y-2 h-16">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={currentStep}
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                            >
                                {PROCESSING_STEPS[currentStep].label}
                            </motion.h2>
                        </AnimatePresence>
                    </div>

                    {/* Progress Bar (Apple Style) */}
                    <div className="w-full max-w-sm mx-auto">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                    {/* Rotating Facts (Footer) */}
                    <div className="pt-8 min-h-[60px]">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={factIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-sm text-white/40 font-medium italic"
                            >
                                "{PORTFOLIO_FACTS[factIndex]}"
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
