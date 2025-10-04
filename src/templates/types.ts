// types.ts
export interface PortfolioData {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  experience: {
    role: string;
    company: string;
    start: string;
    end: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    tech: string[];
    link?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    start: string;
    end: string;
  }[];
}