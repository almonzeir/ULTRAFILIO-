/* MinimalPlusTemplate.tsx - Swiss Design / Apple Style / Ultra Clean */
import React from 'react';
import type { PortfolioData } from './types';
import { User } from 'lucide-react';

export default function MinimalPlusTemplate({ data }: { data: PortfolioData }) {
    const { personalInfo, about, experience, projects } = data;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        
        :root {
          --ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        
        body { font-family: 'DM Sans', sans-serif; }

        .reveal-up {
          animation: revealUp 0.8s var(--ease-out) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        @keyframes revealUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .hover-lift {
          transition: transform 0.3s var(--ease-out);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }
      `}</style>

            {/* --- NAVIGATION --- */}
            <nav className="fixed top-0 w-full z-50 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
                <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-xl font-bold tracking-tight">{personalInfo.portfolioNameAbbr}.</div>
                    <div className="flex gap-8 text-sm font-medium text-neutral-500">
                        <a href="#about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">About</a>
                        <a href="#work" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Work</a>
                        <a href="#contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto">

                {/* --- HERO --- */}
                <section className="min-h-[70vh] flex flex-col justify-center">
                    <div className="reveal-up">
                        <span className="inline-flex items-center px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs font-medium mb-6 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Available for new projects
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 max-w-4xl">
                            {personalInfo.fullName.split(' ')[0]} is a <span className="text-neutral-400">{personalInfo.title}</span> based in {personalInfo.location || 'Cyber Space'}.
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl leading-relaxed mb-10">
                            {personalInfo.tagline}
                        </p>
                    </div>

                    <div className="reveal-up delay-200 mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pb-20 border-b border-neutral-200 dark:border-neutral-800">
                        {/* Visual Stats Block */}
                        <div className="bg-[hsl(var(--brand))] text-white p-6 rounded-2xl md:col-span-2 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="text-sm opacity-80 mb-12">FEATURED SKILL</div>
                                <div className="text-3xl font-bold">{about.skills?.[0]?.category || "Design"}</div>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/3 translate-y-1/3 group-hover:scale-110 transition-transform duration-500">
                                <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5 9.5 9.75 12 11zm0 2.5l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z" /></svg>
                            </div>
                        </div>

                        {/* Photo Block - Clean Circle */}
                        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden aspect-square justify-self-center w-full max-w-[300px] relative group shadow-sm hover:shadow-2xl transition-all duration-700 hover:scale-[1.02]">
                            {personalInfo.profilePhotoURL ? (
                                <img src={personalInfo.profilePhotoURL} alt="Me" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><User size={64} className="text-neutral-300" /></div>
                            )}
                        </div>

                        <a href="#contact" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl flex items-center justify-center font-bold text-lg hover:opacity-90 transition-opacity">
                            Get in Touch ↗
                        </a>
                    </div>
                </section>

                {/* --- WORK --- */}
                <section id="work" className="py-32">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
                        <h2 className="text-4xl font-bold tracking-tight">Selected Work</h2>
                        <span className="text-neutral-400 text-sm mt-4 md:mt-0 font-medium">Wait until you see this</span>
                    </div>

                    <div className="space-y-32">
                        {projects.map((project, i) => (
                            <article key={i} className="group grid md:grid-cols-2 gap-12 items-center">
                                <div className={`overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800 aspect-[4/3] ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                                    {project.imageURL ? (
                                        <img src={project.imageURL} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300">Image Placeholder</div>
                                    )}
                                </div>
                                <div className={`${i % 2 === 1 ? 'md:order-1 md:text-right' : ''}`}>
                                    <div className="text-sm font-bold text-[hsl(var(--brand))] mb-4 uppercase tracking-wider">{project.category}</div>
                                    <h3 className="text-3xl md:text-4xl font-bold mb-6 group-hover:text-[hsl(var(--brand))] transition-colors">{project.name}</h3>
                                    <p className="text-lg text-neutral-500 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
                                        {project.description}
                                    </p>
                                    <div className={`flex flex-wrap gap-2 mb-8 ${i % 2 === 1 ? 'md:justify-end' : ''}`}>
                                        {project.tags?.map((t, idx) => (
                                            <span key={idx} className="px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-sm font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <a href={project.detailsURL} className="inline-flex items-center text-lg font-bold hover:gap-2 transition-all">
                                        View Case Study <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* --- EXPERIENCE & BIO SPLIT --- */}
                <section id="about" className="py-20 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="grid md:grid-cols-[1fr_2fr] gap-16">
                        <div>
                            <h2 className="text-2xl font-bold mb-8">About Me</h2>
                            <p className="text-neutral-500 leading-relaxed mb-6">
                                {about.extendedBio}
                            </p>
                            <div className="flex gap-4">
                                <a href={personalInfo.linkedInURL} className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-[hsl(var(--brand))] hover:text-white transition-colors">in</a>
                                <a href={personalInfo.githubURL} className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-[hsl(var(--brand))] hover:text-white transition-colors">gh</a>
                                <a href={`mailto:${personalInfo.email}`} className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-[hsl(var(--brand))] hover:text-white transition-colors">@</a>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-12">Experience</h2>
                            <div className="space-y-12">
                                {experience.map((exp, i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-bold">{exp.jobTitle}</h3>
                                            <span className="text-sm text-neutral-400 font-medium">{exp.dates}</span>
                                        </div>
                                        <div className="text-lg text-[hsl(var(--brand))] mb-4">{exp.company}</div>
                                        <p className="text-neutral-500 leading-relaxed mb-4">
                                            {exp.responsibilities[0]}
                                        </p>
                                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 w-full group-hover:bg-[hsl(var(--brand))] transition-colors"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer id="contact" className="py-32 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Let's work together.</h2>
                    <a href={`mailto:${personalInfo.email}`} className="text-xl md:text-2xl text-[hsl(var(--brand))] hover:underline decoration-2 underline-offset-4">
                        {personalInfo.email}
                    </a>
                    <div className="mt-20 text-sm text-neutral-400 font-medium">
                        © {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.
                    </div>
                </footer>
            </main>
        </div>
    );
}
