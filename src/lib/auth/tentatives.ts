import { and, count, eq, gt, isNull, lt, min } from "drizzle-orm";
import { db } from "../db";
import { tentativesAuth } from "../db/schema";

/**
 * Limitation de debit sur la connexion, en fenetre glissante de 15 minutes.
 *
 * Trois compteurs d'echecs, revus a l'audit du 01-10-2026 (S4, S5) :
 *  - par **couple adresse visee et adresse reseau**, serre (5) : celui qui
 *    essaie des mots de passe se bloque lui-meme, sans bloquer le vrai titulaire
 *    du compte, qui se connecte d'ailleurs ;
 *  - par **adresse visee**, large (30), contre une attaque repartie sur
 *    beaucoup d'adresses reseau ;
 *  - par **adresse reseau**, large (50), contre le balayage de beaucoup de
 *    comptes. Genereux : l'ami et ses coequipiers peuvent partager une connexion.
 *
 * La tentative est **reservee** (ecrite) avant bcrypt, puis comptee : compter
 * puis ecrire laissait passer une salve de requetes simultanees, toutes
 * controlees avant la premiere ecriture.
 */

const FENETRE_MS = 15 * 60 * 1000;
const PLAFOND_PAR_COUPLE = 5;
const PLAFOND_PAR_EMAIL = 30;
const PLAFOND_PAR_IP = 50;

export type Verdict =
  | { autorise: true }
  | { autorise: false; minutesRestantes: number };

function debutFenetre(): Date {
  return new Date(Date.now() - FENETRE_MS);
}

/**
 * Lit l'adresse reseau derriere le proxy. En production le site est servi par
 * Traefik, qui ajoute l'adresse reelle du client en **fin** de `x-forwarded-for`
 * (verifie en production pour Todai, cf. Coolify/ETAT.md). La premiere entree,
 * elle, est ce que le client a bien voulu envoyer : la retenir laissait un robot
 * changer d'adresse a chaque essai. En developpement, aucun en-tete n'existe et la
 * valeur est nulle, ce qui desactive simplement le compteur par reseau.
 *
 * Si un jour un autre relais s'intercale (Cloudflare en nuage orange), la
 * derniere entree deviendra le relais : la valeur ne sert donc qu'a ralentir,
 * jamais a autoriser. Le compteur par adresse visee, lui, ne
 * depend d'aucun en-tete et reste efficace meme contre un attaquant qui change
 * d'adresse a chaque essai.
 */
export function lireIp(enTetes: Headers): string | null {
  const transmis = enTetes.get("x-forwarded-for");
  if (transmis) {
    const dernier = transmis.split(",").at(-1)?.trim();
    if (dernier) return dernier;
  }
  return enTetes.get("x-real-ip");
}

/**
 * Reserve une tentative, puis dit si elle est permise. A appeler **avant**
 * bcrypt : hacher un mot de passe coute volontairement cher, et laisser un
 * attaquant declencher ce calcul sans limite serait lui offrir un deni de
 * service sur le processeur. La tentative est notee comme un echec ; en cas de
 * succes, `confirmerTentative` la corrige. Les tentatives sorties de la
 * fenetre sont purgees au passage.
 */
export async function reserverTentative(
  email: string | null,
  ip: string | null,
): Promise<{ id: number | null; verdict: Verdict }> {
  const base = db();
  const [ligne] = await base.insert(tentativesAuth).values({ email, ip, reussie: false }).returning({ id: tentativesAuth.id });
  await base.delete(tentativesAuth).where(lt(tentativesAuth.survenuLe, debutFenetre()));

  const depuis = debutFenetre();
  const echecs = and(eq(tentativesAuth.reussie, false), gt(tentativesAuth.survenuLe, depuis));
  const memeIp = ip ? eq(tentativesAuth.ip, ip) : isNull(tentativesAuth.ip);
  const compteurs: { filtre: ReturnType<typeof and>; plafond: number }[] = [];
  if (email) {
    compteurs.push({ filtre: and(echecs, eq(tentativesAuth.email, email), memeIp), plafond: PLAFOND_PAR_COUPLE });
    compteurs.push({ filtre: and(echecs, eq(tentativesAuth.email, email)), plafond: PLAFOND_PAR_EMAIL });
  }
  if (ip) compteurs.push({ filtre: and(echecs, eq(tentativesAuth.ip, ip)), plafond: PLAFOND_PAR_IP });
  if (!email && !ip) compteurs.push({ filtre: and(echecs, isNull(tentativesAuth.email), isNull(tentativesAuth.ip)), plafond: PLAFOND_PAR_IP });

  for (const { filtre, plafond } of compteurs) {
    const [resultat] = await base
      .select({ nombre: count(), plusAncienne: min(tentativesAuth.survenuLe) })
      .from(tentativesAuth)
      .where(filtre);
    // La tentative qui vient d'etre reservee compte : au-dela du plafond, refus.
    if ((resultat?.nombre ?? 0) > plafond) {
      const libre = (resultat?.plusAncienne?.getTime() ?? Date.now()) + FENETRE_MS;
      return {
        id: ligne?.id ?? null,
        verdict: { autorise: false, minutesRestantes: Math.max(1, Math.ceil((libre - Date.now()) / 60000)) },
      };
    }
  }
  return { id: ligne?.id ?? null, verdict: { autorise: true } };
}

/** Marque une tentative reservee comme reussie : elle ne compte plus comme un echec. */
export async function confirmerTentative(id: number | null): Promise<void> {
  if (id) await db().update(tentativesAuth).set({ reussie: true }).where(eq(tentativesAuth.id, id));
}

/**
 * Efface les tentatives ratees d'un compte apres une connexion reussie, pour
 * que celui qui s'est trompe deux fois puis a reussi reparte a zero.
 *
 * Volontairement limite a l'adresse visee : effacer aussi par adresse reseau
 * laisserait quiconque possede un compte valide remettre le compteur reseau a
 * zero a volonte, et donc contourner la protection contre le balayage.
 */
export async function oublierTentatives(email: string): Promise<void> {
  await db().delete(tentativesAuth).where(eq(tentativesAuth.email, email));
}
