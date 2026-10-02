import type { Metadata } from "next";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { BandeauEpisode } from "@/components/public/serie/bandeau-episode";
import { BoutonAbonnement, EtiquetteMatch, estNouveau } from "@/components/public/serie/elements-serie";
import { libelleEpisode, LigneEpisode } from "@/components/public/serie/ligne-episode";
import { TitreChapitre } from "@/components/public/titre-chapitre";
import { Volets } from "@/components/public/volets";
import { dateLongue } from "@/lib/dates";
import { serieComplete } from "@/lib/serie";
import { EQUIPE, NOM_DU_SITE } from "@/lib/site";
import { titreSansNumero } from "@/lib/titre-episode";

/**
 * La serie (fiches serie.md et refonte-respiration.md) : l'ouverture et
 * l'abonnement, le dernier episode en bandeau, puis le chapitre « Tous les
 * episodes » en liste verticale numerotee, chaque episode avec sa vignette.
 * L'annonce, sans numero, ferme la liste sous « Avant la serie ». Les
 * vignettes ne chargent rien de YouTube : elles passent par notre serveur.
 *
 * Le rythme : un grand vide avant chaque chapitre, le titre colle a son
 * contenu, et tout ce qui suit s'enchaine serre.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "La série",
  description: `${NOM_DU_SITE}, la série qui suit l'équipe D2 masculine du ${EQUIPE}, point par point.`,
};

export default async function PageSerie() {
  const { maintenant, episodes } = await serieComplete();
  const numerotes = episodes.filter((e) => e.episode.numero !== null);
  const avant = episodes.filter((e) => e.episode.numero === null);
  // Sans episode numerote (avant la premiere sortie), les annonces tiennent la page seules.
  const [vedette, ...liste] = numerotes.length > 0 ? numerotes : avant;

  return (
    <>
      <EnTete actif="/serie" />
      <main id="contenu" className="pb-[var(--air-chapitre)]">
        <Volets>
          <section className="colonne-large pt-16 sm:pt-24">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
              <div className="min-w-0">
                <p className="etiquette text-[var(--color-turquoise)]">{NOM_DU_SITE}</p>
                <h1 className="titre-affiche titre-page mt-4">La série</h1>
              </div>
              {numerotes.length > 0 ? (
                <p className="pb-2 sm:text-right">
                  <span className="titre-affiche chiffre-geant block">{String(numerotes.length).padStart(2, "0")}</span>
                  <span className="etiquette mt-2 block text-[var(--color-craie-douce)]">
                    épisode{numerotes.length > 1 ? "s" : ""} publié{numerotes.length > 1 ? "s" : ""}
                  </span>
                </p>
              ) : null}
            </div>
            <div className="mt-[var(--titre-contenu)] flex flex-wrap items-center gap-x-10 gap-y-6">
              <p className="chapeau max-w-[34ch] text-[var(--color-craie-douce)]">
                La série qui suit l&apos;équipe D2 masculine du {EQUIPE}, match après match.
              </p>
              <BoutonAbonnement />
            </div>
          </section>

          {!vedette ? (
            <p className="colonne-large suite chapeau text-[var(--color-craie-douce)]">La série arrive bientôt.</p>
          ) : (
            <>
              <section aria-label="Dernier épisode" className="colonne-large suite">
                <BandeauEpisode
                  href={`/serie/${vedette.episode.slug}`}
                  youtubeId={vedette.episode.youtubeId}
                  titre={titreSansNumero(vedette.episode)}
                  etiquette={vedette.episode.numero === null ? "Annonce" : `Dernier épisode · ${libelleEpisode(vedette.episode.numero)}`}
                  nouveau={estNouveau(vedette.episode.publieLe, maintenant)}
                  prioritaire
                />
                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
                  {vedette.episode.resume ? (
                    <p className="chapeau max-w-[46ch] text-[var(--color-craie-douce)]">{vedette.episode.resume}</p>
                  ) : (
                    <span />
                  )}
                  <p className="flex flex-col gap-2 lg:items-end lg:text-right">
                    {vedette.match ? <EtiquetteMatch match={vedette.match} maintenant={maintenant} /> : null}
                    {vedette.episode.publieLe ? (
                      <span className="text-sm text-[var(--color-craie-tenue)]">Publié le {dateLongue(vedette.episode.publieLe)}</span>
                    ) : null}
                  </p>
                </div>
              </section>

              {liste.length > 0 ? (
                <section aria-labelledby="titre-episodes" className="colonne-large chapitre">
                  <TitreChapitre id="titre-episodes">Tous les épisodes</TitreChapitre>
                  <ol className="mt-[var(--titre-contenu)] divide-y divide-[var(--color-nuit-trait)]">
                    {liste.map(({ episode, match }) => (
                      <LigneEpisode key={episode.id} episode={episode} match={match} maintenant={maintenant} />
                    ))}
                  </ol>
                </section>
              ) : null}

              {numerotes.length > 0 && avant.length > 0 ? (
                <section aria-labelledby="titre-avant" className="colonne-large suite">
                  <h2 id="titre-avant" className="etiquette border-t border-[var(--color-nuit-trait)] pt-6 text-[var(--color-craie-douce)]">
                    Avant la série
                  </h2>
                  <ol className="mt-6 divide-y divide-[var(--color-nuit-trait)]">
                    {avant.map(({ episode, match }) => (
                      <LigneEpisode key={episode.id} episode={episode} match={match} maintenant={maintenant} />
                    ))}
                  </ol>
                </section>
              ) : null}

            </>
          )}
        </Volets>
      </main>
      <PiedDePage />
    </>
  );
}
