import { NextRequest, NextResponse } from 'next/server';

/**
 * Placeholder auth middleware — V1 : pas d'authentification.
 * À remplacer par un vrai middleware (JWT, session, NextAuth) en V1+.
 */
export function authMiddleware(_req: NextRequest): NextResponse | null {
  // TODO: valider le token/session
  // Pour l'instant, toutes les requêtes passent.
  return null;
}

/**
 * Récupère l'userId depuis la requête.
 * V1 : retourne un placeholder.
 */
export function getUserId(_req: NextRequest | Request): string {
  // TODO: extraire depuis le token JWT ou la session
  return 'temp-user';
}
