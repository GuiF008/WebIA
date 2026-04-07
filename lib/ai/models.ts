import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

export const PRIMARY_MODEL = anthropic('claude-sonnet-4-6');
export const FALLBACK_MODEL = openai('gpt-4o');
