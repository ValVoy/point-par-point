/**
 * Mise en forme des dates. Centralisee pour deux raisons : le site est en
 * francais et n'a aucune raison d'afficher un format anglais, et la valeur
 * d'un champ `<input type="date">` doit etre en ISO court, ce qui n'est pas
 * la meme chose qu'une date lisible.
 */

const FUSEAU = "Europe/Paris";

export function dateCourte(date: Date | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: FUSEAU,
  }).format(date);
}

export function dateLongue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: FUSEAU,
  }).format(date);
}

export function dateEtHeure(date: Date | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUSEAU,
  }).format(date);
}

/** Valeur attendue par un champ `<input type="date">` : AAAA-MM-JJ. */
export function pourChampDate(date: Date | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("sv-SE", { timeZone: FUSEAU }).format(date);
}

/** Valeur attendue par un champ `<input type="datetime-local">`. */
export function pourChampDateHeure(date: Date | null | undefined): string {
  if (!date) return "";
  const parties = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUSEAU,
  }).format(date);
  return parties.replace(" ", "T");
}

/**
 * Ecart entre l'heure de Paris et l'heure universelle a un instant donne, en
 * millisecondes. Il vaut une heure l'hiver, deux l'ete.
 */
function decalageParis(instant: number): number {
  const parties = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSEAU,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(instant));
  const lire = (type: string) =>
    Number(parties.find((partie) => partie.type === type)?.value);
  const commeSiUtc = Date.UTC(
    lire("year"),
    lire("month") - 1,
    lire("day"),
    lire("hour"),
    lire("minute"),
    lire("second"),
  );
  return commeSiUtc - instant;
}

/**
 * Inverse de `pourChampDateHeure` : « 2026-10-04T20:30 » saisi dans
 * l'administration veut dire 20 h 30 a Paris, quel que soit le fuseau du
 * serveur. `new Date(valeur)` lirait l'heure dans le fuseau de la machine, et
 * le VPS tourne en heure universelle : chaque match serait decale.
 *
 * Renvoie null pour une saisie malformee ou une date qui n'existe pas (31
 * fevrier, heure sautee au passage a l'heure d'ete).
 */
export function depuisChampDateHeure(valeur: string): Date | null {
  const morceaux = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(valeur);
  if (!morceaux) return null;
  const [, annee, mois, jour, heure, minute] = morceaux.map(Number);
  if ([annee, mois, jour, heure, minute].some((n) => n === undefined)) {
    return null;
  }

  const naif = Date.UTC(annee!, mois! - 1, jour!, heure!, minute!);
  // Deux passes : le decalage depend de l'instant, qu'on ne connait qu'apres
  // la premiere estimation. Sans la seconde, les heures proches d'un
  // changement d'heure tomberaient a cote.
  const estimation = naif - decalageParis(naif);
  const instant = naif - decalageParis(estimation);

  const date = new Date(instant);
  if (Number.isNaN(date.getTime())) return null;
  return pourChampDateHeure(date) === valeur ? date : null;
}

/** Age en annees revolues, ou null si la date de naissance est inconnue. */
export function age(neLe: Date | null | undefined): number | null {
  if (!neLe) return null;
  const maintenant = new Date();
  let annees = maintenant.getFullYear() - neLe.getFullYear();
  const mois = maintenant.getMonth() - neLe.getMonth();
  if (mois < 0 || (mois === 0 && maintenant.getDate() < neLe.getDate())) {
    annees -= 1;
  }
  return annees;
}
