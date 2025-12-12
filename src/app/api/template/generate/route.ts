import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
// import { adminDb } from '@/lib/firebase-admin'; // Disabled: Firebase not initialized
import { promises as fs } from 'fs';
import path from 'path';

const AI_TEMPLATE_PROMPT = `
You are a professional web designer and React developer.  
Generate a **unique, fully responsive portfolio layout** using Tailwind CSS, based on this data:

[USER DATA]
{{name}}, {{title}}, {{summary}}, {{skills}}, {{experience}}, {{projects}}, {{education}}

Goals:
- Use a premium, modern design with creative layouts and spacing.
- Include sections: Hero (name, title, summary), Skills grid, Experience timeline, Projects gallery, Education block.
- Use Apple/Framer-inspired visual style with subtle shadows and gradients.
- Output should be a single React component named 
- Use <main className="max-w-6xl mx-auto px-6 py-20 bg-white text-gray-900">
- Include smooth hover transitions and responsive breakpoints.
- Return only the component code (JSX + Tailwind classes) with placeholders replaced by user data variables.

Example:
<h1 className="text-5xl font-bold">{user.name}</h1>
`;

export async function POST(req: NextRequest) {
  try {
    const { portfolioId } = await req.json();

    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }

    // TODO: Re-implement for Supabase
    // For now, return error to prevent build failure due to missing firebase-admin
    return NextResponse.json({ error: 'AI Generation temporarily disabled during migration to Supabase' }, { status: 503 });

    /* 
    // 1. Fetch portfolio data from Firestore
    const docRef = adminDb.collection('portfolios').doc(portfolioId as string);
    // ... rest of logic
    */
    /*
    const { text } = await streamText({
      model: model,
      prompt: prompt,
    });

    let componentCode = '';
    const reader = text.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      componentCode += value;
    }

    // 4. Save the generated component to a file
    const templateName = `AIGenerated_${portfolioId}.tsx`;
    const templatesDir = path.join(process.cwd(), 'src', 'templates', 'generated');
    await fs.mkdir(templatesDir, { recursive: true });
    const filePath = path.join(templatesDir, templateName);
    await fs.writeFile(filePath, componentCode);

    return NextResponse.json({ templateName });
    */

  } catch (error: any) {
    console.error('Error generating AI template:', error);
    return NextResponse.json({ error: 'Failed to generate AI template.' }, { status: 500 });
  }
}
