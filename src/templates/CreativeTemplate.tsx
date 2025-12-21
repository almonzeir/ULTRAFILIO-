/* CreativeTemplate.tsx - Stunning 'Neo-Brutalism' Framer Motion Redesign */
import React from 'react';
import type { PortfolioData } from './types';
import { Ghost, ArrowUpRight, Github, Linkedin, Mail, ExternalLink, Moon, Sun, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function CreativeTemplate({ data }: { data: PortfolioData }) {
    const { personalInfo, about, experience, projects } = data;
    const { scrollYProgress } = useScroll();
    const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#080808] text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
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
            <div className="bg-[hsl(var(--brand))] text-black py-4 border-b-4 border-black dark:border-white overflow-hidden relative z-50">
                <div className="whitespace-nowrap marquee-text">
                    <span className="text-2xl font-black uppercase tracking-tighter">
                        {Array(10).fill(`${personalInfo.fullName} • ${personalInfo.title} • AVAILABLE FOR WORK • `).join('')}
                    </span>
                </div>
            </div>

            {/* --- HERO --- */}
            <section className="min-h-[90vh] grid lg:grid-cols-2">
                {/* Left side: Bold Text */}
                <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 border-b-4 lg:border-b-0 lg:border-r-4 border-black dark:border-white bg-[#FFDEE9] dark:bg-[#111111] relative overflow-hidden">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 0 }}
                            className="neo-box bg-white dark:bg-black text-black dark:text-white inline-block px-6 py-2 font-black text-xl mb-12 rotate-[-2deg] cursor-pointer"
                        >
                            FRONT_END_ALCHEMIST // 01
                        </motion.div>

                        <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-12 uppercase italic">
                            DOING <br />
                            <span className="text-outline-black dark:text-outline-white text-transparent">COOL</span> <br />
                            <span className="text-[hsl(var(--brand))]">MAGIC.</span>
                        </h1>

                        <p className="text-xl md:text-3xl font-bold max-w-lg mb-12 border-l-8 border-black dark:border-white pl-8 leading-tight">
                            {personalInfo.tagline}
                        </p>

                        <div className="flex flex-wrap gap-6 mb-16">
                            <motion.a
                                whileHover={{ scale: 1.1, rotate: -2, x: 5, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                href="#projects"
                                className="neo-box bg-black text-white dark:bg-white dark:text-black px-12 py-6 font-black text-2xl transition-shadow hover:shadow-[12px_12px_0px_0px_currentColor]"
                            >
                                SHOW_ME
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, rotate: 2, x: -5, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                href="#contact"
                                className="neo-box bg-white text-black px-12 py-6 font-black text-2xl transition-shadow hover:shadow-[12px_12px_0px_0px_currentColor]"
                            >
                                HELLO?
                            </motion.a>
                        </div>


                    </motion.div>

                    {/* Background noise/shapes */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none select-none text-[20vw] font-black leading-none break-all overflow-hidden rotate-12">
                        {(personalInfo.fullName || 'NAME').repeat(20)}
                    </div>
                </div>

                {/* Right side: Abstract Visuals */}
                <div className="relative h-full bg-[hsl(var(--brand-2))] flex items-center justify-center p-12 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    {/* Chaotic Elements */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-10%] right-[-10%] w-96 h-96 border-[20px] border-white/20 rounded-full"
                    />
                    <motion.div
                        animate={{ x: [-30, 30, -30], y: [0, 20, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute bottom-[15%] left-[-5%] w-64 h-64 bg-yellow-400 border-4 border-black rotate-12"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-[10%] left-[10%] w-20 h-20 bg-[hsl(var(--brand))] border-4 border-black rounded-full"
                    />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 5 }}
                        whileHover={{ rotate: 0, scale: 1.05, translateZ: 50 }}
                        transition={{ duration: 1.2, type: "spring" }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="relative z-10 w-80 h-80 md:w-[450px] md:h-[450px] neo-box bg-white rounded-[4rem] p-2 border-[8px] border-black overflow-hidden group shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                    >
                        {personalInfo.profilePhotoURL ? (
                            <img src={personalInfo.profilePhotoURL} className="w-full h-full object-cover filter saturate-200 contrast-125 group-hover:scale-110 transition-transform duration-700" alt="ME" />
                        ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center text-white"><Ghost size={120} /></div>
                        )}
                        <div className="absolute inset-0 bg-[hsl(var(--brand))] mix-blend-overlay opacity-20 pointer-events-none" />

                        {/* Floating elements inside image container */}
                        <div className="absolute top-8 left-8 bg-white border-4 border-black px-4 py-1 font-black text-xs rotate-[-5deg] group-hover:bg-yellow-400 transition-colors">
                            VERIFIED_ID
                        </div>
                        <div className="absolute bottom-12 right-12 bg-black text-white border-2 border-white px-6 py-2 font-black text-xl rotate-[-10deg] shadow-[4px_4px_0px_0px_white] group-hover:rotate-0 transition-all">
                            VISUAL_MAXIMALIST
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- ABOUT MARQUEE --- */}
            <section className="py-32 px-8 flex flex-col items-center border-y-4 border-black dark:border-white bg-white dark:bg-black">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="max-w-6xl text-center"
                >
                    <h2 className="text-4xl md:text-7xl font-black uppercase italic leading-none mb-20 tracking-[ -0.05em]">
                        "{about.extendedBio}"
                    </h2>

                    <div className="flex flex-wrap justify-center gap-6">
                        {about.skills?.map(skill => skill.tags?.map(tag => (
                            <motion.div
                                key={tag}
                                whileHover={{ y: -10, rotate: Math.random() * 10 - 5 }}
                                className="neo-box px-8 py-4 bg-[hsl(var(--brand-2))] text-black font-black text-2xl uppercase italic"
                            >
                                {tag}
                            </motion.div>
                        )))}
                    </div>
                </motion.div>
            </section>

            {/* --- WORK GRID --- */}
            <section id="projects" className="bg-black">
                <div className="grid md:grid-cols-2">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="group relative h-[70vh] border-b-4 border-r-4 border-white overflow-hidden"
                        >
                            <div className="absolute inset-x-0 bottom-0 p-12 bg-black z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 border-t-4 border-white">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-5xl font-black uppercase tracking-tighter text-white italic">{project.name}</h3>
                                    <div className="neo-box bg-[hsl(var(--brand))] p-4 rotate-12">
                                        <ArrowUpRight className="w-8 h-8 text-black" />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-white/70 max-w-xl mb-8 leading-tight">{project.description}</p>
                                <div className="flex gap-4">
                                    {project.tags?.map(t => (
                                        <span key={t} className="neo-box bg-white text-black px-4 py-1 text-xs font-black italic">{t}</span>
                                    ))}
                                </div>
                            </div>

                            {project.imageURL ? (
                                <img src={project.imageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={project.name} />
                            ) : (
                                <div className="w-full h-full bg-[#111] flex items-center justify-center text-[20vw] font-black text-white/5 uppercase italic">WORK_{idx + 1}</div>
                            )}

                            <div className="absolute top-12 left-12 z-20">
                                <span className="neo-box bg-white text-black px-6 py-2 font-black text-xl italic rotate-[-5deg] group-hover:rotate-0 transition-transform">
                                    {project.category || 'PROJECT'} // 0{idx + 1}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- CONTACT --- */}
            <footer id="contact" className="bg-[hsl(var(--brand))] text-black py-40 px-8 text-center border-t-8 border-black">
                <motion.div
                    initial={{ y: 100 }}
                    whileInView={{ y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-8xl md:text-[12vw] font-black leading-[0.8] tracking-tighter uppercase italic mb-20">
                        LET'S <br />
                        <span className="text-white text-outline-black">CRACK</span> <br />
                        THIS.
                    </h2>

                    <div className="grid gap-12">
                        <a href={`mailto:${personalInfo.email}`} className="neo-box bg-black text-white py-12 text-3xl md:text-6xl font-black tracking-tighter hover:bg-white hover:text-black transition-colors block">
                            {personalInfo.email}
                        </a>
                        <div className="flex flex-wrap gap-8 justify-center">
                            <motion.a whileHover={{ scale: 1.1, rotate: -5 }} href={personalInfo.linkedInURL} className="neo-box bg-[#0077b5] text-white px-12 py-6 text-2xl font-black italic">LINKED_IN</motion.a>
                            <motion.a whileHover={{ scale: 1.1, rotate: 5 }} href={personalInfo.githubURL} className="neo-box bg-black text-white px-12 py-6 text-2xl font-black italic">GIT_HUB</motion.a>
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
