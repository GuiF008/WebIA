import { prisma } from '@/lib/db/prisma';
import { uploadSite } from '@/lib/ovh/storage';
import type { PublishRequest } from '@/types/project';

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<PublishRequest>;

  if (!body.projectId || !body.editorHtml) {
    return Response.json({ error: 'Données manquantes' }, { status: 400 });
  }

  try {
    const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${body.title ?? 'Mon site'}</title>
  <meta name="description" content="${body.description ?? ''}">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    img { max-width: 100%; height: auto; }
    ${body.editorCss ?? ''}
  </style>
</head>
<body>${body.editorHtml}</body>
</html>`;

    const siteUrl = await uploadSite(body.projectId, [
      {
        key: 'index.html',
        content: fullHtml,
        contentType: 'text/html; charset=utf-8',
      },
    ]);

    await prisma.project.update({
      where: { id: body.projectId },
      data: {
        htmlOutput: fullHtml,
        cssOutput: body.editorCss ?? null,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        deployment: {
          upsert: {
            create: {
              type: 'STATIC',
              ovhBucketName: process.env.OVH_STORAGE_BUCKET,
              ovhBucketUrl: siteUrl,
            },
            update: {
              ovhBucketUrl: siteUrl,
              lastDeployedAt: new Date(),
            },
          },
        },
      },
    });

    return Response.json({
      success: true,
      siteUrl,
      message: 'Site publié avec succès',
    });
  } catch (error) {
    console.error('[publish] Error:', error);
    return Response.json(
      { error: 'Erreur lors de la publication' },
      { status: 500 }
    );
  }
}
