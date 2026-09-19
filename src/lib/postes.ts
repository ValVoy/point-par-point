import type { Poste } from "./db/schema";

/**
 * Libelles affichables des postes. Le schema stocke des valeurs stables et
 * sans accent ; ce qui s'affiche vit ici, pour qu'un changement de vocabulaire
 * ne demande jamais de migration.
 */
export const LIBELLES_POSTE: Record<Poste, string> = {
  passeur: "Passeur",
  pointu: "Pointu",
  central: "Central",
  receptionneur: "Réceptionneur-attaquant",
  libero: "Libéro",
  autre: "Autre",
};

/** Ordre d'affichage de l'effectif : celui dans lequel on presente une equipe. */
export const ORDRE_POSTES: Poste[] = [
  "passeur",
  "receptionneur",
  "central",
  "pointu",
  "libero",
  "autre",
];

export function rangPoste(poste: Poste): number {
  const rang = ORDRE_POSTES.indexOf(poste);
  return rang === -1 ? ORDRE_POSTES.length : rang;
}
