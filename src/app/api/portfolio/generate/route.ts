import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { PortfolioData } from '@/templates/types';
import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';

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
You are a helpful assistant that extracts data from a resume to build a portfolio. 
**Relaxed Rules:**
- Extract whatever you can find.
- If a field like email, phone, or website is missing, just leave it empty or use a placeholder if it looks better.
- Don't be strict. If you can't find exact dates, just use the year or "Present".
- If the CV is short, just make the portfolio look full and professional with what you have.
- Your goal is to generate VALID JSON, no matter what.
`;

const FULL_PROMPT_TEMPLATE = `
${SYSTEM_PROMPT}

SCHEMA (TypeScript): ${portfolioDataSchema}

TASK:
1) Parse the resume content provided below.
2) Fill the PortfolioData JSON schema with the extracted and normalized fields.
3) Create concise, action-led bullets with metrics if present.
4) Extract links (LinkedIn, GitHub, website) if they exist.

RETURN: Valid JSON of PortfolioData only. Do not include markdown formatting.
`;

async function uploadFileToSupabase(file: File, userId: string, bucket: 'cvs' | 'profile-photos'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${uuidv4()}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error(`Error uploading to ${bucket}:`, error);
    throw new Error(`Failed to upload file to ${bucket}`);
  }

  // For profile photos, we want a public URL
  if (bucket === 'profile-photos') {
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);
    return publicUrl;
  }

  // For CVs, we return the path
  return data.path;
}

// @ts-ignore
import PDFParser from 'pdf2json';

// --- Text Extraction Helper ---
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Parsing PDF buffer of size: ${buffer.length} bytes with pdf2json`);
      const pdfParser = new PDFParser(null, true); // true = text only

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("pdf2json Error:", errData.parserError);
        reject(new Error(`PDF Parsing Failed: ${errData.parserError}`));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          // pdf2json returns URL-encoded text, need to decode
          // The structure is pdfData.formImage.Pages[].Texts[].R[].T
          const rawText = pdfParser.getRawTextContent();
          console.log(`Successfully extracted ${rawText.length} characters.`);
          resolve(rawText);
        } catch (e: any) {
          console.error("Error processing text from pdf2json:", e);
          reject(new Error("Failed to process PDF text content"));
        }
      });

      pdfParser.parseBuffer(buffer);
    } catch (e: any) {
      console.error("pdf2json Exception:", e);
      reject(new Error(`PDF Parsing Exception: ${e.message}`));
    }
  });
}

// --- Provider Implementations ---

async function callGemini(cvFile: File, fullPrompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');

  // Convert CV file to base64 for Gemini (Multimodal)
  const cvArrayBuffer = await cvFile.arrayBuffer();
  const cvBase64 = Buffer.from(cvArrayBuffer).toString('base64');

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{
      parts: [
        { text: fullPrompt },
        {
          inline_data: {
            mime_type: cvFile.type || 'application/pdf',
            data: cvBase64
          }
        }
      ]
    }],
    generationConfig: {
      response_mime_type: "application/json"
    }
  };

  console.log(`🚀 [GEMINI] Sending request to ${model}...`);
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Failed: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGroq(cvText: string, fullPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');

  const groq = new Groq({ apiKey });

  console.log('🚀 [GROQ] Sending request to Llama 3...');
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: fullPrompt },
      { role: "user", content: `RESUME CONTENT:\n${cvText}` }
    ],
    model: "llama-3.3-70b-versatile", // High speed, good reasoning
    temperature: 0.2, // Low temp for extraction
    response_format: { type: "json_object" }
  });

  return completion.choices[0]?.message?.content || '';
}

