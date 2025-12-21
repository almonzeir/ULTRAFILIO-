/* GeneratedModernTemplate.tsx -> REBORN as "FuturisticTemplate.tsx" (Cyberpunk / Neon) */
import React from 'react';
import type { PortfolioData } from './types';

export default function FuturisticTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, about, experience, projects } = data;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono selection:bg-[hsl(var(--brand))] selection:text-black overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        
        :root {
           --neon-glow: 0 0 10px hsl(var(--brand)), 0 0 20px hsl(var(--brand));
           --panel-bg: rgba(20, 20, 20, 0.8);
           --border-color: rgba(255, 255, 255, 0.1);
        }

        body { font-family: 'Rajdhani', sans-serif; }
        .font-cyber { font-family: 'Orbitron', sans-serif; }

        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 50;
          opacity: 0.15;
        }
        
        .neon-text {
            text-shadow: 0 0 5px hsl(var(--brand)), 0 0 10px hsl(var(--brand));
        }

        .cyber-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
            border: 1px solid hsl(var(--brand) / 0.3);
            position: relative;
            backdrop-filter: blur(4px);
        }
        .cyber-card::before {
            content: '';
            position: absolute;
            top: -1px; left: -1px;
            width: 10px; height: 10px;
            border-top: 2px solid hsl(var(--brand));
            border-left: 2px solid hsl(var(--brand));
        }
        .cyber-card::after {
            content: '';
            position: absolute;
            bottom: -1px; right: -1px;
            width: 10px; height: 10px;
            border-bottom: 2px solid hsl(var(--brand));
            border-right: 2px solid hsl(var(--brand));
        }
        
        .glitch-hover:hover {
            animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
            color: hsl(var(--brand));
        }
        @keyframes glitch {
            0% { transform: translate(0) }
            20% { transform: translate(-2px, 2px) }
            40% { transform: translate(-2px, -2px) }
            60% { transform: translate(2px, 2px) }
            80% { transform: translate(2px, -2px) }
            100% { transform: translate(0) }
        }
      `}</style>

      <div className="scanline"></div>

      {/* --- HUD HEADER --- */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur border-b border-[hsl(var(--brand)/0.3)] h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-[hsl(var(--brand))] rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--brand))]"></div>
          <div className="font-cyber text-xl tracking-widest text-white">
            SYSTEM.<span className="text-[hsl(var(--brand))]">OS</span>
          </div>
        </div>
        <div className="text-xs font-mono text-[hsl(var(--brand))] opacity-70 hidden sm:block">
              // CONNECTED: {personalInfo.portfolioNameAbbr}
        </div>
        <nav className="flex gap-6 text-sm font-bold tracking-wider">
          {['DATA', 'SKILLS', 'PROJECTS', 'SIGNAL'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[hsl(var(--brand))] hover:shadow-[0_0_10px_hsl(var(--brand))] transition-all">
              [{item}]
            </a>
          ))}
        </nav>
      </header>

      {/* --- HERO --- */}
      <section id="data" className="pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `linear-gradient(hsl(var(--brand)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--brand)) 1px, transparent 1px)`, backgroundSize: '50px 50px', transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)' }}>
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 relative z-10 items-center">
          <div>
            <div className="font-mono text-[hsl(var(--brand))] mb-4 flex items-center gap-2">
              <span className="inline-block w-20 h-[1px] bg-[hsl(var(--brand))]"></span>
              INITIALIZING PROFILE SEQUENCE...
            </div>
            <h1 className="font-cyber text-6xl md:text-8xl font-bold leading-none mb-6 transparent-text" style={{ WebkitTextStroke: '1px white' }}>
              {(personalInfo.fullName || 'YOUR NAME').toUpperCase()}
            </h1>
            <h2 className="text-3xl font-bold text-[hsl(var(--brand))] mb-8 glitch-hover inline-block cursor-default">
              {personalInfo.title}
            </h2>
            <p className="text-xl text-gray-400 max-w-xl leading-relaxed border-l-2 border-[hsl(var(--brand))] pl-6 mb-12">
              {personalInfo.tagline}
            </p>

            <div className="flex gap-6">
              <a href="#projects" className="px-8 py-4 bg-[hsl(var(--brand)/0.2)] border border-[hsl(var(--brand))] text-[hsl(var(--brand))] font-cyber font-bold tracking-widest hover:bg-[hsl(var(--brand))] hover:text-black hover:shadow-[0_0_20px_hsl(var(--brand))] transition-all">
                ACCESS_WORK
              </a>
              <a href="#signal" className="px-8 py-4 border border-gray-700 hover:border-white transition-colors font-cyber tracking-widest text-sm flex items-center">
                CONTACT_USER
              </a>
            </div>
          </div>

          {/* Holographic Image Container */}
          <div className="relative flex justify-center">
            <div className="w-80 h-80 md:w-96 md:h-96 relative">
              <div className="absolute inset-0 border-2 border-[hsl(var(--brand))] rounded-full animate-[spin_10s_linear_infinite] border-t-transparent border-l-transparent opacity-50"></div>
              <div className="absolute inset-4 border border-[hsl(var(--brand))] rounded-full animate-[spin_15s_linear_infinite_reverse] border-b-transparent border-r-transparent opacity-30"></div>

              <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-gray-800 bg-gray-900">
                {personalInfo.profilePhotoURL ? (
                  <img src={personalInfo.profilePhotoURL} alt="Profile" className="w-full h-full object-cover filter sepia brightness-75 hue-rotate-180" style={{ mixBlendMode: 'luminosity' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-[hsl(var(--brand))] font-cyber">NO_SIGNAL</div>
                )}
                {/* Scanline overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--brand)/0.2)] to-transparent h-2 w-full animate-[scan_2s_linear_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS & SKILLS (Cyber Cards) --- */}
      <section id="skills" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {about.stats?.map((stat, i) => (
              <div key={i} className="cyber-card p-6 text-center group hover:bg-[hsl(var(--brand)/0.1)] transition-colors">
                <div className="text-4xl font-cyber font-bold text-white mb-2 group-hover:text-[hsl(var(--brand))] group-hover:neon-text transition-all">
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-[hsl(var(--brand))] tracking-widest uppercase">
                              // {stat.label}
                </div>
              </div>
            ))}
          </div>

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
                {/* Image */}
                <div className="aspect-video relative overflow-hidden bg-gray-900 border-b border-gray-800">
                  {project.imageURL ? (
                    <img src={project.imageURL} alt={project.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 grayscale group-hover:grayscale-0" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-cyber text-4xl">NULL</div>
                  )}
                  <div className="absolute inset-0 bg-[hsl(var(--brand))] mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-xs font-mono text-[hsl(var(--brand))] mb-2">
                    DIR: {project.category}
                  </div>
                  <h3 className="text-xl font-bold font-cyber text-white mb-4 group-hover:text-[hsl(var(--brand))] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 border-l border-gray-700 pl-3">
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

      {/* --- FOOTER --- */}
      <footer id="signal" className="py-20 px-6 border-t border-[hsl(var(--brand)/0.3)] bg-gradient-to-b from-[#050505] to-[hsl(var(--brand)/0.05)] text-center">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-[hsl(var(--brand))] flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 bg-[hsl(var(--brand)/0.2)] rounded-full flex items-center justify-center">
            <span className="text-2xl text-[hsl(var(--brand))]">📶</span>
          </div>
        </div>

        <h2 className="text-3xl font-cyber font-bold mb-8">ESTABLISH_UPLINK</h2>
        <a href={`mailto:${personalInfo.email}`} className="text-xl md:text-3xl font-mono hover:text-[hsl(var(--brand))] hover:neon-text transition-all">
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
