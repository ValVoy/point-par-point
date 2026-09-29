import Link from "next/link";
import { and, eq, isNull } from "drizzle-orm";
import { exigerConnexion } from "@/lib/auth/session-courante";
import { peut } from "@/lib/auth/roles";
import { db } from "@/lib/db";
import { actualites, episodes } from "@/lib/db/schema";
import { dateEtHeure } from "@/lib/dates";
import { prochainMatch, rencontresDeLaSaison, scoreASaisir } from "@/lib/rencontres";
import { saisonCourante } from "@/lib/saisons";

/**
 * Le tableau de bord dit ce qui attend une action, et rien d'autre. C'est la
 * premiere page vue a chaque connexion : si un score oublie n'y apparait pas,
 * il ne sera jamais saisi.
 */
export default async function TableauDeBord() {
  const utilisateur = await exigerConnexion();
  const saison = await saisonCourante();

  const matchs =
    saison && peut(utilisateur, "saisirResultats")
      ? await rencontresDeLaSaison(saison.id)
      : [];
  const aSaisir = matchs.filter((r) => scoreASaisir(r));
  const prochain = prochainMatch(matchs);

  const brouillons = peut(utilisateur, "redigerContenu")
    ? await db()
        .select({ id: episodes.id, titre: episodes.titre })
        .from(episodes)
        .where(and(eq(episodes.etat, "brouillon"), isNull(episodes.supprimeLe)))
    : [];

  const articles = peut(utilisateur, "redigerContenu")
    ? await db()
        .select({ id: actualites.id, titre: actualites.titre })
        .from(actualites)
        .where(and(eq(actualites.etat, "brouillon"), isNull(actualites.supprimeLe)))
    : [];

  const rienAFaire =
    aSaisir.length === 0 && brouillons.length === 0 && articles.length === 0;

  return (
    <>
      <h1 className="titre-admin text-3xl">
        Bonjour {utilisateur.nom}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-encre-douce)]">
        {rienAFaire
          ? "Rien n'attend de votre côté : le site est à jour."
          : "Voici ce qui attend une action."}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {aSaisir.map((rencontre) => (
          <Link
            key={rencontre.id}
            href={`/administration/matchs/${rencontre.id}/score`}
            className="rounded-xl border border-[var(--color-accent)] bg-[var(--color-papier)] p-5 hover:bg-[var(--color-accent-sourd)]"
          >
            <p className="text-xs font-medium text-[var(--color-accent)]">Score à saisir</p>
            <p className="mt-1 font-medium">
              {rencontre.aDomicile ? "Contre " : "Chez "}
              {rencontre.adversaire}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-encre-tenue)] first-letter:uppercase">
              {dateEtHeure(rencontre.joueLe)}
            </p>
          </Link>
        ))}

        {brouillons.length > 0 ? (
          <Link
            href="/administration/episodes"
            className="rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-5 hover:border-[var(--color-accent)]"
          >
            <p className="text-xs font-medium text-[var(--color-encre-douce)]">
              {brouillons.length > 1
                ? `${brouillons.length} épisodes en brouillon`
                : "1 épisode en brouillon"}
            </p>
            <p className="mt-1 font-medium">{brouillons[0]?.titre}</p>
            <p className="mt-0.5 text-xs text-[var(--color-encre-tenue)]">
              Invisible sur le site tant qu&apos;il n&apos;est pas publié.
            </p>
          </Link>
        ) : null}

        {articles.length > 0 ? (
          <Link
            href="/administration/actualites"
            className="rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-5 hover:border-[var(--color-accent)]"
          >
            <p className="text-xs font-medium text-[var(--color-encre-douce)]">
              {articles.length > 1
                ? `${articles.length} actualités en brouillon`
                : "1 actualité en brouillon"}
            </p>
            <p className="mt-1 font-medium">{articles[0]?.titre}</p>
            <p className="mt-0.5 text-xs text-[var(--color-encre-tenue)]">
              À relire puis publier.
            </p>
          </Link>
        ) : null}

        {prochain ? (
          <Link
            href={`/administration/matchs/${prochain.id}`}
            className="rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-5 hover:border-[var(--color-accent)]"
          >
            <p className="text-xs font-medium text-[var(--color-encre-douce)]">Prochain match</p>
            <p className="mt-1 font-medium">
              {prochain.aDomicile ? "Contre " : "Chez "}
              {prochain.adversaire}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-encre-tenue)] first-letter:uppercase">
              {dateEtHeure(prochain.joueLe)}
            </p>
          </Link>
        ) : null}
      </div>

      <p className="mt-8 text-xs text-[var(--color-encre-tenue)]">
        {peut(utilisateur, "gererComptes")
          ? "Vous avez accès à l'ensemble de l'administration."
          : "Vous pouvez rédiger et saisir. La structure du site et les comptes sont réservés à l'administrateur."}
      </p>
    </>
  );
}
