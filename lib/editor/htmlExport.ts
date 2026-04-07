import type { Editor } from 'grapesjs';

export interface ExportedSite {
  html: string;
  css: string;
  fullHtml: string;
}

export function exportSite(
  editor: Editor,
  meta: { title: string; description: string }
): ExportedSite {
  const html = editor.getHtml();
  const css = editor.getCss() ?? '';

  const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    img { max-width: 100%; height: auto; display: block; }
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

  return { html, css, fullHtml };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
