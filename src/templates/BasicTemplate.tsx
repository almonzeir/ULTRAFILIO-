/* BasicTemplate.tsx - Classic / Traditional / Print-Friendly */
import React from 'react';
import type { PortfolioData } from './types';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function BasicTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, about, experience, projects } = data;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8 print:p-0 print:bg-white text-slate-900 font-serif leading-relaxed">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Open+Sans:wght@400;600;700&display=swap');
        
        :root {
          --font-serif: 'Merriweather', serif;
          --font-sans: 'Open Sans', sans-serif;
        }

        body { font-family: var(--font-serif); }
        h1, h2, h3, h4, .sans { font-family: var(--font-sans); }
        
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
        }
      `}</style>

      <div className="max-w-[21cm] mx-auto bg-white shadow-xl print:shadow-none min-h-[29.7cm] p-12 sm:p-16 relative">

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-[hsl(var(--brand))] print:bg-[hsl(var(--brand))]"></div>

        {/* HEADER */}
        <header className="border-b-2 border-slate-800 pb-8 mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2 uppercase">{personalInfo.fullName}</h1>
            <div className="text-lg font-serif italic text-slate-600 mb-4">{personalInfo.title}</div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm sans text-slate-600">
              {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} />{personalInfo.email}</div>}
              {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} />{personalInfo.phone}</div>}
              {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={14} />{personalInfo.location}</div>}
            </div>
          </div>

          {personalInfo.profilePhotoURL && (
            <div className="w-24 h-24 sm:w-32 sm:h-32 border border-slate-200 p-1 bg-white shrink-0">
              <img src={personalInfo.profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 gap-12">

          {/* SUMMARY */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[hsl(var(--brand))] border-b border-slate-200 pb-2 mb-4 sans">
              Professional Profile
            </h2>
            <p className="text-slate-700 leading-7 text-justify">
              {about.extendedBio}
            </p>
          </section>

          {/* EXPERIENCE */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[hsl(var(--brand))] border-b border-slate-200 pb-2 mb-6 sans">
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp, i) => (
                <article key={i}>
                  <div className="flex justify-between items-baseline mb-1 font-sans">
                    <h3 className="font-bold text-lg text-slate-900">{exp.jobTitle}</h3>
                    <span className="text-sm font-semibold text-slate-500">{exp.dates}</span>
                  </div>
                  <div className="text-slate-700 italic mb-2 font-serif">{exp.company}, {exp.location}</div>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 ml-2 marker:text-[hsl(var(--brand))]">
                    {exp.responsibilities.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <div className="grid sm:grid-cols-2 gap-12">
            {/* EDUCATION (Mocked from existing data if available, or static structure) */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[hsl(var(--brand))] border-b border-slate-200 pb-2 mb-4 sans">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 text-sm">
                {about.skills?.map((cat, i) => (
                  cat.tags?.map((tag, j) => (
                    <span key={`${i}-${j}`} className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-sans border border-slate-200">
                      {tag}
                    </span>
                  ))
                ))}
              </div>
            </section>

            {/* PROJECTS (Simplified) */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[hsl(var(--brand))] border-b border-slate-200 pb-2 mb-4 sans">
                Key Projects
              </h2>
              <ul className="space-y-4">
                {projects.slice(0, 3).map((p, i) => (
                  <li key={i}>
                    <div className="font-bold font-sans text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500 mb-1 font-sans uppercase">{p.category}</div>
                    <p className="text-sm text-slate-700 line-clamp-2">{p.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

        </main>

        <footer className="mt-16 text-center text-xs text-slate-400 font-sans pt-8 border-t double border-slate-200">
          References available upon request • {personalInfo.linkedInURL}
        </footer>

      </div>
    </div>
  );
}
