import Link from "next/link";
import { exigerDroit } from "@/lib/auth/session-courante";
import { peut } from "@/lib/auth/roles";
import { dateCourte } from "@/lib/dates";
import { actualitesActives, actualitesALaCorbeille } from "@/lib/actualites";
import { texteBrut } from "@/lib/texte-leger";
import { basculerPublicationActualite, restaurerActualite } from "./actions";

export const metadata = { title: "Actualités" };

function extrait(chapo: string | null, corps: string): string {
  const source = chapo || texteBrut(corps);
  return source.length > 160 ? `${source.slice(0, 157).trimEnd()}...` : source;
}

export default async function PageActualites() {
  const utilisateur = await exigerDroit("redigerContenu");
  const peutPublier = peut(utilisateur, "publierContenu");

  const liste = await actualitesActives();
  const corbeille = await actualitesALaCorbeille();

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="titre-admin text-3xl">Actualités</h1>
        <Link
          href="/administration/actualites/nouvelle"
          className="ml-auto inline-flex min-h-11 items-center rounded-lg bg-[var(--color-craie)] px-4 text-sm font-medium text-[var(--color-nuit-surface)]"
        >
          Écrire une actualité
        </Link>
      </div>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Une actualité s&apos;écrit en brouillon, se relit, puis se publie. Tant
        qu&apos;elle est en brouillon, personne ne la voit sur le site.
      </p>

      {liste.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-6 text-sm text-[var(--color-craie-tenue)]">
          Aucune actualité pour l&apos;instant.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {liste.map((actualite) => (
            <li
              key={actualite.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-craie-tenue)]">
                  <span
                    className={
                      actualite.etat === "publie"
                        ? "rounded bg-[var(--color-turquoise-sourd)] px-1.5 py-0.5 text-[var(--color-turquoise-clair)]"
                        : "rounded bg-[var(--color-nuit)] px-1.5 py-0.5 text-[var(--color-craie-douce)]"
                    }
                  >
                    {actualite.etat === "publie" ? "publiée" : "brouillon"}
                  </span>
                  {actualite.publieLe ? dateCourte(actualite.publieLe) : null}
                </p>
                <p className="mt-1 font-medium">{actualite.titre}</p>
                <p className="mt-0.5 text-sm text-[var(--color-craie-douce)]">
                  {extrait(actualite.chapo, actualite.corps)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {peutPublier ? (
                  <form action={basculerPublicationActualite}>
                    <input type="hidden" name="id" value={actualite.id} />
                    <input type="hidden" name="vers" value={actualite.etat === "brouillon" ? "publie" : "brouillon"} />
                    <button
                      type="submit"
                      className={
                        actualite.etat === "brouillon"
                          ? "rounded-lg bg-[var(--color-craie)] inline-flex min-h-11 items-center px-3 font-medium text-[var(--color-nuit-surface)]"
                          : "text-[var(--color-craie-douce)] action-admin"
                      }
                    >
                      {actualite.etat === "brouillon" ? "Publier" : "Dépublier"}
                    </button>
                  </form>
                ) : null}
                <Link
                  href={`/administration/actualites/${actualite.id}`}
                  className="text-[var(--color-turquoise)] action-admin"
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
          <h2 className="text-sm font-semibold text-[var(--color-craie-douce)]">Corbeille</h2>
          <p className="mt-1 text-xs text-[var(--color-craie-tenue)]">
            Rien n&apos;est effacé : ces actualités peuvent revenir.
          </p>
          <ul className="mt-3 space-y-2">
            {corbeille.map((actualite) => (
              <li
                key={actualite.id}
                className="flex items-center gap-4 rounded-lg border border-dashed border-[var(--color-nuit-trait)] px-4 py-2.5 text-sm"
              >
                <span className="text-[var(--color-craie-tenue)]">{actualite.titre}</span>
                <form action={restaurerActualite} className="ml-auto">
                  <input type="hidden" name="id" value={actualite.id} />
                  <button type="submit" className="text-[var(--color-turquoise)] action-admin">
                    Restaurer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
