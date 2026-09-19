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
