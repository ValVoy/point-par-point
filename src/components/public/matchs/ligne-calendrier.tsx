import Link from "next/link";
import { PastilleResultat } from "@/components/pastille-resultat";
import { statutPublic, type StatutPublic } from "@/lib/calendrier";
import { dateLongue } from "@/lib/dates";
import { heureDuMatch } from "@/lib/horaire";
import type { RencontreAvecSets } from "@/lib/rencontres";
import { ChiffresRoulants } from "../accueil/chiffres-roulants";

/**
 * Une ligne du calendrier (fiches matchs.md et refonte-respiration.md, veille
 * 19.3) : trois blocs seulement. Le jour en chiffres de tableau, qui roulent a
 * l'entree du mois ; l'adversaire en grand, avec en sur-titre la marque de lieu
 * et la competition ; et a droite une seule case, qui porte l'heure avant le
 * match (ou « horaire a confirmer »), le score apres, avec les sets en petit.
 *
 * A domicile, la ligne s'eclaire et porte un filet turquoise a gauche : on
 * repere d'un coup d'oeil les matchs ou venir (Racing 92). Notre score vient
 * toujours en premier dans une liste (decision du 30-09-2026) ; les tableaux
 * LED, eux, gardent l'ordre du gymnase. Toute la ligne mene a la page du
 * match, et son nom accessible dit tout d'une traite, competition et sets
 * compris. Au telephone, la case passe sous l'adversaire, qui garde toute la
 * largeur (critique du 01-10-2026).
 */

const FUSEAU = "Europe/Paris";
const jour = new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: FUSEAU });
const jourSemaine = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: FUSEAU });

const ETATS: Partial<Record<StatutPublic, string>> = {
  en_cours: "En cours",
  score_a_venir: "Score à venir",
  reportee: "Reporté",
  annulee: "Annulé",
};

function MarqueLieu({ domicile }: { domicile: boolean }) {
  return domicile ? (
    <span className="bg-[var(--color-turquoise)] px-1.5 py-0.5 text-[var(--color-nuit)]">Domicile</span>
  ) : (
    <span className="border border-[var(--color-craie-tenue)] px-1.5 py-px">Extérieur</span>
  );
}

function setsJoues(sets: RencontreAvecSets["sets"]) {
  return [...sets].sort((a, b) => a.numero - b.numero).filter((s) => s.pointsNous !== null && s.pointsEux !== null);
}

/** Les sets en petit sous le score : gagnes en clair, perdus attenues. Dits en texte par le nom accessible. */
function Sets({ sets }: { sets: RencontreAvecSets["sets"] }) {
  const joues = setsJoues(sets);
  if (joues.length === 0) return null;
  return (
    <span aria-hidden="true" className="flex gap-2 text-sm tabular-nums sm:mt-2 sm:justify-end">
      {joues.map((s) => (
        <span
          key={s.id}
          className={(s.pointsNous ?? 0) > (s.pointsEux ?? 0) ? "font-semibold text-[var(--color-craie)]" : "text-[var(--color-craie-tenue)]"}
        >
          {s.pointsNous}-{s.pointsEux}
        </span>
      ))}
    </span>
  );
}

function Case({ match, statut }: { match: RencontreAvecSets; statut: StatutPublic }) {
  if (statut === "a_venir") {
    const h = heureDuMatch(match);
    return h ? (
      <span className="titre-affiche titre-carte normal-case">{h}</span>
    ) : (
      <span className="etiquette leading-snug text-[var(--color-turquoise)] sm:text-right">
        Horaire
        <br className="max-sm:hidden" /> à confirmer
      </span>
    );
  }
  if (statut === "jouee" && match.setsNous !== null && match.setsEux !== null) {
    const victoire = match.setsNous > match.setsEux;
    return (
      <span className="flex flex-wrap items-center gap-x-5 sm:flex-col sm:items-end">
        <span className="flex items-center gap-3">
          <span className={`titre-affiche text-4xl sm:text-5xl ${victoire ? "" : "font-normal text-[var(--color-craie-douce)]"}`}>
            {match.setsNous}-{match.setsEux}
          </span>
          <PastilleResultat victoire={victoire} className="text-lg" />
        </span>
        <Sets sets={match.sets} />
      </span>
    );
  }
  return (
    <span className={`etiquette ${statut === "en_cours" ? "text-[var(--color-jaune)]" : "text-[var(--color-craie-douce)]"}`}>
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
    const detail = setsJoues(match.sets).map((s) => `${s.pointsNous}-${s.pointsEux}`);
    if (detail.length > 0) quoi += ` (${detail.join(", ")})`;
  } else if (ETATS[statut]) {
    quoi = ETATS[statut]!.toLowerCase();
  }
  return [dateLongue(match.joueLe), qui, quoi, match.competition, raconte ? "raconté dans la série" : null]
    .filter(Boolean)
    .join(", ");
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
        className={`group grid min-h-24 grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-l-4 py-4 pr-3 pl-3 transition-colors duration-[80ms] sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:gap-x-8 sm:py-5 sm:pr-6 ${
          match.aDomicile
            ? "border-[var(--color-turquoise)] bg-[var(--color-nuit-surface)] hover:bg-[var(--color-nuit-releve)]"
            : "border-transparent hover:bg-[var(--color-nuit-surface)]"
        }`}
      >
        {/* Les colonnes de chiffres ne se copient pas : le jour est dit par le nom accessible. */}
        <span className={`row-span-2 self-start text-center select-none sm:row-span-1 sm:self-center ${barre ? "line-through decoration-2" : ""}`} data-nosnippet>
          <span className="titre-affiche block text-5xl">
            <ChiffresRoulants valeur={Number(jour.format(match.joueLe))} />
          </span>
          <span className="etiquette mt-1 block text-[var(--color-craie-douce)]">{jourSemaine.format(match.joueLe)}</span>
        </span>
        <div className="min-w-0">
          <span className="etiquette flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--color-craie-douce)]">
            <MarqueLieu domicile={match.aDomicile} />
            {/* Identique sur toutes les lignes : au telephone, elle cede la place (le nom accessible la dit). */}
            {match.competition ? <span className="max-sm:hidden">{match.competition}</span> : null}
            {raconte ? <span className="text-[var(--color-turquoise)]">Épisode</span> : null}
          </span>
          <h3 className="titre-affiche titre-carte mt-2 text-balance group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
            {match.aDomicile ? "Contre" : "Chez"} {match.adversaire}
          </h3>
        </div>
        <span className="col-start-2 sm:col-start-auto sm:justify-self-end">
          <Case match={match} statut={statut} />
        </span>
      </Link>
    </li>
  );
}
