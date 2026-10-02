/**
 * Victoire ou defaite, sans couleur (fiche fiches/palette.md) : ni vert ni
 * rouge, qui ajouteraient deux teintes et un code illisible aux daltoniens.
 * La lettre porte le sens, la forme le confirme : pastille pleine a la craie
 * pour la victoire, en contour pour la defaite. Le mot complet reste lu par les lecteurs d'ecran.
 */
export function PastilleResultat({ victoire, className = "" }: { victoire: boolean; className?: string }) {
  return (
    <span
      className={`inline-grid size-[1.6em] shrink-0 place-items-center rounded-full border-2 border-current text-[max(0.75em,0.8125rem)] leading-none font-bold ${
        victoire ? "bg-[var(--color-craie)] text-[var(--color-nuit)] [border-color:var(--color-craie)]" : "text-[var(--color-craie)]"
      } ${className}`}
    >
      <span aria-hidden="true">{victoire ? "V" : "D"}</span>
      <span className="sr-only">{victoire ? "Victoire" : "Défaite"}</span>
    </span>
  );
}
