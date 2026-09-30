"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { exigerDroit } from "@/lib/auth/session-courante";
import { lireClassement } from "@/lib/classement";
import { db } from "@/lib/db";
import { classements, lignesClassement, saisons } from "@/lib/db/schema";

/**
 * Enregistre le classement d'une saison (droit `saisirResultats`, comme les
 * scores). Les lignes sont remplacees en un seul lot : le site ne voit jamais
 * un classement a moitie ecrit. La date de mise a jour est celle de
 * l'enregistrement, c'est elle qui commande l'affichage.
 */

export type EtatClassement = { erreur: string | null; enregistre?: boolean };

export async function enregistrerClassement(_precedent: EtatClassement, donnees: FormData): Promise<EtatClassement> {
  await exigerDroit("saisirResultats");
  const saisonId = Number(donnees.get("saisonId"));
  if (!Number.isInteger(saisonId) || saisonId <= 0) return { erreur: "Saison inconnue." };
  const [saison] = await db().select({ id: saisons.id }).from(saisons).where(eq(saisons.id, saisonId)).limit(1);
  if (!saison) return { erreur: "Saison inconnue." };

  const lu = lireClassement(donnees);
  if (!lu.ok) return { erreur: lu.erreur };

  const maintenant = new Date();
  const base = db();
  const [classement] = await base
    .insert(classements)
    .values({ saisonId, intitule: lu.intitule, misAJourLe: maintenant })
    .onConflictDoUpdate({
      target: classements.saisonId,
      set: { intitule: lu.intitule, misAJourLe: maintenant, supprimeLe: null, modifieLe: maintenant },
    })
    .returning({ id: classements.id });
  if (!classement) return { erreur: "Le classement n'a pas pu être enregistré." };

  await base.batch([
    base.delete(lignesClassement).where(eq(lignesClassement.classementId, classement.id)),
    base.insert(lignesClassement).values(lu.lignes.map((l, i) => ({ ...l, rang: i + 1, classementId: classement.id }))),
  ]);

  revalidatePath("/administration/matchs/classement");
  revalidatePath("/matchs");
  revalidatePath("/");
  return { erreur: null, enregistre: true };
}
