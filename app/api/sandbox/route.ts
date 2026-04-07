import { createPreviewSandbox, destroySandbox } from '@/lib/sandbox/e2b';
import { rateLimit, SANDBOX_LIMIT } from '@/lib/rateLimit';

/**
 * Sandbox E2B — onboarding uniquement (Décision 2).
 * POST : crée un sandbox pour prévisualiser le site généré.
 * DELETE : détruit le sandbox (appelé quand l'utilisateur entre dans l'éditeur).
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { allowed } = rateLimit(
    `sandbox:${ip}`,
    SANDBOX_LIMIT.max,
    SANDBOX_LIMIT.windowMs
  );

  if (!allowed) {
    return Response.json(
      { error: 'Limite de preview atteinte. Réessayez plus tard.' },
      { status: 429 }
    );
  }

  const { html, css } = await req.json();

  if (!html) {
    return Response.json({ error: 'HTML requis' }, { status: 400 });
  }

  try {
    const { url, sandboxId } = await createPreviewSandbox(html, css ?? '');
    return Response.json({ previewUrl: url, sandboxId });
  } catch (error) {
    console.error('[sandbox] E2B error:', error);
    return Response.json(
      { error: 'Erreur création preview' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { sandboxId } = await req.json();

  if (!sandboxId) {
    return Response.json({ error: 'sandboxId requis' }, { status: 400 });
  }

  await destroySandbox(sandboxId);
  return Response.json({ success: true });
}
