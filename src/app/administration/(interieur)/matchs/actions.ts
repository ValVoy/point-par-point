"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { ETATS_RENCONTRE, anciensSlugsRencontre, rencontres, setsRencontre } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";
import { depuisChampDateHeure } from "@/lib/dates";
import { slugRencontreLibre } from "@/lib/rencontres";
import {
  analyserScoreFinal,
  analyserSets,
  NOMBRE_DE_SETS_MAX,
} from "@/lib/score";

/**
 * Chaque action refait le controle de droit, comme partout ailleurs : une
 * action serveur est une adresse joignable, la garde du layout ne la protege
 * pas. Le droit exige est `saisirResultats`, ouvert au redacteur : c'est lui
 * qui sera au gymnase le soir du match.
 */

export type EtatMatch = { erreurs: string[] };
export type EtatScore = { erreurs: string[]; alertes: string[]; enregistre: boolean };

const LIEUX = ["domicile", "exterieur"] as const;

const schemaMatch = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La date est obligatoire."),
  heure: z.string().regex(/^\d{2}:\d{2}$/, "L'heure est obligatoire."),
  adversaire: z
    .string()
    .trim()
    .min(1, "L'adversaire est obligatoire.")
    .max(80, "Le nom de l'adversaire dépasse 80 caractères."),
  lieu: z.enum(LIEUX, "Précisez domicile ou extérieur."),
  competition: z.string().trim().max(80).optional(),
  salleNom: z.string().trim().max(80).optional(),
  salleAdresse: z.string().trim().max(160).optional(),
});

type ChampsMatch = z.infer<typeof schemaMatch>;

/** Un champ vide arrive en chaine vide ; en base, l'absence s'ecrit null. */
function ouNull(valeur: string | undefined): string | null {
  return valeur ? valeur : null;
}

function texte(donnees: FormData, nom: string): string | undefined {
  return donnees.get(nom)?.toString();
}

function lireMatch(donnees: FormData) {
  return schemaMatch.safeParse({
    date: texte(donnees, "date"),
    heure: texte(donnees, "heure"),
    adversaire: texte(donnees, "adversaire"),
    lieu: texte(donnees, "lieu"),
    competition: texte(donnees, "competition"),
    salleNom: texte(donnees, "salleNom"),
    salleAdresse: texte(donnees, "salleAdresse"),
  });
}

function versInstant(champs: ChampsMatch): Date | null {
  return depuisChampDateHeure(`${champs.date}T${champs.heure}`);
}

function colonnes(champs: ChampsMatch, joueLe: Date) {
  return {
    joueLe,
    adversaire: champs.adversaire,
    aDomicile: champs.lieu === "domicile",
    competition: ouNull(champs.competition),
    salleNom: ouNull(champs.salleNom),
    salleAdresse: ouNull(champs.salleAdresse),
  };
}

function lireIdentifiant(donnees: FormData, nom = "id"): number | null {
  const valeur = Number(donnees.get(nom));
  return Number.isInteger(valeur) && valeur > 0 ? valeur : null;
}

export async function creerMatch(
  _precedent: EtatMatch,
  donnees: FormData,
): Promise<EtatMatch> {
  await exigerDroit("saisirResultats");

  const saisonId = lireIdentifiant(donnees, "saisonId");
  if (!saisonId) return { erreurs: ["Saison inconnue."] };

  const analyse = lireMatch(donnees);
  if (!analyse.success) {
    return { erreurs: [analyse.error.issues[0]?.message ?? "Saisie invalide."] };
  }
  const joueLe = versInstant(analyse.data);
  if (!joueLe) return { erreurs: ["Cette date ou cette heure n'existe pas."] };

  await db()
    .insert(rencontres)
    .values({
      saisonId,
      slug: await slugRencontreLibre(joueLe, analyse.data.adversaire),
      ...colonnes(analyse.data, joueLe),
    });

  revalidatePath("/administration/matchs");
  return { erreurs: [] };
}

/**
 * Le calendrier complet d'une saison, saisi d'un coup. Tout ou rien : une
 * seule ligne fautive et rien n'est enregistre, avec le numero de chaque
 * ligne a corriger. Un calendrier a moitie importe serait pire qu'aucun,
 * parce qu'on ne saurait plus ce qui manque.
 */
