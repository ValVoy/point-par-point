import type { Metadata } from "next";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { ImageOuMotif } from "@/components/public/image-ou-motif";
import { TitreChapitre } from "@/components/public/titre-chapitre";
import { Volets } from "@/components/public/volets";
import { actualitesPubliees } from "@/lib/actualites-publiques";
import { dateLongue } from "@/lib/dates";
import { urlPhoto } from "@/lib/effectif-public";
import { EQUIPE } from "@/lib/site";

/**
 * Rendue a chaque visite : une actualite publiee depuis l'administration se
 * voit tout de suite (le cache des lectures se vide a chaque ecriture).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Les actualités",
  description: `Les nouvelles de l'équipe D2 masculine du ${EQUIPE}.`,
};

function Publie({ date, className = "" }: { date: Date | null; className?: string }) {
  if (!date) return null;
  return (
    <span className={`etiquette block ${className}`}>
      <time dateTime={date.toISOString()}>{dateLongue(date)}</time>
    </span>
  );
}

/**
 * Les actualites (fiche refonte, section 8) : la une en bandeau, titre pose sur
 * l'image comme le dernier episode de la Serie, puis les precedentes en cartes
 * a image, le motif du maillot tenant lieu de photo tant qu'il n'y en a pas.
 */
export default async function PageActualites() {
  const [une, ...autres] = await actualitesPubliees();

  return (
    <>
      <EnTete actif="/actualites" />
      <main id="contenu" className="min-h-[70svh] pb-[var(--air-chapitre)]">
        <Volets>
          <section className="colonne-large pt-16 sm:pt-24">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
              <div className="min-w-0">
                <p className="etiquette text-[var(--color-turquoise)]">{EQUIPE}</p>
                <h1 className="titre-affiche titre-page mt-4">Les actualités</h1>
              </div>
              {une ? (
                <p className="pb-2 xl:text-right">
                  <span className="titre-affiche chiffre-geant block">{String(autres.length + 1).padStart(2, "0")}</span>
                  <span className="etiquette mt-2 block text-[var(--color-craie-douce)]">article{autres.length > 0 ? "s" : ""} publié{autres.length > 0 ? "s" : ""}</span>
                </p>
              ) : null}
            </div>
            <p className="chapeau mt-[var(--titre-contenu)] max-w-[40ch] text-[var(--color-craie-douce)]">
              Les nouvelles de l&apos;équipe, entre deux matchs et deux épisodes.
            </p>
          </section>

          {!une ? (
            <p className="colonne-large suite chapeau text-[var(--color-craie-douce)]">
              Pas encore d&apos;actualité. En attendant :{" "}
              <Link href="/matchs" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
                les matchs
              </Link>{" "}
              et{" "}
              <Link href="/serie" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
                la série
              </Link>
              .
            </p>
          ) : (
            <>
              <section aria-label="À la une" className="colonne-large suite">
                <Link href={`/actualites/${une.slug}`} className="group block">
                  <span data-volet className="relative block">
                    <ImageOuMotif src={urlPhoto(une.imageCle)} sizes="(min-width: 1344px) 84rem, 100vw" prioritaire survol className="aspect-video lg:aspect-[21/9]" />
                    <span aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-t from-[var(--color-nuit)] from-15% via-[var(--color-nuit)]/70 via-45% to-transparent lg:block" />
                    <span className="absolute inset-x-0 bottom-0 hidden p-8 lg:block">
                      <Publie date={une.publieLe} className="text-[var(--color-craie)]" />
                      <h2 className="titre-affiche titre-chapitre mt-3 max-w-[20ch] text-balance group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
                        {une.titre}
                      </h2>
                      {/* Le chapo dans le bandeau, sous le titre : un seul bloc (critique a froid). */}
                      {une.chapo ? <span className="chapeau mt-4 block max-w-[46ch] text-[var(--color-craie-douce)]">{une.chapo}</span> : null}
                    </span>
                  </span>
                  <span className="mt-5 block lg:hidden">
                    <Publie date={une.publieLe} className="text-[var(--color-craie-douce)]" />
                    <h2 className="titre-affiche titre-chapitre mt-3 text-balance group-hover:text-[var(--color-jaune)]">{une.titre}</h2>
                    {une.chapo ? <span className="chapeau mt-5 block max-w-[46ch] text-[var(--color-craie-douce)]">{une.chapo}</span> : null}
                  </span>
                </Link>
              </section>

              {autres.length > 0 ? (
                <section aria-labelledby="titre-autres" className="colonne-large chapitre">
                  <TitreChapitre id="titre-autres">Précédemment</TitreChapitre>
                  <ul className="mt-[var(--titre-contenu)] grid gap-x-[var(--gouttiere)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {autres.map((a) => (
                      <li key={a.id}>
                        <Link href={`/actualites/${a.slug}`} className="group block">
                          <ImageOuMotif src={urlPhoto(a.imageCle)} sizes="(min-width: 1024px) 28rem, (min-width: 640px) 50vw, 100vw" survol className="aspect-video" />
                          <Publie date={a.publieLe} className="mt-4 text-[var(--color-craie-douce)]" />
                          <h3 className="titre-affiche titre-carte mt-2 text-balance group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
                            {a.titre}
                          </h3>
                          {a.chapo ? <span className="corps mt-2 line-clamp-3 block text-[var(--color-craie-douce)]">{a.chapo}</span> : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
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
