import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "./db";
import { episodes, rencontres, saisons } from "./db/schema";
import { dateCourte } from "./dates";
import { premiereLibre, slugifier } from "./slug";

/**
 * Lectures liees aux episodes de la serie, partagees entre les ecrans. Comme
 * pour les matchs, elles ne vivent pas dans un fichier d'actions serveur.
 */

export type Episode = typeof episodes.$inferSelect;

/**
 * Tous les episodes, toutes saisons confondues : la serie suit le projet, pas
 * le calendrier sportif. Le plus recent d'abord, c'est celui qu'on retouche.
 */
export async function episodesActifs() {
  return db()
    .select({
      episode: episodes,
      adversaire: rencontres.adversaire,
      joueLe: rencontres.joueLe,
    })
    .from(episodes)
    .leftJoin(rencontres, eq(episodes.rencontreId, rencontres.id))
    .where(isNull(episodes.supprimeLe))
    .orderBy(desc(episodes.numero), desc(episodes.creeLe));
}

export async function episodesALaCorbeille() {
  return db()
    .select()
    .from(episodes)
    .where(isNotNull(episodes.supprimeLe))
    .orderBy(desc(episodes.numero));
}

export async function episodeParId(id: number): Promise<Episode | null> {
  const [episode] = await db()
    .select()
    .from(episodes)
    .where(eq(episodes.id, id))
    .limit(1);
  return episode ?? null;
}

/**
 * Les matchs qu'un episode peut raconter, du plus recent au plus ancien, avec
 * un libelle lisible dans une liste deroulante.
 */
export async function matchsALier() {
  const lignes = await db()
    .select({
      id: rencontres.id,
      joueLe: rencontres.joueLe,
      adversaire: rencontres.adversaire,
      aDomicile: rencontres.aDomicile,
      saison: saisons.libelle,
    })
    .from(rencontres)
    .innerJoin(saisons, eq(rencontres.saisonId, saisons.id))
    .where(and(isNull(rencontres.supprimeLe), isNull(saisons.supprimeLe)))
    .orderBy(desc(rencontres.joueLe));

  return lignes.map((ligne) => ({
    id: ligne.id,
    libelle: `${dateCourte(ligne.joueLe)} · ${ligne.aDomicile ? "contre" : "chez"} ${ligne.adversaire} (${ligne.saison})`,
  }));
}

/**
 * Adresse publique d'un episode, /serie/<slug>. Le numero en tete quand il est
 * connu, sans le repeter si le titre commence deja par « Episode 3 ».
 */
export async function slugEpisodeLibre(
  titre: string,
  numero: number | null,
  sauf?: number,
): Promise<string> {
  const titreSlug = slugifier(titre);
  const prefixe = numero === null ? "" : `episode-${numero}`;
  const base =
    !prefixe || titreSlug.startsWith(prefixe)
      ? titreSlug || prefixe || "episode"
      : `${prefixe}-${titreSlug}`;

  const existants = await db()
    .select({ id: episodes.id, slug: episodes.slug })
    .from(episodes);
  const pris = new Set(
    existants.filter((ligne) => ligne.id !== sauf).map((ligne) => ligne.slug),
  );

  return premiereLibre(base, pris);
}
