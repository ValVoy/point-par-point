import { dateLongue } from "@/lib/dates";
import type { Resultat } from "@/lib/resultats";

/**
 * Les matchs d'avant le dernier : une rangee de cartes qui defile a
 * l'horizontale, en pleine largeur, avec un score geant. Pas de lumiere, elle
 * est reservee au dernier match. Le score reprend la grammaire de la
 * pastille : plein pour une victoire, en contour pour une defaite, et le mot
 * est toujours ecrit en toutes lettres a cote. Comme sur les tableaux, le
 * score se lit locaux d'abord : « Chez X, 3-2 » veut dire que X a recu et
 * gagne, et le mot Defaite le confirme.
 *
 * La rangee se fait defiler au doigt, a la molette, ou au clavier une fois
 * atteinte par Tab : elle est focalisable et nommee.
 */

const contour = {
  color: "transparent",
  WebkitTextStroke: "2px var(--color-craie-douce)",
} as const;

function Carte({ resultat }: { resultat: Resultat }) {
  const victoire = resultat.setsNous > resultat.setsEux;
  const d = resultat.domicile;
  const [gauche, droite] = d ? [resultat.setsNous, resultat.setsEux] : [resultat.setsEux, resultat.setsNous];
  return (
    <li className="w-[78vw] max-w-[22rem] shrink-0 snap-start border-t-2 border-[var(--color-nuit-trait)] pt-4 sm:w-[20rem]">
      <p className="text-sm text-[var(--color-craie-douce)] first-letter:uppercase">{dateLongue(resultat.joueLe)}</p>
      <p className="titre-affiche mt-1 line-clamp-2 min-h-[2em] text-2xl leading-none">
        {resultat.domicile ? "Contre" : "Chez"} {resultat.adversaire}
      </p>
      <p className="titre-affiche mt-3 text-[8rem] leading-[0.8]" style={victoire ? undefined : contour}>
        {gauche}-{droite}
      </p>
      <p className="mt-3 text-xs font-semibold tracking-[0.2em] uppercase">
        <span className={victoire ? "text-[var(--color-craie)]" : "text-[var(--color-craie-douce)]"}>
          {victoire ? "Victoire" : "Défaite"}
        </span>
        {resultat.sets.length > 0 ? (
          <span className="ml-3 font-normal tracking-normal text-[var(--color-craie-tenue)] normal-case tabular-nums">
            {resultat.sets.map(([n, e]) => (d ? `${n}-${e}` : `${e}-${n}`)).join(" · ")}
          </span>
        ) : null}
      </p>
    </li>
  );
}

export function ResultatsPrecedents({ resultats }: { resultats: Resultat[] }) {
  if (resultats.length === 0) return null;
  return (
    <ul
      aria-label="Résultats précédents"
      tabIndex={0}
      className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 focus-visible:outline-offset-[-4px] [scroll-padding-inline:var(--marge)] [scrollbar-width:thin] sm:gap-10"
      style={{ paddingInline: "var(--marge)" }}
    >
      {resultats.map((r) => (
        <Carte key={`${r.joueLe.getTime()}-${r.adversaire}`} resultat={r} />
      ))}
    </ul>
  );
}
