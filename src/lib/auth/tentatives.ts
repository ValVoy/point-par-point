import { and, count, eq, gt, lt } from "drizzle-orm";
import { db } from "../db";
import { tentativesAuth } from "../db/schema";

/**
 * Limitation de debit sur la connexion, en fenetre glissante.
 *
 * Deux compteurs independants, et ce n'est pas un doublon :
 *  - par **adresse visee**, serre, contre l'attaque d'un compte precis ;
 *  - par **adresse reseau**, large, contre le balayage de beaucoup de comptes.
 *
 * Le seuil par reseau est volontairement genereux : l'ami et ses coequipiers
 * peuvent partager une connexion, et verrouiller tout le monde parce que l'un
 * d'eux se trompe trois fois serait pire que le mal.
 */

const FENETRE_MS = 15 * 60 * 1000;
const PLAFOND_PAR_EMAIL = 5;
const PLAFOND_PAR_IP = 50;

export type Verdict =
  | { autorise: true }
  | { autorise: false; minutesRestantes: number };

function debutFenetre(): Date {
  return new Date(Date.now() - FENETRE_MS);
}

/**
 * Lit l'adresse reseau derriere le proxy. En production le site est servi par
 * Traefik, qui pose `x-forwarded-for` ; la premiere entree est le client, les
 * suivantes sont les relais. En developpement, aucun en-tete n'existe et la
 * valeur est nulle, ce qui desactive simplement le compteur par reseau.
 *
 * Cette valeur est fournie par le client et donc falsifiable : elle ne sert
 * qu'a ralentir, jamais a autoriser. Le compteur par adresse visee, lui, ne
 * depend d'aucun en-tete et reste efficace meme contre un attaquant qui change
 * d'adresse a chaque essai.
 */
export function lireIp(enTetes: Headers): string | null {
  const transmis = enTetes.get("x-forwarded-for");
  if (transmis) {
    const premier = transmis.split(",")[0]?.trim();
    if (premier) return premier;
  }
  return enTetes.get("x-real-ip");
}

/**
 * Dit si une tentative est permise. A appeler **avant** bcrypt : hacher un mot
 * de passe coute volontairement cher, et laisser un attaquant declencher ce
 * calcul sans limite serait lui offrir un deni de service sur le processeur.
 */
export async function tentativeAutorisee(
  email: string | null,
  ip: string | null,
): Promise<Verdict> {
  const depuis = debutFenetre();

  if (email) {
    const [ligne] = await db()
      .select({ nombre: count() })
      .from(tentativesAuth)
      .where(
        and(
          eq(tentativesAuth.email, email),
          eq(tentativesAuth.reussie, false),
          gt(tentativesAuth.survenuLe, depuis),
        ),
      );
    if ((ligne?.nombre ?? 0) >= PLAFOND_PAR_EMAIL) {
      return { autorise: false, minutesRestantes: FENETRE_MS / 60000 };
    }
  }

  if (ip) {
    const [ligne] = await db()
      .select({ nombre: count() })
      .from(tentativesAuth)
      .where(
        and(
          eq(tentativesAuth.ip, ip),
          eq(tentativesAuth.reussie, false),
          gt(tentativesAuth.survenuLe, depuis),
        ),
      );
    if ((ligne?.nombre ?? 0) >= PLAFOND_PAR_IP) {
      return { autorise: false, minutesRestantes: FENETRE_MS / 60000 };
    }
  }

  return { autorise: true };
}

/**
 * Enregistre une tentative, et purge au passage celles sorties de la fenetre.
 * La purge se fait ici plutot que dans une tache planifiee : elle est de toute
 * facon declenchee par le seul evenement qui fait grossir la table.
 */
export async function noterTentative(
  email: string | null,
  ip: string | null,
  reussie: boolean,
): Promise<void> {
  const base = db();
  await base.insert(tentativesAuth).values({ email, ip, reussie });
  await base.delete(tentativesAuth).where(lt(tentativesAuth.survenuLe, debutFenetre()));
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
