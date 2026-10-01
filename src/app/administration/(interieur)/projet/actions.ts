"use server";

import { revalidatePath } from "next/cache";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { etapesProjet, membresStaff, partenaires, reglages } from "@/lib/db/schema";
import { MANIFESTE_DEPART, MANIFESTE_TEXTE_MAX, MANIFESTE_TITRE_MAX } from "@/lib/porte-entree";
import { CLES_REGLAGE } from "@/lib/reglages";
import { exigerDroit } from "@/lib/auth/session-courante";
import { deplacer, ordreSuivant, tableOrdonnee, type ListeOrdonnee } from "@/lib/ordre";
import { adresseSure } from "@/lib/texte-leger";
import { lireImageDuFormulaire, type IssueImage } from "@/lib/envoi-image";
import { effacerElementProjet, type ListeEffacable } from "@/lib/effacement";

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

/**
 * Enregistre en base avec la photo du formulaire : l'objet neuf est efface si
 * l'ecriture echoue, l'ancien seulement une fois l'ecriture reussie.
 */
async function enregistrerAvecImage(image: Extract<IssueImage, { ok: true }>, ecrire: () => Promise<unknown>) {
  try {
    await ecrire();
  } catch (erreur) {
    await image.annuler();
    throw erreur;
  }
  await image.apresEnregistrement();
}

const texteFacultatif = (max: number, nom: string) =>
  z.string().trim().max(max, `${nom} dépasse ${max} caractères.`).optional();

/* --- Chronologie --------------------------------------------------------- */

const schemaEtape = z.object({
  titre: z.string().trim().min(1, "Le titre est obligatoire.").max(120, "Le titre dépasse 120 caractères."),
  texte: texteFacultatif(2000, "Le texte"),
  survenuLe: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Date invalide.").optional(),
  dateLibre: texteFacultatif(40, "La période"),
  image_description: texteFacultatif(200, "La description de l'image"),
});

function colonnesEtape(donnees: FormData) {
  const analyse = schemaEtape.safeParse(valeurs(donnees));
  if (!analyse.success) return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  const { titre, texte, survenuLe, dateLibre, image_description: imageDescription } = analyse.data;
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
      imageDescription: imageDescription || null,
    },
  };
}

export async function enregistrerEtape(_p: EtatProjet, donnees: FormData): Promise<EtatProjet> {
  await exigerDroit("gererProjet");
  const lecture = colonnesEtape(donnees);
  if ("erreur" in lecture) return refus(donnees, lecture.erreur ?? "Saisie invalide.");

  const id = lireIdentifiant(donnees);
  const ancienne = id
    ? ((await db().select({ cle: etapesProjet.imageCle }).from(etapesProjet).where(eq(etapesProjet.id, id)).limit(1))[0]?.cle ?? null)
    : null;
  const image = await lireImageDuFormulaire(donnees, "image", { dossier: "projet", genre: "illustration", ancienne });
  if (!image.ok) return refus(donnees, image.erreur);
  const colonnes = { ...lecture.colonnes, ...(image.cle === undefined ? {} : { imageCle: image.cle }) };

  await enregistrerAvecImage(image, async () => {
    if (id) {
      await db()
        .update(etapesProjet)
        .set({ ...colonnes, modifieLe: new Date() })
        .where(eq(etapesProjet.id, id));
    } else {
      // Une etape nait en brouillon, comme tout contenu qui se publie.
      await db()
        .insert(etapesProjet)
        .values({ ...colonnes, ordre: await ordreSuivant("etapes"), etat: "brouillon" });
    }
  });
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
    // Etat voulu envoye par le formulaire (audit D2), jamais l'inverse de l'etat lu.
    .set({ etat: donnees.get("vers") === "publie" ? "publie" : "brouillon", modifieLe: new Date() })
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
  const id = lireIdentifiant(donnees);
  const ancienne = id
    ? ((await db().select({ cle: membresStaff.photoCle }).from(membresStaff).where(eq(membresStaff.id, id)).limit(1))[0]?.cle ?? null)
    : null;
  const image = await lireImageDuFormulaire(donnees, "photo", { dossier: "staff", genre: "photo", ancienne });
  if (!image.ok) return refus(donnees, image.erreur);
  const colonnes = {
    ...analyse.data,
    texte: analyse.data.texte || null,
    ...(image.cle === undefined ? {} : { photoCle: image.cle }),
  };

  await enregistrerAvecImage(image, async () => {
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
  });
  revalidatePath(`${CHEMIN}/equipe`);
  return { erreur: null };
}

