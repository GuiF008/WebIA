'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import EditorToolbar from '@/components/editor/EditorToolbar';
import PublishModal from '@/components/publish/PublishModal';

const GrapesEditor = dynamic(
  () => import('@/components/editor/GrapesEditor'),
  { ssr: false }
);

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  htmlOutput: string | null;
  cssOutput: string | null;
  grapesData: Record<string, unknown>;
}

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishUrl, setPublishUrl] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Projet introuvable');
        return res.json();
      })
      .then(setProject)
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSave(html: string, css: string) {
    if (!project) return;
    setSaveError(null);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ htmlOutput: html, cssOutput: css }),
      });

      if (!res.ok) {
        throw new Error('Échec de l’enregistrement');
      }
    } catch {
      setSaveError('Enregistrement échoué. Vérifiez votre connexion.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    if (!project) return;
    setPublishOpen(true);
    setIsPublishing(true);
    setPublishError(null);

    try {
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
        setPublishUrl(data.siteUrl);
      } else {
        setPublishError(data.error ?? 'Erreur de publication');
      }
    } catch {
      setPublishError('Erreur réseau');
    } finally {
      setIsPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="h-screen flex flex-col">
      <EditorToolbar
        projectId={project.id}
        projectName={project.name}
        onSave={() =>
          handleSave(project.htmlOutput ?? '', project.cssOutput ?? '')
        }
        onPublish={handlePublish}
        isSaving={isSaving}
      />
      <div className="flex-1">
        {saveError && (
          <div className="px-4 py-2 text-sm text-destructive bg-destructive/10 border-b">
            {saveError}
          </div>
        )}
        <GrapesEditor
          projectId={project.id}
          initialHtml={project.htmlOutput ?? '<p>Commencez à éditer votre site</p>'}
          initialCss={project.cssOutput ?? ''}
          onSave={handleSave}
        />
      </div>
      <PublishModal
        open={publishOpen}
        onOpenChange={setPublishOpen}
        siteUrl={publishUrl}
        isPublishing={isPublishing}
        error={publishError}
      />
    </div>
  );
}
