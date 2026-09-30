"use server";

import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { exigerConnexion } from "@/lib/auth/session-courante";
import { hacher, LONGUEUR_MINIMALE, motDePasseAcceptable, verifier } from "@/lib/auth/mots-de-passe";
import { fermerToutesLesSessions, NOM_COOKIE, optionsCookie, ouvrirSession } from "@/lib/auth/sessions";
import { lireIp, noterTentative, oublierTentatives, tentativeAutorisee } from "@/lib/auth/tentatives";
import { db } from "@/lib/db";
import { utilisateurs } from "@/lib/db/schema";

/**
 * Changer son propre mot de passe. Le mot de passe actuel est exige : une
 * session laissee ouverte sur un ordinateur partage ne doit pas suffire a
 * prendre le compte. Sa verification passe par le meme compteur de tentatives
 * que la connexion, sinon ce formulaire deviendrait une porte pour essayer des
 * mots de passe sans limite.
 *
 * Au succes, toutes les sessions du compte sont fermees (un eventuel intrus
 * est deconnecte) et une nouvelle est ouverte pour celle en cours.
 */

export type EtatMonCompte = { erreur: string | null; reussi?: boolean };

const champ = (donnees: FormData, cle: string) => {
  const valeur = donnees.get(cle);
  return typeof valeur === "string" ? valeur : "";
};

export async function changerMonMotDePasse(_precedent: EtatMonCompte, donnees: FormData): Promise<EtatMonCompte> {
  const moi = await exigerConnexion();
  const actuel = champ(donnees, "actuel");
  const nouveau = champ(donnees, "nouveau");
  const confirmation = champ(donnees, "confirmation");

  if (!motDePasseAcceptable(nouveau)) {
    return { erreur: `Le nouveau mot de passe doit faire au moins ${LONGUEUR_MINIMALE} caractères.` };
  }
  if (nouveau.length > 200) return { erreur: "Le nouveau mot de passe dépasse 200 caractères." };
  if (nouveau !== confirmation) return { erreur: "La confirmation ne correspond pas au nouveau mot de passe." };
  if (nouveau === actuel) return { erreur: "Le nouveau mot de passe doit être différent de l'actuel." };

  const ip = lireIp(await headers());
  const verdict = await tentativeAutorisee(moi.email, ip);
  if (!verdict.autorise) {
    return { erreur: `Trop de tentatives. Réessayez dans ${verdict.minutesRestantes} minutes.` };
  }

  const [compte] = await db()
    .select({ hache: utilisateurs.motDePasseHache })
    .from(utilisateurs)
    .where(eq(utilisateurs.id, moi.id))
    .limit(1);
  if (!compte || !(await verifier(actuel, compte.hache))) {
    await noterTentative(moi.email, ip, false);
    return { erreur: "Le mot de passe actuel est incorrect." };
  }
  await noterTentative(moi.email, ip, true);
  await oublierTentatives(moi.email);

  await db()
    .update(utilisateurs)
    .set({ motDePasseHache: await hacher(nouveau), modifieLe: new Date() })
    .where(eq(utilisateurs.id, moi.id));

  await fermerToutesLesSessions(moi.id);
  const { jeton, expireLe } = await ouvrirSession(moi.id);
  (await cookies()).set(NOM_COOKIE, jeton, optionsCookie(expireLe));

  return { erreur: null, reussi: true };
}
