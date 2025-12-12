/* ExecutiveTemplate.tsx - High-End / Corporate / Authoritative */
import React from 'react';
import type { PortfolioData } from './types';
import { Mail, Phone, MapPin, Scale } from 'lucide-react';

export default function ExecutiveTemplate({ data }: { data: PortfolioData }) {
    const { personalInfo, about, experience, projects } = data;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-slate-800 selection:text-white dark:selection:bg-slate-200 dark:selection:text-slate-900">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        :root {
          --font-heading: 'Playfair Display', serif;
          --font-body: 'Inter', sans-serif;
        }

        .font-heading { font-family: var(--font-heading); }
        .font-body { font-family: var(--font-body); }

        .executive-border {
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .dark .executive-border {
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .gold-accent {
          background: linear-gradient(135deg, hsl(var(--brand)), hsl(var(--brand-2)));
        }
      `}</style>

            {/* --- SIDEBAR NAV (Desktop) --- */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-20 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-50 items-center py-10">
                <div className="text-2xl font-black font-heading tracking-widest text-[hsl(var(--brand))] rotate-180" style={{ writingMode: 'vertical-rl' }}>
                    {personalInfo.portfolioNameAbbr}
                </div>

                <div className="flex-1 flex flex-col justify-center gap-12">
                    {['Home', 'Bio', 'Work', 'Contact'].map((item, i) => (
                        <a
                            key={i}
                            href={`#${item.toLowerCase()}`}
                            className="text-xs uppercase tracking-widest font-semibold text-slate-400 hover:text-[hsl(var(--brand))] transition-colors rotate-180"
                            style={{ writingMode: 'vertical-rl' }}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="w-1 h-20 gold-accent rounded-full"></div>
            </aside>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <main className="lg:pl-20 w-full">

                {/* --- HEADER (Mobile/Tablet) --- */}
                <header className="lg:hidden flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-heading font-bold text-xl">{personalInfo.portfolioNameAbbr}</div>
                    <nav className="flex gap-4 text-sm font-medium">
                        <a href="#work">Work</a>
                        <a href="#contact" className="text-[hsl(var(--brand))]">Contact</a>
                    </nav>
                </header>

                {/* --- HERO SECTION --- */}
                <section id="home" className="min-h-[90vh] flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
                    {/* Background Texture (Subtle Grid) */}
                    <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
                        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>

                    <div className="relative z-10 max-w-6xl w-full mx-auto grid lg:grid-cols-[1.5fr_1fr] gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-block px-3 py-1 border border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-slate-500">
                                {personalInfo.title}
                            </div>
                            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 text-slate-900 dark:text-white">
                                {personalInfo.fullName}
                            </h1>
                            <p className="font-body text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mb-10 border-l-4 border-[hsl(var(--brand))] pl-6">
                                {personalInfo.tagline}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm font-medium tracking-wide">
                                <a href="#contact" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-transform hover:-translate-y-1 shadow-2xl">
                                    INITIATE CONTACT
                                </a>
                                <a href="#work" className="px-8 py-4 border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                    VIEW PORTFOLIO
                                </a>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto lg:mx-0">
                                {/* Executive Elements */}
                                <div className="absolute inset-0 rounded-full border border-[hsl(var(--brand))] rotate-12 scale-105 opacity-20"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-[hsl(var(--brand))] translate-x-3 translate-y-3 opacity-30"></div>

                                {/* Main Image */}
                                <div className="absolute inset-0 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl">
                                    {personalInfo.profilePhotoURL ? (
                                        <img src={personalInfo.profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300"><Scale size={64} /></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SUMMARY / ABOUT --- */}
                <section id="bio" className="py-24 px-6 sm:px-12 lg:px-24 bg-white dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="font-heading text-4xl font-bold mb-12 relative inline-block">
                            Executive Summary
                            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[hsl(var(--brand))]"></span>
                        </h2>
                        <p className="font-body text-lg md:text-xl leading-8 text-slate-600 dark:text-slate-300">
                            {about.extendedBio}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 border-t border-b border-slate-100 dark:border-slate-900 py-12">
                            {about.stats?.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="font-heading text-4xl font-bold text-[hsl(var(--brand))] mb-2">{stat.value}</div>
                                    <div className="text-xs uppercase tracking-widest text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- EXPERIENCE (The Resumé) --- */}
                <section id="work" className="py-24 px-6 sm:px-12 lg:px-24 bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 executive-border pb-6">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--brand))] mb-2">Career History</div>
                                <h2 className="font-heading text-4xl font-bold">Professional Experience</h2>
                            </div>
                            <a href={personalInfo.linkedInURL || "#"} className="hidden md:block text-sm border-b border-slate-800 dark:border-slate-200 pb-1 hover:text-[hsl(var(--brand))] hover:border-[hsl(var(--brand))] transition-colors">
                                View Full History on LinkedIn
                            </a>
                        </div>

                        <div className="space-y-12">
                            {experience.map((job, idx) => (
                                <div key={idx} className="grid md:grid-cols-[1fr_3fr] gap-8 group">
                                    <div className="md:text-right">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{job.dates}</div>
                                        <div className="text-xs text-slate-500 mt-1">{job.location}</div>
                                    </div>
                                    <div className="relative pl-8 md:border-l border-slate-200 dark:border-slate-800">
                                        <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] bg-[hsl(var(--brand))] rounded-full hidden md:block group-hover:scale-125 transition-transform"></div>
                                        <h3 className="text-2xl font-heading font-bold mb-1">{job.jobTitle}</h3>
                                        <div className="text-[hsl(var(--brand))] font-medium mb-4">{job.company}</div>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                            {job.responsibilities[0]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- PROJECTS --- */}
                <section className="py-24 px-6 sm:px-12 lg:px-24 bg-white dark:bg-slate-950">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="font-heading text-4xl font-bold mb-4">Selected Engagements</h2>
                            <p className="text-slate-500 font-body">Highlighting key strategic initiatives and deliverables</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {projects.map((project, i) => (
                                <article key={i} className="group cursor-pointer">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900 mb-6">
                                        {project.imageURL ? (
                                            <img src={project.imageURL} alt={project.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 font-heading text-6xl opacity-20">
                                                {i + 1}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-[hsl(var(--brand))] mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-t border-slate-200 dark:border-slate-800 pt-4">
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--brand))] mb-2">{project.category}</div>
                                            <h3 className="font-heading text-xl font-bold group-hover:text-[hsl(var(--brand))] transition-colors">{project.name}</h3>
                                        </div>
                                        <a href={project.detailsURL} className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                            ↗
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- CONTACT FOOTER --- */}
                <footer id="contact" className="bg-slate-900 text-white py-24 px-6 text-center lg:text-left">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-heading text-5xl lg:text-6xl font-bold mb-8">Let's Discuss Future Opportunities.</h2>
                            <div className="space-y-4 font-body text-lg text-slate-400">
                                <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
                                    <span className="flex items-center gap-2"><Mail size={18} /> {personalInfo.email}</span>
                                    <span className="flex items-center gap-2"><Phone size={18} /> {personalInfo.phone}</span>
                                </div>
                                <div className="flex items-center gap-2"><MapPin size={18} /> {personalInfo.location || "Remote / Worldwide"}</div>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <form className="bg-white/5 p-8 w-full max-w-md border border-white/10 backdrop-blur-sm">
                                <h3 className="font-heading text-2xl mb-6">Direct Inquiries</h3>
                                <div className="space-y-4">
                                    <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-slate-600 py-3 focus:border-white outline-none transition-colors" />
                                    <textarea rows={3} placeholder="Message context" className="w-full bg-transparent border-b border-slate-600 py-3 focus:border-white outline-none transition-colors" />
                                    <button className="w-full py-4 bg-white text-slate-900 font-bold tracking-widest uppercase hover:bg-[hsl(var(--brand))] hover:text-white transition-colors">
                                        Send Brief
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-slate-800 text-slate-600 text-sm flex justify-between">
                        <div>© {new Date().getFullYear()} {personalInfo.fullName}</div>
                        <div>EXECUTIVE PORTFOLIO</div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
