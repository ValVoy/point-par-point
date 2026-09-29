import { asc, isNotNull, isNull } from "drizzle-orm";
import { db } from "./db";
import { etapesProjet, membresStaff, partenaires } from "./db/schema";

/**
 * Lectures de la vitrine du projet, dans l'ordre choisi a la main. Les
 * elements a la corbeille sont lus a part, pour pouvoir les restaurer.
 */

export async function etapes(corbeille = false) {
  return db()
    .select()
    .from(etapesProjet)
    .where(corbeille ? isNotNull(etapesProjet.supprimeLe) : isNull(etapesProjet.supprimeLe))
    .orderBy(asc(etapesProjet.ordre), asc(etapesProjet.id));
}

export async function membres(corbeille = false) {
  return db()
    .select()
    .from(membresStaff)
    .where(corbeille ? isNotNull(membresStaff.supprimeLe) : isNull(membresStaff.supprimeLe))
    .orderBy(asc(membresStaff.ordre), asc(membresStaff.id));
}

export async function listePartenaires(corbeille = false) {
  return db()
    .select()
    .from(partenaires)
    .where(corbeille ? isNotNull(partenaires.supprimeLe) : isNull(partenaires.supprimeLe))
    .orderBy(asc(partenaires.ordre), asc(partenaires.id));
}
