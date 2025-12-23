/* ExecutiveTemplate.tsx - Stunning 'Authoritative & Elegant' Redesign */
import React from 'react';
import type { PortfolioData } from './types';
import { Mail, Phone, MapPin, Scale, ArrowRight, Linkedin, Github, Globe, ExternalLink, Award, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ExecutiveTemplate({ data, isDarkMode }: { data: PortfolioData; isDarkMode?: boolean }) {
    const { personalInfo, about, experience, projects, education, certifications, languages } = data;

    // Consolidate skills by category - groups all skills with same category together
    const consolidatedSkills = React.useMemo(() => {
        if (!about.skills) return [];
        const groups: Record<string, { category: string, icon?: string, tags: Set<string> }> = {};
        about.skills.forEach(skill => {
            const key = skill.category || 'Core Skills';
            if (!groups[key]) {
                groups[key] = { category: key, icon: skill.icon, tags: new Set() };
            }
            skill.tags.forEach(t => groups[key].tags.add(t));
        });
        return Object.values(groups).map(g => ({ ...g, tags: Array.from(g.tags) }));
    }, [about.skills]);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-white dark:bg-[#050507] text-slate-800 dark:text-slate-200 font-sans selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500`}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        :root {
          --font-heading: 'Cormorant Garamond', serif;
          --font-body: 'Inter', sans-serif;
        }

        .font-heading { font-family: var(--font-heading); }
        .font-body { font-family: var(--font-body); }

        .executive-border {
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .dark .executive-border {
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .executive-card {
            background: #fff;
            border: 1px solid rgba(0,0,0,0.05);
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }
        .dark .executive-card {
            background: #0a0a0c;
            border: 1px solid rgba(255,255,255,0.03);
            box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
        }
      `}</style>

            {/* --- SIDEBAR NAV --- */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-24 border-r border-slate-100 dark:border-white/5 bg-white dark:bg-[#050507] z-50 items-center py-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold font-heading tracking-widest text-[hsl(var(--brand))] rotate-180"
                    style={{ writingMode: 'vertical-rl' }}
                >
                    {personalInfo.portfolioNameAbbr}
                </motion.div>

                <div className="flex-1 flex flex-col justify-center gap-14">
                    {['Home', 'Bio', 'Work', 'Contact'].map((item, i) => (
                        <a
                            key={i}
                            href={`#${item.toLowerCase()}`}
                            className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 hover:text-[hsl(var(--brand))] transition-colors rotate-180"
                            style={{ writingMode: 'vertical-rl' }}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="w-px h-24 bg-gradient-to-t from-[hsl(var(--brand))] to-transparent"></div>
            </aside>

            {/* --- MAIN --- */}
            <main className="lg:pl-24 w-full">

                {/* --- HERO SECTION --- */}
                <section id="home" className="min-h-screen flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-20 bg-white dark:bg-[#070709] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[hsl(var(--brand))] opacity-[0.03] -z-10 pointer-events-none skew-x-[-15deg] translate-x-20" />

                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.4fr_1fr] gap-20 items-center relative z-10"
                    >
                        <div>
                            <motion.div
                                variants={fadeInUp}
                                className="flex items-center gap-4 mb-8"
                            >
                                <div className="h-px w-12 bg-[hsl(var(--brand))]" />
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                                    Established {new Date().getFullYear() - 10}+
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="font-heading text-6xl sm:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-12 text-slate-900 dark:text-white"
                            >
                                {(personalInfo.fullName || 'Your Name').split(' ').map((name, i) => (
                                    <span key={i} className={i === 1 ? "text-slate-400 dark:text-slate-600 block italic font-normal" : "block"}>
                                        {name}
                                    </span>
                                ))}
                            </motion.h1>

                            <div className="flex flex-col gap-10">
                                <motion.p
                                    variants={fadeInUp}
                                    className="font-body text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed italic"
                                >
                                    {personalInfo.tagline}
                                </motion.p>

                                <motion.div
                                    variants={fadeInUp}
                                    className="flex flex-wrap gap-8"
                                >
                                    <a href="#contact" className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl">
                                        INITIATE_CONTACT
                                    </a>
                                    <a href="#work" className="px-12 py-5 border border-slate-300 dark:border-white/10 font-bold tracking-widest text-sm hover:bg-white/10 transition-all">
                                        CASE_STUDIES
                                    </a>
                                </motion.div>


                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="hidden lg:flex justify-end"
                        >
                            <div className="relative w-full aspect-[4/5] max-w-md group">
                                <div className="absolute inset-0 border border-[hsl(var(--brand))] translate-x-10 translate-y-10 -z-10 group-hover:translate-x-12 group-hover:translate-y-12 transition-transform duration-700" />
                                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 overflow-hidden executive-card relative">
                                    {personalInfo.profilePhotoURL ? (
                                        <img src={personalInfo.profilePhotoURL} className="w-full h-full object-cover filter contrast-110 grayscale group-hover:grayscale-0 transition-all duration-1000" alt={personalInfo.fullName} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900"><Scale size={100} className="text-slate-200 dark:text-slate-800" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                                <div className="absolute -bottom-8 -left-8 bg-[hsl(var(--brand))] text-white p-8 shadow-2xl">
                                    <div className="text-3xl font-heading font-bold leading-none mb-1">Elite</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Tier Status</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- EXECUTIVE BIO --- */}
                <section id="bio" className="py-40 px-8 sm:px-12 lg:px-24 bg-white dark:bg-[#050507]">
                    <div className="max-w-5xl mx-auto">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-xs font-black uppercase tracking-[0.4em] text-[hsl(var(--brand))] mb-8 block"
                        >
                            Mission_Statement
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl md:text-6xl font-bold mb-16 leading-tight max-w-4xl"
                        >
                            {about.extendedBio}
                        </motion.h2>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-24 border-t border-slate-100 dark:border-white/5 pt-16">
                            {about.stats?.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="font-heading text-6xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Core Competencies (Skills) */}
                        {consolidatedSkills.length > 0 && (
                            <div className="mt-40">
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-12 block">Core_Competencies</span>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-12">
                                    {consolidatedSkills.map((skill, i) => (
                                        <div key={i}>
                                            <h4 className="font-heading text-xl font-bold mb-4 flex items-center gap-3">
                                                <div className="w-1 h-3 bg-[hsl(var(--brand))] opacity-50" />
                                                {skill.category}
                                            </h4>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                {skill.tags.map(tag => (
                                                    <span key={tag} className="text-[11px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* --- EXPERIENCE --- */}
                <section id="work" className="py-40 px-8 sm:px-12 lg:px-24 bg-slate-50 dark:bg-[#070709]">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-slate-200 dark:border-white/5 pb-12">
                            <div>
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-[hsl(var(--brand))] mb-4 block">Strategic_Timeline</span>
                                <h2 className="font-heading text-5xl md:text-7xl font-bold">Experience</h2>
                            </div>
                        </div>

                        <div className="space-y-24">
                            {experience.map((job, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="grid lg:grid-cols-[1fr_2fr] gap-12 group"
                                >
                                    <div className="lg:text-right pt-2">
                                        <div className="text-sm font-black text-slate-900 dark:text-white mb-1 uppercase tracking-widest">{job.dates}</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{job.location || 'Remote'}</div>
                                    </div>
                                    <div className="relative pl-0 lg:pl-16 lg:border-l border-slate-200 dark:border-white/5">
                                        <h3 className="text-3xl font-heading font-bold mb-2 transition-colors group-hover:text-[hsl(var(--brand))]">{job.jobTitle}</h3>
                                        <div className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-8">{job.company}</div>
                                        <ul className="space-y-4 max-w-2xl">
                                            {job.responsibilities.map((resp, rIdx) => (
                                                <li key={rIdx} className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex gap-4 italic font-medium">
                                                    <div className="h-px w-4 bg-[hsl(var(--brand))] mt-3 shrink-0" />
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

                {/* --- PROJECTS --- */}
                <section className="py-40 px-8 sm:px-12 lg:px-24 bg-white dark:bg-[#050507]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-32">
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-6 block">Curated_Engagements</span>
                            <h2 className="font-heading text-5xl md:text-7xl font-bold">Key Initiatives</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {projects.map((project, i) => (
                                <motion.article
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-900 mb-8 executive-card transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
                                        {project.imageURL ? (
                                            <img src={project.imageURL} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={project.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-800 font-heading text-9xl">0{i + 1}</div>
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a href={project.detailsURL} target="_blank" className="p-4 bg-white text-slate-900 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                                                <ArrowRight className="w-8 h-8" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--brand))]">{project.category}</span>
                                        <h3 className="text-2xl font-heading font-bold">{project.name}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 italic">{project.description}</p>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- ACADEMIC & ACCREDITATIONS --- */}
                {((education && education.length > 0) || (certifications && certifications.length > 0)) && (
                    <section className="py-40 px-8 sm:px-12 lg:px-24 border-t border-slate-100 dark:border-white/5">
                        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32">
                            {/* Education */}
                            {education && education.length > 0 && (
                                <div>
                                    <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-12 block">Academic_Foundation</span>
                                    <div className="space-y-16">
                                        {education.map((edu, idx) => (
                                            <div key={idx} className="group">
                                                <div className="text-[10px] font-black text-[hsl(var(--brand))] mb-2 uppercase tracking-[0.2em]">{edu.startDate} — {edu.endDate}</div>
                                                <h3 className="font-heading text-3xl font-bold mb-2 group-hover:italic transition-all">{edu.degree}</h3>
                                                <div className="text-sm font-bold uppercase tracking-widest text-slate-500">{edu.institution}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certifications & Languages */}
                            <div className="space-y-32">
                                {certifications && certifications.length > 0 && (
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-12 block">Professional_Accreditations</span>
                                        <div className="grid gap-6">
                                            {certifications.map((cert, idx) => (
                                                <div key={idx} className="flex items-center gap-6 group">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand))] opacity-30 group-hover:opacity-100 transition-opacity" />
                                                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 italic">{cert}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {languages && languages.length > 0 && (
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-12 block">Linguistic_Proficiency</span>
                                        <div className="flex flex-wrap gap-x-12 gap-y-6">
                                            {languages.map((lang, idx) => (
                                                <div key={idx}>
                                                    <div className="text-[10px] font-black text-slate-400 mb-1 uppercase italic tracking-widest">{lang.level || 'Mastery'}</div>
                                                    <div className="font-heading text-2xl font-bold uppercase">{lang.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* --- FOOTER / CONTACT --- */}
                <footer id="contact" className="bg-slate-900 dark:bg-black text-white pt-20 sm:pt-40 pb-20 px-4 sm:px-8 lg:px-24">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32">
                        <div>
                            <h2 className="font-heading text-4xl sm:text-6xl md:text-8xl font-bold mb-12 italic">Let&apos;s talk strategy.</h2>
                            <div className="grid gap-12 font-medium tracking-wide">
                                <div className="space-y-2">
                                    <div className="text-xs uppercase tracking-[0.4em] text-slate-500 mb-4">Direct_Line</div>
                                    <a href={`mailto:${personalInfo.email}`} className="text-lg sm:text-2xl md:text-4xl hover:text-[hsl(var(--brand))] transition-colors border-b border-white/10 pb-2 block w-max break-all max-w-full">{personalInfo.email}</a>
                                </div>
                                <div className="flex gap-12 pt-12 border-t border-white/5">
                                    <a href={personalInfo.linkedInURL} className="text-xs font-black uppercase tracking-[0.3em] hover:text-[hsl(var(--brand))] transition-colors">LINKEDIN</a>
                                    <a href={personalInfo.githubURL} className="text-xs font-black uppercase tracking-[0.3em] hover:text-[hsl(var(--brand))] transition-colors">GITHUB</a>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end">
                            <div className="relative group">
                                <div className="absolute inset-0 border border-white/10 translate-x-4 translate-y-4 pointer-events-none group-hover:translate-x-6 group-hover:translate-y-6 transition-transform" />
                                <div className="bg-white/5 p-16 backdrop-blur-xl border border-white/10">
                                    <h4 className="font-heading text-3xl mb-12">Private Inquiries</h4>
                                    <div className="flex flex-col gap-10">
                                        <div className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                            Currently reviewing opportunities for Q1-Q2 of {new Date().getFullYear() + 1}. High-impact collaborations preferred.
                                        </div>
                                        <a href={`mailto:${personalInfo.email}`} className="px-10 py-5 bg-white text-slate-900 font-bold uppercase tracking-widest text-xs hover:bg-[hsl(var(--brand))] hover:text-white transition-all text-center">
                                            SECURE_MESSAGE
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="font-heading text-2xl font-bold">{personalInfo.fullName}</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                            © {new Date().getFullYear()} — PRIVACY_RESERVED
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
