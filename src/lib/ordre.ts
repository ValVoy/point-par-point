import { asc, eq, isNull, max } from "drizzle-orm";
import { db } from "./db";
import { etapesProjet, membresStaff, partenaires } from "./db/schema";

/**
 * L'ordre d'affichage choisi a la main, commun aux trois listes de la vitrine
 * du projet. On deplace d'un cran avec deux boutons, monter et descendre :
 * pas de glisser-deposer, qui se passe mal au doigt et au clavier.
 *
 * Apres chaque deplacement, toute la liste est renumerotee de 0 a n-1 : les
 * trous et les doublons laisses par une corbeille ou un ajout disparaissent,
 * et le cran suivant se comporte toujours comme on l'attend.
 */

const TABLES = {
  etapes: etapesProjet,
  staff: membresStaff,
  partenaires,
} as const;

export type ListeOrdonnee = keyof typeof TABLES;

// Les trois tables partagent les colonnes utilisees ici (id, ordre,
// supprime_le), avec les memes types. Drizzle ne sait pas requeter une union
// de tables : on les manipule sous le type de l'une d'elles.
export function tableOrdonnee(liste: ListeOrdonnee) {
  return TABLES[liste] as typeof membresStaff;
}

/** L'ordre a donner a un nouvel element : apres le dernier. */
export async function ordreSuivant(liste: ListeOrdonnee): Promise<number> {
  const t = tableOrdonnee(liste);
  const [ligne] = await db().select({ plus: max(t.ordre) }).from(t);
  return (ligne?.plus ?? -1) + 1;
}

export async function deplacer(liste: ListeOrdonnee, id: number, sens: -1 | 1) {
  const t = tableOrdonnee(liste);
  const base = db();
  const lignes = await base
    .select({ id: t.id })
    .from(t)
    .where(isNull(t.supprimeLe))
    .orderBy(asc(t.ordre), asc(t.id));

  const ids = lignes.map((ligne) => ligne.id);
  const position = ids.indexOf(id);
  const cible = position + sens;
  if (position === -1 || cible < 0 || cible >= ids.length) return;

  [ids[position], ids[cible]] = [ids[cible]!, ids[position]!];
  const [premiere, ...suivantes] = ids.map((identifiant, rang) =>
    base.update(t).set({ ordre: rang }).where(eq(t.id, identifiant)),
  );
  if (premiere) await base.batch([premiere, ...suivantes]);
}
