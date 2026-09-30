import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionsMatch, titreMatch } from "@/components/public/actions-match";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { Revelations } from "@/components/public/accueil/revelations";
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
import { dateEtHeure, dateLongue } from "@/lib/dates";
import { matchPublic } from "@/lib/matchs-publics";
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
  if (!donnees) notFound();
  const { maintenant, match, episode, precedent, suivant } = donnees;

  const statut = statutPublic(match, maintenant);
  const resultat = resultatDepuis(match);
  const quand = dateEtHeure(match.joueLe);
  const salle = [match.salleNom, match.salleAdresse].filter(Boolean).join(", ") || null;

  return (
    <>
      <EnTete actif="/matchs" />
      <main id="contenu" className="colonne-large space-y-16 pt-10 pb-24 sm:space-y-20 sm:pt-16">
        <div>
          <Link href="/matchs" className="text-sm font-semibold text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]">
            ← Tous les matchs
          </Link>
          <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
            {match.competition ?? "Match"}
          </p>
          <h1 className="titre-affiche mt-3 text-5xl text-balance sm:text-7xl">
            {match.aDomicile ? "Contre" : "Chez"} {match.adversaire}
          </h1>
          <p className={`mt-3 text-lg text-[var(--color-craie-douce)] first-letter:uppercase ${statut === "annulee" || statut === "reportee" ? "line-through" : ""}`}>
            {quand}
          </p>
        </div>

        {statut === "a_venir" || statut === "en_cours" ? (
          <Revelations>
          <div className="max-w-3xl" data-allume>
            <TableauProchainMatch
              match={{ adversaire: match.adversaire, domicile: match.aDomicile, joueLe: match.joueLe, salle }}
              maintenant={maintenant}
            />
            {statut === "a_venir" ? <ActionsMatch match={match} /> : null}
          </div>
          </Revelations>
        ) : null}

        {statut === "jouee" && resultat ? (
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Revelations>
                <div data-allume>
                  <TableauResultat resultat={resultat} etiquette="Score final" />
                </div>
              </Revelations>
            </div>
            {match.commentaire?.trim() || match.salleNom || match.salleAdresse ? (
              <div className="space-y-12 lg:col-span-5">
                <BlocCommentaire texte={match.commentaire} />
                <BlocSalle match={match} />
              </div>
            ) : null}
          </div>
        ) : null}

        {statut === "score_a_venir" ? (
          <BandeauEtat titre="Score bientôt en ligne" texte="Le match est joué, le résultat arrive dès qu'il est saisi." />
        ) : null}
        {statut === "reportee" ? (
          <BandeauEtat titre="Match reporté" texte="La nouvelle date sera annoncée ici dès qu'elle est fixée." />
        ) : null}
        {statut === "annulee" ? <BandeauEtat titre="Match annulé" texte="Cette rencontre n'aura pas lieu." /> : null}

        {episode ? <BlocEpisode episode={episode} /> : null}
        {statut !== "jouee" ? <BlocCommentaire texte={match.commentaire} /> : null}
        {statut !== "a_venir" && statut !== "jouee" ? <BlocSalle match={match} /> : null}
        <Voisins precedent={precedent} suivant={suivant} />
      </main>
      <PiedDePage saison={null} />
    </>
  );
}
