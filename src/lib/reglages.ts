import { eq } from "drizzle-orm";
import { db } from "./db";
import { reglages } from "./db/schema";

/**
 * Les textes uniques du site, saisis dans l'administration. Une cle inconnue
 * ou vide rend null : la page publique fait alors disparaitre le bloc.
 */
export const CLES_REGLAGE = {
  /** Transports, parking, acces PMR, entree, buvette : en texte leger. */
  venirALaSalle: "venir_a_la_salle",
  /** Le manifeste de l'accueil ; vide, le texte de depart de lib/porte-entree.ts. */
  manifesteTitre: "manifeste_titre",
  manifesteTexte: "manifeste_texte",
} as const;

export type CleReglage = (typeof CLES_REGLAGE)[keyof typeof CLES_REGLAGE];

export async function lireReglage(cle: CleReglage): Promise<string | null> {
  const [ligne] = await db().select({ valeur: reglages.valeur }).from(reglages).where(eq(reglages.cle, cle)).limit(1);
  const valeur = ligne?.valeur.trim();
  return valeur ? valeur : null;
}
