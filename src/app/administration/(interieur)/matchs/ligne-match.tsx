import Link from "next/link";
import { dateEtHeure } from "@/lib/dates";
import { PastilleResultat } from "@/components/pastille-resultat";
import { LIBELLES_ETAT } from "@/lib/etats-rencontre";
import { scoreASaisir, type RencontreAvecSets } from "@/lib/rencontres";

/**
 * Le score tel qu'on le lit : le total en sets, puis le detail quand il
 * existe. Un match joue sans total (saisie partielle) n'affiche rien plutot
 * qu'un « 0-0 » qui mentirait.
 */
function Score({ rencontre }: { rencontre: RencontreAvecSets }) {
  if (rencontre.setsNous === null || rencontre.setsEux === null) return null;
  const victoire = rencontre.setsNous > rencontre.setsEux;

  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
      <PastilleResultat victoire={victoire} />
      <span className={`tabular-nums ${victoire ? "font-bold" : "font-normal"}`}>
        {rencontre.setsNous}-{rencontre.setsEux}
      </span>
      {rencontre.sets.length > 0 ? (
        <span className="text-xs text-[var(--color-craie-tenue)] tabular-nums">
          {rencontre.sets
            .map((set) => `${set.pointsNous ?? "?"}-${set.pointsEux ?? "?"}`)
            .join(" · ")}
        </span>
      ) : null}
    </p>
  );
}

export function LigneMatch({ rencontre }: { rencontre: RencontreAvecSets }) {
  const aSaisir = scoreASaisir(rencontre);

  return (
    <li
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border bg-[var(--color-nuit-surface)] p-4 ${
        aSaisir ? "border-[var(--color-turquoise)]" : "border-[var(--color-nuit-trait)]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--color-craie-tenue)] first-letter:uppercase">
          {dateEtHeure(rencontre.joueLe)}
        </p>
        <p className="mt-0.5 font-medium">
          {rencontre.aDomicile ? "Contre " : "Chez "}
          {rencontre.adversaire}
          <span className="ml-2 rounded bg-[var(--color-nuit)] px-1.5 py-0.5 text-xs font-normal text-[var(--color-craie-douce)]">
            {rencontre.aDomicile ? "domicile" : "extérieur"}
          </span>
          {rencontre.etat === "annulee" || rencontre.etat === "reportee" ? (
            <span className="ml-1.5 rounded border border-[var(--color-craie-tenue)] px-1.5 py-px text-xs font-normal text-[var(--color-craie-douce)]">
              {LIBELLES_ETAT[rencontre.etat].toLowerCase()}
            </span>
          ) : null}
        </p>
        {rencontre.etat === "jouee" ? <Score rencontre={rencontre} /> : null}
      </div>

      <div className="flex items-center gap-3 text-sm">
        {rencontre.etat === "annulee" ? null : (
          <Link
            href={`/administration/matchs/${rencontre.id}/score`}
            className={
              aSaisir
                ? "rounded-lg bg-[var(--color-turquoise)] inline-flex min-h-11 items-center px-3 font-medium text-[var(--color-nuit-surface)]"
                : "text-[var(--color-turquoise)] action-admin"
            }
          >
            {aSaisir ? "Saisir le score" : "Score"}
          </Link>
        )}
        <Link
          href={`/administration/matchs/${rencontre.id}`}
          className="text-[var(--color-craie-douce)] action-admin"
        >
          Modifier
        </Link>
      </div>
    </li>
  );
}
