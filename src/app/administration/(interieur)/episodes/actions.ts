"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { episodes, rencontres } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";
import { slugEpisodeLibre } from "@/lib/episodes";
import { saisonCourante } from "@/lib/saisons";
import { extraireIdYoutube } from "@/lib/youtube";

/**
 * Un episode nait toujours en brouillon (principe 6 du codex, rien ne se
 * publie par accident) : creer et modifier demandent `redigerContenu`,
 * publier et depublier demandent `publierContenu`. Les deux droits sont
 * aujourd'hui donnes aux memes roles, mais ce ne sont pas les memes gestes.
 */

export type EtatEpisode = { erreur: string | null; enregistre?: boolean };

const schema = z.object({
  adresse: z.string().trim().min(1, "L'adresse de la vidéo est obligatoire."),
  titre: z
    .string()
    .trim()
    .min(1, "Le titre est obligatoire.")
    .max(120, "Le titre dépasse 120 caractères."),
  numero: z.string().trim().regex(/^\d{0,3}$/, "Le numéro est un nombre.").optional(),
  resume: z.string().trim().max(1500, "Le résumé dépasse 1 500 caractères.").optional(),
  publieLe: z.string().optional(),
  rencontreId: z.string().optional(),
});

function texte(donnees: FormData, nom: string): string | undefined {
  return donnees.get(nom)?.toString();
}

function lireIdentifiant(valeur: FormDataEntryValue | string | null | undefined) {
  const nombre = Number(valeur);
  return Number.isInteger(nombre) && nombre > 0 ? nombre : null;
}

/** Une date seule, lue a midi en heure universelle : aucun fuseau ne la fait changer de jour. */
function versDate(valeur: string | undefined): Date | null {
  if (!valeur || !/^\d{4}-\d{2}-\d{2}$/.test(valeur)) return null;
  const date = new Date(`${valeur}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

type Lecture =
  | { erreur: string }
  | {
      colonnes: {
        youtubeId: string;
        titre: string;
        numero: number | null;
        resume: string | null;
        publieLe: Date | null;
        rencontreId: number | null;
        saisonId: number | null;
      };
    };

async function lire(donnees: FormData): Promise<Lecture> {
  const analyse = schema.safeParse({
    adresse: texte(donnees, "adresse"),
    titre: texte(donnees, "titre"),
    numero: texte(donnees, "numero"),
    resume: texte(donnees, "resume"),
    publieLe: texte(donnees, "publieLe"),
    rencontreId: texte(donnees, "rencontreId"),
  });
  if (!analyse.success) {
    return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  }

  const youtubeId = extraireIdYoutube(analyse.data.adresse);
  if (!youtubeId) {
    return {
      erreur:
        "Cette adresse n'est pas celle d'une vidéo YouTube. Collez le lien de partage de la vidéo.",
    };
  }

  // L'episode suit la saison du match qu'il raconte, sinon la saison courante.
  const rencontreId = lireIdentifiant(analyse.data.rencontreId);
  let saisonId: number | null = null;
  if (rencontreId) {
    const [rencontre] = await db()
      .select({ saisonId: rencontres.saisonId })
      .from(rencontres)
      .where(eq(rencontres.id, rencontreId))
      .limit(1);
    if (!rencontre) return { erreur: "Le match choisi n'existe plus." };
    saisonId = rencontre.saisonId;
  } else {
    saisonId = (await saisonCourante())?.id ?? null;
  }

  return {
    colonnes: {
      youtubeId,
      titre: analyse.data.titre,
      numero: analyse.data.numero ? Number(analyse.data.numero) : null,
      resume: analyse.data.resume || null,
      publieLe: versDate(analyse.data.publieLe),
      rencontreId,
      saisonId,
    },
  };
}

export async function creerEpisode(
  _precedent: EtatEpisode,
  donnees: FormData,
): Promise<EtatEpisode> {
  await exigerDroit("redigerContenu");

  const lecture = await lire(donnees);
  if ("erreur" in lecture) return { erreur: lecture.erreur };
  const { colonnes } = lecture;

  await db()
    .insert(episodes)
    .values({
      ...colonnes,
      slug: await slugEpisodeLibre(colonnes.titre, colonnes.numero),
      etat: "brouillon",
    });

  revalidatePath("/administration/episodes");
  return { erreur: null, enregistre: true };
}

export async function modifierEpisode(
  _precedent: EtatEpisode,
  donnees: FormData,
): Promise<EtatEpisode> {
  await exigerDroit("redigerContenu");

  const id = lireIdentifiant(donnees.get("id"));
  if (!id) return { erreur: "Épisode inconnu." };

  const lecture = await lire(donnees);
  if ("erreur" in lecture) return { erreur: lecture.erreur };
  const { colonnes } = lecture;

  await db()
    .update(episodes)
    .set({
      ...colonnes,
      slug: await slugEpisodeLibre(colonnes.titre, colonnes.numero, id),
      modifieLe: new Date(),
    })
    .where(eq(episodes.id, id));

  revalidatePath("/administration/episodes");
  redirect("/administration/episodes");
}

/**
 * Publier pose la date de publication si elle manque : un episode publie sans
 * date ne saurait pas ou se ranger dans la liste publique.
 */
export async function basculerPublication(donnees: FormData): Promise<void> {
  await exigerDroit("publierContenu");

  const id = lireIdentifiant(donnees.get("id"));
  if (!id) return;

  const [episode] = await db()
    .select({ etat: episodes.etat, publieLe: episodes.publieLe })
    .from(episodes)
    .where(eq(episodes.id, id))
    .limit(1);
  if (!episode) return;

  const publier = episode.etat === "brouillon";
  await db()
    .update(episodes)
    .set({
      etat: publier ? "publie" : "brouillon",
      publieLe: publier ? (episode.publieLe ?? new Date()) : episode.publieLe,
      modifieLe: new Date(),
    })
    .where(eq(episodes.id, id));

  revalidatePath("/administration/episodes");
}

/** Principe 6 du codex : la corbeille pose une date, la ligne reste. */
export async function mettreEpisodeALaCorbeille(donnees: FormData): Promise<void> {
  await exigerDroit("redigerContenu");
  const id = lireIdentifiant(donnees.get("id"));
  if (!id) return;

  await db()
    .update(episodes)
    .set({ supprimeLe: new Date(), modifieLe: new Date() })
    .where(eq(episodes.id, id));

  revalidatePath("/administration/episodes");
  redirect("/administration/episodes");
}

export async function restaurerEpisode(donnees: FormData): Promise<void> {
  await exigerDroit("redigerContenu");
  const id = lireIdentifiant(donnees.get("id"));
  if (!id) return;

  await db()
    .update(episodes)
    .set({ supprimeLe: null, modifieLe: new Date() })
    .where(eq(episodes.id, id));

  revalidatePath("/administration/episodes");
}
