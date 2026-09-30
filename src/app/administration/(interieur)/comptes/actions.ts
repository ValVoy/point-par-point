"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { exigerDroit } from "@/lib/auth/session-courante";
import { hacher } from "@/lib/auth/mots-de-passe";
import { fermerToutesLesSessions } from "@/lib/auth/sessions";
import { compterAdminsActifs, genererMotDePasse, refusChangement, type ChangementCompte } from "@/lib/comptes";
import { db } from "@/lib/db";
import { ROLES, utilisateurs } from "@/lib/db/schema";

/**
 * Gestion des comptes, reservee a `gererComptes` (l'administrateur). Chaque
 * action refait le controle de droit : la page n'est qu'un confort.
 *
 * Un mot de passe provisoire n'est rendu qu'une fois, dans l'etat de l'action,
 * et n'est jamais stocke en clair ni journalise.
 */

const CHEMIN = "/administration/comptes";

export type EtatCompte = {
  erreur: string | null;
  /** Rendu une seule fois, pour etre transmis de la main a la main. */
  provisoire?: { nom: string; email: string; motDePasse: string };
  valeurs?: Record<string, string>;
};

const schemaCreation = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire.").max(80, "Le nom dépasse 80 caractères."),
  email: z.email("Cette adresse e-mail n'est pas valide.").max(160),
  role: z.enum(ROLES, "Rôle inconnu."),
});

const texte = (donnees: FormData, cle: string) => (donnees.get(cle) ?? "").toString();

function lireIdentifiant(donnees: FormData) {
  const nombre = Number(donnees.get("id"));
  return Number.isInteger(nombre) && nombre > 0 ? nombre : null;
}

export async function creerCompte(_precedent: EtatCompte, donnees: FormData): Promise<EtatCompte> {
  await exigerDroit("gererComptes");
  const valeurs = { nom: texte(donnees, "nom"), email: texte(donnees, "email").trim().toLowerCase(), role: texte(donnees, "role") };
  const analyse = schemaCreation.safeParse(valeurs);
  if (!analyse.success) return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide.", valeurs };

  const [existant] = await db()
    .select({ id: utilisateurs.id })
    .from(utilisateurs)
    .where(eq(utilisateurs.email, analyse.data.email))
    .limit(1);
  if (existant) return { erreur: "Un compte existe déjà avec cette adresse.", valeurs };

  const motDePasse = genererMotDePasse();
  await db()
    .insert(utilisateurs)
    .values({ ...analyse.data, motDePasseHache: await hacher(motDePasse), actif: true });

  revalidatePath(CHEMIN);
  return { erreur: null, provisoire: { nom: analyse.data.nom, email: analyse.data.email, motDePasse } };
}

async function cibleDe(donnees: FormData) {
  const id = lireIdentifiant(donnees);
  if (!id) return null;
  const [cible] = await db()
    .select({ id: utilisateurs.id, nom: utilisateurs.nom, email: utilisateurs.email, role: utilisateurs.role, actif: utilisateurs.actif })
    .from(utilisateurs)
    .where(and(eq(utilisateurs.id, id), isNull(utilisateurs.supprimeLe)))
    .limit(1);
  return cible ?? null;
}

/**
 * Applique un changement de role ou d'etat. Le controle « un admin au moins »
 * est refait apres l'ecriture : deux administrateurs qui se retrograderaient
 * l'un l'autre au meme instant passeraient tous deux le premier controle.
 */
async function appliquer(donnees: FormData, changement: ChangementCompte): Promise<EtatCompte> {
  const acteur = await exigerDroit("gererComptes");
  const cible = await cibleDe(donnees);
  if (!cible) return { erreur: "Compte introuvable." };

  const refus = refusChangement(acteur.id, cible, changement, await compterAdminsActifs());
  if (refus) return { erreur: refus };

  await db()
    .update(utilisateurs)
    .set({ ...changement, modifieLe: new Date() })
    .where(eq(utilisateurs.id, cible.id));

  if ((await compterAdminsActifs()) === 0) {
    await db()
      .update(utilisateurs)
      .set({ role: cible.role, actif: cible.actif, modifieLe: new Date() })
      .where(eq(utilisateurs.id, cible.id));
    return { erreur: "Il doit rester au moins un administrateur actif." };
  }

  if (changement.actif === false) await fermerToutesLesSessions(cible.id);
  revalidatePath(CHEMIN);
  return { erreur: null };
}

export async function changerRole(_precedent: EtatCompte, donnees: FormData): Promise<EtatCompte> {
  await exigerDroit("gererComptes");
  const role = texte(donnees, "role");
  if (!(ROLES as readonly string[]).includes(role)) return { erreur: "Rôle inconnu." };
  return appliquer(donnees, { role: role as (typeof ROLES)[number] });
}

export async function basculerActif(_precedent: EtatCompte, donnees: FormData): Promise<EtatCompte> {
  return appliquer(donnees, { actif: texte(donnees, "actif") === "1" });
}

/** Nouveau mot de passe provisoire ; toutes les sessions du compte sont fermees. */
export async function reinitialiserMotDePasse(_precedent: EtatCompte, donnees: FormData): Promise<EtatCompte> {
  const acteur = await exigerDroit("gererComptes");
  const cible = await cibleDe(donnees);
  if (!cible) return { erreur: "Compte introuvable." };
  if (cible.id === acteur.id) return { erreur: "Pour votre propre compte, passez par « Mon compte »." };

  const motDePasse = genererMotDePasse();
  await db()
    .update(utilisateurs)
    .set({ motDePasseHache: await hacher(motDePasse), modifieLe: new Date() })
    .where(eq(utilisateurs.id, cible.id));
  await fermerToutesLesSessions(cible.id);

  revalidatePath(CHEMIN);
  return { erreur: null, provisoire: { nom: cible.nom, email: cible.email, motDePasse } };
}
