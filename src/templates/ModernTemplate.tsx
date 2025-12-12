/* ModernTemplate.tsx - Stunning 'Glass & Glow' Redesign */
import React from "react";
import type { PortfolioData } from "./types";
import { MapPin, Mail, Building2, Zap, User } from 'lucide-react';

export default function ModernTemplate({ data }: { data: PortfolioData }) {
  // Helpers
  const { personalInfo, about, experience, projects } = data;

  return (
    <div className="font-sans antialiased text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 min-h-screen selection:bg-brand selection:text-white">
      {/* 
        Injecting dynamic theme styles. 
        Note: The parent page (Demo/Live) sets CSS variables like --brand. 
        We'll use Tailwind classes that map to these, or style={{}} for specifics.
      */}
      <style>{`
        :root {
          --glass-border: rgba(255, 255, 255, 0.1);
          --glass-bg: rgba(255, 255, 255, 0.05);
          --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
        .dark {
          --glass-border: rgba(255, 255, 255, 0.05);
          --glass-bg: rgba(0, 0, 0, 0.2);
        }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        
        /* Custom Utilities */
        .glass-panel {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }
        
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-image: linear-gradient(135deg, hsl(var(--brand)), hsl(var(--brand-2)));
        }
        
        .bg-gradient-brand {
          background-image: linear-gradient(135deg, hsl(var(--brand)), hsl(var(--brand-2)));
        }
        
        .blob {
          position: absolute;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.4;
          animation: blob-bounce 10s infinite ease-in-out;
        }
        @keyframes blob-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -5px rgba(0,0,0,0.1); 
          border-color: hsl(var(--brand) / 0.5);
        }
      `}</style>

      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="blob bg-[hsl(var(--brand))] w-96 h-96 rounded-full top-[-10%] left-[-10%] mix-blend-multiply dark:mix-blend-screen opacity-20 dark:opacity-10"></div>
        <div className="blob bg-[hsl(var(--brand-2))] w-96 h-96 rounded-full bottom-[-10%] right-[-10%] mix-blend-multiply dark:mix-blend-screen opacity-20 dark:opacity-10 animation-delay-2000"></div>
        <div className="blob bg-blue-400 w-80 h-80 rounded-full top-[40%] left-[30%] mix-blend-multiply dark:mix-blend-screen opacity-20 dark:opacity-5 animation-delay-4000"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
            <span className="text-gradient pl-1">{personalInfo.portfolioNameAbbr}</span>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {['About', 'Experience', 'Projects', 'Contact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[hsl(var(--brand))] dark:hover:text-[hsl(var(--brand))] transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="#contact"
              className="px-5 py-2 rounded-full bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--brand)/0.1)] border border-[hsl(var(--brand)/0.2)] text-[hsl(var(--brand))] text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--brand))] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--brand))]"></span>
              </span>
              Available for work
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Hello, I'm <br />
              <span className="text-gradient">{personalInfo.fullName}</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {personalInfo.tagline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#projects"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                View My Work
              </a>
              <a
                href={personalInfo.githubURL || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-slate-900 dark:text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <GitHubIcon className="w-5 h-5" />
                GitHub
              </a>
            </div>

            {/* Stats Row */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12">
              {about.stats?.slice(0, 3).map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image / Graphic */}
          <div className="relative w-full max-w-md lg:max-w-lg lg:flex-1 flex justify-center perspective-1000">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-brand rounded-[2rem] rotate-6 opacity-20 blur-2xl"></div>

            {/* Main Image Container - Stunning Circle */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 group">
              {/* Animated Glow Rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
              <div className="absolute -inset-1 rounded-full bg-gradient-brand opacity-50 group-hover:opacity-80 blur-sm transition-all duration-700 animate-spin-slow"></div>

              {/* Glass Container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] border-white/20 shadow-2xl glass-panel z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                {personalInfo.profilePhotoURL ? (
                  <img
                    src={personalInfo.profilePhotoURL}
                    alt={personalInfo.fullName}
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                    <User size={64} />
                  </div>
                )}
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-4 right-0 glass-panel px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-20 animate-bounce-slow">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-xs font-bold whitespace-nowrap">{personalInfo.title}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT & SKILLS --- */}
      <section id="about" className="relative z-10 py-20 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="About Me" subtitle="My creative journey and skillset" />

          <div className="grid md:grid-cols-2 gap-12 items-start mt-12">
            <div className="glass-panel p-8 rounded-3xl">
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {about.extendedBio}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {personalInfo.location && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[hsl(var(--brand))]" /> {personalInfo.location}
                  </span>
                )}
                {personalInfo.email && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">
                    <Mail className="w-3.5 h-3.5 text-[hsl(var(--brand))]" /> {personalInfo.email}
                  </span>
                )}
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.skills?.map((skillGroup, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-[hsl(var(--brand))]">{skillGroup.icon || <Zap className="w-5 h-5" />}</span>
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[hsl(var(--brand)/0.1)] text-[hsl(var(--brand))] border border-[hsl(var(--brand)/0.2)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE --- */}
      <section id="experience" className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Experience" subtitle="My professional career path" />

          <div className="mt-16 relative">
            {/* Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[hsl(var(--brand))] via-slate-300 dark:via-slate-700 to-transparent"></div>

            <div className="space-y-12">
              {experience.map((job, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[hsl(var(--brand))] ring-4 ring-white dark:ring-slate-950 -translate-x-1/2 mt-1.5 z-10"></div>

                  {/* Content half */}
                  <div className="md:w-1/2 md:px-12 pl-12">
                    <div className="glass-panel p-6 rounded-2xl card-hover relative group">
                      <div className="absolute top-6 right-6 text-slate-400 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Building2 size={24} />
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 mb-3">
                        {job.dates}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.jobTitle}</h3>
                      <div className="text-[hsl(var(--brand))] font-medium mb-4">{job.company}</div>
                      <ul className="space-y-2">
                        {job.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand)/0.5)] shrink-0"></span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Empty half */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS --- */}
      <section id="projects" className="relative z-10 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Work" subtitle="A selection of my best projects" />

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <a
                key={idx}
                href={project.detailsURL}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-3xl overflow-hidden glass-panel h-full flex flex-col card-hover"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  {project.imageURL ? (
                    <img
                      src={project.imageURL}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[hsl(var(--brand))/0.3] via-purple-500/20 to-[hsl(var(--brand-2))/0.3]">
                      {/* Abstract Pattern */}
                      <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover mix-blend-overlay"></div>
                      <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-xl">
                        <ArrowUpRight className="w-8 h-8 text-white/80" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium flex items-center gap-2">
                      View Project <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--brand))]">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[hsl(var(--brand))] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags?.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section id="contact" className="relative z-10 py-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[hsl(var(--brand))] rounded-full blur-[120px] opacity-20 -z-10"></div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
            Let's build something <br />
            <span className="text-gradient">extraordinary.</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            I'm currently opening my schedule for new projects.
            If you have an idea that needs a creative touch, get in touch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:${personalInfo.email}`}
              className="px-8 py-4 rounded-full bg-gradient-brand text-white font-bold text-lg hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-1 transition-all"
            >
              Say Hello
            </a>
            <a
              href={personalInfo.linkedInURL || '#'}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-full glass-panel font-bold text-lg hover:bg-white/10 transition-all"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-8 text-center text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">
        <p>© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Subcomponents
function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <div className="h-1 w-20 bg-gradient-brand mx-auto rounded-full mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400 text-lg">
        {subtitle}
      </p>
    </div>
  );
}

// Icons
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.05-.015-2.055-3.33.72-4.035-1.605-4.035-1.605-.54-1.38-1.335-1.755-1.335-1.755-1.087-.735.084-.72.084-.72 1.2.075 1.83 1.23 1.83 1.23 1.065 1.815 2.805 1.29 3.495.99.105-.78.42-1.29.765-1.59-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.545 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
