
'use client';

import React from 'react';
import type { PortfolioData } from './types';
import { Mail, Linkedin, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
      {children}
    </h2>
  </div>
);

export default function GeneratedModernTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, about, experience, projects, education } = data;

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'projects'];
      const navLinks = document.querySelectorAll('nav a');
      let currentSection = '';

      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section && window.scrollY >= section.offsetTop - 150) {
          currentSection = sectionId;
        }
      });

      navLinks.forEach(link => {
        const indicator = link.querySelector('.nav-indicator');
        const text = link.querySelector('.nav-text');
        if (link.getAttribute('href') === `#${currentSection}`) {
          indicator?.classList.add('w-16', 'bg-primary');
          indicator?.classList.remove('w-8', 'bg-border');
          text?.classList.add('text-foreground');
          text?.classList.remove('text-muted-foreground');
        } else {
          indicator?.classList.add('w-8', 'bg-border');
          indicator?.classList.remove('w-16', 'bg-primary');
          text?.classList.add('text-muted-foreground');
          text?.classList.remove('text-foreground');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-inter md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-16">
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-5/12 lg:flex-col lg:justify-between lg:py-24">
            <div>
              {personalInfo.profilePhotoURL && (
                 <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-primary/20 shadow-lg">
                    <Image src={personalInfo.profilePhotoURL} alt={personalInfo.fullName} fill className="object-cover"/>
                 </div>
              )}
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {personalInfo.fullName}
              </h1>
              <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground sm:text-xl">
                {personalInfo.title}
              </h2>
              <p className="mt-4 max-w-xs leading-normal text-muted-foreground">
                {personalInfo.tagline}
              </p>
              <nav className="hidden lg:block" aria-label="In-page navigation">
                <ul className="mt-16 w-max space-y-4">
                  <li><a className="group flex items-center py-3" href="#about"><span className="nav-indicator mr-4 h-px w-8 bg-border transition-all group-hover:w-16 group-hover:bg-primary motion-reduce:transition-none"></span><span className="nav-text text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">About</span></a></li>
                  <li><a className="group flex items-center py-3" href="#experience"><span className="nav-indicator mr-4 h-px w-8 bg-border transition-all group-hover:w-16 group-hover:bg-primary motion-reduce:transition-none"></span><span className="nav-text text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Experience</span></a></li>
                  <li><a className="group flex items-center py-3" href="#projects"><span className="nav-indicator mr-4 h-px w-8 bg-border transition-all group-hover:w-16 group-hover:bg-primary motion-reduce:transition-none"></span><span className="nav-text text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Projects</span></a></li>
                </ul>
              </nav>
            </div>
            <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
              {personalInfo.email && (
                <li className="mr-5 shrink-0">
                  <a className="block text-muted-foreground hover:text-foreground" href={`mailto:${personalInfo.email}`} target="_blank" rel="noreferrer noopener" aria-label="Email">
                    <span className="sr-only">Email</span>
                    <Mail className="h-6 w-6" />
                  </a>
                </li>
              )}
              {personalInfo.linkedInURL && (
                <li className="mr-5 shrink-0">
                  <a className="block text-muted-foreground hover:text-foreground" href={personalInfo.linkedInURL} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
                    <span className="sr-only">LinkedIn</span>
                    <Linkedin className="h-6 w-6" />
                  </a>
                </li>
              )}
            </ul>
          </header>

          <main id="content" className="pt-24 lg:w-7/12 lg:py-24">
            <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="About me">
              <SectionTitle>About</SectionTitle>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{about.extendedBio}</p>
              </div>
               {about.skills && about.skills.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {about.skills.flatMap(s => s.tags).map((tag, i) => (
                           <div key={i} className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium leading-5 text-primary">
                             {tag}
                           </div>
                        ))}
                    </div>
                </div>
               )}
            </section>

            <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Work experience">
              <SectionTitle>Experience</SectionTitle>
              <ol className="group/list">
                {experience.map((exp, i) => (
                  <li key={i} className="mb-12">
                    <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block lg:group-hover:bg-card/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                      <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:col-span-2" aria-label={exp.dates}>{exp.dates}</header>
                      <div className="z-10 sm:col-span-6">
                        <h3 className="font-medium leading-snug text-foreground">
                          <div>
                            <span className="inline-flex items-baseline font-medium leading-tight text-foreground group/link text-base">
                              <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:block"></span>
                              <span>{exp.jobTitle} · <span className="inline-block font-normal text-muted-foreground">{exp.company}</span></span>
                            </span>
                          </div>
                        </h3>
                        <div className="text-muted-foreground mt-2 text-sm" dangerouslySetInnerHTML={{ __html: exp.responsibilities.map(r => `<p>${r}</p>`).join('') }} />
                        {exp.tags && exp.tags.length > 0 && (
                          <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                              {exp.tags.map((tag, j) => (
                                <li key={j} className="mr-1.5 mt-2">
                                  <div className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium leading-5 text-primary">{tag}</div>
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Selected projects">
              <SectionTitle>Projects</SectionTitle>
               <ul className="group/list">
                {projects.map((project, i) => (
                    <li key={i} className="mb-12">
                        <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                            <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block lg:group-hover:bg-card/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                            <div className="z-10 sm:order-2 sm:col-span-6">
                                <h3>
                                    <a className="inline-flex items-baseline font-medium leading-tight text-foreground hover:text-primary focus-visible:text-primary group/link text-base" href={project.detailsURL} target="_blank" rel="noreferrer noopener" aria-label={`${project.name} (opens in a new tab)`}>
                                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:block"></span>
                                        <span>{project.name} <ExternalLink className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" /></span>
                                    </a>
                                </h3>
                                <p className="mt-2 text-sm leading-normal text-muted-foreground">{project.description}</p>
                                {project.tags && project.tags.length > 0 && (
                                  <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                                      {project.tags.map((tag, j) => (
                                        <li key={j} className="mr-1.5 mt-2">
                                            <div className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium leading-5 text-primary">{tag}</div>
                                        </li>
                                      ))}
                                  </ul>
                                )}
                            </div>
                            <Image src={project.imageURL} alt={project.name} className="rounded border-2 border-border/10 transition group-hover:border-border/30 sm:order-1 sm:col-span-2 sm:translate-y-1" width={200} height={48} style={{objectFit: "cover", width:"100%", height: "auto", aspectRatio: "16/10"}} loading="lazy" />
                        </div>
                    </li>
                ))}
               </ul>
            </section>
            
            <footer className="max-w-md pb-16 text-sm text-muted-foreground sm:pb-0">
                <p>
                    Coded in <a href="https://code.visualstudio.com/" className="font-medium text-foreground hover:text-primary focus-visible:text-primary" target="_blank" rel="noreferrer">Visual Studio Code</a>.
                    Built with <a href="https://nextjs.org/" className="font-medium text-foreground hover:text-primary focus-visible:text-primary" target="_blank" rel="noreferrer">Next.js</a> and <a href="https://tailwindcss.com/" className="font-medium text-foreground hover:text-primary focus-visible:text-primary" target="_blank" rel="noreferrer">Tailwind CSS</a>, 
                    deployed with <a href="https://firebase.google.com/" className="font-medium text-foreground hover:text-primary focus-visible:text-primary" target="_blank" rel="noreferrer">Firebase</a>. 
                    All text is set in the <a href="https://rsms.me/inter/" className="font-medium text-foreground hover:text-primary focus-visible:text-primary" target="_blank" rel="noreferrer">Inter</a> typeface.
                </p>
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
}

    