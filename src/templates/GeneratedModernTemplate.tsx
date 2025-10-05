
import type { PortfolioData } from './types';

export default function GeneratedModernTemplate({ data }: { data: PortfolioData }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{data.personalInfo.fullName} - Portfolio</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'dark-bg': '#070C15',
                  'card-bg': '#101725',
                  'electric-blue': '#3B82F6',
                  'secondary-glow': '#1D4ED8',
                  'text-light': '#E2E8F0',
                },
                fontFamily: {
                  sans: ['Inter', 'sans-serif'],
                },
                keyframes: {
                  pulseGlow: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '0.7' },
                  }
                },
                animation: {
                  'pulse-slow': 'pulseGlow 8s ease-in-out infinite',
                }
              }
            }
          }
        `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body {
            background-color: #070C15;
            color: #E2E8F0;
            line-height: 1.6;
          }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #101725; }
          ::-webkit-scrollbar-thumb { background: #3B82F6; border-radius: 4px; }
          .glowing-shadow {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease-in-out;
          }
          .glowing-shadow:hover {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.7), 0 0 30px rgba(59, 130, 246, 0.5);
          }
          .section-title-wrap {
            position: relative;
            padding-bottom: 0.5rem;
            display: inline-block;
          }
          .section-title-wrap::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background-color: #3B82F6;
            border-radius: 2px;
            box-shadow: 0 0 5px #3B82F6;
          }
          .timeline-item {
            position: relative;
            padding-left: 3rem;
            margin-bottom: 3rem;
          }
          .timeline-item::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: #101725;
          }
          .timeline-dot {
            position: absolute;
            left: 4px;
            top: 6px;
            width: 14px;
            height: 14px;
            background-color: #3B82F6;
            border-radius: 50%;
            z-index: 10;
            box-shadow: 0 0 8px #3B82F6;
            border: 2px solid #070C15;
          }
          @media (min-width: 768px) {
             .timeline-item::before { display: none; }
          }
        `,
          }}
        />
      </head>
      <body className="font-sans">
        <header className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-card-bg">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <a href="#home" className="text-2xl font-extrabold text-electric-blue tracking-widest glowing-shadow-sm">
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
              <i data-lucide="menu" className="w-6 h-6"></i>
            </button>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto">
          <section id="home" className="relative py-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
            <div className="absolute w-[300px] h-[300px] bg-electric-blue/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse-slow"></div>
            <div className="absolute w-[400px] h-[400px] bg-secondary-glow/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-sm font-medium text-electric-blue flex items-center">
                  <i data-lucide="sparkles" className="w-4 h-4 mr-2"></i> Elevating Digital Experiences
                </p>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                  Hi, I'm <span className="text-electric-blue glowing-shadow-sm">{data.personalInfo.fullName}</span>
                </h1>
                <h2 className="text-2xl font-semibold text-gray-300">
                  {data.personalInfo.title}
                </h2>
                <p className="text-gray-400 max-w-lg">
                  {data.personalInfo.tagline}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a href="#projects" className="flex items-center bg-electric-blue hover:bg-blue-600 glowing-shadow transition duration-300 text-dark-bg font-bold py-3 px-6 rounded-xl">
                    <i data-lucide="layers" className="w-5 h-5 mr-2"></i> View My Work
                  </a>
                  <a href="#contact" className="flex items-center border border-gray-600 text-gray-200 hover:border-electric-blue hover:text-electric-blue transition duration-300 font-medium py-3 px-6 rounded-xl">
                    <i data-lucide="mail" className="w-5 h-5 mr-2"></i> Get in Touch
                  </a>
                </div>
              </div>

              <div className="hidden md:flex justify-center relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-electric-blue/70 to-secondary-glow/70 p-1.5 shadow-2xl glowing-shadow">
                  <img src={data.personalInfo.profilePhotoURL} alt="Professional Profile" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-white section-title-wrap mx-auto">About Me</h3>
            </div>

            <p className="max-w-4xl mx-auto text-lg text-gray-400 text-center mb-12">
              {data.about.extendedBio}
            </p>

            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {data.about.stats.map((stat, index) => (
                <div key={index} className="bg-card-bg p-6 rounded-xl text-center border-t-4 border-electric-blue glowing-shadow-sm">
                  <i data-lucide={stat.icon} className="w-8 h-8 mx-auto mb-3 text-electric-blue"></i>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-20">
              <h3 className="text-3xl font-bold text-center text-white mb-8 section-title-wrap mx-auto">Core Skills</h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {data.about.skills.map((skillCategory, index) => (
                  <div key={index} className="bg-card-bg p-6 rounded-xl border border-gray-700 shadow-md">
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <i data-lucide={skillCategory.icon} className="w-5 h-5 mr-3 text-electric-blue"></i> {skillCategory.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-electric-blue/50">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-bg/50">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-white section-title-wrap mx-auto">Work Experience</h3>
              <p className="text-gray-400 mt-4">Where I've applied my skills and grown professionally</p>
            </div>

            <div className="max-w-4xl mx-auto relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-card-bg md:hidden"></div>
              {data.experience.map((exp, index) => (
                <div key={index} className="timeline-item md:grid md:grid-cols-2 md:gap-x-12 md:p-0">
                  <div className={`md:col-span-1 ${index % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'}`}>
                    <div className="timeline-dot hidden md:block" style={{ left: index % 2 === 0 ? 'auto' : '-12px', right: index % 2 === 0 ? '-12px' : 'auto', top: '12px' }}></div>
                    <div className="timeline-dot md:hidden"></div>
                    <div className="bg-card-bg p-6 rounded-xl shadow-xl border border-gray-700 glowing-shadow-sm hover:scale-[1.01] duration-300">
                      <p className="text-sm text-gray-500 mb-2">{exp.dates} • {exp.location}</p>
                      <h4 className="text-xl font-semibold text-electric-blue">{exp.jobTitle}</h4>
                      <p className="text-sm text-gray-400 mb-3 flex items-center"><i data-lucide="factory" className="w-3 h-3 mr-1"></i> {exp.company}</p>
                      <ul className="space-y-2 text-sm text-gray-400 list-inside list-disc">
                        {exp.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex}>{resp}</li>
                        ))}
                      </ul>
                      <div className={`flex flex-wrap gap-2 mt-4 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                        {exp.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`hidden md:block ${index % 2 === 0 ? 'md:col-span-1' : 'md:col-span-1'}`}></div>
                </div>
              ))}
            </div>
          </section>

          <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-white section-title-wrap mx-auto mb-12">Featured Projects</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-card-bg rounded-xl overflow-hidden shadow-xl border border-gray-700 glowing-shadow-sm hover:scale-[1.02] transition duration-300">
                  <img src={project.imageURL} alt={project.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <span className="text-xs font-semibold text-electric-blue uppercase">{project.category}</span>
                    <h4 className="text-xl font-bold text-white my-2">{project.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <a href={project.detailsURL} className="inline-flex items-center text-electric-blue hover:text-blue-400 font-medium transition duration-300">
                      View Details <i data-lucide="arrow-right" className="w-4 h-4 ml-1"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-bg/50">
            <h3 className="text-4xl font-bold text-white section-title-wrap mx-auto mb-4">Ready to Collaborate?</h3>
            <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
              I'm currently seeking new opportunities and projects. Let's build something amazing together!
            </p>

            <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
              <div className="bg-card-bg p-8 rounded-xl shadow-xl space-y-8 border border-gray-700 glowing-shadow-sm">
                <h4 className="text-2xl font-bold text-white">Contact Details</h4>
                <p className="text-gray-400">
                  Reach out via email or connect with me on social media. I aim to respond within 24 hours.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                    <i data-lucide="mail" className="w-5 h-5 mr-3 text-electric-blue"></i>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-white font-medium">{data.personalInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                    <i data-lucide="linkedin" className="w-5 h-5 mr-3 text-electric-blue"></i>
                    <div>
                      <p className="text-sm text-gray-500">LinkedIn</p>
                      <p className="text-white font-medium">{data.personalInfo.linkedInURL}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                    <i data-lucide="map-pin" className="w-5 h-5 mr-3 text-electric-blue"></i>
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
                    <i data-lucide="send" className="w-5 h-5 mr-2"></i> Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-card-bg border-t border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
            &copy; 2025 {data.personalInfo.fullName}. All rights reserved. Built with <span className="text-electric-blue">Passion</span>.
          </div>
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `lucide.createIcons();` }} />
      </body>
    </html>
  );
}
