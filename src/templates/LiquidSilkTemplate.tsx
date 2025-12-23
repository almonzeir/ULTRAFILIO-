'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Github, Linkedin, Mail, ExternalLink, Globe, MapPin,
    ArrowUpRight, Sparkles, GraduationCap, Briefcase, Zap,
    Cpu, Layers, Box, Phone, Terminal, Code, Command
} from 'lucide-react';
import type { PortfolioData } from './types';
import { cn } from '@/lib/utils';

interface LiquidSilkTemplateProps {
    data: PortfolioData;
    isDarkMode?: boolean;
    colorTheme?: string;
}

export default function LiquidSilkTemplate({ data, isDarkMode = true, colorTheme = 'purple' }: LiquidSilkTemplateProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const { personalInfo, about, experience, projects, education, certifications, languages } = data;

    // Monochrome high-end styling
    const silverBorder = "border border-white/10";
    const glassEffect = "bg-white/[0.03] backdrop-blur-3xl";

    return (
        <div
            ref={containerRef}
            className={cn(
                "min-h-screen font-sans selection:bg-white selection:text-black overflow-x-hidden transition-colors duration-1000",
                isDarkMode ? "bg-[#050510] text-[#f5f5f7]" : "bg-[#fbfbfd] text-[#1d1d1f]"
            )}
        >
            {/* --- ARCHIVE GRID BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* --- HERO: THE ARCHIVE ENTRY --- */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 lg:px-24 z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="w-full max-w-7xl mx-auto flex flex-col items-center"
                >
                    <div className="flex items-center gap-4 mb-16 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
                        <Terminal size={14} className="text-white/40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Initialize_Archive // v2.0.4</span>
                    </div>

                    <h1 className="text-5xl sm:text-[13vw] lg:text-[13vw] font-black leading-[0.8] sm:leading-[0.75] tracking-tighter text-center mb-8 sm:mb-16 px-2">
                        {personalInfo.fullName.split(' ').map((word, i) => (
                            <span key={i} className="block overflow-hidden relative">
                                <motion.span
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.1 * i, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                    className="block bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent pb-[0.05em] break-words"
                                >
                                    {word}
                                </motion.span>
                            </span>
                        ))}
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1.5 }}
                        className="max-w-xl text-center"
                    >
                        <p className="text-xl lg:text-2xl font-medium opacity-50 leading-relaxed text-balance">
                            {personalInfo.tagline}
                        </p>
                    </motion.div>

                    {/* Quick Access Dock */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="mt-20 flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl"
                    >
                        {personalInfo.githubURL && <a href={personalInfo.githubURL} className="p-4 hover:bg-white hover:text-black rounded-2xl transition-all"><Github size={18} /></a>}
                        {personalInfo.linkedInURL && <a href={personalInfo.linkedInURL} className="p-4 hover:bg-white hover:text-black rounded-2xl transition-all"><Linkedin size={18} /></a>}
                        <a href={`mailto:${personalInfo.email}`} className="px-6 py-4 flex items-center gap-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-colors">
                            <Mail size={16} />
                            Contact
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 flex flex-col items-center gap-4 opacity-20"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Scroll</span>
                    <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
                </motion.div>
            </section>

            {/* --- NARRATIVE SECTION --- */}
            <section className="relative py-48 px-6 lg:px-24 z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-24 items-start">
                    <div className="lg:col-span-12 mb-12">
                        <div className="flex items-center gap-6 mb-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.8em] opacity-40">Narrative_Nodes</h2>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="space-y-12"
                        >
                            <p className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight">
                                Crafting digital <span className="text-white/20">monoliths</span> that define the <span className="underline decoration-white/20 underline-offset-[12px]">future</span> of user interaction.
                            </p>
                            <p className="text-xl opacity-60 leading-relaxed font-medium max-w-2xl">
                                {about.extendedBio}
                            </p>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 space-y-12">
                        <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl relative group">
                            <div className="absolute top-8 right-8 text-white/10 group-hover:text-white/30 transition-colors">
                                <Command size={32} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 block mb-12">Core_Capabilities</span>
                            <div className="flex flex-wrap gap-2">
                                {about.skills?.flatMap(cat => cat.tags).map((tag, i) => (
                                    <span key={i} className="px-5 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold tracking-tight hover:bg-white hover:text-black transition-all cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- REFREACTIVE ARTIFACTS (Projects) --- */}
            <section className="relative py-24 sm:py-48 z-10">
                <div className="px-4 sm:px-6 lg:px-24 mb-16 sm:mb-32 flex flex-col md:flex-row justify-between items-end gap-6 sm:gap-12">
                    <h2 className="text-4xl sm:text-[10vw] lg:text-[10vw] font-black tracking-tighter leading-none m-0 break-words">ARTIFACTS_<br /><span className="text-white/20">SPOTLIGHT</span></h2>
                    <div className="max-w-xs text-right opacity-30 text-xs font-bold leading-relaxed uppercase tracking-widest hidden lg:block">
                        A curated selection of experiments and production-ready deployments. Each node represents a leap in digital architecture.
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-[1px] bg-white/5 border-y border-white/5">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="group relative bg-[#050510] aspect-[16/10] overflow-hidden cursor-none"
                        >
                            {/* Refractive Image Container */}
                            <div className="w-full h-full overflow-hidden">
                                {project.imageURL ? (
                                    <img
                                        src={project.imageURL}
                                        alt={project.name}
                                        className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <Box size={40} className="opacity-10" />
                                    </div>
                                )}
                            </div>

                            {/* Info Reveal */}
                            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Entry_00{i + 1}</span>
                                        <h3 className="text-4xl lg:text-5xl font-black tracking-tighter">{project.name}</h3>
                                        <p className="text-sm opacity-60 max-w-sm font-medium">{project.description}</p>
                                    </div>
                                    <div className="p-5 rounded-full bg-white text-black shadow-2xl">
                                        <ArrowUpRight size={24} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- REGISTRY HISTORY (Experience) --- */}
            <section className="relative py-48 px-6 lg:px-24 z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col gap-12">
                        <div className="flex items-center gap-6 mb-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.8em] opacity-40">Registry_Log</h2>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="grid md:grid-cols-[1fr_2fr] gap-8 py-16 border-b border-white/5 group"
                            >
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black opacity-20 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{exp.dates}</div>
                                    <div className="text-xl font-black uppercase tracking-tight">{exp.company}</div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-3xl lg:text-4xl font-black tracking-tighter">{exp.jobTitle}</h4>
                                    <ul className="space-y-4">
                                        {exp.responsibilities?.map((resp, j) => (
                                            <li key={j} className="text-sm lg:text-base opacity-50 flex gap-4 leading-relaxed font-medium">
                                                <div className="mt-2.5 w-1 h-1 bg-white rounded-full flex-shrink-0" />
                                                {resp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- ARCHIVE FOOTER --- */}
            <footer className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-24 z-10">
                <div className="w-full max-w-7xl mx-auto flex flex-col items-center overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-12 sm:space-y-20 w-full"
                    >
                        <h2 className="text-4xl sm:text-[10vw] font-black tracking-tighter leading-none m-0 break-words">END_TRANS.<br /><span className="text-white/20">SYNC_NOW</span></h2>

                        <div className="flex flex-col items-center gap-8 sm:gap-12 w-full px-2">
                            <a href={`mailto:${personalInfo.email}`} className="text-sm sm:text-2xl md:text-5xl font-black hover:opacity-50 transition-opacity border-b-2 sm:border-b-4 border-white pb-2 sm:pb-4 max-w-full truncate">
                                {personalInfo.email}
                            </a>

                            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
                                {[
                                    { icon: Github, href: personalInfo.githubURL, label: 'GitHub' },
                                    { icon: Linkedin, href: personalInfo.linkedInURL, label: 'LinkedIn' },
                                    { icon: Globe, href: personalInfo.website, label: 'Portfolio' }
                                ].filter(i => i.href).map((link, i) => (
                                    <a key={i} href={link.href} className="px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white hover:text-black transition-all text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest flex items-center gap-2 sm:gap-3">
                                        <link.icon size={14} />
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-32 sm:mt-64 pt-8 sm:pt-12 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-8 opacity-20 text-[6px] sm:text-[8px] font-black uppercase tracking-[0.3em] sm:tracking-[1em]">
                        <span>© {new Date().getFullYear()} {personalInfo.fullName.replace(' ', '_')}</span>
                        <span>Archive_Ref: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                        <span>All Rights Reserved_</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
