'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
  deployment: {
    ovhBucketUrl: string | null;
  } | null;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Impossible de charger les projets');
        }
        return res.json();
      })
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">OVH Website Builder</h1>
          <Button onClick={() => (window.location.href = '/projects/new')}>
            + Nouveau site
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Mes sites</h2>
          <p className="text-muted-foreground mt-1">
            Gérez et publiez vos sites web.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-48" />
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">Aucun site pour le moment</p>
              <p className="text-sm text-muted-foreground">
                Créez votre premier site en quelques minutes grâce à l&apos;IA.
              </p>
              <Button onClick={() => (window.location.href = '/projects/new')}>
                Créer mon premier site
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge
                      variant={
                        project.status === 'PUBLISHED' ? 'default' : 'secondary'
                      }
                    >
                      {project.status === 'PUBLISHED' ? 'En ligne' : 'Brouillon'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description ?? 'Aucune description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.deployment?.ovhBucketUrl && (
                    <a
                      href={project.deployment.ovhBucketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline truncate block"
                    >
                      {project.deployment.ovhBucketUrl}
                    </a>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Modifié le{' '}
                    {new Date(project.updatedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        (window.location.href = `/projects/${project.id}`)
                      }
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        (window.location.href = `/projects/${project.id}/publish`)
                      }
                    >
                      {project.status === 'PUBLISHED' ? 'Republier' : 'Publier'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
