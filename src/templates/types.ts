export interface PersonalInfo {
  fullName: string;
  portfolioNameAbbr: string;
  title: string;
  tagline: string;
  email: string;
  linkedInURL: string;
  location: string;
  profilePhotoURL: string;
}

export interface Stat {
  icon: string;
  value: string;
  label: string;
}

export interface SkillCategory {
  category: string;
  icon: string;
  tags: string[];
}

export interface About {
  extendedBio: string;
  stats: Stat[];
  skills: SkillCategory[];
}

export interface Experience {
  jobTitle: string;
  company: string;
  dates: string;
  location: string;
  responsibilities: string[];
  tags: string[];
}

export interface Project {
  name: string;
  category: string;
  description: string;
  imageURL: string;
  tags: string[];
  detailsURL: string;
}

export interface Education {
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  about: About;
  experience: Experience[];
  projects: Project[];
  education: Education[];
}
