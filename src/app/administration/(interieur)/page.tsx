import Link from "next/link";
import { and, eq, isNull } from "drizzle-orm";
import { exigerConnexion } from "@/lib/auth/session-courante";
import { peut } from "@/lib/auth/roles";
import { db } from "@/lib/db";
import { actualites, episodes } from "@/lib/db/schema";
import { dateEtHeure } from "@/lib/dates";
import { prochainMatch, rencontresDeLaSaison, scoreASaisir } from "@/lib/rencontres";
import { saisonCourante } from "@/lib/saisons";
import { classementARevoir } from "@/lib/classement-base";
import { nombreNonLus } from "@/lib/messages";

export const metadata = { title: "Tableau de bord" };

/**
 * Le tableau de bord dit ce qui attend une action, et rien d'autre. C'est la
 * premiere page vue a chaque connexion : si un score oublie n'y apparait pas,
 * il ne sera jamais saisi. Le classement et les messages non lus y figurent
 * aussi depuis l'audit du 01-10-2026 (U6) : le classement disparait du site
 * au bout de 30 jours, et rien ne previent l'ami d'un message.
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

  const nonLus = peut(utilisateur, "lireMessages") ? await nombreNonLus() : 0;

  const classementARevoirRaison =
    saison && peut(utilisateur, "saisirResultats")
      ? await classementARevoir(saison.id, matchs.filter((m) => m.etat === "jouee").at(-1)?.joueLe ?? null)
      : null;

  const rienAFaire =
    aSaisir.length === 0 && brouillons.length === 0 && articles.length === 0 && nonLus === 0 && !classementARevoirRaison;

  return (
    <>
      <h1 className="titre-admin text-3xl">
        Bonjour {utilisateur.nom}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-craie-douce)]">
        {rienAFaire
          ? "Rien n'attend de votre côté : le site est à jour."
          : "Voici ce qui attend une action."}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {aSaisir.map((rencontre) => (
          <Link
            key={rencontre.id}
            href={`/administration/matchs/${rencontre.id}/score`}
            className="rounded-xl border border-[var(--color-turquoise)] bg-[var(--color-nuit-surface)] p-5 hover:bg-[var(--color-turquoise-sourd)]"
          >
            <p className="text-xs font-medium text-[var(--color-turquoise)]">Score à saisir</p>
            <p className="mt-1 font-medium">
              {rencontre.aDomicile ? "Contre " : "Chez "}
              {rencontre.adversaire}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-craie-tenue)] first-letter:uppercase">
              {dateEtHeure(rencontre.joueLe)}
            </p>
          </Link>
        ))}

        {nonLus > 0 ? (
          <Link
            href="/administration/messages"
            className="rounded-xl border border-[var(--color-jaune)] bg-[var(--color-nuit-surface)] p-5 hover:bg-[var(--color-nuit-releve)]"
          >
            <p className="text-xs font-medium text-[var(--color-jaune)]">Messages</p>
            <p className="mt-1 font-medium">{nonLus > 1 ? `${nonLus} messages non lus` : "1 message non lu"}</p>
            <p className="mt-0.5 text-xs text-[var(--color-craie-tenue)]">Écrits depuis la page Contact du site.</p>
          </Link>
        ) : null}

        {classementARevoirRaison ? (
          <Link
            href="/administration/matchs/classement"
            className="rounded-xl border border-[var(--color-turquoise)] bg-[var(--color-nuit-surface)] p-5 hover:bg-[var(--color-turquoise-sourd)]"
          >
            <p className="text-xs font-medium text-[var(--color-turquoise)]">Classement à mettre à jour</p>
            <p className="mt-1 font-medium">{classementARevoirRaison}</p>
            <p className="mt-0.5 text-xs text-[var(--color-craie-tenue)]">Recopiez celui de la poule, deux minutes.</p>
          </Link>
        ) : null}

        {brouillons.length > 0 ? (
          <Link
            href="/administration/episodes"
            className="rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5 hover:border-[var(--color-turquoise)]"
          >
            <p className="text-xs font-medium text-[var(--color-craie-douce)]">
              {brouillons.length > 1
                ? `${brouillons.length} épisodes en brouillon`
                : "1 épisode en brouillon"}
            </p>
            <p className="mt-1 font-medium">{brouillons[0]?.titre}</p>
            <p className="mt-0.5 text-xs text-[var(--color-craie-tenue)]">
              Invisible sur le site tant qu&apos;il n&apos;est pas publié.
            </p>
          </Link>
        ) : null}

        {articles.length > 0 ? (
          <Link
            href="/administration/actualites"
            className="rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5 hover:border-[var(--color-turquoise)]"
          >
            <p className="text-xs font-medium text-[var(--color-craie-douce)]">
              {articles.length > 1
                ? `${articles.length} actualités en brouillon`
                : "1 actualité en brouillon"}
            </p>
            <p className="mt-1 font-medium">{articles[0]?.titre}</p>
            <p className="mt-0.5 text-xs text-[var(--color-craie-tenue)]">
              À relire puis publier.
            </p>
          </Link>
        ) : null}

        {prochain ? (
          <Link
            href={`/administration/matchs/${prochain.id}`}
            className="rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5 hover:border-[var(--color-turquoise)]"
          >
            <p className="text-xs font-medium text-[var(--color-craie-douce)]">Prochain match</p>
            <p className="mt-1 font-medium">
              {prochain.aDomicile ? "Contre " : "Chez "}
              {prochain.adversaire}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-craie-tenue)] first-letter:uppercase">
              {dateEtHeure(prochain.joueLe)}
            </p>
          </Link>
        ) : null}
      </div>

      <p className="mt-8 text-xs text-[var(--color-craie-tenue)]">
        {peut(utilisateur, "gererComptes")
          ? "Vous avez accès à l'ensemble de l'administration."
          : "Vous pouvez rédiger et saisir. La structure du site et les comptes sont réservés à l'administrateur."}
      </p>
    </>
  );
}
