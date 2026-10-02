import type { Metadata } from "next";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { sujetInitial } from "@/lib/contact";
import { CHAINE_YOUTUBE, EQUIPE } from "@/lib/site";
import { FormulaireContact } from "./formulaire-contact";

/**
 * Contact (fiche fiches/contact.md) : une page calme, sans mouvement, ou le
 * visiteur ecrit. Le sujet arrive pre-choisi quand on vient d'un bouton
 * precis (/contact?sujet=partenariat). Sur grand ecran, une colonne dit a
 * quoi on peut repondre, et renvoie ailleurs ce qui n'a pas besoin d'un
 * message (l'heure d'un match, la salle, la serie).
 */

const REPONSES = [
  { titre: "Devenir partenaire", texte: "Soutenir l'équipe, apparaître sur le site et dans la série : on vous présente le projet." },
  { titre: "Presse ou média", texte: "Un article, un reportage, une interview : dites-nous le format et l'échéance." },
  { titre: "Rejoindre l'équipe", texte: "Joueur ou bénévole : dites-nous votre poste, votre niveau, ce qui vous amène." },
  { titre: "Une idée pour la série", texte: "Un sujet, une question à poser à l'équipe, un moment à filmer." },
];

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: `Écrire à l'équipe D2 masculine du ${EQUIPE} : question, partenariat, presse.`,
};

export default async function PageContact({ searchParams }: { searchParams: Promise<{ sujet?: string | string[] }> }) {
  const { sujet } = await searchParams;
  return (
    <>
      <EnTete actif="/contact" />
      <main id="contenu" className="colonne-large min-h-[70svh] pt-16 pb-[var(--air-chapitre)] sm:pt-24">
        <p className="etiquette text-[var(--color-turquoise)]">{EQUIPE}</p>
        <h1 className="titre-affiche titre-page mt-4">Nous écrire</h1>
        <p className="chapeau mt-[var(--titre-contenu)] max-w-[40ch] text-[var(--color-craie-douce)]">
          Une question sur un match, l&apos;envie de soutenir l&apos;équipe, un sujet pour la série : on lit tout.
        </p>
        <div className="suite grid gap-[var(--air-suite)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
          <FormulaireContact sujet={sujetInitial(typeof sujet === "string" ? sujet : undefined)} />
          <aside aria-labelledby="titre-reponses" className="lg:border-l lg:border-[var(--color-nuit-trait)] lg:pl-10">
            <h2 id="titre-reponses" className="titre-affiche titre-carte">
              Ce qu&apos;on peut vous répondre
            </h2>
            <dl className="mt-6 space-y-6">
              {REPONSES.map((r) => (
                <div key={r.titre}>
                  <dt className="etiquette text-[var(--color-turquoise)]">{r.titre}</dt>
                  <dd className="corps mt-2 text-[var(--color-craie-douce)]">{r.texte}</dd>
                </div>
              ))}
            </dl>
            <p className="corps mt-10 border-t border-[var(--color-nuit-trait)] pt-6 text-[var(--color-craie-douce)]">
              Sans attendre de réponse :{" "}
              <Link href="/matchs" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
                l&apos;heure des matchs
              </Link>
              {CHAINE_YOUTUBE ? ", " : " et "}
              <Link href="/ou-nous-voir" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
                la salle
              </Link>
              {CHAINE_YOUTUBE ? (
                <>
                  {" "}et{" "}
                  <a
                    href={CHAINE_YOUTUBE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--color-craie)] underline underline-offset-4"
                  >
                    la série sur YouTube<span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </>
              ) : null}
              .
            </p>
          </aside>
        </div>
      </main>
      <PiedDePage />
    </>
  );
}
