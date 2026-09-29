import type { Geometrie } from "../ballon-geometrie";

/**
 * Geometrie de l'intro de l'accueil (fiche `fiches/accueil-ouverture.md`), en
 * unites SVG. La salle occupe tout l'ecran : le tableau en haut, les tribunes,
 * le bandeau LED, puis le terrain, redescendu par rapport au prototype pour
 * leur laisser la place. Le terrain garde la forme de `Geometrie`, pour que
 * le geste et ses tests soient les memes.
 *
 * `titre` est la boite ou se forme le titre, en unites de la scene : les
 * lettres, en unites de police, y sont mises a l'echelle.
 */

type Boite = { x: number; y: number; largeur: number; hauteur: number };

export type GeometrieIntro = {
  terrain: Geometrie;
  tableau: Boite;
  tribunes: { haut: number; rangs: number; ecart: number; marge: number; rayon: number };
  bandeau: Boite;
  titre: Boite;
  /** Mise en page du titre : sur une ligne en grand, un mot par ligne sur telephone. */
  miseEnPage: "uneLigne" | "parMot";
};

export const INTRO_GRAND: GeometrieIntro = {
  terrain: {
    largeur: 1600,
    hauteur: 900,
    sol: 860,
    filet: { x: 800, haut: 610, bas: 740, demi: 26, recul: 16 },
    rayon: 26,
    depart: { x: 420, y: 600 },
    sommet: { x: 565, y: 380 },
    frappe: { x: 650, y: 400 },
    impact: { x: 1150, y: 834 },
    rebond: { x: 1330, y: 600 },
    sortie: { x: 1700, y: 700 },
  },
  tableau: { x: 580, y: 22, largeur: 440, hauteur: 148 },
  tribunes: { haut: 180, rangs: 3, ecart: 26, marge: 70, rayon: 3.5 },
  bandeau: { x: 0, y: 270, largeur: 1600, hauteur: 34 },
  titre: { x: 170, y: 420, largeur: 1260, hauteur: 151 },
  miseEnPage: "uneLigne",
};

export const INTRO_PORTRAIT: GeometrieIntro = {
  terrain: {
    largeur: 900,
    hauteur: 1800,
    sol: 1500,
    filet: { x: 320, haut: 1080, bas: 1220, demi: 16, recul: 10 },
    rayon: 30,
    depart: { x: 110, y: 1160 },
    sommet: { x: 200, y: 860 },
    frappe: { x: 250, y: 900 },
    impact: { x: 680, y: 1470 },
    rebond: { x: 790, y: 1160 },
    sortie: { x: 1010, y: 1300 },
  },
  tableau: { x: 150, y: 70, largeur: 600, hauteur: 220 },
  tribunes: { haut: 330, rangs: 3, ecart: 30, marge: 40, rayon: 5 },
  bandeau: { x: 0, y: 450, largeur: 900, hauteur: 46 },
  titre: { x: 80, y: 640, largeur: 740, hauteur: 402 },
  miseEnPage: "parMot",
};

/** Les points du public, rang par rang, en quinconce. */
export function pointsDuPublic(g: GeometrieIntro): { x: number; y: number; rang: number }[] {
  const { haut, rangs, ecart, marge } = g.tribunes;
  const largeur = g.terrain.largeur;
  const points = [];
  for (let rang = 0; rang < rangs; rang += 1) {
    const decalage = rang % 2 === 0 ? 0 : ecart / 2;
    for (let x = marge + decalage; x <= largeur - marge; x += ecart) {
      points.push({ x, y: haut + rang * ecart * 0.9, rang });
    }
  }
  return points;
}

/** Echelle et position qui font tenir le titre, centre, dans sa boite. */
export function placementTitre(g: GeometrieIntro, titre: { largeur: number; hauteur: number }) {
  const echelle = Math.min(g.titre.largeur / titre.largeur, g.titre.hauteur / titre.hauteur);
  return {
    echelle,
    x: g.titre.x + (g.titre.largeur - titre.largeur * echelle) / 2,
    y: g.titre.y + (g.titre.hauteur - titre.hauteur * echelle) / 2,
  };
}
