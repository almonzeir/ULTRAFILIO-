/* MinimalistTemplate.tsx - Modern Swiss / Architectural Typography Aesthetic */
import React from 'react';
import type { PortfolioData } from './types';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Globe, MapPin, ArrowUpRight, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const container = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function MinimalistTemplate({ data, isDarkMode }: { data: PortfolioData; isDarkMode?: boolean }) {
  const { personalInfo, about, experience, projects, education, certifications, languages } = data;

  return (
    <div className={cn(
      "min-h-screen text-[14px] leading-relaxed selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-700 font-sans",
      isDarkMode ? "bg-[#0a0a0a] text-[#f0f0f0]" : "bg-[#f5f5f5] text-[#1a1a1a]"
    )}>
      {/* --- ARCHITECTURAL GRID OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* --- NOISE TEXTURE --- */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto border-x border-black/5 dark:border-white/5 bg-white/30 dark:bg-black/20 backdrop-blur-[1px]">

        {/* --- HEADER / NAVIGATION BAR --- */}
        <header className="sticky top-0 z-[100] border-b border-black/10 dark:border-white/10 flex justify-center items-center px-4 sm:px-8 md:px-12 py-3 sm:py-4 bg-inherit backdrop-blur-md">
          <nav className="flex gap-6 sm:gap-10 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
            <a href="#about" className="hover:opacity-50 transition-opacity">Index</a>
            <a href="#projects" className="hover:opacity-50 transition-opacity">Archive</a>
            <a href="#experience" className="hover:opacity-50 transition-opacity">History</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
          </nav>
        </header>

        {/* --- HERO / IDENTITY --- */}
        <section id="about" className="pt-32 pb-20 px-8 md:px-12 border-b border-black/10 dark:border-white/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24"
          >
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl sm:text-[14vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase mb-8 sm:mb-12 font-tight break-words">
                {personalInfo.fullName.split(' ').map((name, i) => (
                  <span key={i} className="block">{name}</span>
                ))}
              </h1>
              <div className="flex flex-wrap gap-8 items-center text-xs font-black uppercase tracking-[0.3em]">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[hsl(var(--brand))] rounded-full animate-pulse" />
                  <span>{personalInfo.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={14} className="opacity-40" />
                  <span>{personalInfo.location || "Earth_Core"}</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[450px] space-y-8 sm:space-y-12">
              <div className="text-lg sm:text-xl md:text-3xl font-medium leading-[1.1] tracking-tight text-justify indent-8 sm:indent-12 md:indent-20 break-words">
                {about.extendedBio}
              </div>

              {/* SOCIAL / CONTACT LINKS */}
              <div className="grid grid-cols-2 gap-4">
                <a href={`mailto:${personalInfo.email}`} className="group flex items-center justify-between p-5 border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <Mail size={16} className="opacity-40" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href={personalInfo.linkedInURL} className="group flex items-center justify-between p-5 border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <Linkedin size={16} className="opacity-40" />
                  <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- SKILLS GRID --- */}
        <section className="border-b border-black/10 dark:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y divide-x divide-black/10 dark:divide-white/10 border-r border-black/10 dark:border-white/10">
            {about.skills?.map((cat, i) => (
              <div key={i} className="p-10 space-y-8 group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="text-[10px] font-black text-[hsl(var(--brand))] uppercase tracking-[0.4em]">Index_0{i + 1} // {cat.category}</div>
                <div className="flex flex-col gap-4">
                  {cat.tags.map((tag, j) => (
                    <div key={j} className="flex items-center justify-between text-lg font-bold tracking-tight uppercase group-hover:px-2 transition-all">
                      <span>{tag}</span>
                      <Plus size={12} className="opacity-20" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PROJECTS --- */}
        <section id="projects">
          <div className="px-4 sm:px-8 md:px-12 py-6 sm:py-10 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.5em]">Selected_Works</h2>
            <div className="text-[8px] sm:text-[10px] font-bold opacity-30 flex gap-2 sm:gap-4 uppercase italic">
              <span>Archive</span>
              <span className="animate-pulse">Active</span>
            </div>
          </div>

          <div className="divide-y divide-black/10 dark:divide-white/10">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-100px" }}
                className="group grid lg:grid-cols-[1.2fr_1fr] min-h-[500px]"
              >
                <div className="p-4 sm:p-8 md:p-12 lg:p-20 flex flex-col justify-between items-start gap-8 sm:gap-12 border-r border-black/10 dark:border-white/10">
                  <div className="space-y-4 sm:space-y-6 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-black text-[hsl(var(--brand))] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                      <span>Ref_{i + 1}</span>
                      <div className="w-4 sm:w-8 h-[1px] bg-current opacity-30" />
                      <span className="break-words">{project.category}</span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter break-words hyphens-auto">
                      {project.name}
                    </h3>
                  </div>

                  <div className="space-y-6 sm:space-y-10 max-w-xl w-full">
                    <p className="text-base sm:text-xl md:text-2xl font-medium tracking-tight opacity-70 italic leading-relaxed break-words">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 sm:px-3 py-1 sm:py-1.5 border border-black/10 dark:border-white/10 text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-white/40 dark:bg-black/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={project.detailsURL} target="_blank" className="inline-flex items-center gap-2 sm:gap-4 py-3 sm:py-4 px-6 sm:px-10 bg-black dark:bg-white text-white dark:text-black text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:scale-105 transition-transform origin-left">
                      View <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-white/10 aspect-[4/3] lg:aspect-auto">
                  {project.imageURL ? (
                    <img
                      src={project.imageURL}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[0.16,1,0.3,1]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl sm:text-6xl md:text-8xl font-black opacity-5 uppercase tracking-tighter">Mock_{i + 1}</div>
                  )}
                  {/* GRID LINES ON IMAGE */}
                  <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 grid grid-cols-3 grid-rows-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- EXPERIENCE --- */}
        <section id="experience" className="border-t border-black/10 dark:border-white/10">
          <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[350px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-black/10 dark:divide-white/10">
            <div className="p-6 sm:p-10 md:p-16 space-y-6 sm:space-y-10 bg-black dark:bg-white text-white dark:text-black">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tighter">
                Prof<br />Log
              </h2>
              <p className="text-[10px] sm:text-xs font-bold opacity-60 leading-relaxed uppercase tracking-wider">
                A chronicle of technical progression and professional evolution.
              </p>
            </div>

            <div className="divide-y divide-black/10 dark:divide-white/10">
              {experience.map((exp, i) => (
                <div key={i} className="p-6 sm:p-12 md:p-16 hover:bg-black/5 dark:hover:bg-white/5 transition-colors grid md:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr] gap-4 sm:gap-8">
                  <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-40">
                    {exp.dates}
                  </div>
                  <div className="space-y-4 sm:space-y-6 min-w-0">
                    <div>
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-2 leading-none break-words">
                        {exp.jobTitle}
                      </h4>
                      <div className="text-[11px] sm:text-[12px] font-black text-[hsl(var(--brand))] uppercase tracking-[0.1em] sm:tracking-[0.2em] break-words">
                        @ {exp.company}
                      </div>
                    </div>
                    <ul className="space-y-2 sm:space-y-3 max-w-2xl">
                      {exp.responsibilities.map((res, idx) => (
                        <li key={idx} className="text-sm sm:text-lg font-medium opacity-60 flex gap-2 sm:gap-4 leading-snug">
                          <span className="text-[hsl(var(--brand))] flex-shrink-0">/</span>
                          <span className="break-words">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ACADEMIC & TOOLS --- */}
        <section className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-black/10 dark:divide-white/10 border-t border-b border-black/10 dark:border-white/10">
          <div className="p-6 sm:p-12 md:p-20 space-y-8 sm:space-y-16">
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-40">Academic_Log</div>
            <div className="space-y-8 sm:space-y-16">
              {education?.map((edu, i) => (
                <div key={i} className="space-y-2 sm:space-y-4">
                  <div className="text-[9px] sm:text-[10px] font-black opacity-30">{edu.startDate} - {edu.endDate}</div>
                  <h3 className="text-base sm:text-xl md:text-3xl font-black uppercase tracking-tighter italic break-words hyphens-auto leading-tight">{edu.degree}</h3>
                  <div className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider sm:tracking-widest break-words">/ {edu.institution}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-12 md:p-20 space-y-8 sm:space-y-16 bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-40">Credentials</div>
            <div className="grid gap-8 sm:gap-12">
              {certifications && (
                <div className="space-y-4 sm:space-y-6">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase opacity-30 tracking-[0.2em] sm:tracking-[0.3em]">Certificates</span>
                  <div className="space-y-2 sm:space-y-3">
                    {certifications.map((cert, j) => (
                      <div key={j} className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-tight border-l-2 border-[hsl(var(--brand))] pl-3 sm:pl-4 break-words hyphens-auto leading-relaxed">
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {languages && (
                <div className="space-y-4 sm:space-y-6">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase opacity-30 tracking-[0.2em] sm:tracking-[0.3em]">Languages</span>
                  <div className="space-y-4 sm:space-y-6">
                    {languages.map((lang, k) => (
                      <div key={k}>
                        <div className="text-base sm:text-xl font-black uppercase italic break-words">{lang.name}</div>
                        <div className="text-[9px] sm:text-[10px] font-bold opacity-30 uppercase tracking-[0.1em] sm:tracking-[0.2em]">{lang.level}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- TERMINAL CTA --- */}
        <footer id="contact" className="p-8 sm:p-12 md:p-32 text-center bg-black dark:bg-white text-white dark:text-black overflow-hidden relative">
          {/* BACKGROUND DECOR */}
          <div className="absolute top-0 right-10 text-[20vw] font-black opacity-[0.03] select-none pointer-events-none uppercase italic leading-none">
            END
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-12">
            <h2 className="text-3xl sm:text-7xl md:text-[10vw] font-black uppercase leading-[0.85] tracking-tighter break-words">
              Let&apos;s_Build<br />The_Void
            </h2>

            <a href={`mailto:${personalInfo.email}`} className="text-sm sm:text-xl md:text-3xl font-black hover:text-[hsl(var(--brand))] transition-colors border-b-2 sm:border-b-4 border-current pb-2 sm:pb-4 px-4 sm:px-12 uppercase italic max-w-full truncate">
              {personalInfo.email}
            </a>

            <div className="flex flex-wrap justify-center gap-8 mt-12 opacity-40 text-[10px] font-black uppercase tracking-[0.5em]">
              <a href={personalInfo.githubURL} className="hover:opacity-100 transition-opacity">GitHub</a>
              <a href={personalInfo.linkedInURL} className="hover:opacity-100 transition-opacity">LinkedIn</a>
              <a href={personalInfo.website} className="hover:opacity-100 transition-opacity">Registry</a>
            </div>

            <div className="mt-20 text-[9px] font-bold opacity-30 uppercase tracking-[0.8em]">
              © {new Date().getFullYear()} {personalInfo.fullName.replace(' ', '_')} // System_Secure
            </div>
          </div>
        </footer>

      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');
        
        .font-tight {
          font-family: 'Inter Tight', sans-serif;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
