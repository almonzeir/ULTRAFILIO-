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
    ArrowLeft,
    Gift,
    Trophy
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePaddle } from '@/hooks/use-paddle';

const PADDLE_PLANS = {
    pro_monthly: process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID || '',
    pro_annual: process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID || '',
};

export default function CheckoutPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = React.useState<string | null>(null);
    const { openCheckout } = usePaddle();

    const { supabase, refreshUser, user } = useUser();

    const handleCheckout = async (planType: 'pro_monthly' | 'pro_annual') => {
        setLoading(planType);

        try {
            if (!user) {
                toast({ title: "Please Login", description: "You need to be logged in to claim this offer." });
                router.push('/login?redirect=/checkout');
                return;
            }

            // TEMPORARY: Early Bird Claim Logic
            const { error } = await supabase
                .from('users')
                .update({
                    is_pro: true,
                    subscription_plan: planType === 'pro_annual' ? 'annual' : 'monthly',
                    subscription_status: 'active'
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshUser?.();
            router.push('/dashboard');

        } catch (error: any) {
            console.error('Claim error:', error);
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

                        <div className="flex items-center gap-2 text-sm text-white/60 font-bold uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                            <Trophy className="w-4 h-4" />
                            Active: First 1000 Users Founding Offer
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
                                            <div className="text-2xl font-bold text-white">$0</div>
                                            <div className="text-xs text-white/40 font-bold uppercase">Early Bird</div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleCheckout('pro_monthly')}
                                        disabled={!!loading}
                                        variant="outline"
                                        className="w-full h-12 border-white/10 hover:bg-white/5 hover:text-white"
                                    >
                                        {loading === 'pro_monthly' ? <Loader2 className="animate-spin w-4 h-4" /> : 'Claim Monthly Free'}
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
                                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                                    <Trophy className="w-5 h-5 text-white/80" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl text-white">Annual Pro</h3>
                                                    <p className="text-sm text-gray-400">Full year of power features.</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-white">$0</div>
                                                <div className="text-xs text-white/40 font-bold uppercase tracking-widest">Limited Member Offer</div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleCheckout('pro_annual')}
                                            disabled={!!loading}
                                            className="w-full h-14 text-base font-bold bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/10 border-0"
                                        >
                                            {loading === 'pro_annual' ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                                <span className="flex items-center gap-2">
                                                    <Trophy className="w-5 h-5" /> Claim Free Year
                                                </span>
                                            )}
                                        </Button>

                                        <div className="text-center mt-4">
                                            <p className="text-xs text-gray-500">Early Access special. $0 for your first year.</p>
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
