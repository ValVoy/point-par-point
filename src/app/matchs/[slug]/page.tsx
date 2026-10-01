import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ActionsMatch, titreMatch } from "@/components/public/actions-match";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { Revelations } from "@/components/public/accueil/revelations";
import { Volets } from "@/components/public/volets";
import { EnTete } from "@/components/public/entete";
import {
  BandeauEtat,
  BlocCommentaire,
  BlocEpisode,
  BlocSalle,
  Voisins,
} from "@/components/public/matchs/blocs-match";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import { TableauResultat } from "@/components/public/tableau-resultat";
import { statutPublic } from "@/lib/calendrier";
import { dateLongue } from "@/lib/dates";
import { quandDuMatch } from "@/lib/horaire";
import { matchPublic, nouvelleAdresse } from "@/lib/matchs-publics";
import { resultatDepuis } from "@/lib/resultats";

/**
 * La page d'un match (fiche fiches/matchs.md) : le tableau du gymnase porte
 * la page, et l'etat du match commande l'ordre des blocs. A venir : le
 * tableau du compte a rebours et les moyens de venir. Joue : le tableau du
 * score, l'episode, le commentaire. Reporte, annule ou score non saisi :
 * l'etat en toutes lettres.
 */
export const dynamic = "force-dynamic";

type Parametres = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Parametres): Promise<Metadata> {
  const { slug } = await params;
  const donnees = await matchPublic(slug);
  if (!donnees) return { title: "Match introuvable" };
  const { match } = donnees;
  return {
    title: `${titreMatch(match)}, ${dateLongue(match.joueLe)}`,
    description: [match.competition, match.salleNom].filter(Boolean).join(" · ") || undefined,
  };
}

export default async function PageMatch({ params }: Parametres) {
  const { slug } = await params;
  const donnees = await matchPublic(slug);
  if (!donnees && slug !== slug.toLowerCase() && (await matchPublic(slug.toLowerCase()))) {
    permanentRedirect(`/matchs/${slug.toLowerCase()}`);
  }
  if (!donnees) {
    // Un lien partage avant un report ou une correction : redirection 308.
    const actuelle = await nouvelleAdresse(slug);
    if (actuelle) permanentRedirect(`/matchs/${actuelle}`);
    notFound();
  }
  const { maintenant, match, episode, precedent, suivant } = donnees;

  const statut = statutPublic(match, maintenant);
  const resultat = resultatDepuis(match);
  const quand = quandDuMatch(match);
  const salle = [match.salleNom, match.salleAdresse].filter(Boolean).join(", ") || null;
  // Salle ou commentaire a mettre a cote du score ; sinon le tableau prend la largeur.
  const aCote = Boolean(match.commentaire?.trim() || salle);

  return (
    <>
      <EnTete actif="/matchs" />
      <main id="contenu" className="colonne-large pt-10 pb-[var(--air-chapitre)] sm:pt-16">
        <Volets>
        <div className="space-y-[var(--air-suite)]">
        <div>
          <Link href="/matchs" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]">
            ← Tous les matchs
          </Link>
          <p className="etiquette mt-8 text-[var(--color-turquoise)]">{match.competition ?? "Match"}</p>
          <h1 className="titre-affiche titre-chapitre mt-4 max-w-[18ch] text-balance">
            {match.aDomicile ? "Contre" : "Chez"} {match.adversaire}
          </h1>
          <p className={`chapeau mt-4 text-[var(--color-craie-douce)] first-letter:uppercase ${statut === "annulee" || statut === "reportee" ? "line-through" : ""}`}>
            {quand}
          </p>
        </div>

        {statut === "a_venir" || statut === "en_cours" ? (
          <Revelations>
          <div data-allume>
            <TableauProchainMatch
              match={{ adversaire: match.adversaire, domicile: match.aDomicile, joueLe: match.joueLe, heureConnue: match.heureConnue, salle }}
              maintenant={maintenant}
            />
            {statut === "a_venir" ? <ActionsMatch match={match} /> : null}
          </div>
          </Revelations>
        ) : null}

        {statut === "jouee" && resultat ? (
          <div>
            <Revelations>
              <div data-allume>
                <TableauResultat resultat={resultat} etiquette="Score final" avecDate={false} />
              </div>
            </Revelations>
            {aCote ? (
              <div className="suite grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
                <BlocCommentaire texte={match.commentaire} />
                <BlocSalle match={match} />
              </div>
            ) : null}
          </div>
        ) : null}

        {statut === "jouee" && episode ? <BlocEpisode episode={episode} prioritaire /> : null}

        {statut === "score_a_venir" ? (
          <BandeauEtat titre="Score bientôt en ligne" texte="Le match est joué, le résultat arrive dès qu'il est saisi." />
        ) : null}
        {statut === "reportee" ? (
          <BandeauEtat titre="Match reporté" texte="La nouvelle date sera annoncée ici dès qu'elle est fixée." />
        ) : null}
        {statut === "annulee" ? <BandeauEtat titre="Match annulé" texte="Cette rencontre n'aura pas lieu." /> : null}

        {statut !== "jouee" && episode ? <BlocEpisode episode={episode} /> : null}
        {statut !== "jouee" ? <BlocCommentaire texte={match.commentaire} /> : null}
        {statut !== "jouee" ? <BlocSalle match={match} avecItineraire={statut !== "a_venir"} /> : null}
        <Voisins precedent={precedent} suivant={suivant} />
        </div>
        </Volets>
      </main>
      <PiedDePage />
    </>
  );
}
