import { lt } from "drizzle-orm";
import { db } from "./db";
import { envoisContact, messagesContact, sessions, tentativesAuth } from "./db/schema";

/**
 * Les durees de conservation annoncees par la politique de confidentialite,
 * tenues en un seul endroit (audit du 01-10-2026, R3 et R4). Chaque purge
 * etait jusqu'ici declenchee par l'evenement qui fait grossir sa table : le
 * dernier message de la saison gardait son adresse reseau des mois.
 *
 * Appelee au passage (connexion, envoi de contact, administration), apres la
 * reponse (`after`) pour ne jamais faire attendre personne, et, en production,
 * chaque nuit par une tache planifiee. Elle ne fait jamais echouer l'action
 * qui la porte : une purge ratee se rattrape a la suivante.
 */

const MINUTE = 60 * 1000;
const JOUR = 24 * 60 * MINUTE;

export const CONSERVATION = {
  tentativesConnexion: 15 * MINUTE,
  adressesContact: JOUR,
  messages: 365 * JOUR,
} as const;

/** Rend `false` en cas d'echec, pour que la tache de nuit puisse le signaler (audit F14). */
export async function purgerDonneesEchues(maintenant = Date.now()): Promise<boolean> {
  try {
    const base = db();
    await base.batch([
      base.delete(tentativesAuth).where(lt(tentativesAuth.survenuLe, new Date(maintenant - CONSERVATION.tentativesConnexion))),
      base.delete(envoisContact).where(lt(envoisContact.survenuLe, new Date(maintenant - CONSERVATION.adressesContact))),
      base.delete(messagesContact).where(lt(messagesContact.creeLe, new Date(maintenant - CONSERVATION.messages))),
      base.delete(sessions).where(lt(sessions.expireLe, new Date(maintenant))),
    ]);
    return true;
  } catch (erreur) {
    console.error("[purges] echec, reprise a la prochaine occasion", erreur instanceof Error ? erreur.message : erreur);
    return false;
  }
}
