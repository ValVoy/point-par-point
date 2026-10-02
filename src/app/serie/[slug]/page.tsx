import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { Revelations } from "@/components/public/accueil/revelations";
import { EnTete } from "@/components/public/entete";
import { LecteurEpisode } from "@/components/public/lecteur-episode";
import { MiniatureEpisode } from "@/components/public/miniature-episode";
import { BoutonAbonnement, PHRASE_ABONNEMENT } from "@/components/public/serie/elements-serie";
import { LigneEpisode } from "@/components/public/serie/ligne-episode";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import { TableauResultat } from "@/components/public/tableau-resultat";
import { TitreChapitre } from "@/components/public/titre-chapitre";
import { Volets } from "@/components/public/volets";
import { statutPublic } from "@/lib/calendrier";
import { dateLongue } from "@/lib/dates";
import type { Episode } from "@/lib/episodes";
import { matchPublic } from "@/lib/matchs-publics";
import { resultatDepuis } from "@/lib/resultats";
import { episodePublic, nouvelleAdresseEpisode } from "@/lib/serie";
import { miniatureYoutube } from "@/lib/youtube";
import { titreSansNumero } from "@/lib/titre-episode";

/**
 * La page d'un episode (fiches serie.md et refonte-respiration.md) : le
 * titre, puis le lecteur en bandeau sur toute la colonne large, le resume et
 * l'abonnement, le match raconte en tableau LED, et l'episode suivant mis en
 * avant avec sa vignette. La navigation s'arrete aux episodes voisins : aucun
 * contenu « associe » en vrac.
 */
export const dynamic = "force-dynamic";

type Parametres = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Parametres): Promise<Metadata> {
  const { slug } = await params;
  const donnees = await episodePublic(slug);
  if (!donnees) return { title: "Épisode introuvable" };
  const { episode } = donnees;
  const titre = episode.numero ? `Épisode ${episode.numero} : ${titreSansNumero(episode)}` : titreSansNumero(episode);
  return {
    title: titre,
    description: episode.resume ?? undefined,
    // Un episode partage sur Instagram ou WhatsApp arrive avec son image.
    openGraph: {
      type: "video.episode",
      title: titre,
      description: episode.resume ?? undefined,
      images: [{ url: miniatureYoutube(episode.youtubeId), width: 480, height: 360 }],
    },
  };
}

const etiquette = "etiquette text-[var(--color-craie-douce)]";

function LienVoisin({ episode, sens }: { episode: Episode | null; sens: "précédent" | "suivant" }) {
  if (!episode) return <span />;
  return (
    <Link href={`/serie/${episode.slug}`} className={`group block min-h-16 py-4 ${sens === "suivant" ? "text-right" : ""}`}>
      <span className={etiquette}>{sens === "précédent" ? "← Épisode précédent" : "Épisode suivant →"}</span>
      <span className="titre-affiche mt-2 block text-2xl text-balance group-hover:text-[var(--color-jaune)]">
        {titreSansNumero(episode)}
      </span>
    </Link>
  );
}

async function MatchRaconte({ slug }: { slug: string }) {
  const donnees = await matchPublic(slug);
  if (!donnees) return null;
  const { match, maintenant } = donnees;
  const statut = statutPublic(match, maintenant);
  const resultat = resultatDepuis(match);
  let tableau = null;
  if (statut === "jouee" && resultat) {
    tableau = <TableauResultat resultat={resultat} etiquette="Score final" />;
  } else if (statut === "a_venir" || statut === "en_cours") {
    const salle = [match.salleNom, match.salleAdresse].filter(Boolean).join(", ") || null;
    tableau = (
      <TableauProchainMatch
        match={{ adversaire: match.adversaire, domicile: match.aDomicile, joueLe: match.joueLe, heureConnue: match.heureConnue, salle }}
        maintenant={maintenant}
      />
    );
  }
  return (
    <section aria-labelledby="titre-match" className="suite max-w-3xl">
      <h2 id="titre-match" className={etiquette}>
        Le match raconté
      </h2>
      {tableau ? (
        <Revelations>
          <div className="mt-4" data-allume>
            {tableau}
          </div>
        </Revelations>
      ) : (
        <p className="titre-affiche mt-3 text-3xl">
          {match.aDomicile ? "Contre" : "Chez"} {match.adversaire}
        </p>
      )}
      <Link
        href={`/matchs/${match.slug}`}
        className="mt-4 inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)]"
      >
        Voir le match {match.aDomicile ? "contre" : "chez"} {match.adversaire}
      </Link>
    </section>
  );
}

export default async function PageEpisode({ params }: Parametres) {
  const { slug } = await params;
  const donnees = await episodePublic(slug);
  if (!donnees && slug !== slug.toLowerCase() && (await episodePublic(slug.toLowerCase()))) {
    permanentRedirect(`/serie/${slug.toLowerCase()}`);
  }
  if (!donnees) {
    const actuelle = await nouvelleAdresseEpisode(slug);
    if (actuelle) permanentRedirect(`/serie/${actuelle}`);
    notFound();
  }
  const { episode, match, precedent, suivant } = donnees;

  return (
    <>
      <EnTete actif="/serie" />
      <main id="contenu" className="colonne-large pt-10 pb-[var(--air-chapitre)] sm:pt-16">
        <Volets>
          <Link href="/serie" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]">
            ← Toute la série
          </Link>
          <p className="etiquette mt-8 text-[var(--color-turquoise)]">
            {[episode.numero ? `Épisode ${String(episode.numero).padStart(2, "0")}` : "Avant la série", episode.publieLe ? `Publié le ${dateLongue(episode.publieLe)}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <h1 className="titre-affiche titre-chapitre mt-4 max-w-[18ch] text-balance">{titreSansNumero(episode)}</h1>

          <div data-volet className="relative mt-[var(--titre-contenu)] aspect-video overflow-hidden bg-[var(--color-nuit-surface)]">
            <LecteurEpisode youtubeId={episode.youtubeId} titre={titreSansNumero(episode)}>
              <MiniatureEpisode youtubeId={episode.youtubeId} sizes="(min-width: 1344px) 84rem, 100vw" prioritaire />
            </LecteurEpisode>
          </div>

          <div className="suite grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
            {episode.resume ? <p className="chapeau max-w-[46ch] text-[var(--color-craie-douce)]">{episode.resume}</p> : <span />}
            <section aria-label="S'abonner" className="border-l-4 border-[var(--color-jaune)] bg-[var(--color-nuit-surface)] p-8">
              <p className="titre-affiche titre-carte">La suite au prochain épisode</p>
              <p className="corps mt-3 mb-6 text-[var(--color-craie-douce)]">{PHRASE_ABONNEMENT}</p>
              <BoutonAbonnement />
            </section>
          </div>

          {match ? <MatchRaconte slug={match.slug} /> : null}

          {suivant ? (
            <section aria-labelledby="titre-suivant" className="chapitre">
              <TitreChapitre id="titre-suivant" surtitre="À suivre">
                Épisode suivant
              </TitreChapitre>
              <ol className="mt-[var(--titre-contenu)]">
                <LigneEpisode episode={suivant} match={null} maintenant={new Date()} />
              </ol>
            </section>
          ) : null}

          {precedent ? (
            <nav aria-label="Épisode précédent" className="suite border-t border-[var(--color-nuit-trait)]">
              <LienVoisin episode={precedent} sens="précédent" />
            </nav>
          ) : null}
        </Volets>
      </main>
      <PiedDePage />
    </>
  );
}
