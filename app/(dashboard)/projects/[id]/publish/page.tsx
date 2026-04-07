'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DomainPicker from '@/components/publish/DomainPicker';

interface PublishData {
  success: boolean;
  siteUrl: string;
  message: string;
}

export default function PublishPage() {
  const params = useParams<{ id: string }>();
  const [result, setResult] = useState<PublishData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function publishSite() {
      try {
        const projectRes = await fetch(`/api/projects/${params.id}`);
        if (!projectRes.ok) throw new Error('Projet introuvable');
        const project = await projectRes.json();

        const res = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project.id,
            editorHtml: project.htmlOutput,
            editorCss: project.cssOutput,
            title: project.name,
            description: project.description ?? '',
          }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null);
          throw new Error(errorBody?.error ?? 'Erreur de publication');
        }

        const data = await res.json();
        if (data.success) {
          setResult(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inattendue');
      } finally {
        setLoading(false);
      }
    }

    publishSite();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-lg font-medium">Publication en cours...</p>
        <p className="text-sm text-muted-foreground">
          Déploiement sur l&apos;infrastructure OVHcloud
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-destructive font-medium">Erreur de publication</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl">Site publié avec succès !</CardTitle>
            <CardDescription>
              Votre site est en ligne et accessible au monde entier.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result?.siteUrl && (
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <Badge>URL</Badge>
                <a
                  href={result.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline truncate flex-1"
                >
                  {result.siteUrl}
                </a>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  result?.siteUrl && navigator.clipboard.writeText(result.siteUrl)
                }
              >
                Copier le lien
              </Button>
              <Button
                onClick={() =>
                  result?.siteUrl && window.open(result.siteUrl, '_blank')
                }
              >
                Ouvrir le site
              </Button>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  (window.location.href = `/projects/${params.id}`)
                }
              >
                Modifier le site
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => (window.location.href = '/')}
              >
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>

        {result?.siteUrl && <DomainPicker cdnUrl={result.siteUrl} />}
      </div>
    </div>
  );
}
