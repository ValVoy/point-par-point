"use server";

import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { effectifs, joueurs, POSTES } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";
import { lireFicheJoueur } from "@/lib/fiche-joueur";
import { slugOuSecours } from "@/lib/slug";

export type EtatJoueur = { erreur: string | null };

const schemaJoueur = z.object({
  numero: z.string().optional(),
  poste: z.enum(POSTES, "Choisissez un poste."),
  saisonId: z.string(),
});

function versEntier(valeur: string | undefined): number | null {
  if (!valeur) return null;
  const nombre = Number(valeur);
  return Number.isInteger(nombre) ? nombre : null;
}

/**
 * Fabrique un identifiant d'adresse libre. Deux joueurs peuvent porter le meme
 * prenom et le meme nom, et l'adresse doit rester unique sans que personne
 * n'ait a y penser au moment de la saisie.
 */
async function slugLibre(prenom: string, nom: string): Promise<string> {
  const base = slugOuSecours(`${prenom} ${nom}`, "joueur");
  const existants = await db()
    .select({ slug: joueurs.slug })
    .from(joueurs);
  const pris = new Set(existants.map((ligne) => ligne.slug));

  if (!pris.has(base)) return base;
  let suffixe = 2;
  while (pris.has(`${base}-${suffixe}`)) suffixe += 1;
  return `${base}-${suffixe}`;
}

export async function ajouterJoueur(
  _precedent: EtatJoueur,
  donnees: FormData,
): Promise<EtatJoueur> {
  await exigerDroit("gererEffectif");

  const analyse = schemaJoueur.safeParse({
    numero: donnees.get("numero")?.toString(),
    poste: donnees.get("poste"),
    saisonId: donnees.get("saisonId")?.toString(),
  });

  if (!analyse.success) {
    return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  }

  const saisonId = versEntier(analyse.data.saisonId);
  if (!saisonId) return { erreur: "Saison inconnue." };

  // Memes regles que la fiche joueur (audit D5) : une date de naissance en 3000
  // ou une taille de 5 cm passaient ici, alors que la fiche les refusait.
  const fiche = lireFicheJoueur(donnees, new Date());
  if (!fiche.ok) return { erreur: fiche.erreur };

  const numero = versEntier(analyse.data.numero);
  if (numero !== null && (numero < 0 || numero > 99)) return { erreur: "Le numéro va de 0 à 99." };
  if (numero !== null) {
    const conflit = await numeroDejaPris(saisonId, numero, null);
    if (conflit) return { erreur: `Le numéro ${numero} est déjà porté par ${conflit}.` };
  }

  const base = db();
  const [joueur] = await base
    .insert(joueurs)
    .values({
      prenom: fiche.fiche.prenom,
      nom: fiche.fiche.nom,
      slug: await slugLibre(fiche.fiche.prenom, fiche.fiche.nom),
      neLe: fiche.fiche.neLe,
      tailleCm: fiche.fiche.tailleCm,
      presentation: fiche.fiche.presentation,
      parcours: fiche.fiche.parcours,
    })
    .returning();

  if (!joueur) return { erreur: "Le joueur n'a pas pu être créé." };

  await base.insert(effectifs).values({
    saisonId,
    joueurId: joueur.id,
    numero,
    poste: analyse.data.poste,
  });

  revalidatePath("/administration/effectif");
  return { erreur: null };
}

/**
 * Un numero de maillot ne peut pas etre porte par deux joueurs la meme saison.
 * La verification vit ici plutot qu'en contrainte de base : elle doit rendre
 * le nom du joueur en conflit, ce qu'une erreur d'unicite ne saurait pas dire.
 */
async function numeroDejaPris(
  saisonId: number,
  numero: number,
  effectifAIgnorer: number | null,
): Promise<string | null> {
  const lignes = await db()
    .select({
      id: effectifs.id,
      prenom: joueurs.prenom,
      nom: joueurs.nom,
    })
    .from(effectifs)
    .innerJoin(joueurs, eq(effectifs.joueurId, joueurs.id))
    .where(and(eq(effectifs.saisonId, saisonId), eq(effectifs.numero, numero)));

  const conflit = lignes.find((ligne) => ligne.id !== effectifAIgnorer);
  return conflit ? `${conflit.prenom} ${conflit.nom}` : null;
}

