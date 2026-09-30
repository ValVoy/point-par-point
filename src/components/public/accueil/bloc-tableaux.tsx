import Link from "next/link";
import type { Rencontre } from "@/lib/rencontres";
import type { Resultat } from "@/lib/resultats";
import { ActionsMatch } from "../actions-match";
import { ResultatsPrecedents } from "../resultats-precedents";
import { TableauProchainMatch } from "../tableau-prochain-match";
import { TableauResultat } from "../tableau-resultat";

/**
 * Le chapitre des matchs (fiche fiches/accueil.md) : le prochain match et le
 * dernier resultat cote a cote en tableaux LED, puis les matchs d'avant en
 * cartes defilantes. Chaque morceau disparait s'il n'a rien a dire, et le
 * chapitre entier aussi (principe 4). Le prochain match vient en premier : sur
 * un telephone, c'est lui qu'on voit d'abord.
 */

export function BlocTableaux({
  prochain,
  dernier,
  precedents,
  maintenant,
}: {
  prochain: Rencontre | null;
  dernier: Resultat | null;
  precedents: Resultat[];
  maintenant: Date;
}) {
  if (!prochain && !dernier && precedents.length === 0) return null;
  const salle = prochain ? [prochain.salleNom, prochain.salleAdresse].filter(Boolean).join(", ") : null;

  return (
    <section aria-labelledby="titre-matchs" className="grain relative bg-[var(--color-nuit-violet)] py-24 sm:py-32">
      <div className="colonne-large relative" data-apparait>
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
          Les matchs
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 id="titre-matchs" className="titre-affiche text-6xl sm:text-8xl">
            Au tableau
          </h2>
          <Link
            href="/matchs"
            className="inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)]"
          >
            Tout le calendrier
          </Link>
        </div>
        {prochain || dernier ? (
          <div className={`mt-12 grid items-start gap-10 ${prochain && dernier ? "xl:grid-cols-2 xl:gap-6" : "max-w-3xl"}`}>
            {prochain ? (
              <div data-allume>
                <TableauProchainMatch
                  match={{
                    adversaire: prochain.adversaire,
                    domicile: prochain.aDomicile,
                    joueLe: prochain.joueLe,
                    salle: salle || null,
                  }}
                  maintenant={maintenant}
                />
                <ActionsMatch match={prochain} />
              </div>
            ) : null}
            {dernier ? (
              <div data-allume>
                <TableauResultat resultat={dernier} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {precedents.length > 0 ? (
        <div className="relative mt-20" data-apparait>
          <p className="colonne-large text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
            Avant ça
          </p>
          <div className="mt-6">
            <ResultatsPrecedents resultats={precedents} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
