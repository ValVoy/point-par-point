import { createHash, randomBytes } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { sessions, utilisateurs } from "../db/schema";

export const NOM_COOKIE = "session_volley";

/** Duree de vie d'une session, et seuil de prolongation glissante. */
const DUREE_MS = 30 * 24 * 60 * 60 * 1000;
const SEUIL_PROLONGATION_MS = 7 * 24 * 60 * 60 * 1000;
/**
 * Echeance absolue, prolongation comprise (audit S12) : sans elle, un cookie
 * vole et reutilise regulierement restait valide indefiniment.
 */
const DUREE_ABSOLUE_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * Le cookie porte le jeton en clair, la base n'en garde que le hachage. Une
 * lecture de la base ne permet donc pas de fabriquer un cookie valide. SHA-256
 * suffit ici, contrairement aux mots de passe : un jeton de 32 octets tires au
 * hasard n'est pas attaquable par dictionnaire.
 */
function hacherJeton(jeton: string): string {
  return createHash("sha256").update(jeton).digest("hex");
}

export type SessionOuverte = {
  jeton: string;
  expireLe: Date;
};

export async function ouvrirSession(
  utilisateurId: number,
): Promise<SessionOuverte> {
  const jeton = randomBytes(32).toString("base64url");
  const expireLe = new Date(Date.now() + DUREE_MS);

  await db().insert(sessions).values({
    jetonHache: hacherJeton(jeton),
    utilisateurId,
    expireLe,
  });

  return { jeton, expireLe };
}

export type UtilisateurConnecte = {
  id: number;
  email: string;
  nom: string;
  role: "admin" | "redacteur";
};

/**
 * Valide un jeton de cookie et rend l'utilisateur, ou null. Prolonge la session
 * quand elle approche de son terme, pour qu'un usage regulier ne deconnecte
 * jamais, sans pour autant rendre la session eternelle.
 */
export async function lireSession(
  jeton: string | undefined,
): Promise<UtilisateurConnecte | null> {
  if (!jeton) return null;

  const jetonHache = hacherJeton(jeton);
  const maintenant = new Date();

  const lignes = await db()
    .select({
      expireLe: sessions.expireLe,
      ouverteLe: sessions.creeLe,
      id: utilisateurs.id,
      email: utilisateurs.email,
      nom: utilisateurs.nom,
      role: utilisateurs.role,
      actif: utilisateurs.actif,
      supprimeLe: utilisateurs.supprimeLe,
    })
    .from(sessions)
    .innerJoin(utilisateurs, eq(sessions.utilisateurId, utilisateurs.id))
    .where(
      and(eq(sessions.jetonHache, jetonHache), gt(sessions.expireLe, maintenant)),
    )
    .limit(1);

  const ligne = lignes[0];
  if (!ligne) return null;

  // Un compte desactive ou mis a la corbeille perd ses sessions a la volee,
  // sans qu'il faille penser a les supprimer au moment de la desactivation.
  if (!ligne.actif || ligne.supprimeLe !== null) return null;
  if (maintenant.getTime() - ligne.ouverteLe.getTime() > DUREE_ABSOLUE_MS) return null;

  const resteMs = ligne.expireLe.getTime() - maintenant.getTime();
  if (resteMs < SEUIL_PROLONGATION_MS) {
    await db()
      .update(sessions)
      .set({ expireLe: new Date(Date.now() + DUREE_MS) })
      .where(eq(sessions.jetonHache, jetonHache));
  }

  return {
    id: ligne.id,
    email: ligne.email,
    nom: ligne.nom,
    role: ligne.role,
  };
}

export async function fermerSession(jeton: string | undefined): Promise<void> {
  if (!jeton) return;
  await db().delete(sessions).where(eq(sessions.jetonHache, hacherJeton(jeton)));
}

/** Ferme toutes les sessions d'un compte, apres un changement de mot de passe. */
export async function fermerToutesLesSessions(
  utilisateurId: number,
): Promise<void> {
  await db().delete(sessions).where(eq(sessions.utilisateurId, utilisateurId));
}

/** Options du cookie de session, au meme endroit pour pose et suppression. */
export function optionsCookie(expireLe?: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(expireLe ? { expires: expireLe } : { maxAge: 0 }),
  };
}
