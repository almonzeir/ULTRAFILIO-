'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, X, ArrowRight, Layout, Grid } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function OnboardingTour() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Only show if ?onboarding=true is present
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (searchParams.get('onboarding') === 'true') {
            setIsVisible(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsVisible(false);
        // Remove the query param nicely
        router.replace(pathname);
    };

    if (!isVisible) return null;

    const STEPS = [
        {
            title: "Your Portfolio is Live!",
            description: "We've created a stunning draft based on your CV. Now, let's make it yours.",
            icon: Sparkles,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10"
        },
        {
            title: "Change the Vibe",
            description: "Go to the 'Templates' tab to switch designs instantly. Try 'Cyber 3D' or 'Aurora' for a premium look.",
            icon: Grid,
            color: "text-violet-400",
            bg: "bg-violet-500/10"
        },
        {
            title: "Drag & Drop Layout",
            description: "Use the 'Layout' tab to reorder sections. Put your best projects at the top!",
            icon: Layout,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        }
    ];

    const currentStepData = STEPS[step];
    const Icon = currentStepData.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className="relative w-full max-w-md bg-[#0f1014] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                    >
                        {/* Radiant Background Glow */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                        <div className="relative p-8 text-center flex flex-col items-center">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Animated Icon */}
                            <motion.div
                                key={step} // re-animate on step change
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${currentStepData.bg} ${currentStepData.color}`}
                            >
                                <Icon className="w-10 h-10" />
                            </motion.div>

                            <motion.h2
                                key={`t-${step}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-bold text-white mb-2"
                            >
                                {currentStepData.title}
                            </motion.h2>

                            <motion.p
                                key={`d-${step}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-white/60 mb-8 leading-relaxed"
                            >
                                {currentStepData.description}
                            </motion.p>

                            {/* Actions */}
                            <div className="flex items-center gap-3 w-full">
                                {step < STEPS.length - 1 ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            onClick={handleClose}
                                            className="flex-1 hover:bg-white/5 text-white/50"
                                        >
                                            Skip
                                        </Button>
                                        <Button
                                            onClick={() => setStep(s => s + 1)}
                                            className="flex-1 bg-white text-black hover:bg-white/90 font-bold"
                                        >
                                            Next <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={handleClose}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl"
                                    >
                                        Let's Go! 🚀
                                    </Button>
                                )}
                            </div>

                            {/* Pagination Dots */}
                            <div className="flex gap-2 mt-6">
                                {STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-white' : 'bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
