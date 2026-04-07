'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PromptInput from './PromptInput';
import PreviewFrame from './PreviewFrame';
import type { GeneratedSite } from '@/types/project';

const COLOR_PALETTES = [
  {
    id: 'modern',
    name: 'Moderne',
    colors: ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],
    value: 'Palette moderne et professionnelle : bleu nuit, bleu foncé, bleu profond, rouge accent',
  },
  {
    id: 'nature',
    name: 'Nature',
    colors: ['#2d6a4f', '#40916c', '#52b788', '#b7e4c7'],
    value: 'Palette naturelle et apaisante : vert forêt, vert moyen, vert clair, vert pâle',
  },
  {
    id: 'warm',
    name: 'Chaleureux',
    colors: ['#6b2737', '#c44536', '#e76f51', '#f4a261'],
    value: 'Palette chaleureuse et accueillante : bordeaux, rouge brique, terracotta, orange doré',
  },
];

type Step = 'info' | 'palette' | 'generating' | 'preview';

export default function OnboardingSteps() {
  const [step, setStep] = useState<Step>('info');
  const [form, setForm] = useState({
    businessName: '',
    sector: '',
    description: '',
    colorPalette: '',
  });
  const [generatedSite, setGeneratedSite] = useState<GeneratedSite | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isInfoComplete = form.businessName && form.sector && form.description;

  async function handleGenerate() {
    setStep('generating');
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.error ?? 'Erreur de génération');
      }

      const site: GeneratedSite = await res.json();
      setGeneratedSite(site);

      const sandboxRes = await fetch('/api/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: site.html, css: site.css }),
      });

      if (sandboxRes.ok) {
        const { previewUrl: url, sandboxId: id } = await sandboxRes.json();
        setPreviewUrl(url);
        setSandboxId(id);
      }

      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
      setStep('palette');
    }
  }

  async function handleEdit() {
    if (!generatedSite) return;

    // Détruire le sandbox E2B avant d'entrer dans l'éditeur (Décision 2)
    if (sandboxId) {
      try {
        await fetch('/api/sandbox', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sandboxId }),
        });
      } catch {
        // On continue même si le cleanup échoue, mais on l'attend bien
      }
    }

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.businessName,
        description: form.description,
        html: generatedSite.html,
        css: generatedSite.css,
        grapesData: {},
      }),
    });

    if (res.ok) {
      const project = await res.json();
      window.location.href = `/projects/${project.id}`;
    }
  }

  async function handlePublishDirect() {
    if (!generatedSite) return;

    if (sandboxId) {
      try {
        await fetch('/api/sandbox', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sandboxId }),
        });
      } catch {
        // On continue même si le cleanup échoue, mais on l'attend bien
      }
    }

    const projectRes = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.businessName,
        description: form.description,
        html: generatedSite.html,
        css: generatedSite.css,
        grapesData: {},
      }),
    });

    if (projectRes.ok) {
      const project = await projectRes.json();
      window.location.href = `/projects/${project.id}/publish`;
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {(['info', 'palette', 'preview'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                step === s || (step === 'generating' && s === 'palette')
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            <span className="hidden sm:inline text-muted-foreground">
              {s === 'info' && 'Informations'}
              {s === 'palette' && 'Style'}
              {s === 'preview' && 'Aperçu'}
            </span>
            {i < 2 && (
              <div className="w-8 h-px bg-border" />
            )}
          </div>
        ))}
      </div>

      {/* Étape 1 : Informations */}
      {step === 'info' && (
        <Card>
          <CardHeader>
            <CardTitle>Décrivez votre projet</CardTitle>
            <CardDescription>
              L&apos;IA va créer un site web professionnel à partir de vos
              informations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PromptInput
              businessName={form.businessName}
              sector={form.sector}
              description={form.description}
              onChange={handleChange}
            />
            <Button
              className="w-full"
              disabled={!isInfoComplete}
              onClick={() => setStep('palette')}
            >
              Continuer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Étape 2 : Palette */}
      {step === 'palette' && (
        <Card>
          <CardHeader>
            <CardTitle>Choisissez un style</CardTitle>
            <CardDescription>
              Sélectionnez une palette de couleurs pour votre site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => handleChange('colorPalette', palette.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    form.colorPalette === palette.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    {palette.colors.map((color) => (
                      <div
                        key={color}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="font-medium text-sm">{palette.name}</p>
                </button>
              ))}
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('info')}>
                Retour
              </Button>
              <Button className="flex-1" onClick={handleGenerate}>
                Générer mon site
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2b : Génération en cours */}
      {step === 'generating' && (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-lg font-medium">
              Génération de votre site en cours...
            </p>
            <p className="text-sm text-muted-foreground">
              L&apos;IA crée un site professionnel adapté à votre activité.
              Cela prend environ 15-30 secondes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Étape 3 : Aperçu */}
      {step === 'preview' && generatedSite && (
        <Card>
          <CardHeader>
            <CardTitle>Votre site est prêt !</CardTitle>
            <CardDescription>
              Aperçu de <strong>{generatedSite.title}</strong> — vous pouvez le
              modifier ou le publier directement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PreviewFrame
              previewUrl={previewUrl}
              html={generatedSite.html}
              css={generatedSite.css}
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleEdit}>
                Modifier dans l&apos;éditeur
              </Button>
              <Button className="flex-1" onClick={handlePublishDirect}>
                Publier tel quel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
