import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Netlify API for deploying sites
const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID; // Optional: for a single site

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { portfolioId, templateId, portfolioData } = await req.json();

    if (!portfolioId || !templateId || !portfolioData) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Verify portfolio belongs to user
    const { data: portfolio, error: portfolioError } = await supabaseAdmin
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .eq('user_id', user.id)
      .single();

    if (portfolioError || !portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Generate static HTML for the portfolio
    const html = generatePortfolioHTML(portfolioData, templateId);

    // For now, we'll generate a preview URL
    // In production, you would deploy to Netlify using their API

    if (NETLIFY_API_TOKEN) {
      // Deploy to Netlify
      const deployResult = await deployToNetlify(html, portfolioData.personalInfo.fullName);

      // Update portfolio with published URL
      await supabaseAdmin
        .from('portfolios')
        .update({
          status: 'published',
          published_url: deployResult.url,
          published_at: new Date().toISOString()
        })
        .eq('id', portfolioId);

      return NextResponse.json({
        success: true,
        url: deployResult.url,
        message: 'Portfolio published successfully!'
      });
    } else {
      // No Netlify token - return preview URL instead
      // No Netlify token - return preview URL instead
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9003');
      const previewUrl = `${baseUrl}/portfolio/${portfolioId}?template=${templateId}`;

      // Update portfolio status
      await supabaseAdmin
        .from('portfolios')
        .update({
          status: 'published',
          template_id: templateId,
          published_url: previewUrl,
          published_at: new Date().toISOString()
        })
        .eq('id', portfolioId);

      return NextResponse.json({
        success: true,
        url: previewUrl,
        message: 'Portfolio published! (Preview mode - configure Netlify for production deployment)'
      });
    }

  } catch (error: any) {
    console.error('Error publishing portfolio:', error);
    return NextResponse.json({ error: error.message || 'Failed to publish' }, { status: 500 });
  }
}

