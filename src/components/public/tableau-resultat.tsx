import { PastilleResultat } from "@/components/pastille-resultat";
import { dateLongue } from "@/lib/dates";
import type { Resultat } from "@/lib/resultats";
import { AfficheurLed } from "./afficheur-led";
import { EQUIPE } from "@/lib/site";

/**
 * Le dernier resultat en tableau de gymnase, frere du tableau du prochain
 * match : boitier mat, sets en LED ambre, detail des sets en craie. C'est un
 * evenement, il a donc droit a la lumiere ; les matchs plus anciens n'y ont
 * pas droit (voir resultats-precedents.tsx).
 *
 * Comme sur un vrai tableau, les locaux sont a gauche : a l'exterieur, le
 * score se lit donc adversaire d'abord. Il doit tenir jusqu'au cinquieme set,
 * le cas le plus large sur un telephone. Toute l'information en LED existe
 * aussi en texte clair, pour les lecteurs d'ecran. Sans detail des sets
 * (saisie partielle), la rangee des sets disparait, le score reste.
 */

const NOMBRES = ["zéro", "un", "deux", "trois"];

export function TableauResultat({ resultat, etiquette = "Dernier match" }: { resultat: Resultat; etiquette?: string }) {
  const { adversaire, domicile, sets } = resultat;
  const nous = resultat.setsNous;
  const eux = resultat.setsEux;
  const victoire = nous > eux;
  const dateLisible = dateLongue(resultat.joueLe);
  const [gauche, droite] = domicile ? [EQUIPE, adversaire] : [adversaire, EQUIPE];
  const [setsGauche, setsDroite] = domicile ? [nous, eux] : [eux, nous];
  const oriente = (set: [number, number]) => (domicile ? set : ([set[1], set[0]] as [number, number]));
  const cinq = sets.length === 5;

  return (
    <div
      className="rounded-sm border border-[var(--color-nuit-trait)] bg-[var(--color-boitier)] p-5 sm:p-8"
      style={{ boxShadow: "inset 0 0 0 6px var(--color-nuit)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-jaune)] uppercase">{etiquette}</p>
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase" aria-hidden="true">
          <PastilleResultat victoire={victoire} className="text-base" />
          {victoire ? "Victoire" : "Défaite"}
        </p>
      </div>
      <div className="titre-affiche mt-3 flex items-start justify-between gap-4 text-xl text-balance sm:text-4xl">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--color-craie-douce)]">Locaux</p>
          <p className="mt-1">{gauche}</p>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-[0.2em] text-[var(--color-craie-douce)]">Visiteurs</p>
          <p className="mt-1">{droite}</p>
        </div>
      </div>

      <p className="sr-only">
        {victoire ? "Victoire" : "Défaite"} {NOMBRES[nous] ?? nous} sets à {NOMBRES[eux] ?? eux}
        {sets.length > 0 ? ` : ${sets.map(([n, e]) => `${n}-${e}`).join(", ")}` : ""}. {dateLisible}.
      </p>
      <div
        aria-hidden="true"
        className="mt-6 flex items-center justify-center gap-4 sm:gap-8"
        style={{ opacity: "calc(0.25 + 0.75 * var(--allume, 1))" }}
      >
        <AfficheurLed valeur={String(setsGauche)} className="text-7xl sm:text-9xl" />
        <AfficheurLed valeur="-" className="text-4xl sm:text-6xl" />
        <AfficheurLed valeur={String(setsDroite)} className="text-7xl sm:text-9xl" />
      </div>

      {sets.length > 0 ? (
      <ol
        aria-hidden="true"
        className={`mt-6 grid gap-1 pt-2 text-center sm:gap-2 ${cinq ? "grid-cols-5" : "grid-cols-4"}`}
      >
        {sets.map((set, i) => {
          const [g, d] = oriente(set);
          const gagne = set[0] > set[1];
          return (
            <li key={i} className="titre-affiche">
              <span className="block text-[0.65rem] tracking-[0.15em] text-[var(--color-craie-douce)] sm:text-xs sm:tracking-[0.2em]">
                {i === 4 ? (
                  <>
                    <span className="sm:hidden">Set 5</span>
                    <span className="hidden sm:inline">Tie-break</span>
                  </>
                ) : (
                  `Set ${i + 1}`
                )}
              </span>
              <span
                className={`${gagne ? "" : "font-normal text-[var(--color-craie-tenue)]"} ${cinq ? "text-xl" : "text-2xl"} whitespace-nowrap sm:text-3xl`}
              >
                {g}-{d}
              </span>
            </li>
          );
        })}
      </ol>
      ) : null}
      <p aria-hidden="true" className="mt-4 border-t border-[var(--color-nuit-trait)] pt-4 text-center text-sm text-[var(--color-craie-douce)] first-letter:uppercase">
        {dateLisible}
      </p>
    </div>
  );
}
