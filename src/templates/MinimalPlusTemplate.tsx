/* MinimalPlusTemplate.tsx - visionOS / Apple Professional Aesthetic */
import React from 'react';
import type { PortfolioData } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, ArrowUpRight, Github, Linkedin, Mail, Globe,
    Sparkles, Briefcase, GraduationCap, MapPin, ExternalLink,
    Cpu, Layout, Layers, Box
} from 'lucide-react';
import { cn } from '@/lib/utils';

const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1
};

const fadeInUp = {
    initial: { opacity: 0, y: 40, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
};

export default function MinimalPlusTemplate({ data, isDarkMode }: { data: PortfolioData; isDarkMode?: boolean }) {
    const { personalInfo, about, experience, projects, education, certifications, languages, sectionOrder = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'] } = data;

    return (
        <div className={cn(
            "min-h-screen selection:bg-blue-500 selection:text-white transition-colors duration-700 font-sans antialiased overflow-hidden",
            isDarkMode ? "bg-[#000] text-[#f5f5f7]" : "bg-[#fbfbfd] text-[#1d1d1f]"
        )}>

            {/* --- MESH GRADIENT BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] animate-pulse rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] animate-pulse rounded-full" />
            </div>

            {/* --- FLOATING NAVIGATION --- */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] sm:w-auto max-w-[calc(100%-2rem)]">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-3 sm:gap-6 px-4 sm:px-8 py-2 sm:py-3 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl overflow-x-auto"
                >
                    <div className="text-xs sm:text-sm font-bold tracking-tight pr-3 sm:pr-4 border-r border-white/10 whitespace-nowrap truncate max-w-[120px] sm:max-w-none">{personalInfo.fullName}</div>
                    <div className="flex gap-3 sm:gap-6 text-[10px] sm:text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.1em] whitespace-nowrap">
                        <a href="#about" className="hover:text-blue-500 transition-colors">Vision</a>
                        <a href="#projects" className="hover:text-blue-500 transition-colors">Space</a>
                        <a href="#experience" className="hover:text-blue-500 transition-colors">Flow</a>
                    </div>
                </motion.div>
            </nav>

            <main className="relative z-10 pt-40 px-6 max-w-7xl mx-auto space-y-40 pb-40">

                {/* --- HERO SECTION --- */}
                <section id="hero" className="flex flex-col items-center text-center max-w-5xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={springTransition}
                        className="mb-10 p-4 bg-white/30 dark:bg-white/5 rounded-3xl border border-white/20 backdrop-blur-xl"
                    >
                        {personalInfo.profilePhotoURL ? (
                            <img src={personalInfo.profilePhotoURL} className="w-24 h-24 rounded-2xl object-cover shadow-2xl" alt="Identity" />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <User size={40} className="text-white" />
                            </div>
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-5xl md:text-[5rem] font-black tracking-tight leading-[0.95] mb-8 sm:mb-12 break-words"
                    >
                        Design. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500">Scale.</span> <br />
                        Transform Reality.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg sm:text-2xl md:text-3xl font-medium text-[#86868b] max-w-3xl mb-8 sm:mb-12 break-words"
                    >
                        {personalInfo.tagline}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <a href="#projects" className="px-8 py-4 bg-blue-500 text-white rounded-full font-bold shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">Explore Works</a>
                        <a href={`mailto:${personalInfo.email}`} className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-full font-bold hover:bg-white/10 active:scale-95 transition-all">Connect Now</a>
                    </motion.div>
                </section>

                {/* --- ABOUT & STATS (Bento) --- */}
                <section id="about" className="grid lg:grid-cols-3 gap-6">
                    <motion.div
                        {...fadeInUp}
                        className="lg:col-span-2 p-6 sm:p-12 rounded-[24px] sm:rounded-[40px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-3xl flex flex-col justify-center"
                    >
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-4 sm:mb-8">The Philosophy</h2>
                        <div className="text-xl sm:text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight text-balance break-words">
                            {about.extendedBio}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6">
                        {about.stats?.map((stat, i) => (
                            <motion.div
                                key={i}
                                {...fadeInUp}
                                transition={{ delay: 0.1 * i }}
                                className="p-8 rounded-[32px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-3xl flex flex-col items-center text-center justify-center group hover:border-blue-500/50 transition-colors"
                            >
                                <div className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{stat.value}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</div>
                            </motion.div>
                        ))}
                        {(!about.stats || about.stats.length === 0) && (
                            <motion.div
                                {...fadeInUp}
                                className="p-8 rounded-[32px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 backdrop-blur-3xl flex flex-col items-center text-center justify-center"
                            >
                                <Sparkles size={32} className="text-blue-500 mb-4" />
                                <div className="text-sm font-bold uppercase tracking-widest">Digital Architect</div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* --- SKILLS BENTO --- */}
                <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {about.skills?.map((cat, i) => (
                        <motion.div
                            key={i}
                            {...fadeInUp}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[32px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-3xl space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-500">
                                    <Layers size={20} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest">{cat.category}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {cat.tags.map((tag, j) => (
                                    <span key={j} className="px-3 py-1.5 bg-white/50 dark:bg-white/5 rounded-xl text-[11px] font-bold border border-white/20 dark:border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* --- PROJECTS GRID --- */}
                <section id="projects" className="space-y-12">
                    <div className="flex items-end justify-between px-4">
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-4">Architecture_Nodes</h2>
                            <div className="text-4xl md:text-6xl font-black tracking-tighter">Spatial Experiences.</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {projects.map((project, i) => (
                            <motion.article
                                key={i}
                                {...fadeInUp}
                                className="group relative"
                            >
                                <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden bg-white/5 shadow-2xl transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-blue-500/10">
                                    {project.imageURL ? (
                                        <img src={project.imageURL} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={project.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-10">
                                            <Box size={100} />
                                        </div>
                                    )}
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <a href={project.detailsURL} className="p-6 bg-white text-black rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                                            <ExternalLink size={32} />
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-8 px-6 space-y-4">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#86868b]">
                                        <span>{project.category}</span>
                                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                                        <span>Node_{i + 1}</span>
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight">{project.name}</h3>
                                    <p className="text-lg font-medium opacity-50 line-clamp-2">{project.description}</p>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>

                {/* --- CAREER FLOW (Experience) --- */}
                <section id="experience" className="space-y-10 sm:space-y-16">
                    <h2 className="text-4xl sm:text-[6vw] md:text-[8vw] font-black tracking-tighter text-center break-words">Protocol_Run.</h2>

                    <div className="space-y-6">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                {...fadeInUp}
                                className="p-10 rounded-[32px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-3xl flex flex-col md:flex-row gap-12 group hover:bg-white/60 dark:hover:bg-white/10 transition-all cursor-default"
                            >
                                <div className="md:w-64">
                                    <div className="text-xl font-black text-blue-500 mb-2">{exp.dates}</div>
                                    <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">Session_Lock</div>
                                </div>
                                <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
                                    <div>
                                        <h4 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 group-hover:translate-x-2 transition-transform break-words">{exp.jobTitle}</h4>
                                        <div className="text-base sm:text-lg font-medium opacity-60 break-words">@ {exp.company}</div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {exp.responsibilities.map((res, ridx) => (
                                            <div key={ridx} className="p-4 bg-white/30 dark:bg-white/5 rounded-2xl text-sm border border-white/10">
                                                {res}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- ACADEMIC & CERTIFICATIONS --- */}
                <section className="grid lg:grid-cols-2 gap-10">
                    {education && education.length > 0 && (
                        <motion.div {...fadeInUp} className="p-12 rounded-[40px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-3xl space-y-12">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500">Academic_Nodes</h3>
                            <div className="space-y-12">
                                {education.map((edu, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="text-sm font-bold opacity-40">{edu.startDate} — {edu.endDate}</div>
                                        <h4 className="text-xl sm:text-3xl font-black tracking-tight break-words">{edu.degree}</h4>
                                        <p className="text-base sm:text-lg font-medium opacity-60 break-words">{edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-10">
                        {certifications && certifications.length > 0 && (
                            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="p-12 rounded-[40px] bg-blue-500/10 border border-blue-500/20 backdrop-blur-3xl">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-8">Valid_Protocols</h3>
                                <div className="grid gap-4">
                                    {certifications.map((cert, j) => (
                                        <div key={j} className="flex items-center gap-4 text-xl font-bold">
                                            <div className="p-2 bg-blue-500 rounded-lg"><Cpu size={16} className="text-white" /></div>
                                            {cert}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {languages && languages.length > 0 && (
                            <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="p-12 rounded-[40px] bg-purple-500/10 border border-purple-500/20 backdrop-blur-3xl">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-purple-500 mb-8">Signal_Processing</h3>
                                <div className="flex flex-wrap gap-10">
                                    {languages.map((lang, k) => (
                                        <div key={k} className="flex flex-col">
                                            <span className="text-2xl font-black tracking-tighter">{lang.name}</span>
                                            <span className="text-[10px] uppercase font-bold opacity-40">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* --- CONTACT & FOOTER --- */}
                <section id="contact" className="text-center py-16 sm:py-40 px-2">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-3xl sm:text-[8vw] md:text-[10vw] font-black tracking-tighter mb-8 sm:mb-16 leading-[0.85] break-words hyphens-auto">Beyond_Boundaries</h2>
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="group relative inline-flex items-center justify-center p-4 sm:p-12 bg-white/40 dark:bg-white/5 border-2 border-white/20 backdrop-blur-3xl rounded-full text-sm sm:text-3xl font-black hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-700 max-w-full"
                        >
                            <span className="truncate">{personalInfo.email}</span>
                            <ArrowUpRight className="ml-2 sm:ml-4 w-5 h-5 sm:w-8 sm:h-8 group-hover:scale-125 transition-transform flex-shrink-0" />
                        </a>

                        <div className="flex flex-wrap justify-center gap-4 sm:gap-12 mt-16 sm:mt-32 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] opacity-40">
                            <a href={personalInfo.githubURL} className="hover:opacity-100 hover:text-blue-500 transition-all">GitHub</a>
                            <a href={personalInfo.linkedInURL} className="hover:opacity-100 hover:text-blue-500 transition-all">LinkedIn</a>
                            <a href={personalInfo.website} className="hover:opacity-100 hover:text-blue-500 transition-all">Registry</a>
                        </div>

                        <div className="mt-20 sm:mt-40 text-[8px] sm:text-[9px] font-bold opacity-20 uppercase tracking-[0.5em] sm:tracking-[1em] break-words">
                            © {new Date().getFullYear()} {personalInfo.fullName.replace(' ', '_')} // Crystalline_Systems
                        </div>
                    </motion.div>
                </section>

            </main>
        </div>
    );
}
