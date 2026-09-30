import { exigerDroit } from "@/lib/auth/session-courante";
import { membres } from "@/lib/projet";
import { Corbeille, LigneElement } from "../elements";
import { FormulaireMembre } from "../formulaires";

export const metadata = { title: "L'équipe derrière" };

export default async function PageEquipe() {
  await exigerDroit("gererProjet");

  const liste = await membres();
  const corbeille = await membres(true);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <section>
        <p className="mb-4 max-w-prose text-sm text-[var(--color-craie-douce)]">
          Celles et ceux qui font vivre le projet sans être sur le terrain :
          encadrement, tournage, montage. Les joueurs, eux, sont dans
          l&apos;effectif.
        </p>
        {liste.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-6 text-sm text-[var(--color-craie-tenue)]">
            Personne pour l&apos;instant.
          </p>
        ) : (
          <ul className="space-y-3">
            {liste.map((membre, index) => (
              <LigneElement
                key={membre.id}
                liste="staff"
                id={membre.id}
                titre={membre.nom}
                details={membre.role}
                premier={index === 0}
                dernier={index === liste.length - 1}
              >
                <FormulaireMembre
                  initiales={{
                    id: String(membre.id),
                    nom: membre.nom,
                    role: membre.role,
                    texte: membre.texte ?? "",
                  }}
                />
              </LigneElement>
            ))}
          </ul>
        )}
        <Corbeille
          liste="staff"
          elements={corbeille.map((membre) => ({ id: membre.id, libelle: membre.nom }))}
        />
      </section>

      <aside className="self-start rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
        <h2 className="text-sm font-semibold">Ajouter une personne</h2>
        <div className="mt-4">
          <FormulaireMembre />
        </div>
      </aside>
    </div>
  );
}
