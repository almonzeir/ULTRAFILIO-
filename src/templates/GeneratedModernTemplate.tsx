import type { PortfolioData } from './types';

// Helper component for icons to keep the main component clean
const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${className}`} fill="currentColor">
    <path d={d} />
  </svg>
);

const MailIcon = () => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM4 6v.51l8 4.51 8-4.51V6H4zM4 18h16V8.5l-8 4.5-8-4.5V18z" />;
const LinkedInIcon = () => <Icon d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />;
const ArrowRightIcon = () => <Icon d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;

export default function GeneratedModernTemplate({ data }: { data: PortfolioData }) {
  const accentColor = 'text-blue-600';
  const accentBg = 'bg-blue-600';
  const accentBgHover = 'hover:bg-blue-700';

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="max-w-screen-xl mx-auto lg:flex lg:gap-12 p-6 md:p-12">
        {/* Left Sticky Column */}
        <aside className="lg:w-1/3 lg:sticky lg:top-12 self-start mb-12 lg:mb-0">
          <img src={data.personalInfo.profilePhotoURL} alt="Profile" className="w-24 h-24 rounded-full mb-4 object-cover" />
          <h1 className="text-4xl font-bold text-gray-900">{data.personalInfo.fullName}</h1>
          <h2 className="text-xl font-medium text-gray-700 mt-1">{data.personalInfo.title}</h2>
          <p className="text-gray-600 mt-4 max-w-xs">
            {data.personalInfo.tagline}
          </p>
          <nav className="mt-8 space-y-3">
            <a href="#about" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <span className="w-16 h-px bg-gray-400"></span>
              <span>About</span>
            </a>
            <a href="#experience" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <span className="w-16 h-px bg-gray-400"></span>
              <span>Experience</span>
            </a>
            <a href="#projects" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <span className="w-16 h-px bg-gray-400"></span>
              <span>Projects</span>
            </a>
          </nav>
          <div className="mt-8 flex gap-4">
            <a href={`mailto:${data.personalInfo.email}`} className="text-gray-500 hover:text-blue-600 transition-colors"><MailIcon /></a>
            <a href={data.personalInfo.linkedInURL} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors"><LinkedInIcon /></a>
          </div>
        </aside>

        {/* Right Scrolling Column */}
        <main className="lg:w-2/3">
          <section id="about" className="mb-16 scroll-mt-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {data.about.extendedBio.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
          </section>

          <section id="experience" className="mb-16 scroll-mt-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Work Experience</h3>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h4>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">{exp.dates}</p>
                  </div>
                  <ul className="mt-4 list-disc list-inside text-gray-600 space-y-1">
                    {exp.responsibilities.map((r, j) => <li key={j}>{r}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="projects" className="scroll-mt-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Projects</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {data.projects.map((project, i) => (
                <a href={project.detailsURL} key={i} target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group">
                  <img src={project.imageURL} alt={project.name} className="w-full h-40 object-cover rounded-md mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}