import Link from "next/link";
import type { Episode } from "@/lib/episodes";
import { CHAINE_YOUTUBE } from "@/lib/site";
import { lienYoutube } from "@/lib/youtube";
import { LecteurEpisode } from "../lecteur-episode";
import { MiniatureEpisode } from "../miniature-episode";

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
            <MiniatureEpisode youtubeId={episode.youtubeId} sizes="(min-width: 1024px) 58vw, 100vw" />
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
            <Link
              href="/serie"
              className="inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)]"
            >
              Toute la série
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Le repli de la serie, sans episode publie (fiche
 * fiches/accueil-porte-entree.md) : la chaine est connue, et la serie est le
 * premier but du site, donc le chapitre ne disparait plus. Un voyant
 * d'enregistrement, a l'ambre des LED du tableau, palpite trois fois puis
 * reste allume : le tournage continue, sans rien qui bouge pendant la lecture.
 */
export function BlocSerieInvitation() {
  if (!CHAINE_YOUTUBE) return null;
  return (
    <section aria-labelledby="titre-serie" data-apparait className="colonne-large py-24 sm:py-32">
      <div className="grid items-center gap-10 border-y-2 border-[var(--color-nuit-trait)] py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full bg-[var(--color-led)] motion-safe:animate-[pulse_1.2s_ease-in-out_3]"
            />
            La série
          </p>
          <h2 id="titre-serie" className="titre-affiche mt-3 text-5xl text-balance sm:text-7xl">
            La saison, épisode après épisode
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
            Les entraînements, les déplacements, les matchs : la série suit l&apos;équipe sur YouTube.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
          <a
            href={`${CHAINE_YOUTUBE}?sub_confirmation=1`}
            className="inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
          >
            S&apos;abonner à la série
          </a>
          <a
            href={CHAINE_YOUTUBE}
            className="inline-flex min-h-12 items-center border-2 border-[var(--color-craie-tenue)] px-6 font-semibold transition-colors duration-[80ms] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]"
          >
            Voir la chaîne
          </a>
        </div>
      </div>
    </section>
  );
}
