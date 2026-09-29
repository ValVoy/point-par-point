import { desc, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "./db";
import { actualites } from "./db/schema";
import { premiereLibre, slugifier } from "./slug";

/**
 * Lectures liees aux actualites, partagees entre les ecrans. Comme pour les
 * matchs et les episodes, elles ne vivent pas dans un fichier d'actions.
 */

export type Actualite = typeof actualites.$inferSelect;

/** Les brouillons d'abord, puis les publiees de la plus recente a la plus ancienne. */
export async function actualitesActives(): Promise<Actualite[]> {
  const lignes = await db()
    .select()
    .from(actualites)
    .where(isNull(actualites.supprimeLe))
    .orderBy(desc(actualites.publieLe), desc(actualites.creeLe));
  return [
    ...lignes.filter((a) => a.etat === "brouillon"),
    ...lignes.filter((a) => a.etat === "publie"),
  ];
}

export async function actualitesALaCorbeille() {
  return db()
    .select()
    .from(actualites)
    .where(isNotNull(actualites.supprimeLe))
    .orderBy(desc(actualites.modifieLe));
}

export async function actualiteParId(id: number): Promise<Actualite | null> {
  const [actualite] = await db()
    .select()
    .from(actualites)
    .where(eq(actualites.id, id))
    .limit(1);
  return actualite ?? null;
}

/** Adresse publique d'une actualite, /actualites/<slug>. */
export async function slugActualiteLibre(titre: string, sauf?: number): Promise<string> {
  const base = slugifier(titre) || "actualite";
  const existants = await db()
    .select({ id: actualites.id, slug: actualites.slug })
    .from(actualites);
  return premiereLibre(
    base,
    new Set(existants.filter((ligne) => ligne.id !== sauf).map((ligne) => ligne.slug)),
  );
}
