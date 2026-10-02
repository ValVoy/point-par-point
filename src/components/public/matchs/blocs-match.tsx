import Link from "next/link";
import type { Episode } from "@/lib/episodes";
import { dateLongue } from "@/lib/dates";
import { heureDuMatch } from "@/lib/horaire";
import type { Rencontre } from "@/lib/rencontres";
import { lienItineraire } from "../actions-match";
import { BandeauEpisode } from "../serie/bandeau-episode";
import { titreSansNumero } from "@/lib/titre-episode";

/**
 * Les blocs de la page d'un match (fiches matchs.md et refonte-respiration.md),
 * chacun absent quand il n'a rien a dire : jamais de case vide, jamais de zero
 * invente. L'episode passe en bandeau, comme sur la page Serie.
 */

const etiquette = "etiquette text-[var(--color-craie-douce)]";

/** Reporte, annule, score pas encore saisi : l'etat en toutes lettres. */
export function BandeauEtat({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="border-l-4 border-[var(--color-jaune)] bg-[var(--color-nuit-surface)] p-8">
      <p className="titre-affiche titre-carte">{titre}</p>
      <p className="corps mt-2 text-[var(--color-craie-douce)]">{texte}</p>
    </div>
  );
}

export function BlocSalle({ match, avecItineraire = true }: { match: Rencontre; avecItineraire?: boolean }) {
  if (!match.salleNom && !match.salleAdresse) return null;
  const itineraire = avecItineraire ? lienItineraire(match) : null;
  return (
    <section aria-labelledby="titre-salle">
      <h2 id="titre-salle" className={etiquette}>
        La salle
      </h2>
      {match.salleNom ? <p className="titre-affiche titre-carte mt-3">{match.salleNom}</p> : null}
      {match.salleAdresse ? (
        <p className="corps mt-2 text-[var(--color-craie-douce)]">{match.salleAdresse}</p>
      ) : match.salleLatitude === null ? (
        // Un nom seul ne situe pas la salle (audit D25) : on le dit plutot que d'envoyer au hasard.
        <p className="corps mt-2 text-[var(--color-craie-tenue)]">Adresse à confirmer</p>
      ) : null}
      {match.aDomicile ? (
        <p className="mt-2 text-sm">
          <Link href="/ou-nous-voir" className="font-semibold text-[var(--color-craie-douce)] underline underline-offset-4 hover:text-[var(--color-craie)]">
            Venir à la salle
          </Link>
        </p>
      ) : null}
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

export function BlocEpisode({ episode, prioritaire = false }: { episode: Episode; prioritaire?: boolean }) {
  const titre = titreSansNumero(episode);
  return (
    <section aria-labelledby="titre-episode">
      <h2 id="titre-episode" className="etiquette text-[var(--color-turquoise)]">
        Le match dans la série<span className="sr-only"> : {titre}</span>
      </h2>
      <div className="mt-4">
        <BandeauEpisode
          lecteur
          youtubeId={episode.youtubeId}
          titre={titre}
          etiquette={episode.numero ? `Épisode ${String(episode.numero).padStart(2, "0")}` : "Avant la série"}
          prioritaire={prioritaire}
        />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
        {episode.resume ? <p className="chapeau max-w-[46ch] text-[var(--color-craie-douce)]">{episode.resume}</p> : <span />}
        <Link
          href={`/serie/${episode.slug}`}
          className="inline-flex min-h-12 items-center self-start font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)] lg:justify-self-end"
        >
          Voir l&apos;épisode
        </Link>
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
      <p className="chapeau mt-4 max-w-[var(--largeur-lecture)] whitespace-pre-line">{texte}</p>
    </section>
  );
}

type Voisin = { slug: string; adversaire: string; aDomicile: boolean; joueLe: Date; heureConnue: boolean } | null;

function LienVoisin({ voisin, sens }: { voisin: Voisin; sens: "précédent" | "suivant" }) {
  if (!voisin) return <span />;
  return (
    <Link
      href={`/matchs/${voisin.slug}`}
      className={`group block min-h-16 py-6 ${sens === "suivant" ? "text-right" : ""}`}
    >
      <span className={etiquette}>{sens === "précédent" ? "← Match précédent" : "Match suivant →"}</span>
      <span className="titre-affiche titre-carte mt-3 block group-hover:text-[var(--color-jaune)]">
        {voisin.aDomicile ? "Contre" : "Chez"} {voisin.adversaire}
      </span>
      <span className="mt-2 block text-sm text-[var(--color-craie-douce)] first-letter:uppercase">
        {dateLongue(voisin.joueLe)}, {heureDuMatch(voisin) ?? "horaire à confirmer"}
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
