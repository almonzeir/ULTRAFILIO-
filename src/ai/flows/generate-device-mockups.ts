'use server';
/**
 * @fileOverview Generates device mockups of a portfolio using generative AI.
 *
 * - generateDeviceMockups - A function that generates device mockups for a given portfolio.
 * - GenerateDeviceMockupsInput - The input type for the generateDeviceMockups function.
 * - GenerateDeviceMockupsOutput - The return type for the generateDeviceMockups function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDeviceMockupsInputSchema = z.object({
  portfolioDataUri: z
    .string()
    .describe(
      'A data URI of the portfolio to generate device mockups for. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  deviceType: z.string().describe('The type of device to generate a mockup for (e.g., MacBook, iPhone).'),
});

export type GenerateDeviceMockupsInput = z.infer<typeof GenerateDeviceMockupsInputSchema>;

const GenerateDeviceMockupsOutputSchema = z.object({
  deviceMockupDataUri: z
    .string()
    .describe(
      'A data URI of the generated device mockup image. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type GenerateDeviceMockupsOutput = z.infer<typeof GenerateDeviceMockupsOutputSchema>;

export async function generateDeviceMockups(
  input: GenerateDeviceMockupsInput
): Promise<GenerateDeviceMockupsOutput> {
  return generateDeviceMockupsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDeviceMockupsPrompt',
  input: {schema: GenerateDeviceMockupsInputSchema},
  output: {schema: GenerateDeviceMockupsOutputSchema},
  prompt: `Generate a device mockup for a portfolio as it appears on a {{{deviceType}}}.

  Use the following portfolio data to generate the mockup.
  {{media url=portfolioDataUri}}
  `,
});

const generateDeviceMockupsFlow = ai.defineFlow(
  {
    name: 'generateDeviceMockupsFlow',
    inputSchema: GenerateDeviceMockupsInputSchema,
    outputSchema: GenerateDeviceMockupsOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: [
        {
          media: {url: input.portfolioDataUri},
        },
        {
          text: `generate an image of this portfolio as it appears on a ${input.deviceType}`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('No mockup was generated.');
    }

    return {deviceMockupDataUri: media.url};
  }
);
