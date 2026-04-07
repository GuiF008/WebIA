import { prisma } from '@/lib/db/prisma';

export async function GET() {
  // TODO: filtrer par userId une fois l'auth en place
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { deployment: true },
  });

  return Response.json(projects);
}

export async function POST(req: Request) {
  const { name, description, html, css, grapesData } = await req.json();

  if (!name) {
    return Response.json({ error: 'Nom du projet requis' }, { status: 400 });
  }

  // TODO: récupérer userId depuis la session auth
  const PLACEHOLDER_USER_ID = 'temp-user';

  let user = await prisma.user.findUnique({
    where: { id: PLACEHOLDER_USER_ID },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { id: PLACEHOLDER_USER_ID, email: 'temp@builder.ovh' },
    });
  }

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name,
      description,
      htmlOutput: html ?? null,
      cssOutput: css ?? null,
      grapesData: grapesData ?? {},
    },
  });

  return Response.json(project, { status: 201 });
}
