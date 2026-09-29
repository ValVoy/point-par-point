import Link from "next/link";
import { exigerDroit } from "@/lib/auth/session-courante";
import { saisonAAfficher } from "@/lib/saisons";
import { GrilleCalendrier } from "./grille-calendrier";

export const metadata = { title: "Saisir le calendrier" };

export default async function PageCalendrier({
  searchParams,
}: {
  searchParams: Promise<{ saison?: string }>;
}) {
  await exigerDroit("saisirResultats");

  const parametres = await searchParams;
  const saison = await saisonAAfficher(
    parametres.saison ? Number(parametres.saison) : null,
  );

  return (
    <>
      <Link
        href={`/administration/matchs${saison ? `?saison=${saison.id}` : ""}`}
        className="text-sm text-[var(--color-accent)] hover:underline"
      >
        Retour aux matchs
      </Link>

      <h1 className="mt-3 titre-admin text-3xl">
        Saisir le calendrier
      </h1>

      {saison ? (
        <>
          <p className="mt-2 max-w-prose text-sm text-[var(--color-encre-douce)]">
            Tous les matchs de la saison {saison.libelle} en une fois, depuis
            le calendrier de la fédération. Une date posée sur une ligne sans
            heure reprend l&apos;heure de la ligne du dessus. Si une ligne
            pose problème, rien n&apos;est enregistré et la grille reste
            remplie : il n&apos;y a qu&apos;à corriger.
          </p>
          <div className="mt-8">
            <GrilleCalendrier saisonId={saison.id} />
          </div>
        </>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-[var(--color-trait)] p-6 text-sm text-[var(--color-encre-tenue)]">
          Il faut d&apos;abord créer une saison.
        </p>
      )}
    </>
  );
}
