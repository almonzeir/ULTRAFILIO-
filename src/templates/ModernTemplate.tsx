/* GeneratedModernTemplateAllInOne.tsx
   Single-file, contrast-safe, premium portfolio using CSS color tokens (light/dark),
   Tailwind CDN, zero external icon deps, and your PortfolioData shape.
*/
import React from "react";
import type { PortfolioData } from "./types";

export default function ModernTemplate({ data }: { data: PortfolioData }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{data.personalInfo.fullName} – Portfolio</title>

        {/* Tailwind CDN (no project config needed) */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Color System: light/dark tokens (HSL) + base UI tweaks */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
:root {
  --bg-0: 0 0% 100%;
  --bg-1: 210 20% 98%;
  --bg-2: 210 16% 94%;
  --text-0: 222 34% 12%;
  --text-1: 220 11% 40%;
  --stroke: 220 15% 88%;
  --brand: 212 100% 56%;
  --brand-2: 225 92% 62%;
  --brand-contrast: 0 0% 100%;
  --ring: var(--brand);
}
html.dark {
  --bg-0: 222 40% 7%;
  --bg-1: 222 34% 11%;
  --bg-2: 222 30% 16%;
  --text-0: 210 30% 96%;
  --text-1: 214 18% 70%;
  --stroke: 220 22% 22%;
  --brand: 212 100% 60%;
  --brand-2: 225 92% 66%;
  --brand-contrast: 222 40% 7%;
}
:root, html.dark { color-scheme: light dark; }
* { scrollbar-width: thin; scrollbar-color: hsl(var(--brand)) hsl(var(--bg-2)); }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: hsl(var(--bg-2)); }
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, hsl(var(--brand)), hsl(var(--brand-2)));
  border-radius: 8px;
}
body { background: hsl(var(--bg-0)); color: hsl(var(--text-0)); }
a, button { outline: none; }
.container-max { max-width: 80rem; margin-inline: auto; padding-inline: 1rem; }
.glass { background: hsl(var(--bg-1) / 0.8); backdrop-filter: blur(12px); border: 1px solid hsl(var(--stroke)); box-shadow: 0 10px 28px rgba(0,0,0,.18); }
.chip { display:inline-flex; align-items:center; gap:.4rem; border:1px solid hsl(var(--stroke)); background:hsl(var(--bg-2)); color:hsl(var(--text-1)); border-radius:999px; padding:.25rem .65rem; font-size:.75rem; font-weight:600; }
.brand-glow { box-shadow: 0 0 0 4px hsl(var(--brand) / .18), 0 10px 30px hsl(var(--brand) / .22); }
.hero-mask { pointer-events:none; position:absolute; inset:0; -webkit-mask-image: radial-gradient(ellipse at center, black 35%, transparent 70%); mask-image: radial-gradient(ellipse at center, black 35%, transparent 70%); }
        `,
          }}
        />

        {/* Theme boot: respect saved or system */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    const saved = localStorage.getItem('theme');
    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved ? saved === 'dark' : prefers) document.documentElement.classList.add('dark');
  } catch(e){}
})();
        `,
          }}
        />
      </head>
      <body className="selection:bg-[hsl(var(--brand)/0.28)] selection:text-[hsl(var(--text-0))]">
        {/* Skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 rounded bg-[hsl(var(--text-0))] px-3 py-2 text-[hsl(var(--bg-0))]"
        >
          Skip to content
        </a>

        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-[hsl(var(--stroke))] bg-[hsl(var(--bg-0)/0.8)] backdrop-blur-md">
          <div className="container-max flex items-center justify-between py-4">
            <a
              href="#home"
              className="text-xl md:text-2xl font-black tracking-widest text-[hsl(var(--brand))] hover:opacity-90 focus:ring-2 focus:ring-[hsl(var(--ring))] rounded px-1"
              aria-label="Go to home"
            >
              {data.personalInfo.portfolioNameAbbr}
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {["home","about","experience","projects","contact"].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-sm font-medium text-[hsl(var(--text-1))] hover:text-[hsl(var(--text-0))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded px-1"
                >
                  {id[0].toUpperCase() + id.slice(1)}
                </a>
              ))}
              <button
                id="themeToggle"
                className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--stroke))] bg-[hsl(var(--bg-2))] px-3 py-2 text-sm text-[hsl(var(--text-0))] hover:bg-[hsl(var(--bg-1))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                onClick={() => {
                  const el = document.documentElement;
                  const dark = el.classList.toggle("dark");
                  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch(e){}
                  // swap icon
                  const sun = document.getElementById("icon-sun");
                  const moon = document.getElementById("icon-moon");
                  if (sun && moon) { sun.style.display = dark ? "inline" : "none"; moon.style.display = dark ? "none" : "inline"; }
                }}
              >
                <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{display: "none"}}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>
                <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                <span className="hidden sm:inline">Theme</span>
              </button>
            </nav>

            {/* mobile menu (simple) */}
            <details className="md:hidden relative">
              <summary className="list-none rounded p-2 hover:bg-[hsl(var(--bg-2))] focus:ring-2 focus:ring-[hsl(var(--ring))]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[hsl(var(--text-0))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-xl glass p-2">
                {["home","about","experience","projects","contact"].map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block rounded-lg px-3 py-2 text-[hsl(var(--text-0))] hover:bg-[hsl(var(--bg-2))]"
                  >
                    {id[0].toUpperCase() + id.slice(1)}
                  </a>
                ))}
                <button
                  className="mt-1 w-full rounded-lg border border-[hsl(var(--stroke))] bg-[hsl(var(--bg-2))] px-3 py-2 text-left text-[hsl(var(--text-0))] hover:bg-[hsl(var(--bg-1))]"
                  onClick={() => (document.getElementById("themeToggle") as HTMLButtonElement)?.click()}
                >
                  Toggle Theme
                </button>
              </div>
            </details>
          </div>
        </header>

        <main id="main" className="container-max">
          {/* HERO */}
          <section id="home" className="relative min-h-[86vh] py-20 sm:py-24 overflow-hidden">
            <div className="hero-mask">
              <div className="absolute -top-24 -left-32 h-72 w-72 rounded-full bg-[hsl(var(--brand)/0.18)] blur-3xl" />
              <div className="absolute -bottom-20 -right-16 h-[20rem] w-[20rem] rounded-full bg-[hsl(var(--brand-2)/0.16)] blur-3xl" />
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-12">
              <div className="order-2 md:order-1 text-center md:text-left">
                <span className="chip mx-auto md:mx-0">
                  {/* sparkles icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[hsl(var(--brand))]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"/><path d="M5 16l.8 1.7L7.5 18l-1.7.8L5 20.5l-.8-1.7L2.5 18l1.7-.3L5 16z"/><path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/></svg>
                  Elevating Digital Experiences
                </span>

                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05]">
                  Hi, I’m{" "}
                  <span className="relative text-[hsl(var(--brand))]">
                    {data.personalInfo.fullName}
                    <span className="absolute -inset-x-1 -bottom-1 -z-10 block h-3 bg-[hsl(var(--brand)/0.2)] blur-sm" />
                  </span>
                </h1>
                <h2 className="mt-3 text-xl sm:text-2xl font-semibold text-[hsl(var(--text-1))]">
                  {data.personalInfo.title}
                </h2>
                <p className="mt-4 text-[hsl(var(--text-1))] max-w-xl mx-auto md:mx-0">{data.personalInfo.tagline}</p>

                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                  <a
                    href="#projects"
                    className="inline-flex items-center rounded-xl bg-[hsl(var(--brand))] px-5 py-3 font-semibold text-[hsl(var(--brand-contrast))] hover:opacity-95 brand-glow focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  >
                    {/* layers icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l9 4.5-9 4.5L3 6.5 12 2z"/><path d="M21 11l-9 4.5L3 11"/><path d="M21 16l-9 4.5L3 16"/></svg>
                    View My Work
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center rounded-xl border border-[hsl(var(--stroke))] bg-[hsl(var(--bg-1))] px-5 py-3 font-medium text-[hsl(var(--text-0))] hover:bg-[hsl(var(--bg-2))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  >
                    {/* mail icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-[hsl(var(--brand))]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
                    Get in Touch
                  </a>
                </div>
              </div>

              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-[conic-gradient(from_210deg, hsl(var(--brand)/.55), hsl(var(--brand-2)/.55))] blur-xl" />
                  <img
                    src={data.personalInfo.profilePhotoURL}
                    alt={`Portrait of ${data.personalInfo.fullName}`}
                    className="relative z-10 h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full object-cover ring-4 ring-[hsl(var(--stroke))]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="py-20 sm:py-24">
            <SectionTitle>About Me</SectionTitle>
            <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-[hsl(var(--text-1))]">
              {data.about.extendedBio}
            </p>

            {/* Stats */}
            {data.about.stats?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {data.about.stats.map((s, i) => (
                  <div key={i} className="glass rounded-2xl p-6 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--bg-2))]">
                      <Icon name={s.icon} />
                    </div>
                    <div className="text-3xl font-extrabold">{s.value}</div>
                    <div className="mt-1 text-xs text-[hsl(var(--text-1))]">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {data.about.skills?.length > 0 && (
              <div className="mt-16 grid gap-6 md:grid-cols-3">
                {data.about.skills.map((cat, i) => (
                  <div key={i} className="glass rounded-2xl p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Icon name={cat.icon} />
                      <h3 className="text-lg font-semibold">{cat.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.tags.map((t, j) => (
                        <span key={j} className="chip">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* EXPERIENCE */}
          <section id="experience" className="py-20 sm:py-24">
            <SectionTitle>Work Experience</SectionTitle>
            <p className="text-center text-[hsl(var(--text-1))] mb-10">Where I’ve applied my skills and grown professionally</p>
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-[hsl(var(--stroke))] sm:left-1/2 sm:-translate-x-1/2" />
              <div className="grid gap-10">
                {data.experience.map((exp, idx) => (
                  <ExperienceItem key={idx} exp={exp} even={idx % 2 === 0} />
                ))}
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section id="projects" className="py-20 sm:py-24">
            <SectionTitle>Featured Projects</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.projects.map((p, i) => (
                <ProjectCard key={i} project={p} />
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="py-20 sm:py-24">
            <SectionTitle>Ready to Collaborate?</SectionTitle>
            <p className="mx-auto mb-12 max-w-xl text-center text-[hsl(var(--text-1))]">
              I’m currently seeking new opportunities and projects. Let’s build something amazing together.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Details */}
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6 text-center md:text-left">Contact Details</h3>
                <ul className="grid gap-3">
                  <li className="flex items-center rounded-lg bg-[hsl(var(--bg-2))] p-4">
                    <Icon name="mail" className="mr-3 h-5 w-5 text-[hsl(var(--brand))]" />
                    <div>
                      <div className="text-xs text-[hsl(var(--text-1))]">Email</div>
                      <a className="font-medium hover:underline" href={`mailto:${data.personalInfo.email}`}>
                        {data.personalInfo.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center rounded-lg bg-[hsl(var(--bg-2))] p-4">
                    <Icon name="linkedin" className="mr-3 h-5 w-5 text-[hsl(var(--brand))]" />
                    <div>
                      <div className="text-xs text-[hsl(var(--text-1))]">LinkedIn</div>
                      <a className="font-medium hover:underline break-all" href={data.personalInfo.linkedInURL} target="_blank" rel="noreferrer">
                        {data.personalInfo.linkedInURL}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center rounded-lg bg-[hsl(var(--bg-2))] p-4">
                    <Icon name="map" className="mr-3 h-5 w-5 text-[hsl(var(--brand))]" />
                    <div>
                      <div className="text-xs text-[hsl(var(--text-1))]">Location</div>
                      <div className="font-medium">{data.personalInfo.location}</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Form */}
              <form
                className="glass rounded-2xl p-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks! Your message has been queued.");
                }}
              >
                <h3 className="text-xl font-bold mb-6 text-center md:text-left">Send a Quick Message</h3>
                <div className="grid gap-4">
                  <Field id="name" label="Name">
                    <input
                      id="name" name="name" required
                      className="w-full rounded-lg border border-[hsl(var(--stroke))] bg-[hsl(var(--bg-2))] px-3 py-2 text-[hsl(var(--text-0))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      placeholder="Your Name"
                    />
                  </Field>
                  <Field id="email" label="Email">
                    <input
                      id="email" name="email" type="email" required
                      className="w-full rounded-lg border border-[hsl(var(--stroke))] bg-[hsl(var(--bg-2))] px-3 py-2 text-[hsl(var(--text-0))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      placeholder="your.email@example.com"
                    />
                  </Field>
                  <Field id="message" label="Message">
                    <textarea
                      id="message" name="message" rows={5} required
                      className="w-full rounded-lg border border-[hsl(var(--stroke))] bg-[hsl(var(--bg-2))] px-3 py-2 text-[hsl(var(--text-0))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      placeholder="Your inquiry…"
                    />
                  </Field>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-[hsl(var(--brand))] px-5 py-3 font-semibold text-[hsl(var(--brand-contrast))] hover:opacity-95 brand-glow focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  >
                    <Icon name="send" className="mr-2 h-5 w-5" /> Send Message
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>

        <footer className="mt-14 border-t border-[hsl(var(--stroke))]">
          <div className="container-max py-6 text-center text-sm text-[hsl(var(--text-1))]">
            © {new Date().getFullYear()} {data.personalInfo.fullName}. Built with <span className="text-[hsl(var(--brand))]">passion</span>.
          </div>
        </footer>
      </body>
    </html>
  );
}

/* ---------- tiny helpers (inline, no deps) ---------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-12">
      <h2 className="inline-block text-3xl sm:text-4xl font-extrabold tracking-tight relative pb-3">
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-20 rounded bg-[hsl(var(--brand))] shadow-[0_0_10px_hsl(var(--brand)/.65)]"
        />
      </h2>
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="grid gap-1 text-sm">
      <span className="text-[hsl(var(--text-0))]">{label}</span>
      {children}
    </label>
  );
}

function Icon({ name, className }: { name?: string; className?: string }) {
  const cls = `h-5 w-5 ${className || ""}`;
  switch (name) {
    case "mail":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>;
    case "linkedin":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.2 2.3-2.46 4.73-2.46 5.06 0 5.99 3.33 5.99 7.65V24H18V16.2c0-1.86-.03-4.25-2.59-4.25-2.59 0-2.99 2.02-2.99 4.12V24H7.5V8z"/></svg>;
    case "map":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 20l-5 2V6l5-2 6 2 5-2v16l-5 2-6-2z"/><path d="M9 4v16M15 6v16"/></svg>;
    case "send":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case "factory":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18V10l-6 3V9l-6 3V7L3 9v12z"/></svg>;
    default:
      // sparkles
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"/></svg>;
  }
}

function ExperienceItem({
  exp,
  even,
}: {
  exp: {
    dates: string;
    location: string;
    jobTitle: string;
    company: string;
    responsibilities: string[];
    tags: string[];
  };
  even: boolean;
}) {
  return (
    <div className={`relative sm:grid sm:grid-cols-2 sm:gap-10`}>
      <div
        aria-hidden
        className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-2 h-3 w-3 rounded-full bg-brand ring-4 ring-bg-0 shadow-lg"
      />
      <div className={`${even ? "sm:pr-12" : "sm:order-2 sm:pl-12"}`}>
        <article className="glass rounded-2xl p-6 transition-transform hover:-translate-y-0.5">
          <p className="mb-1 text-xs text-text-1">
            {exp.dates} • {exp.location}
          </p>
          <h3 className="text-lg font-semibold text-brand">{exp.jobTitle}</h3>
          <p className="mb-3 text-sm text-text-1 flex items-center gap-1">
            <Icon name="factory" /> {exp.company}
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {exp.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          {!!exp.tags?.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {exp.tags.map((t, i) => (
                <span key={i} className="chip">{t}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: {
    imageURL: string;
    name: string;
    category: string;
    description: string;
    tags: string[];
    detailsURL: string;
  };
}) {
  return (
    <a
      href={project.detailsURL}
      className="glass group block overflow-hidden rounded-2xl focus:ring-2 focus:ring-[hsl(var(--ring))]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.imageURL}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg-0)/0.5)] via-[hsl(var(--bg-0)/0.1)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-6">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--brand))]">
          {project.category}
        </div>
        <h3 className="mt-1 text-lg font-bold">{project.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-[hsl(var(--text-1))]">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((t, i) => (
            <span key={i} className="chip">{t}</span>
          ))}
        </div>
        <div className="mt-5 inline-flex items-center text-[hsl(var(--brand))]">
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </a>
  );
}