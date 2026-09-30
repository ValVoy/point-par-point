import { cache } from "react";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "./db";
import { anciensSlugsRencontre, episodes, rencontres } from "./db/schema";
import { rencontresDeLaSaison } from "./rencontres";
import { saisonsActives } from "./saisons";

/**
 * Lectures des pages publiques des matchs (fiche fiches/matchs.md). Seul ce
 * qu'un visiteur peut voir en sort : matchs hors corbeille, episodes publies.
 */

async function matchsRacontes(ids: number[]) {
  if (ids.length === 0) return new Set<number>();
  const lignes = await db()
    .select({ rencontreId: episodes.rencontreId })
    .from(episodes)
    .where(and(inArray(episodes.rencontreId, ids), eq(episodes.etat, "publie"), isNull(episodes.supprimeLe)));
  return new Set(lignes.map((l) => l.rencontreId).filter((id): id is number => id !== null));
}

/**
 * Le calendrier d'une saison, designee par son libelle (« 2026-2027 ») :
 * l'adresse reste lisible et stable, la ou un identifiant interne ne dit rien.
 * Sans libelle reconnu, la saison courante, sinon la plus recente.
 */
export async function calendrierDeLaSaison(libelle?: string | null, maintenant = new Date()) {
  const saisons = await saisonsActives();
  const saison =
    (libelle ? saisons.find((s) => s.libelle === libelle) : undefined) ??
    saisons.find((s) => s.courante) ??
    saisons[0] ??
    null;
  const matchs = saison ? await rencontresDeLaSaison(saison.id) : [];
  const racontes = await matchsRacontes(matchs.map((m) => m.id));
  // L'instant de reference de la page, lu une fois : le rendu reste pur.
  return { maintenant, saison, saisons, matchs, racontes };
}

/**
 * Un match par son adresse publique, avec ses sets, l'episode publie qui le
 * raconte, et ses voisins dans la saison pour continuer la lecture. Mis en
 * cache le temps d'une requete : la page et ses metadonnees le lisent toutes
 * deux, la base ne l'est qu'une fois.
 */
// Meme forme que les slugs produits par lib/slug.ts : rien d'autre n'atteint la base.
export const FORME_SLUG = /^[a-z0-9-]{1,120}$/;

/** L'adresse actuelle d'un match dont on a recu une ancienne adresse, ou null. */
export async function nouvelleAdresse(ancien: string): Promise<string | null> {
  if (!FORME_SLUG.test(ancien)) return null;
  const [ligne] = await db()
    .select({ slug: rencontres.slug })
    .from(anciensSlugsRencontre)
    .innerJoin(rencontres, eq(anciensSlugsRencontre.rencontreId, rencontres.id))
    .where(and(eq(anciensSlugsRencontre.slug, ancien), isNull(rencontres.supprimeLe)))
    .limit(1);
  return ligne?.slug ?? null;
}

export const matchPublic = cache(async (slug: string) => {
  if (!FORME_SLUG.test(slug)) return null;
  const [ligne] = await db()
    .select({ id: rencontres.id, saisonId: rencontres.saisonId })
    .from(rencontres)
    .where(and(eq(rencontres.slug, slug), isNull(rencontres.supprimeLe)))
    .limit(1);
  if (!ligne) return null;

  const [[episode], saison] = await Promise.all([
    db()
      .select()
      .from(episodes)
      .where(and(eq(episodes.rencontreId, ligne.id), eq(episodes.etat, "publie"), isNull(episodes.supprimeLe)))
      .orderBy(desc(episodes.publieLe))
      .limit(1),
    rencontresDeLaSaison(ligne.saisonId),
  ]);
  const rang = saison.findIndex((m) => m.id === ligne.id);
  const match = saison[rang];
  if (!match) return null;

  const voisin = (m: (typeof saison)[number] | undefined) =>
    m ? { slug: m.slug, adversaire: m.adversaire, aDomicile: m.aDomicile, joueLe: m.joueLe } : null;
  return {
    // L'instant de reference de la page, lu une fois : le rendu reste pur.
    maintenant: new Date(),
    match,
    episode: episode ?? null,
    precedent: voisin(saison[rang - 1]),
    suivant: voisin(saison[rang + 1]),
  };
});
