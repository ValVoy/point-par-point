"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { actualites, anciensSlugsActualite } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";
import { slugActualiteLibre } from "@/lib/actualites";

/**
 * Meme regle que les episodes : une actualite nait en brouillon, `redigerContenu`
 * pour ecrire, `publierContenu` pour publier. Le brouillon est obligatoire, decide
 * au cadrage : un texte ecrit a chaud apres une defaite ne part pas en ligne sur
 * un clic mal place.
 */

export type EtatActualite = { erreur: string | null };

const schema = z.object({
  titre: z
    .string()
    .trim()
    .min(1, "Le titre est obligatoire.")
    .max(140, "Le titre dépasse 140 caractères."),
  chapo: z.string().trim().max(300, "Le chapô dépasse 300 caractères.").optional(),
  corps: z
    .string()
    .trim()
    .min(1, "Le texte est obligatoire.")
    .max(20000, "Le texte dépasse 20 000 caractères."),
});

function lireIdentifiant(valeur: FormDataEntryValue | null) {
  const nombre = Number(valeur);
  return Number.isInteger(nombre) && nombre > 0 ? nombre : null;
}

function lire(donnees: FormData) {
  return schema.safeParse({
    titre: donnees.get("titre")?.toString(),
    chapo: donnees.get("chapo")?.toString(),
    corps: donnees.get("corps")?.toString(),
  });
}

export async function creerActualite(
  _precedent: EtatActualite,
  donnees: FormData,
): Promise<EtatActualite> {
  await exigerDroit("redigerContenu");

  const analyse = lire(donnees);
  if (!analyse.success) {
    return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  }

  const [creee] = await db()
    .insert(actualites)
    .values({
      titre: analyse.data.titre,
      chapo: analyse.data.chapo || null,
      corps: analyse.data.corps,
      slug: await slugActualiteLibre(analyse.data.titre),
      etat: "brouillon",
    })
    .returning({ id: actualites.id });

  revalidatePath("/administration/actualites");
  // On revient sur la fiche : un brouillon se relit avant d'etre publie.
  redirect(creee ? `/administration/actualites/${creee.id}?creee=1` : "/administration/actualites");
}

export async function modifierActualite(
  _precedent: EtatActualite,
  donnees: FormData,
): Promise<EtatActualite> {
  await exigerDroit("redigerContenu");

  const id = lireIdentifiant(donnees.get("id"));
  if (!id) return { erreur: "Actualité inconnue." };

  const analyse = lire(donnees);
  if (!analyse.success) {
    return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  }

  // L'adresse suit le titre ; l'ancienne est gardee pour rediriger les liens
  // deja partages (table anciens_slugs_actualite).
  const [avant] = await db().select({ slug: actualites.slug }).from(actualites).where(eq(actualites.id, id)).limit(1);
  const slug = await slugActualiteLibre(analyse.data.titre, id);
  if (avant && avant.slug !== slug) {
    await db().insert(anciensSlugsActualite).values({ slug: avant.slug, actualiteId: id }).onConflictDoNothing();
  }

  await db()
    .update(actualites)
    .set({
      titre: analyse.data.titre,
      chapo: analyse.data.chapo || null,
      corps: analyse.data.corps,
      slug,
      modifieLe: new Date(),
    })
    .where(eq(actualites.id, id));

  revalidatePath("/administration/actualites");
  redirect("/administration/actualites");
}

/** Publier date l'actualite du jour de sa premiere publication. */
export async function basculerPublicationActualite(donnees: FormData): Promise<void> {
  await exigerDroit("publierContenu");

  const id = lireIdentifiant(donnees.get("id"));
  if (!id) return;

  const [actualite] = await db()
    .select({ etat: actualites.etat, publieLe: actualites.publieLe })
    .from(actualites)
    .where(eq(actualites.id, id))
    .limit(1);
  if (!actualite) return;

  const publier = actualite.etat === "brouillon";
  await db()
    .update(actualites)
    .set({
      etat: publier ? "publie" : "brouillon",
      publieLe: publier ? (actualite.publieLe ?? new Date()) : actualite.publieLe,
      modifieLe: new Date(),
    })
    .where(eq(actualites.id, id));

  revalidatePath("/administration/actualites");
}

/** Principe 6 du codex : la corbeille pose une date, la ligne reste. */
export async function mettreActualiteALaCorbeille(donnees: FormData): Promise<void> {
  await exigerDroit("redigerContenu");
  const id = lireIdentifiant(donnees.get("id"));
  if (!id) return;

  await db()
    .update(actualites)
    .set({ supprimeLe: new Date(), modifieLe: new Date() })
    .where(eq(actualites.id, id));

  revalidatePath("/administration/actualites");
  redirect("/administration/actualites");
}

export async function restaurerActualite(donnees: FormData): Promise<void> {
  await exigerDroit("redigerContenu");
  const id = lireIdentifiant(donnees.get("id"));
  if (!id) return;

  await db()
    .update(actualites)
    .set({ supprimeLe: null, modifieLe: new Date() })
    .where(eq(actualites.id, id));

  revalidatePath("/administration/actualites");
}
