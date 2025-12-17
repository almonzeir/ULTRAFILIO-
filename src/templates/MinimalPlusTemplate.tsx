/* MinimalPlusTemplate.tsx - Swiss Design / Apple Style / Ultra Clean */
import React from 'react';
import type { PortfolioData } from './types';
import { User } from 'lucide-react';

const DEFAULT_ORDER = ['hero', 'about', 'projects', 'experience', 'contact'];

export default function MinimalPlusTemplate({ data }: { data: PortfolioData }) {
    const { personalInfo, about, experience, projects, sectionOrder = DEFAULT_ORDER } = data;

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

                {/* Dynamic Section Rendering */}
                {sectionOrder.map((sectionId) => {
                    switch (sectionId) {
                        case 'hero':
                            return (
                                <section key="hero" className="min-h-[70vh] flex flex-col justify-center max-w-4xl mx-auto">
                                    <div className="reveal-up">
                                        <span className="inline-flex items-center px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs font-medium mb-8">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Available for new projects
                                        </span>
                                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
                                            {personalInfo.fullName.split(' ')[0]} is a <span className="text-neutral-400">{personalInfo.title}</span> based in {personalInfo.location || 'Cyber Space'}.
                                        </h1>
                                        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl leading-relaxed mb-10">
                                            {personalInfo.tagline}
                                        </p>
                                    </div>

                                    <div className="reveal-up delay-200 mt-12 flex flex-col md:flex-row gap-8 pb-20 border-b border-neutral-200 dark:border-neutral-800 items-start">
                                        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden w-32 h-32 md:w-40 md:h-40 relative group shrink-0">
                                            {personalInfo.profilePhotoURL ? (
                                                <img src={personalInfo.profilePhotoURL} alt="Me" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><User size={40} className="text-neutral-300" /></div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-6">
                                            <div className="flex gap-4">
                                                <a href="#contact" className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                                                    Get in Touch
                                                </a>
                                                <a href="#work" className="px-6 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg font-bold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                                    View Work
                                                </a>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {about.skills?.slice(0, 5).flatMap(cat => cat.tags).map((tag, i) => (
                                                    <span key={i} className="text-sm text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );

                        case 'about':
                            return (
                                <section key="about" id="about" className="py-20 max-w-3xl mx-auto">
                                    <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-8">About</h2>
                                    <div className="text-xl md:text-2xl leading-relaxed text-neutral-800 dark:text-neutral-200">
                                        {about.extendedBio}
                                    </div>
                                </section>
                            );

                        case 'projects':
                            return (
                                <section key="projects" id="work" className="py-20 max-w-5xl mx-auto">
                                    <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-12">Selected Work</h2>
                                    <div className="space-y-24">
                                        {projects.map((project, i) => (
                                            <article key={i} className="group cursor-pointer">
                                                <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 md:gap-16 items-start">
                                                    <div className="overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-xl aspect-[16/10]">
                                                        {project.imageURL ? (
                                                            <img src={project.imageURL} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-neutral-300">Image Placeholder</div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col h-full justify-center">
                                                        <div className="text-sm font-medium text-[hsl(var(--brand))] mb-2">{project.category}</div>
                                                        <h3 className="text-3xl font-bold mb-4 group-hover:text-[hsl(var(--brand))] transition-colors">{project.name}</h3>
                                                        <p className="text-neutral-500 mb-6 leading-relaxed">{project.description}</p>
                                                        <div className="flex flex-wrap gap-2 mb-8">
                                                            {project.tags?.map((t, idx) => (
                                                                <span key={idx} className="text-xs font-medium text-neutral-400">#{t}</span>
                                                            ))}
                                                        </div>
                                                        <a href={project.detailsURL} className="text-sm font-bold underline decoration-2 decoration-neutral-200 dark:decoration-neutral-800 underline-offset-4 hover:decoration-[hsl(var(--brand))] transition-all">
                                                            View Project
                                                        </a>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            );

                        case 'experience':
                            return (
                                <section key="experience" className="py-20 max-w-3xl mx-auto border-t border-neutral-200 dark:border-neutral-800">
                                    <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-12">Experience</h2>
                                    <div className="space-y-12">
                                        {experience.map((exp, i) => (
                                            <div key={i} className="group grid grid-cols-[1fr_3fr] gap-8">
                                                <span className="text-sm text-neutral-400 font-medium pt-1">{exp.dates}</span>
                                                <div>
                                                    <h3 className="text-xl font-bold mb-1">{exp.jobTitle}</h3>
                                                    <div className="text-base text-neutral-500 mb-4">{exp.company}</div>
                                                    <p className="text-neutral-500 leading-relaxed text-sm">{exp.responsibilities[0]}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );

                        case 'contact':
                            return (
                                <footer key="contact" id="contact" className="py-32 text-center max-w-2xl mx-auto">
                                    <h2 className="text-5xl font-bold tracking-tight mb-8">Let's work together.</h2>
                                    <a href={`mailto:${personalInfo.email}`} className="text-xl text-[hsl(var(--brand))] hover:underline decoration-2 underline-offset-4">
                                        {personalInfo.email}
                                    </a>
                                    <div className="flex justify-center gap-6 mt-12">
                                        <a href={personalInfo.linkedInURL} className="text-sm font-bold hover:text-[hsl(var(--brand))] transition-colors">LinkedIn</a>
                                        <a href={personalInfo.githubURL} className="text-sm font-bold hover:text-[hsl(var(--brand))] transition-colors">GitHub</a>
                                    </div>
                                    <div className="mt-20 text-sm text-neutral-400 font-medium">
                                        © {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.
                                    </div>
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
