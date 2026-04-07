import { generateSite } from '@/lib/ai/generate';
import { rateLimit, GENERATE_LIMIT } from '@/lib/rateLimit';
import type { GenerateRequest } from '@/types/project';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { allowed, remaining } = rateLimit(
    `generate:${ip}`,
    GENERATE_LIMIT.max,
    GENERATE_LIMIT.windowMs
  );

  if (!allowed) {
    return Response.json(
      {
        error: 'Limite de génération atteinte. Réessayez dans 1 heure.',
        remaining,
      },
      { status: 429 }
    );
  }

  const body = (await req.json()) as Partial<GenerateRequest>;

  if (!body.sector || !body.businessName || !body.description) {
    return Response.json(
      { error: 'Champs requis manquants : sector, businessName, description' },
      { status: 400 }
    );
  }

  try {
    const site = await generateSite(body as GenerateRequest);
    return Response.json(site);
  } catch (error) {
    console.error('[generate] LLM error:', error);
    const message =
      error instanceof Error ? error.message : 'Erreur de génération';
    return Response.json({ error: message }, { status: 500 });
  }
}
