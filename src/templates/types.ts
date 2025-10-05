// types.ts

export interface Contact {
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
}

export interface Experience {
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface Project {
    name: string;
    description: string;
    tech: string[];
    links: { url: string }[];
    impact: string;
}

export interface Education {
    degree: string;
    field: string;
    institution: string;
    startDate: string;
    endDate: string;
    notes: string;
}

export interface PortfolioData {
  person: {
    fullName: string;
    headline: string;
    summary: string;
  };
  contact: Contact;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: string[];
  certifications: { name: string; issuer: string; date: string }[];
  awards: { name: string; issuer: string; date: string }[];
  languages: { name: string; level: string }[];
  interests: string[];
  photoUrl?: string | null;
}
