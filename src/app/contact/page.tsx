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
      <EnTete />
      <main id="contenu" className="colonne-large pt-16 pb-24 sm:pt-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">{EQUIPE}</p>
        <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">Nous écrire</h1>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
          Une question sur un match, l&apos;envie de soutenir l&apos;équipe, un sujet pour la série : on lit tout.
        </p>
        <div className="mt-12 grid gap-16 lg:grid-cols-[minmax(0,48rem)_minmax(0,1fr)] lg:gap-20">
          <FormulaireContact sujet={sujetInitial(typeof sujet === "string" ? sujet : undefined)} />
          <aside aria-labelledby="titre-reponses" className="lg:border-l lg:border-[var(--color-nuit-trait)] lg:pl-10">
            <h2 id="titre-reponses" className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
              Ce qu&apos;on peut vous répondre
            </h2>
            <dl className="mt-6 space-y-6">
              {REPONSES.map((r) => (
                <div key={r.titre}>
                  <dt className="titre-affiche text-2xl">{r.titre}</dt>
                  <dd className="mt-1 leading-relaxed text-[var(--color-craie-douce)]">{r.texte}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 border-t border-[var(--color-nuit-trait)] pt-6 leading-relaxed text-[var(--color-craie-douce)]">
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
