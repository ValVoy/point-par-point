import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerDroit } from "@/lib/auth/session-courante";
import { pourChampDate } from "@/lib/dates";
import { episodeParId, matchsALier } from "@/lib/episodes";
import { lienYoutube } from "@/lib/youtube";
import { FormulaireEpisode } from "../formulaire-episode";
import { mettreEpisodeALaCorbeille } from "../actions";

export const metadata = { title: "Modifier un épisode" };

export default async function PageEpisode({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigerDroit("redigerContenu");

  const { id } = await params;
  const identifiant = Number(id);
  if (!Number.isInteger(identifiant)) notFound();

  const episode = await episodeParId(identifiant);
  if (!episode || episode.supprimeLe) notFound();
  const matchs = await matchsALier();

  return (
    <>
      <Link
        href="/administration/episodes"
        className="text-sm text-[var(--color-turquoise)] hover:underline"
      >
        Retour aux épisodes
      </Link>

      <h1 className="mt-3 titre-admin text-3xl">{episode.titre}</h1>
      <p className="mt-1 text-sm text-[var(--color-craie-douce)]">
        {episode.etat === "publie" ? "Publié sur le site" : "Brouillon, invisible sur le site"}
        {" · "}
        <a
          href={lienYoutube(episode.youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-turquoise)] hover:underline"
        >
          Voir sur YouTube
        </a>
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_16rem]">
        <div className="max-w-xl rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
          <FormulaireEpisode
            matchs={matchs}
            episode={{
              id: episode.id,
              adresse: lienYoutube(episode.youtubeId),
              titre: episode.titre,
              numero: episode.numero?.toString() ?? "",
              resume: episode.resume ?? "",
              publieLe: pourChampDate(episode.publieLe),
              rencontreId: episode.rencontreId?.toString() ?? "",
            }}
          />
        </div>

        <form
          action={mettreEpisodeALaCorbeille}
          className="self-start rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-4 text-sm"
        >
          <input type="hidden" name="id" value={episode.id} />
          <p className="text-xs text-[var(--color-craie-tenue)]">
            L&apos;épisode disparaît du site mais reste restaurable. Pour le
            retirer un temps, préférez « Dépublier » dans la liste.
          </p>
          <button type="submit" className="mt-2 text-[var(--color-craie-tenue)] hover:underline">
            Mettre à la corbeille
          </button>
        </form>
      </div>
    </>
  );
}
