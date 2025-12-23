/* BasicTemplate.tsx - Modern Editorial / Premium Print / Resume Style */
import React from 'react';
import type { PortfolioData } from './types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BasicTemplate({ data, isDarkMode }: { data: PortfolioData; isDarkMode?: boolean }) {
  const { personalInfo, about, experience, projects, education = [], certifications = [], languages = [] } = data;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#FDFDFD] dark:bg-[#050505] py-12 sm:py-20 px-4 sm:px-8 print:p-0 print:bg-white text-[#1a1a1a] dark:text-slate-200 leading-relaxed selection:bg-[#1a1a1a] selection:text-white transition-colors duration-500`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        :root {
          --font-main: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .basic-template * {
          font-family: var(--font-main);
        }
        
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

      <div className="basic-template max-w-[21cm] mx-auto bg-white resume-shadow print-no-shadow print-no-border min-h-[29.7cm] p-6 sm:p-12 md:p-20 relative border border-gray-200 dark:border-none">

        {/* --- TOP HEADER --- */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 border-b-4 border-black pb-12">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4 uppercase text-black"
              >
                {personalInfo.fullName}
              </motion.h1>
              <div className="text-xl sm:text-2xl font-medium text-gray-600 mb-8">{personalInfo.title}</div>

              {/* Contact Info - Separated clearly */}
              <div className="space-y-3 text-[12px] sm:text-[13px] font-semibold uppercase tracking-widest">
                {personalInfo.email && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail size={14} className="shrink-0 text-black" />
                    <span className="underline decoration-gray-300 underline-offset-4">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin size={14} className="shrink-0 text-black" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-6 pt-2">
                  {personalInfo.linkedInURL && (
                    <a href={personalInfo.linkedInURL} target="_blank" rel="noopener" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                      <Linkedin size={14} className="shrink-0" />LinkedIn
                    </a>
                  )}
                  {personalInfo.githubURL && (
                    <a href={personalInfo.githubURL} target="_blank" rel="noopener" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                      <Github size={14} className="shrink-0" />GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>

            {personalInfo.profilePhotoURL && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-44 md:h-44 grayscale contrast-[1.1] border-2 border-black p-1 shrink-0"
              >
                <img src={personalInfo.profilePhotoURL} alt={personalInfo.fullName} className="w-full h-full object-cover" />
              </motion.div>
            )}
          </div>
        </header>

        <main className="space-y-16">

          {/* --- SUMMARY --- */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-8">
              Professional Narrative
            </h2>
            <div className="text-base sm:text-lg leading-relaxed text-justify text-gray-700">
              {about.extendedBio}
            </div>
          </section>

          {/* --- EXPERIENCE --- */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-10">
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
                    <h3 className="text-xl sm:text-2xl font-bold text-black">{exp.jobTitle}</h3>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 rounded">{exp.dates}</span>
                  </div>
                  <div className="text-base sm:text-lg text-gray-600 mb-6">/ {exp.company}, {exp.location}</div>
                  <ul className="space-y-3">
                    {exp.responsibilities.map((r, idx) => (
                      <li key={idx} className="text-sm sm:text-[15px] leading-relaxed text-gray-700 flex gap-4">
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
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-8">
                Core Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {about.skills?.map((cat, i) => (
                  cat.tags?.map((tag, j) => (
                    <span key={`${i}-${j}`} className="text-[12px] font-bold uppercase tracking-wider text-black bg-white border border-black/10 px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-default">
                      {tag}
                    </span>
                  ))
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-8">
                Critical Projects
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {projects.slice(0, 3).map((p, i) => (
                  <div key={i} className="group">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                      <div className="font-black text-base sm:text-lg uppercase tracking-tighter text-black group-hover:text-gray-500 transition-colors break-words">{p.name}</div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase text-gray-500">{p.category}</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600 break-words">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* --- ACADEMIC & CERTIFICATIONS --- */}
          {((education && education.length > 0) || (certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
            <div className="mt-16 sm:mt-24 pt-10 sm:pt-16 border-t-2 border-gray-200 grid md:grid-cols-2 gap-10 sm:gap-16">
              {education && education.length > 0 && (
                <section>
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-6 sm:mb-8">
                    Academic History
                  </h2>
                  <div className="space-y-6 sm:space-y-8">
                    {education.map((edu, i) => (
                      <div key={i}>
                        <div className="text-[9px] sm:text-[10px] font-black uppercase text-gray-500 mb-1">{edu.startDate} - {edu.endDate}</div>
                        <h4 className="font-bold text-sm sm:text-base md:text-lg leading-tight uppercase text-black break-words hyphens-auto">{edu.degree}</h4>
                        <div className="text-xs sm:text-sm text-gray-600 break-words">{edu.institution}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="space-y-10 sm:space-y-16">
                {certifications && certifications.length > 0 && (
                  <section>
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-6 sm:mb-8">
                      Certifications
                    </h2>
                    <ul className="grid gap-3 sm:gap-4">
                      {certifications.map((cert, i) => (
                        <li key={i} className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-800 flex items-start gap-3">
                          <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 flex-shrink-0" />
                          <span className="break-words hyphens-auto">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {languages && languages.length > 0 && (
                  <section>
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-black border-l-4 border-black pl-4 mb-6 sm:mb-8">
                      Languages
                    </h2>
                    <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-4">
                      {languages.map((lang, i) => (
                        <div key={i}>
                          <div className="text-[9px] sm:text-[10px] font-black uppercase text-gray-500 mb-1">{lang.level || 'Expert'}</div>
                          <div className="text-base sm:text-lg font-bold uppercase text-black">{lang.name}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="mt-16 sm:mt-24 pt-8 sm:pt-10 border-t-2 border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-[9px] sm:text-[11px] inter font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-500">
          <div className="text-center md:text-left">References Available</div>
          <div className="text-center">© {new Date().getFullYear()} {personalInfo.fullName}</div>
          <div className="text-center md:text-right">Archive: {personalInfo.portfolioNameAbbr || 'CV'}.{new Date().getFullYear()}</div>
        </footer>

      </div>
    </div>
  );
}
