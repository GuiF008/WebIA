'use client';

import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  projectId: string;
  projectName: string;
  onSave: () => void;
  onPublish: () => void;
  isSaving?: boolean;
}

export default function EditorToolbar({
  projectName,
  onSave,
  onPublish,
  isSaving,
}: EditorToolbarProps) {
  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <a href="/" className="font-bold text-primary">
          OVH Builder
        </a>
        <span className="text-sm text-muted-foreground">{projectName}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button size="sm" onClick={onPublish}>
          Publier
        </Button>
      </div>
    </div>
  );
}
