import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerDroit } from "@/lib/auth/session-courante";
import { dateLongue, pourChampDateHeure } from "@/lib/dates";
import { rencontreParId } from "@/lib/rencontres";
import { FormulaireMatch } from "../formulaire-match";
import { mettreMatchALaCorbeille } from "../actions";

export const metadata = { title: "Modifier un match" };

export default async function PageMatch({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigerDroit("saisirResultats");

  const { id } = await params;
  const identifiant = Number(id);
  if (!Number.isInteger(identifiant)) notFound();

  const rencontre = await rencontreParId(identifiant);
  if (!rencontre || rencontre.supprimeLe) notFound();

  const [date = "", heure = ""] = pourChampDateHeure(rencontre.joueLe).split("T");

  return (
    <>
      <Link
        href={`/administration/matchs?saison=${rencontre.saisonId}`}
        className="text-sm text-[var(--color-accent)] hover:underline"
      >
        Retour aux matchs
      </Link>

      <h1 className="mt-3 titre-admin text-3xl">
        {rencontre.aDomicile ? "Contre " : "Chez "}
        {rencontre.adversaire}
      </h1>
      <p className="mt-1 text-sm text-[var(--color-encre-douce)] first-letter:uppercase">
        {dateLongue(rencontre.joueLe)}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_16rem]">
        <div className="max-w-xl rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-5">
          <FormulaireMatch
            saisonId={rencontre.saisonId}
            match={{
              id: rencontre.id,
              date,
              heure,
              adversaire: rencontre.adversaire,
              domicile: rencontre.aDomicile,
              competition: rencontre.competition ?? "",
              salleNom: rencontre.salleNom ?? "",
              salleAdresse: rencontre.salleAdresse ?? "",
              etat: rencontre.etat,
              commentaire: rencontre.commentaire ?? "",
            }}
          />
        </div>

        <aside className="space-y-4 self-start text-sm">
          <Link
            href={`/administration/matchs/${rencontre.id}/score`}
            className="block rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-4 text-[var(--color-accent)] hover:border-[var(--color-accent)]"
          >
            {rencontre.etat === "jouee" ? "Corriger le score" : "Saisir le score"}
          </Link>

          <form
            action={mettreMatchALaCorbeille}
            className="rounded-xl border border-dashed border-[var(--color-trait)] p-4"
          >
            <input type="hidden" name="id" value={rencontre.id} />
            <p className="text-xs text-[var(--color-encre-tenue)]">
              Le match disparaît du site mais reste restaurable, score compris.
              Pour un match qui n&apos;aura pas lieu, préférez l&apos;état
              « Annulé ».
            </p>
            <button
              type="submit"
              className="mt-2 text-[var(--color-encre-tenue)] hover:underline"
            >
              Mettre à la corbeille
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
