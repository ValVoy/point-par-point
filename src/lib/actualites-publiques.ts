import { cache } from "react";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { actualites, anciensSlugsActualite } from "./db/schema";

/**
 * Lectures publiques des actualites (fiche fiches/actualites.md). Seules les
 * actualites publiees et hors corbeille en sortent (principe 6 du plan).
 */

// Meme forme que les slugs produits par lib/slug.ts : rien d'autre n'atteint la base.
const FORME_SLUG = /^[a-z0-9-]{1,120}$/;

const publiees = and(eq(actualites.etat, "publie"), isNull(actualites.supprimeLe));

// Ce qu'il faut pour une liste ou un lien : jamais le corps, qui peut etre long.
const enListe = {
  id: actualites.id,
  slug: actualites.slug,
  titre: actualites.titre,
  chapo: actualites.chapo,
  imageCle: actualites.imageCle,
  publieLe: actualites.publieLe,
};

/** Les actualites publiees, la plus recente d'abord, sans leur corps. */
export async function actualitesPubliees(limite?: number) {
  const requete = db().select(enListe).from(actualites).where(publiees).orderBy(desc(actualites.publieLe), desc(actualites.id));
  return limite ? requete.limit(limite) : requete;
}

/**
 * Une actualite par son adresse, avec la precedente et la suivante. Mise en
 * cache le temps d'une requete : la page et ses metadonnees la lisent.
 */
export const actualitePublique = cache(async (slug: string) => {
  if (!FORME_SLUG.test(slug)) return null;
  const liste = await actualitesPubliees();
  const rang = liste.findIndex((a) => a.slug === slug);
  if (rang === -1) return null;
  // Le corps n'est lu que pour l'article affiche.
  const [actualite] = await db().select().from(actualites).where(and(eq(actualites.slug, slug), publiees)).limit(1);
  if (!actualite) return null;
  // La liste va de la plus recente a la plus ancienne : la precedente est plus bas.
  return {
    actualite,
    precedente: liste[rang + 1] ?? null,
    suivante: liste[rang - 1] ?? null,
  };
});

/** L'adresse actuelle d'une actualite dont on a recu une ancienne adresse, ou null. */
export async function nouvelleAdresseActualite(ancien: string): Promise<string | null> {
  if (!FORME_SLUG.test(ancien)) return null;
  const [ligne] = await db()
    .select({ slug: actualites.slug })
    .from(anciensSlugsActualite)
    .innerJoin(actualites, eq(anciensSlugsActualite.actualiteId, actualites.id))
    .where(and(eq(anciensSlugsActualite.slug, ancien), publiees))
    .limit(1);
  return ligne?.slug ?? null;
}
