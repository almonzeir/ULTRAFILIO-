'use client';

import React from 'react';
import BasicTemplate from '@/templates/BasicTemplate';
import { PortfolioData } from '@/templates/types';
import { ThemeProvider, ThemeContext, accentGradients, AccentKey } from '@/context/ThemeContext';

const accentOptions: AccentKey[] = ['blue', 'purple', 'teal', 'gold', 'rose'];

const dummyPortfolioData: PortfolioData = {
  personalInfo: {
    fullName: 'John Doe',
    portfolioNameAbbr: 'JD',
    title: 'Principal Software Engineer',
    tagline: 'Designing resilient platforms that scale with your ambitions',
    profilePhotoURL: '',
    email: 'john.doe@example.com',
    phone: '+1 (555) 010-7788',
    website: 'https://johndoe.dev',
    linkedInURL: 'https://www.linkedin.com/in/johndoe',
    githubURL: 'https://github.com/johndoe',
    location: 'San Francisco, CA',
  },
  about: {
    extendedBio:
      'Seasoned engineer with a track record of leading high-performing teams and shipping customer-focused solutions. I thrive on transforming complex ideas into products that feel intuitive, performant, and reliable.',
    stats: [
      { icon: 'code', value: '8+', label: 'Years Experience' },
      { icon: 'team', value: '12', label: 'Engineers Mentored' },
      { icon: 'project', value: '35+', label: 'Projects Delivered' },
      { icon: 'globe', value: '4', label: 'Global Launches' },
    ],
    skills: [
      { icon: 'react', category: 'Frontend', tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
      { icon: 'node', category: 'Backend', tags: ['Node.js', 'Express', 'GraphQL', 'Python', 'FastAPI'] },
      { icon: 'cloud', category: 'Cloud & DevOps', tags: ['AWS', 'Terraform', 'Docker', 'Kubernetes'] },
      { icon: 'data', category: 'Data & AI', tags: ['PostgreSQL', 'BigQuery', 'LangChain', 'Vertex AI'] },
    ],
  },
  experience: [
    {
      dates: 'Jan 2022 - Present',
      location: 'San Francisco, CA',
      jobTitle: 'Principal Software Engineer',
      company: 'Tech Solutions Inc.',
      responsibilities: [
        'Led the modernization of the flagship analytics platform, improving page performance by 48 percent.',
        'Partnered with product and design to launch a low-code workflow builder adopted by 200 enterprise teams.',
        'Introduced engineering rituals that reduced incident recovery time by half.',
      ],
      tags: ['React', 'Node.js', 'GraphQL', 'AWS', 'Kubernetes'],
    },
    {
      dates: 'Jun 2018 - Dec 2021',
      location: 'Seattle, WA',
      jobTitle: 'Senior Software Engineer',
      company: 'Innovate Corp.',
      responsibilities: [
        'Delivered a multi-tenant content platform serving 3 million monthly active users.',
        'Implemented continuous delivery pipelines and observability dashboards across five product lines.',
        'Mentored junior engineers and interns, introducing guilds focused on accessibility and performance.',
      ],
      tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    },
    {
      dates: 'Sep 2015 - May 2018',
      location: 'Austin, TX',
      jobTitle: 'Software Engineer',
      company: 'BrightApps',
      responsibilities: [
        'Built cross-platform mobile apps with real-time synchronization and offline support.',
        'Established coding standards and automated testing practices adopted company-wide.',
        'Collaborated with marketing on data-driven experiments that increased retention by 15 percent.',
      ],
      tags: ['React Native', 'Firebase', 'Python'],
    },
  ],
  projects: [
    {
      imageURL: '',
      name: 'Aperture Commerce',
      category: 'Web Platform',
      description: 'Composable commerce experience with AI-assisted merchandising and pay-per-use infrastructure.',
      tags: ['Next.js', 'tRPC', 'Stripe', 'AWS Lambda'],
      detailsURL: 'https://johndoe.dev/projects/aperture-commerce',
    },
    {
      imageURL: '',
      name: 'OrbitOps',
      category: 'Internal Tooling',
      description: 'Operational command center that unifies on-call, deployment, and analytics workflows.',
      tags: ['React', 'Go', 'Temporal', 'Grafana'],
      detailsURL: 'https://johndoe.dev/projects/orbit-ops',
    },
    {
      imageURL: '',
      name: 'Atlas Notes',
      category: 'Mobile App',
      description: 'Context-aware note-taking application that uses on-device models for instant summarization.',
      tags: ['React Native', 'SQLite', 'LangChain'],
      detailsURL: 'https://johndoe.dev/projects/atlas-notes',
    },
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      field: 'Machine Learning',
      institution: 'University of Example',
      startDate: 'Sep 2013',
      endDate: 'May 2015',
      notes: 'Graduate research assistant focusing on scalable recommendation systems.',
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      field: 'Software Engineering',
      institution: 'State University',
      startDate: 'Sep 2009',
      endDate: 'May 2013',
      notes: 'Graduated magna cum laude, president of the Programming Society.',
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect - Professional',
    'Google Cloud Professional Cloud Architect',
    'Scrum Alliance Certified ScrumMaster',
  ],
  awards: [
    'Tech Solutions Inc. Engineering Leadership Award (2023)',
    'Innovate Corp. Employee of the Year (2020)',
  ],
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Spanish', level: 'Professional working proficiency' },
    { name: 'Japanese', level: 'Conversational' },
  ],
  interests: ['Open source communities', 'Generative AI art', 'Cycling the Marin Headlands', 'Portrait photography'],
};

export default function BasicTemplatePage() {
  return (
    <ThemeProvider>
      <TemplatePreview />
    </ThemeProvider>
  );
}

function TemplatePreview() {
  const { theme, toggleTheme, accent, setAccent } = React.useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen pb-16 pt-12 ${
        theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-slate-100 text-gray-900'
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Basic Template Preview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Explore the baseline portfolio experience using rich sample data. Toggle the theme and accent to see how it
            adapts.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:text-blue-300"
          >
            {theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Accent
            </span>
            <div className="flex items-center gap-2">
              {accentOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAccent(option)}
                  className={`h-8 w-8 rounded-full border-2 bg-gradient-to-r ${accentGradients[option]} transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    accent === option
                      ? 'border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-400'
                      : 'border-transparent focus:ring-blue-400/50 dark:focus:ring-blue-400/40'
                  }`}
                  aria-label={`Use ${option} accent`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <BasicTemplate data={dummyPortfolioData} />
      </div>
    </div>
  );
}
