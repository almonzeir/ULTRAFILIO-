export interface PortfolioData {
  personalInfo: {
    fullName: string;
    portfolioNameAbbr: string;
    title: string;
    tagline: string;
    profilePhotoURL: string;
    email: string;
    linkedInURL: string;
    location: string;
  };
  about: {
    extendedBio: string;
    stats: {
      icon: string;
      value: string;
      label:string;
    }[];
    skills: {
      icon: string;
      category: string;
      tags: string[];
    }[];
  };
  experience: {
    dates: string;
    location: string;
    jobTitle: string;
    company: string;
    responsibilities: string[];
    tags: string[];
  }[];
  projects: {
    imageURL: string;
    name: string;
    category: string;
    description: string;
    tags: string[];
    detailsURL: string;
  }[];
}