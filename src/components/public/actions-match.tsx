import { lienGoogleAgenda } from "@/lib/agenda";
import type { Rencontre } from "@/lib/rencontres";
import { EQUIPE } from "@/lib/site";

/**
 * Ce qu'on fait d'un match a venir, le deuxieme but du site : venir le voir.
 * Ajouter a l'agenda (fichier .ics servi par /agenda/<slug>), l'itineraire
 * vers la salle, et Google Agenda en secours pour les navigateurs integres
 * qui ouvrent mal un fichier. Partage par l'accueil, le calendrier et la page
 * d'un match.
 */

export function lienItineraire(match: Rencontre) {
  if (match.salleLatitude !== null && match.salleLongitude !== null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${match.salleLatitude},${match.salleLongitude}`;
  }
  // Jamais d'itineraire vers un nom seul (arbitrage du 02-10-2026, audit D25) :
  // « Palais des Sports » existe dans cent communes, Maps choisirait au hasard.
  if (!match.salleAdresse) return null;
  const adresse = [match.salleNom, match.salleAdresse].filter(Boolean).join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adresse)}`;
}

export function titreMatch(match: Pick<Rencontre, "aDomicile" | "adversaire">) {
  return match.aDomicile ? `${EQUIPE} - ${match.adversaire}` : `${match.adversaire} - ${EQUIPE}`;
}

const bouton =
  "inline-flex min-h-12 items-center justify-center border-2 px-5 font-semibold whitespace-nowrap transition-colors duration-[80ms]";

/** `sansItineraire` : quand la page offre deja l'itineraire vers la meme salle (Ou nous voir). */
export function ActionsMatch({ match, sansItineraire = false }: { match: Rencontre; sansItineraire?: boolean }) {
  const itineraire = sansItineraire ? null : lienItineraire(match);
  const google = lienGoogleAgenda({
    uid: `match-${match.id}`,
    debut: match.joueLe,
    journeeEntiere: !match.heureConnue,
    titre: titreMatch(match),
    lieu: [match.salleNom, match.salleAdresse].filter(Boolean).join(", ") || null,
    horodatage: match.joueLe,
  });
  return (
    <div className="mt-4">
      <div className="grid gap-3 sm:flex">
        <a
          href={`/agenda/${match.slug}`}
          className={`${bouton} border-[var(--color-jaune)] bg-[var(--color-jaune)] text-[var(--color-nuit)] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)]`}
        >
          Ajouter à l&apos;agenda
        </a>
        {itineraire ? (
          <a
            href={itineraire}
            target="_blank"
            rel="noopener noreferrer"
            className={`${bouton} border-[var(--color-craie-tenue)] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]`}
          >
            Itinéraire
            <span className="sr-only"> (ouvre Google Maps)</span>
          </a>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-[var(--color-craie-douce)]">
        Sur Google Agenda ?{" "}
        <a
          href={google}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center font-semibold text-[var(--color-craie)] underline underline-offset-4"
        >
          L&apos;ajouter directement
          <span className="sr-only"> (ouvre Google Agenda dans un nouvel onglet)</span>
        </a>
      </p>
    </div>
  );
}
