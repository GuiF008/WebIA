'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PromptInputProps {
  businessName: string;
  sector: string;
  description: string;
  onChange: (field: string, value: string) => void;
}

const SECTORS = [
  'Restaurant / Café',
  'Artisan / BTP',
  'Coiffeur / Beauté',
  'Portfolio / Créatif',
  'Consultant / Freelance',
  'Commerce de proximité',
  'Association',
  'Santé / Bien-être',
  'Immobilier',
  'Autre',
];

export default function PromptInput({
  businessName,
  sector,
  description,
  onChange,
}: PromptInputProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessName">Nom de votre entreprise</Label>
        <Input
          id="businessName"
          placeholder="Ex : Boulangerie du Parc"
          value={businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sector">Secteur d&apos;activité</Label>
        <select
          id="sector"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={sector}
          onChange={(e) => onChange('sector', e.target.value)}
        >
          <option value="">Choisissez un secteur...</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Décrivez votre activité en quelques phrases
        </Label>
        <Textarea
          id="description"
          placeholder="Ex : Boulangerie artisanale dans le 15e arrondissement, spécialités pain au levain et viennoiseries, ouverte du mardi au dimanche..."
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
