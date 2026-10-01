import Link from "next/link";
import { dateLongue } from "@/lib/dates";
import { extraitEtape } from "@/lib/porte-entree";
import { FilProjet } from "./mouvements-porte-entree";

/**
 * Le projet (fiche fiches/accueil-porte-entree.md) : les trois dernieres
 * etapes de la chronologie, numerotees a leur place dans tout le recit,
 * reliees par le fil turquoise de la page « Le projet ». Le fil est fait de
 * troncons d'un repere au suivant, horizontaux en grand ecran, verticaux au
 * telephone ; `FilProjet` les trace au defilement. Le chapitre disparait
 * tant qu'aucune etape n'est publiee.
 */

const EXTRAIT_MAX = 200;

const TRAIT = "absolute bg-[var(--color-turquoise)]/70";

type Etape = { id: number; titre: string; texte: string | null; survenuLe: Date | null; dateLibre: string | null };

export function BlocProjet({ etapes, total }: { etapes: Etape[]; total: number }) {
  if (etapes.length === 0) return null;
  const premierRang = total - etapes.length + 1;

  return (
    <section aria-labelledby="titre-projet" className="colonne-large py-24 sm:py-32" data-apparait>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--color-craie)] pb-3">
        <h2 id="titre-projet" className="titre-affiche text-5xl sm:text-6xl">
          Le projet
        </h2>
        <Link
          href="/le-projet"
          className="inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)]"
        >
          Toute l&apos;histoire
        </Link>
      </div>
      <FilProjet>
        <ol className="mt-12 grid gap-12 pl-10 lg:grid-cols-3 lg:gap-10 lg:pl-0">
          {etapes.map((e, i) => {
            const date = e.dateLibre ?? (e.survenuLe ? dateLongue(e.survenuLe) : null);
            const extrait = extraitEtape(e.texte, EXTRAIT_MAX);
            return (
              <li key={e.id} className="relative lg:pt-10">
                {/* Le troncon vers l'etape suivante, du centre d'un repere au centre du suivant. */}
                {i < etapes.length - 1 ? (
                  <>
                    <span
                      aria-hidden="true"
                      data-fil="grand"
                      className={`${TRAIT} top-[5px] left-1.5 hidden h-0.5 w-[calc(100%+2.5rem)] origin-left lg:block`}
                    />
                    <span
                      aria-hidden="true"
                      data-fil="petit"
                      className={`${TRAIT} top-1.5 -left-[calc(2.5rem-5px)] h-[calc(100%+3rem)] w-0.5 origin-top lg:hidden`}
                    />
                  </>
                ) : null}
                <span
                  aria-hidden="true"
                  className="absolute top-0 -left-10 z-10 size-3 bg-[var(--color-turquoise)] lg:left-0"
                />
                <div data-etape>
                  <p className="titre-affiche text-2xl text-[var(--color-turquoise)]">
                    {String(premierRang + i).padStart(2, "0")}.
                  </p>
                  {date ? (
                    <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase first-letter:uppercase">
                      {e.survenuLe && !e.dateLibre ? <time dateTime={e.survenuLe.toISOString()}>{date}</time> : date}
                    </p>
                  ) : null}
                  <h3 className="titre-affiche mt-2 hyphens-auto text-3xl text-balance break-words sm:text-4xl">
                    {e.titre}
                  </h3>
                  {extrait ? (
                    <p className="mt-3 max-w-[38ch] leading-relaxed text-[var(--color-craie-lecture)]">{extrait}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </FilProjet>
    </section>
  );
}
