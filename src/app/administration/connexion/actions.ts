"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { utilisateurs } from "@/lib/db/schema";
import { HACHAGE_FACTICE, verifier } from "@/lib/auth/mots-de-passe";
import { NOM_COOKIE, optionsCookie, ouvrirSession } from "@/lib/auth/sessions";
import { purgerDonneesEchues } from "@/lib/purges";
import { confirmerTentative, lireIp, oublierTentatives, reserverTentative } from "@/lib/auth/tentatives";

const schema = z.object({
  email: z.email(),
  motDePasse: z.string().min(1),
});

/** Normalisation faite avant la validation : zod 4 deprecie trim et
 * toLowerCase comme methodes de chaine, et une adresse se compare toujours en
 * minuscules sans espaces. */
function normaliser(valeur: FormDataEntryValue | null): string {
  return typeof valeur === "string" ? valeur.trim().toLowerCase() : "";
}

/**
 * L'adresse saisie revient avec l'erreur : sans cela, un echec vide le
 * formulaire et oblige a tout retaper, ce qui est penible precisement au
 * moment ou l'on est deja contrarie. Le mot de passe, lui, ne revient jamais.
 */
export type EtatConnexion = { erreur: string | null; email: string };

/**
 * Un seul message d'erreur pour tous les echecs, et c'est deliberé : dire
 * « compte inconnu » plutot que « mot de passe faux » permettrait d'enumerer
 * les adresses ayant un compte.
 */
const MESSAGE_ECHEC = "Adresse ou mot de passe incorrect.";

export async function connecter(
  _precedent: EtatConnexion,
  donnees: FormData,
): Promise<EtatConnexion> {
  const brut = {
    email: normaliser(donnees.get("email")),
    motDePasse: donnees.get("motDePasse"),
  };

  const analyse = schema.safeParse(brut);
  const email = analyse.success ? analyse.data.email : null;
  const ip = lireIp(await headers());

  // Avant bcrypt : hacher coute cher, et laisser declencher ce calcul sans
  // limite offrirait un deni de service sur le processeur.
  const { id: tentative, verdict } = await reserverTentative(email, ip);
  if (!verdict.autorise) {
    return {
      erreur: `Trop de tentatives. Réessayez dans ${verdict.minutesRestantes} minutes.`,
      email: brut.email,
    };
  }

  if (!analyse.success) return { erreur: MESSAGE_ECHEC, email: brut.email };

  const lignes = await db()
    .select()
    .from(utilisateurs)
    .where(eq(utilisateurs.email, analyse.data.email))
    .limit(1);
  const compte = lignes[0];

  // Meme quand le compte est inconnu, on fait travailler bcrypt sur un hachage
  // factice : les deux cas repondent alors dans le meme temps, et le temps de
  // reponse ne trahit plus l'existence d'un compte.
  const hachage = compte?.motDePasseHache ?? HACHAGE_FACTICE;
  const correspond = await verifier(analyse.data.motDePasse, hachage);

  const utilisable = Boolean(
    compte && compte.actif && compte.supprimeLe === null,
  );

  if (!correspond || !utilisable || !compte) return { erreur: MESSAGE_ECHEC, email: brut.email };

  const { jeton, expireLe } = await ouvrirSession(compte.id);
  await db()
    .update(utilisateurs)
    .set({ derniereConnexionLe: new Date() })
    .where(eq(utilisateurs.id, compte.id));

  await confirmerTentative(tentative);
  await oublierTentatives(analyse.data.email);
  // Sessions expirees et autres donnees echues : menage a chaque connexion (audit S12, R4).
  await purgerDonneesEchues();

  const magasin = await cookies();
  magasin.set(NOM_COOKIE, jeton, optionsCookie(expireLe));

  redirect("/administration");
}

export async function deconnecter(): Promise<void> {
  const magasin = await cookies();
  const jeton = magasin.get(NOM_COOKIE)?.value;

  const { fermerSession } = await import("@/lib/auth/sessions");
  await fermerSession(jeton);

  magasin.set(NOM_COOKIE, "", optionsCookie());
  redirect("/administration/connexion");
}
