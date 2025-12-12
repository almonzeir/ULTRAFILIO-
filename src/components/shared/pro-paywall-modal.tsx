'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Sparkles, Check, Rocket, Gift, PartyPopper, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProPaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName?: string;
    reason?: 'template' | 'generation_limit';
}

export default function ProPaywallModal({ isOpen, onClose, templateName, reason = 'template' }: ProPaywallModalProps) {
    const router = useRouter();

    const handleContinueFree = () => {
        // Close modal - user can continue for free!
        onClose();
    };

    const handleLearnMore = () => {
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>

                    {/* Header gradient - celebration style */}
                    <div className="relative h-32 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="relative"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                                <PartyPopper className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        {/* Floating stars */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                    left: `${20 + i * 15}%`,
                                    top: `${20 + (i % 2) * 40}%`
                                }}
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                }}
                            >
                                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold mb-3">
                            <Gift className="w-3 h-3" />
                            EARLY ACCESS SPECIAL
                        </div>

                        <h2 className="text-2xl font-bold mb-2">
                            🎉 Great News!
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {reason === 'template'
                                ? `The ${templateName || 'premium'} template is normally Pro-only, but...`
                                : "You've hit the daily limit, but guess what..."
                            }
                        </p>

                        {/* FREE announcement */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-xl font-black">IT'S FREE!</span>
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-green-100">
                                All Pro features are unlocked during early access!
                            </p>
                        </div>

                        {/* Features unlocked */}
                        <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                <Crown className="w-4 h-4 text-amber-500" />
                                You have full access to:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Unlimited portfolio generations
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    All premium templates including Aurora & Cyber
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    No branding, full customization
                                </li>
                            </ul>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleContinueFree}
                                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/25"
                            >
                                <Rocket className="w-5 h-5 mr-2" />
                                Continue for FREE! 🎉
                            </Button>

                            <button
                                onClick={handleLearnMore}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Learn about upcoming Pro plans →
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground mt-4">
                            💜 Enjoy early access! Pro subscriptions coming soon.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Pro Badge component for template cards
export function ProBadge({ className = '' }: { className?: string }) {
    return (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg ${className}`}>
            <Crown className="w-3 h-3" />
            PRO
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
