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
You are an EXPERT CV/Resume parser with exceptional attention to detail. Your mission is to extract MAXIMUM value from every CV to create a stunning portfolio.

## CRITICAL EXTRACTION RULES:

### 1. SCAN EVERYTHING
Look in ALL parts of the document:
- Headers, footers, sidebars
- Contact sections (top, bottom, or side)
- All text, including small print

### 2. BIO/ABOUT EXTRACTION (VERY IMPORTANT)
Look for ANY of these sections:
- "About Me", "About", "Summary", "Professional Summary"
- "Objective", "Career Objective", "Profile"
- "Personal Statement", "Introduction", "Overview"

If NO bio/about section exists, YOU MUST GENERATE ONE:
- Create a compelling 2-3 sentence professional bio
- Base it on their job titles, companies, and skills
- Make it sound professional and impressive
- Example: "Seasoned Software Engineer with X years of experience building scalable applications at companies like [Company]. Specializes in [main skills] with a proven track record of [achievements]."

### 3. CONTACT INFO - Extract ALL:
- Email (look everywhere, including footers)
- Phone (with country code if available)
- Location (City, Country)
- LinkedIn URL (linkedin.com/in/...)
- GitHub URL (github.com/...)
- Personal Website/Portfolio
- Other social links (Twitter, Behance, Dribbble)

### 4. CALCULATE STATS AUTOMATICALLY:
- **Years of Experience**: Calculate from the earliest job start date to today (${new Date().getFullYear()})
- **Number of Projects**: Count all projects mentioned
- **Number of Companies**: Count distinct companies in experience
- Format: { label: "Years Experience", value: "X+", icon: "📅" }

### 5. SKILLS EXTRACTION:
- Group ALL skills into logical categories:
  - Frontend, Backend, DevOps, Database, Mobile, Design, Tools, Soft Skills, etc.
- Include EVERY skill mentioned anywhere in the CV
- Don't miss certifications, tools, languages mentioned in job descriptions

### 6. EXPERIENCE ENHANCEMENT:
- Create impactful bullet points with metrics where possible
- If metrics aren't explicit, estimate reasonable ones
- Extract technologies/tools used in each role as tags
- Normalize dates to "YYYY-MM – YYYY-MM" or "YYYY-MM – Present"

### 7. PROJECTS:
- Extract ALL projects mentioned
- Include personal projects, side projects, freelance work
- Add appropriate categories (Web App, Mobile App, API, Tool, etc.)
- Extract project URLs/links if mentioned

