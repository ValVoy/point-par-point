import { DUREE_EN_COURS } from "./calendrier";
import type { EtatRencontre } from "./db/schema";

/**
 * Ce que le site public montre d'un match joue, et le compte a rebours du
 * prochain. Logique pure, sans base, testee a part : c'est ici que se
 * decident les principes 3 et 4 du plan (saisie partielle, rien de perime).
 */

/** Le strict necessaire d'un match pour en tirer un resultat. */
export type RencontreScoree = {
  adversaire: string;
  aDomicile: boolean;
  joueLe: Date;
  etat: EtatRencontre;
  setsNous: number | null;
  setsEux: number | null;
  sets: { pointsNous: number | null; pointsEux: number | null }[];
};

export type Resultat = {
  adversaire: string;
  domicile: boolean;
  joueLe: Date;
  setsNous: number;
  setsEux: number;
  /** Le detail des sets, de notre point de vue : [nous, eux]. Peut etre vide. */
  sets: [number, number][];
};

/**
 * Un match devient un resultat quand il est joue et que son total en sets est
 * connu. Le detail des sets est facultatif : un score seul s'affiche, une case
 * vide jamais. Un set a moitie saisi est ecarte plutot que montre faux.
 */
export function resultatDepuis(r: RencontreScoree): Resultat | null {
  if (r.etat !== "jouee" || r.setsNous === null || r.setsEux === null) return null;
  const sets = r.sets.flatMap(({ pointsNous, pointsEux }) =>
    pointsNous === null || pointsEux === null ? [] : [[pointsNous, pointsEux] as [number, number]],
  );
  return {
    adversaire: r.adversaire,
    domicile: r.aDomicile,
    joueLe: r.joueLe,
    setsNous: r.setsNous,
    setsEux: r.setsEux,
    sets,
  };
}

/** Les resultats connus, du plus recent au plus ancien. */
export function derniersResultats(liste: RencontreScoree[]): Resultat[] {
  return liste
    .map(resultatDepuis)
    .filter((r): r is Resultat => r !== null)
    .sort((a, b) => b.joueLe.getTime() - a.joueLe.getTime());
}

const MINUTE = 60_000;

/**
 * L'ecart jusqu'au coup d'envoi, en unites entieres. Jamais negatif : une
 * heure depassee affiche des zeros, le temps que la page se recharge et que le
 * match passe du cote des resultats. Les jours sont plafonnes a 99, la place
 * de deux chiffres sur le tableau.
 */
export function compteRebours(joueLe: Date, maintenant: Date) {
  const minutesRestantes = Math.max(0, Math.floor((joueLe.getTime() - maintenant.getTime()) / MINUTE));
  return {
    jours: Math.min(99, Math.floor(minutesRestantes / (24 * 60))),
    heures: Math.floor(minutesRestantes / 60) % 24,
    minutes: minutesRestantes % 60,
  };
}

/** Un nombre et son mot accorde : « 1 minute », « 5 minutes » (0 reste au singulier en francais). */
export function quantite(nombre: number, mot: string): string {
  return `${nombre} ${mot}${nombre > 1 ? "s" : ""}`;
}

/**
 * Le compte a rebours dit aux lecteurs d'ecran : chaque unite accordee, les
 * unites a zero omises (« 22 heures et 6 minutes », pas « 0 jours, 22... »).
 * Vide quand tout est a zero, le cas du match qui commence.
 */
export function compteReboursEnLettres(valeurs: { jours: number; heures: number; minutes: number }): string {
  const morceaux = [
    valeurs.jours ? quantite(valeurs.jours, "jour") : null,
    valeurs.heures ? quantite(valeurs.heures, "heure") : null,
    valeurs.minutes ? quantite(valeurs.minutes, "minute") : null,
  ].filter((m): m is string => m !== null);
  if (morceaux.length < 2) return morceaux.join("");
  return `${morceaux.slice(0, -1).join(", ")} et ${morceaux.at(-1)}`;
}

/**
 * Le match du tableau « prochain match » : le premier a venir, en gardant
 * trois heures celui qui vient de commencer. Sans cela, au moment ou
 * l'interet est le plus fort, le tableau sauterait au match suivant avant
 * que le score soit saisi. Liste deja triee par date.
 */
export function matchDuTableau<T extends Pick<RencontreScoree, "etat" | "joueLe">>(
  liste: T[],
  maintenant: Date,
): T | undefined {
  const limite = maintenant.getTime() - DUREE_EN_COURS;
  return liste.find((r) => r.etat === "a_venir" && r.joueLe.getTime() >= limite);
}
