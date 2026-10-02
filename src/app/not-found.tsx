import type { Metadata } from "next";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";

/**
 * La page introuvable (audit du 01-10-2026, F1 et U2) : dans l'identite du
 * site, en francais, avec de quoi repartir. Elle remplace la page anglaise
 * par defaut de Next, sans navigation ni retour.
 */
export const metadata: Metadata = { title: "Page introuvable" };

const SORTIES = [
  { href: "/", nom: "L'accueil" },
  { href: "/matchs", nom: "Les matchs" },
  { href: "/effectif", nom: "L'effectif" },
  { href: "/serie", nom: "La série" },
];

export default function PageIntrouvable() {
  return (
    <>
      <EnTete />
      <main id="contenu" className="colonne-large min-h-[70svh] pt-16 pb-[var(--air-chapitre)] sm:pt-24">
        <p className="etiquette text-[var(--color-turquoise)]">Erreur 404</p>
        <h1 className="titre-affiche titre-page mt-4">Balle dehors</h1>
        <p className="chapeau mt-[var(--titre-contenu)] max-w-[40ch] text-[var(--color-craie-douce)]">
          Cette page n&apos;existe pas, ou plus. L&apos;adresse a peut-être changé : repartez d&apos;ici.
        </p>
        <ul className="mt-10 flex flex-wrap gap-3">
          {SORTIES.map((s, i) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className={
                  i === 0
                    ? "inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
                    : "inline-flex min-h-12 items-center border-2 border-[var(--color-craie-tenue)] px-6 font-semibold hover:border-[var(--color-craie)]"
                }
              >
                {s.nom}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <PiedDePage />
    </>
  );
}
