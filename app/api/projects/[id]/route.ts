import { prisma } from '@/lib/db/prisma';
import { NextRequest } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { deployment: true },
  });

  if (!project) {
    return Response.json({ error: 'Projet introuvable' }, { status: 404 });
  }

  return Response.json(project);
}

/**
 * PUT — utilisé par le storageManager de GrapesJS (Décision 3).
 * Reçoit { grapesData: {...} } et sauvegarde en DB.
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await req.json();

  const project = await prisma.project.update({
    where: { id },
    data: {
      grapesData: body.grapesData ?? body,
      htmlOutput: body.htmlOutput ?? undefined,
      cssOutput: body.cssOutput ?? undefined,
    },
  });

  return Response.json(project);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  await prisma.deployment.deleteMany({ where: { projectId: id } });
  await prisma.project.delete({ where: { id } });

  return Response.json({ success: true });
}
