import { and, count, eq, gt } from "drizzle-orm";
import { db } from "./db";
import { envoisContact } from "./db/schema";

/**
 * Limitation de debit du formulaire de contact, en fenetre glissante d'une
 * heure. Deux plafonds :
 *  - par adresse reseau, serre, contre un robot qui insiste ;
 *  - global, contre une attaque repartie sur beaucoup d'adresses, qui
 *    remplirait la base de messages.
 *
 * Seuls les envois acceptes comptent pour le plafond global (audit S2) : une
 * adresse qui insiste se ferme la porte a elle seule, pas au reste du monde.
 *
 * L'envoi est note **avant** d'etre compte : compter puis noter laissait
 * passer une salve de requetes simultanees, toutes controlees avant la
 * premiere ecriture. Un envoi refuse compte donc aussi, ce qui est le but :
 * un robot qui insiste prolonge lui-meme son attente.
 */

const FENETRE_MS = 60 * 60 * 1000;
export const PLAFOND_PAR_IP = 3;
export const PLAFOND_GLOBAL = 30;

export type Debit = "autorise" | "adresse" | "global";

export async function reserverEnvoi(ip: string | null): Promise<Debit> {
  const maintenant = Date.now();
  const base = db();
  const [ligne] = await base
    .insert(envoisContact)
    .values({ ip, survenuLe: new Date(maintenant) })
    .returning({ id: envoisContact.id });
  const refuser = async (raison: Exclude<Debit, "autorise">) => {
    if (ligne) await base.update(envoisContact).set({ refuse: true }).where(eq(envoisContact.id, ligne.id));
    return raison;
  };

  const depuis = new Date(maintenant - FENETRE_MS);
  // Par adresse d'abord : un envoi refuse ici ne pese pas sur le plafond global.
  if (ip) {
    const [parIp] = await base
      .select({ nombre: count() })
      .from(envoisContact)
      .where(and(eq(envoisContact.ip, ip), gt(envoisContact.survenuLe, depuis)));
    if ((parIp?.nombre ?? 0) > PLAFOND_PAR_IP) return refuser("adresse");
  }
  const [global] = await base
    .select({ nombre: count() })
    .from(envoisContact)
    .where(and(eq(envoisContact.refuse, false), gt(envoisContact.survenuLe, depuis)));
  if ((global?.nombre ?? 0) > PLAFOND_GLOBAL) return refuser("global");
  return "autorise";
}