export async function creerCalendrier(
  _precedent: EtatMatch,
  donnees: FormData,
): Promise<EtatMatch> {
  await exigerDroit("saisirResultats");

  const saisonId = lireIdentifiant(donnees, "saisonId");
  if (!saisonId) return { erreurs: ["Saison inconnue."] };

  const competition = texte(donnees, "competition");
  const colonnesSaisies = ["date", "heure", "adversaire", "lieu", "salleNom"].map(
    (nom) => donnees.getAll(nom).map((valeur) => valeur.toString()),
  );
  const [dates = [], heures = [], adversaires = [], lieux = [], salles = []] =
    colonnesSaisies;

  const erreurs: string[] = [];
  const valides: { champs: ChampsMatch; joueLe: Date }[] = [];

  dates.forEach((date, index) => {
    const ligne = index + 1;
    const adversaire = adversaires[index] ?? "";
    const heure = heures[index] ?? "";
    // Une ligne sans date ni adversaire est une ligne laissee vide, pas une
    // erreur : la grille en propose toujours plus que necessaire.
    if (!date.trim() && !adversaire.trim()) return;

    const analyse = schemaMatch.safeParse({
      date,
      heure,
      adversaire,
      lieu: lieux[index],
      competition,
      salleNom: salles[index],
    });
    if (!analyse.success) {
      erreurs.push(`Ligne ${ligne} : ${analyse.error.issues[0]?.message ?? "saisie invalide."}`);
      return;
    }
    const joueLe = versInstant(analyse.data);
    if (!joueLe) {
      erreurs.push(`Ligne ${ligne} : cette date ou cette heure n'existe pas.`);
      return;
    }
    valides.push({ champs: analyse.data, joueLe });
  });

  if (erreurs.length > 0) return { erreurs };
  if (valides.length === 0) return { erreurs: ["Aucune ligne n'est remplie."] };

  const reserves = new Set<string>();
  const valeurs = [];
  for (const { champs, joueLe } of valides) {
    const slug = await slugRencontreLibre(joueLe, champs.adversaire, { reserves });
    reserves.add(slug);
    valeurs.push({ saisonId, slug, ...colonnes(champs, joueLe) });
  }

  // Une seule requete d'insertion a plusieurs lignes : atomique par nature.
  await db().insert(rencontres).values(valeurs);

  revalidatePath("/administration/matchs");
  redirect(`/administration/matchs?saison=${saisonId}&ajoutes=${valeurs.length}`);
}

const schemaEtat = z.enum(ETATS_RENCONTRE);

export async function modifierMatch(
  _precedent: EtatMatch,
  donnees: FormData,
): Promise<EtatMatch> {
  await exigerDroit("saisirResultats");

  const id = lireIdentifiant(donnees);
  if (!id) return { erreurs: ["Match inconnu."] };

  const analyse = lireMatch(donnees);
  if (!analyse.success) {
    return { erreurs: [analyse.error.issues[0]?.message ?? "Saisie invalide."] };
  }
  const etat = schemaEtat.safeParse(texte(donnees, "etat"));
  if (!etat.success) return { erreurs: ["État du match inconnu."] };

  const joueLe = versInstant(analyse.data);
  if (!joueLe) return { erreurs: ["Cette date ou cette heure n'existe pas."] };

  const commentaire = texte(donnees, "commentaire")?.trim() ?? "";
  if (commentaire.length > 2000) {
    return { erreurs: ["Le commentaire dépasse 2 000 caractères."] };
  }

  // L'adresse suit la date et l'adversaire : une faute de frappe corrigee ne
  // doit pas rester gravee dans l'URL du match. L'ancienne est gardee pour
  // rediriger les liens deja partages (table anciens_slugs_rencontre).
  const [avant] = await db().select({ slug: rencontres.slug }).from(rencontres).where(eq(rencontres.id, id)).limit(1);
  const slug = await slugRencontreLibre(joueLe, analyse.data.adversaire, { sauf: id });
  if (avant && avant.slug !== slug) {
    await db().insert(anciensSlugsRencontre).values({ slug: avant.slug, rencontreId: id }).onConflictDoNothing();
  }

  const [rencontre] = await db()
    .update(rencontres)
    .set({
      ...colonnes(analyse.data, joueLe),
      slug,
      etat: etat.data,
      commentaire: ouNull(commentaire),
      modifieLe: new Date(),
    })
    .where(eq(rencontres.id, id))
    .returning({ saisonId: rencontres.saisonId });

  if (!rencontre) return { erreurs: ["Match inconnu."] };

  revalidatePath("/administration/matchs");
  redirect(`/administration/matchs?saison=${rencontre.saisonId}`);
}

