import Link from "next/link";
import { dateLongue } from "@/lib/dates";
import type { Episode } from "@/lib/episodes";
import type { MatchRaconte } from "@/lib/serie";
import { titreSansNumero } from "@/lib/titre-episode";
import { MiniatureEpisode } from "../miniature-episode";
import { EtiquetteMatch } from "./elements-serie";

/**
 * Un episode de la liste (fiche fiches/refonte-respiration.md, veille 19.1) :
 * une rangee par episode, la vignette en grand a gauche (40 % de la colonne),
 * le numero, le titre et le resume a droite. Au telephone, une carte empilee.
 * Chaque episode a desormais sa vignette : la liste n'est plus un tableau de
 * texte. La vignette se decouvre par le volet (`Volets` sur la page).
 */

export const libelleEpisode = (n: number | null) => (n === null ? "Avant la série" : `Épisode ${String(n).padStart(2, "0")}`);

export function LigneEpisode({
  episode,
  match,
  maintenant,
}: {
  episode: Episode;
  match: MatchRaconte | null;
  maintenant: Date;
}) {
  const titre = titreSansNumero(episode);
  const date = episode.publieLe ? `Publié le ${dateLongue(episode.publieLe)}` : null;
  return (
    <li className="py-[calc(var(--air-suite)/2)] first:pt-0 last:pb-0">
      <Link
        href={`/serie/${episode.slug}`}
        aria-label={[libelleEpisode(episode.numero), titre, date].filter(Boolean).join(", ")}
        className="group grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-12"
      >
        <span data-volet className="relative block aspect-video overflow-hidden bg-[var(--color-nuit-surface)]">
          <MiniatureEpisode youtubeId={episode.youtubeId} sizes="(min-width: 1024px) 34rem, 100vw" />
        </span>
        <div className="min-w-0">
          <span className="etiquette text-[var(--color-turquoise)]">{libelleEpisode(episode.numero)}</span>
          <h3 className="titre-affiche titre-carte mt-3 text-balance group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
            {titre}
          </h3>
          {episode.resume ? (
            <span className="corps mt-4 line-clamp-3 block max-w-[48ch] text-[var(--color-craie-douce)]">{episode.resume}</span>
          ) : null}
          <span className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
            {match ? <EtiquetteMatch match={match} maintenant={maintenant} /> : null}
            {date ? <span className="text-sm text-[var(--color-craie-tenue)]">{date}</span> : null}
          </span>
        </div>
      </Link>
    </li>
  );
}
