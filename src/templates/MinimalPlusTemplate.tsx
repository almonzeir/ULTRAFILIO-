/* MinimalPlusTemplate.tsx - Apple-Inspired / Ultra Clean / Smooth Motion */
import React from 'react';
import type { PortfolioData } from './types';
import { User, ArrowUpRight, Github, Linkedin, Mail, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
    initial: {},
    whileInView: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function MinimalPlusTemplate({ data }: { data: PortfolioData }) {
    const { personalInfo, about, experience, projects, sectionOrder = ['hero', 'about', 'projects', 'experience', 'contact'] } = data;

    return (
        <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] font-sans selection:bg-[#0071e3] selection:text-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        .glass-nav {
            background: rgba(251, 251, 253, 0.8);
            backdrop-filter: saturate(180%) blur(20px);
        }
        .dark .glass-nav {
            background: rgba(0, 0, 0, 0.8);
        }

        .apple-button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .apple-button:hover {
            transform: scale(1.02);
            opacity: 0.9;
        }
      `}</style>

            {/* --- NAVIGATION --- */}
            <nav className="fixed top-0 w-full z-50 glass-nav border-b border-[#d2d2d7]/30 dark:border-[#424245]/30">
                <div className="max-w-screen-xl mx-auto px-6 h-12 md:h-14 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-semibold tracking-tight"
                    >
                        {personalInfo.fullName}
                    </motion.div>
                    <div className="flex gap-6 md:gap-10 text-[12px] font-medium text-[#1d1d1f]/60 dark:text-[#f5f5f7]/60">
                        <a href="#about" className="hover:text-[#0071e3] transition-colors">About</a>
                        <a href="#work" className="hover:text-[#0071e3] transition-colors">Work</a>
                        <a href="#contact" className="hover:text-[#0071e3] transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-screen-xl mx-auto">

                {/* Dynamic Section Rendering */}
                {sectionOrder.map((sectionId) => {
                    switch (sectionId) {
                        case 'hero':
                            return (
                                <section key="hero" className="min-h-[80vh] flex flex-col justify-center max-w-5xl mx-auto">
                                    <motion.div
                                        initial="initial"
                                        animate="animate"
                                        variants={staggerContainer}
                                    >
                                        <motion.div variants={fadeInUp} className="mb-6">
                                            <span className="inline-flex items-center px-4 py-1 bg-[#1d1d1f]/5 dark:bg-[#f5f5f7]/10 rounded-full text-[13px] font-medium">
                                                <Sparkles className="w-3.5 h-3.5 mr-2 text-[#0071e3]" />
                                                Available for collaboration
                                            </span>
                                        </motion.div>

                                        <motion.h1
                                            variants={fadeInUp}
                                            className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-10"
                                        >
                                            {personalInfo.fullName.split(' ')[0]} is a <span className="text-[#86868b]">{personalInfo.title}</span> <br className="hidden md:block" />
                                            designing things for humans.
                                        </motion.h1>

                                        <motion.p
                                            variants={fadeInUp}
                                            className="text-2xl md:text-3xl text-[#86868b] max-w-3xl leading-snug mb-12 font-medium"
                                        >
                                            {personalInfo.tagline}
                                        </motion.p>

                                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
                                            <a href="#work" className="px-8 py-3.5 bg-[#0071e3] text-white rounded-full font-semibold text-base apple-button shadow-lg shadow-[#0071e3]/20">
                                                View Projects
                                            </a>
                                            <a href="#contact" className="px-8 py-3.5 bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] rounded-full font-semibold text-base apple-button">
                                                Get in Touch
                                            </a>
                                        </motion.div>
                                    </motion.div>
                                </section>
                            );

                        case 'about':
                            return (
                                <section key="about" id="about" className="py-40 max-w-5xl mx-auto">
                                    <div className="grid md:grid-cols-[1fr_2fr] gap-20">
                                        <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
                                            <h2 className="text-[13px] font-bold tracking-widest uppercase text-[#86868b] mb-10">Biography</h2>
                                            <div className="bg-[#1d1d1f]/5 dark:bg-[#f5f5f7]/5 rounded-3xl aspect-square overflow-hidden mb-8">
                                                {personalInfo.profilePhotoURL ? (
                                                    <img src={personalInfo.profilePhotoURL} alt="Me" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center"><User size={60} className="text-[#d2d2d7]" /></div>
                                                )}
                                            </div>
                                        </motion.div>

                                        <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="flex flex-col justify-center">
                                            <div className="text-2xl md:text-4xl leading-tight text-[#1d1d1f] dark:text-[#f5f5f7] font-medium mb-12">
                                                {about.extendedBio}
                                            </div>

                                            <div className="grid grid-cols-2 gap-10">
                                                <div>
                                                    <h3 className="text-[13px] font-bold uppercase text-[#86868b] mb-6">Expertise</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {about.skills?.flatMap(cat => cat.tags).map((tag, i) => (
                                                            <span key={i} className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] bg-[#1d1d1f]/5 dark:bg-[#f5f5f7]/10 px-3 py-1.5 rounded-lg">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-[13px] font-bold uppercase text-[#86868b] mb-6">Location</h3>
                                                    <div className="text-[14px] font-medium">Available for remote world-wide</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </section>
                            );

                        case 'projects':
                            return (
                                <section key="projects" id="work" className="py-40">
                                    <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="max-w-5xl mx-auto mb-20 text-center">
                                        <h2 className="text-[13px] font-bold tracking-widest uppercase text-[#86868b] mb-6">Portfolio</h2>
                                        <h3 className="text-4xl md:text-6xl font-bold">Selected Case Studies</h3>
                                    </motion.div>

                                    <div className="grid md:grid-cols-2 gap-10 md:gap-20">
                                        {projects.map((project, i) => (
                                            <motion.article
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                                className="group cursor-pointer"
                                            >
                                                <div className="relative overflow-hidden bg-[#1d1d1f]/5 dark:bg-[#f5f5f7]/5 rounded-[32px] aspect-square mb-10 transition-transform duration-700 group-hover:scale-[1.02]">
                                                    {project.imageURL ? (
                                                        <img src={project.imageURL} alt={project.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#d2d2d7] text-8xl font-bold opacity-20">{i + 1}</div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <a href={project.detailsURL} className="absolute bottom-10 right-10 bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-lg p-4 rounded-full scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-white">
                                                        <ArrowUpRight className="w-6 h-6 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                                                    </a>
                                                </div>
                                                <div className="px-4">
                                                    <div className="text-[13px] font-bold text-[#0071e3] mb-3 uppercase tracking-wider">{project.category}</div>
                                                    <h3 className="text-3xl font-bold mb-4">{project.name}</h3>
                                                    <p className="text-[#86868b] text-lg leading-relaxed">{project.description}</p>
                                                </div>
                                            </motion.article>
                                        ))}
                                    </div>
                                </section>
                            );

                        case 'experience':
                            return (
                                <section key="experience" className="py-40 max-w-4xl mx-auto border-t border-[#d2d2d7]/30 dark:border-[#424245]/30">
                                    <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="mb-20">
                                        <h2 className="text-[13px] font-bold tracking-widest uppercase text-[#86868b] mb-12">Professional Experience</h2>
                                    </motion.div>

                                    <div className="space-y-20">
                                        {experience.map((exp, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="grid md:grid-cols-[1fr_2.5fr] gap-8"
                                            >
                                                <span className="text-lg text-[#86868b] font-medium">{exp.dates}</span>
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2">{exp.jobTitle}</h3>
                                                    <div className="text-xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-6 font-medium tracking-tight">/ {exp.company}</div>
                                                    <p className="text-[#86868b] leading-relaxed text-lg max-w-2xl">{exp.responsibilities[0]}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            );

                        case 'contact':
                            return (
                                <footer key="contact" id="contact" className="py-60 text-center max-w-4xl mx-auto">
                                    <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
                                        <h2 className="text-6xl md:text-9xl font-bold tracking-tight mb-16 leading-[0.9]">Let&apos;s build <br /> the future.</h2>
                                        <a href={`mailto:${personalInfo.email}`} className="text-2xl md:text-4xl text-[#0071e3] hover:underline decoration-2 underline-offset-8 transition-all font-medium">
                                            {personalInfo.email}
                                        </a>
                                        <div className="flex justify-center flex-wrap gap-10 mt-24">
                                            <a href={personalInfo.linkedInURL} className="text-[14px] font-bold tracking-wider hover:text-[#0071e3] transition-colors uppercase">LinkedIn</a>
                                            <a href={personalInfo.githubURL} className="text-[14px] font-bold tracking-wider hover:text-[#0071e3] transition-colors uppercase">GitHub</a>
                                            <a href={personalInfo.website} className="text-[14px] font-bold tracking-wider hover:text-[#0071e3] transition-colors uppercase">Website</a>
                                        </div>
                                        <div className="mt-40 text-[12px] text-[#86868b] font-medium tracking-widest uppercase">
                                            © {new Date().getFullYear()} {personalInfo.fullName} — Designed with passion.
                                        </div>
                                    </motion.div>
                                </footer>
                            );

                        default:
                            return null;
                    }
                })}
            </main>
        </div>
    );
}
