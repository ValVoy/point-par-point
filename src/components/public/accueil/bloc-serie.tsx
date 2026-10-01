import Link from "next/link";
import type { Episode } from "@/lib/episodes";
import { CHAINE_YOUTUBE } from "@/lib/site";
import { titreSansNumero } from "@/lib/titre-episode";
import { BandeauEpisode } from "../serie/bandeau-episode";

/**
 * La serie, premier but du site : qu'on regarde, puis qu'on s'abonne (fiches
 * accueil.md et refonte-respiration.md). Le dernier episode en bandeau sur
 * toute la colonne large, le titre pose sur la vignette, au lieu de l'ancien
 * moitie-moitie. La facade ne charge YouTube qu'au clic ; la miniature passe
 * par notre serveur, en niveaux de gris, et reprend ses couleurs au survol.
 */
export function BlocSerie({ episode }: { episode: Episode }) {
  const titre = titreSansNumero(episode);
  return (
    <section aria-labelledby="titre-serie" data-apparait className="colonne-large chapitre">
      <h2 id="titre-serie" className="sr-only">
        La série : {titre}
      </h2>
      <BandeauEpisode
        lecteur
        youtubeId={episode.youtubeId}
        titre={titre}
        etiquette={`La série${episode.numero ? ` · épisode ${String(episode.numero).padStart(2, "0")}` : ""}`}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-12">
        {episode.resume ? <p className="chapeau max-w-[46ch] text-[var(--color-craie-douce)]">{episode.resume}</p> : <span />}
        <div className="flex flex-wrap gap-3 lg:justify-end">
          {CHAINE_YOUTUBE ? (
            <a
              href={`${CHAINE_YOUTUBE}?sub_confirmation=1`}
              className="inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
            >
              S&apos;abonner à la série
            </a>
          ) : null}
          <Link
            href="/serie"
            className="inline-flex min-h-12 items-center border-2 border-[var(--color-craie-tenue)] px-6 font-semibold transition-colors duration-[80ms] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]"
          >
            Toute la série
          </Link>
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
