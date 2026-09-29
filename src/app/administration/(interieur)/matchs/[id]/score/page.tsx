import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerDroit } from "@/lib/auth/session-courante";
import { dateEtHeure } from "@/lib/dates";
import { rencontreParId } from "@/lib/rencontres";
import { SaisieScore } from "./saisie-score";

export const metadata = { title: "Score" };

export default async function PageScore({
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

  const setsInitiaux = rencontre.sets.map((set) => ({
    nous: set.pointsNous?.toString() ?? "",
    eux: set.pointsEux?.toString() ?? "",
  }));
  // Un total sans detail des sets : la saisie precedente etait un score final
  // seul, et l'ecran doit se rouvrir dans le meme mode.
  const finalInitial =
    rencontre.sets.length === 0 &&
    rencontre.setsNous !== null &&
    rencontre.setsEux !== null
      ? { nous: rencontre.setsNous.toString(), eux: rencontre.setsEux.toString() }
      : null;

  return (
    <div className="mx-auto max-w-md">
      <Link
        href={`/administration/matchs?saison=${rencontre.saisonId}`}
        className="text-sm text-[var(--color-accent)] hover:underline"
      >
        Retour aux matchs
      </Link>

      <h1 className="mt-3 font-[family-name:var(--font-titre)] text-3xl">
        {rencontre.aDomicile ? "Contre " : "Chez "}
        {rencontre.adversaire}
      </h1>
      <p className="mt-1 text-sm text-[var(--color-encre-douce)] first-letter:uppercase">
        {dateEtHeure(rencontre.joueLe)}
      </p>

      <div className="mt-6">
        <SaisieScore
          id={rencontre.id}
          adversaire={rencontre.adversaire}
          setsInitiaux={setsInitiaux}
          finalInitial={finalInitial}
        />
      </div>
    </div>
  );
}
