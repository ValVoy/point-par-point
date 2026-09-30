"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { etapesProjet, membresStaff, partenaires, reglages } from "@/lib/db/schema";
import { CLES_REGLAGE } from "@/lib/reglages";
import { exigerDroit } from "@/lib/auth/session-courante";
import { deplacer, ordreSuivant, tableOrdonnee, type ListeOrdonnee } from "@/lib/ordre";
import { adresseSure } from "@/lib/texte-leger";

/**
 * La vitrine du projet : chronologie, equipe derriere, partenaires. Reservee
 * a l'administrateur (`gererProjet`) : c'est la structure de ce que le site
 * raconte de lui-meme, pas du contenu courant.
 *
 * En cas de refus, l'etat renvoie les valeurs saisies. Le formulaire les
 * reprend comme valeurs par defaut, et React, qui remet un formulaire a ses
 * valeurs par defaut apres chaque envoi, restaure la saisie au lieu de la vider.
 */

export type EtatProjet = { erreur: string | null; valeurs?: Record<string, string> };

const CHEMIN = "/administration/projet";

function valeurs(donnees: FormData): Record<string, string> {
  return Object.fromEntries(
    [...donnees.entries()]
      .filter(([cle, valeur]) => !cle.startsWith("$") && typeof valeur === "string")
      .map(([cle, valeur]) => [cle, valeur.toString()]),
  );
}

function lireIdentifiant(donnees: FormData) {
  const nombre = Number(donnees.get("id"));
  return Number.isInteger(nombre) && nombre > 0 ? nombre : null;
}

function refus(donnees: FormData, erreur: string): EtatProjet {
  return { erreur, valeurs: valeurs(donnees) };
}

const texteFacultatif = (max: number, nom: string) =>
  z.string().trim().max(max, `${nom} dépasse ${max} caractères.`).optional();

/* --- Chronologie --------------------------------------------------------- */

const schemaEtape = z.object({
  titre: z.string().trim().min(1, "Le titre est obligatoire.").max(120, "Le titre dépasse 120 caractères."),
  texte: texteFacultatif(2000, "Le texte"),
  survenuLe: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Date invalide.").optional(),
  dateLibre: texteFacultatif(40, "La période"),
});

function colonnesEtape(donnees: FormData) {
  const analyse = schemaEtape.safeParse(valeurs(donnees));
  if (!analyse.success) return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  const { titre, texte, survenuLe, dateLibre } = analyse.data;
  if (!survenuLe && !dateLibre) {
    return { erreur: "Donnez une date, ou une période comme « printemps 2026 »." };
  }
  return {
    colonnes: {
      titre,
      texte: texte || null,
      // Une date seule, a midi en heure universelle : aucun fuseau ne la fait changer de jour.
      survenuLe: survenuLe ? new Date(`${survenuLe}T12:00:00Z`) : null,
      dateLibre: dateLibre || null,
    },
  };
}

export async function enregistrerEtape(_p: EtatProjet, donnees: FormData): Promise<EtatProjet> {
  await exigerDroit("gererProjet");
  const lecture = colonnesEtape(donnees);
  if ("erreur" in lecture) return refus(donnees, lecture.erreur ?? "Saisie invalide.");

  const id = lireIdentifiant(donnees);
  if (id) {
    await db()
      .update(etapesProjet)
      .set({ ...lecture.colonnes, modifieLe: new Date() })
      .where(eq(etapesProjet.id, id));
  } else {
    // Une etape nait en brouillon, comme tout contenu qui se publie.
    await db()
      .insert(etapesProjet)
      .values({ ...lecture.colonnes, ordre: await ordreSuivant("etapes"), etat: "brouillon" });
  }
  revalidatePath(CHEMIN);
  return { erreur: null };
}

export async function basculerEtape(donnees: FormData): Promise<void> {
  await exigerDroit("gererProjet");
  const id = lireIdentifiant(donnees);
  if (!id) return;
  const [etape] = await db()
    .select({ etat: etapesProjet.etat })
    .from(etapesProjet)
    .where(eq(etapesProjet.id, id))
    .limit(1);
  if (!etape) return;
  await db()
    .update(etapesProjet)
    .set({ etat: etape.etat === "brouillon" ? "publie" : "brouillon", modifieLe: new Date() })
    .where(eq(etapesProjet.id, id));
  revalidatePath(CHEMIN);
}

/* --- L'equipe derriere --------------------------------------------------- */

const schemaMembre = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire.").max(80, "Le nom dépasse 80 caractères."),
  role: z.string().trim().min(1, "Le rôle est obligatoire.").max(80, "Le rôle dépasse 80 caractères."),
  texte: texteFacultatif(1000, "La présentation"),
});

