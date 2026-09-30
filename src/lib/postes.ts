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

/** Pluriel des libelles, pour les titres de groupe de la grille publique. */
export const LIBELLES_POSTE_PLURIEL: Record<Poste, string> = {
  passeur: "Passeurs",
  pointu: "Pointus",
  central: "Centraux",
  receptionneur: "Réceptionneurs-attaquants",
  libero: "Libéros",
  autre: "Autres",
};

/**
 * L'effectif en groupes de poste, dans l'ordre de presentation d'une equipe,
 * et par numero dans chaque groupe (sans numero en dernier). Jamais d'autre
 * tri : le site ne classe pas les joueurs entre eux (principe 1).
 */
export function grouperParPoste<T extends { poste: Poste; numero: number | null }>(liste: T[]) {
  const tries = [...liste].sort(
    (a, b) => rangPoste(a.poste) - rangPoste(b.poste) || (a.numero ?? 1000) - (b.numero ?? 1000),
  );
  const groupes: { poste: Poste; membres: T[] }[] = [];
  for (const membre of tries) {
    const dernier = groupes.at(-1);
    if (dernier && dernier.poste === membre.poste) dernier.membres.push(membre);
    else groupes.push({ poste: membre.poste, membres: [membre] });
  }
  return groupes;
}
