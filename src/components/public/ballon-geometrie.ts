/**
 * Geometrie de la scene du ballon, vue de cote, en unites SVG. Deux cadrages :
 * large pour un ecran d'ordinateur, vertical pour un telephone (decide au
 * cadrage : le mobile a sa propre version, pas une version reduite).
 *
 * Le geste est une attaque : la passe monte en cloche jusqu'a un sommet ou le
 * ballon semble s'arreter, redescend vers l'attaquant, puis part en ligne
 * droite par-dessus le filet jusqu'a l'impact au sol, cote adverse.
 *
 * Chaque cadrage est verifie par les tests : a l'aplomb du filet, le bas du
 * ballon passe au-dessus de la bande, et a l'impact il repose sur le sol
 * (son centre a un rayon au-dessus).
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
};

export const GRAND: Geometrie = {
  largeur: 1600,
  hauteur: 900,
  sol: 800,
  filet: { x: 800, haut: 440, bas: 580, demi: 26, recul: 16 },
  rayon: 18,
  depart: { x: 380, y: 580 },
  sommet: { x: 575, y: 120 },
  frappe: { x: 660, y: 200 },
  impact: { x: 1150, y: 782 },
};

export const PORTRAIT: Geometrie = {
  largeur: 900,
  hauteur: 1200,
  sol: 1080,
  filet: { x: 450, haut: 560, bas: 720, demi: 16, recul: 10 },
  rayon: 22,
  depart: { x: 170, y: 780 },
  sommet: { x: 300, y: 230 },
  frappe: { x: 380, y: 330 },
  impact: { x: 720, y: 1058 },
};

/** Les trois temps du geste, chacun sa courbe et son rythme. */
export function segments(g: Geometrie) {
  const { depart: d, sommet: s, frappe: f, impact: i } = g;
  return {
    // Controle a la hauteur du sommet : la tangente y est horizontale, le
    // ballon y ralentit jusqu'a sembler suspendu.
    montee: `M${d.x},${d.y} Q${d.x + (s.x - d.x) * 0.35},${s.y} ${s.x},${s.y}`,
    descente: `M${s.x},${s.y} Q${s.x + (f.x - s.x) * 0.7},${s.y} ${f.x},${f.y}`,
    smash: `M${f.x},${f.y} L${i.x},${i.y}`,
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
