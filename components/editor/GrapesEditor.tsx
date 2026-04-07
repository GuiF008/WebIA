'use client';

import { useEffect, useRef } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { buildGrapesConfig } from '@/lib/editor/grapesConfig';

interface GrapesEditorProps {
  projectId: string;
  initialHtml: string;
  initialCss: string;
  onSave?: (html: string, css: string) => void;
}

export default function GrapesEditor({
  projectId,
  initialHtml,
  initialCss,
  onSave,
}: GrapesEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (editorRef.current) return;

    const config = buildGrapesConfig(projectId, initialHtml, initialCss);

    const editor = grapesjs.init({
      ...config,
      plugins: [],
      /**
       * AI Copilot : le plugin @silexlabs/grapesjs-ai-copilot sera câblé ici
       * une fois le proxy /api/ai-copilot/proxy validé.
       * Configuration prévue :
       *   plugins: [aiCopilot],
       *   pluginsOpts: {
       *     [aiCopilot]: {
       *       apiUrl: '/api/ai-copilot/proxy',
       *       apiKey: '',  // vide — le proxy ajoute la clé côté serveur
       *       model: 'claude-sonnet-4-6',
       *     }
       *   }
       */
    });

    editorRef.current = editor;

    editor.on('storage:store', () => {
      const html = editor.getHtml();
      const css = editor.getCss() ?? '';
      onSave?.(html, css);
    });

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen">
      <div id="blocks" className="w-48 bg-gray-50 border-r overflow-y-auto" />
      <div className="flex-1 flex flex-col">
        <div id="gjs" className="flex-1" />
      </div>
      <div className="w-64 bg-gray-50 border-l overflow-y-auto">
        <div id="layers" />
        <div id="styles-container" />
      </div>
    </div>
  );
}
