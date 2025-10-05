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
export async function parseCvWithGemini(cvFileUrl: string, mime: string): Promise<PortfolioData> {
  console.log(`Calling Gemini API for CV: ${cvFileUrl} with MIME: ${mime}`);

  const response = await fetch('/api/gemini-parse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cvFileUrl, mimeType: mime }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to parse CV with Gemini API.');
  }

  const extractedData: PortfolioData = await response.json();
  return extractedData;
}

// Normalizes raw extracted data into PortfolioData
export function normalizePortfolioData(raw: any, photoURL?: string): PortfolioData {
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
  console.log(`Mapping data to ${template} template.`);
  return { ...portfolio };
}