import { NextRequest } from 'next/server';
import { AI_COPILOT_SYSTEM_PROMPT } from '@/lib/ai/prompts';

/**
 * Proxy pour le plugin grapesjs-ai-copilot.
 * La clé API Anthropic reste côté serveur — jamais exposée au client.
 * Le plugin est configuré pour pointer vers cette route (apiUrl).
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const anthropicBody = {
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: AI_COPILOT_SYSTEM_PROMPT,
    messages: body.messages ?? [{ role: 'user', content: body.prompt ?? '' }],
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(anthropicBody),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[ai-copilot/proxy] Anthropic error:', error);
    return Response.json(
      { error: 'Erreur du service IA' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data);
}