// Deploy to Netlify
async function deployToNetlify(html: string, name: string): Promise<{ url: string }> {
  const siteName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);

  // Create a zip file with the HTML
  // For simplicity, we'll use the Netlify deploy API directly

  const response = await fetch('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `portfolio-${siteName}-${Date.now()}`,
      custom_domain: null,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create Netlify site');
  }

  const site = await response.json();

  // Deploy the HTML
  const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/deploys`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
      'Content-Type': 'application/zip',
    },
    body: createDeployZip(html),
  });

  if (!deployResponse.ok) {
    throw new Error('Failed to deploy to Netlify');
  }

  return { url: site.ssl_url || site.url };
}

// Create a simple deploy package
function createDeployZip(html: string): Buffer {
  // For a real implementation, you would create a proper zip file
  // For now, we'll use Netlify's file digest approach
  return Buffer.from(html);
}

// Generate static HTML for the portfolio
function generatePortfolioHTML(data: any, templateId: string): string {
  const { personalInfo, about, experience = [], projects = [], education = [], certifications = [], languages = [] } = data;

  // Generate inline CSS based on template
  const styles = getTemplateStyles(templateId);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.fullName} - Portfolio</title>
  <meta name="description" content="${personalInfo.tagline || personalInfo.title}">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
  <main class="container">
    <header class="hero">
      ${personalInfo.profilePhotoURL ? `<img src="${personalInfo.profilePhotoURL}" alt="${personalInfo.fullName}" class="avatar">` : ''}
      <h1>${personalInfo.fullName}</h1>
      <p class="title">${personalInfo.title || ''}</p>
      ${personalInfo.tagline ? `<p class="tagline">${personalInfo.tagline}</p>` : ''}
      <div class="social-links">
        ${personalInfo.email ? `<a href="mailto:${personalInfo.email}">Email</a>` : ''}
        ${personalInfo.linkedInURL ? `<a href="${personalInfo.linkedInURL}" target="_blank">LinkedIn</a>` : ''}
        ${personalInfo.githubURL ? `<a href="${personalInfo.githubURL}" target="_blank">GitHub</a>` : ''}
        ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank">Website</a>` : ''}
      </div>
    </header>

    ${about?.extendedBio ? `
    <section class="section">
      <h2>About</h2>
      <p>${about.extendedBio}</p>
    </section>
    ` : ''}

    ${about?.skills?.length ? `
    <section class="section">
      <h2>Skills</h2>
      <div class="skills">
        ${about.skills.flatMap((s: any) => s.tags).map((tag: string) => `<span class="skill-tag">${tag}</span>`).join('')}
      </div>
    </section>
    ` : ''}

    ${experience.length ? `
    <section class="section">
      <h2>Experience</h2>
      ${experience.map((exp: any) => `
        <article class="experience-item">
          <div class="exp-header">
            <h3>${exp.jobTitle}</h3>
            <span class="dates">${exp.dates}</span>
          </div>
          <p class="company">${exp.company}${exp.location ? ` · ${exp.location}` : ''}</p>
          <ul>
            ${exp.responsibilities.map((r: string) => `<li>${r}</li>`).join('')}
          </ul>
          ${exp.tags?.length ? `<div class="tags">${exp.tags.map((t: string) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        </article>
      `).join('')}
    </section>
    ` : ''}

    ${projects.length ? `
    <section class="section">
      <h2>Projects</h2>
      <div class="projects-grid">
        ${projects.map((p: any) => `
          <article class="project-card">
            <h3>${p.name}</h3>
            ${p.description ? `<p>${p.description}</p>` : ''}
            ${p.tags?.length ? `<div class="tags">${p.tags.map((t: string) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
            ${p.detailsURL ? `<a href="${p.detailsURL}" target="_blank" class="project-link">View Project →</a>` : ''}
          </article>
        `).join('')}
      </div>
    </section>
    ` : ''}

    ${education.length ? `
    <section class="section">
      <h2>Education</h2>
      ${education.map((edu: any) => `
        <article class="education-item">
          <h3>${edu.degree}</h3>
          <p>${edu.institution}</p>
          <span class="dates">${edu.startDate} — ${edu.endDate}</span>
        </article>
      `).join('')}
    </section>
    ` : ''}

    <footer>
      <p>Built with <a href="https://ultrafolio.dev" target="_blank">UltraFolio</a></p>
    </footer>
  </main>
</body>
</html>`;
}

function getTemplateStyles(templateId: string): string {
  const baseStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .hero { text-align: center; margin-bottom: 4rem; padding-top: 4rem; }
    .avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; }
    h1 { font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem; }
    .title { font-size: 1.25rem; opacity: 0.7; margin-bottom: 1rem; }
    .tagline { max-width: 600px; margin: 0 auto 1.5rem; opacity: 0.6; }
    .social-links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .social-links a { text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.5rem; transition: all 0.2s; }
    .section { margin-bottom: 3rem; }
    .section h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.5; margin-bottom: 1.5rem; }
    .skills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill-tag, .tag { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
    .experience-item, .education-item { margin-bottom: 2rem; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; }
    .exp-header h3 { font-size: 1.125rem; }
    .company { opacity: 0.6; margin-bottom: 0.5rem; }
    .dates { font-size: 0.875rem; opacity: 0.5; font-family: monospace; }
    ul { margin-left: 1.25rem; margin-top: 0.5rem; }
    li { margin-bottom: 0.25rem; opacity: 0.8; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .project-card { padding: 1.5rem; border-radius: 1rem; }
    .project-card h3 { margin-bottom: 0.5rem; }
    .project-card p { font-size: 0.875rem; opacity: 0.7; margin-bottom: 0.75rem; }
    .project-link { font-size: 0.875rem; text-decoration: none; font-weight: 500; }
    footer { text-align: center; padding-top: 3rem; opacity: 0.4; font-size: 0.875rem; }
    footer a { color: inherit; }
  `;

  const themeStyles: { [key: string]: string } = {
    'executive': `
      body { background: #0a0a0a; color: #ededed; }
      .social-links a { background: rgba(255,255,255,0.1); color: #ededed; }
      .social-links a:hover { background: rgba(255,255,255,0.2); }
      .skill-tag, .tag { background: rgba(255,255,255,0.1); color: #a3a3a3; }
      .project-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
      .project-link { color: #8b5cf6; }
    `,
    'creative': `
      body { background: #fafafa; color: #171717; }
      h1 { background: linear-gradient(to right, #ec4899, #8b5cf6, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .social-links a { background: #f3f4f6; color: #374151; }
      .social-links a:hover { background: linear-gradient(to right, #ec4899, #8b5cf6); color: white; }
      .skill-tag, .tag { background: #f3f4f6; color: #6b7280; }
      .project-card { background: linear-gradient(135deg, #fafafa, #ffffff); border: 1px solid #e5e7eb; }
      .project-link { color: #8b5cf6; }
    `,
    'minimal-plus': `
      body { background: #fafafa; color: #171717; }
      .social-links a { background: transparent; border: 1px solid #e5e7eb; color: #6b7280; }
      .social-links a:hover { border-color: #171717; color: #171717; }
      .skill-tag, .tag { background: #f5f5f5; border: 1px solid #e5e7eb; color: #525252; }
      .project-card { background: transparent; border: none; padding: 1rem 0; border-bottom: 1px solid #e5e7eb; border-radius: 0; }
      .project-link { color: #2563eb; }
    `,
  };

  return baseStyles + (themeStyles[templateId] || themeStyles['executive']);
}
