import { and, count, eq, gt, lt } from "drizzle-orm";
import { db } from "./db";
import { envoisContact } from "./db/schema";

/**
 * Limitation de debit du formulaire de contact, en fenetre glissante d'une
 * heure. Deux plafonds :
 *  - par adresse reseau, serre, contre un robot qui insiste ;
 *  - global, contre une attaque repartie sur beaucoup d'adresses, qui
 *    remplirait la base de messages.
 *
 * L'adresse reseau vient de x-forwarded-for, donc du client : elle ne sert
 * qu'a ralentir. Le plafond global, lui, ne depend d'aucun en-tete.
 */

const FENETRE_MS = 60 * 60 * 1000;
const CONSERVATION_MS = 24 * 60 * 60 * 1000;
export const PLAFOND_PAR_IP = 3;
export const PLAFOND_GLOBAL = 30;

export async function envoiAutorise(ip: string | null): Promise<boolean> {
  const depuis = new Date(Date.now() - FENETRE_MS);
  const [global] = await db().select({ nombre: count() }).from(envoisContact).where(gt(envoisContact.survenuLe, depuis));
  if ((global?.nombre ?? 0) >= PLAFOND_GLOBAL) return false;
  if (!ip) return true;
  const [parIp] = await db()
    .select({ nombre: count() })
    .from(envoisContact)
    .where(and(eq(envoisContact.ip, ip), gt(envoisContact.survenuLe, depuis)));
  return (parIp?.nombre ?? 0) < PLAFOND_PAR_IP;
}

/** Note un envoi, et purge les lignes de plus de vingt-quatre heures. */
export async function noterEnvoi(ip: string | null): Promise<void> {
  await db().insert(envoisContact).values({ ip });
  await db().delete(envoisContact).where(lt(envoisContact.survenuLe, new Date(Date.now() - CONSERVATION_MS)));
}
