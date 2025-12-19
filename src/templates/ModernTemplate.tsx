/* ModernTemplate.tsx - Stunning 'Glass & Glow' Framer Motion Redesign */
import React from "react";
import type { PortfolioData } from "./types";
import { MapPin, Mail, Building2, Zap, User, ArrowUpRight, Github, Linkedin, ExternalLink, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ModernTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, about, experience, projects } = data;

  const consolidatedSkills = React.useMemo(() => {
    if (!about.skills) return [];
    const groups: Record<string, { category: string, icon?: string, tags: Set<string> }> = {};
    about.skills.forEach(skill => {
      const key = skill.category || 'General';
      if (!groups[key]) {
        groups[key] = { category: key, icon: skill.icon, tags: new Set() };
      }
      skill.tags.forEach(t => groups[key].tags.add(t));
    });
    return Object.values(groups).map(g => ({ ...g, tags: Array.from(g.tags) }));
  }, [about.skills]);

  return (
    <div className="font-sans antialiased text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#020205] min-h-screen selection:bg-brand selection:text-white">
      <style>{`
        :root {
          --glass-border: rgba(255, 255, 255, 0.1);
          --glass-bg: rgba(255, 255, 255, 0.03);
          --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
        }
        .dark {
          --glass-border: rgba(255, 255, 255, 0.05);
          --glass-bg: rgba(0, 0, 0, 0.4);
        }
        html { scroll-behavior: smooth; }
        .glass-panel {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-image: linear-gradient(135deg, hsl(var(--brand)), hsl(var(--brand-2)));
        }
        .bg-gradient-brand {
          background-image: linear-gradient(135deg, hsl(var(--brand)), hsl(var(--brand-2)));
        }
        .blob {
          position: absolute;
          filter: blur(100px);
          z-index: 0;
          opacity: 0.3;
        }
      `}</style>

      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="blob bg-[hsl(var(--brand))] w-[500px] h-[500px] rounded-full -top-48 -left-48"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="blob bg-[hsl(var(--brand-2))] w-[400px] h-[400px] rounded-full -bottom-24 -right-24"
        />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <motion.a
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            href="#"
            className="text-2xl font-black tracking-tighter"
          >
            <span className="text-gradient pl-1">{personalInfo.portfolioNameAbbr}</span>
          </motion.a>

          <div className="hidden md:flex items-center space-x-10">
            {['About', 'Experience', 'Projects'].map((item, i) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-foreground transition-colors"
              >
                {item}
              </motion.a>
            ))}
            <motion.a
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              href="#contact"
              className="px-6 py-3 rounded-2xl bg-gradient-brand text-white text-sm font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all"
            >
              Contact
            </motion.a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative z-10 pt-40 pb-20 lg:pt-60 lg:pb-40 px-6 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Interactive Spotlight */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div
            className="absolute w-[600px] h-[600px] bg-[hsl(var(--brand))]/10 rounded-full blur-[120px]"
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[hsl(var(--brand))] text-xs font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              Available for Excellence
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8"
            >
              I&apos;m <span className="text-gradient">{personalInfo.fullName}</span> <br />
              Designing the Future.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              {personalInfo.tagline}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mb-16"
            >
              <a href="#projects" className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Explore Projects
              </a>
              <a href={personalInfo.githubURL || '#'} target="_blank" className="w-full sm:w-auto px-10 py-5 rounded-3xl glass-panel text-slate-900 dark:text-white font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Github className="w-6 h-6" />
                GitHub
              </a>
            </motion.div>


          </motion.div>

          {/* Hero Image with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05 }}
            className="relative w-full max-w-sm lg:max-w-md flex justify-center perspective-[1000px]"
          >
            <div className="absolute inset-0 bg-gradient-brand rounded-[3rem] rotate-6 opacity-30 blur-3xl animate-pulse" />
            <motion.div
              className="relative w-80 h-80 sm:w-96 sm:h-96 group"
              whileHover={{ rotateY: 15, rotateX: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute -inset-1 rounded-[3rem] bg-gradient-brand opacity-50 blur-sm group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden border-2 border-white/20 shadow-2xl glass-panel z-10">
                {personalInfo.profilePhotoURL ? (
                  <img src={personalInfo.profilePhotoURL} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={personalInfo.fullName} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900"><User size={80} className="text-white/20" /></div>
                )}
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 z-20 bg-white dark:bg-black p-4 rounded-2xl shadow-2xl border border-white/10 glass-panel"
              >
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold font-mono">LIVE_NODE</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section id="about" className="relative z-10 py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHeader title="About" subtitle="Crafting digital experiences with precision" />
          <div className="grid lg:grid-cols-2 gap-16 mt-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-brand opacity-5 blur-3xl group-hover:opacity-20 transition-opacity" />
              <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-medium italic">
                "{about.extendedBio}"
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <span className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest text-slate-500">
                  <MapPin className="w-4 h-4 text-[hsl(var(--brand))]" /> {personalInfo.location || 'Global'}
                </span>
                <span className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest text-slate-500">
                  <Mail className="w-4 h-4 text-[hsl(var(--brand))]" /> {personalInfo.email}
                </span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {consolidatedSkills.map((group, i) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-panel p-8 rounded-3xl hover:border-[hsl(var(--brand)/0.5)] transition-all group"
                >
                  <h3 className="text-lg font-black uppercase tracking-widest mb-5 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[hsl(var(--brand))] rounded-full" />
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-slate-400 group-hover:text-foreground transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS --- */}
      <section id="projects" className="relative z-10 py-32 bg-black/20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[hsl(var(--brand))] opacity-[0.02] blur-[150px] -z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center sm:text-left">
          <SectionHeader title="Projects" subtitle="Featured highlights of my recent work" />
          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, i) => (
              <motion.a
                key={project.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                href={project.detailsURL}
                target="_blank"
                className="group relative rounded-[2.5rem] overflow-hidden glass-panel flex flex-col hover:scale-[1.02] transition-transform duration-500 shadow-2xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  {project.imageURL ? (
                    <img src={project.imageURL} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={project.name} />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white/5 font-black text-4xl">PROJ_{i + 1}</div>
                  )}
                  <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black mb-3 group-hover:text-gradient transition-all">{project.name}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5 px-2 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE --- */}
      <section id="experience" className="relative z-10 py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <SectionHeader title="Experience" subtitle="Professional journey and core impact" />
          <div className="mt-20 space-y-12">
            {experience.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-12 group"
              >
                <div className="absolute left-0 top-1.5 w-1 h-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    transition={{ duration: 1 }}
                    className="w-full bg-gradient-brand"
                  />
                </div>
                <div className="absolute left-[-6px] top-1.5 w-4 h-4 rounded-full border-4 border-slate-50 dark:border-[#020205] bg-slate-300 dark:bg-white/20 group-hover:bg-[hsl(var(--brand))] transition-colors" />

                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 gap-2">
                  <div>
                    <h3 className="text-2xl font-black">{job.jobTitle}</h3>
                    <p className="text-[hsl(var(--brand))] font-bold tracking-widest uppercase text-sm">{job.company}</p>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full">{job.dates}</span>
                </div>
                <ul className="space-y-4">
                  {job.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex items-start gap-4">
                      <div className="w-1 h-1 rounded-full bg-[hsl(var(--brand))] mt-2 shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <footer id="contact" className="relative z-10 py-40 px-6 sm:px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-16 sm:p-24 rounded-[4rem] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-brand opacity-[0.03] -z-10" />
            <h2 className="text-4xl sm:text-7xl font-black tracking-tight mb-8">
              Let&apos;s create something <br />
              <span className="text-gradient">extraordinary.</span>
            </h2>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
              Now accepting new projects. Let&apos;s bring your vision to life with precision and style.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href={`mailto:${personalInfo.email}`} className="px-12 py-5 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Start a Project
              </a>
              <a href={personalInfo.linkedInURL || '#'} className="px-12 py-5 rounded-[2rem] glass-panel text-foreground font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Linkedin size={24} />
                LinkedIn
              </a>
            </div>
          </motion.div>
          <div className="mt-20 text-xs font-black uppercase tracking-widest text-slate-500 opacity-50">
            © {new Date().getFullYear()} {personalInfo.fullName} • Crafted for the bold.
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-xl"
    >
      <div className="text-[hsl(var(--brand))] text-xs font-black uppercase tracking-[0.4em] mb-4">Section_{title.toLowerCase()}</div>
      <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4">{title}</h2>
      <p className="text-lg text-slate-500 font-medium">{subtitle}</p>
    </motion.div>
  );
}
