/* BasicTemplate.tsx - Modern Editorial / Premium Print / Resume Style */
import React from 'react';
import type { PortfolioData } from './types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BasicTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, about, experience, projects, education = [] } = data;

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-20 px-4 sm:px-8 print:p-0 print:bg-white text-[#1a1a1a] font-serif leading-relaxed selection:bg-[#1a1a1a] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          --font-header: 'Playfair Display', serif;
          --font-body: 'Libre Baskerville', serif;
          --font-sans: 'Inter', sans-serif;
        }

        body { font-family: var(--font-body); }
        h1, h2, h3, h4, .sans { font-family: var(--font-header); }
        .inter { font-family: var(--font-sans); }
        
        @media print {
            body { -webkit-print-color-adjust: exact; background: white !important; }
            .no-print { display: none !important; }
            .print-no-shadow { box-shadow: none !important; }
            .print-no-border { border: none !important; }
            .page-break { page-break-before: always; }
        }

        .resume-shadow {
            box-shadow: 0 10px 50px -12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="max-w-[21cm] mx-auto bg-white resume-shadow print-no-shadow print-no-border min-h-[29.7cm] p-12 md:p-20 relative border border-slate-100 dark:border-none">

        {/* --- TOP HEADER --- */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 border-b-4 border-black pb-12">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4 uppercase"
              >
                {personalInfo.fullName}
              </motion.h1>
              <div className="text-2xl italic font-serif text-slate-500 mb-8">{personalInfo.title}</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-[13px] inter font-semibold uppercase tracking-widest text-slate-500">
                {personalInfo.email && <div className="flex items-center gap-2 underline decoration-slate-200 underline-offset-4"><Mail size={12} className="shrink-0" />{personalInfo.email}</div>}
                {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={12} className="shrink-0" />{personalInfo.location}</div>}
                {personalInfo.linkedInURL && <div className="flex items-center gap-2"><Linkedin size={12} className="shrink-0" />LinkedIn</div>}
                {personalInfo.githubURL && <div className="flex items-center gap-2"><Github size={12} className="shrink-0" />GitHub</div>}
              </div>
            </div>

            {personalInfo.profilePhotoURL && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-32 h-32 md:w-44 md:h-44 grayscale contrast-[1.1] border border-black p-1 shrink-0"
              >
                <img src={personalInfo.profilePhotoURL} alt={personalInfo.fullName} className="w-full h-full object-cover" />
              </motion.div>
            )}
          </div>
        </header>

        <main className="space-y-16">

          {/* --- SUMMARY --- */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-8 sans">
              Professional Narrative
            </h2>
            <div className="text-lg leading-relaxed text-justify text-slate-800">
              {about.extendedBio}
            </div>
          </section>

          {/* --- EXPERIENCE --- */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-10 sans">
              Strategic Experience
            </h2>
            <div className="space-y-12">
              {experience.map((exp, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative pl-8 border-l border-slate-100"
                >
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-black"></div>
                  <div className="flex flex-col md:flex-row justify-between items-baseline gap-2 mb-4">
                    <h3 className="text-2xl font-bold text-black sans">{exp.jobTitle}</h3>
                    <span className="text-xs font-black inter uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded">{exp.dates}</span>
                  </div>
                  <div className="text-lg italic text-slate-600 mb-6 font-serif">/ {exp.company}, {exp.location}</div>
                  <ul className="space-y-3">
                    {exp.responsibilities.map((r, idx) => (
                      <li key={idx} className="text-[15px] leading-relaxed text-slate-700 flex gap-4">
                        <span className="text-black font-bold">—</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </section>

          {/* --- SKILLS & EDUCATION --- */}
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-16">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-8 sans">
                Core Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {about.skills?.map((cat, i) => (
                  cat.tags?.map((tag, j) => (
                    <span key={`${i}-${j}`} className="text-[12px] font-bold inter uppercase tracking-wider text-black bg-white border border-black/10 px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-default">
                      {tag}
                    </span>
                  ))
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-8 sans">
                Critical Projects
              </h2>
              <div className="space-y-8">
                {projects.slice(0, 3).map((p, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-black text-lg sans uppercase tracking-tighter group-hover:text-slate-500 transition-colors">{p.name}</div>
                      <span className="text-[10px] inter font-black uppercase text-slate-400">{p.category}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 italic">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </main>

        <footer className="mt-24 pt-10 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] inter font-bold uppercase tracking-[0.3em] text-slate-400">
          <div>Ref: Available on Demand</div>
          <div className="text-center">© {new Date().getFullYear()} {personalInfo.fullName}</div>
          <div>Digital Archive: {personalInfo.portfolioNameAbbr}.{new Date().getFullYear()}</div>
        </footer>

      </div>
    </div>
  );
}
