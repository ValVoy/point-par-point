import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { Revelations } from "@/components/public/accueil/revelations";
import { EnTete } from "@/components/public/entete";
import { LecteurEpisode } from "@/components/public/lecteur-episode";
import { MiniatureEpisode } from "@/components/public/miniature-episode";
import { BoutonAbonnement } from "@/components/public/serie/elements-serie";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import { TableauResultat } from "@/components/public/tableau-resultat";
import { statutPublic } from "@/lib/calendrier";
import { dateLongue } from "@/lib/dates";
import type { Episode } from "@/lib/episodes";
import { matchPublic } from "@/lib/matchs-publics";
import { resultatDepuis } from "@/lib/resultats";
import { episodePublic, nouvelleAdresseEpisode } from "@/lib/serie";
import { miniatureYoutube } from "@/lib/youtube";

/**
 * La page d'un episode (fiche fiches/serie.md) : le lecteur en facade, le
 * titre et le resume, puis le match raconte en tableau LED, relie a sa page.
 * L'abonnement vient apres le visionnage, et la navigation s'arrete aux
 * episodes voisins : aucun contenu « associe » en vrac.
 */
export const dynamic = "force-dynamic";

type Parametres = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Parametres): Promise<Metadata> {
  const { slug } = await params;
  const donnees = await episodePublic(slug);
  if (!donnees) return { title: "Épisode introuvable" };
  const { episode } = donnees;
  const titre = episode.numero ? `Épisode ${episode.numero} : ${episode.titre}` : episode.titre;
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

const etiquette = "text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase";
const surtitre = "text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase";

function LienVoisin({ episode, sens }: { episode: Episode | null; sens: "précédent" | "suivant" }) {
  if (!episode) return <span />;
  return (
    <Link href={`/serie/${episode.slug}`} className={`group block min-h-16 py-4 ${sens === "suivant" ? "text-right" : ""}`}>
      <span className={etiquette}>{sens === "précédent" ? "← Épisode précédent" : "Épisode suivant →"}</span>
      <span className="titre-affiche mt-2 block text-2xl text-balance group-hover:text-[var(--color-jaune)]">
        {episode.titre}
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
        match={{ adversaire: match.adversaire, domicile: match.aDomicile, joueLe: match.joueLe, salle }}
        maintenant={maintenant}
      />
    );
  }
  return (
    <section aria-labelledby="titre-match" className="max-w-3xl">
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
  if (!donnees && slug !== slug.toLowerCase()) permanentRedirect(`/serie/${slug.toLowerCase()}`);
  if (!donnees) {
    const actuelle = await nouvelleAdresseEpisode(slug);
    if (actuelle) permanentRedirect(`/serie/${actuelle}`);
    notFound();
  }
  const { episode, match, precedent, suivant } = donnees;

  return (
    <>
      <EnTete actif="/serie" />
      <main id="contenu" className="colonne-large space-y-16 pt-10 pb-24 sm:pt-16">
        <div>
          <Link href="/serie" className="text-sm font-semibold text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]">
            ← Toute la série
          </Link>
          <p className={`mt-8 ${surtitre}`}>
            {[episode.numero ? `Épisode ${episode.numero}` : null, episode.publieLe ? `Publié le ${dateLongue(episode.publieLe)}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <h1 className="titre-affiche mt-3 max-w-[20ch] text-5xl text-balance sm:text-7xl">{episode.titre}</h1>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative aspect-video overflow-hidden bg-[var(--color-nuit-surface)] lg:col-span-8">
            <LecteurEpisode youtubeId={episode.youtubeId} titre={episode.titre}>
              <MiniatureEpisode youtubeId={episode.youtubeId} sizes="(min-width: 1024px) 66vw, 100vw" prioritaire />
            </LecteurEpisode>
          </div>
          <div className="space-y-8 lg:col-span-4">
            {episode.resume ? <p className="text-lg leading-relaxed text-[var(--color-craie-douce)]">{episode.resume}</p> : null}
            <section aria-label="S'abonner" className="border-l-4 border-[var(--color-jaune)] bg-[var(--color-nuit-surface)] px-6 py-6">
              <p className="titre-affiche text-3xl">La suite au prochain épisode</p>
              <p className="mt-2 mb-5 text-[var(--color-craie-douce)]">Abonnez-vous à la chaîne pour ne manquer aucune sortie.</p>
              <BoutonAbonnement />
            </section>
          </div>
        </div>

        {match ? <MatchRaconte slug={match.slug} /> : null}

        <nav aria-label="Autres épisodes" className="grid gap-4 border-t border-[var(--color-nuit-trait)] sm:grid-cols-2">
          <LienVoisin episode={precedent} sens="précédent" />
          <LienVoisin episode={suivant} sens="suivant" />
        </nav>
      </main>
      <PiedDePage saison={null} />
    </>
  );
}
