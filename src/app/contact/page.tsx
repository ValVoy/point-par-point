import type { Metadata } from "next";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { sujetInitial } from "@/lib/contact";
import { EQUIPE } from "@/lib/site";
import { FormulaireContact } from "./formulaire-contact";

/**
 * Contact (fiche fiches/contact.md) : une page calme, sans mouvement, ou le
 * visiteur ecrit. Le sujet arrive pre-choisi quand on vient d'un bouton
 * precis (/contact?sujet=partenariat).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: `Écrire à l'équipe D2 masculine du ${EQUIPE} : question, partenariat, presse.`,
};

export default async function PageContact({ searchParams }: { searchParams: Promise<{ sujet?: string | string[] }> }) {
  const { sujet } = await searchParams;
  return (
    <>
      <EnTete />
      <main id="contenu" className="colonne-large pt-16 pb-24 sm:pt-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">{EQUIPE}</p>
        <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">Nous écrire</h1>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
          Une question sur un match, l&apos;envie de soutenir l&apos;équipe, un sujet pour la série : on lit tout.
        </p>
        <div className="mt-12 max-w-3xl">
          <FormulaireContact sujet={sujetInitial(typeof sujet === "string" ? sujet : undefined)} />
        </div>
      </main>
      <PiedDePage />
    </>
  );
}
