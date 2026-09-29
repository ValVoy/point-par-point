import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { utilisateurCourant } from "@/lib/auth/session-courante";
import { NOM_DU_SITE } from "@/lib/site";
import { FormulaireConnexion } from "./formulaire";

export const metadata: Metadata = {
  title: "Connexion",
  // L'administration n'a rien a faire dans un moteur de recherche.
  robots: { index: false, follow: false },
};

export default async function PageConnexion() {
  // Deja connecte : inutile de redemander, on entre directement.
  if (await utilisateurCourant()) redirect("/administration");

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-16">
      <p className="text-xs font-medium tracking-widest text-[var(--color-encre-tenue)] uppercase">
        {NOM_DU_SITE}
      </p>
      <h1 className="mt-2 titre-admin text-4xl">
        Administration
      </h1>
      <p className="mt-3 text-sm text-[var(--color-encre-douce)]">
        Cet espace est réservé à l&apos;équipe.
      </p>

      <FormulaireConnexion />
    </main>
  );
}
