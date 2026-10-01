import Link from "next/link";
import { PastilleResultat } from "@/components/pastille-resultat";
import { statutPublic, type StatutPublic } from "@/lib/calendrier";
import { dateLongue } from "@/lib/dates";
import { heureDuMatch } from "@/lib/horaire";
import type { RencontreAvecSets } from "@/lib/rencontres";

/**
 * Une ligne du calendrier (fiche fiches/matchs.md) : le jour en grand,
 * l'adversaire, et a droite un seul emplacement qui porte l'heure avant le
 * match, le score apres, ou l'etat en toutes lettres. Mate, en chiffres
 * d'affiche : la lumiere est reservee aux tableaux. Toute la ligne mene a la
 * page du match, et son nom accessible dit tout d'une traite.
 *
 * Dans une liste, notre score vient toujours en premier (decision du
 * 30-09-2026) : « Chez X 0-3 » se lit d'un coup comme une defaite. Les
 * tableaux LED, eux, gardent l'ordre du gymnase, locaux a gauche.
 *
 * Chaque ligne porte sa marque Domicile ou Exterieur (demande du 01-10-2026),
 * en tete de la ligne d'informations : on repere d'un coup d'oeil les matchs
 * ou venir. Domicile en turquoise plein, la seule couleur vive ; Exterieur au
 * trait, plus discret.
 */

function MarqueLieu({ domicile }: { domicile: boolean }) {
  return domicile ? (
    <span className="bg-[var(--color-turquoise)] px-1.5 py-0.5 font-semibold tracking-[0.15em] text-[var(--color-nuit)] uppercase">
      Domicile
    </span>
  ) : (
    <span className="border border-[var(--color-craie-tenue)] px-1.5 py-px font-semibold tracking-[0.15em] uppercase">
      Extérieur
    </span>
  );
}

const FUSEAU = "Europe/Paris";
const jour = new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: FUSEAU });
const jourSemaine = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: FUSEAU });

const ETATS: Partial<Record<StatutPublic, string>> = {
  en_cours: "En cours",
  score_a_venir: "Score à venir",
  reportee: "Reporté",
  annulee: "Annulé",
};

function Emplacement({ match, statut }: { match: RencontreAvecSets; statut: StatutPublic }) {
  if (statut === "a_venir") {
    const h = heureDuMatch(match);
    return h ? (
      <span className="titre-affiche text-2xl normal-case sm:text-3xl">{h}</span>
    ) : (
      <span className="text-right text-xs leading-snug font-semibold tracking-[0.15em] text-[var(--color-craie-douce)] uppercase">
        Horaire
        <br />à confirmer
      </span>
    );
  }
  if (statut === "jouee" && match.setsNous !== null && match.setsEux !== null) {
    const victoire = match.setsNous > match.setsEux;
    return (
      <span className="flex items-center gap-3">
        <span className={`titre-affiche text-3xl sm:text-4xl ${victoire ? "" : "font-normal text-[var(--color-craie-douce)]"}`}>
          {match.setsNous}-{match.setsEux}
        </span>
        <PastilleResultat victoire={victoire} className="text-base" />
      </span>
    );
  }
  return (
    <span
      className={`text-xs font-semibold tracking-[0.2em] uppercase ${
        statut === "en_cours" ? "text-[var(--color-jaune)]" : "text-[var(--color-craie-douce)]"
      }`}
    >
      {ETATS[statut]}
    </span>
  );
}

function nomAccessible(match: RencontreAvecSets, statut: StatutPublic, raconte: boolean) {
  const qui = `${match.aDomicile ? "à domicile contre" : "à l'extérieur, chez"} ${match.adversaire}`;
  const h = heureDuMatch(match);
  let quoi = h ? `à ${h}` : "horaire à confirmer";
  if (statut === "jouee" && match.setsNous !== null && match.setsEux !== null) {
    quoi = `${match.setsNous > match.setsEux ? "victoire" : "défaite"} ${match.setsNous} sets à ${match.setsEux}`;
  } else if (ETATS[statut]) {
    quoi = ETATS[statut]!.toLowerCase();
  }
  return `${dateLongue(match.joueLe)}, ${qui}, ${quoi}${raconte ? ", raconté dans la série" : ""}`;
}

export function LigneCalendrier({
  match,
  maintenant,
  raconte,
}: {
  match: RencontreAvecSets;
  maintenant: Date;
  raconte: boolean;
}) {
  const statut = statutPublic(match, maintenant);
  const barre = statut === "annulee" || statut === "reportee";
  return (
    <li>
      <Link
        href={`/matchs/${match.slug}`}
        aria-label={nomAccessible(match, statut, raconte)}
        className="group grid min-h-16 grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-[var(--color-nuit-trait)] py-4 transition-colors duration-[80ms] hover:bg-[var(--color-nuit-surface)] sm:grid-cols-[5rem_1fr_auto] sm:gap-6 sm:px-3"
      >
        <span className={`text-center ${barre ? "line-through decoration-2" : ""}`}>
          <span className="titre-affiche block text-4xl sm:text-5xl">{jour.format(match.joueLe)}</span>
          <span className="block text-xs text-[var(--color-craie-douce)]">{jourSemaine.format(match.joueLe)}</span>
        </span>
        <span className="min-w-0">
          <span className="titre-affiche block text-xl text-balance sm:text-3xl">
            {match.aDomicile ? "Contre" : "Chez"} {match.adversaire}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-craie-douce)]">
            <MarqueLieu domicile={match.aDomicile} />
            {match.competition ? <span className="truncate">{match.competition}</span> : null}
            {raconte ? (
              <span className="font-semibold tracking-[0.15em] text-[var(--color-turquoise)] uppercase">Épisode</span>
            ) : null}
          </span>
        </span>
        <Emplacement match={match} statut={statut} />
      </Link>
    </li>
  );
}
