import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { PortfolioData } from '@/templates/types';

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

  // For CVs, we return the path (or signed URL if needed immediately, but path is better for DB)
  return data.path;
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

    const formData = await req.formData();
    const cvFile = formData.get('cv') as File | null;
    const photoFile = formData.get('photo') as File | null;

    if (!cvFile) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    // 1. Convert CV file to base64 for Gemini
    const cvArrayBuffer = await cvFile.arrayBuffer();
    const cvBase64 = Buffer.from(cvArrayBuffer).toString('base64');

    // 2. Prepare prompt for Gemini
    const fullPrompt = `
${SYSTEM_PROMPT}

SCHEMA (TypeScript): ${portfolioDataSchema}

TASK:
1) Parse the resume file provided.
2) Fill the PortfolioData JSON schema with the extracted and normalized fields.
3) Create concise, action-led bullets with metrics if present.
4) Extract links (LinkedIn, GitHub, website) if they exist.

RETURN: Valid JSON of PortfolioData only.
    `;

    // 3. Prepare payload for Direct API Call (Bypassing SDK)
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: fullPrompt },
            {
              inline_data: {
                mime_type: cvFile.type || 'application/pdf',
                data: cvBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        response_mime_type: "application/json"
      }
    };

    console.log('🚀 [PORTFOLIO-GENERATE] Sending DIRECT request to Gemini API (v1beta)...');

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ API Error:", errText);
      throw new Error(`Gemini API Failed: ${response.status} ${response.statusText} - ${errText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No content returned from Gemini");
    }

    console.log('✅ [PORTFOLIO-GENERATE] API Success!');
    console.log('📝 Response length:', text.length);

    // Clean up the text response to ensure it's valid JSON
    const jsonString = text.replace(/```json\n|\n```/g, '').trim();
    let parsedData = JSON.parse(jsonString) as PortfolioData;

    // 4. Handle file uploads to Supabase
    let photoURL = '';
    if (photoFile) {
      photoURL = await uploadFileToSupabase(photoFile, userId, 'profile-photos');
    }

    const cvPath = await uploadFileToSupabase(cvFile, userId, 'cvs');

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

    // 6. Ensure user exists in public.users table (for foreign key)
    const { error: userError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        display_name: parsedData.personalInfo.fullName,
        photo_url: photoURL || null,
      }, { onConflict: 'id' });

    if (userError) {
      console.error('User upsert error:', userError);
      // Continue anyway - the user might already exist
    }

    // 7. Save to Supabase Database
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
        template_id: 'modern', // Default template
        status: 'draft'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insertion error:', dbError);
      throw new Error('Failed to save portfolio to database');
    }

    // Track the CV upload in the database
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
