import { dateEtHeure, depuisChampDateHeure, heure, jourEtMois } from "./dates";

/**
 * L'horaire d'un match, connu ou a confirmer (demande du 01-10-2026 : le
 * calendrier federal publie certains matchs sans heure, Tom veut pouvoir les
 * saisir quand meme).
 *
 * Un match sans heure est range a 23 h 59 ce jour-la, heure de Paris : toute
 * la logique qui compare `joueLe` a maintenant le garde « a venir » jusqu'au
 * soir, sans qu'il faille la reecrire. Cet instant n'est jamais montre : tout
 * affichage passe par les fonctions de ce fichier, qui lisent `heureConnue`.
 */

const HEURE_A_CONFIRMER = "23:59";
const FUSEAU = "Europe/Paris";

type Horaire = { joueLe: Date; heureConnue: boolean };

/** Le moment d'un match depuis la saisie : date obligatoire, heure facultative. */
export function instantDuMatch(date: string, heureSaisie: string | null | undefined): Horaire | null {
  const h = heureSaisie?.trim() ?? "";
  const joueLe = depuisChampDateHeure(`${date}T${h || HEURE_A_CONFIRMER}`);
  return joueLe ? { joueLe, heureConnue: h !== "" } : null;
}

/** Le nombre de jours du calendrier avant le match, a Paris ; zero le jour meme, jamais moins. */
export function joursAvant(joueLe: Date, maintenant: Date): number {
  const jour = (d: Date) => Date.parse(`${new Intl.DateTimeFormat("sv-SE", { timeZone: FUSEAU }).format(d)}T00:00:00Z`);
  return Math.max(0, Math.round((jour(joueLe) - jour(maintenant)) / 86_400_000));
}

/** « 20 h 30 », ou null quand l'horaire est a confirmer. */
export function heureDuMatch(m: Horaire): string | null {
  return m.heureConnue ? heure(m.joueLe) : null;
}

/** « samedi 3 octobre à 20 h », ou « samedi 17 octobre, horaire à confirmer ». */
export function quandDuMatch(m: Horaire): string {
  return m.heureConnue ? dateEtHeure(m.joueLe) : `${jourEtMois(m.joueLe)}, horaire à confirmer`;
}
