'use client';

import { motion } from 'framer-motion';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { ArrowLeft, Users, Lightbulb, Target, Rocket, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-[#030014] text-white overflow-hidden selection:bg-white/20">
            <MeshGradientBackground />

            {/* Ambient Lighting */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-32"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase text-white/60 mb-8 backdrop-blur-sm">
                        <Users className="w-3.5 h-3.5" />
                        About Us
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
                            Building the Future
                        </span>
                        <br />
                        <span className="text-white/40">of Portfolios.</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                        We are on a mission to democratize professional branding. UltraFolio combines cutting-edge AI with premium design to help you tell your story.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group h-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-white/[0.03] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative h-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-3xl p-10 flex flex-col justify-center backdrop-blur-md transition-all">
                            <Target className="w-12 h-12 text-white/80 mb-6" />
                            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                            <p className="text-white/60 leading-relaxed text-lg">
                                To empower every professional to showcase their work with dignity and style. We believe that your portfolio should be as unique and impressive as your career journey.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative group h-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-white/[0.03] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative h-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-3xl p-10 flex flex-col justify-center backdrop-blur-md transition-all">
                            <Lightbulb className="w-12 h-12 text-white/80 mb-6" />
                            <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
                            <p className="text-white/60 leading-relaxed text-lg">
                                A world where creating a world-class personal website takes seconds, not weeks. We're removing technical barriers so talent can shine brighter than ever.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-32"
                >
                    <h2 className="text-4xl font-bold text-white text-center mb-16">Core Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Rocket,
                                title: "Innovation",
                                desc: "Pushing boundaries with AI to create magic."
                            },
                            {
                                icon: Heart,
                                title: "Passion",
                                desc: "Obsessed with details and user experience."
                            },
                            {
                                icon: Users,
                                title: "Community",
                                desc: "Built by creators, for creators."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5"
                            >
                                <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <item.icon className="w-8 h-8 relative z-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-white/50 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="pt-8 border-t border-white/10 text-center"
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
