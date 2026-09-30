import { PastilleResultat } from "@/components/pastille-resultat";
import { AfficheurLed } from "@/components/public/afficheur-led";
import styles from "./planche.module.css";

/*
 * Le tableau apres le match, en tableau de gymnase : boitier mat, legendes
 * en craie, sets en LED ambre, detail des sets en craie (gagnes en gras). Toute
 * information en gros chiffres existe aussi en texte clair, pour les lecteurs
 * d'ecran. Le tableau avant match est le composant du site, montre plus haut.
 */

function Equipes() {
  return (
    <div className="titre-affiche flex items-start justify-between gap-4">
      <div>
        <p className="text-xs tracking-[0.2em] text-[var(--color-craie-douce)]">Locaux</p>
        <p className="mt-1 text-2xl sm:text-4xl">VF Francheville</p>
      </div>
      <div className="text-right">
        <p className="text-xs tracking-[0.2em] text-[var(--color-craie-douce)]">Visiteurs</p>
        <p className="mt-1 text-2xl sm:text-4xl">Adversaire</p>
      </div>
    </div>
  );
}

const NOMBRES = ["zéro", "un", "deux", "trois"];

/*
 * Le tableau apres le match. Il doit tenir jusqu'au cinquieme set : c'est le
 * cas le plus large, et sur un telephone cinq scores cote a cote ne laissent
 * que soixante pixels chacun. Le cinquieme set, le tie-break, se joue en 15.
 */
function ApresMatch({ sets }: { sets: [number, number][] }) {
  const nous = sets.filter(([n, e]) => n > e).length;
  const eux = sets.length - nous;
  const victoire = nous > eux;
  const cinq = sets.length === 5;

  return (
    <div
      className="rounded-sm border border-[var(--color-nuit-trait)] bg-[var(--color-boitier)] p-6 sm:p-10"
      style={{ boxShadow: "inset 0 0 0 6px var(--color-nuit)" }}
    >
      <Equipes />
      <p className="sr-only">
        {victoire ? "Victoire" : "Défaite"} {NOMBRES[nous]} sets à {NOMBRES[eux]} :{" "}
        {sets.map(([n, e]) => `${n}-${e}`).join(", ")}.
      </p>
      <div aria-hidden="true" className="mt-8 flex items-center justify-center gap-4 sm:gap-8">
        <AfficheurLed valeur={String(nous)} className="text-8xl sm:text-[10rem]" />
        <AfficheurLed valeur="-" className="text-5xl sm:text-7xl" />
        <AfficheurLed valeur={String(eux)} className="text-8xl sm:text-[10rem]" />
      </div>
      <p aria-hidden="true" className="mt-5 flex justify-center">
        <PastilleResultat victoire={victoire} className="text-2xl" />
      </p>
      <ol
        aria-hidden="true"
        className={`mt-8 grid gap-1 border-t border-[var(--color-nuit-trait)] pt-5 text-center sm:gap-2 ${cinq ? "grid-cols-5" : "grid-cols-4"}`}
      >
        {sets.map(([n, e], i) => (
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
              className={`${n > e ? "" : "font-normal text-[var(--color-craie-tenue)]"} ${cinq ? "text-xl" : "text-2xl"} whitespace-nowrap sm:text-4xl`}
            >
              {n}-{e}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TableauScore() {
  return (
    <section className="colonne-large border-t border-[var(--color-nuit-trait)] py-20">
      <p className={styles.etiquette}>04 · Après le match</p>
      <h2 className="titre-affiche mt-3 text-5xl sm:text-7xl">Le score, jusqu&apos;au tie-break</h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--color-craie-douce)]">
        Le cinquième set est le cas le plus large sur un téléphone : cinq scores côte à côte.
      </p>
      <div className="mt-12 grid gap-8 xl:grid-cols-2">
        <ApresMatch sets={[[25, 21], [22, 25], [25, 19], [25, 23]]} />
        <ApresMatch sets={[[25, 21], [22, 25], [19, 25], [25, 23], [12, 15]]} />
      </div>
    </section>
  );
}
