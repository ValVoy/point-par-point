"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { lireIp } from "@/lib/auth/tentatives";
import { lireMessage, type ChampContact } from "@/lib/contact";
import { db } from "@/lib/db";
import { messagesContact } from "@/lib/db/schema";
import { reserverEnvoi } from "@/lib/envois-contact";
import { purgerDonneesEchues } from "@/lib/purges";

/**
 * L'envoi du formulaire de contact (fiche fiches/contact.md). Aucun e-mail
 * n'est envoye, decide au cadrage : le message est range en base et se lit
 * dans l'administration. Un robot pris au piege recoit la meme reponse
 * qu'un humain, pour ne pas lui apprendre a contourner le piege ; le rejet
 * est journalise, sans rien du message, pour verifier que le piege n'attrape
 * pas d'humains.
 */

export type EtatContact = {
  envoye: boolean;
  erreur: string | null;
  champ?: ChampContact;
  valeurs?: Record<string, string>;
  /** Change a chaque refus : remonte le formulaire, pour que la liste des sujets reprenne la saisie. */
  essai?: number;
};

const REFUS_DEBIT = {
  adresse: "Plusieurs messages sont déjà partis d'ici dans l'heure : réessayez un peu plus tard.",
  global: "Le formulaire reçoit beaucoup de messages en ce moment : réessayez un peu plus tard.",
} as const;

function valeurs(donnees: FormData): Record<string, string> {
  const garder = ["nom", "email", "sujet", "message"];
  return Object.fromEntries(garder.map((cle) => [cle, (donnees.get(cle) ?? "").toString().slice(0, 3000)]));
}

export async function envoyerMessage(_precedent: EtatContact, donnees: FormData): Promise<EtatContact> {
  const lu = lireMessage(donnees);
  if (!lu.ok && lu.robot) {
    console.info("[contact] envoi ecarte par le champ piege");
    return { envoye: true, erreur: null };
  }
  if (!lu.ok) return { envoye: false, erreur: lu.erreur, champ: lu.champ, valeurs: valeurs(donnees), essai: Date.now() };

  const debit = await reserverEnvoi(lireIp(await headers()));
  if (debit !== "autorise") {
    if (debit === "global") console.warn("[contact] plafond global atteint");
    return { envoye: false, erreur: REFUS_DEBIT[debit], valeurs: valeurs(donnees), essai: Date.now() };
  }

  await db().insert(messagesContact).values(lu.message);
  // Apres l'insertion, et sans jamais faire echouer l'envoi (audit F6) : le
  // visiteur ne renvoie pas un message deja recu. Apres la reponse, aussi : il
  // n'a pas a attendre le menage.
  after(() => purgerDonneesEchues());
  return { envoye: true, erreur: null };
}
