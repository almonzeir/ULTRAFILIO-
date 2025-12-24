'use client';

import { motion } from 'framer-motion';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { ArrowLeft, Book, CheckCircle, Shield, AlertTriangle, CreditCard, User, Globe, Mail } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
    const sections = [
        {
            icon: Book,
            title: "Acceptance of Terms",
            content: "By accessing and using UltraFolio (\"the Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service."
        },
        {
            icon: Globe,
            title: "Description of Service",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">UltraFolio is an AI-powered portfolio generator that transforms your CV/resume into a professional portfolio website. The service includes:</p>
                    <ul className="space-y-3">
                        {['AI-powered CV parsing and data extraction', 'Professional portfolio templates', 'Portfolio hosting on ultrafolio.app subdomains', 'Live editing and customization tools'].map((item, i) => (
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
            icon: User,
            title: "User Accounts",
            content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
        },
        {
            icon: CreditCard,
            title: "Subscriptions and Payments",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">Paid subscriptions are billed in advance on a monthly or annual basis. Payments are processed securely through Paddle. See our <Link href="/refund-policy" className="text-white font-medium hover:underline decoration-white/30 underline-offset-4">Refund Policy</Link> for details.</p>
                </div>
            )
        },
        {
            icon: CheckCircle,
            title: "User Content",
            content: "You retain ownership of all content you upload to UltraFolio. By using our service, you grant us a license to process and display your content for the purpose of providing the service."
        },
        {
            icon: AlertTriangle,
            title: "Prohibited Uses",
            content: (
                <div className="space-y-4">
                    <p className="leading-relaxed">You may not use the service to:</p>
                    <ul className="space-y-3">
                        {['Upload illegal, harmful, or offensive content', 'Impersonate others or misrepresent your identity', 'Violate any applicable laws or regulations', 'Attempt to gain unauthorized access to our systems'].map((item, i) => (
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
            icon: Shield,
            title: "Limitation of Liability",
            content: "UltraFolio is provided \"as is\" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service."
        },
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
                        <Book className="w-3.5 h-3.5" />
                        Terms of Service
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
                            Rules of
                        </span>
                        <br />
                        <span className="text-white/40">Engagement.</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
                        Please read these terms carefully before using our service. They outline your rights and obligations.
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
                            <h2 className="text-2xl font-bold text-white mb-4">Questions about our terms?</h2>
                            <p className="text-white/50 mb-8 max-w-lg mx-auto">
                                Our legal team is available to clarify any aspect of these terms and conditions.
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
