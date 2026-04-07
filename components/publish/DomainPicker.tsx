'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getDomainSetupInstructions } from '@/lib/ovh/domain';

interface DomainPickerProps {
  cdnUrl: string;
}

export default function DomainPicker({ cdnUrl }: DomainPickerProps) {
  const [domain, setDomain] = useState('');
  const [instructions, setInstructions] = useState<string[] | null>(null);

  function handleSetup() {
    if (!domain.trim()) return;
    const result = getDomainSetupInstructions(domain.trim(), cdnUrl);
    setInstructions(result.instructions);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domaine personnalisé</CardTitle>
        <CardDescription>
          Connectez votre propre nom de domaine à votre site.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="domain">Votre nom de domaine</Label>
          <div className="flex gap-2">
            <Input
              id="domain"
              placeholder="www.mon-entreprise.fr"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <Button onClick={handleSetup}>Configurer</Button>
          </div>
        </div>

        {instructions && (
          <div className="bg-muted p-4 rounded-lg text-sm space-y-1">
            {instructions.map((line, i) => (
              <p key={i} className="font-mono">
                {line}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
