import { generateObject } from 'ai';
import { z } from 'zod';
import { PRIMARY_MODEL } from './models';
import { SITE_GENERATION_SYSTEM_PROMPT, buildUserPrompt } from './prompts';
import type { GenerateRequest, GeneratedSite } from '@/types/project';

const GeneratedSiteSchema = z.object({
  html: z.string(),
  css: z.string(),
  title: z.string(),
  description: z.string(),
  pages: z.array(z.string()),
});

export async function generateSite(input: GenerateRequest): Promise<GeneratedSite> {
  const result = await generateObject({
    model: PRIMARY_MODEL,
    schema: GeneratedSiteSchema,
    system: SITE_GENERATION_SYSTEM_PROMPT,
    prompt: buildUserPrompt(input),
  });

  return result.object;
}
