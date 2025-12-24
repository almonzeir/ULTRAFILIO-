'use client';

import { motion } from 'framer-motion';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { ArrowLeft, RotateCcw, Clock, Mail, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicyPage() {
    const sections = [
        {
            icon: RotateCcw,
            title: "30-Day Money-Back Guarantee",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">We offer a <strong>30-day money-back guarantee</strong> on all paid subscriptions. If you're not satisfied with UltraFolio for any reason, you can request a full refund within 30 days of your initial purchase.</p>
                </div>
            )
        },
        {
            icon: Clock,
            title: "Free Trial",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">Our Annual plan includes a <strong>30-day free trial</strong>. You won't be charged until the trial period ends. You can cancel anytime during the trial at no cost.</p>
                </div>
            )
        },
        {
            icon: Mail,
            title: "How to Request a Refund",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">To request a refund, please contact us at:</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm sm:text-base">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2.5 flex-shrink-0" />
                            <span className="text-white/70">Email: <a href="mailto:support@ultrafolio.app" className="text-white font-medium hover:underline decoration-white/30 underline-offset-4">support@ultrafolio.app</a></span>
                        </li>
                        <li className="flex items-start gap-3 text-sm sm:text-base">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2.5 flex-shrink-0" />
                            <span className="text-white/70">Include your account email and reason for refund</span>
                        </li>
                    </ul>
                    <p className="leading-relaxed text-sm text-white/50">Refunds are typically processed within 5-10 business days.</p>
                </div>
            )
        },
        {
            icon: XCircle,
            title: "Subscription Cancellation",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">You can cancel your subscription at any time from your dashboard. Upon cancellation:</p>
                    <ul className="space-y-3">
                        {['You\'ll retain access to Pro features until the end of your billing period', 'Your portfolios will remain accessible but limited to Free plan features', 'No further charges will be made'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm sm:text-base">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2.5 flex-shrink-0" />
                                <span className="text-white/70">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            icon: AlertCircle,
            title: "Exceptions",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">Refunds may not be granted in cases of:</p>
                    <ul className="space-y-3">
                        {['Violation of our Terms of Service', 'Fraudulent activity', 'Requests made after the 30-day period'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm sm:text-base">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2.5 flex-shrink-0" />
                                <span className="text-white/70">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    ];

    return (
        <main className="relative min-h-screen bg-[#030014] text-white overflow-hidden selection:bg-white/20">
            <MeshGradientBackground />

            {/* Ambient Lighting */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase text-white/60 mb-8 backdrop-blur-sm">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Refund Policy
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
                            Satisfaction,
                        </span>
                        <br />
                        <span className="text-white/40">Guaranteed.</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
                        We stand behind our product. If you're not happy, neither are we. simple as that.
                        <br />
                        <span className="text-xs uppercase tracking-widest opacity-60 mt-4 block">Effective Date: December 2024</span>
                    </p>
                </motion.div>

                {/* Content Cards */}
                <div className="grid gap-6">
                    {sections.map((section, index) => (
                        <motion.section
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-white/[0.03] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-3xl p-8 sm:p-10 transition-all duration-300 backdrop-blur-md">
                                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <section.icon className="w-6 h-6 text-white/80" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                                            {section.title}
                                        </h2>
                                        <div className="text-white/60 leading-relaxed">
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    ))}

                    {/* Contact Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-8 bg-gradient-to-br from-white/10 via-slate-500/5 to-transparent border border-white/10 rounded-3xl p-10 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full mix-blend-screen" />

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-white mb-4">Need help with your subscription?</h2>
                            <p className="text-white/50 mb-8 max-w-lg mx-auto">
                                Our support team is ready to assist you with refunds, cancellations, or any other billing inquiries.
                            </p>
                            <a
                                href="mailto:support@ultrafolio.app"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
                            >
                                <HelpCircle className="w-4 h-4" />
                                Contact Support
                            </a>
                        </div>
                    </motion.section>
                </div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 pt-8 border-t border-white/10 text-center"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