async function callHuggingFace(cvText: string, fullPrompt: string): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HUGGINGFACE_API_KEY is not set');

  const hf = new HfInference(apiKey);

  console.log('🚀 [HUGGINGFACE] Sending request...');
  // Qwen2.5 is a very strong open model available on HF Inference
  const modelName = "Qwen/Qwen2.5-72B-Instruct";

  const output = await hf.chatCompletion({
    model: modelName,
    messages: [
      { role: "system", content: fullPrompt },
      { role: "user", content: `RESUME CONTENT:\n${cvText}` }
    ],
    max_tokens: 4000,
    temperature: 0.2
  });

  return output.choices[0].message.content || '';
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = user.id;

    // --- CHECK DAILY LIMIT ---
    const { data: isPro } = await supabaseAdmin.rpc('is_user_pro', {
      check_user_id: userId
    });

    // If NOT pro, we check the limit
    if (!isPro) {
      const { data: allowed, error: limitError } = await supabaseAdmin.rpc('check_and_increment_usage', {
        check_user_id: userId,
        limit_count: 3 // Limit: 3 per day
      });

      if (limitError) {
        console.error('Limit check error:', limitError);
        // Fail open or closed? Let's fail safe (allow) for now to avoid blocking users on DB errors
      } else if (allowed === false) {
        // Calculate Malaysia Time (UTC+8) for friendly message
        const now = new Date();
        const malaysiaTime = new Date(now.getTime() + (3600000 * 8));
        const hoursLeft = 24 - malaysiaTime.getUTCHours();

        return NextResponse.json({
          error: `Daily limit reached. You can only generate 3 portfolios per day to ensure quality service. Please try again in approx ${hoursLeft} hours (tomorrow).`,
          code: 'LIMIT_REACHED'
        }, { status: 429 });
      }
    } else {
      // For Pro users, we still might want to track usage, but without strict limit
      // Or just let them pass. Let's just track it for stats.
      await supabaseAdmin.rpc('check_and_increment_usage', {
        check_user_id: userId,
        limit_count: 1000 // Virtually unlimited
      });
    }
    // ------------------------


    const formData = await req.formData();
    const cvFile = formData.get('cv') as File | null;
    const photoFile = formData.get('photo') as File | null;

    if (!cvFile) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    // Determine Provider
    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    let jsonResponseText = '';

    console.log(`Doing portfolio generation with provider: ${provider}`);

    if (provider === 'gemini') {
      jsonResponseText = await callGemini(cvFile, FULL_PROMPT_TEMPLATE);
    } else {
      // For Groq / HuggingFace, we must extract text first
      const arrayBuffer = await cvFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const cvText = await extractTextFromPDF(buffer);

      if (provider === 'groq') {
        jsonResponseText = await callGroq(cvText, FULL_PROMPT_TEMPLATE);
      } else if (provider === 'huggingface') {
        jsonResponseText = await callHuggingFace(cvText, FULL_PROMPT_TEMPLATE);
      } else {
        throw new Error(`Invalid AI_PROVIDER: ${provider}`);
      }
    }

    if (!jsonResponseText) {
      throw new Error("No content returned from AI Provider");
    }

    console.log('✅ [GENERATION] Success!');

    // Clean up the text response (remove markdown fences if any)
    const jsonString = jsonResponseText.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();

    let parsedData: PortfolioData;
    try {
      parsedData = JSON.parse(jsonString) as PortfolioData;
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", jsonString);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Handle file uploads to Supabase
    let photoURL = '';
    if (photoFile) {
      photoURL = await uploadFileToSupabase(photoFile, userId, 'profile-photos');
    }

    const cvPath = await uploadFileToSupabase(cvFile, userId, 'cvs');

    // Normalize and enrich data
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

    // Ensure user exists
    await supabaseAdmin.from('users').upsert({
      id: userId,
      display_name: parsedData.personalInfo.fullName,
      photo_url: photoURL || null,
    }, { onConflict: 'id' });

    // Save to Database
    const { data: portfolio, error: dbError } = await supabaseAdmin
      .from('portfolios')
      .insert({
        user_id: userId,
        title: parsedData.personalInfo.fullName + "'s Portfolio",
        description: parsedData.personalInfo.tagline,
        profile_photo_url: photoURL,
        email: parsedData.personalInfo.email,
        phone: parsedData.personalInfo.phone,
        location: parsedData.personalInfo.location,
        website: parsedData.personalInfo.website,
        linkedin: parsedData.personalInfo.linkedInURL,
        github: parsedData.personalInfo.githubURL,
        experience: parsedData.experience,
        education: parsedData.education,
        skills: parsedData.about.skills,
        projects: parsedData.projects,
        certifications: parsedData.certifications,
        languages: parsedData.languages,
        template_id: 'modern',
        status: 'draft'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insertion error:', dbError);
      throw new Error('Failed to save portfolio to database');
    }

    // Track CV upload
    await supabaseAdmin.from('cv_uploads').insert({
      user_id: userId,
      portfolio_id: portfolio.id,
      file_name: cvFile.name,
      file_size: cvFile.size,
      file_type: cvFile.type,
      storage_path: cvPath,
      status: 'completed'
    });

    return NextResponse.json({ portfolioId: portfolio.id });

  } catch (error: any) {
    console.error('Error in generate portfolio route:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate portfolio.' }, { status: 500 });
  }
}
