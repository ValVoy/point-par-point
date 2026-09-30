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
 * L'envoi est note **avant** d'etre compte : compter puis noter laissait
 * passer une salve de requetes simultanees, toutes controlees avant la
 * premiere ecriture. Un envoi refuse compte donc aussi, ce qui est le but :
 * un robot qui insiste prolonge lui-meme son attente.
 */

const FENETRE_MS = 60 * 60 * 1000;
const CONSERVATION_MS = 24 * 60 * 60 * 1000;
export const PLAFOND_PAR_IP = 3;
export const PLAFOND_GLOBAL = 30;

export type Debit = "autorise" | "adresse" | "global";

export async function reserverEnvoi(ip: string | null): Promise<Debit> {
  const maintenant = Date.now();
  await db().insert(envoisContact).values({ ip, survenuLe: new Date(maintenant) });
  await db().delete(envoisContact).where(lt(envoisContact.survenuLe, new Date(maintenant - CONSERVATION_MS)));

  const depuis = new Date(maintenant - FENETRE_MS);
  const [global] = await db().select({ nombre: count() }).from(envoisContact).where(gt(envoisContact.survenuLe, depuis));
  if ((global?.nombre ?? 0) > PLAFOND_GLOBAL) return "global";
  if (!ip) return "autorise";
  const [parIp] = await db()
    .select({ nombre: count() })
    .from(envoisContact)
    .where(and(eq(envoisContact.ip, ip), gt(envoisContact.survenuLe, depuis)));
  return (parIp?.nombre ?? 0) > PLAFOND_PAR_IP ? "adresse" : "autorise";
}