### 8. OUTPUT RULES:
- Return ONLY valid JSON (no markdown, no explanations)
- SKIP fields that are truly empty (don't include them at all)
- Generate portfolioNameAbbr from initials (e.g., "John Doe" → "JD")
- Be generous with extraction - include anything relevant
`;

const FULL_PROMPT_TEMPLATE = `
${SYSTEM_PROMPT}

SCHEMA (TypeScript): ${portfolioDataSchema}

YOUR TASK:
1) THOROUGHLY parse the resume content below
2) Extract EVERY piece of information possible
3) GENERATE a professional bio if none exists (based on experience)
4) CALCULATE stats: years of experience, project count, company count
5) GROUP skills by category (Frontend, Backend, DevOps, etc.)
6) SKIP any truly empty fields (don't include them in JSON)

IMPORTANT REMINDERS:
- The bio (extendedBio) should NEVER be empty - generate one if needed
- Stats should have 3-4 items based on actual CV data
- Skills MUST be grouped by category, not a flat list
- Experience bullets should be impactful with action verbs

RETURN: Valid JSON matching PortfolioData schema. No markdown. No extra text.
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
      const pdfParser = new PDFParser(null, true);

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("pdf2json Error:", errData.parserError);
        reject(new Error(`PDF Parsing Failed: ${errData.parserError}`));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          // Extract text from all pages manually
          let fullText = '';

          if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
            for (const page of pdfData.Pages) {
              if (page.Texts && Array.isArray(page.Texts)) {
                for (const textItem of page.Texts) {
                  if (textItem.R && Array.isArray(textItem.R)) {
                    for (const run of textItem.R) {
                      if (run.T) {
                        // Decode URL-encoded text
                        fullText += decodeURIComponent(run.T) + ' ';
                      }
                    }
                  }
                }
                fullText += '\n';
              }
            }
          }

          if (!fullText || fullText.trim().length === 0) {
            reject(new Error('No text content found in PDF'));
            return;
          }

          console.log(`Successfully extracted ${fullText.length} characters.`);
          resolve(fullText.trim());
        } catch (e: any) {
          console.error("Error processing PDF text:", e);
          reject(new Error("Failed to process PDF text content: " + e.message));
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

    // --- DAILY LIMIT CHECK DISABLED FOR DEVELOPMENT ---
    // TODO: Re-enable this for production
    /*
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
      } else if (allowed === false) {
        const now = new Date();
        const malaysiaTime = new Date(now.getTime() + (3600000 * 8));
        const hoursLeft = 24 - malaysiaTime.getUTCHours();

        return NextResponse.json({
          error: `Daily limit reached. You can only generate 3 portfolios per day to ensure quality service. Please try again in approx ${hoursLeft} hours (tomorrow).`,
          code: 'LIMIT_REACHED'
        }, { status: 429 });
      }
    } else {
      await supabaseAdmin.rpc('check_and_increment_usage', {
        check_user_id: userId,
        limit_count: 1000
      });
    }
    */
    // ------------------------


    const formData = await req.formData();
    const cvFile = formData.get('cv') as File | null;
    const photoFile = formData.get('photo') as File | null;

    if (!cvFile) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    // Determine Provider
    const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase();
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

    // === FALLBACK: Ensure stats exist ===
    if (!parsedData.about) {
      parsedData.about = {};
    }

    // === CLEANUP: Merge skills with duplicate category names ===
    if (parsedData.about.skills && Array.isArray(parsedData.about.skills)) {
      const categoryMap = new Map<string, string[]>();

      // Group all tags by category name (case-insensitive)
      for (const skill of parsedData.about.skills) {
        const categoryKey = (skill.category || 'General').toLowerCase().trim();
        const existingTags = categoryMap.get(categoryKey) || [];

        // Add tags (handle both array and single string)
        if (Array.isArray(skill.tags)) {
          existingTags.push(...skill.tags);
        } else if (typeof skill.tags === 'string') {
          existingTags.push(skill.tags);
        }

        categoryMap.set(categoryKey, existingTags);
      }

      // Rebuild skills array with merged categories
      const mergedSkills: any[] = [];
      const categoryPriority = ['cybersecurity', 'security', 'programming', 'languages', 'frontend', 'backend', 'devops', 'tools', 'soft skills', 'general', 'other'];

      // Sort by priority, then alphabetically
      const sortedCategories = Array.from(categoryMap.keys()).sort((a, b) => {
        const aIdx = categoryPriority.findIndex(p => a.includes(p));
        const bIdx = categoryPriority.findIndex(p => b.includes(p));
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.localeCompare(b);
      });

      for (const categoryKey of sortedCategories) {
        const tags = categoryMap.get(categoryKey) || [];
        // Remove duplicates and empty strings
        const uniqueTags = [...new Set(tags.filter(t => t && t.trim()))];

        if (uniqueTags.length > 0) {
          // Title case the category name
          const categoryName = categoryKey
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          mergedSkills.push({
            category: categoryName,
            tags: uniqueTags
          });
        }
      }

      parsedData.about.skills = mergedSkills;
    }

    if (!parsedData.about.stats || parsedData.about.stats.length === 0) {
      // Calculate years of experience from earliest job
      let yearsExp = 0;
      if (parsedData.experience && parsedData.experience.length > 0) {
        const earliestYear = Math.min(
          ...parsedData.experience
            .map(exp => {
              const dateMatch = exp.dates?.match(/(\d{4})/);
              return dateMatch ? parseInt(dateMatch[1]) : new Date().getFullYear();
            })
        );
        yearsExp = new Date().getFullYear() - earliestYear;
      }

      // Count projects
      const projectCount = parsedData.projects?.length || 0;

      // Count unique companies
      const companyCount = parsedData.experience
        ? new Set(parsedData.experience.map(exp => exp.company)).size
        : 0;

      parsedData.about.stats = [
        { label: 'Years Experience', value: `${yearsExp || 3}+`, icon: '📅' },
        { label: 'Projects Completed', value: `${projectCount || 5}+`, icon: '🚀' },
        { label: 'Companies', value: `${companyCount || 2}+`, icon: '🏢' }
      ];
    }

    // === FALLBACK: Ensure professional title exists ===
    if (!parsedData.personalInfo.title && parsedData.experience && parsedData.experience.length > 0) {
      // Use the most recent job title as professional title
      parsedData.personalInfo.title = parsedData.experience[0].jobTitle || 'Professional';
    }

    // === FALLBACK: Ensure bio exists ===
    if (!parsedData.about.extendedBio && parsedData.personalInfo) {
      const name = parsedData.personalInfo.fullName || 'Professional';
      const title = parsedData.personalInfo.title || 'Professional';
      const yearsVal = parsedData.about.stats?.find(s => s.label.includes('Years'))?.value || '3+';
      const topSkills = parsedData.about.skills?.slice(0, 2).map(s => s.tags?.[0]).filter(Boolean).join(' and ') || 'modern technologies';

      parsedData.about.extendedBio = `${name} is a ${title} with ${yearsVal} years of experience specializing in ${topSkills}. Passionate about building impactful solutions and continuously learning new technologies.`;
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
        subtitle: parsedData.personalInfo.title, // Professional Title
        description: parsedData.about?.extendedBio || parsedData.personalInfo.tagline || '', // Bio/Summary
        profile_photo_url: photoURL,
        email: parsedData.personalInfo.email,
        phone: parsedData.personalInfo.phone,
        location: parsedData.personalInfo.location,
        website: parsedData.personalInfo.website,
        linkedin: parsedData.personalInfo.linkedInURL,
        github: parsedData.personalInfo.githubURL,
        experience: parsedData.experience,
        education: parsedData.education,
        skills: parsedData.about?.skills,
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
