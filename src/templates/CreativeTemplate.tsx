/* CreativeTemplate.tsx - Stunning 'Neo-Brutalism' Framer Motion Redesign */
import React from 'react';
import type { PortfolioData } from './types';
import { Ghost, ArrowUpRight, Github, Linkedin, Mail, ExternalLink, Moon, Sun, Sparkles, Zap, GraduationCap } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function CreativeTemplate({ data, isDarkMode }: { data: PortfolioData; isDarkMode?: boolean }) {
    const { personalInfo, about, experience, projects, education, certifications, languages } = data;
    const { scrollYProgress } = useScroll();
    const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#f3f3f3] dark:bg-[#080808] text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden transition-colors duration-500`}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        :root {
          --border-thick: 4px solid currentColor;
          --shadow-hard: 8px 8px 0px 0px currentColor;
          --shadow-hard-hover: 4px 4px 0px 0px currentColor;
        }
        body { font-family: 'Space Grotesk', sans-serif; }
        .neo-box {
          border: var(--border-thick);
          box-shadow: var(--shadow-hard);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .neo-box:hover {
          transform: translate(2px, 2px);
          box-shadow: var(--shadow-hard-hover);
        }
        .marquee-text {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

            {/* --- TOP MARQUEE --- */}
            <div className="bg-[hsl(var(--brand))] text-black py-2 sm:py-4 border-b-4 border-black dark:border-white overflow-hidden relative z-50">
                <div className="whitespace-nowrap marquee-text">
                    <span className="text-sm sm:text-2xl font-black uppercase tracking-tighter">
                        {Array(10).fill(`${personalInfo.fullName} • ${personalInfo.title} • AVAILABLE FOR WORK • `).join('')}
                    </span>
                </div>
            </div>

            {/* --- HERO --- */}
            <section className="min-h-[90vh] grid lg:grid-cols-2">
                {/* Left side: Bold Text */}
                <div className="flex flex-col justify-center p-4 sm:p-8 md:p-16 lg:p-24 border-b-4 lg:border-b-0 lg:border-r-4 border-black dark:border-white bg-[#FFDEE9] dark:bg-[#111111] relative overflow-hidden">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 0 }}
                            className="neo-box bg-white dark:bg-black text-black dark:text-white inline-block px-3 sm:px-6 py-1 sm:py-2 font-black text-xs sm:text-xl mb-6 sm:mb-12 rotate-[-2deg] cursor-pointer"
                        >
                            CREATIVE_STORM // 01
                        </motion.div>

                        <h1 className="text-4xl sm:text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-6 sm:mb-12 uppercase italic">
                            DOING <br />
                            <span className="text-outline-black dark:text-outline-white text-transparent">COOL</span> <br />
                            <span className="text-[hsl(var(--brand))]">MAGIC.</span>
                        </h1>

                        <p className="text-sm sm:text-xl md:text-3xl font-bold max-w-lg mb-6 sm:mb-12 border-l-4 sm:border-l-8 border-black dark:border-white pl-4 sm:pl-8 leading-tight">
                            {personalInfo.tagline}
                        </p>

                        <div className="flex flex-wrap gap-3 sm:gap-6 mb-8 sm:mb-16">
                            <motion.a
                                whileHover={{ scale: 1.1, rotate: -2, x: 5, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                href="#projects"
                                className="neo-box bg-black text-white dark:bg-white dark:text-black px-6 sm:px-12 py-3 sm:py-6 font-black text-sm sm:text-2xl transition-shadow hover:shadow-[12px_12px_0px_0px_currentColor]"
                            >
                                SHOW_ME
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, rotate: 2, x: -5, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                href="#contact"
                                className="neo-box bg-white text-black px-6 sm:px-12 py-3 sm:py-6 font-black text-sm sm:text-2xl transition-shadow hover:shadow-[12px_12px_0px_0px_currentColor]"
                            >
                                HELLO?
                            </motion.a>
                        </div>
                    </motion.div>
                </div>

                {/* Right side: Abstract Visuals */}
                <div className="relative h-[50vh] sm:h-full bg-[hsl(var(--brand-2))] flex items-center justify-center p-6 sm:p-12 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-10%] right-[-10%] w-48 sm:w-96 h-48 sm:h-96 border-[10px] sm:border-[20px] border-white/20 rounded-full"
                    />
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 5 }}
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        transition={{ duration: 1.2, type: "spring" }}
                        className="relative z-10 w-48 h-48 sm:w-80 sm:h-80 md:w-[450px] md:h-[450px] neo-box bg-white rounded-[2rem] sm:rounded-[4rem] p-1 sm:p-2 border-[4px] sm:border-[8px] border-black overflow-hidden group shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] sm:shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                    >
                        {personalInfo.profilePhotoURL ? (
                            <img src={personalInfo.profilePhotoURL} className="w-full h-full object-cover filter saturate-200 contrast-125 group-hover:scale-110 transition-transform duration-700" alt="ME" />
                        ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center text-white"><Ghost size={60} className="sm:w-[120px] sm:h-[120px]" /></div>
                        )}
                        <div className="absolute inset-0 bg-[hsl(var(--brand))] mix-blend-overlay opacity-20 pointer-events-none" />
                        <div className="absolute bottom-4 right-4 sm:bottom-12 sm:right-12 bg-black text-white border sm:border-2 border-white px-3 py-1 sm:px-6 sm:py-2 font-black text-xs sm:text-xl rotate-[-10deg] shadow-[2px_2px_0px_0px_white] sm:shadow-[4px_4px_0px_0px_white] group-hover:rotate-0 transition-all">
                            VISUAL_MAXIMALIST
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- ABOUT & SKILLS --- */}
            <section className="py-16 sm:py-32 px-4 sm:px-8 flex flex-col items-center border-y-4 border-black dark:border-white bg-white dark:bg-black">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="max-w-6xl text-center">
                    <h2 className="text-xl sm:text-4xl md:text-7xl font-black uppercase italic leading-none mb-10 sm:mb-20 tracking-tighter">
                        "{about.extendedBio}"
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
                        {about.skills?.map(skill => skill.tags?.map(tag => (
                            <motion.div key={tag} whileHover={{ y: -10, rotate: Math.random() * 10 - 5 }} className="neo-box px-4 sm:px-8 py-2 sm:py-4 bg-[hsl(var(--brand-2))] text-black font-black text-sm sm:text-2xl uppercase italic">
                                {tag}
                            </motion.div>
                        )))}
                    </div>
                </motion.div>
            </section>

            {/* --- EXPERIENCE --- */}
            <section className="py-16 sm:py-32 px-4 sm:px-8 bg-black text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="neo-box bg-yellow-400 text-black inline-block px-5 sm:px-10 py-3 sm:py-5 font-black text-xl sm:text-4xl mb-12 sm:mb-24 rotate-[-2deg] uppercase">Journey_Log</div>
                    <div className="space-y-8 sm:space-y-16">
                        {experience.map((job, i) => (
                            <motion.div key={i} whileHover={{ x: 20 }} className="neo-box p-4 sm:p-12 bg-white dark:bg-black border-white flex flex-col gap-4 sm:gap-12 group transition-all">
                                <div className="max-w-2xl">
                                    <h3 className="text-2xl sm:text-5xl font-black uppercase tracking-tighter mb-2 sm:mb-4 italic text-black dark:text-white group-hover:text-[hsl(var(--brand))]">{job.jobTitle}</h3>
                                    <div className="text-sm sm:text-2xl font-black text-zinc-500 mb-4 sm:mb-8 tracking-widest uppercase">{job.company}</div>
                                    <ul className="space-y-2 sm:space-y-4">
                                        {job.responsibilities.map((resp, ridx) => (
                                            <li key={ridx} className="flex gap-2 sm:gap-4 text-sm sm:text-xl font-bold italic text-black dark:text-white/70">
                                                <Zap className="shrink-0 w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 fill-current" />
                                                <span>{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="neo-box bg-black text-white dark:bg-white dark:text-black px-4 sm:px-8 py-2 sm:py-4 font-black uppercase tracking-widest text-sm sm:text-xl self-start rotate-3">
                                    {job.dates}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PROJECTS --- */}
            <section id="projects" className="bg-black">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {projects.map((project, idx) => (
                        <motion.div key={idx} whileInView={{ opacity: 1 }} className="group relative h-[50vh] sm:h-[70vh] border-b-4 md:border-r-4 border-white overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-12 bg-black z-30 translate-y-0 sm:translate-y-full group-hover:translate-y-0 transition-transform duration-500 border-t-4 border-white">
                                <div className="flex justify-between items-start mb-3 sm:mb-6 text-white">
                                    <h3 className="text-xl sm:text-5xl font-black uppercase tracking-tighter italic">{project.name}</h3>
                                    <div className="neo-box bg-[hsl(var(--brand))] p-2 sm:p-4 rotate-12">
                                        <ArrowUpRight className="w-4 h-4 sm:w-8 sm:h-8 text-black" />
                                    </div>
                                </div>
                                <p className="text-sm sm:text-xl font-bold text-white/70 max-w-xl mb-4 sm:mb-8 leading-tight italic">{project.description}</p>
                                <div className="flex flex-wrap gap-2 sm:gap-4">
                                    {project.tags?.map(t => (
                                        <span key={t} className="neo-box bg-white text-black px-2 sm:px-4 py-0.5 sm:py-1 text-[10px] sm:text-xs font-black italic">{t}</span>
                                    ))}
                                </div>
                            </div>
                            {project.imageURL ? (
                                <img src={project.imageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={project.name} />
                            ) : (
                                <div className="w-full h-full bg-[#111] flex items-center justify-center text-[15vw] sm:text-[20vw] font-black text-white/5 uppercase italic">WORK_{idx + 1}</div>
                            )}
                            <div className="absolute top-4 left-4 sm:top-12 sm:left-12 z-20">
                                <span className="neo-box bg-white text-black px-3 sm:px-6 py-1 sm:py-2 font-black text-xs sm:text-xl italic rotate-[-5deg] group-hover:rotate-0 transition-transform">
                                    {project.category || 'PROJECT'} // 0{idx + 1}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- ACADEMIC & CERTS --- */}
            {((education && education.length > 0) || (certifications && certifications.length > 0)) && (
                <section className="py-16 sm:py-32 px-4 sm:px-8 bg-white dark:bg-[#050510] border-t-4 border-black dark:border-white">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-24">
                        {education && education.length > 0 && (
                            <div>
                                <h2 className="text-3xl sm:text-6xl font-black uppercase italic mb-8 sm:mb-16 tracking-tighter">Academic.</h2>
                                <div className="space-y-6 sm:space-y-12">
                                    {education.map((edu, i) => (
                                        <div key={i} className="neo-box p-4 sm:p-8 bg-white dark:bg-black rotate-[-1deg] hover:rotate-0 transition-all">
                                            <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                                                <GraduationCap className="w-6 h-6 sm:w-10 sm:h-10 text-[hsl(var(--brand))]" />
                                                <h4 className="text-lg sm:text-3xl font-black uppercase italic">{edu.degree}</h4>
                                            </div>
                                            <div className="text-sm sm:text-xl font-bold text-zinc-500 uppercase tracking-widest">{edu.institution}</div>
                                            <div className="mt-4 sm:mt-8 font-black text-zinc-400 font-mono tracking-widest uppercase text-xs sm:text-base">{edu.startDate} — {edu.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="space-y-12 sm:space-y-24">
                            {certifications && certifications.length > 0 && (
                                <div>
                                    <h2 className="text-3xl sm:text-6xl font-black uppercase italic mb-8 sm:mb-16 tracking-tighter">Accredited.</h2>
                                    <div className="flex flex-wrap gap-3 sm:gap-6">
                                        {certifications.map((cert, i) => (
                                            <div key={i} className="neo-box bg-purple-500 text-white px-4 sm:px-8 py-2 sm:py-4 font-black text-sm sm:text-xl italic hover:scale-110 transition-transform">
                                                {cert}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {languages && languages.length > 0 && (
                                <div>
                                    <h2 className="text-3xl sm:text-6xl font-black uppercase italic mb-8 sm:mb-16 tracking-tighter">Bilingual.</h2>
                                    <div className="grid gap-4 sm:gap-8">
                                        {languages.map((lang, i) => (
                                            <div key={i} className="flex items-end gap-3 sm:gap-6 border-b-4 sm:border-b-8 border-dotted border-black dark:border-white pb-2 sm:pb-4">
                                                <span className="text-2xl sm:text-5xl font-black italic">{lang.name}</span>
                                                <span className="text-sm sm:text-xl font-bold text-zinc-500 uppercase italic opacity-60">[{lang.level || 'Expert'}]</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* --- CONTACT --- */}
            <footer id="contact" className="bg-[hsl(var(--brand))] text-black py-40 px-8 text-center border-t-8 border-black">
                <motion.div initial={{ y: 100 }} whileInView={{ y: 0 }} className="max-w-4xl mx-auto">
                    <h2 className="text-5xl sm:text-8xl md:text-[12vw] font-black leading-[0.8] tracking-tighter uppercase italic mb-12 sm:mb-20">
                        LET'S <br />
                        <span className="text-white text-outline-black">CRACK</span> <br />
                        THIS.
                    </h2>
                    <div className="grid gap-8 sm:gap-12">
                        <a href={`mailto:${personalInfo.email}`} className="neo-box bg-black text-white py-6 sm:py-12 text-base sm:text-3xl md:text-6xl font-black tracking-tighter hover:bg-white hover:text-black transition-colors block uppercase break-all px-4">
                            {personalInfo.email}
                        </a>
                        <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
                            <motion.a whileHover={{ scale: 1.1, rotate: -5 }} href={personalInfo.linkedInURL} className="neo-box bg-[#0077b5] text-white px-6 sm:px-12 py-3 sm:py-6 text-lg sm:text-2xl font-black italic uppercase">LinkedIn</motion.a>
                            <motion.a whileHover={{ scale: 1.1, rotate: 5 }} href={personalInfo.githubURL} className="neo-box bg-black text-white px-6 sm:px-12 py-3 sm:py-6 text-lg sm:text-2xl font-black italic uppercase">GitHub</motion.a>
                        </div>
                    </div>
                    <div className="mt-40 text-sm font-black uppercase tracking-widest bg-black text-white inline-block px-8 py-2">
                        © {new Date().getFullYear()} {personalInfo.fullName} • DESIGNED FOR CHAOS
                    </div>
                </motion.div>
            </footer>
        </div>
    );
}
