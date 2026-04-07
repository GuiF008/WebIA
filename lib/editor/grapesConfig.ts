import type { EditorConfig } from 'grapesjs';

export function buildGrapesConfig(
  projectId: string,
  initialHtml: string,
  initialCss: string
): EditorConfig {
  return {
    container: '#gjs',
    fromElement: false,
    height: '100%',
    width: 'auto',

    components: initialHtml,
    style: initialCss,

    storageManager: {
      type: 'remote',
      stepsBeforeSave: 5,
      options: {
        remote: {
          urlStore: `/api/projects/${projectId}`,
          urlLoad: `/api/projects/${projectId}`,
          fetchOptions: (opts: RequestInit) =>
            opts.method === 'POST' ? { ...opts, method: 'PUT' } : opts,
          onStore: (data: Record<string, unknown>) => ({ grapesData: data }),
          onLoad: (result: Record<string, unknown>) =>
            result.grapesData as Record<string, unknown>,
        },
      },
    },

    blockManager: {
      appendTo: '#blocks',
      blocks: [
        {
          id: 'section-hero',
          label: 'Section Hero',
          content: `<section class="hero"><h1>Titre principal</h1><p>Sous-titre</p><a href="#" class="btn">Appel à l'action</a></section>`,
          category: 'Sections',
        },
        {
          id: 'section-text-image',
          label: 'Texte + Image',
          content: `<section class="text-image"><div class="text-content"><h2>Titre</h2><p>Contenu...</p></div><div class="image-content"><img src="" alt="Description"/></div></section>`,
          category: 'Sections',
        },
        {
          id: 'section-features',
          label: 'Caractéristiques',
          content: `<section class="features"><h2>Nos atouts</h2><div class="features-grid"><div class="feature-card"><h3>Atout 1</h3><p>Description</p></div><div class="feature-card"><h3>Atout 2</h3><p>Description</p></div><div class="feature-card"><h3>Atout 3</h3><p>Description</p></div></div></section>`,
          category: 'Sections',
        },
        {
          id: 'section-contact',
          label: 'Formulaire Contact',
          content: `<section class="contact"><h2>Nous contacter</h2><form><input type="text" placeholder="Votre nom" required/><input type="email" placeholder="Votre email" required/><textarea placeholder="Message" required></textarea><button type="submit">Envoyer</button></form></section>`,
          category: 'Sections',
        },
        {
          id: 'section-footer',
          label: 'Pied de page',
          content: `<footer class="site-footer"><p>&copy; 2026 Mon Entreprise. Tous droits réservés.</p><nav><a href="#">Mentions légales</a> | <a href="#">Politique de confidentialité</a></nav></footer>`,
          category: 'Sections',
        },
      ],
    },

    deviceManager: {
      devices: [
        { name: 'Desktop', width: '' },
        { name: 'Tablet', width: '768px' },
        { name: 'Mobile', width: '375px', widthMedia: '480px' },
      ],
    },

    styleManager: {
      appendTo: '#styles-container',
      sectors: [
        {
          name: 'Typographie',
          open: false,
          properties: ['font-family', 'font-size', 'font-weight', 'line-height', 'color'],
        },
        {
          name: 'Espacement',
          open: false,
          properties: ['margin', 'padding'],
        },
        {
          name: 'Arrière-plan',
          open: false,
          properties: ['background-color', 'background-image'],
        },
        {
          name: 'Bordures',
          open: false,
          properties: ['border', 'border-radius'],
        },
      ],
    },

    panels: {
      defaults: [
        {
          id: 'layers',
          el: '#layers',
          resizable: {
            tc: false, cr: false, cl: false, bc: false,
            bl: false, br: false, tl: false, tr: false,
          },
        },
      ],
    },

    canvas: {
      styles: [],
      scripts: [],
    },
  };
}
