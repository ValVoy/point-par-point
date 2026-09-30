/**
 * Victoire ou defaite, sans couleur (fiche fiches/palette.md) : un imprime en
 * trois encres perd sa force a la quatrieme teinte. La lettre porte le sens,
 * la forme le confirme : pastille pleine a l'encre pour la victoire, en
 * contour pour la defaite. Le mot complet reste lu par les lecteurs d'ecran.
 */
export function PastilleResultat({ victoire, className = "" }: { victoire: boolean; className?: string }) {
  return (
    <span
      className={`inline-grid size-[1.6em] shrink-0 place-items-center rounded-full border-2 border-current text-[0.75em] leading-none font-bold ${
        victoire ? "bg-[var(--color-encre)] text-[var(--color-papier)] [border-color:var(--color-encre)]" : "text-[var(--color-encre)]"
      } ${className}`}
    >
      <span aria-hidden="true">{victoire ? "V" : "D"}</span>
      <span className="sr-only">{victoire ? "Victoire" : "Défaite"}</span>
    </span>
  );
}
