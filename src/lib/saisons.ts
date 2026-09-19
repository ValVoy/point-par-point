import { desc, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { saisons } from "./db/schema";

/**
 * Lectures liees aux saisons, partagees entre les ecrans. Elles ne vivent pas
 * dans un fichier d'actions serveur : une lecture n'a pas a devenir une
 * adresse joignable depuis le navigateur.
 */

export async function saisonCourante() {
  const [courante] = await db()
    .select()
    .from(saisons)
    .where(eq(saisons.courante, true))
    .limit(1);
  return courante ?? null;
}

export async function saisonsActives() {
  return db()
    .select()
    .from(saisons)
    .where(isNull(saisons.supprimeLe))
    .orderBy(desc(saisons.debuteLe));
}

/**
 * La saison a afficher : celle demandee si elle existe, sinon la courante,
 * sinon la plus recente. Le site doit toujours savoir quoi montrer, meme
 * quand personne n'a pense a designer une saison courante.
 */
export async function saisonAAfficher(demandee?: number | null) {
  const actives = await saisonsActives();
  if (actives.length === 0) return null;
  if (demandee) {
    const trouvee = actives.find((saison) => saison.id === demandee);
    if (trouvee) return trouvee;
  }
  return actives.find((saison) => saison.courante) ?? actives[0] ?? null;
}
