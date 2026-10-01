import type { EtatRencontre } from "./db/schema";

/**
 * Ce que le calendrier public dit d'un match, et son decoupage par mois.
 * Logique pure, testee a part (fiche fiches/matchs.md).
 *
 * Le statut public n'est pas l'etat saisi : un match « a venir » dont l'heure
 * est passee devient « en cours » pendant trois heures, puis « score a
 * venir ». Le site ne montre jamais un 0-0 invente pour un score oublie.
 */

export type MatchCalendrier = {
  joueLe: Date;
  etat: EtatRencontre;
  setsNous: number | null;
  setsEux: number | null;
  /** Faux quand l'horaire est a confirmer (lib/horaire.ts) ; absent, il est connu. */
  heureConnue?: boolean;
};

export type StatutPublic = "a_venir" | "en_cours" | "score_a_venir" | "jouee" | "reportee" | "annulee";

/** Duree pendant laquelle un match commence reste « en cours ». */
export const DUREE_EN_COURS = 3 * 3_600_000;

export function statutPublic(m: MatchCalendrier, maintenant: Date): StatutPublic {
  if (m.etat === "reportee" || m.etat === "annulee") return m.etat;
  if (m.setsNous !== null && m.setsEux !== null && m.etat === "jouee") return "jouee";
  const ecart = maintenant.getTime() - m.joueLe.getTime();
  if (m.etat === "a_venir" && ecart < 0) return "a_venir";
  // Sans horaire, rien ne dit que le match a commence : on attend le score.
  if (m.etat === "a_venir" && ecart < DUREE_EN_COURS && m.heureConnue !== false) return "en_cours";
  return "score_a_venir";
}

const FUSEAU = "Europe/Paris";

function cleMois(date: Date) {
  const morceaux = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: FUSEAU }).formatToParts(date);
  const annee = morceaux.find((m) => m.type === "year")?.value;
  const mois = morceaux.find((m) => m.type === "month")?.value;
  return `${annee}-${mois}`;
}

const libelleMois = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: FUSEAU });

/** Les matchs par mois, a l'heure de Paris, dans l'ordre de la liste recue. */
export function grouperParMois<T extends Pick<MatchCalendrier, "joueLe">>(liste: T[]) {
  const groupes: { cle: string; libelle: string; matchs: T[] }[] = [];
  for (const m of liste) {
    const cle = cleMois(m.joueLe);
    const dernier = groupes.at(-1);
    if (dernier && dernier.cle === cle) dernier.matchs.push(m);
    else groupes.push({ cle, libelle: libelleMois.format(m.joueLe), matchs: [m] });
  }
  return groupes;
}
