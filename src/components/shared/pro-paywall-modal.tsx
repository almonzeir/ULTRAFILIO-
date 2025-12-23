'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Sparkles, Check, Rocket, Gift, PartyPopper, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ProPaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName?: string;
    reason?: 'template' | 'generation_limit';
}

export default function ProPaywallModal({ isOpen, onClose, templateName, reason = 'template' }: ProPaywallModalProps) {
    const router = useRouter();

    const handleUpgrade = () => {
        onClose();
        router.push('/checkout');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    {/* Background Glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-white/50" />
                    </button>

                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#e2e2e2] via-[#ffffff] to-[#888888] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-white/10 relative group"
                            >
                                <div className="absolute inset-0 rounded-[2rem] bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Crown className="w-10 h-10 text-[#0a0a0f] relative z-10" />
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                                {reason === 'generation_limit' ? 'Portfolio Limit Reached' : 'Unlock Pro Creative Power'}
                            </h2>
                            <p className="text-lg text-white/50 max-w-md mx-auto">
                                {reason === 'generation_limit'
                                    ? "You've reached the 3 portfolio limit for free accounts. Upgrade to create unlimited masterpieces."
                                    : `AI CV Parsing and publishing with premium templates like "${templateName || 'Modern'}" requires Pro access.`
                                }
                            </p>
                        </div>

                        {/* Comparison Table */}
                        <div className="grid md:grid-cols-2 gap-6 mb-10">
                            {/* Free Plan */}
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Current Plan</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        Max 3 Portfolios
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white/60 line-through opacity-50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        AI CV Extraction
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        Standard Templates
                                    </li>
                                </ul>
                            </div>

                            {/* Pro Plan */}
                            <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3">
                                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                                    Pro Plan
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-white font-medium">
                                        <Check className="w-4 h-4 text-primary" />
                                        Unlimited Portfolios
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white font-medium">
                                        <Check className="w-4 h-4 text-primary" />
                                        Unlimited AI CV Parsing
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white font-medium">
                                        <Check className="w-4 h-4 text-primary" />
                                        All 10+ Premium Templates
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col items-center gap-4">
                            <Button
                                onClick={handleUpgrade}
                                className="w-full h-14 rounded-2xl bg-white text-black text-lg font-black hover:bg-white/90 shadow-xl shadow-white/5 transition-all group"
                            >
                                <Rocket className="w-5 h-5 mr-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                Upgrade to Pro – $5/mo
                            </Button>
                            <button
                                onClick={onClose}
                                className="text-sm font-bold text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Pro Badge component for template cards
export function ProBadge({ className = '' }: { className?: string }) {
    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase relative overflow-hidden group border border-white/20 shadow-lg transition-all duration-500",
            "bg-gradient-to-br from-[#e2e2e2] via-[#ffffff] to-[#999999] text-[#1a1a1a]",
            className
        )}>
            {/* Glossy Reflective Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

            {/* Animated Shine Sparkle */}
            <motion.div
                animate={{
                    left: ['-100%', '200%'],
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute top-0 w-8 h-full bg-white/40 blur-md skew-x-[30deg] z-10 pointer-events-none"
            />

            <Crown className="w-3 h-3 transition-transform group-hover:scale-110" />
            <span className="relative z-10 drop-shadow-sm">PRO</span>
        </div>
    );
}

// Usage Indicator for free users
export function UsageIndicator({ used, limit }: { used: number; limit: number }) {
    const percentage = (used / limit) * 100;
    const isLow = used >= limit - 1;

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                />
            </div>
            <span className={`text-sm font-medium ${isLow ? 'text-red-500' : 'text-muted-foreground'}`}>
                {used}/{limit}
            </span>
        </div>
    );
}
