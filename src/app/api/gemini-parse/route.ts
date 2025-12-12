import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import type { PortfolioData } from '@/templates/types';

// Schema for the portfolio data we want to extract
const PORTFOLIO_SCHEMA = {
  personalInfo: {
    fullName: "string",
    title: "string (professional title)",
    tagline: "string (brief professional summary)",
    email: "string",
    phone: "string",
    location: "string",
    website: "string (personal website URL)",
    linkedInURL: "string (LinkedIn profile URL)",
    githubURL: "string (GitHub profile URL)",
    portfolioNameAbbr: "string (initials from full name, e.g. JD for John Doe)",
  },
  about: {
    extendedBio: "string (detailed professional bio, 2-3 sentences)",
    stats: [
      {
        label: "string (e.g. 'Years of Experience', 'Projects Completed')",
        value: "string (e.g. '5+', '50+')",
        icon: "string (emoji or icon name, optional)"
      }
    ],
    skills: [
      {
        category: "string (e.g. 'Frontend', 'Backend', 'Design')",
        icon: "string (emoji or icon name, optional)",
        tags: ["string (specific skills, e.g. 'React', 'Node.js', 'Figma')"]
      }
    ]
  },
  experience: [
    {
      jobTitle: "string",
      company: "string",
      location: "string",
      dates: "string (e.g. '2020-01 – 2022-05' or '2020-01 – Present')",
      responsibilities: ["string (3-6 bullet points with impact metrics)"],
      tags: ["string (technologies used, e.g. 'React', 'AWS')"]
    }
  ],
  projects: [
    {
      name: "string",
      category: "string (e.g. 'Web App', 'Mobile App')",
      description: "string (brief project description)",
      tags: ["string (technologies used)"],
      imageURL: "string (placeholder URL, e.g. https://placehold.co/600x400)",
      detailsURL: "string (project link or repository URL)"
    }
  ],
  education: [
    {
      degree: "string (e.g. 'B.S. Computer Science')",
      field: "string (e.g. 'Computer Science')",
      institution: "string",
      startDate: "string (year, e.g. '2016')",
      endDate: "string (year, e.g. '2020')",
      notes: "string (honors, relevant coursework, etc.)"
    }
  ],
  certifications: ["string (certification name with organization and year if available)"],
  awards: ["string (award name with organization and year if available)"],
  languages: [
    {
      name: "string (language name)",
      level: "string (proficiency level, e.g. 'Fluent', 'Intermediate')"
    }
  ],
  interests: ["string (personal interests or hobbies)"]
};

export async function POST(req: NextRequest) {
  try {
    const { cvFileUrl, mimeType } = await req.json();

    if (!cvFileUrl || !mimeType) {
      return NextResponse.json(
        { error: 'Missing cvFileUrl or mimeType' },
        { status: 400 }
      );
    }

    // Fetch the CV file
    const response = await fetch(cvFileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch CV file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // ENHANCED System prompt for better extraction
    const systemPrompt = `
You are an EXPERT CV/Resume parser with exceptional attention to detail. Your task is to extract ALL structured information from the provided CV/resume.

CRITICAL EXTRACTION RULES:
1. SCAN THOROUGHLY - Look everywhere in the document including headers, footers, sidebars, and metadata
2. EXTRACT ALL LINKS:
   - GitHub URLs (github.com/username or any GitHub links)
   - LinkedIn URLs (linkedin.com/in/username)
   - Portfolio/Personal website URLs
   - Project live demo URLs
   - Project repository URLs
   - Any Behance, Dribbble, or other portfolio links
   
3. EXTRACT PROJECTS AGGRESSIVELY:
   - Look for sections named: Projects, Portfolio, Work, Side Projects, Personal Projects, Freelance, etc.
   - Even if something looks like it could be a project, include it
   - Extract the project URL/link if mentioned
   - Generate a category based on context (Web App, Mobile App, API, Tool, etc.)

4. EXTRACT ALL CONTACT INFO:
   - Email addresses (look everywhere, including footers)
   - Phone numbers (with country code if available)
   - City, State, Country
   - Any social media handles

5. SKILLS EXTRACTION:
   - Group similar skills into categories (Frontend, Backend, DevOps, Design, etc.)
   - Include ALL technical skills mentioned anywhere
   - Include soft skills if mentioned

6. EXPERIENCE ENHANCEMENT:
   - Create impactful bullet points with metrics (%, numbers, scale)
   - If metrics aren't explicit, estimate reasonable ones based on context
   - Extract technologies used in each role

7. Generate a compelling tagline even if not present - based on their experience

8. For stats, generate realistic numbers:
   - Years of Experience (calculate from first job to now)
   - Projects Completed (count projects + estimate from experience)
   - Technologies Used (count unique techs mentioned)

OUTPUT RULES:
- Return ONLY valid JSON
- Do NOT include markdown code blocks
- Do NOT include any text outside the JSON
- If a field truly doesn't exist, omit it (don't use null)
- Generate portfolioNameAbbr from initials (e.g., "Jane Doe" -> "JD")
`;

    // User prompt with schema
    const userPrompt = `
EXTRACT ALL INFORMATION from this CV/resume. Be THOROUGH and COMPREHENSIVE.

Pay special attention to:
- ALL URLs and links (GitHub, LinkedIn, personal sites, project links)
- ALL projects with their descriptions and technologies
- ALL contact information
- ALL skills grouped by category

Output this exact JSON structure:
${JSON.stringify(PORTFOLIO_SCHEMA, null, 2)}

IMPORTANT: If you find a GitHub username mentioned (like "github.com/johndoe"), store the full URL.
If you find project links, include them in the project's detailsURL field.

Return ONLY the JSON object. No other text, no markdown, no explanations.
`;

    // Call the Google AI model with improved settings
    const model = google('models/gemini-2.0-flash-exp');

    const result = await streamText({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            {
              type: 'file',
              data: base64,
              mimeType: mimeType
            } as any,
          ],
        },
      ],
    });

    // Collect the streamed response
    let jsonString = '';
    for await (const chunk of result.textStream) {
      jsonString += chunk;
    }

    // Clean the response - remove any markdown formatting
    jsonString = jsonString.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7);
    }
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3);
    }
    jsonString = jsonString.trim();

    // Parse and validate the response
    let extractedData: PortfolioData;
    try {
      extractedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', jsonString.substring(0, 500));

      // Try to extract JSON from the response
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[0]);
        } catch {
          throw new Error('Failed to parse AI response as JSON');
        }
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Post-process: ensure we have reasonable defaults
    if (extractedData.about && !extractedData.about.stats) {
      extractedData.about.stats = [
        { label: 'Years of Experience', value: '3+', icon: '⏱️' },
        { label: 'Projects', value: '10+', icon: '📁' },
        { label: 'Technologies', value: '15+', icon: '🛠️' }
      ];
    }

    return NextResponse.json(extractedData);
  } catch (error: any) {
    console.error('Error in gemini-parse route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse CV with AI' },
      { status: 500 }
    );
  }
}