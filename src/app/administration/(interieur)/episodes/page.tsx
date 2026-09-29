import Image from "next/image";
import Link from "next/link";
import { exigerDroit } from "@/lib/auth/session-courante";
import { peut } from "@/lib/auth/roles";
import { dateCourte } from "@/lib/dates";
import { episodesActifs, episodesALaCorbeille, matchsALier } from "@/lib/episodes";
import { miniatureYoutube } from "@/lib/youtube";
import { FormulaireEpisode } from "./formulaire-episode";
import { basculerPublication, restaurerEpisode } from "./actions";

export const metadata = { title: "Épisodes" };

export default async function PageEpisodes() {
  const utilisateur = await exigerDroit("redigerContenu");
  const peutPublier = peut(utilisateur, "publierContenu");

  const lignes = await episodesActifs();
  const corbeille = await episodesALaCorbeille();
  const matchs = await matchsALier();
  const numeros = lignes.map((l) => l.episode.numero ?? 0);
  const numeroSuivant = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
  const brouillons = lignes.filter((l) => l.episode.etat === "brouillon").length;

  return (
    <>
      <h1 className="font-[family-name:var(--font-titre)] text-3xl">Épisodes</h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-encre-douce)]">
        La série, épisode par épisode. On colle l&apos;adresse de la vidéo, le
        site affiche la miniature et le lecteur. Un nouvel épisode reste en
        brouillon, invisible sur le site, jusqu&apos;à sa publication.
        {brouillons > 0
          ? ` ${brouillons} ${brouillons > 1 ? "brouillons attendent" : "brouillon attend"}.`
          : ""}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section>
          {lignes.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-trait)] p-6 text-sm text-[var(--color-encre-tenue)]">
              Aucun épisode pour l&apos;instant.
            </p>
          ) : (
            <ul className="space-y-3">
              {lignes.map(({ episode, adversaire, joueLe }, index) => (
                <li
                  key={episode.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-3"
                >
                  <Image
                    src={miniatureYoutube(episode.youtubeId)}
                    alt=""
                    width={480}
                    height={360}
                    sizes="8rem"
                    loading={index === 0 ? "eager" : "lazy"}
                    className="aspect-video w-32 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {episode.numero !== null ? (
                        <span className="mr-1.5 text-[var(--color-encre-tenue)] tabular-nums">
                          {episode.numero}.
                        </span>
                      ) : null}
                      {episode.titre}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-encre-tenue)]">
                      <span
                        className={
                          episode.etat === "publie"
                            ? "rounded bg-[var(--color-victoire)]/10 px-1.5 py-0.5 text-[var(--color-victoire)]"
                            : "rounded bg-[var(--color-papier-creuse)] px-1.5 py-0.5 text-[var(--color-encre-douce)]"
                        }
                      >
                        {episode.etat === "publie" ? "publié" : "brouillon"}
                      </span>
                      {episode.publieLe ? <span>{dateCourte(episode.publieLe)}</span> : null}
                      {adversaire && joueLe ? (
                        <span>
                          · match du {dateCourte(joueLe)} contre {adversaire}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {peutPublier ? (
                      <form action={basculerPublication}>
                        <input type="hidden" name="id" value={episode.id} />
                        <button
                          type="submit"
                          className={
                            episode.etat === "brouillon"
                              ? "rounded-lg bg-[var(--color-encre)] px-3 py-1.5 font-medium text-[var(--color-papier)]"
                              : "text-[var(--color-encre-douce)] hover:underline"
                          }
                        >
                          {episode.etat === "brouillon" ? "Publier" : "Dépublier"}
                        </button>
                      </form>
                    ) : null}
                    <Link
                      href={`/administration/episodes/${episode.id}`}
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      Modifier
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {corbeille.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-[var(--color-encre-douce)]">
                Corbeille
              </h2>
              <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">
                Rien n&apos;est effacé : ces épisodes peuvent revenir.
              </p>
              <ul className="mt-3 space-y-2">
                {corbeille.map((episode) => (
                  <li
                    key={episode.id}
                    className="flex items-center gap-4 rounded-lg border border-dashed border-[var(--color-trait)] px-4 py-2.5 text-sm"
                  >
                    <span className="text-[var(--color-encre-tenue)]">{episode.titre}</span>
                    <form action={restaurerEpisode} className="ml-auto">
                      <input type="hidden" name="id" value={episode.id} />
                      <button type="submit" className="text-[var(--color-accent)] hover:underline">
                        Restaurer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </section>

        <aside className="self-start rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-5">
          <h2 className="text-sm font-semibold">Nouvel épisode</h2>
          <div className="mt-4">
            <FormulaireEpisode matchs={matchs} numeroSuivant={numeroSuivant} />
          </div>
        </aside>
      </div>
    </>
  );
}
