
import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { PortfolioData } from '@/templates/types';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';

// Allow streaming responses
export const maxDuration = 30;

const portfolioDataSchema = `
type PortfolioData = {
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
`;

const SYSTEM_PROMPT = `
You are an expert CV to Portfolio data extractor. Your task is to parse a resume file and output a strictly valid JSON object matching the "PortfolioData" schema provided.

**Rules:**
- Derive impact-focused bullets for experience (3–6 per role).
- Normalize dates to "YYYY-MM – YYYY-MM" or "YYYY-MM – Present".
- Deduplicate skills and group them by category where obvious.
- Use empty arrays for unknown lists; omit null or undefined properties.
- NEVER include commentary, markdown, or any text outside of the JSON object. Your entire output must be a single, valid JSON.
- If a field is not present in the CV, omit it from the JSON.
- Generate a \`portfolioNameAbbr\` from the user's initials (e.g., "Jane Doe" -> "JD").
`;

async function uploadFileToFirebase(file: File): Promise<string> {
    const storageRef = ref(storage, `uploads/${uuidv4()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const cvFile = formData.get('cv') as File | null;
    const photoDataUrl = formData.get('photo') as string | null;

    if (!cvFile) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    // 1. Convert CV file to a data URL to pass to Gemini
    const cvArrayBuffer = await cvFile.arrayBuffer();
    const cvBase64 = Buffer.from(cvArrayBuffer).toString('base64');

    // 2. Prepare prompt for Gemini
    const userPrompt = `
      SCHEMA (TypeScript): ${portfolioDataSchema}

      TASK:
      1) Parse the resume file provided.
      2) Fill the PortfolioData JSON schema with the extracted and normalized fields.
      3) Create concise, action-led bullets with metrics if present.
      4) Extract links (LinkedIn, GitHub, website) if they exist.

      RETURN: Valid JSON of PortfolioData only.
    `;

    const model = google('models/gemini-1.5-flash-latest');
    
    // 3. Call Gemini
    const { text } = await streamText({
      model: model,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      attachments: [
        {
          contentType: cvFile.type,
          content: cvBase64,
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // For non-streaming response, we need to assemble it.
    // In a real streaming scenario, you'd handle chunks.
    let jsonString = '';
    const reader = text.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        jsonString += value;
    }


    let parsedData = JSON.parse(jsonString) as PortfolioData;

    // 4. Handle photo upload
    let photoURL = '';
     if (photoDataUrl) {
      const photoResponse = await fetch(photoDataUrl);
      const photoBlob = await photoResponse.blob();
      const photoFile = new File([photoBlob], "profile_photo.jpg", { type: "image/jpeg" });
      photoURL = await uploadFileToFirebase(photoFile);
    }
    
    // 5. Normalize and enrich data
    if (parsedData.personalInfo) {
      parsedData.personalInfo.profilePhotoURL = photoURL;
      if (parsedData.personalInfo.fullName && !parsedData.personalInfo.portfolioNameAbbr) {
        parsedData.personalInfo.portfolioNameAbbr = parsedData.personalInfo.fullName
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();
      }
    }


    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('Error parsing CV with Gemini:', error);
    let errorMessage = 'Failed to parse CV with AI model.';
    if (error.message.includes('API key')) {
        errorMessage = 'AI API key is not configured correctly.'
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
