/* BasicTemplate.tsx - ATS-Ready Professional Resume Template */
import React from 'react';
import type { PortfolioData } from './types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

export default function BasicTemplate({ data, isDarkMode, colorTheme }: { data: PortfolioData; isDarkMode?: boolean; colorTheme?: string }) {
  const { personalInfo, about, experience, projects, education = [], certifications = [], languages = [] } = data;

  // Flatten all skills into a simple array for ATS
  const allSkills = about.skills?.flatMap(cat => cat.tags || []) || [];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-gray-900'} print:bg-white print:text-black`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .ats-resume {
          font-family: 'Inter', Arial, Helvetica, sans-serif;
          line-height: 1.5;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; background: white !important; }
          .ats-resume { color: black !important; background: white !important; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }

        /* ATS-friendly: ensure all text is selectable */
        .ats-resume * {
          -webkit-user-select: text;
          user-select: text;
        }
      `}</style>

      <div className="ats-resume max-w-[8.5in] mx-auto p-6 sm:p-8 md:p-12 print:p-8">

        {/* ===== HEADER / CONTACT INFO ===== */}
        <header className="mb-8 pb-6 border-b-2 border-current">
          {/* Name - H1 for ATS */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
            {personalInfo.fullName}
          </h1>

          {/* Title */}
          <p className="text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-400 mb-4">
            {personalInfo.title}
          </p>

          {/* Contact Info - Single line for ATS readability */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:underline">
                <Mail size={14} className="shrink-0" />
                <span>{personalInfo.email}</span>
              </a>
            )}
            {personalInfo.phone && (
              <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 hover:underline">
                <Phone size={14} className="shrink-0" />
                <span>{personalInfo.phone}</span>
              </a>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0" />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedInURL && (
              <a href={personalInfo.linkedInURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <Linkedin size={14} className="shrink-0" />
                <span>LinkedIn</span>
              </a>
            )}
            {personalInfo.githubURL && (
              <a href={personalInfo.githubURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <Github size={14} className="shrink-0" />
                <span>GitHub</span>
              </a>
            )}
            {personalInfo.website && (
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <Globe size={14} className="shrink-0" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </header>

        <main className="space-y-8">

          {/* ===== SUMMARY ===== */}
          {about.extendedBio && (
            <section aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="text-lg font-bold uppercase tracking-wide mb-3 border-b border-gray-300 dark:border-gray-600 pb-1">
                Summary
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                {about.extendedBio}
              </p>
            </section>
          )}

          {/* ===== EXPERIENCE ===== */}
          {experience && experience.length > 0 && (
            <section aria-labelledby="experience-heading">
              <h2 id="experience-heading" className="text-lg font-bold uppercase tracking-wide mb-4 border-b border-gray-300 dark:border-gray-600 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, i) => (
                  <article key={i} className="relative">
                    {/* Job Title + Company on same line for ATS */}
                    <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-semibold">
                        {exp.jobTitle}
                      </h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.dates}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </p>

                    {/* Responsibilities as bullet list - ATS standard */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                        {exp.responsibilities.map((r, idx) => (
                          <li key={idx} className="pl-1">
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ===== EDUCATION ===== */}
          {education && education.length > 0 && (
            <section aria-labelledby="education-heading">
              <h2 id="education-heading" className="text-lg font-bold uppercase tracking-wide mb-4 border-b border-gray-300 dark:border-gray-600 pb-1">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap justify-between items-baseline gap-2">
                      <h3 className="text-base font-semibold">{edu.degree}</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {edu.institution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== SKILLS ===== */}
          {allSkills.length > 0 && (
            <section aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="text-lg font-bold uppercase tracking-wide mb-3 border-b border-gray-300 dark:border-gray-600 pb-1">
                Skills
              </h2>
              {/* Skills as comma-separated list - best for ATS parsing */}
              <p className="text-sm">
                {allSkills.join(' • ')}
              </p>
            </section>
          )}

          {/* ===== PROJECTS ===== */}
          {projects && projects.length > 0 && (
            <section aria-labelledby="projects-heading">
              <h2 id="projects-heading" className="text-lg font-bold uppercase tracking-wide mb-4 border-b border-gray-300 dark:border-gray-600 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap justify-between items-baseline gap-2">
                      <h3 className="text-base font-semibold">{p.name}</h3>
                      {p.tags && p.tags.length > 0 && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {p.tags.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {p.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== CERTIFICATIONS ===== */}
          {certifications && certifications.length > 0 && (
            <section aria-labelledby="certifications-heading">
              <h2 id="certifications-heading" className="text-lg font-bold uppercase tracking-wide mb-3 border-b border-gray-300 dark:border-gray-600 pb-1">
                Certifications
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                {certifications.map((cert, i) => (
                  <li key={i} className="pl-1">{cert}</li>
                ))}
              </ul>
            </section>
          )}

          {/* ===== LANGUAGES ===== */}
          {languages && languages.length > 0 && (
            <section aria-labelledby="languages-heading">
              <h2 id="languages-heading" className="text-lg font-bold uppercase tracking-wide mb-3 border-b border-gray-300 dark:border-gray-600 pb-1">
                Languages
              </h2>
              <p className="text-sm">
                {languages.map(l => `${l.name}${l.level ? ` (${l.level})` : ''}`).join(' • ')}
              </p>
            </section>
          )}

        </main>

      </div>
    </div>
  );
}
