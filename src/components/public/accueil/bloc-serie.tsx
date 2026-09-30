import Image from "next/image";
import type { Episode } from "@/lib/episodes";
import { CHAINE_YOUTUBE } from "@/lib/site";
import { lienYoutube, miniatureYoutube } from "@/lib/youtube";
import { LecteurEpisode } from "../lecteur-episode";

/**
 * La serie, premier but du site : qu'on regarde, puis qu'on s'abonne (fiche
 * fiches/accueil.md). Une grille editoriale, l'image a gauche et le texte a
 * droite, plutot qu'une pleine largeur : la miniature fiable de YouTube ne
 * fait que 480 pixels, elle serait floue en grand.
 *
 * La miniature passe par l'optimiseur de Next, donc par notre serveur : le
 * navigateur du visiteur ne contacte pas YouTube avant d'avoir clique. Elle
 * passe en niveaux de gris sur la nuit, et retrouve ses couleurs au survol :
 * pas d'aplat turquoise, qui salissait l'image (critique du 30-09-2026).
 */
export function BlocSerie({ episode }: { episode: Episode }) {
  const titre = episode.titre;
  return (
    <section aria-labelledby="titre-serie" data-apparait className="colonne-large py-24 sm:py-32">
      <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="relative aspect-video overflow-hidden bg-[var(--color-nuit-surface)] lg:col-span-7">
          <LecteurEpisode youtubeId={episode.youtubeId} titre={titre}>
            <Image
              src={miniatureYoutube(episode.youtubeId)}
              alt=""
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover grayscale transition-[filter] duration-[var(--duree)] group-hover:grayscale-0"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[var(--color-nuit)] opacity-25 transition-opacity duration-[var(--duree)] group-hover:opacity-0"
            />
          </LecteurEpisode>
        </div>

        <div className="lg:col-span-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
            La série{episode.numero ? ` · épisode ${episode.numero}` : ""}
          </p>
          <h2 id="titre-serie" className="titre-affiche mt-3 text-5xl text-balance sm:text-6xl">
            {titre}
          </h2>
          {episode.resume ? (
            <p className="mt-5 max-w-[46ch] leading-relaxed text-[var(--color-craie-douce)]">{episode.resume}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {CHAINE_YOUTUBE ? (
              <a
                href={`${CHAINE_YOUTUBE}?sub_confirmation=1`}
                className="inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
              >
                S&apos;abonner à la série
              </a>
            ) : null}
            <a
              href={lienYoutube(episode.youtubeId)}
              className={
                CHAINE_YOUTUBE
                  ? "inline-flex min-h-12 items-center border-2 border-[var(--color-craie-tenue)] px-6 font-semibold transition-colors duration-[80ms] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]"
                  : "inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
              }
            >
              Voir sur YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
