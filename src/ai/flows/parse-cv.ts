'use server';
/**
 * @fileOverview A CV parsing AI agent.
 *
 * - parseCV - A function that handles the CV parsing process.
 * - ParseCvInput - The input type for the parseCV function.
 * - ParseCvOutput - The return type for the parseCV function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { PortfolioData } from '@/templates/types';


const ParseCvInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      "A CV/resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseCvInput = z.infer<typeof ParseCvInputSchema>;


const PortfolioDataSchema: z.ZodType<PortfolioData> = z.object({
    person: z.object({
        fullName: z.string().describe("The full name of the person."),
        headline: z.string().describe("The professional headline or current role (e.g., 'Senior Software Engineer')."),
        summary: z.string().describe("A 2-4 sentence professional summary from the CV."),
    }),
    contact: z.object({
        email: z.string().describe("Email address"),
        phone: z.string().optional().describe("Phone number"),
        location: z.string().optional().describe("City and country, e.g., 'San Francisco, USA'"),
        website: z.string().optional().describe("Personal website or portfolio URL"),
        linkedin: z.string().optional().describe("LinkedIn profile URL"),
        github: z.string().optional().describe("GitHub profile URL"),
    }),
    experience: z.array(z.object({
        role: z.string().describe("Job title or role."),
        company: z.string().describe("Company name."),
        location: z.string().optional().describe("Job location."),
        startDate: z.string().describe("Start date, normalized to YYYY-MM if possible."),
        endDate: z.string().describe("End date or 'Present', normalized to YYYY-MM if possible."),
        bullets: z.array(z.string()).describe("List of key achievements or responsibilities, as concise bullet points."),
    })).describe("Professional experience, ordered chronologically from most recent to oldest."),
    projects: z.array(z.object({
        name: z.string().describe("Project name."),
        description: z.string().describe("A brief description of the project."),
        tech: z.array(z.string()).describe("List of technologies used."),
        links: z.array(z.object({ url: z.string().url() })).optional().describe("Links related to the project."),
        impact: z.string().optional().describe("The impact or outcome of the project."),
    })).describe("Personal or professional projects."),
    education: z.array(z.object({
        degree: z.string().describe("The degree obtained (e.g., 'B.Sc. in Computer Science')."),
        field: z.string().optional().describe("The field of study."),
        institution: z.string().describe("Name of the university or institution."),
        startDate: z.string().describe("Start date/year."),
        endDate: z.string().describe("End date/year."),
        notes: z.string().optional().describe("Any honors or additional notes."),
    })).describe("Education history."),
    skills: z.array(z.string()).describe("A de-duplicated and clustered list of technical and soft skills."),
    certifications: z.array(z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string(),
    })).optional().describe("Professional certifications."),
    awards: z.array(z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string(),
    })).optional().describe("Awards and recognitions."),
    languages: z.array(z.object({
        name: z.string(),
        level: z.string(),
    })).optional().describe("Languages spoken and proficiency level."),
    interests: z.array(z.string()).optional().describe("Personal interests."),
    photoUrl: z.string().optional().nullable().describe('Placeholder for photo URL, which is handled separately.')
});


export type ParseCvOutput = z.infer<typeof PortfolioDataSchema>;

export async function parseCV(input: ParseCvInput): Promise<ParseCvOutput> {
  return parseCvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseCvPrompt',
  input: { schema: ParseCvInputSchema },
  output: { schema: PortfolioDataSchema },
  prompt: `You are an expert HR assistant specializing in parsing CVs and resumes. Your task is to extract structured information from the provided document.

Follow these rules strictly:
1.  Extract all fields specified in the output schema.
2.  For experience, list items chronologically, with the most recent job first.
3.  Clean up experience bullets: remove leading symbols and keep them as concise, action-oriented statements.
4.  Normalize dates to YYYY-MM format where possible (e.g., "June 2021" becomes "2021-06"). For years only, use "YYYY".
5.  For skills, create a clean, de-duplicated list. Cluster similar skills (e.g., 'JS' and 'JavaScript' should become one entry).
6.  If a section (like awards or certifications) is not present, return an empty array for it. Do not invent data.

CV Document:
{{media url=cvDataUri}}`,
});

const parseCvFlow = ai.defineFlow(
  {
    name: 'parseCvFlow',
    inputSchema: ParseCvInputSchema,
    outputSchema: PortfolioDataSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to parse the CV.');
    }
    return output;
  }
);
