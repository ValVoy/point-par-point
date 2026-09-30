import Image from "next/image";
import Link from "next/link";
import type { Episode } from "@/lib/episodes";
import { dateLongue, heure } from "@/lib/dates";
import type { Rencontre } from "@/lib/rencontres";
import { miniatureYoutube } from "@/lib/youtube";
import { lienItineraire } from "../actions-match";
import { LecteurEpisode } from "../lecteur-episode";

/**
 * Les blocs de la page d'un match (fiche fiches/matchs.md), chacun absent
 * quand il n'a rien a dire : jamais de case vide, jamais de zero invente.
 */

const etiquette = "text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase";

/** Reporte, annule, score pas encore saisi : l'etat en toutes lettres. */
export function BandeauEtat({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="border-l-4 border-[var(--color-jaune)] bg-[var(--color-nuit-surface)] px-5 py-4">
      <p className="titre-affiche text-3xl">{titre}</p>
      <p className="mt-1 text-[var(--color-craie-douce)]">{texte}</p>
    </div>
  );
}

export function BlocSalle({ match }: { match: Rencontre }) {
  if (!match.salleNom && !match.salleAdresse) return null;
  const itineraire = lienItineraire(match);
  return (
    <section aria-labelledby="titre-salle">
      <h2 id="titre-salle" className={etiquette}>
        La salle
      </h2>
      {match.salleNom ? <p className="titre-affiche mt-3 text-3xl">{match.salleNom}</p> : null}
      {match.salleAdresse ? <p className="mt-1 text-[var(--color-craie-douce)]">{match.salleAdresse}</p> : null}
      {itineraire ? (
        <a
          href={itineraire}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-12 items-center border-2 border-[var(--color-craie-tenue)] px-5 font-semibold transition-colors duration-[80ms] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]"
        >
          Itinéraire
          <span className="sr-only"> (ouvre Google Maps)</span>
        </a>
      ) : null}
    </section>
  );
}

export function BlocEpisode({ episode }: { episode: Episode }) {
  return (
    <section aria-labelledby="titre-episode" className="grid items-end gap-6 lg:grid-cols-12">
      <div className="relative aspect-video overflow-hidden bg-[var(--color-nuit-surface)] lg:col-span-7">
        <LecteurEpisode youtubeId={episode.youtubeId} titre={episode.titre}>
          <Image
            src={miniatureYoutube(episode.youtubeId)}
            alt=""
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover grayscale transition-[filter] duration-[var(--duree)] group-hover:grayscale-0"
          />
        </LecteurEpisode>
      </div>
      <div className="lg:col-span-5">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
          Le match dans la série{episode.numero ? ` · épisode ${episode.numero}` : ""}
        </p>
        <h2 id="titre-episode" className="titre-affiche mt-3 text-4xl text-balance">
          {episode.titre}
        </h2>
        {episode.resume ? <p className="mt-4 leading-relaxed text-[var(--color-craie-douce)]">{episode.resume}</p> : null}
      </div>
    </section>
  );
}

export function BlocCommentaire({ texte }: { texte: string | null }) {
  if (!texte?.trim()) return null;
  return (
    <section aria-labelledby="titre-commentaire">
      <h2 id="titre-commentaire" className={etiquette}>
        Après le match
      </h2>
      <p className="colonne-lecture mt-4 ml-0 text-lg leading-relaxed whitespace-pre-line">{texte}</p>
    </section>
  );
}

type Voisin = { slug: string; adversaire: string; aDomicile: boolean; joueLe: Date } | null;

function LienVoisin({ voisin, sens }: { voisin: Voisin; sens: "précédent" | "suivant" }) {
  if (!voisin) return <span />;
  return (
    <Link
      href={`/matchs/${voisin.slug}`}
      className={`group block min-h-16 py-4 ${sens === "suivant" ? "text-right" : ""}`}
    >
      <span className={etiquette}>{sens === "précédent" ? "← Match précédent" : "Match suivant →"}</span>
      <span className="titre-affiche mt-2 block text-2xl group-hover:text-[var(--color-jaune)]">
        {voisin.aDomicile ? "Contre" : "Chez"} {voisin.adversaire}
      </span>
      <span className="block text-sm text-[var(--color-craie-douce)] first-letter:uppercase">
        {dateLongue(voisin.joueLe)}, {heure(voisin.joueLe)}
      </span>
    </Link>
  );
}

export function Voisins({ precedent, suivant }: { precedent: Voisin; suivant: Voisin }) {
  return (
    <nav aria-label="Autres matchs" className="grid gap-4 border-t border-[var(--color-nuit-trait)] sm:grid-cols-2">
      <LienVoisin voisin={precedent} sens="précédent" />
      <LienVoisin voisin={suivant} sens="suivant" />
    </nav>
  );
}
