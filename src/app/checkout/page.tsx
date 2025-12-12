'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Gift,
    Rocket,
    PartyPopper,
    Crown,
    Zap,
    Heart,
    ArrowRight,
    CheckCircle2,
    Star,
    Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState({ days: 7, hours: 12, minutes: 45, seconds: 30 });

    // Fun countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                let { days, hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) { seconds = 59; minutes--; }
                if (minutes < 0) { minutes = 59; hours--; }
                if (hours < 0) { hours = 23; days--; }
                if (days < 0) { days = 7; hours = 23; minutes = 59; seconds = 59; }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const floatingEmojis = ['🎉', '🚀', '✨', '🎁', '💎', '⭐', '🔥', '💜'];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
            <Header />

            {/* Floating emojis background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {floatingEmojis.map((emoji, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-4xl"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: -50,
                            rotate: 0,
                            opacity: 0.7
                        }}
                        animate={{
                            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                            rotate: 360,
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: i * 2,
                            ease: "linear"
                        }}
                    >
                        {emoji}
                    </motion.div>
                ))}
            </div>

            <main className="flex-grow flex items-center justify-center py-12 px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    <Card className="p-8 md:p-12 text-center relative overflow-hidden border-2 border-violet-200 dark:border-violet-800 shadow-2xl">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-indigo-500" />

                        <div className="relative z-10">
                            {/* Celebration icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="mb-6"
                            >
                                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-violet-500 via-pink-500 to-indigo-500 flex items-center justify-center shadow-2xl shadow-violet-500/30 animate-pulse">
                                    <PartyPopper className="w-12 h-12 text-white" />
                                </div>
                            </motion.div>

                            {/* Main heading */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold mb-4">
                                    <Gift className="w-4 h-4" />
                                    SPECIAL EARLY BIRD OFFER
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                                    Pro is Coming Soon!
                                </h1>

                                <p className="text-xl text-muted-foreground mb-8">
                                    Good news! While we set up payments...
                                </p>
                            </motion.div>

                            {/* FREE ACCESS announcement */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring' }}
                                className="mb-8"
                            >
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-xl opacity-50 animate-pulse" />
                                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-6 rounded-2xl shadow-2xl">
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
                                            <span className="text-3xl md:text-4xl font-black">100% FREE</span>
                                            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
                                        </div>
                                        <p className="text-green-100 font-medium">
                                            All Pro features unlocked for everyone!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* What you get */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-8 text-left"
                            >
                                <p className="text-sm font-bold text-center text-violet-700 dark:text-violet-300 mb-4 flex items-center justify-center gap-2">
                                    <Crown className="w-5 h-5 text-amber-500" />
                                    ENJOY ALL PRO FEATURES NOW
                                    <Crown className="w-5 h-5 text-amber-500" />
                                </p>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {[
                                        'Unlimited portfolio generations',
                                        'All 9 premium templates',
                                        'Aurora & Cyber 3D designs',
                                        'Priority AI processing',
                                        'Custom domain support',
                                        'No branding watermark',
                                    ].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + i * 0.1 }}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-foreground">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Countdown */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="mb-8"
                            >
                                <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2">
                                    <Timer className="w-4 h-4" />
                                    Pro subscriptions launching in:
                                </p>
                                <div className="flex justify-center gap-3">
                                    {[
                                        { value: countdown.days, label: 'Days' },
                                        { value: countdown.hours, label: 'Hours' },
                                        { value: countdown.minutes, label: 'Mins' },
                                        { value: countdown.seconds, label: 'Secs' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-gray-900 dark:bg-gray-800 text-white rounded-xl px-4 py-3 min-w-[70px]">
                                            <div className="text-2xl font-black">{String(item.value).padStart(2, '0')}</div>
                                            <div className="text-xs text-gray-400">{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="space-y-4"
                            >
                                <Button
                                    onClick={() => router.push('/create')}
                                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 hover:from-violet-700 hover:via-pink-700 hover:to-indigo-700 shadow-xl shadow-violet-500/25"
                                >
                                    <Rocket className="w-5 h-5 mr-2" />
                                    Start Creating - It's FREE!
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                <Button
                                    onClick={() => router.push('/')}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Back to Home
                                </Button>
                            </motion.div>

                            {/* Social proof */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Join <span className="font-bold text-foreground">2,500+</span> creators already using UltraFolio
                                </p>
                                <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                                    <Heart className="w-3 h-3 text-pink-500" />
                                    Thank you for your patience!
                                </p>
                            </motion.div>
                        </div>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
