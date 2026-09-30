"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { saisons } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";

/**
 * Chaque action refait le controle de droit. Une action serveur est une
 * adresse joignable : la garde du layout ne la protege pas, et s'en remettre
 * a l'interface qui cache le bouton ne protege rien du tout.
 */

const schema = z.object({
  libelle: z.string().trim().min(1, "Le libellé est obligatoire.").max(40),
  debuteLe: z.string().optional(),
  finitLe: z.string().optional(),
});

export type EtatSaison = { erreur: string | null };

/** Un champ date vide arrive en chaine vide, pas en null. */
function versDate(valeur: string | undefined): Date | null {
  if (!valeur) return null;
  const date = new Date(valeur);
  return Number.isNaN(date.getTime()) ? null : date;
}

function lire(donnees: FormData) {
  return schema.safeParse({
    libelle: donnees.get("libelle"),
    debuteLe: donnees.get("debuteLe")?.toString(),
    finitLe: donnees.get("finitLe")?.toString(),
  });
}

export async function creerSaison(
  _precedent: EtatSaison,
  donnees: FormData,
): Promise<EtatSaison> {
  await exigerDroit("gererSaisons");

  const analyse = lire(donnees);
  if (!analyse.success) {
    return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  }

  const base = db();
  const existantes = await base
    .select({ id: saisons.id })
    .from(saisons)
    .where(isNull(saisons.supprimeLe));

  const [creee] = await base
    .insert(saisons)
    .values({
      libelle: analyse.data.libelle,
      debuteLe: versDate(analyse.data.debuteLe),
      finitLe: versDate(analyse.data.finitLe),
      // La toute premiere saison devient courante d'office : sans cela le site
      // n'aurait aucune saison a afficher tant qu'on n'y pense pas.
      courante: existantes.length === 0,
    })
    .returning();

  if (!creee) return { erreur: "La saison n'a pas pu être créée." };

  revalidatePath("/administration/saisons");
  return { erreur: null };
}

export async function modifierSaison(
  _precedent: EtatSaison,
  donnees: FormData,
): Promise<EtatSaison> {
  await exigerDroit("gererSaisons");

  const id = Number(donnees.get("id"));
  if (!Number.isInteger(id)) return { erreur: "Saison inconnue." };

  const analyse = lire(donnees);
  if (!analyse.success) {
    return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  }

  await db()
    .update(saisons)
    .set({
      libelle: analyse.data.libelle,
      debuteLe: versDate(analyse.data.debuteLe),
      finitLe: versDate(analyse.data.finitLe),
      modifieLe: new Date(),
    })
    .where(eq(saisons.id, id));

  revalidatePath("/administration/saisons");
  return { erreur: null };
}

/**
 * Une seule saison courante a la fois. La regle est tenue ici, dans le code
 * metier : SQLite ne sait pas exprimer « un seul vrai dans cette colonne », et
 * deux saisons courantes rendraient l'accueil du site indeterministe.
 */
export async function definirCourante(donnees: FormData): Promise<void> {
  await exigerDroit("gererSaisons");

  const id = Number(donnees.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  // Une saison inconnue ou a la corbeille ne devient jamais courante, et les
  // deux ecritures partent en un seul lot (audit D4) : sans cela, un identifiant
  // faux laissait le site sans saison courante.
  const base = db();
  const [cible] = await base
    .select({ id: saisons.id })
    .from(saisons)
    .where(and(eq(saisons.id, id), isNull(saisons.supprimeLe)))
    .limit(1);
  if (!cible) return;
  await base.batch([
    base.update(saisons).set({ courante: false }).where(ne(saisons.id, id)),
    base.update(saisons).set({ courante: true, modifieLe: new Date() }).where(eq(saisons.id, id)),
  ]);

  revalidatePath("/administration/saisons");
  revalidatePath("/administration/effectif");
}

/**
 * Principe 6 du codex : rien ne disparait par accident. On pose une date de
 * suppression, la ligne reste. Une saison courante ne part pas a la corbeille :
 * ce serait laisser le site sans saison affichable.
 */
export async function mettreSaisonALaCorbeille(
  donnees: FormData,
): Promise<void> {
  await exigerDroit("gererSaisons");

  const id = Number(donnees.get("id"));
  if (!Number.isInteger(id)) return;

  const [saison] = await db()
    .select({ courante: saisons.courante })
    .from(saisons)
    .where(eq(saisons.id, id))
    .limit(1);

  if (!saison || saison.courante) return;

  await db()
    .update(saisons)
    .set({ supprimeLe: new Date(), modifieLe: new Date() })
    .where(eq(saisons.id, id));

  revalidatePath("/administration/saisons");
}

export async function restaurerSaison(donnees: FormData): Promise<void> {
  await exigerDroit("gererSaisons");

  const id = Number(donnees.get("id"));
  if (!Number.isInteger(id)) return;

  await db()
    .update(saisons)
    .set({ supprimeLe: null, modifieLe: new Date() })
    .where(eq(saisons.id, id));

  revalidatePath("/administration/saisons");
}
