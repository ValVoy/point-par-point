import Link from "next/link";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { effectifs, joueurs } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";
import { saisonAAfficher, saisonsActives } from "@/lib/saisons";
import { age } from "@/lib/dates";
import { rangPoste } from "@/lib/postes";
import { FormulaireJoueur } from "./formulaire-joueur";
import { LigneEffectifModifiable } from "./ligne-effectif";
import { reintegrerDansLEffectif } from "./actions";

export const metadata = { title: "Effectif" };

export default async function PageEffectif({
  searchParams,
}: {
  searchParams: Promise<{ saison?: string }>;
}) {
  await exigerDroit("gererEffectif");

  const parametres = await searchParams;
  const demandee = parametres.saison ? Number(parametres.saison) : null;
  const saison = await saisonAAfficher(demandee);
  const saisons = await saisonsActives();

  if (!saison) {
    return (
      <>
        <h1 className="titre-admin text-3xl">
          Effectif
        </h1>
        <p className="mt-4 rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-6 text-sm text-[var(--color-craie-tenue)]">
          Il faut d&apos;abord créer une saison : l&apos;effectif s&apos;y
          rattache, puisque numéro et poste changent d&apos;une année sur
          l&apos;autre.{" "}
          <Link
            href="/administration/saisons"
            className="text-[var(--color-turquoise)] hover:underline"
          >
            Créer une saison
          </Link>
        </p>
      </>
    );
  }

  const lignes = await db()
    .select({
      effectifId: effectifs.id,
      numero: effectifs.numero,
      poste: effectifs.poste,
      capitaine: effectifs.capitaine,
      prenom: joueurs.prenom,
      nom: joueurs.nom,
      neLe: joueurs.neLe,
      tailleCm: joueurs.tailleCm,
    })
    .from(effectifs)
    .innerJoin(joueurs, eq(effectifs.joueurId, joueurs.id))
    .where(
      and(eq(effectifs.saisonId, saison.id), isNull(effectifs.supprimeLe)),
    );

  // Tri a l'affichage plutot qu'en SQL : l'ordre voulu est celui dans lequel on
  // presente une equipe de volley, pas l'ordre alphabetique des postes.
  const triees = [...lignes].sort((a, b) => {
    const parPoste = rangPoste(a.poste) - rangPoste(b.poste);
    if (parPoste !== 0) return parPoste;
    return (a.numero ?? 999) - (b.numero ?? 999);
  });

  const retires = await db()
    .select({
      effectifId: effectifs.id,
      prenom: joueurs.prenom,
      nom: joueurs.nom,
    })
    .from(effectifs)
    .innerJoin(joueurs, eq(effectifs.joueurId, joueurs.id))
    .where(
      and(eq(effectifs.saisonId, saison.id), isNotNull(effectifs.supprimeLe)),
    );

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h1 className="titre-admin text-3xl">
          Effectif
        </h1>
        <nav className="flex gap-2 text-sm">
          {saisons.map((autre) => (
            <Link
              key={autre.id}
              href={`/administration/effectif?saison=${autre.id}`}
              className={
                autre.id === saison.id
                  ? "rounded bg-[var(--color-turquoise-sourd)] inline-flex min-h-11 items-center px-3 text-[var(--color-turquoise-clair)]"
                  : "inline-flex min-h-11 items-center px-3 text-[var(--color-craie-douce)] hover:underline"
              }
            >
              {autre.libelle}
            </Link>
          ))}
        </nav>
      </div>

      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        {triees.length} {triees.length > 1 ? "joueurs" : "joueur"} pour la
        saison {saison.libelle}. Le numéro et le poste appartiennent à la
        saison : les changer ici ne touche pas aux saisons passées.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section>
          {triees.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-6 text-sm text-[var(--color-craie-tenue)]">
              Aucun joueur pour cette saison.
            </p>
          ) : (
            <ul className="space-y-3">
              {triees.map((ligne) => (
                <li key={ligne.effectifId}>
                  <LigneEffectifModifiable
                    ligne={{
                      effectifId: ligne.effectifId,
                      nomComplet: `${ligne.prenom} ${ligne.nom}`,
                      numero: ligne.numero,
                      poste: ligne.poste,
                      capitaine: ligne.capitaine,
                      age: age(ligne.neLe),
                      tailleCm: ligne.tailleCm,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}

          {retires.length > 0 ? (
            <section className="mt-6">
              <h2 className="text-sm font-semibold text-[var(--color-craie-douce)]">
                Retirés du groupe
              </h2>
              <p className="mt-1 text-xs text-[var(--color-craie-tenue)]">
                Leur fiche et leurs statistiques restent intactes.
              </p>
              <ul className="mt-3 space-y-2">
                {retires.map((ligne) => (
                  <li
                    key={ligne.effectifId}
                    className="flex items-center gap-4 rounded-lg border border-dashed border-[var(--color-nuit-trait)] px-4 py-2.5 text-sm"
                  >
                    <span className="text-[var(--color-craie-tenue)]">
                      {ligne.prenom} {ligne.nom}
                    </span>
                    <form action={reintegrerDansLEffectif} className="ml-auto">
                      <input
                        type="hidden"
                        name="effectifId"
                        value={ligne.effectifId}
                      />
                      <button
                        type="submit"
                        className="text-[var(--color-turquoise)] action-admin"
                      >
                        Réintégrer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </section>

        <aside className="rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
          <h2 className="text-sm font-semibold">Ajouter un joueur</h2>
          <p className="mt-1 text-xs text-[var(--color-craie-tenue)]">
            Il rejoint l&apos;effectif de {saison.libelle}.
          </p>
          <div className="mt-4">
            <FormulaireJoueur saisonId={saison.id} />
          </div>
        </aside>
      </div>
    </>
  );
}
