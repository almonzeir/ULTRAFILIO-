'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/header';

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/create');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050A14] flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 pt-20">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500 opacity-10 blur-[200px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-lg relative z-10"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mx-auto w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-8"
                    >
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Welcome to <span className="text-emerald-400">Pro!</span>
                    </h1>

                    <p className="text-xl text-white/60 mb-8">
                        Your payment was successful. You now have access to all Pro features!
                    </p>

                    {/* Features Unlocked */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Features Unlocked
                        </h3>
                        <ul className="space-y-2 text-white/70">
                            <li>✓ Unlimited portfolio generations</li>
                            <li>✓ All premium templates</li>
                            <li>✓ Custom domain support</li>
                            <li>✓ Priority support</li>
                            <li>✓ Remove UltraFolio branding</li>
                        </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8">
                            <Link href="/create">
                                Start Creating
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                            <Link href="/dashboard">View Dashboard</Link>
                        </Button>
                    </div>

                    {/* Auto-redirect notice */}
                    <p className="text-sm text-white/30 mt-8 flex items-center justify-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Redirecting to create page in {countdown}s...
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
