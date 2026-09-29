import { useId } from "react";

/*
 * Le motif du maillot : des carres coupes en deux par une diagonale, un
 * demi-carre sombre et un clair, dont l'orientation varie d'un carre a
 * l'autre. Assembles, ils dessinent losanges, fleches et zigzags, comme sur
 * les maillots de l'equipe (releve sur photo le 29-09-2026 ; une premiere
 * version en losanges fendus ne se reconnaissait pas).
 *
 * Dessine en motif SVG plutot qu'en image, pour qu'il reste net a toutes les
 * tailles et que ses couleurs viennent des jetons. En mode contour, seules les
 * aretes des triangles sont tracees, d'un trait fin : la version en filigrane.
 */

/** La tuile repetee compte CARRES x CARRES carres ; sa largeur est CARRES * taille. */
export const CARRES = 4;

/*
 * Orientation de chaque carre : quelle moitie est sombre.
 *   0 : diagonale « \ », moitie basse gauche    1 : « \ », moitie haute droite
 *   2 : diagonale « / », moitie haute gauche    3 : « / », moitie basse droite
 * Un bloc de quatre dont les moities sombres convergent forme un losange ; le
 * bloc voisin, inverse, forme des fleches. C'est ce melange qui fait le maillot.
 */
const ORIENTATIONS = [
  [3, 0, 2, 1],
  [1, 2, 0, 3],
  [2, 1, 3, 0],
  [0, 3, 1, 2],
];

function moitieSombre(orientation: number, x: number, y: number, t: number) {
  const [a, b, c, d] = [`${x},${y}`, `${x + t},${y}`, `${x + t},${y + t}`, `${x},${y + t}`];
  switch (orientation) {
    case 0:
      return `${a} ${d} ${c}`;
    case 1:
      return `${a} ${b} ${c}`;
    case 2:
      return `${a} ${b} ${d}`;
    default:
      return `${b} ${c} ${d}`;
  }
}

export function Motif({
  taille = 24,
  fond = "var(--color-nuit)",
  sombre = "var(--color-turquoise)",
  clair = "transparent",
  contour = false,
  className,
}: {
  /** Cote d'un carre, en pixels. */
  taille?: number;
  fond?: string;
  sombre?: string;
  clair?: string;
  contour?: boolean;
  className?: string;
}) {
  const id = useId();
  const tuile = CARRES * taille;
  const carres = ORIENTATIONS.flatMap((ligne, rang) =>
    ligne.map((orientation, colonne) => ({ orientation, x: colonne * taille, y: rang * taille })),
  );

  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={id} width={tuile} height={tuile} patternUnits="userSpaceOnUse">
          <rect width={tuile} height={tuile} fill={fond} />
          {contour ? (
            <path
              d={carres
                .map(({ orientation, x, y }) =>
                  orientation < 2
                    ? `M${x},${y}h${taille}v${taille}h${-taille}Z M${x},${y}L${x + taille},${y + taille}`
                    : `M${x},${y}h${taille}v${taille}h${-taille}Z M${x + taille},${y}L${x},${y + taille}`,
                )
                .join(" ")}
              fill="none"
              stroke={sombre}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <>
              <rect width={tuile} height={tuile} fill={clair} />
              {carres.map(({ orientation, x, y }) => (
                <polygon key={`${x}-${y}`} points={moitieSombre(orientation, x, y, taille)} fill={sombre} />
              ))}
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
