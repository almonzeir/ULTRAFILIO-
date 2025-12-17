'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Rocket,
    Crown,
    CheckCircle2,
    ShieldCheck,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LEMONSQUEEZY_VARIANTS } from '@/lib/lemonsqueezy';

export default function CheckoutPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (planType: 'pro_monthly' | 'pro_lifetime') => {
        setLoading(planType);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast({ title: "Please Login", description: "You need to be logged in to subscribe." });
                router.push('/login?redirect=/checkout');
                return;
            }

            const variantId = LEMONSQUEEZY_VARIANTS[planType];
            if (!variantId) {
                toast({ variant: 'destructive', title: "Configuration Error", description: "Product ID not configured." });
                return;
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ variantId })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to start checkout');
            }

            const { url } = await response.json();
            window.location.href = url; // Redirect to Lemon Squeezy

        } catch (error: any) {
            console.error('Checkout error:', error);
            toast({ variant: 'destructive', title: "Checkout Failed", description: error.message });
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
            <Header />

            <main className="flex-grow flex items-center justify-center py-20 px-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="max-w-5xl w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Value Prop */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-white pl-0 mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300">
                            <Sparkles className="w-3 h-3" />
                            Premium Upgrade
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Unlock Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Full Potential.</span>
                        </h1>

                        <p className="text-lg text-gray-400 leading-relaxed max-w-md">
                            Get unlimited access to premium templates, remove watermarks, and build the portfolio that gets you hired.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Unlimited AI Generations",
                                "Access All Premium Templates",
                                "Custom Domain Connection",
                                "Remove 'Made with UltraFolio' Badge",
                                "Priority Support",
                                "Export to HTML/CSS"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <span className="text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-white/5">
                            <ShieldCheck className="w-4 h-4" />
                            Secure payment via Lemon Squeezy. Cancel anytime.
                        </div>
                    </motion.div>

                    {/* Right: Pricing Cards */}
                    <div className="grid gap-6">

                        {/* Monthly Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-1 bg-[#111] border-white/10 hover:border-white/20 transition-all group">
                                <div className="bg-[#151515] rounded-xl p-6 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-white">Monthly Pro</h3>
                                            <p className="text-sm text-gray-400">Flexible, cancel anytime.</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-white">$5</div>
                                            <div className="text-xs text-gray-500">per month</div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleCheckout('pro_monthly')}
                                        disabled={!!loading}
                                        variant="outline"
                                        className="w-full h-12 border-white/10 hover:bg-white/5 hover:text-white"
                                    >
                                        {loading === 'pro_monthly' ? <Loader2 className="animate-spin w-4 h-4" /> : 'Subscribe Monthly'}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Lifetime Plan - Highlighted */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="relative">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />

                                <Card className="relative p-1 bg-[#111] border-0">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-lg z-20">
                                        Best Value
                                    </div>

                                    <div className="bg-[#1a1a1a] rounded-xl p-8 relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
                                                    <Crown className="w-5 h-5 text-cyan-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl text-white">Lifetime Access</h3>
                                                    <p className="text-sm text-gray-400">Pay once, own forever.</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-white">$15</div>
                                                <div className="text-xs text-green-400 font-medium">Save $45/year</div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleCheckout('pro_lifetime')}
                                            disabled={!!loading}
                                            className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-500/25 border-0"
                                        >
                                            {loading === 'pro_lifetime' ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                                <span className="flex items-center gap-2">
                                                    <Rocket className="w-5 h-5" /> Get Lifetime Access
                                                </span>
                                            )}
                                        </Button>

                                        <div className="text-center mt-4">
                                            <p className="text-xs text-gray-500">One-time payment. includes all future updates.</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}
