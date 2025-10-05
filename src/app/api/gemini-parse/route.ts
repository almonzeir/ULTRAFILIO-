import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Define PortfolioData type based on your types.ts
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

const SYSTEM_PROMPT = `You are an expert CV→Portfolio extractor. Output strictly valid JSON matching the "PortfolioData" schema. 
- Derive impact-focused bullets (3–6 per role).
- Normalize dates to "YYYY-MM – YYYY-MM" or "YYYY-MM – Present".
- Deduplicate skills; group by category where obvious.
- Use empty arrays for unknown lists; omit nulls/undefined.
- Never include commentary or markdown—JSON only.`;

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

const USER_PROMPT_TEMPLATE = (schema: string, mimeType: string) => `
SCHEMA (TypeScript):
${schema}

FILE:
- mime: ${mimeType}

TASK:
1) Parse the resume.
2) Fill PortfolioData with normalized fields.
3) Create concise, action-led bullets with metrics if present.
4) Extract links (LinkedIn, GitHub, website) if they exist.

RETURN:
Valid JSON of PortfolioData only.
`;

export async function POST(request: Request) {
  try {
    const { cvFileUrl, mimeType } = await request.json();

    if (!cvFileUrl || !mimeType) {
      return NextResponse.json({ error: 'Missing cvFileUrl or mimeType' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Fetch the CV file content from the URL
    const cvResponse = await fetch(cvFileUrl);
    if (!cvResponse.ok) {
      throw new Error(`Failed to fetch CV from URL: ${cvResponse.statusText}`);
    }
    const cvBlob = await cvResponse.blob();
    const cvBuffer = Buffer.from(await cvBlob.arrayBuffer());

    const parts = [
      { text: SYSTEM_PROMPT },
      { text: USER_PROMPT_TEMPLATE(PORTFOLIO_DATA_SCHEMA, mimeType) },
      { inlineData: { data: cvBuffer.toString('base64'), mimeType } },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        responseMimeType: "application/json"
      }
    });

    const response = result.response;
    const text = response.text();

    // Gemini API might return markdown JSON, so we need to parse it correctly
    let parsedData: PortfolioData;
    try {
      // Remove markdown backticks if present
      const jsonString = text.replace(/^```json\n|\n```$/g, '');
      parsedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.error('Raw Gemini response:', text);
      return NextResponse.json({ error: 'Invalid JSON response from Gemini API' }, { status: 500 });
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Gemini API route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
