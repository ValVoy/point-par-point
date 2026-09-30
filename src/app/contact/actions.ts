"use server";

import { headers } from "next/headers";
import { lireIp } from "@/lib/auth/tentatives";
import { lireMessage } from "@/lib/contact";
import { db } from "@/lib/db";
import { messagesContact } from "@/lib/db/schema";
import { envoiAutorise, noterEnvoi } from "@/lib/envois-contact";
import { purgerMessagesAnciens } from "@/lib/messages";

/**
 * L'envoi du formulaire de contact (fiche fiches/contact.md). Aucun e-mail
 * n'est envoye, decide au cadrage : le message est range en base et se lit
 * dans l'administration. Un robot pris au piege recoit la meme reponse
 * qu'un humain, pour ne pas lui apprendre a contourner le piege.
 */

export type EtatContact = { envoye: boolean; erreur: string | null; valeurs?: Record<string, string> };

function valeurs(donnees: FormData): Record<string, string> {
  const garder = ["nom", "email", "sujet", "message"];
  return Object.fromEntries(garder.map((cle) => [cle, (donnees.get(cle) ?? "").toString().slice(0, 3000)]));
}

export async function envoyerMessage(_precedent: EtatContact, donnees: FormData): Promise<EtatContact> {
  const lu = lireMessage(donnees);
  if (!lu.ok && lu.robot) return { envoye: true, erreur: null };
  if (!lu.ok) return { envoye: false, erreur: lu.erreur, valeurs: valeurs(donnees) };

  const ip = lireIp(await headers());
  if (!(await envoiAutorise(ip))) {
    return {
      envoye: false,
      erreur: "Beaucoup de messages en peu de temps : réessayez dans une heure.",
      valeurs: valeurs(donnees),
    };
  }

  await db().insert(messagesContact).values(lu.message);
  await noterEnvoi(ip);
  await purgerMessagesAnciens();
  return { envoye: true, erreur: null };
}
