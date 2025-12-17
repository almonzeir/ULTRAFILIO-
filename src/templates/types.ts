
export type PortfolioData = {
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
    portfolioNameAbbr?: string; // e.g. "OS"
    profilePhotoURL?: string;   // from upload
  };
  sectionOrder?: string[]; // e.g. ['hero', 'about', 'experience', 'projects', 'contact']
  about: {
    extendedBio?: string;
    stats?: Array<{ label: string; value: string; icon?: string }>;
    skills?: Array<{ category: string; icon?: string; tags: string[] }>;
  };
  experience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    dates?: string;                 // normalize to "YYYY-MM – YYYY-MM" or "YYYY-MM – Present"
    responsibilities: string[];     // 3–6 impact bullets
    tags?: string[];                // skills/tech highlights
  }>;
  projects: Array<{
    name: string;
    category?: string;
    description?: string;
    tags: string[];
    imageURL?: string;              // placeholder allowed
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
};
