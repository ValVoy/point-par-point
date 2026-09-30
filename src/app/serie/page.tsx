import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import {
  BoutonAbonnement,
  EtiquetteMatch,
  estNouveau,
  MarqueNouveau,
} from "@/components/public/serie/elements-serie";
import { dateLongue } from "@/lib/dates";
import { serieComplete } from "@/lib/serie";
import { EQUIPE, NOM_DU_SITE } from "@/lib/site";
import { miniatureYoutube } from "@/lib/youtube";

/**
 * La serie (fiche fiches/serie.md) : l'accroche et l'abonnement, l'episode le
 * plus recent en vedette, puis tous les autres en liste numerotee, le grand
 * numero rythmant la page comme un numero de maillot. Les vignettes ne
 * chargent rien de YouTube : elles passent par notre serveur.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "La série",
  description: `${NOM_DU_SITE}, la série qui suit l'équipe D2 masculine du ${EQUIPE}, point par point.`,
};

const numero = (n: number | null) => (n === null ? "" : String(n).padStart(2, "0"));

export default async function PageSerie() {
  const { maintenant, episodes } = await serieComplete();
  const [vedette, ...autres] = episodes;

  return (
    <>
      <EnTete actif="/serie" />
      <main id="contenu" className="pb-24">
        <section className="colonne-large pt-16 pb-14 sm:pt-24">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">La série</p>
          <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">{NOM_DU_SITE}</h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
            La série qui suit l&apos;équipe D2 masculine du {EQUIPE}, match après match.
          </p>
          <div className="mt-8">
            <BoutonAbonnement />
          </div>
        </section>

        {!vedette ? (
          <p className="colonne-large text-lg text-[var(--color-craie-douce)]">La série arrive bientôt.</p>
        ) : (
          <>
            <section aria-label="Dernier épisode" className="colonne-large">
              <Link href={`/serie/${vedette.episode.slug}`} className="group grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
                <span className="relative block aspect-video overflow-hidden bg-[var(--color-nuit-surface)] lg:col-span-7">
                  <Image
                    src={miniatureYoutube(vedette.episode.youtubeId)}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover grayscale transition-[filter,scale] duration-[var(--duree-appuyee)] group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </span>
                <span className="block lg:col-span-5">
                  <span className="flex flex-wrap items-center gap-3">
                    {estNouveau(vedette.episode.publieLe, maintenant) ? <MarqueNouveau /> : null}
                    <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
                      Épisode {numero(vedette.episode.numero)}
                    </span>
                  </span>
                  <span className="titre-affiche mt-4 block text-5xl text-balance group-hover:text-[var(--color-jaune)] sm:text-6xl">
                    {vedette.episode.titre}
                  </span>
                  {vedette.episode.resume ? (
                    <span className="mt-4 block leading-relaxed text-[var(--color-craie-douce)]">{vedette.episode.resume}</span>
                  ) : null}
                  <span className="mt-5 flex flex-col gap-1">
                    {vedette.match ? <EtiquetteMatch match={vedette.match} maintenant={maintenant} /> : null}
                    <span className="text-sm text-[var(--color-craie-tenue)] first-letter:uppercase">
                      {dateLongue(vedette.episode.publieLe)}
                    </span>
                  </span>
                </span>
              </Link>
            </section>

            {autres.length > 0 ? (
              <section aria-labelledby="titre-episodes" className="colonne-large mt-24">
                <h2 id="titre-episodes" className="border-b-2 border-[var(--color-craie)] pb-2 text-xs font-semibold tracking-[0.2em] uppercase">
                  Tous les épisodes
                </h2>
                <ol>
                  {autres.map(({ episode, match }) => (
                    <li key={episode.id}>
                      <Link
                        href={`/serie/${episode.slug}`}
                        className="group grid grid-cols-[4rem_1fr] gap-4 border-b border-[var(--color-nuit-trait)] py-6 transition-colors duration-[80ms] hover:bg-[var(--color-nuit-surface)] sm:grid-cols-[7rem_1fr] sm:gap-8 sm:px-3"
                      >
                        <span aria-hidden="true" className="titre-affiche text-5xl text-[var(--color-craie-tenue)] group-hover:text-[var(--color-jaune)] sm:text-7xl">
                          {numero(episode.numero)}
                        </span>
                        <span className="min-w-0">
                          <span className="sr-only">Épisode {episode.numero} : </span>
                          <span className="titre-affiche block text-2xl text-balance sm:text-4xl">{episode.titre}</span>
                          {episode.resume ? (
                            <span className="mt-2 line-clamp-2 block max-w-[62ch] text-[var(--color-craie-douce)]">{episode.resume}</span>
                          ) : null}
                          <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                            {match ? <EtiquetteMatch match={match} maintenant={maintenant} /> : null}
                            <span className="text-sm text-[var(--color-craie-tenue)] first-letter:uppercase">
                              {dateLongue(episode.publieLe)}
                            </span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <p className="colonne-large mt-16 text-[var(--color-craie-douce)]">
              Pour ne manquer aucun épisode : <BoutonAbonnement discret />
            </p>
          </>
        )}
      </main>
      <PiedDePage saison={null} />
    </>
  );
}
