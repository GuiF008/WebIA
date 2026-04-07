'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteUrl: string | null;
  isPublishing: boolean;
  error: string | null;
}

export default function PublishModal({
  open,
  onOpenChange,
  siteUrl,
  isPublishing,
  error,
}: PublishModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isPublishing
              ? 'Publication en cours...'
              : siteUrl
                ? 'Site publié !'
                : 'Erreur'}
          </DialogTitle>
          <DialogDescription>
            {isPublishing &&
              'Votre site est en cours de déploiement sur OVHcloud.'}
            {siteUrl && 'Votre site est en ligne et accessible au public.'}
            {error && "Une erreur est survenue lors de la publication."}
          </DialogDescription>
        </DialogHeader>

        {isPublishing && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {siteUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Badge variant="secondary">URL</Badge>
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline truncate"
              >
                {siteUrl}
              </a>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigator.clipboard.writeText(siteUrl)}
              >
                Copier le lien
              </Button>
              <Button
                className="flex-1"
                onClick={() => window.open(siteUrl, '_blank')}
              >
                Ouvrir le site
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive text-center py-4">{error}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
