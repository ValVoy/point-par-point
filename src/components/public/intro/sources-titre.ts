import type { Geometrie } from "../ballon-geometrie";

/**
 * D'ou part chaque lettre du titre, quand le terrain se transforme en texte.
 *
 * Les premieres lettres naissent de la trajectoire du ballon (la passe, puis
 * le smash), coupee en morceaux de meme longueur ; les suivantes naissent de
 * la ligne du sol. Chaque morceau est une polyligne, exprimee dans le repere du
 * titre (unites de police), puisque les lettres y vivent : MorphSVG la
 * transforme ensuite en contour de lettre.
 *
 * Calcul pur, sans navigateur : la trajectoire est echantillonnee a partir de
 * la geometrie, comme la dessine `segments()`.
 */

type Point = { x: number; y: number };
type Placement = { echelle: number; x: number; y: number };

function quadratique(a: Point, c: Point, b: Point, t: number): Point {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

/** La trajectoire tracee (passe, descente, smash), finement echantillonnee. */
export function echantillonnerTrajectoire(g: Geometrie, pas = 80): Point[] {
  const { depart: d, sommet: s, frappe: f, impact: i } = g;
  const controleMontee = { x: d.x + (s.x - d.x) * 0.5, y: s.y };
  const controleDescente = { x: s.x + (f.x - s.x) * 0.7, y: s.y };
  const points: Point[] = [];
  for (let k = 0; k <= pas; k += 1) points.push(quadratique(d, controleMontee, s, k / pas));
  for (let k = 1; k <= pas; k += 1) points.push(quadratique(s, controleDescente, f, k / pas));
  for (let k = 1; k <= pas; k += 1) {
    points.push({ x: f.x + ((i.x - f.x) * k) / pas, y: f.y + ((i.y - f.y) * k) / pas });
  }
  return points;
}

/** Coupe une polyligne en `n` morceaux de meme longueur, `parMorceau` points chacun. */
export function decouper(ligne: Point[], n: number, parMorceau = 10): Point[][] {
  const cumul = [0];
  for (let k = 1; k < ligne.length; k += 1) {
    const a = ligne[k - 1]!;
    const b = ligne[k]!;
    cumul.push(cumul[k - 1]! + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const total = cumul[cumul.length - 1]!;

  const pointA = (distance: number): Point => {
    let k = 1;
    while (k < cumul.length - 1 && cumul[k]! < distance) k += 1;
    const a = ligne[k - 1]!;
    const b = ligne[k]!;
    const segment = cumul[k]! - cumul[k - 1]! || 1;
    const t = Math.min(1, Math.max(0, (distance - cumul[k - 1]!) / segment));
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  };

  return Array.from({ length: n }, (_, morceau) =>
    Array.from({ length: parMorceau }, (_, k) =>
      pointA(((morceau + k / (parMorceau - 1)) / n) * total),
    ),
  );
}

const versTitre = (p: Point, placement: Placement): Point => ({
  x: (p.x - placement.x) / placement.echelle,
  y: (p.y - placement.y) / placement.echelle,
});

const enTrace = (points: Point[]) =>
  points.map((p, k) => `${k === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

/**
 * Les traces de depart de `nombre` lettres : la moitie haute (arrondie au-dessus)
 * depuis la trajectoire, le reste depuis le sol.
 */
export function sourcesDuTitre(g: Geometrie, placement: Placement, nombre: number): string[] {
  const depuisTrajectoire = Math.ceil(nombre / 2);
  const depuisSol = nombre - depuisTrajectoire;
  const trajectoire = decouper(echantillonnerTrajectoire(g), depuisTrajectoire);
  const sol = decouper(
    [
      { x: 0, y: g.sol },
      { x: g.largeur, y: g.sol },
    ],
    depuisSol,
  );
  return [...trajectoire, ...sol].map((morceau) => enTrace(morceau.map((p) => versTitre(p, placement))));
}
