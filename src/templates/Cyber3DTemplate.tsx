'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Terminal, Cpu, Code2, Zap, ChevronDown, Globe, Briefcase, GraduationCap } from 'lucide-react';
import type { PortfolioData } from './types';

// --- Animated Background Components ---

function MatrixRain() {
    const [columns, setColumns] = useState<{ x: number; chars: string[]; speed: number; opacity: number }[]>([]);

    useEffect(() => {
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]';
        const cols = Math.floor(window.innerWidth / 20);
        const newColumns = Array.from({ length: cols }, (_, i) => ({
            x: i * 20,
            chars: Array.from({ length: 25 }, () => chars[Math.floor(Math.random() * chars.length)]),
            speed: 2 + Math.random() * 4,
            opacity: 0.1 + Math.random() * 0.3
        }));
        setColumns(newColumns);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            {columns.map((col, i) => (
                <motion.div
                    key={i}
                    className="absolute text-cyan-500 text-xs font-mono whitespace-pre leading-5"
                    style={{ left: col.x, opacity: col.opacity }}
                    initial={{ y: -500 }}
                    animate={{ y: '100vh' }}
                    transition={{ duration: col.speed, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
                >
                    {col.chars.join('\n')}
                </motion.div>
            ))}
        </div>
    );
}

function GlowingOrb({ className }: { className?: string }) {
    return (
        <motion.div
            className={`absolute rounded-full blur-3xl ${className}`}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
    );
}

function CyberGrid({ isDarkMode }: { isDarkMode: boolean }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Horizontal scan line */}
            <motion.div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            {/* Perspective grid floor */}
            <div className={`absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t ${isDarkMode ? 'from-[#050510]' : 'from-slate-50'} to-transparent`} />
        </div>
    );
}

