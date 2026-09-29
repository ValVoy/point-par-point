import { and, asc, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import { db } from "./db";
import { rencontres, setsRencontre } from "./db/schema";
import { pourChampDate } from "./dates";
import { slugifier } from "./slug";

/**
 * Lectures liees aux matchs, partagees entre les ecrans. Comme pour les
 * saisons, elles ne vivent pas dans un fichier d'actions serveur : une lecture
 * n'a pas a devenir une adresse joignable depuis le navigateur.
 */

export type Rencontre = typeof rencontres.$inferSelect;
export type SetRencontre = typeof setsRencontre.$inferSelect;
export type RencontreAvecSets = Rencontre & { sets: SetRencontre[] };

async function avecSets(liste: Rencontre[]): Promise<RencontreAvecSets[]> {
  if (liste.length === 0) return [];
  const sets = await db()
    .select()
    .from(setsRencontre)
    .where(
      inArray(
        setsRencontre.rencontreId,
        liste.map((rencontre) => rencontre.id),
      ),
    )
    .orderBy(asc(setsRencontre.numero));

  return liste.map((rencontre) => ({
    ...rencontre,
    sets: sets.filter((set) => set.rencontreId === rencontre.id),
  }));
}

/** Les matchs d'une saison, dans l'ordre du calendrier. */
export async function rencontresDeLaSaison(
  saisonId: number,
): Promise<RencontreAvecSets[]> {
  const liste = await db()
    .select()
    .from(rencontres)
    .where(and(eq(rencontres.saisonId, saisonId), isNull(rencontres.supprimeLe)))
    .orderBy(asc(rencontres.joueLe));
  return avecSets(liste);
}

export async function rencontresALaCorbeille(saisonId: number) {
  return db()
    .select()
    .from(rencontres)
    .where(
      and(eq(rencontres.saisonId, saisonId), isNotNull(rencontres.supprimeLe)),
    )
    .orderBy(asc(rencontres.joueLe));
}

export async function rencontreParId(
  id: number,
): Promise<RencontreAvecSets | null> {
  const [rencontre] = await db()
    .select()
    .from(rencontres)
    .where(eq(rencontres.id, id))
    .limit(1);
  if (!rencontre) return null;
  const [complete] = await avecSets([rencontre]);
  return complete ?? null;
}

/**
 * Un match est « a saisir » quand sa date est passee et qu'il n'a toujours
 * aucun score. C'est la relance qui fait vivre le site : sans elle, un
 * resultat oublie le reste pour toujours.
 */
export function scoreASaisir(rencontre: Rencontre, maintenant = new Date()) {
  return (
    rencontre.etat === "a_venir" && rencontre.joueLe.getTime() < maintenant.getTime()
  );
}

/**
 * Adresse publique d'un match, /matchs/<slug> : la date a Paris puis
 * l'adversaire. Deux matchs le meme jour contre la meme equipe (un aller et
 * un retour de coupe, un tournoi) recoivent un suffixe. `reserves` sert a la
 * saisie en masse, ou les adresses du lot ne sont pas encore en base.
 */
export async function slugRencontreLibre(
  joueLe: Date,
  adversaire: string,
  options: { reserves?: Set<string>; sauf?: number } = {},
): Promise<string> {
  const base = slugifier(`${pourChampDate(joueLe)}-${adversaire}`);
  const existants = await db()
    .select({ id: rencontres.id, slug: rencontres.slug })
    .from(rencontres);
  const pris = new Set(
    existants
      .filter((ligne) => ligne.id !== options.sauf)
      .map((ligne) => ligne.slug),
  );
  for (const reserve of options.reserves ?? []) pris.add(reserve);

  if (!pris.has(base)) return base;
  let suffixe = 2;
  while (pris.has(`${base}-${suffixe}`)) suffixe += 1;
  return `${base}-${suffixe}`;
}
