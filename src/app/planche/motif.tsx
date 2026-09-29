import { useId } from "react";

/*
 * Le motif du maillot : une grille de losanges, chacun coupe en deux moities
 * de tons differents, sur un fond d'une troisieme couleur. Dessine en motif
 * SVG plutot qu'en image, pour qu'il reste net a toutes les tailles et que ses
 * couleurs viennent des jetons.
 */
export function Motif({
  taille = 48,
  fond = "var(--nuit)",
  gauche = "var(--turquoise)",
  droite = "var(--violet)",
  className,
}: {
  taille?: number;
  fond?: string;
  gauche?: string;
  droite?: string;
  className?: string;
}) {
  const id = useId();
  const m = taille / 2;

  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={id} width={taille} height={taille} patternUnits="userSpaceOnUse">
          <rect width={taille} height={taille} fill={fond} />
          <polygon points={`${m},0 ${m},${taille} 0,${m}`} fill={gauche} />
          <polygon points={`${m},0 ${taille},${m} ${m},${taille}`} fill={droite} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
