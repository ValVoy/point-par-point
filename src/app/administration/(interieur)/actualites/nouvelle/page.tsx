import Link from "next/link";
import { exigerDroit } from "@/lib/auth/session-courante";
import { FormulaireActualite } from "../formulaire-actualite";

export const metadata = { title: "Écrire une actualité" };

export default async function PageNouvelleActualite() {
  await exigerDroit("redigerContenu");

  return (
    <>
      <Link
        href="/administration/actualites"
        className="text-sm text-[var(--color-turquoise)] hover:underline"
      >
        Retour aux actualités
      </Link>
      <h1 className="mt-3 titre-admin text-3xl">Écrire une actualité</h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Elle s&apos;enregistre en brouillon. Vous la relirez avant de la publier.
      </p>

      <div className="mt-6 max-w-3xl rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
        <FormulaireActualite />
      </div>
    </>
  );
}