/**
 * Le score, depuis le gymnase. Deux modes : le detail set par set, dont le
 * total se deduit, ou le score final seul quand personne n'a note les sets
 * (principe 3 du codex, la saisie est partielle par nature).
 *
 * Tout part en un seul lot : effacer les anciens sets, ecrire les nouveaux et
 * mettre a jour le total ne peuvent pas se faire a moitie.
 */
export async function enregistrerScore(
  _precedent: EtatScore,
  donnees: FormData,
): Promise<EtatScore> {
  await exigerDroit("saisirResultats");

  const id = lireIdentifiant(donnees);
  if (!id) return { erreurs: ["Match inconnu."], alertes: [], enregistre: false };

  const base = db();
  const effacerSets = base.delete(setsRencontre).where(eq(setsRencontre.rencontreId, id));
  const marquerJoue = (setsNous: number, setsEux: number) =>
    base
      .update(rencontres)
      .set({ setsNous, setsEux, etat: "jouee", modifieLe: new Date() })
      .where(eq(rencontres.id, id));

  if (texte(donnees, "mode") === "final") {
    const final = analyserScoreFinal(
      texte(donnees, "finalNous") ?? "",
      texte(donnees, "finalEux") ?? "",
    );
    if ("erreur" in final) return { erreurs: [final.erreur], alertes: [], enregistre: false };
    await base.batch([effacerSets, marquerJoue(final.setsNous, final.setsEux)]);
  } else {
    const saisis = Array.from({ length: NOMBRE_DE_SETS_MAX }, (_, i) => ({
      nous: texte(donnees, `set${i + 1}Nous`) ?? "",
      eux: texte(donnees, `set${i + 1}Eux`) ?? "",
    }));
    const analyse = analyserSets(saisis);
    if (analyse.erreurs.length > 0) {
      return { erreurs: analyse.erreurs, alertes: [], enregistre: false };
    }
    if (analyse.sets.length === 0) {
      return {
        erreurs: ["Saisissez au moins un set, ou passez au score final seul."],
        alertes: [],
        enregistre: false,
      };
    }
    await base.batch([
      effacerSets,
      base.insert(setsRencontre).values(
        analyse.sets.map((set) => ({
          rencontreId: id,
          numero: set.numero,
          pointsNous: set.nous,
          pointsEux: set.eux,
        })),
      ),
      marquerJoue(analyse.setsNous, analyse.setsEux),
    ]);
    revalidatePath("/administration/matchs");
    return { erreurs: [], alertes: analyse.alertes, enregistre: true };
  }

  revalidatePath("/administration/matchs");
  return { erreurs: [], alertes: [], enregistre: true };
}

/** Principe 6 du codex : la corbeille pose une date, la ligne reste. */
export async function mettreMatchALaCorbeille(donnees: FormData): Promise<void> {
  await exigerDroit("saisirResultats");
  const id = lireIdentifiant(donnees);
  if (!id) return;

  const [rencontre] = await db()
    .update(rencontres)
    .set({ supprimeLe: new Date(), modifieLe: new Date() })
    .where(eq(rencontres.id, id))
    .returning({ saisonId: rencontres.saisonId });

  revalidatePath("/administration/matchs");
  if (rencontre) redirect(`/administration/matchs?saison=${rencontre.saisonId}`);
}

export async function restaurerMatch(donnees: FormData): Promise<void> {
  await exigerDroit("saisirResultats");
  const id = lireIdentifiant(donnees);
  if (!id) return;

  await db()
    .update(rencontres)
    .set({ supprimeLe: null, modifieLe: new Date() })
    .where(eq(rencontres.id, id));

  revalidatePath("/administration/matchs");
}
