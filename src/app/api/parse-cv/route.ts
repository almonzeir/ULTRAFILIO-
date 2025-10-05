import { NextRequest, NextResponse } from 'next/server';
import type { PortfolioData } from '@/templates/types';

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESUME_PARSER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const formData = await req.formData();
  const cvFile = formData.get('cv') as File;

  if (!cvFile) {
    return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
  }

  const myHeaders = new Headers();
  myHeaders.append("apikey", apiKey);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: cvFile,
  };

  try {
    const response = await fetch("https://api.apilayer.com/resume_parser/upload", requestOptions);
    const result = await response.json();

    // Basic mapping from APILayer response to PortfolioData structure
    const portfolioData: PortfolioData = {
      personalInfo: {
        fullName: result.name || '',
        portfolioNameAbbr: result.name ? result.name.split(' ').map((n: string) => n[0]).join('') : '',
        title: result.job_title || '',
        tagline: result.objective || '',
        email: result.email || '',
        linkedInURL: result.linkedin_url || '',
        location: result.address || '',
        profilePhotoURL: '', // This will be handled on the client-side for now
      },
      about: {
        extendedBio: result.objective || '',
        stats: [], // APILayer doesn't directly provide stats, would need to derive
        skills: result.skills?.map((s: any) => ({ category: "General", icon: "code", tags: [s.skill] })) || []
      },
      experience: result.experience?.map((exp: any) => ({
        jobTitle: exp.title || '',
        company: exp.organization || '',
        location: exp.location || '',
        dates: `${exp.start_date || ''} - ${exp.end_date || ''}`,
        responsibilities: exp.description ? exp.description.split('\n').filter((b: string) => b) : [],
        tags: [], // APILayer doesn't directly provide tags for experience
      })) || [],
      education: result.education?.map((edu: any) => ({
        degree: edu.degree || '',
        institution: edu.organization || '',
        startDate: edu.start_date || '',
        endDate: edu.end_date || '',
      })) || [],
      projects: [], // APILayer doesn't typically parse projects in detail
    };

    return NextResponse.json(portfolioData);

  } catch (error) {
    console.error('Error parsing CV:', error);
    return NextResponse.json({ error: 'Failed to parse CV' }, { status: 500 });
  }
}