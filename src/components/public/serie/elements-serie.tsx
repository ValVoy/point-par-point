import { statutPublic } from "@/lib/calendrier";
import type { MatchRaconte } from "@/lib/serie";
import { CHAINE_YOUTUBE } from "@/lib/site";

/**
 * Les petites pieces de la serie (fiche fiches/serie.md), partagees par la
 * liste et la page d'un episode.
 */

/**
 * L'etiquette du match raconte, en capitales espacees : « Contre X · 3-1 ·
 * Victoire ». Notre score d'abord, comme dans toutes les listes du site. Un
 * match pas encore score dit son etat, jamais un 0-0.
 */
export function EtiquetteMatch({ match, maintenant }: { match: MatchRaconte; maintenant: Date }) {
  const statut = statutPublic(match, maintenant);
  const qui = `${match.aDomicile ? "Contre" : "Chez"} ${match.adversaire}`;
  let quoi: string;
  if (statut === "jouee" && match.setsNous !== null && match.setsEux !== null) {
    quoi = `${match.setsNous}-${match.setsEux} · ${match.setsNous > match.setsEux ? "Victoire" : "Défaite"}`;
  } else {
    quoi = {
      a_venir: "À venir",
      en_cours: "En cours",
      score_a_venir: "Score à venir",
      reportee: "Reporté",
      annulee: "Annulé",
      jouee: "Joué",
    }[statut];
  }
  return (
    <span className="etiquette text-[var(--color-craie-douce)]">
      {qui} · <span className="whitespace-nowrap">{quoi}</span>
    </span>
  );
}


/**
 * Le bouton d'abonnement, absent tant que la chaine n'est pas renseignee. Un
 * seul appel par page, toujours le meme (arbitrage du 02-10-2026, audit W16).
 */
export const PHRASE_ABONNEMENT = "Abonnez-vous pour ne manquer aucun épisode.";

export function BoutonAbonnement() {
  if (!CHAINE_YOUTUBE) return null;
  const lien = `${CHAINE_YOUTUBE}?sub_confirmation=1`;
  return (
    <a
      href={lien}
      className="inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
    >
      S&apos;abonner à la série
    </a>
  );
}