function TypewriterText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(text.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 50);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [text, delay]);

    useEffect(() => {
        const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <span className={className}>
            {displayText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
        </span>
    );
}

// --- Main Template Component ---

export default function Cyber3DTemplate({ data, isDarkMode, colorTheme }: { data: PortfolioData; isDarkMode?: boolean; colorTheme?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

    const { personalInfo, about, experience, projects, education, certifications, languages } = data;

    // FORCE DARK MODE ONLY - Ignore isDarkMode prop
    const forcedDarkMode = true;

    return (
        <div ref={containerRef} className={`relative min-h-screen ${forcedDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-[#050510] text-slate-900 dark:text-gray-100 font-mono selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-500`}>

            {/* Background Effects - Sticky so it follows scroll but stays in container */}
            <div className="absolute inset-0 z-0 h-full overflow-hidden">
                <div className="sticky top-0 h-screen w-full">
                    <CyberGrid isDarkMode={forcedDarkMode} />
                    <MatrixRain />
                    <GlowingOrb className="w-[600px] h-[600px] bg-cyan-600/20 -top-40 -right-40" />
                    <GlowingOrb className="w-[400px] h-[400px] bg-fuchsia-600/20 bottom-20 -left-20" />
                    <GlowingOrb className="w-[300px] h-[300px] bg-violet-600/20 top-1/2 left-1/2" />
                </div>
            </div>

            {/* Header - Sticky */}
            <header className={`sticky top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md ${forcedDarkMode ? 'bg-[#050510]/80' : 'bg-white/80'} border-b border-cyan-900/30 transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-sm font-bold tracking-widest text-white">
                            {personalInfo.portfolioNameAbbr || 'SYS'}
                            <span className="text-cyan-500">.INIT</span>
                        </span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest text-gray-500">
                        <a href="#about" className="hover:text-cyan-400 transition-colors">&lt;About /&gt;</a>
                        <a href="#projects" className="hover:text-cyan-400 transition-colors">&lt;Projects /&gt;</a>
                        <a href="#experience" className="hover:text-cyan-400 transition-colors">&lt;Experience /&gt;</a>
                        <a href="#contact" className="hover:text-cyan-400 transition-colors">&lt;Contact /&gt;</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <motion.section
                className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20"
                style={{ opacity: heroOpacity, scale: heroScale }}
            >
                <div className="relative z-10 text-center max-w-4xl">
                    {/* Cyber Avatar (New Addition) */}
                    {personalInfo.profilePhotoURL && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-40 h-40 mx-auto mb-12 group"
                        >
                            {/* Rotating rings */}
                            <div className="absolute inset-[-10px] rounded-full border border-cyan-500/30 border-t-white/50 animate-[spin_4s_linear_infinite]" />
                            <div className="absolute inset-[-20px] rounded-full border border-fuchsia-500/20 border-b-white/30 animate-[spin_7s_linear_infinite_reverse]" />

                            {/* Circular Container - Fixed Shape Mismatch */}
                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyan-500/30 bg-black/50 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                <img
                                    src={personalInfo.profilePhotoURL}
                                    alt={personalInfo.fullName}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                {/* Scanline overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
                                {/* Glitch overlay on hover */}
                                <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none" />
                            </div>

                            {/* Label */}
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                                <span className="px-3 py-1 bg-[#050510] border border-cyan-500 text-[10px] text-cyan-400 font-mono tracking-[0.2em] uppercase rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                    Identity_Confirmed
                                </span>
                            </div>
                        </motion.div>
                    )}
                    {/* Glitch effect name */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative px-2"
                    >
                        <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 relative break-words">
                            <span className="relative inline-block">
                                <span className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 blur-2xl opacity-30 animate-pulse" />
                                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">
                                    {(personalInfo.fullName || 'YOUR NAME').toUpperCase()}
                                </span>
                            </span>
                        </h1>
                    </motion.div>

                    {/* Title with typewriter */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-2 text-xl md:text-2xl text-cyan-400 mb-8"
                    >
                        <Terminal className="w-5 h-5" />
                        <TypewriterText text={`> ${personalInfo.title}`} delay={1000} />
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        {personalInfo.tagline}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <a
                            href="#projects"
                            className="group relative px-8 py-4 bg-cyan-500/10 border border-cyan-500/50 rounded-sm overflow-hidden hover:border-cyan-400 transition-all"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex items-center gap-2 text-cyan-400 font-bold tracking-wider">
                                <Code2 className="w-4 h-4" />
                                VIEW_PROJECTS
                            </span>
                        </a>
                        <a
                            href="#contact"
                            className="group relative px-8 py-4 bg-fuchsia-500/10 border border-fuchsia-500/50 rounded-sm overflow-hidden hover:border-fuchsia-400 transition-all"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex items-center gap-2 text-fuchsia-400 font-bold tracking-wider">
                                <Zap className="w-4 h-4" />
                                INIT_CONTACT
                            </span>
                        </a>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 3, duration: 2, repeat: Infinity }}
                >
                    <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </motion.section>

            {/* About Section - Terminal Style */}
            <section id="about" className="relative z-10 py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                <span className="text-cyan-500">&lt;</span>About<span className="text-cyan-500"> /&gt;</span>
                            </h2>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent" />
                        </div>

                        {/* Terminal Window */}
                        <div className="bg-[#0a0a1a]/90 backdrop-blur-xl border border-cyan-900/50 rounded-lg overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.1)]">
                            {/* Terminal Header */}
                            <div className="bg-[#0f0f20] px-4 py-3 flex items-center gap-3 border-b border-cyan-900/30">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-xs text-gray-500 font-mono">user@portfolio:~/about</span>
                                </div>
                            </div>

                            {/* Terminal Content */}
                            <div className="p-8 space-y-6">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-500">➜</span>
                                    <span className="text-cyan-400">cat</span>
                                    <span className="text-gray-400">bio.txt</span>
                                </div>
                                {/* TERMINAL TYPING BIO - Types out like real terminal */}
                                <div className="pl-6 border-l-2 border-cyan-900/50">
                                    <TypewriterText
                                        text={about.extendedBio || personalInfo.tagline || ''}
                                        className="text-gray-300 leading-relaxed text-lg block"
                                        delay={500}
                                    />
                                </div>

                                {/* Stats Grid */}
                                {about.stats && about.stats.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                        {about.stats.map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                                className="bg-gradient-to-br from-cyan-950/50 to-transparent p-4 rounded border border-cyan-900/30 hover:border-cyan-500/50 transition-colors"
                                            >
                                                <div className="text-3xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* Skills */}
                                {about.skills && about.skills.length > 0 && (
                                    <div className="mt-8">
                                        <div className="flex items-start gap-2 mb-4">
                                            <span className="text-green-500">➜</span>
                                            <span className="text-cyan-400">ls</span>
                                            <span className="text-gray-400">skills/</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pl-6">
                                            {about.skills.map((category, i) =>
                                                category.tags?.map((skill, j) => (
                                                    <motion.span
                                                        key={`${i}-${j}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: (i * 0.05) + (j * 0.02) }}
                                                        className="px-3 py-1 text-xs bg-cyan-950/50 text-cyan-300 border border-cyan-800/50 rounded-sm hover:bg-cyan-900/50 hover:border-cyan-500/50 transition-all cursor-default"
                                                    >
                                                        {skill}
                                                    </motion.span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="relative z-10 py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-16 justify-end"
                    >
                        <div className="flex-1 h-[1px] bg-gradient-to-l from-fuchsia-500/50 to-transparent" />
                        <Cpu className="text-fuchsia-500 animate-pulse flex-shrink-0" />
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white whitespace-nowrap">
                            <span className="text-fuchsia-500">&lt;</span>Projects<span className="text-fuchsia-500"> /&gt;</span>
                        </h2>
                    </motion.div>

                    {/* Projects Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((project, i) => (
                            <motion.article
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-[#0a0a1a]/80 backdrop-blur-sm border border-fuchsia-900/30 rounded-lg overflow-hidden hover:border-fuchsia-500/50 transition-all duration-500"
                            >
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Scanning line effect */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                {/* Corner decorations */}
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-fuchsia-500/50 group-hover:border-fuchsia-400 transition-colors" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fuchsia-500/50 group-hover:border-fuchsia-400 transition-colors" />

                                {/* Content */}
                                <div className="relative p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="text-xs text-fuchsia-400 uppercase tracking-wider mb-2">{project.category}</div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                                                {project.name}
                                            </h3>
                                        </div>
                                        {project.detailsURL && (
                                            <a href={project.detailsURL} target="_blank" rel="noopener" className="p-2 rounded bg-fuchsia-500/10 text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-fuchsia-500/20">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags?.slice(0, 4).map((tag, j) => (
                                            <span key={j} className="text-[10px] uppercase px-2 py-1 bg-fuchsia-950/50 text-fuchsia-300 border border-fuchsia-800/50 rounded-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="relative z-10 py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-16"
                    >
                        <Briefcase className="text-violet-500" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            <span className="text-violet-500">&lt;</span>Experience<span className="text-violet-500"> /&gt;</span>
                        </h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-500/50 via-cyan-500/50 to-fuchsia-500/50" />

                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative mb-12 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}
                            >
                                {/* Timeline dot */}
                                <div className={`absolute top-0 w-4 h-4 rounded-full bg-violet-500 border-4 border-[#050510] ${i % 2 === 0 ? '-right-2 md:right-[-9px]' : '-left-2 md:left-[-9px]'}`} />

                                <div className="bg-[#0a0a1a]/80 backdrop-blur-sm border border-violet-900/30 rounded-lg p-6 hover:border-violet-500/50 transition-colors ml-6 md:ml-0">
                                    <div className="text-xs text-violet-400 mb-2">{exp.dates}</div>
                                    <h3 className="text-xl font-bold text-white mb-1">{exp.jobTitle}</h3>
                                    <div className="text-cyan-400 text-sm mb-4">@ {exp.company}</div>
                                    <p className="text-gray-400 text-sm">{exp.responsibilities?.[0]}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Credentials & Knowledge Section */}
            {((education && education.length > 0) || (certifications && certifications.length > 0)) && (
                <section id="credentials" className="relative z-10 py-32 px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#0a0a1a]/60 backdrop-blur-md border border-cyan-900/30 rounded-2xl p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Circuit decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
                                {/* Education */}
                                {education && education.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-10 flex-wrap">
                                            <GraduationCap className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                            <h2 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-tight break-words">Academic_Registry</h2>
                                        </div>
                                        <div className="space-y-8">
                                            {education.map((edu, i) => (
                                                <div key={i} className="group border-l-2 border-cyan-900/50 pl-6 hover:border-cyan-400 transition-colors">
                                                    <div className="text-[10px] text-cyan-500/70 font-mono mb-1 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</div>
                                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{edu.degree}</h3>
                                                    <div className="text-gray-400 text-sm font-medium">{edu.institution}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certifications & Languages */}
                                <div className="space-y-16">
                                    {certifications && certifications.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-3 mb-10 flex-wrap">
                                                <Zap className="text-fuchsia-400 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                                <h2 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-tight break-words">Security_Clearance</h2>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {certifications.map((cert, i) => (
                                                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-fuchsia-950/20 border border-fuchsia-900/30 rounded-lg group hover:border-fuchsia-500/50 transition-all">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
                                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors">{cert}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {languages && languages.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-3 mb-10 flex-wrap">
                                                <Globe className="text-violet-400 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                                <h2 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-tight break-words">Lexicon_Uplink</h2>
                                            </div>
                                            <div className="flex flex-wrap gap-8">
                                                {languages.map((lang, i) => (
                                                    <div key={i} className="flex flex-col items-start gap-1">
                                                        <div className="text-[10px] text-violet-400 font-mono uppercase tracking-widest opacity-60">{lang.level || 'Mastery'}</div>
                                                        <div className="text-2xl font-black text-white italic tracking-tighter">{lang.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Contact Section */}
            <section id="contact" className="relative z-10 py-32 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-8 break-words">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400">
                                ESTABLISH_UPLINK
                            </span>
                        </h2>
                        <p className="text-gray-400 text-base sm:text-lg mb-12 max-w-xl mx-auto">
                            Ready to collaborate? Initialize a new connection and let&apos;s build something extraordinary together.
                        </p>

                        {/* Contact Links */}
                        <div className="flex flex-wrap justify-center gap-6">
                            {personalInfo.githubURL && (
                                <a
                                    href={personalInfo.githubURL}
                                    target="_blank"
                                    rel="noopener"
                                    className="group flex flex-col items-center gap-3"
                                >
                                    <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/50 to-transparent border border-cyan-800/50 group-hover:border-cyan-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all">
                                        <Github className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <span className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-cyan-400 transition-colors">GitHub</span>
                                </a>
                            )}
                            {personalInfo.linkedInURL && (
                                <a
                                    href={personalInfo.linkedInURL}
                                    target="_blank"
                                    rel="noopener"
                                    className="group flex flex-col items-center gap-3"
                                >
                                    <div className="p-5 rounded-xl bg-gradient-to-br from-fuchsia-950/50 to-transparent border border-fuchsia-800/50 group-hover:border-fuchsia-500 group-hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-all">
                                        <Linkedin className="w-8 h-8 text-fuchsia-400" />
                                    </div>
                                    <span className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-fuchsia-400 transition-colors">LinkedIn</span>
                                </a>
                            )}
                            {personalInfo.email && (
                                <a
                                    href={`mailto:${personalInfo.email}`}
                                    className="group flex flex-col items-center gap-3"
                                >
                                    <div className="p-5 rounded-xl bg-gradient-to-br from-violet-950/50 to-transparent border border-violet-800/50 group-hover:border-violet-500 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all">
                                        <Mail className="w-8 h-8 text-violet-400" />
                                    </div>
                                    <span className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-violet-400 transition-colors">Email</span>
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-8 px-6 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-xs text-gray-600 font-mono">
                        &lt;/&gt; Built with <span className="text-cyan-500">passion</span> • © {new Date().getFullYear()} {personalInfo.fullName}
                    </p>
                </div>
            </footer>
        </div>
    );
}
