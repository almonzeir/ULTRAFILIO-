/* GeneratedModernTemplate.tsx -> REBORN as "FuturisticTemplate.tsx" (Cyberpunk / Neon) */
import React from 'react';
import type { PortfolioData } from './types';

export default function FuturisticTemplate({ data, isDarkMode }: { data: PortfolioData; isDarkMode?: boolean }) {
  const { personalInfo, about, experience, projects, education, certifications, languages } = data;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#050505] dark:bg-[#050505] text-[#e0e0e0] dark:text-[#e0e0e0] font-mono selection:bg-[hsl(var(--brand))] selection:text-black overflow-x-hidden transition-colors duration-500`}>
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
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-blur: 10px;
          position: relative;
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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-cyber font-black leading-none tracking-tighter mb-8 neon-text">
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

            <div className="relative w-64 h-64 md:w-96 md:h-96 bg-black border-2 border-[hsl(var(--brand))] overflow-hidden">
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
          <h2 className="font-cyber text-4xl mb-12 flex items-end gap-4">
            PROJECT_DATABASE
            <span className="text-sm font-mono text-[hsl(var(--brand))] mb-2 opacity-70">
                      // {projects.length} RECORDS FOUND
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
                  <h3 className="text-xl font-bold font-cyber text-white mb-4 group-hover:text-[hsl(var(--brand))] transition-colors">
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
                  <h2 className="font-cyber text-xl sm:text-3xl mb-10 text-[hsl(var(--brand))] uppercase flex items-center gap-3">
                    <span className="w-4 h-[1px] bg-[hsl(var(--brand))] flex-shrink-0"></span>
                    <span className="truncate">SECURITY_CLEARENCE</span>
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
                  <h2 className="font-cyber text-xl sm:text-3xl mb-10 text-[hsl(var(--brand))] uppercase flex items-center gap-3">
                    <span className="w-4 h-[1px] bg-[hsl(var(--brand))] flex-shrink-0"></span>
                    <span className="truncate">LEXICON_UPLINK</span>
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

      {/* --- FOOTER --- */}
      <footer id="signal" className="py-20 px-6 border-t border-[hsl(var(--brand)/0.3)] bg-gradient-to-b from-[#050505] to-[hsl(var(--brand)/0.05)] text-center">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-[hsl(var(--brand))] flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 bg-[hsl(var(--brand)/0.2)] rounded-full flex items-center justify-center">
            <span className="text-2xl text-[hsl(var(--brand))]">📶</span>
          </div>
        </div>

        <h2 className="text-3xl font-cyber font-bold mb-8">ESTABLISH_UPLINK</h2>
        <a href={`mailto:${personalInfo.email}`} className="text-xl md:text-3xl font-mono hover:text-[hsl(var(--brand))] hover:neon-text transition-all tracking-tighter">
          {personalInfo.email}
        </a>

        <div className="mt-16 text-xs text-gray-600 font-mono">
          SYSTEM STATUS: OPTIMAL <br />
          © {new Date().getFullYear()} {personalInfo.fullName} // END_OF_LINE
        </div>
      </footer>
    </div>
  );
}
