/* MinimalistTemplate.tsx - Ultra-Technical / Blueprint / Wireframe */
import React from 'react';
import type { PortfolioData } from './types';

export default function MinimalistTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, about, experience, projects } = data;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono text-sm leading-relaxed selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <style>{`
        :root {
          --grid-color: rgba(0,0,0,0.08);
          --grid-dark: rgba(255,255,255,0.08);
        }
        .dark {
           --grid-color: var(--grid-dark);
        }
        
        body {
          background-image: 
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .border-box {
            border: 1px solid var(--grid-color);
        }
        .border-b-box {
            border-bottom: 1px solid var(--grid-color);
        }
        .border-r-box {
            border-right: 1px solid var(--grid-color);
        }
      `}</style>

      <div className="fixed top-0 left-0 w-full h-2 bg-[hsl(var(--brand))] z-50"></div>

      <main className="max-w-5xl mx-auto border-l border-r border-dashed border-neutral-300 dark:border-neutral-800 min-h-screen bg-white dark:bg-black relative">

        {/* --- HEADER --- */}
        <header className="p-8 border-b border-neutral-300 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Portfolio_v2.0 // {new Date().getFullYear()}</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">{personalInfo.fullName}</h1>
            <p className="mt-2 text-neutral-500 max-w-md">
              {personalInfo.title} // {personalInfo.tagline}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs">
            <a href={`mailto:${personalInfo.email}`} className="hover:bg-[hsl(var(--brand))] hover:text-white px-1 transition-colors">{personalInfo.email}</a>
            <a href={personalInfo.linkedInURL} className="hover:bg-[hsl(var(--brand))] hover:text-white px-1 transition-colors">LinkedIn_Profile</a>
            <a href={personalInfo.githubURL} className="hover:bg-[hsl(var(--brand))] hover:text-white px-1 transition-colors">Github_Repo</a>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>System Online</span>
            </div>
          </div>
        </header>

        {/* --- INFO GRID --- */}
        <div className="grid md:grid-cols-[250px_1fr] border-b border-neutral-300 dark:border-neutral-800">
          {/* Sidebar Photo */}
          <div className="border-r border-neutral-300 dark:border-neutral-800 p-8 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
            <div className="w-40 h-40 border border-neutral-300 dark:border-neutral-700 p-1">
              {personalInfo.profilePhotoURL ? (
                <img src={personalInfo.profilePhotoURL} alt="Profile" className="w-full h-full object-cover grayscale contrast-125" />
              ) : (
                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-4xl">?</div>
              )}
            </div>
            <div className="mt-4 text-[10px] text-center w-full font-bold">
              ID: {personalInfo.portfolioNameAbbr} <br />
              LOC: {personalInfo.location || "UNKNOWN"}
            </div>
          </div>

          {/* Bio Content */}
          <div className="p-8 md:p-12">
            <div className="uppercase text-xs font-bold mb-6 text-[hsl(var(--brand))]">[01] // About_User</div>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl">
              {about.extendedBio}
            </p>

            <div className="mt-12">
              <div className="text-xs font-bold uppercase mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2 inline-block">Skillset_Matrix</div>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {about.skills?.map((cat, i) => (
                  cat.tags?.map((tag, j) => (
                    <div key={`${i}-${j}`} className="flex items-center gap-2">
                      <span className="text-[hsl(var(--brand))]">+</span> {tag}
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- PROJECTS --- */}
        <div>
          <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800 text-xs font-bold uppercase sticky top-0 z-10">
            [02] // Project_Directory
          </div>

          {projects.map((project, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_200px] border-b border-neutral-300 dark:border-neutral-800 group hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
              <div className="p-8 border-r border-neutral-300 dark:border-neutral-800">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-[10px] text-neutral-400">0{i + 1}</span>
                  <h3 className="text-2xl font-bold group-hover:text-[hsl(var(--brand))] transition-colors">{project.name}</h3>
                </div>
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">{project.category}</div>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mb-6">
                  {project.description}
                </p>
                <div className="flex gap-2 text-[10px] uppercase">
                  {project.tags?.map((t, idx) => (
                    <span key={idx} className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1">{t}</span>
                  ))}
                </div>
              </div>
              <div className="p-8 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 h-64 md:h-auto overflow-hidden relative">
                {project.imageURL ? (
                  <img src={project.imageURL} className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center border border-dashed border-neutral-400">NO_IMG</div>
                )}
                <a href={project.detailsURL} className="relative z-10 bg-white dark:bg-black border border-black dark:border-white px-4 py-2 text-xs font-bold hover:bg-[hsl(var(--brand))] hover:border-[hsl(var(--brand))] hover:text-white transition-colors">
                  ACCESS_DATA →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* --- HISTORY --- */}
        <div className="grid md:grid-cols-2">
          <div className="border-r border-neutral-300 dark:border-neutral-800">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800 text-xs font-bold uppercase sticky top-0">
              [03] // Career_Logs
            </div>
            <div className="divide-y divide-neutral-300 dark:divide-neutral-800">
              {experience.map((exp, i) => (
                <div key={i} className="p-8 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                  <div className="text-xs font-bold mb-1">{exp.dates}</div>
                  <h4 className="text-lg font-bold">{exp.jobTitle}</h4>
                  <div className="text-[hsl(var(--brand))] mb-4">@ {exp.company}</div>
                  <p className="text-xs text-neutral-500">
                    → {exp.responsibilities[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* --- CONTACT --- */}
          <div className="flex flex-col justify-between min-h-[50vh]">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800 text-xs font-bold uppercase">
              [04] // Transmit_Signal
            </div>

            <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 border border-dashed border-neutral-400 rounded-full flex items-center justify-center mb-8 animate-spin-slow" style={{ animationDuration: '10s' }}>
                <div className="w-20 h-20 border border-neutral-300 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[hsl(var(--brand))] rounded-full"></div>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6">INITIATE_PROTOCOL</h2>
              <p className="text-neutral-500 text-xs max-w-xs mx-auto mb-8">
                User is currently accepting new connection requests.
                Response time: ~24 hours.
              </p>

              <a href={`mailto:${personalInfo.email}`} className="text-xl border-b-2 border-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))] hover:text-white px-2 py-1 transition-all">
                {personalInfo.email}
              </a>
            </div>

            <div className="p-4 border-t border-neutral-300 dark:border-neutral-800 text-[10px] text-center text-neutral-400 uppercase">
              End of File // System Terminated
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