const schemaLigne = z.object({
  effectifId: z.string(),
  numero: z.string().optional(),
  poste: z.enum(POSTES),
});

export async function modifierLigneEffectif(
  _precedent: EtatJoueur,
  donnees: FormData,
): Promise<EtatJoueur> {
  await exigerDroit("gererEffectif");

  const analyse = schemaLigne.safeParse({
    effectifId: donnees.get("effectifId")?.toString(),
    numero: donnees.get("numero")?.toString(),
    poste: donnees.get("poste"),
  });
  if (!analyse.success) return { erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };

  const effectifId = versEntier(analyse.data.effectifId);
  if (!effectifId) return { erreur: "Ligne inconnue." };

  const [ligne] = await db()
    .select({ saisonId: effectifs.saisonId })
    .from(effectifs)
    .where(eq(effectifs.id, effectifId))
    .limit(1);
  if (!ligne) return { erreur: "Ligne inconnue." };

  // Memes regles que la fiche joueur (audit D5) : une date de naissance en 3000
  // ou une taille de 5 cm passaient ici, alors que la fiche les refusait.
  const fiche = lireFicheJoueur(donnees, new Date());
  if (!fiche.ok) return { erreur: fiche.erreur };

  const numero = versEntier(analyse.data.numero);
  if (numero !== null && (numero < 0 || numero > 99)) return { erreur: "Le numéro va de 0 à 99." };
  if (numero !== null) {
    const conflit = await numeroDejaPris(ligne.saisonId, numero, effectifId);
    if (conflit) return { erreur: `Le numéro ${numero} est déjà porté par ${conflit}.` };
  }

  await db()
    .update(effectifs)
    .set({ numero, poste: analyse.data.poste, modifieLe: new Date() })
    .where(eq(effectifs.id, effectifId));

  revalidatePath("/administration/effectif");
  return { erreur: null };
}

/** Un seul capitaine par saison. */
export async function designerCapitaine(donnees: FormData): Promise<void> {
  await exigerDroit("gererEffectif");

  const effectifId = versEntier(donnees.get("effectifId")?.toString());
  if (!effectifId) return;

  const base = db();
  const [ligne] = await base
    .select({ saisonId: effectifs.saisonId })
    .from(effectifs)
    .where(eq(effectifs.id, effectifId))
    .limit(1);
  if (!ligne) return;

  await base
    .update(effectifs)
    .set({ capitaine: false })
    .where(
      and(eq(effectifs.saisonId, ligne.saisonId), ne(effectifs.id, effectifId)),
    );
  await base
    .update(effectifs)
    .set({ capitaine: true, modifieLe: new Date() })
    .where(eq(effectifs.id, effectifId));

  revalidatePath("/administration/effectif");
}

/**
 * Retire un joueur de l'effectif d'une saison. Le joueur lui-meme reste : ses
 * feuilles de match des saisons passees y font reference, et il peut revenir
 * l'annee suivante.
 */
export async function retirerDeLEffectif(donnees: FormData): Promise<void> {
  await exigerDroit("gererEffectif");

  const effectifId = versEntier(donnees.get("effectifId")?.toString());
  if (!effectifId) return;

  await db()
    .update(effectifs)
    .set({ supprimeLe: new Date(), modifieLe: new Date() })
    .where(eq(effectifs.id, effectifId));

  revalidatePath("/administration/effectif");
}

export async function reintegrerDansLEffectif(
  donnees: FormData,
): Promise<void> {
  await exigerDroit("gererEffectif");

  const effectifId = versEntier(donnees.get("effectifId")?.toString());
  if (!effectifId) return;

  await db()
    .update(effectifs)
    .set({ supprimeLe: null, modifieLe: new Date() })
    .where(eq(effectifs.id, effectifId));

  revalidatePath("/administration/effectif");
}
