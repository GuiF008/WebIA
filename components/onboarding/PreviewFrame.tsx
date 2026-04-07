'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PreviewFrameProps {
  previewUrl: string | null;
  html: string;
  css: string;
}

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function PreviewFrame({
  previewUrl,
  html,
  css,
}: PreviewFrameProps) {
  const [device, setDevice] = useState<Device>('desktop');

  const srcDoc = previewUrl
    ? undefined
    : `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css}</style></head><body>${html}</body></html>`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {(Object.keys(DEVICE_WIDTHS) as Device[]).map((d) => (
          <Button
            key={d}
            variant={device === d ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevice(d)}
          >
            {d === 'desktop' && 'Bureau'}
            {d === 'tablet' && 'Tablette'}
            {d === 'mobile' && 'Mobile'}
          </Button>
        ))}
      </div>

      <div className="flex justify-center bg-muted/50 rounded-lg p-4">
        <div
          className="transition-all duration-300 bg-white rounded-lg shadow-lg overflow-hidden"
          style={{
            width: DEVICE_WIDTHS[device],
            maxWidth: '100%',
          }}
        >
          <iframe
            src={previewUrl ?? undefined}
            srcDoc={srcDoc}
            className="w-full border-0"
            style={{ height: '600px' }}
            title="Aperçu du site"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
