import type { PortfolioData } from './types';

export default function GeneratedModernTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" className="text-lg font-bold text-gray-900 tracking-wide">
            {data.personalInfo.fullName}
          </a>
          <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
            <a href="#about" className="hover:text-gray-900 transition duration-300">About</a>
            <a href="#experience" className="hover:text-gray-900 transition duration-300">Experience</a>
            <a href="#projects" className="hover:text-gray-900 transition duration-300">Projects</a>
            <a href="#contact" className="hover:text-gray-900 transition duration-300">Contact</a>
          </div>
          <button className="md:hidden text-gray-600 hover:text-gray-900">
            {/* You might want to add a menu icon here */}
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section id="home" className="py-24 md:py-32 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full mb-6">
            <img src={data.personalInfo.profilePhotoURL} alt="Professional Profile" width={96} height={96} className="w-full h-full object-cover rounded-full" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
            I&apos;m {data.personalInfo.fullName}. <br />
            A {data.personalInfo.title}.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {data.personalInfo.tagline}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#projects" className="flex items-center bg-gray-900 hover:bg-gray-700 transition duration-300 text-white font-bold py-3 px-6 rounded-lg">
              View My Work
            </a>
            <a href="#contact" className="flex items-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-300 font-medium py-3 px-6 rounded-lg">
              Get in Touch
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">About Me</h2>
            <p className="text-lg text-gray-600 text-center leading-relaxed">
              {data.about.extendedBio}
            </p>
          </div>
        </section>

        {/* Professional Experience */}
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 rounded-xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Work Experience</h2>
            <div className="space-y-12">
              {data.experience.map((exp, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-8">
                  <div className="sm:w-1/3 text-left sm:text-right">
                    <h3 className="text-xl font-bold text-gray-900">{exp.company}</h3>
                    <p className="text-gray-600">{exp.location}</p>
                    <p className="text-sm text-gray-500">{exp.dates}</p>
                  </div>
                  <div className="sm:w-2/3">
                    <h4 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h4>
                    <ul className="mt-2 space-y-2 text-gray-600 list-disc list-inside">
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.projects.map(project => (
                <div key={project.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                  <img src={project.imageURL} alt={project.name} width={600} height={400} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    <a href={project.detailsURL} className="inline-flex items-center text-gray-800 hover:text-black font-bold transition duration-300">
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <footer id="contact" className="bg-gray-50 border-t border-gray-200 mt-12 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="max-w-md">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Collaborate?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  I&apos;m currently seeking new opportunities and projects. Let&apos;s build something amazing together!
                </p>
                <div className="flex space-x-6">
                  <a href={data.personalInfo.linkedInURL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">LinkedIn</a>
                  <a href={`mailto:${data.personalInfo.email}`} className="text-gray-600 hover:text-gray-900">Email</a>
                </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input type="text" id="name" placeholder="Your Name" className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring-gray-900 focus:border-gray-900" />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input type="email" id="email" placeholder="Your Email" className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring-gray-900 focus:border-gray-900" />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea id="message" rows={5} placeholder="Your Message" className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring-gray-900 focus:border-gray-900"></textarea>
                </div>
                <button type="submit" className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-700 transition duration-300 text-white font-bold py-3 px-6 rounded-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-8 mt-12 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} {data.personalInfo.fullName}. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
