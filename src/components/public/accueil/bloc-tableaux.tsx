import type { Rencontre } from "@/lib/rencontres";
import type { Resultat } from "@/lib/resultats";
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

function itineraire(match: Rencontre) {
  if (match.salleLatitude !== null && match.salleLongitude !== null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${match.salleLatitude},${match.salleLongitude}`;
  }
  const adresse = [match.salleNom, match.salleAdresse].filter(Boolean).join(", ");
  return adresse ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adresse)}` : null;
}

const bouton =
  "inline-flex min-h-12 items-center justify-center border-2 px-5 font-semibold whitespace-nowrap transition-colors duration-[80ms]";

function Actions({ match }: { match: Rencontre }) {
  const lien = itineraire(match);
  return (
    <div className="mt-4 grid gap-3 sm:flex">
      <a
        href={`/agenda/${match.slug}`}
        download
        className={`${bouton} border-[var(--color-jaune)] bg-[var(--color-jaune)] text-[var(--color-nuit)] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)]`}
      >
        Ajouter à l&apos;agenda
      </a>
      {lien ? (
        <a
          href={lien}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bouton} border-[var(--color-nuit-trait)] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]`}
        >
          Itinéraire
          <span className="sr-only"> (ouvre Google Maps)</span>
        </a>
      ) : null}
    </div>
  );
}

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
      <div className="colonne-large relative" data-revele>
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
          Les matchs
        </p>
        <h2 id="titre-matchs" className="titre-affiche mt-3 text-6xl sm:text-8xl">
          Au tableau
        </h2>
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
                <Actions match={prochain} />
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
        <div className="relative mt-20" data-revele>
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
