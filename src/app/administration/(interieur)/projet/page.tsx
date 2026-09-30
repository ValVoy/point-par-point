import { exigerDroit } from "@/lib/auth/session-courante";
import { dateLongue, pourChampDate } from "@/lib/dates";
import { etapes } from "@/lib/projet";
import { basculerEtape } from "./actions";
import { Corbeille, LigneElement } from "./elements";
import { FormulaireEtape } from "./formulaires";

export const metadata = { title: "Chronologie du projet" };

export default async function PageChronologie() {
  await exigerDroit("gererProjet");

  const liste = await etapes();
  const corbeille = await etapes(true);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <section>
        <p className="mb-4 max-w-prose text-sm text-[var(--color-craie-douce)]">
          Les moments qui ont fait le projet, dans l&apos;ordre du récit. Une
          étape nouvelle reste en brouillon jusqu&apos;à sa publication.
        </p>
        {liste.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-6 text-sm text-[var(--color-craie-tenue)]">
            Aucune étape pour l&apos;instant.
          </p>
        ) : (
          <ul className="space-y-3">
            {liste.map((etape, index) => (
              <LigneElement
                key={etape.id}
                liste="etapes"
                id={etape.id}
                titre={etape.titre}
                premier={index === 0}
                dernier={index === liste.length - 1}
                details={
                  <>
                    <span className="inline-block first-letter:uppercase">
                      {etape.dateLibre ?? dateLongue(etape.survenuLe)}
                    </span>
                    {" · "}
                    {etape.etat === "publie" ? "publiée" : "brouillon"}
                  </>
                }
                actions={
                  <form action={basculerEtape}>
                    <input type="hidden" name="id" value={etape.id} />
                    <button
                      type="submit"
                      className={
                        etape.etat === "brouillon"
                          ? "rounded-lg bg-[var(--color-craie)] inline-flex min-h-11 items-center px-3 font-medium text-[var(--color-nuit-surface)]"
                          : "text-[var(--color-craie-douce)] action-admin"
                      }
                    >
                      {etape.etat === "brouillon" ? "Publier" : "Dépublier"}
                    </button>
                  </form>
                }
              >
                <FormulaireEtape
                  initiales={{
                    id: String(etape.id),
                    titre: etape.titre,
                    survenuLe: pourChampDate(etape.survenuLe),
                    dateLibre: etape.dateLibre ?? "",
                    texte: etape.texte ?? "",
                  }}
                />
              </LigneElement>
            ))}
          </ul>
        )}
        <Corbeille
          liste="etapes"
          elements={corbeille.map((etape) => ({ id: etape.id, libelle: etape.titre }))}
        />
      </section>

      <aside className="self-start rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
        <h2 className="text-sm font-semibold">Nouvelle étape</h2>
        <div className="mt-4">
          <FormulaireEtape />
        </div>
      </aside>
    </div>
  );
}
