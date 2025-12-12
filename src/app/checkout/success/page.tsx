'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Crown, ArrowRight, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Trigger confetti celebration!
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: randomInRange(0.1, 0.9),
                    y: Math.random() - 0.2,
                },
                colors: ['#8b5cf6', '#6366f1', '#ec4899', '#f59e0b', '#10b981'],
            });
        }, 250);

        // Show content after a brief delay
        setTimeout(() => setShowContent(true), 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />

            <main className="flex-grow flex items-center justify-center py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg"
                >
                    <Card className="p-8 text-center relative overflow-hidden">
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10" />

                        <div className="relative z-10">
                            {/* Success icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="mb-6"
                            >
                                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Crown className="w-6 h-6 text-amber-500" />
                                    <h1 className="text-2xl font-bold">Welcome to UltraFolio!</h1>
                                    <Sparkles className="w-6 h-6 text-violet-500" />
                                </div>
                                <p className="text-muted-foreground mb-6">
                                    Thank you! You now have full access to all features.
                                </p>
                            </motion.div>

                            {/* Status indicator */}
                            {showContent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-2 text-sm text-green-600 mb-6"
                                >
                                    <PartyPopper className="w-4 h-4" />
                                    All features are now unlocked!
                                </motion.div>
                            )}

                            {/* What's unlocked */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-muted/50 rounded-xl p-4 mb-6 text-left"
                            >
                                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-violet-500" />
                                    What's available to you:
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Unlimited portfolio generations
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        All premium templates (Aurora, Cyber, etc.)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Custom portfolio URLs
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        AI-powered CV extraction
                                    </li>
                                </ul>
                            </motion.div>

                            {/* CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button
                                    onClick={() => router.push('/create')}
                                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                                >
                                    Create Your Portfolio
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </motion.div>

                            {/* Note */}
                            <p className="text-xs text-muted-foreground mt-4">
                                Thank you for using UltraFolio! 💜
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
