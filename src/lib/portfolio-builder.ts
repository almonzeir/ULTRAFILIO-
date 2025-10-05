import { PortfolioData } from '@/templates/types';

// Helper function to simulate delay
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Converts file extension to MIME type
export function cvFileTypeToMime(ext: 'pdf' | 'doc' | 'docx'): string {
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

// Parses CV with Gemini API
export async function parseCvWithGemini(cvUrl: string, mime: string): Promise<PortfolioData> {
  // In a real application, you would make an API call to your backend
  // which then calls the Gemini API. For this implementation, we'll simulate it.
  // The prompt mentions Gemini API is already in .env, so we'll assume a direct call
  // or a proxy through a Next.js API route.
  // For now, we'll return dummy data.

  // Placeholder for actual Gemini API call
  console.log(`Simulating Gemini parsing for CV: ${cvUrl} with MIME: ${mime}`);
  await sleep(5000); // Simulate API call latency

  const SYSTEM_PROMPT = `You are an expert CV→Portfolio extractor. Output strictly valid JSON matching the "PortfolioData" schema. 
- Derive impact-focused bullets (3–6 per role).
- Normalize dates to "YYYY-MM – YYYY-MM" or "YYYY-MM – Present".
- Deduplicate skills; group by category where obvious.
- Use empty arrays for unknown lists; omit nulls/undefined.
- Never include commentary or markdown—JSON only.`;

  const USER_PROMPT_TEMPLATE = (schema: string, cvFileUrl: string, mimeType: string) => `
SCHEMA (TypeScript):
${schema}

FILE:
- url: ${cvFileUrl}
- mime: ${mimeType}

TASK:
1) Parse the resume.
2) Fill PortfolioData with normalized fields.
3) Create concise, action-led bullets with metrics if present.
4) Extract links (LinkedIn, GitHub, website) if they exist.

RETURN:
Valid JSON of PortfolioData only.
`;

  // This is a placeholder for the actual schema. In a real app, you'd dynamically
  // get the TypeScript interface definition or have it pre-defined.
  const PORTFOLIO_DATA_SCHEMA = `
interface PortfolioData {
  personalInfo: {
    fullName: string;
    title?: string;
    tagline?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedInURL?: string;
    githubURL?: string;
    portfolioNameAbbr?: string;
    profilePhotoURL?: string;
  };
  about: {
    extendedBio?: string;
    stats?: Array<{ label: string; value: string; icon?: string }>;
    skills?: Array<{ category: string; icon?: string; tags: string[] }>;
  };
  experience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    dates?: string;
    responsibilities: string[];
    tags?: string[];
  }>;
  projects: Array<{
    name: string;
    category?: string;
    description?: string;
    tags: string[];
    imageURL?: string;
    detailsURL?: string;
  }>;
  education?: Array<{
    degree: string;
    field?: string;
    institution: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
  }>;
  certifications?: string[];
  awards?: string[];
  languages?: Array<{ name: string; level?: string }>;
  interests?: string[];
}
`;

  const USER_PROMPT = USER_PROMPT_TEMPLATE(PORTFOLIO_DATA_SCHEMA, cvUrl, mime);

  // Mock Gemini API response
  const mockExtractedData: PortfolioData = {
    personalInfo: {
      fullName: 'Jane Doe',
      portfolioNameAbbr: 'JD',
      title: 'Senior Product Manager',
      tagline: 'Driving innovation and delivering impactful products',
      profilePhotoURL: 'https://randomuser.me/api/portraits/women/68.jpg', // Added a dummy photo URL
      email: 'jane.doe@example.com',
      phone: '+1-555-123-4567',
      location: 'New York, NY',
      website: 'https://janedoe.com',
      linkedInURL: 'https://www.linkedin.com/in/janedoe',
      githubURL: 'https://github.com/janedoe',
    },
    about: {
      extendedBio:
        'Results-oriented Product Manager with 8+ years of experience in SaaS and B2C products. Proven ability to lead cross-functional teams, define product roadmaps, and launch successful products. Passionate about user-centric design and data-driven decision making.',
      stats: [
        { label: 'Products Launched', value: '10+', icon: 'rocket' },
        { label: 'User Growth', value: '200%', icon: 'growth' },
        { label: 'Revenue Increase', value: '15%', icon: 'dollar' },
      ],
      skills: [
        { category: 'Product Management', tags: ['Roadmapping', 'Agile', 'Scrum', 'User Stories', 'Market Research', 'Competitive Analysis'] },
        { category: 'Technical', tags: ['SQL', 'Jira', 'Confluence', 'Google Analytics', 'Figma'] },
        { category: 'Soft Skills', tags: ['Leadership', 'Communication', 'Problem Solving', 'Mentorship'] },
      ],
    },
    experience: [
      {
        jobTitle: 'Senior Product Manager',
        company: 'InnovateTech',
        location: 'New York, NY',
        dates: '2020-03 – Present',
        responsibilities: [
          'Led product strategy and roadmap for flagship SaaS platform, increasing user engagement by 30% through new feature development and optimization.',
          'Managed a team of 5 product owners and designers, fostering a collaborative environment and ensuring timely delivery of high-quality software.',
          'Successfully launched 3 major features, resulting in a 15% revenue increase and improved customer satisfaction scores.',
          'Conducted extensive user research and A/B testing to validate product hypotheses and inform design decisions.',
        ],
        tags: ['SaaS', 'Product Strategy', 'Agile', 'Leadership', 'User Research', 'A/B Testing'],
      },
      {
        jobTitle: 'Product Manager',
        company: 'Global Solutions',
        location: 'New York, NY',
        dates: '2017-06 – 2020-02',
        responsibilities: [
          'Defined and prioritized product requirements for mobile applications, leading to a 25% increase in app store ratings.',
          'Conducted market research and competitive analysis to identify new opportunities and inform product roadmap.',
          'Collaborated with engineering to deliver features on time and within budget, managing stakeholder expectations.',
          'Developed and maintained product backlog, ensuring alignment with business goals and user needs.',
        ],
        tags: ['Mobile', 'Market Research', 'B2C', 'Product Backlog', 'Stakeholder Management'],
      },
    ],
    projects: [
      {
        name: 'AI-Powered Recommendation Engine',
        category: 'Product Development',
        description: 'Developed and launched an AI-driven recommendation engine, boosting conversion rates by 20% and improving user personalization.',
        tags: ['AI', 'Machine Learning', 'Product Launch', 'Python', 'TensorFlow'],
        imageURL: 'https://picsum.photos/seed/ai-reco/400/300', // Dummy image URL
        detailsURL: 'https://janedoe.com/projects/ai-reco',
      },
      {
        name: 'Customer Feedback Platform',
        category: 'Web Development',
        description: 'Designed and implemented a comprehensive customer feedback platform, leading to a 10% reduction in customer support tickets.',
        tags: ['React', 'Node.js', 'MongoDB', 'User Experience'],
        imageURL: 'https://picsum.photos/seed/feedback/400/300', // Dummy image URL
        detailsURL: 'https://janedoe.com/projects/feedback-platform',
      },
      {
        name: 'Internal Analytics Dashboard',
        category: 'Data Visualization',
        description: 'Built an internal analytics dashboard to track key product metrics, enabling data-driven decision-making across the organization.',
        tags: ['Tableau', 'SQL', 'Data Analysis', 'Business Intelligence'],
        imageURL: 'https://picsum.photos/seed/analytics/400/300', // Dummy image URL
        detailsURL: 'https://janedoe.com/projects/analytics-dashboard',
      },
    ],
    education: [
      {
        degree: 'MBA',
        field: 'Business Administration',
        institution: 'Columbia Business School',
        startDate: '2015-09',
        endDate: '2017-05',
        notes: 'Focused on product management and technology strategy.',
      },
      {
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of California, Berkeley',
        startDate: '2011-09',
        endDate: '2015-05',
        notes: 'Graduated with honors.',
      },
    ],
    certifications: ['Certified Scrum Product Owner (CSPO)', 'Google Analytics Certified'],
    awards: ['Innovator of the Year 2022', 'Product Excellence Award 2019'],
    languages: [{ name: 'English', level: 'Native' }, { name: 'Spanish', level: 'Conversational' }],
    interests: ['Hiking', 'Photography', 'Reading', 'Travel'],
  };

  // In a real scenario, you'd make a fetch call to the Gemini API or your backend proxy
  // const response = await fetch('/api/gemini-parse', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     systemPrompt: SYSTEM_PROMPT,
  //     userPrompt: USER_PROMPT,
  //     cvUrl,
  //     mime,
  //   }),
  // });

  // if (!response.ok) {
  //   throw new Error('Gemini API parsing failed.');
  // }

  // const extractedData: PortfolioData = await response.json();
  return mockExtractedData; // Replace with actual extractedData
}

// Normalizes raw extracted data into PortfolioData
export function normalizePortfolioData(raw: any, photoURL?: string): PortfolioData {
  // This function would perform various sanitization and normalization steps
  // as described in the prompt (e.g., trim strings, clamp bullets, dedupe skills, normalize dates).
  // For now, we'll assume the raw data from Gemini is already well-formed due to strict prompting.

  const normalizedData: PortfolioData = {
    ...raw,
    personalInfo: {
      ...raw.personalInfo,
      fullName: raw.personalInfo.fullName?.trim() || '',
      title: raw.personalInfo.title?.trim() || undefined,
      tagline: raw.personalInfo.tagline?.trim() || undefined,
      profilePhotoURL: photoURL || raw.personalInfo.profilePhotoURL, // Prioritize uploaded photo
    },
    experience: raw.experience?.map((exp: any) => ({
      ...exp,
      responsibilities: exp.responsibilities?.slice(0, 6) || [], // Clamp bullets
      dates: exp.dates || undefined, // Further date normalization can go here
    })) || [],
    projects: raw.projects?.map((proj: any) => ({
      ...proj,
      description: proj.description ? proj.description.substring(0, 240) : undefined, // Clamp description
      tags: proj.tags?.slice(0, 6) || [], // Clamp tags
    })) || [],
  };

  return normalizedData;
}

// Maps normalized PortfolioData to a specific template format
export function mapToTemplate(
  portfolio: PortfolioData,
  template: 'basic' | 'minimalist' | 'modern'
): PortfolioData {
  // This function would adjust ordering, section presence, or accents based on the chosen template.
  // For this initial implementation, we'll return the portfolio data as is,
  // assuming templates will handle their own rendering logic based on the full data.
  console.log(`Mapping data to ${template} template.`);
  return { ...portfolio }; // Return a copy to avoid mutating the original
}
