/**
 * Geometrie de la scene du ballon, vue de cote, en unites SVG. Deux cadrages :
 * large pour un ecran d'ordinateur, vertical pour un telephone (decide au
 * cadrage : le mobile a sa propre version, pas une version reduite).
 *
 * Le geste est une attaque : une passe tendue monte jusqu'a un sommet, le
 * ballon redescend vers l'attaquant, part en ligne droite par-dessus le filet,
 * frappe le sol adverse, rebondit et sort du cadre par la droite (retours de
 * l'utilisateur du 29-09-2026 : passe moins en cloche, ballon plus gros,
 * rebond hors champ).
 *
 * Chaque cadrage est verifie par les tests : sur toute la largeur apparente du
 * filet, le bas du ballon passe au-dessus de la bande ; a l'impact il repose
 * sur le sol ; le rebond finit hors du cadre.
 */

type Point = { x: number; y: number };

export type Geometrie = {
  largeur: number;
  hauteur: number;
  sol: number;
  /**
   * Le filet vu de trois quarts : `demi` est la demi-largeur apparente du
   * panneau, `recul` la hauteur dont remonte le poteau lointain. Le haut du
   * filet monte donc vers la droite, pendant que le smash descend : c'est a
   * l'extremite lointaine que la marge est la plus faible.
   */
  filet: { x: number; haut: number; bas: number; demi: number; recul: number };
  rayon: number;
  depart: Point;
  sommet: Point;
  frappe: Point;
  impact: Point;
  /** Controle de la courbe du rebond, et point de sortie, hors du cadre. */
  rebond: Point;
  sortie: Point;
};

export const GRAND: Geometrie = {
  largeur: 1600,
  hauteur: 900,
  sol: 800,
  filet: { x: 800, haut: 440, bas: 580, demi: 26, recul: 16 },
  rayon: 26,
  depart: { x: 420, y: 430 },
  sommet: { x: 565, y: 145 },
  frappe: { x: 650, y: 180 },
  impact: { x: 1150, y: 774 },
  rebond: { x: 1330, y: 420 },
  sortie: { x: 1700, y: 560 },
};

// Cadre presque carre (9/10) plutot que 3/4, et filet rapproche de la gauche :
// sur un telephone, le terrain vide derriere le passeur ne racontait rien
// (retour de l'utilisateur du 29-09-2026).
export const PORTRAIT: Geometrie = {
  largeur: 900,
  hauteur: 1000,
  sol: 900,
  filet: { x: 320, haut: 480, bas: 620, demi: 16, recul: 10 },
  rayon: 30,
  depart: { x: 110, y: 560 },
  sommet: { x: 200, y: 260 },
  frappe: { x: 250, y: 300 },
  impact: { x: 680, y: 870 },
  rebond: { x: 790, y: 560 },
  sortie: { x: 1010, y: 700 },
};

/** Les temps du geste, chacun sa courbe. Seuls les trois premiers se tracent. */
export function segments(g: Geometrie) {
  const { depart: d, sommet: s, frappe: f, impact: i, rebond: r, sortie: o } = g;
  return {
    // Controle a la hauteur du sommet : la tangente y est horizontale, le
    // ballon y ralentit. A mi-chemin plutot qu'au tiers : une passe tendue.
    montee: `M${d.x},${d.y} Q${d.x + (s.x - d.x) * 0.5},${s.y} ${s.x},${s.y}`,
    descente: `M${s.x},${s.y} Q${s.x + (f.x - s.x) * 0.7},${s.y} ${f.x},${f.y}`,
    smash: `M${f.x},${f.y} L${i.x},${i.y}`,
    rebond: `M${i.x},${i.y} Q${r.x},${r.y} ${o.x},${o.y}`,
  };
}

/** Hauteur de la trajectoire du smash a l'abscisse x. */
export function hauteurSmash(g: Geometrie, x: number): number {
  const { frappe: f, impact: i } = g;
  return f.y + ((x - f.x) * (i.y - f.y)) / (i.x - f.x);
}

/**
 * Marge entre le bas du ballon et le haut du filet, au plus juste sur toute
 * la largeur apparente du panneau. Positive : le ballon passe au-dessus.
 */
export function margeAuFilet(g: Geometrie): number {
  const { filet } = g;
  const extremites = [
    { x: filet.x - filet.demi, haut: filet.haut },
    { x: filet.x + filet.demi, haut: filet.haut - filet.recul },
  ];
  return Math.min(...extremites.map((e) => e.haut - (hauteurSmash(g, e.x) + g.rayon)));
}
