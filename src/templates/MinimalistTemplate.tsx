/* MinimalistTemplate.tsx - Ultra-Technical / Blueprint / Terminal Aesthetic */
import React from 'react';
import type { PortfolioData } from './types';
import { motion } from 'framer-motion';

const container = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const item = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 }
};

const scanLine = {
  animate: {
    y: ['0%', '1000%'],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export default function MinimalistTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, about, experience, projects } = data;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] text-[#111] dark:text-[#eee] font-mono text-[13px] leading-relaxed selection:bg-[#111] selection:text-white dark:selection:bg-white dark:selection:text-black relative overflow-x-hidden">
      {/* --- SCANNING LINE --- */}
      <motion.div
        variants={scanLine}
        animate="animate"
        className="fixed top-0 left-0 w-full h-[1px] bg-[hsl(var(--brand))] opacity-20 pointer-events-none z-[100]"
      />

      <style>{`
        :root {
          --grid-color: rgba(0,0,0,0.04);
          --grid-dark: rgba(255,255,255,0.03);
        }
        .dark {
           --grid-color: var(--grid-dark);
        }
        
        body {
          background-image: 
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .border-technical {
            border: 1px solid var(--grid-color);
        }
        
        .typewriter {
            overflow: hidden;
            border-right: .15em solid [hsl(var(--brand))];
            white-space: nowrap;
            margin: 0 auto;
            letter-spacing: .15em;
            animation: 
              typing 3.5s steps(40, end),
              blink-caret .75s step-end infinite;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: [hsl(var(--brand))] }
        }
      `}</style>

      <div className="fixed top-0 left-0 w-full h-1 bg-[hsl(var(--brand))] z-[60]"></div>

      <main className="max-w-6xl mx-auto border-x border-dashed border-neutral-300 dark:border-white/10 min-h-screen bg-white/50 dark:bg-black/50 backdrop-blur-[2px] relative z-10">

        {/* --- HEADER --- */}
        <header className="p-10 border-b border-technical flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-4 font-black">
                            // PORTFOLIO_CORE_OS_v4.2 // {new Date().getFullYear()}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
              {personalInfo.fullName}
            </h1>
            <div className="flex items-center gap-4 text-neutral-500 font-bold uppercase tracking-widest text-[11px]">
              <span>{personalInfo.title}</span>
              <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
              <span>{personalInfo.location || "Remote_Node"}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-end gap-3 text-[11px] font-bold uppercase tracking-widest"
          >
            <a href={`mailto:${personalInfo.email}`} className="hover:text-[hsl(var(--brand))] border-b border-transparent hover:border-[hsl(var(--brand))] transition-all underline decoration-neutral-300 underline-offset-4">{personalInfo.email}</a>
            <a href={personalInfo.linkedInURL} className="hover:text-[hsl(var(--brand))] underline decoration-neutral-300 underline-offset-4 tracking-[0.2em]">LinkedIn_Connect</a>
            <div className="mt-4 flex items-center gap-3 px-3 py-1 bg-[hsl(var(--brand))]/10 border border-[hsl(var(--brand))]/20 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span className="text-[hsl(var(--brand))]">Protocol: Active</span>
            </div>
          </motion.div>
        </header>

        {/* --- MAIN DATA GRID --- */}
        <div className="grid md:grid-cols-[280px_1fr] border-b border-technical">
          {/* AVATAR BOX */}
          <div className="border-r border-technical p-10 flex flex-col items-center justify-center bg-neutral-50/50 dark:bg-neutral-900/50 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[hsl(var(--brand))]/5 to-transparent"></div>
            <div className="w-48 h-48 border-2 border-technical p-1 relative z-10 group-hover:border-[hsl(var(--brand))]/30 transition-colors">
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[hsl(var(--brand))]"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[hsl(var(--brand))]"></div>
              {personalInfo.profilePhotoURL ? (
                <img src={personalInfo.profilePhotoURL} alt="Unit_ID" className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[1.05]" />
              ) : (
                <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-5xl font-black">?</div>
              )}
            </div>
            <div className="mt-8 text-[10px] text-center w-full font-black tracking-[0.2em] text-neutral-400">
              UNIT_ID: {personalInfo.portfolioNameAbbr} <br />
              STATUS: VERIFIED
            </div>
          </div>

          {/* BIO PORT */}
          <div className="p-10 md:p-16 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl pointer-events-none select-none">01</div>
            <div className="uppercase text-[11px] font-black mb-8 text-[hsl(var(--brand))] tracking-[0.4em] flex items-center gap-4">
              <div className="w-8 h-[1px] bg-[hsl(var(--brand))]"></div>
              User_Bio_Data
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-xl md:text-3xl font-medium tracking-tight leading-tight max-w-2xl mb-16"
            >
              {about.extendedBio}
            </motion.p>

            <div className="space-y-8">
              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-400 underline decoration-neutral-300 underline-offset-8">Skill_Stack_Matrix</div>
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                {about.skills?.map((cat, i) => (
                  cat.tags?.map((tag, j) => (
                    <motion.div
                      key={`${i}-${j}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: (i + j) * 0.05 }}
                      className="flex items-center gap-3 group"
                    >
                      <span className="text-[hsl(var(--brand))] font-black group-hover:scale-150 transition-transform">▸</span>
                      <span className="font-bold tracking-wider group-hover:text-[hsl(var(--brand))] transition-colors">{tag}</span>
                    </motion.div>
                  ))
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- WORK DIRECTORY --- */}
        <div>
          <div className="p-5 bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-technical text-[11px] font-black uppercase tracking-[0.5em] sticky top-0 z-20 backdrop-blur-md flex justify-between">
            <span>[02] // Project_Repository</span>
            <span className="animate-pulse">STREAMING_DATA...</span>
          </div>

          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-[1fr_320px] border-b border-technical group hover:bg-[hsl(var(--brand))]/[0.02] transition-colors overflow-hidden"
            >
              <div className="p-10 md:p-16 border-r border-technical">
                <div className="flex items-baseline gap-6 mb-6">
                  <span className="text-[11px] font-black text-[hsl(var(--brand))]">0{i + 1}_LOG</span>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter group-hover:translate-x-4 transition-transform duration-500 uppercase">{project.name}</h3>
                </div>
                <div className="text-[11px] uppercase tracking-[0.3em] font-black text-neutral-400 mb-8 px-2 border-l-2 border-[hsl(var(--brand))]">{project.category}</div>
                <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed max-w-xl mb-10 font-medium">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.tags?.map((t, idx) => (
                    <span key={idx} className="bg-neutral-100 dark:bg-neutral-900 border border-technical px-3 py-1 text-[10px] font-black uppercase tracking-widest group-hover:border-[hsl(var(--brand))]/30 transition-colors">{t}</span>
                  ))}
                </div>
              </div>
              <div className="relative h-80 md:h-auto overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                {project.imageURL ? (
                  <img src={project.imageURL} className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                ) : (
                  <div className="text-neutral-300 font-black text-4xl opacity-10">NULL_IMAGE</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <a href={project.detailsURL} target="_blank" className="bg-white dark:bg-black text-[#111] dark:text-white border-2 border-white dark:border-white px-8 py-4 text-xs font-black uppercase tracking-[0.4em] hover:bg-[hsl(var(--brand))] hover:border-[hsl(var(--brand))] hover:text-white transition-all">
                    Launch_Shell →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- FOOTER GRID --- */}
        <div className="grid md:grid-cols-2">
          {/* EXPERIENCE LOGS */}
          <div className="border-r border-technical">
            <div className="p-5 bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-technical text-[11px] font-black uppercase tracking-[0.5em] sticky top-[45px] md:top-[53px] z-10 backdrop-blur-md">
              [03] // Career_Audit_Logs
            </div>
            <div className="divide-y divide-technical">
              {experience.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 hover:bg-[hsl(var(--brand))]/5 transition-colors"
                >
                  <div className="text-[11px] font-black text-neutral-400 mb-2 tracking-[0.2em]">{exp.dates}</div>
                  <h4 className="text-2xl font-black mb-1 uppercase tracking-tight">{exp.jobTitle}</h4>
                  <div className="text-[hsl(var(--brand))] font-black text-[11px] tracking-[0.2em] mb-6">@ {exp.company}</div>
                  <ul className="space-y-3">
                    {exp.responsibilities.slice(0, 2).map((res, ridx) => (
                      <li key={ridx} className="text-[12px] text-neutral-500 font-medium flex gap-3 italic leading-relaxed">
                        <span className="text-[hsl(var(--brand))]">/</span> {res}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CONTACT MODULE */}
          <div className="flex flex-col justify-between min-h-[60vh] relative">
            <div className="p-5 bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-technical text-[11px] font-black uppercase tracking-[0.5em]">
              [04] // Signal_Broadcaster
            </div>

            <div className="p-10 flex-1 flex flex-col justify-center items-center text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 border border-dashed border-[hsl(var(--brand))]/30 rounded-full flex items-center justify-center mb-12"
              >
                <div className="w-32 h-32 border border-technical rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-4 h-4 bg-[hsl(var(--brand))] rounded-full shadow-[0_0_20px_[hsl(var(--brand))]]"
                  />
                </div>
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">Let&apos;s Connect</h2>
              <p className="text-neutral-500 font-bold text-[11px] tracking-[0.3em] uppercase max-w-xs mx-auto mb-12">
                System ready for new inbound collaboration requests.
                Secure connection established.
              </p>

              <a href={`mailto:${personalInfo.email}`} className="text-2xl md:text-3xl font-black text-[hsl(var(--brand))] border-b-4 border-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))] hover:text-white px-4 py-2 transition-all leading-none">
                {personalInfo.email.toUpperCase()}
              </a>
            </div>

            <div className="p-6 border-Technical text-[9px] font-bold text-center text-neutral-400 uppercase tracking-[0.8em] bg-neutral-50 dark:bg-neutral-900/10">
              End_of_Transmission // {personalInfo.fullName.replace(/\s/g, '_')} // (C) {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
