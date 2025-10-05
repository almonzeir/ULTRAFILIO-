'use client';

import React, { useEffect } from 'react';
import type { PortfolioData } from './types';
import Image from 'next/image';
import {
  Sparkles,
  Layers,
  Mail,
  TrendingUp,
  CheckCircle,
  Code,
  Globe,
  Laptop2,
  Server,
  Settings,
  Factory,
  ArrowRight,
  MapPin,
  Linkedin,
  Send,
  Menu,
} from 'lucide-react';

// A generic Icon component to handle different icon names
const Icon = ({ name, ...props }: { name: string;[key: string]: any }) => {
  switch (name) {
    case 'trending-up': return <TrendingUp {...props} />;
    case 'check-circle': return <CheckCircle {...props} />;
    case 'code': return <Code {...props} />;
    case 'globe': return <Globe {...props} />;
    case 'laptop-2': return <Laptop2 {...props} />;
    case 'server': return <Server {...props} />;
    case 'settings': return <Settings {...props} />;
    default: return <Sparkles {...props} />;
  }
};


export default function ModernTemplate({ data }: { data: PortfolioData }) {

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => anchor.addEventListener('click', handleAnchorClick));

    return () => {
      anchors.forEach(anchor => anchor.removeEventListener('click', handleAnchorClick));
    };
  }, []);


  return (
    <div className="bg-dark-bg text-text-light font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-card-bg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="#home" className="text-2xl font-extrabold text-electric-blue tracking-widest">
            {data.personalInfo.portfolioNameAbbr}
          </a>
          <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
            <a href="#home" className="hover:text-electric-blue transition duration-300">Home</a>
            <a href="#about" className="hover:text-electric-blue transition duration-300">About</a>
            <a href="#experience" className="hover:text-electric-blue transition duration-300">Experience</a>
            <a href="#projects" className="hover:text-electric-blue transition duration-300">Projects</a>
            <a href="#contact" className="hover:text-electric-blue transition duration-300">Contact</a>
          </div>
          <button className="md:hidden text-gray-300 hover:text-electric-blue">
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section id="home" className="relative py-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
          <div className="absolute w-[300px] h-[300px] bg-electric-blue/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse-slow"></div>
          <div className="absolute w-[400px] h-[400px] bg-secondary-glow/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm font-medium text-electric-blue flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> Elevating Digital Experiences
              </p>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                Hi, I&apos;m <span className="text-electric-blue">{data.personalInfo.fullName}</span>
              </h1>
              <h2 className="text-2xl font-semibold text-gray-300">
                {data.personalInfo.title}
              </h2>
              <p className="text-gray-400 max-w-lg">
                {data.personalInfo.tagline}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#projects" className="flex items-center bg-electric-blue hover:bg-blue-600 glowing-shadow transition duration-300 text-dark-bg font-bold py-3 px-6 rounded-xl">
                  <Layers className="w-5 h-5 mr-2" /> View My Work
                </a>
                <a href="#contact" className="flex items-center border border-gray-600 text-gray-200 hover:border-electric-blue hover:text-electric-blue transition duration-300 font-medium py-3 px-6 rounded-xl">
                  <Mail className="w-5 h-5 mr-2" /> Get in Touch
                </a>
              </div>
            </div>

            <div className="hidden md:flex justify-center relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-electric-blue/70 to-secondary-glow/70 p-1.5 shadow-2xl glowing-shadow">
                <Image src={data.personalInfo.profilePhotoURL} alt="Professional Profile" width={400} height={400} className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white section-title-wrap mx-auto">About Me</h3>
          </div>

          <p className="max-w-4xl mx-auto text-lg text-gray-400 text-center mb-12">
            {data.about.extendedBio}
          </p>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {data.about.stats.map(stat => (
              <div key={stat.label} className="bg-card-bg p-6 rounded-xl text-center border-t-4 border-electric-blue glowing-shadow-sm">
                <Icon name={stat.icon} className="w-8 h-8 mx-auto mb-3 text-electric-blue" />
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center text-white mb-8 section-title-wrap mx-auto">Core Skills</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {data.about.skills.map(skillCategory => (
                <div key={skillCategory.category} className="bg-card-bg p-6 rounded-xl border border-gray-700 shadow-md">
                  <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Icon name={skillCategory.icon} className="w-5 h-5 mr-3 text-electric-blue" /> {skillCategory.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.tags.map(tag => (
                      <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-electric-blue/50">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-bg/50">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white section-title-wrap mx-auto">Work Experience</h3>
            <p className="text-gray-400 mt-4">Where I&apos;ve applied my skills and grown professionally</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-card-bg md:hidden"></div>

            {data.experience.map((exp, index) => (
              <div key={index} className={`timeline-item md:grid md:grid-cols-2 md:gap-x-12 md:p-0`}>
                {index % 2 === 0 ? (
                  <>
                    <div className="md:text-right">
                      <div className="timeline-dot hidden md:block" style={{ left: 'auto', right: '-12px', top: '12px' }}></div>
                      <div className="timeline-dot md:hidden"></div>
                      <div className="bg-card-bg p-6 rounded-xl shadow-xl border border-gray-700 glowing-shadow-sm hover:scale-[1.01] duration-300">
                        <p className="text-sm text-gray-500 mb-2">{exp.dates} • {exp.location}</p>
                        <h4 className="text-xl font-semibold text-electric-blue">{exp.jobTitle}</h4>
                        <p className="text-sm text-gray-400 mb-3 flex items-center md:justify-end"><Factory className="w-3 h-3 mr-1" /> {exp.company}</p>
                        <ul className="space-y-2 text-sm text-gray-400 list-inside list-disc text-left">
                          {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                        <div className="flex flex-wrap gap-2 mt-4 md:justify-end">
                          {exp.tags.map(t => <span key={t} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{t}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block"></div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block"></div>
                    <div className="md:text-left">
                      <div className="timeline-dot hidden md:block" style={{ right: 'auto', left: '-12px', top: '12px' }}></div>
                      <div className="timeline-dot md:hidden"></div>
                      <div className="bg-card-bg p-6 rounded-xl shadow-xl border border-gray-700 glowing-shadow-sm hover:scale-[1.01] duration-300">
                        <p className="text-sm text-gray-500 mb-2">{exp.dates} • {exp.location}</p>
                        <h4 className="text-xl font-semibold text-electric-blue">{exp.jobTitle}</h4>
                        <p className="text-sm text-gray-400 mb-3 flex items-center"><Factory className="w-3 h-3 mr-1" /> {exp.company}</p>
                        <ul className="space-y-2 text-sm text-gray-400 list-inside list-disc">
                          {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                        <div className="flex flex-wrap gap-2 mt-4 md:justify-start">
                          {exp.tags.map(t => <span key={t} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white section-title-wrap mx-auto mb-12 text-center">Featured Projects</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {data.projects.map(project => (
              <div key={project.name} className="bg-card-bg rounded-xl overflow-hidden shadow-xl border border-gray-700 glowing-shadow-sm hover:scale-[1.02] transition duration-300">
                <Image src={project.imageURL} alt={project.name} width={600} height={400} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-semibold text-electric-blue uppercase">{project.category}</span>
                  <h4 className="text-xl font-bold text-white my-2">{project.name}</h4>
                  <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{tag}</span>)}
                  </div>
                  <a href={project.detailsURL} className="inline-flex items-center text-electric-blue hover:text-blue-400 font-medium transition duration-300">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-bg/50">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white section-title-wrap mx-auto mb-4">Ready to Collaborate?</h3>
            <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
              I&apos;m currently seeking new opportunities and projects. Let&apos;s build something amazing together!
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <div className="bg-card-bg p-8 rounded-xl shadow-xl space-y-8 border border-gray-700 glowing-shadow-sm">
              <h4 className="text-2xl font-bold text-white">Contact Details</h4>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                  <Mail className="w-5 h-5 mr-3 text-electric-blue" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${data.personalInfo.email}`} className="text-white font-medium hover:text-electric-blue">{data.personalInfo.email}</a>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                  <Linkedin className="w-5 h-5 mr-3 text-electric-blue" />
                  <div>
                    <p className="text-sm text-gray-500">LinkedIn</p>
                    <a href={data.personalInfo.linkedInURL} target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-electric-blue">Connect on LinkedIn</a>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                  <MapPin className="w-5 h-5 mr-3 text-electric-blue" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-white font-medium">{data.personalInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card-bg p-8 rounded-xl shadow-xl border border-gray-700 glowing-shadow-sm">
              <h4 className="text-2xl font-bold text-white mb-6">Send a Quick Message</h4>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input type="text" id="name" placeholder="Your Name" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-electric-blue focus:border-electric-blue" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input type="email" id="email" placeholder="Your.email@example.com" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-electric-blue focus:border-electric-blue" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <textarea id="message" rows={5} placeholder="Your inquiry..." className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-electric-blue focus:border-electric-blue"></textarea>
                </div>
                <button type="submit" className="w-full flex items-center justify-center bg-electric-blue hover:bg-blue-600 glowing-shadow transition duration-300 text-dark-bg font-bold py-3 px-6 rounded-xl">
                  <Send className="w-5 h-5 mr-2" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card-bg border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {data.personalInfo.fullName}. All rights reserved. Built with <span className="text-electric-blue">Passion</span>.
        </div>
      </footer>
    </div>
  );
}
