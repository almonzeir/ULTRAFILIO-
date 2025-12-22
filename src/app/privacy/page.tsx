'use client';

import { motion } from 'framer-motion';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Cookie, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            icon: Eye,
            title: "Information We Collect",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">We collect information you provide directly to us, including:</p>
                    <ul className="space-y-3">
                        {['Account information (email, name)', 'CV/resume content you upload', 'Portfolio customization preferences', 'Payment information (processed securely by Paddle)'].map((item, i) => (
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
            icon: Database,
            title: "How We Use Your Information",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">We use the information we collect to:</p>
                    <ul className="space-y-3">
                        {['Generate and host your portfolio', 'Process payments and manage subscriptions', 'Send important service updates', 'Improve our AI and services'].map((item, i) => (
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
            icon: Lock,
            title: "Data Storage and Security",
            content: "Your data is stored securely using industry-standard encryption. We use Supabase for data storage and implement appropriate security measures to protect your information."
        },
        {
            icon: Globe,
            title: "Third-Party Services",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">We use the following trusted third-party services:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { name: 'Paddle', role: 'Payment processing' },
                            { name: 'Supabase', role: 'Database & Auth' },
                            { name: 'Google AI', role: 'Content Generation' },
                            { name: 'Vercel', role: 'Hosting Infrastructure' }
                        ].map((service, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
                                <strong className="block text-white mb-1">{service.name}</strong>
                                <span className="text-xs text-white/40 uppercase tracking-wider">{service.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            icon: Shield,
            title: "Your Rights",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">You have full control over your data:</p>
                    <ul className="space-y-3">
                        {['Access your personal data', 'Request deletion of your data', 'Export your portfolio data', 'Opt out of marketing communications'].map((item, i) => (
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
            icon: Cookie,
            title: "Cookies",
            content: "We use essential cookies purely for authentication and session management. We do not use tracking cookies for advertising purposes. Your privacy is paramount."
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
                        <Shield className="w-3.5 h-3.5" />
                        Privacy Policy
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
                            Your Privacy,
                        </span>
                        <br />
                        <span className="text-white/40">Protected.</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
                        We believe in complete transparency. Here's exactly how we handle and protect your data.
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
                            <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
                            <p className="text-white/50 mb-8 max-w-lg mx-auto">
                                Our support team is available to answer any questions you may have about our privacy practices.
                            </p>
                            <a
                                href="mailto:support@ultrafolio.app"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
                            >
                                <Mail className="w-4 h-4" />
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
