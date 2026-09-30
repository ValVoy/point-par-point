import { exigerDroit } from "@/lib/auth/session-courante";
import { listePartenaires } from "@/lib/projet";
import { basculerPartenaire } from "../actions";
import { Corbeille, LigneElement } from "../elements";
import { FormulairePartenaire } from "../formulaires";

export const metadata = { title: "Partenaires" };

/** Le domaine seul, lisible ; un lien malforme ne doit pas faire tomber la page. */
function domaine(lien: string): string {
  try {
    return new URL(lien).hostname;
  } catch {
    return lien;
  }
}

export default async function PagePartenaires() {
  await exigerDroit("gererProjet");

  const liste = await listePartenaires();
  const corbeille = await listePartenaires(true);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <section>
        <p className="mb-4 max-w-prose text-sm text-[var(--color-craie-douce)]">
          Les logos du bandeau partenaires, dans l&apos;ordre d&apos;affichage.
          Un partenaire en pause reste ici sans apparaître sur le site.
        </p>
        {liste.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-6 text-sm text-[var(--color-craie-tenue)]">
            Aucun partenaire pour l&apos;instant.
          </p>
        ) : (
          <ul className="space-y-3">
            {liste.map((partenaire, index) => (
              <LigneElement
                key={partenaire.id}
                liste="partenaires"
                id={partenaire.id}
                titre={partenaire.nom}
                premier={index === 0}
                dernier={index === liste.length - 1}
                details={
                  <>
                    {partenaire.actif ? "affiché" : "en pause"}
                    {partenaire.lien ? ` · ${domaine(partenaire.lien)}` : ""}
                  </>
                }
                actions={
                  <form action={basculerPartenaire}>
                    <input type="hidden" name="id" value={partenaire.id} />
                    <button type="submit" className="text-[var(--color-craie-douce)] hover:underline">
                      {partenaire.actif ? "Mettre en pause" : "Réafficher"}
                    </button>
                  </form>
                }
              >
                <FormulairePartenaire
                  initiales={{
                    id: String(partenaire.id),
                    nom: partenaire.nom,
                    lien: partenaire.lien ?? "",
                  }}
                />
              </LigneElement>
            ))}
          </ul>
        )}
        <Corbeille
          liste="partenaires"
          elements={corbeille.map((partenaire) => ({ id: partenaire.id, libelle: partenaire.nom }))}
        />
      </section>

      <aside className="self-start rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
        <h2 className="text-sm font-semibold">Ajouter un partenaire</h2>
        <div className="mt-4">
          <FormulairePartenaire />
        </div>
      </aside>
    </div>
  );
}
