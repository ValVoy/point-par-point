import Link from "next/link";
import { desc, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { saisons } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";
import { dateCourte } from "@/lib/dates";
import { FormulaireSaison } from "./formulaire";
import {
  definirCourante,
  mettreSaisonALaCorbeille,
  restaurerSaison,
} from "./actions";

export const metadata = { title: "Saisons" };

/**
 * Les deux dates sont facultatives et independantes. Sans ce tri des cas, une
 * saison sans date de fin s'affiche « 1 sept. 2027 au », avec un « au »
 * orphelin qui donne l'air d'un bogue.
 */
function periode(debut: Date | null, fin: Date | null): string {
  if (debut && fin) return `${dateCourte(debut)} au ${dateCourte(fin)}`;
  if (debut) return `À partir du ${dateCourte(debut)}`;
  if (fin) return `Jusqu'au ${dateCourte(fin)}`;
  return "Dates non renseignées";
}

export default async function PageSaisons() {
  await exigerDroit("gererSaisons");

  const base = db();
  const actives = await base
    .select()
    .from(saisons)
    .where(isNull(saisons.supprimeLe))
    .orderBy(desc(saisons.debuteLe));
  const corbeille = await base
    .select()
    .from(saisons)
    .where(isNotNull(saisons.supprimeLe));

  return (
    <>
      <h1 className="titre-admin text-3xl">Saisons</h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Chaque match, chaque effectif et chaque classement appartient à une
        saison. Une seule saison est courante à la fois : c&apos;est celle que
        le site met en avant.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <section>
          {actives.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-6 text-sm text-[var(--color-craie-tenue)]">
              Aucune saison pour l&apos;instant. La première que vous créerez
              deviendra la saison courante.
            </p>
          ) : (
            <ul className="space-y-3">
              {actives.map((saison) => (
                <li
                  key={saison.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-4"
                >
                  <div className="min-w-32">
                    <p className="font-medium">
                      {saison.libelle}
                      {saison.courante ? (
                        <span className="ml-2 rounded bg-[var(--color-turquoise-sourd)] px-1.5 py-0.5 text-xs font-normal text-[var(--color-turquoise-clair)]">
                          courante
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-[var(--color-craie-tenue)]">
                      {periode(saison.debuteLe, saison.finitLe)}
                    </p>
                  </div>

                  <div className="ml-auto flex items-center gap-3 text-sm">
                    <Link
                      href={`/administration/saisons/${saison.id}`}
                      className="text-[var(--color-turquoise)] hover:underline"
                    >
                      Modifier
                    </Link>

                    {saison.courante ? null : (
                      <>
                        <form action={definirCourante}>
                          <input type="hidden" name="id" value={saison.id} />
                          <button
                            type="submit"
                            className="text-[var(--color-craie-douce)] hover:underline"
                          >
                            Rendre courante
                          </button>
                        </form>
                        <form action={mettreSaisonALaCorbeille}>
                          <input type="hidden" name="id" value={saison.id} />
                          <button
                            type="submit"
                            className="text-[var(--color-craie-tenue)] hover:underline"
                          >
                            Corbeille
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {corbeille.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-[var(--color-craie-douce)]">
                Corbeille
              </h2>
              <p className="mt-1 text-xs text-[var(--color-craie-tenue)]">
                Rien n&apos;est effacé : ces saisons peuvent revenir.
              </p>
              <ul className="mt-3 space-y-2">
                {corbeille.map((saison) => (
                  <li
                    key={saison.id}
                    className="flex items-center gap-4 rounded-lg border border-dashed border-[var(--color-nuit-trait)] px-4 py-2.5 text-sm"
                  >
                    <span className="text-[var(--color-craie-tenue)]">
                      {saison.libelle}
                    </span>
                    <form action={restaurerSaison} className="ml-auto">
                      <input type="hidden" name="id" value={saison.id} />
                      <button
                        type="submit"
                        className="text-[var(--color-turquoise)] hover:underline"
                      >
                        Restaurer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </section>

        <aside className="rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
          <h2 className="text-sm font-semibold">Nouvelle saison</h2>
          <div className="mt-4">
            <FormulaireSaison />
          </div>
        </aside>
      </div>
    </>
  );
}
