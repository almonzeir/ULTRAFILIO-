/* GeneratedModernTemplate.tsx -> REBORN as "FuturisticTemplate.tsx" (Cyberpunk / Neon) */
import React from 'react';
import type { PortfolioData } from './types';

export default function FuturisticTemplate({ data, isDarkMode, colorTheme }: { data: PortfolioData; isDarkMode?: boolean; colorTheme?: string }) {
  const { personalInfo, about, experience, projects, education, certifications, languages } = data;

  // FORCE LIGHT MODE ONLY - Ignore isDarkMode prop
  const forcedLightMode = false;

  return (
    <div className={`min-h-screen ${forcedLightMode ? 'dark' : ''} bg-[#ffffff] dark:bg-[#050505] text-[#1a1a1a] dark:text-[#e0e0e0] font-mono selection:bg-[hsl(var(--brand))] selection:text-white dark:selection:text-black overflow-x-hidden transition-colors duration-500`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        
        :root {
          --font-cyber: 'Orbitron', sans-serif;
          --font-mono: 'Rajdhani', monospace;
        }

        .font-cyber { font-family: var(--font-cyber); }
        .font-mono { font-family: var(--font-mono); }

        .neon-text {
          text-shadow: 0 0 10px hsl(var(--brand)), 0 0 20px hsl(var(--brand));
        }

        .cyber-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
          backdrop-blur: 10px;
          position: relative;
        }
        .dark .cyber-card {
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cyber-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 20px;
          background: hsl(var(--brand));
        }

        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--brand)/0.15)] rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--brand-2)/0.1)] rounded-full blur-[150px] animate-pulse delay-700"></div>

          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-block px-4 py-1 border border-[hsl(var(--brand))] text-[hsl(var(--brand))] text-xs tracking-[0.4em] uppercase mb-8 font-mono">
              SYSTEM_INIT // VERSION_4.0
            </div>
            <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-cyber font-black leading-none tracking-tighter mb-8 neon-text break-words">
              {personalInfo.fullName.split(' ')[0]} <br />
              <span className="text-transparent border-text text-outline-[hsl(var(--brand))]">
                {personalInfo.fullName.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mono text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-12 uppercase tracking-widest italic">
              &gt; {personalInfo.title}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <a href="#projects" className="px-10 py-4 bg-[hsl(var(--brand))] text-black font-cyber font-bold tracking-widest hover:scale-105 transition-all">
                ACCESS_FILES
              </a>
              <a href="#signal" className="px-10 py-4 border border-[hsl(var(--brand))] text-[hsl(var(--brand))] font-cyber font-bold tracking-widest hover:bg-[hsl(var(--brand))] hover:text-black transition-all">
                SEND_SIGNAL
              </a>
            </div>
          </div>

          <div className="relative group mx-auto lg:ml-auto">
            <div className="absolute -inset-4 border border-[hsl(var(--brand)/0.3)] animate-pulse"></div>
            <div className="absolute -inset-8 border border-[hsl(var(--brand)/0.1)] animate-pulse delay-500"></div>

            <div className="relative w-64 h-64 md:w-96 md:h-96 bg-white dark:bg-black border-2 border-[hsl(var(--brand))] overflow-hidden">
              {personalInfo.profilePhotoURL ? (
                <img src={personalInfo.profilePhotoURL} alt="CORE_IDENTITY" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-[hsl(var(--brand))] font-cyber">NO_SIGNAL</div>
              )}
              {/* Scanline overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--brand)/0.2)] to-transparent h-2 w-full animate-[scan_2s_linear_infinite]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BIO & SKILLS --- */}
      <section id="skills" className="py-20 px-6 relative z-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="cyber-card p-8 md:p-12">
              <h3 className="text-2xl font-cyber mb-8 text-[hsl(var(--brand))] flex items-center gap-2">
                <span className="w-2 h-2 bg-[hsl(var(--brand))]"></span>
                BIO_DATA_LOG
              </h3>
              <p className="text-lg leading-loose text-gray-300 font-light">
                {about.extendedBio}
              </p>
            </div>

            <div className="cyber-card p-8 md:p-12">
              <h3 className="text-2xl font-cyber mb-8 text-[hsl(var(--brand))] flex items-center gap-2">
                <span className="w-2 h-2 bg-[hsl(var(--brand))]"></span>
                AUGMENTATIONS
              </h3>
              <div className="flex flex-wrap gap-3">
                {about.skills?.map((cat, i) => (
                  cat.tags?.map((tag, j) => (
                    <span key={`${i}-${j}`} className="px-3 py-1 bg-black border border-[hsl(var(--brand)/0.5)] text-[hsl(var(--brand))] text-xs font-mono uppercase tracking-wider hover:bg-[hsl(var(--brand))] hover:text-black transition-colors cursor-crosshair">
                      {tag}
                    </span>
                  ))
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE --- */}
      {experience && experience.length > 0 && (
        <section id="experience" className="py-20 px-6 relative z-10 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-cyber text-2xl sm:text-4xl mb-12 flex items-center gap-4">
              <span className="text-sm font-mono text-[hsl(var(--brand))]">02</span>
              <span className="truncate">CAREER_TIMELINE</span>
            </h2>
            <div className="space-y-6">
              {experience.map((job, i) => (
                <div key={i} className="cyber-card p-8 group hover:border-[hsl(var(--brand))] transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg sm:text-2xl font-cyber text-white uppercase group-hover:text-[hsl(var(--brand))] transition-colors break-words">{job.jobTitle}</h3>
                      <div className="text-[hsl(var(--brand))] font-mono text-sm tracking-[0.2em]">@ {job.company}</div>
                    </div>
                    <div className="px-4 py-1 border border-gray-700 font-mono text-xs text-gray-500 uppercase tracking-widest">
                      {job.dates}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {job.responsibilities.map((res, ridx) => (
                      <li key={ridx} className="text-gray-400 text-sm font-light flex gap-3">
                        <span className="text-[hsl(var(--brand))] opacity-50">/</span> {res}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- PROJECTS GRID --- */}
      <section id="projects" className="py-20 px-6 bg-[#080808] border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-cyber text-xl sm:text-4xl mb-12 flex flex-wrap items-end gap-4">
            <span className="break-words">PROJECT_DB</span>
            <span className="text-[10px] sm:text-sm font-mono text-[hsl(var(--brand))] mb-1 sm:mb-2 opacity-70">
                      // {projects.length} RECORDS
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <div key={i} className="group relative bg-[#0a0a0a] border border-gray-800 hover:border-[hsl(var(--brand))] transition-colors overflow-hidden">
                <div className="aspect-video relative overflow-hidden bg-gray-900 border-b border-gray-800">
                  {project.imageURL ? (
                    <img src={project.imageURL} alt={project.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 grayscale group-hover:grayscale-0" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-cyber text-4xl">NULL</div>
                  )}
                  <div className="absolute inset-0 bg-[hsl(var(--brand))] mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity"></div>
                </div>

                <div className="p-6">
                  <div className="text-xs font-mono text-[hsl(var(--brand))] mb-2">
                    DIR: {project.category}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-cyber text-white mb-4 group-hover:text-[hsl(var(--brand))] transition-colors break-words">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 border-l border-gray-700 pl-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] text-gray-400 font-mono">#{t}</span>
                    ))}
                  </div>

                  <a href={project.detailsURL} className="block w-full text-center py-2 bg-gray-900 border border-gray-700 text-xs font-mono tracking-widest text-gray-300 hover:bg-[hsl(var(--brand))] hover:text-black hover:border-[hsl(var(--brand))] transition-colors">
                    INITIATE_VIEW
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ACADEMIC & ACCREDITATIONS --- */}
      {((education && education.length > 0) || (certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
        <section id="accreditations" className="py-20 px-6 bg-black border-t border-gray-800">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
            {education && education.length > 0 && (
              <div className="cyber-card p-8 md:p-12">
                <h2 className="font-cyber text-xl sm:text-3xl mb-10 text-[hsl(var(--brand))] uppercase flex items-center gap-3">
                  <span className="w-4 h-[1px] bg-[hsl(var(--brand))] flex-shrink-0"></span>
                  <span className="truncate">EDU_DB_LOG</span>
                </h2>
                <div className="space-y-10">
                  {education.map((edu, i) => (
                    <div key={i} className="border-l-2 border-gray-800 pl-6 group">
                      <div className="text-[10px] font-mono text-gray-600 mb-2 uppercase tracking-[0.3em]">{edu.startDate} - {edu.endDate}</div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[hsl(var(--brand))] transition-colors">{edu.degree}</h4>
                      <div className="text-sm font-mono text-gray-500">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-12">
              {certifications && certifications.length > 0 && (
                <div className="cyber-card p-8 md:p-12">
                  <h2 className="font-cyber text-base sm:text-xl md:text-3xl mb-10 text-[hsl(var(--brand))] uppercase flex items-center gap-3">
                    <span className="w-4 h-[1px] bg-[hsl(var(--brand))] flex-shrink-0"></span>
                    <span className="break-words">SECURITY_KEYS</span>
                  </h2>
                  <div className="grid gap-4">
                    {certifications.map((cert, i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-900 group">
                        <span className="text-[hsl(var(--brand))] font-mono opacity-30 group-hover:opacity-100 transition-opacity">#</span>
                        <span className="text-xs sm:text-sm font-mono tracking-widest uppercase break-words">{cert}</span>
                        <span className="ml-auto text-[10px] text-gray-700 font-mono">VERIFIED</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {languages && languages.length > 0 && (
                <div className="cyber-card p-8 md:p-12">
                  <h2 className="font-cyber text-base sm:text-xl md:text-3xl mb-10 text-[hsl(var(--brand))] uppercase flex items-center gap-3">
                    <span className="w-4 h-[1px] bg-[hsl(var(--brand))] flex-shrink-0"></span>
                    <span className="break-words">LANG_UPLINK</span>
                  </h2>
                  <div className="flex flex-wrap gap-8">
                    {languages.map((lang, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="text-xs font-mono text-gray-600 uppercase tracking-widest">{lang.level || 'Mastery'}</div>
                        <div className="text-2xl font-cyber text-white group-hover:neon-text transition-all">{lang.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- FOOTER --- STUNNING CYBERPUNK DESIGN */}
      <footer id="signal" className="relative py-32 px-6 border-t border-[hsl(var(--brand)/0.5)] bg-gradient-to-b from-[#000000] via-[hsl(var(--brand)/0.08)] to-[#000000] overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--brand)/0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--brand)/0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>

        {/* Scanning Line Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--brand))] to-transparent opacity-50 blur-sm"
            style={{ animation: 'scan 4s ease-in-out infinite' }} />
        </div>

        {/* Hexagonal Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='43' viewBox='0 0 50 43' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0l12.5 7.5v15L25 30 12.5 22.5v-15z' fill='none' stroke='%23ff0080' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '50px 43px'
        }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Connection Nodes Visualization */}
          <div className="flex justify-center items-center gap-8 mb-16">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--brand))] animate-pulse shadow-[0_0_15px_hsl(var(--brand))]" />
              <div className="w-16 h-px bg-gradient-to-r from-[hsl(var(--brand))] to-transparent" />
            </div>
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-[hsl(var(--brand))] flex items-center justify-center animate-pulse">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--brand)/0.3)] to-transparent flex items-center justify-center">
                  <svg className="w-12 h-12 text-[hsl(var(--brand))]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4 0-7-3-7-7V8.3l7-3.5 7 3.5V13c0 4-3 7-7 7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              {/* Rotating Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-[hsl(var(--brand)/0.3)] rounded-full"
                style={{ animation: 'spin 20s linear infinite' }} />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-px bg-gradient-to-l from-[hsl(var(--brand))] to-transparent" />
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--brand))] animate-pulse shadow-[0_0_15px_hsl(var(--brand))]" />
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[hsl(var(--brand)/0.3)] rounded-full mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
              <span className="text-xs font-mono text-gray-400 uppercase tracking-[0.3em]">SYSTEM ONLINE</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-cyber font-black mb-4 tracking-tight">
              <span className="inline-block" style={{
                animation: 'glitch 3s infinite',
                textShadow: `
                  0 0 10px hsl(var(--brand)),
                  0 0 20px hsl(var(--brand)),
                  0 0 40px hsl(var(--brand))
                `
              }}>ESTABLISH_UPLINK</span>
            </h2>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[hsl(var(--brand))]" />
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">SECURE CONNECTION</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[hsl(var(--brand))]" />
            </div>

            <a href={`mailto:${personalInfo.email}`}
              className="group inline-block text-2xl sm:text-3xl md:text-4xl font-mono hover:text-[hsl(var(--brand))] transition-all tracking-tight relative px-6 py-3">
              <span className="relative z-10">{personalInfo.email}</span>
              <div className="absolute inset-0 border border-[hsl(var(--brand)/0)] group-hover:border-[hsl(var(--brand))] transition-all rounded-lg"
                style={{ transform: 'skew(-2deg)' }} />
              <div className="absolute inset-0 bg-[hsl(var(--brand)/0)] group-hover:bg-[hsl(var(--brand)/0.1)] transition-all rounded-lg blur-xl" />
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-8 mb-16">
            {personalInfo.linkedInURL && (
              <a href={personalInfo.linkedInURL} target="_blank"
                className="group relative w-14 h-14 border border-[hsl(var(--brand)/0.3)] hover:border-[hsl(var(--brand))] rounded-lg flex items-center justify-center transition-all hover:shadow-[0_0_30px_hsl(var(--brand)/0.5)]">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-[hsl(var(--brand))] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <div className="absolute inset-0 bg-[hsl(var(--brand)/0)] group-hover:bg-[hsl(var(--brand)/0.1)] rounded-lg transition-all" />
              </a>
            )}
            {personalInfo.githubURL && (
              <a href={personalInfo.githubURL} target="_blank"
                className="group relative w-14 h-14 border border-[hsl(var(--brand)/0.3)] hover:border-[hsl(var(--brand))] rounded-lg flex items-center justify-center transition-all hover:shadow-[0_0_30px_hsl(var(--brand)/0.5)]">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-[hsl(var(--brand))] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.430.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <div className="absolute inset-0 bg-[hsl(var(--brand)/0)] group-hover:bg-[hsl(var(--brand)/0.1)] rounded-lg transition-all" />
              </a>
            )}
          </div>

          {/* Terminal-Style Status Bar */}
          <div className="border border-[hsl(var(--brand)/0.3)] rounded-lg p-6 backdrop-blur-sm bg-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400">UPTIME: 99.9%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-px h-4 bg-[hsl(var(--brand)/0.3)]" />
                <span className="text-gray-500">LATENCY: 12ms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-px h-4 bg-[hsl(var(--brand)/0.3)]" />
                <span className="text-gray-500">PROTOCOL: HTTPS/3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-px h-4 bg-[hsl(var(--brand)/0.3)]" />
                <span className="text-[hsl(var(--brand))]">STATUS: OPTIMAL</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 text-xs text-gray-600 font-mono">
              <span>© {new Date().getFullYear()}</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="text-gray-400">{personalInfo.fullName.toUpperCase()}</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="text-[hsl(var(--brand)/0.5)]">END_OF_TRANSMISSION</span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes scan {
            0%, 100% { transform: translateY(-100%); }
            50% { transform: translateY(calc(100vh + 100%)); }
          }
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(50px); }
          }
          @keyframes glitch {
            0%, 90%, 100% { transform: translate(0); }
            92% { transform: translate(-2px, 2px); }
            94% { transform: translate(2px, -1px); }
            96% { transform: translate(-1px, 1px); }
          }
        `}</style>
      </footer>
    </div>
  );
}
