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

export const PORTRAIT: Geometrie = {
  largeur: 900,
  hauteur: 1200,
  sol: 1080,
  filet: { x: 450, haut: 560, bas: 720, demi: 16, recul: 10 },
  rayon: 30,
  depart: { x: 190, y: 640 },
  sommet: { x: 300, y: 290 },
  frappe: { x: 380, y: 330 },
  impact: { x: 720, y: 1050 },
  rebond: { x: 830, y: 700 },
  sortie: { x: 1010, y: 860 },
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
