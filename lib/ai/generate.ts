import { generateObject } from 'ai';
import { z } from 'zod';
import { FALLBACK_MODEL, PRIMARY_MODEL } from './models';
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
  const prompt = buildUserPrompt(input);
  const hasAnthropic = isUsableKey(process.env.ANTHROPIC_API_KEY);
  const hasOpenAI = isUsableKey(process.env.OPENAI_API_KEY);

  if (!hasAnthropic && !hasOpenAI) {
    throw new Error('Aucune clé IA valide configurée (Anthropic/OpenAI).');
  }

  if (hasAnthropic) {
    try {
      const primary = await generateObject({
        model: PRIMARY_MODEL,
        schema: GeneratedSiteSchema,
        system: SITE_GENERATION_SYSTEM_PROMPT,
        prompt,
      });
      return primary.object;
    } catch (error) {
      console.warn('[generate] Primary model failed, trying fallback:', error);
    }
  }

  if (!hasOpenAI) {
    throw new Error(
      'La génération Anthropic a échoué et aucune clé OpenAI valide n’est configurée.'
    );
  }

  const fallback = await generateObject({
    model: FALLBACK_MODEL,
    schema: GeneratedSiteSchema,
    system: SITE_GENERATION_SYSTEM_PROMPT,
    prompt,
  });

  return fallback.object;
}

function isUsableKey(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.endsWith('...')) return false;
  return true;
}
