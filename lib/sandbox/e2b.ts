import { Sandbox } from '@e2b/code-interpreter';

/**
 * Crée un sandbox E2B pour la preview du site généré.
 * IMPORTANT (Décision 2) : sandbox réservé à l'onboarding uniquement.
 * Dans l'éditeur GrapesJS, la preview intégrée (iframe locale) est utilisée.
 * Le sandbox doit être détruit dès que l'utilisateur entre dans l'éditeur.
 */
export async function createPreviewSandbox(html: string, css: string): Promise<{
  url: string;
  sandboxId: string;
}> {
  const sandbox = await Sandbox.create({
    timeoutMs: 60_000,
  });

  const fullHtml = css
    ? html.replace('</head>', `<style>${css}</style></head>`)
    : html;

  await sandbox.files.write('/home/user/index.html', fullHtml);

  await sandbox.commands.run(
    'cd /home/user && python3 -m http.server 3000 &',
    { background: true }
  );

  const host = sandbox.getHost(3000);

  return {
    url: `https://${host}`,
    sandboxId: sandbox.sandboxId,
  };
}

export async function destroySandbox(sandboxId: string): Promise<void> {
  try {
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.kill();
  } catch {
    // Sandbox déjà expiré ou détruit
  }
}
