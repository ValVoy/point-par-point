import Link from "next/link";
import { exigerDroit } from "@/lib/auth/session-courante";
import { saisonAAfficher, saisonsActives } from "@/lib/saisons";
import { dateCourte } from "@/lib/dates";
import {
  rencontresALaCorbeille,
  rencontresDeLaSaison,
  scoreASaisir,
  type RencontreAvecSets,
} from "@/lib/rencontres";
import { FormulaireMatch } from "./formulaire-match";
import { LigneMatch } from "./ligne-match";
import { restaurerMatch } from "./actions";

export const metadata = { title: "Matchs" };

function Groupe({
  titre,
  aide,
  rencontres,
}: {
  titre: string;
  aide?: string;
  rencontres: RencontreAvecSets[];
}) {
  if (rencontres.length === 0) return null;
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-sm font-semibold text-[var(--color-encre-douce)]">
        {titre} <span className="font-normal">({rencontres.length})</span>
      </h2>
      {aide ? (
        <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">{aide}</p>
      ) : null}
      <ul className="mt-3 space-y-3">
        {rencontres.map((rencontre) => (
          <LigneMatch key={rencontre.id} rencontre={rencontre} />
        ))}
      </ul>
    </section>
  );
}

export default async function PageMatchs({
  searchParams,
}: {
  searchParams: Promise<{ saison?: string; ajoutes?: string }>;
}) {
  await exigerDroit("saisirResultats");

  const parametres = await searchParams;
  const demandee = parametres.saison ? Number(parametres.saison) : null;
  const saison = await saisonAAfficher(demandee);
  const saisons = await saisonsActives();

  if (!saison) {
    return (
      <>
        <h1 className="titre-admin text-3xl">Matchs</h1>
        <p className="mt-4 rounded-xl border border-dashed border-[var(--color-trait)] p-6 text-sm text-[var(--color-encre-tenue)]">
          Il faut d&apos;abord créer une saison : chaque match s&apos;y rattache.
        </p>
      </>
    );
  }

  const toutes = await rencontresDeLaSaison(saison.id);
  const corbeille = await rencontresALaCorbeille(saison.id);
  const ajoutes = Number(parametres.ajoutes);

  const aSaisir = toutes.filter((r) => scoreASaisir(r));
  const aVenir = toutes.filter(
    (r) => (r.etat === "a_venir" && !scoreASaisir(r)) || r.etat === "reportee",
  );
  // Les matchs joues se lisent du plus recent au plus ancien : c'est le
  // dernier resultat qu'on vient corriger, rarement celui de septembre.
  const joues = toutes.filter((r) => r.etat === "jouee").reverse();
  const annules = toutes.filter((r) => r.etat === "annulee");

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h1 className="titre-admin text-3xl">Matchs</h1>
        <nav className="flex gap-2 text-sm">
          {saisons.map((autre) => (
            <Link
              key={autre.id}
              href={`/administration/matchs?saison=${autre.id}`}
              className={
                autre.id === saison.id
                  ? "rounded bg-[var(--color-accent-sourd)] px-2 py-0.5 text-[var(--color-accent)]"
                  : "px-2 py-0.5 text-[var(--color-encre-douce)] hover:underline"
              }
            >
              {autre.libelle}
            </Link>
          ))}
        </nav>
        <Link
          href={`/administration/matchs/calendrier?saison=${saison.id}`}
          className="ml-auto rounded-lg border border-[var(--color-trait)] bg-white px-3 py-1.5 text-sm text-[var(--color-encre-douce)] hover:border-[var(--color-accent)]"
        >
          Saisir le calendrier
        </Link>
      </div>

      <p className="mt-2 max-w-prose text-sm text-[var(--color-encre-douce)]">
        {toutes.length} {toutes.length > 1 ? "matchs" : "match"} pour la saison{" "}
        {saison.libelle}.
      </p>

      {Number.isInteger(ajoutes) && ajoutes > 0 ? (
        <p
          role="status"
          className="mt-4 rounded-lg bg-[var(--color-victoire)]/10 px-3 py-2 text-sm text-[var(--color-victoire)]"
        >
          {ajoutes} {ajoutes > 1 ? "matchs ajoutés" : "match ajouté"} au calendrier.
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          {toutes.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-trait)] p-6 text-sm text-[var(--color-encre-tenue)]">
              Aucun match pour cette saison. Le plus rapide est de{" "}
              <Link
                href={`/administration/matchs/calendrier?saison=${saison.id}`}
                className="text-[var(--color-accent)] hover:underline"
              >
                saisir tout le calendrier d&apos;un coup
              </Link>
              .
            </p>
          ) : null}

          <Groupe
            titre="Score à saisir"
            aide="Ces matchs sont passés et n'ont pas encore de score."
            rencontres={aSaisir}
          />
          <Groupe titre="À venir" rencontres={aVenir} />
          <Groupe titre="Joués" rencontres={joues} />
          <Groupe titre="Annulés" rencontres={annules} />

          {corbeille.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-[var(--color-encre-douce)]">
                Corbeille
              </h2>
              <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">
                Rien n&apos;est effacé : ces matchs peuvent revenir, avec leur score.
              </p>
              <ul className="mt-3 space-y-2">
                {corbeille.map((rencontre) => (
                  <li
                    key={rencontre.id}
                    className="flex items-center gap-4 rounded-lg border border-dashed border-[var(--color-trait)] px-4 py-2.5 text-sm"
                  >
                    <span className="text-[var(--color-encre-tenue)]">
                      {dateCourte(rencontre.joueLe)} · {rencontre.adversaire}
                    </span>
                    <form action={restaurerMatch} className="ml-auto">
                      <input type="hidden" name="id" value={rencontre.id} />
                      <button
                        type="submit"
                        className="text-[var(--color-accent)] hover:underline"
                      >
                        Restaurer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="self-start rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-5">
          <h2 className="text-sm font-semibold">Ajouter un match</h2>
          <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">
            Un match isolé : amical, coupe, report. Pour la saison entière,
            passez par la saisie du calendrier.
          </p>
          <div className="mt-4">
            <FormulaireMatch saisonId={saison.id} />
          </div>
        </aside>
      </div>
    </>
  );
}
