/**
 * Le bilan de la saison (fiche fiches/matchs.md, complement du 01-10-2026),
 * calcule depuis les scores deja saisis : rien de plus a entrer pour l'ami.
 * Principe 2 du codex, le match est la source unique : aucun de ces chiffres
 * n'est stocke. Un match sans score saisi ne compte pas, il n'est pas 0-0.
 */

type Match = { etat: string; setsNous: number | null; setsEux: number | null; aDomicile: boolean; joueLe: Date };

export type Bilan = {
  victoires: number;
  defaites: number;
  setsPour: number;
  setsContre: number;
  domicile: { victoires: number; defaites: number };
  exterieur: { victoires: number; defaites: number };
  /** La serie en cours, a partir de deux matchs de suite ; null sinon. */
  serie: { victoire: boolean; longueur: number } | null;
};

export function bilanDeLaSaison(matchs: Match[]): Bilan | null {
  const joues = matchs
    // Une egalite n'est pas un resultat de volley : ecartee plutot que comptee en defaite.
    .filter((m) => m.etat === "jouee" && m.setsNous !== null && m.setsEux !== null && m.setsNous !== m.setsEux)
    .sort((a, b) => a.joueLe.getTime() - b.joueLe.getTime());
  if (joues.length === 0) return null;

  const gagne = (m: Match) => m.setsNous! > m.setsEux!;
  const compter = (liste: Match[]) => ({
    victoires: liste.filter(gagne).length,
    defaites: liste.filter((m) => !gagne(m)).length,
  });

  let longueur = 0;
  const dernier = joues[joues.length - 1]!;
  for (let i = joues.length - 1; i >= 0 && gagne(joues[i]!) === gagne(dernier); i--) longueur++;

  return {
    ...compter(joues),
    setsPour: joues.reduce((s, m) => s + m.setsNous!, 0),
    setsContre: joues.reduce((s, m) => s + m.setsEux!, 0),
    domicile: compter(joues.filter((m) => m.aDomicile)),
    exterieur: compter(joues.filter((m) => !m.aDomicile)),
    serie: longueur >= 2 ? { victoire: gagne(dernier), longueur } : null,
  };
}
