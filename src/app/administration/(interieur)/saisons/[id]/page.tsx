import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { saisons } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";
import { pourChampDate } from "@/lib/dates";
import { FormulaireSaison } from "../formulaire";

export const metadata = { title: "Modifier une saison" };

export default async function PageSaison({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigerDroit("gererSaisons");

  const { id } = await params;
  const identifiant = Number(id);
  if (!Number.isInteger(identifiant)) notFound();

  const [saison] = await db()
    .select()
    .from(saisons)
    .where(eq(saisons.id, identifiant))
    .limit(1);

  if (!saison) notFound();

  return (
    <>
      <Link
        href="/administration/saisons"
        className="text-sm text-[var(--color-turquoise)] hover:underline"
      >
        Retour aux saisons
      </Link>

      <h1 className="mt-3 titre-admin text-3xl">
        {saison.libelle}
      </h1>

      <div className="mt-6 max-w-md rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
        <FormulaireSaison
          saison={{
            id: saison.id,
            libelle: saison.libelle,
            debuteLe: pourChampDate(saison.debuteLe),
            finitLe: pourChampDate(saison.finitLe),
          }}
        />
      </div>
    </>
  );
}
