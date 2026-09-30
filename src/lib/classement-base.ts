import { and, asc, eq, isNull } from "drizzle-orm";
import { classementAJour } from "./classement";
import { db } from "./db";
import { classements, lignesClassement } from "./db/schema";

/** Lectures du classement (fiche fiches/classement.md). */

export async function classementDeLaSaison(saisonId: number) {
  const [classement] = await db()
    .select()
    .from(classements)
    .where(and(eq(classements.saisonId, saisonId), isNull(classements.supprimeLe)))
    .limit(1);
  if (!classement) return null;
  const lignes = await db()
    .select()
    .from(lignesClassement)
    .where(eq(lignesClassement.classementId, classement.id))
    .orderBy(asc(lignesClassement.rang));
  return { ...classement, lignes };
}

/** Le classement tel que le site public le montre : a jour, et non vide. Sinon null. */
export async function classementPublic(saisonId: number, maintenant: Date) {
  const classement = await classementDeLaSaison(saisonId);
  if (!classement || classement.lignes.length === 0 || !classementAJour(classement.misAJourLe, maintenant)) return null;
  const nous = classement.lignes.find((l) => l.estNous) ?? null;
  return { ...classement, nous };
}
