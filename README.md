# OVH AI Website Builder — MVP V1

Constructeur de sites web par IA, ciblant le marché européen/francophone.  
L'utilisateur décrit son activité → l'IA génère un site HTML/CSS statique → édition visuelle → publication sur OVHcloud.

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | Next.js 15, React 19, Tailwind CSS v4, shadcn/ui |
| Éditeur visuel | GrapesJS + AI Copilot (Silex Labs) |
| IA | Anthropic Claude (claude-sonnet-4-6), Vercel AI SDK |
| Sandbox preview | E2B Code Interpreter |
| Base de données | PostgreSQL + Prisma 7 |
| Publication | OVH Object Storage (S3-compatible) + CDN |

## Architecture (3 couches)

```
Couche 1 — Génération IA : Prompt → LLM → HTML/CSS → Preview E2B
Couche 2 — Éditeur visuel : GrapesJS + chat IA + Style Manager
Couche 3 — Publication     : Object Storage → CDN → TLS → Domaine
```

## Démarrage rapide

```bash
# 1. Cloner et installer
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir : DATABASE_URL, ANTHROPIC_API_KEY, E2B_API_KEY, OVH_S3_*

# 3. Générer le client Prisma
npx prisma generate

# 4. Créer les tables (nécessite une DB PostgreSQL accessible)
npx prisma db push

# 5. Lancer en développement
npm run dev
```

## Routes API

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/generate` | POST | Génère un site HTML/CSS depuis un prompt (rate limited : 5/h) |
| `/api/sandbox` | POST | Crée un sandbox E2B pour preview (onboarding uniquement) |
| `/api/sandbox` | DELETE | Détruit un sandbox (appelé avant entrée dans l'éditeur) |
| `/api/projects` | GET/POST | Liste / crée des projets |
| `/api/projects/[id]` | GET/PUT/DELETE | CRUD projet (PUT utilisé par GrapesJS storageManager) |
| `/api/publish` | POST | Publie le site sur OVH Object Storage |
| `/api/ai-copilot/proxy` | POST | Proxy vers Anthropic (clé API côté serveur uniquement) |

## Décisions d'architecture V1

1. **Proxy AI Copilot** : la clé Anthropic n'est jamais exposée côté client. Toutes les requêtes passent par `/api/ai-copilot/proxy`.

2. **Sandbox E2B = onboarding uniquement** : le sandbox est créé pour la preview post-génération et détruit dès que l'utilisateur entre dans l'éditeur GrapesJS (qui utilise sa propre preview iframe locale).

3. **V2 WordPress** : le schéma Prisma et l'enum `DeploymentType` contiennent les placeholders pour la V2 (Managed WordPress). Ne pas décommenter en V1.

4. **CSS inline** : en V1, le CSS est embarqué dans le `<style>` du HTML (fichier unique `index.html`).

5. **Rate limiting** : in-memory pour le MVP. À remplacer par `@upstash/ratelimit` ou Redis en production.

6. **Auth** : placeholder — pas d'authentification en V1. Un middleware `authMiddleware` et `getUserId` sont prêts à câbler.

## Structure du projet

```
ai-website-builder/
├── app/
│   ├── page.tsx                          # Dashboard (liste des projets)
│   ├── (dashboard)/projects/
│   │   ├── new/page.tsx                  # Onboarding : prompt → génération
│   │   └── [id]/
│   │       ├── page.tsx                  # Éditeur GrapesJS
│   │       └── publish/page.tsx          # Page publication + domaine
│   └── api/
│       ├── generate/route.ts             # LLM → HTML/CSS
│       ├── sandbox/route.ts              # E2B preview
│       ├── projects/route.ts             # CRUD projets
│       ├── projects/[id]/route.ts        # Projet individuel
│       ├── publish/route.ts              # Deploy OVH
│       └── ai-copilot/proxy/route.ts     # Proxy Anthropic
├── components/
│   ├── editor/                           # GrapesEditor, EditorToolbar
│   ├── onboarding/                       # PromptInput, OnboardingSteps, PreviewFrame
│   ├── publish/                          # PublishModal, DomainPicker
│   └── ui/                               # shadcn/ui components
├── lib/
│   ├── ai/                               # Prompts, modèles, génération
│   ├── editor/                           # Config GrapesJS, export HTML
│   ├── ovh/                              # Storage S3, domaine
│   ├── sandbox/                          # E2B lifecycle
│   ├── auth/                             # Middleware auth (placeholder)
│   ├── db/                               # Client Prisma
│   └── rateLimit.ts                      # Rate limiter in-memory
├── types/                                # TypeScript types
├── prisma/schema.prisma                  # Modèle de données
├── prisma.config.ts                      # Config Prisma 7
└── .env.example                          # Variables d'environnement
```

## Checklist V1

- [x] Génération HTML/CSS depuis prompt (Claude)
- [x] Preview dans sandbox E2B (onboarding uniquement)
- [x] Éditeur GrapesJS avec HTML généré
- [x] Proxy AI Copilot (route serveur)
- [x] Sauvegarde auto projet (storageManager → DB)
- [x] Export HTML final (fichier autonome)
- [x] Upload vers OVH Object Storage
- [x] URL publique retournée
- [x] Instructions domaine custom
- [x] Dashboard liste de projets
- [x] Rate limiting sur routes IA
- [x] Variables d'environnement documentées
- [ ] Auth utilisateur (V1+)
- [ ] Tests end-to-end (V1+)
- [ ] CDN + TLS automatique (V1+)