/* --- Partenaires ---------------------------------------------------------- */

const schemaPartenaire = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire.").max(80, "Le nom dépasse 80 caractères."),
  lien: z.string().trim().max(300, "Le lien dépasse 300 caractères.").optional(),
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
  const ancienne = id
    ? ((await db().select({ cle: partenaires.logoCle }).from(partenaires).where(eq(partenaires.id, id)).limit(1))[0]?.cle ?? null)
    : null;
  const image = await lireImageDuFormulaire(donnees, "logo", { dossier: "partenaires", genre: "logo", ancienne });
  if (!image.ok) return refus(donnees, image.erreur);
  const colonnes = { nom: analyse.data.nom, lien, ...(image.cle === undefined ? {} : { logoCle: image.cle }) };

  await enregistrerAvecImage(image, async () => {
    if (id) {
      await db()
        .update(partenaires)
        .set({ ...colonnes, modifieLe: new Date() })
        .where(eq(partenaires.id, id));
    } else {
      await db()
        .insert(partenaires)
        .values({ ...colonnes, ordre: await ordreSuivant("partenaires") });
    }
  });
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
    .set({ actif: donnees.get("vers") === "actif", modifieLe: new Date() })
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

/**
 * Le manifeste de l'accueil (fiche fiches/accueil-porte-entree.md). Les blancs
 * sont ramenes a une espace avant de compter : l'accueil les affiche ainsi, et
 * un retour a la ligne ne doit pas faire refuser un texte que le navigateur
 * annonce dans la limite. Un champ vide, ou egal au texte de depart, efface
 * son reglage : l'accueil suit alors le texte de depart, meme s'il change.
 */
export async function enregistrerManifeste(_precedent: EtatProjet, donnees: FormData): Promise<EtatProjet> {
  await exigerDroit("gererProjet");
  const cles = [CLES_REGLAGE.manifesteTitre, CLES_REGLAGE.manifesteTexte];

  if (donnees.get("depart") === "1") {
    await db().delete(reglages).where(inArray(reglages.cle, cles));
    revalidatePath(`${CHEMIN}/manifeste`);
    revalidatePath("/");
    return { erreur: null, valeurs: { titre: "", texte: "", enregistre: "depart" } };
  }

  const titre = (donnees.get("titre") ?? "").toString().trim().replace(/\s+/g, " ");
  const texte = (donnees.get("texte") ?? "").toString().trim().replace(/\s+/g, " ");
  if (titre.length > MANIFESTE_TITRE_MAX) return refus(donnees, `Le titre dépasse ${MANIFESTE_TITRE_MAX} caractères.`);
  if (texte.length > MANIFESTE_TEXTE_MAX) return refus(donnees, `Le texte dépasse ${MANIFESTE_TEXTE_MAX} caractères.`);

  for (const [cle, valeur, depart] of [
    [CLES_REGLAGE.manifesteTitre, titre, MANIFESTE_DEPART.titre],
    [CLES_REGLAGE.manifesteTexte, texte, MANIFESTE_DEPART.texte],
  ] as const) {
    if (valeur && valeur !== depart) {
      await db()
        .insert(reglages)
        .values({ cle, valeur })
        .onConflictDoUpdate({ target: reglages.cle, set: { valeur, modifieLe: new Date() } });
    } else {
      await db().delete(reglages).where(eq(reglages.cle, cle));
    }
  }

  revalidatePath(`${CHEMIN}/manifeste`);
  revalidatePath("/");
  const personnalise = (titre && titre !== MANIFESTE_DEPART.titre) || (texte && texte !== MANIFESTE_DEPART.texte);
  return { erreur: null, valeurs: { titre, texte, enregistre: "1", personnalise: personnalise ? "1" : "" } };
}

/**
 * Effacement definitif d'un element deja a la corbeille, image comprise
 * (audit R1, R2). Reserve a `viderCorbeille`, confirme a l'ecran.
 */
export async function effacerElementDefinitivement(donnees: FormData): Promise<void> {
  await exigerDroit("viderCorbeille");
  if (donnees.get("confirme") !== "1") return;
  const liste = lireListe(donnees);
  const id = lireIdentifiant(donnees);
  if (!liste || !id) return;
  if (await effacerElementProjet(liste as ListeEffacable, id)) {
    revalidatePath(CHEMINS[liste]);
    revalidatePath("/le-projet");
    revalidatePath("/partenaires");
    revalidatePath("/effectif");
  }
}