export async function enregistrerMembre(_p: EtatProjet, donnees: FormData): Promise<EtatProjet> {
  await exigerDroit("gererProjet");
  const analyse = schemaMembre.safeParse(valeurs(donnees));
  if (!analyse.success) {
    return refus(donnees, analyse.error.issues[0]?.message ?? "Saisie invalide.");
  }
  const colonnes = { ...analyse.data, texte: analyse.data.texte || null };

  const id = lireIdentifiant(donnees);
  if (id) {
    await db()
      .update(membresStaff)
      .set({ ...colonnes, modifieLe: new Date() })
      .where(eq(membresStaff.id, id));
  } else {
    await db()
      .insert(membresStaff)
      .values({ ...colonnes, ordre: await ordreSuivant("staff") });
  }
  revalidatePath(`${CHEMIN}/equipe`);
  return { erreur: null };
}

/* --- Partenaires ---------------------------------------------------------- */

const schemaPartenaire = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire.").max(80, "Le nom dépasse 80 caractères."),
  lien: z.string().trim().max(300).optional(),
});

export async function enregistrerPartenaire(
  _p: EtatProjet,
  donnees: FormData,
): Promise<EtatProjet> {
  await exigerDroit("gererProjet");
  const analyse = schemaPartenaire.safeParse(valeurs(donnees));
  if (!analyse.success) {
    return refus(donnees, analyse.error.issues[0]?.message ?? "Saisie invalide.");
  }

  // Le lien part sur le site public : seule une adresse web complete passe.
  let lien: string | null = null;
  if (analyse.data.lien) {
    lien = adresseSure(analyse.data.lien);
    if (!lien || !lien.startsWith("http")) {
      return refus(donnees, "Le lien doit être une adresse web complète, qui commence par https://.");
    }
  }

  const id = lireIdentifiant(donnees);
  if (id) {
    await db()
      .update(partenaires)
      .set({ nom: analyse.data.nom, lien, modifieLe: new Date() })
      .where(eq(partenaires.id, id));
  } else {
    await db()
      .insert(partenaires)
      .values({ nom: analyse.data.nom, lien, ordre: await ordreSuivant("partenaires") });
  }
  revalidatePath(`${CHEMIN}/partenaires`);
  return { erreur: null };
}

/** Un partenaire inactif reste en base, sans apparaitre sur le site. */
export async function basculerPartenaire(donnees: FormData): Promise<void> {
  await exigerDroit("gererProjet");
  const id = lireIdentifiant(donnees);
  if (!id) return;
  const [partenaire] = await db()
    .select({ actif: partenaires.actif })
    .from(partenaires)
    .where(eq(partenaires.id, id))
    .limit(1);
  if (!partenaire) return;
  await db()
    .update(partenaires)
    .set({ actif: !partenaire.actif, modifieLe: new Date() })
    .where(eq(partenaires.id, id));
  revalidatePath(`${CHEMIN}/partenaires`);
}

/* --- Commun aux trois listes ------------------------------------------------ */

const CHEMINS: Record<ListeOrdonnee, string> = {
  etapes: CHEMIN,
  staff: `${CHEMIN}/equipe`,
  partenaires: `${CHEMIN}/partenaires`,
};

function lireListe(donnees: FormData): ListeOrdonnee | null {
  const liste = donnees.get("liste")?.toString();
  return liste === "etapes" || liste === "staff" || liste === "partenaires" ? liste : null;
}

export async function deplacerElement(donnees: FormData): Promise<void> {
  await exigerDroit("gererProjet");
  const liste = lireListe(donnees);
  const id = lireIdentifiant(donnees);
  const sens = donnees.get("sens") === "haut" ? -1 : 1;
  if (!liste || !id) return;
  await deplacer(liste, id, sens);
  revalidatePath(CHEMINS[liste]);
}

/** Principe 6 du codex : la corbeille pose une date, la ligne reste. */
export async function corbeilleElement(donnees: FormData): Promise<void> {
  await exigerDroit("gererProjet");
  const liste = lireListe(donnees);
  const id = lireIdentifiant(donnees);
  if (!liste || !id) return;
  const table = tableOrdonnee(liste);
  const restaurer = donnees.get("restaurer") === "1";
  await db()
    .update(table)
    .set({ supprimeLe: restaurer ? null : new Date(), modifieLe: new Date() })
    .where(eq(table.id, id));
  revalidatePath(CHEMINS[liste]);
}

/* --- La salle ------------------------------------------------------------ */

/**
 * « Venir a la salle » : transports, parking, acces PMR, entree, buvette, en
 * texte leger. Un seul texte, remplace a chaque enregistrement ; vide, il
 * disparait de la page publique.
 */
export async function enregistrerVenirALaSalle(_precedent: EtatProjet, donnees: FormData): Promise<EtatProjet> {
  await exigerDroit("gererProjet");
  const texte = (donnees.get("texte") ?? "").toString().trim();
  if (texte.length > 4000) return refus(donnees, "Le texte dépasse 4 000 caractères.");

  await db()
    .insert(reglages)
    .values({ cle: CLES_REGLAGE.venirALaSalle, valeur: texte })
    .onConflictDoUpdate({ target: reglages.cle, set: { valeur: texte, modifieLe: new Date() } });

  revalidatePath(`${CHEMIN}/salle`);
  return { erreur: null, valeurs: { texte, enregistre: "1" } };
}
