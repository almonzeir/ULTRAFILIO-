/* CreativeTemplate.tsx - Neo-Brutalism / Bold / Loud */
import React from 'react';
import type { PortfolioData } from './types';
import { Ghost } from 'lucide-react';

export default function CreativeTemplate({ data }: { data: PortfolioData }) {
    const { personalInfo, about, experience, projects } = data;

    return (
        <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#0f0f0f] text-black dark:text-white font-mono selection:bg-black selection:text-[#f3f3f3] dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        :root {
          --border-thick: 3px solid currentColor;
          --shadow-hard: 6px 6px 0px 0px currentColor;
          --shadow-hard-hover: 2px 2px 0px 0px currentColor;
        }

        body { font-family: 'Space Grotesk', sans-serif; }

        .neo-box {
          border: var(--border-thick);
          box-shadow: var(--shadow-hard);
          transition: all 0.2s ease-in-out;
        }
        .neo-box:hover {
          transform: translate(4px, 4px);
          box-shadow: var(--shadow-hard-hover);
        }

        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .outline-text {
          -webkit-text-stroke: 1px currentColor;
          color: transparent;
        }
      `}</style>

            {/* --- SCROLLING MARQUEE HEADER --- */}
            <div className="bg-[hsl(var(--brand))] text-[hsl(var(--brand-contrast))] py-3 border-y-4 border-black dark:border-white overflow-hidden">
                <div className="marquee-container">
                    <div className="marquee text-xl font-bold uppercase tracking-wider">
                        AVAILABLE FOR FREELANCE  —  UI/UX DESIGN  —  FRONTEND DEV  —  CREATIVE DIRECTION  —  AVAILABLE FOR FREELANCE  —  UI/UX DESIGN  —  FRONTEND DEV  —  CREATIVE DIRECTION  —
                    </div>
                </div>
            </div>

            {/* --- HERO SPLIT --- */}
            <section className="min-h-screen grid md:grid-cols-2 relative">

                {/* Left: Content */}
                <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white bg-[#FFDEE9] dark:bg-[#1a1a1a] dark:text-[#FFDEE9]">
                    <div className="mb-8">
                        <div className="neo-box bg-white dark:bg-black text-black dark:text-white inline-block px-4 py-2 font-bold mb-4 transform -rotate-2">
                            HI! I'M A {personalInfo.title}
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                        I AM <br />
                        <span className="text-[hsl(var(--brand))]">{personalInfo.fullName.split(' ')[0]}</span><br />
                        {personalInfo.fullName.split(' ')[1]}
                    </h1>

                    <p className="text-xl md:text-2xl font-bold max-w-md mb-12 border-l-4 border-black dark:border-white pl-6">
                        {personalInfo.tagline}
                    </p>

                    <div className="flex gap-4">
                        <a href="#projects" className="neo-box bg-black text-white dark:bg-white dark:text-black px-8 py-4 font-bold text-xl">
                            SEE WORK
                        </a>
                        <a href="#contact" className="neo-box bg-white text-black px-8 py-4 font-bold text-xl">
                            CONTACT
                        </a>
                    </div>
                </div>

                {/* Right: Image / Visual */}
                <div className="relative h-[50vh] md:h-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[hsl(var(--brand-2))] flex items-center justify-center p-8 overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 rounded-full border-4 border-black"></div>
                    <div className="absolute bottom-20 left-10 w-0 h-0 border-l-[50px] border-l-transparent border-t-[75px] border-t-blue-500 border-r-[50px] border-r-transparent transform rotate-45"></div>

                    <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 neo-box bg-white rounded-full p-1 border-[4px] border-black dark:border-white overflow-hidden hover:rotate-6 transition-transform duration-500 group">
                        {personalInfo.profilePhotoURL ? (
                            <img src={personalInfo.profilePhotoURL} alt="Me" className="w-full h-full object-cover rounded-full filter contrast-125 saturate-150 scale-110 group-hover:scale-100 transition-transform" />
                        ) : (
                            <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white"><Ghost size={64} /></div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-white border-2 border-black px-4 py-1 font-black text-sm transform rotate-[-5deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            IT'S ME!
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BIG SCROLL TEXT (About) --- */}
            <section className="py-24 px-6 md:px-12 border-b-4 border-black dark:border-white bg-[#f0f0f0] dark:bg-[#121212]">
                <h2 className="text-4xl md:text-6xl font-bold leading-tight max-w-5xl mx-auto text-center">
                    "{about.extendedBio}"
                </h2>

                <div className="mt-20 flex flex-wrap justify-center gap-4">
                    {about.skills?.map((skill, i) => (
                        skill.tags?.map((tag, j) => (
                            <span key={`${i}-${j}`} className="neo-box px-6 py-3 bg-[hsl(var(--brand))] text-[hsl(var(--brand-contrast))] font-bold text-lg rounded-full">
                                {tag}
                            </span>
                        ))
                    ))}
                </div>
            </section>

            {/* --- WORK GRID --- */}
            <section id="projects" className="bg-white dark:bg-black">
                <div className="grid md:grid-cols-2">
                    {projects.map((project, idx) => (
                        <div key={idx} className="group relative border-b-4 border-black dark:border-white md:border-r-4 md:odd:border-r-4 md:even:border-r-0 h-[60vh] overflow-hidden">
                            <div className="absolute inset-0 bg-[hsl(var(--brand))] mix-blend-multiply opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-10 flex items-center justify-center">
                                <span className="neo-box bg-white text-black px-8 py-4 font-black text-2xl transform rotate-12 group-hover:rotate-0 transition-transform">
                                    VIEW PROJECT
                                </span>
                            </div>

                            {/* Background Image */}
                            {project.imageURL ? (
                                <img src={project.imageURL} alt={project.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-9xl opacity-20 font-black">
                                    {idx + 1}
                                </div>
                            )}

                            {/* Content Overlay - Always visible at bottom */}
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-white dark:bg-black border-t-4 border-black dark:border-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                                <h3 className="text-3xl font-black uppercase mb-2">{project.name}</h3>
                                <p className="font-mono text-sm line-clamp-2">{project.description}</p>
                                <div className="mt-4 flex gap-2">
                                    {project.tags?.slice(0, 3).map((tag, t) => (
                                        <span key={t} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-xs font-bold">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- EXPERIENCE --- */}
            <section className="py-24 px-6 md:px-12 bg-[#FFDEE9] dark:bg-[#1a1a1a] dark:text-[#FFDEE9] border-b-4 border-black dark:border-white">
                <h2 className="text-6xl md:text-9xl font-black mb-12 opacity-10 uppercase tracking-tighter">History</h2>
                <div className="max-w-4xl mx-auto space-y-12">
                    {experience.map((exp, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="md:w-1/3">
                                <div className="neo-box bg-black text-white dark:bg-white dark:text-black inline-block px-4 py-1 font-bold transform -rotate-1">
                                    {exp.dates}
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <h3 className="text-3xl font-black mb-2">{exp.jobTitle}</h3>
                                <h4 className="text-xl font-bold mb-4 border-b-4 border-black dark:border-white inline-block">{exp.company}</h4>
                                <p className="text-lg font-medium leading-relaxed">
                                    {exp.responsibilities[0]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer id="contact" className="bg-black text-white py-24 px-6 text-center border-t-8 border-[hsl(var(--brand))]">
                <h2 className="text-6xl md:text-8xl font-black mb-12 hover:text-outline-white transition-all cursor-default">
                    LET'S TALK
                </h2>

                <div className="max-w-2xl mx-auto grid gap-6">
                    <a href={`mailto:${personalInfo.email}`} className="neo-box bg-white text-black text-2xl md:text-4xl font-bold py-6 hover:bg-[hsl(var(--brand))] hover:text-white transform hover:scale-105">
                        {personalInfo.email}
                    </a>
                    <div className="flex gap-4 justify-center">
                        <a href={personalInfo.linkedInURL} className="neo-box bg-[#0077b5] text-white px-8 py-4 font-bold">LINKEDIN</a>
                        <a href={personalInfo.githubURL} className="neo-box bg-[#333] text-white px-8 py-4 font-bold">GITHUB</a>
                    </div>
                </div>

                <div className="mt-20 font-mono text-sm opacity-50">
                    © {new Date().getFullYear()} {personalInfo.fullName.toUpperCase()} - MADE WITH CHAOS AND CODE
                </div>
            </footer>
        </div>
    );
}
