import { cache } from "react";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { anciensSlugsEpisode, episodes, rencontres } from "./db/schema";
import { FORME_SLUG } from "./slug";

/**
 * Lectures publiques de la serie (fiche fiches/serie.md). Seuls les episodes
 * publies et hors corbeille en sortent, avec le match qu'ils racontent quand
 * il est lui aussi visible.
 */

// Meme forme que les slugs produits par lib/slug.ts : rien d'autre n'atteint la base.

const colonnesMatch = {
  slug: rencontres.slug,
  adversaire: rencontres.adversaire,
  aDomicile: rencontres.aDomicile,
  joueLe: rencontres.joueLe,
  etat: rencontres.etat,
  setsNous: rencontres.setsNous,
  setsEux: rencontres.setsEux,
  supprimeLe: rencontres.supprimeLe,
};

type LigneMatch = Pick<
  typeof rencontres.$inferSelect,
  "slug" | "adversaire" | "aDomicile" | "joueLe" | "etat" | "setsNous" | "setsEux" | "supprimeLe"
>;

/** Le match raconte, s'il existe et n'est pas en corbeille. */
function matchVisible(m: LigneMatch | null) {
  if (!m || m.supprimeLe) return null;
  const { slug, adversaire, aDomicile, joueLe, etat, setsNous, setsEux } = m;
  return { slug, adversaire, aDomicile, joueLe, etat, setsNous, setsEux };
}

export type MatchRaconte = NonNullable<ReturnType<typeof matchVisible>>;

/** Tous les episodes publies, le plus recent d'abord, chacun avec son match. */
export async function episodesPublies() {
  const lignes = await db()
    .select({ episode: episodes, match: colonnesMatch })
    .from(episodes)
    .leftJoin(rencontres, eq(episodes.rencontreId, rencontres.id))
    .where(and(eq(episodes.etat, "publie"), isNull(episodes.supprimeLe)))
    // La date de publication d'abord : un bonus sans numero passe quand meme en tete.
    .orderBy(desc(episodes.publieLe), desc(episodes.numero));
  return lignes.map((l) => ({ episode: l.episode, match: matchVisible(l.match) }));
}

/** La liste de la page de la serie, avec l'instant de reference de la page. */
export async function serieComplete(maintenant = new Date()) {
  return { maintenant, episodes: await episodesPublies() };
}

/**
 * Un episode par son adresse, avec son match et ses voisins dans la serie.
 * Mis en cache le temps d'une requete : la page et ses metadonnees le lisent.
 */
export const episodePublic = cache(async (slug: string) => {
  if (!FORME_SLUG.test(slug)) return null;
  const liste = await episodesPublies();
  const rang = liste.findIndex((l) => l.episode.slug === slug);
  const courant = liste[rang];
  if (!courant) return null;
  // La liste va du plus recent au plus ancien : le precedent est plus bas.
  return {
    // L'instant de reference de la page, lu une fois : le rendu reste pur.
    maintenant: new Date(),
    ...courant,
    precedent: liste[rang + 1]?.episode ?? null,
    suivant: liste[rang - 1]?.episode ?? null,
  };
});

/** L'adresse actuelle d'un episode dont on a recu une ancienne adresse, ou null. */
export async function nouvelleAdresseEpisode(ancien: string): Promise<string | null> {
  if (!FORME_SLUG.test(ancien)) return null;
  const [ligne] = await db()
    .select({ slug: episodes.slug })
    .from(anciensSlugsEpisode)
    .innerJoin(episodes, eq(anciensSlugsEpisode.episodeId, episodes.id))
    .where(and(eq(anciensSlugsEpisode.slug, ancien), eq(episodes.etat, "publie"), isNull(episodes.supprimeLe)))
    .limit(1);
  return ligne?.slug ?? null;
}
