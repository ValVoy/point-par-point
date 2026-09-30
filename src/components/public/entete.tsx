import Link from "next/link";
import { NOM_DU_SITE } from "@/lib/site";

/**
 * L'en-tete des pages publiques hors accueil (l'accueil a son ouverture). Le
 * nom a gauche, les rubriques a droite ; seules celles qui existent sont
 * listees, on n'annonce pas une page qui n'est pas encore la.
 */

const RUBRIQUES = [
  { href: "/matchs", nom: "Matchs" },
  { href: "/serie", nom: "La série" },
];

export function EnTete({ actif }: { actif?: string }) {
  return (
    <header className="border-b border-[var(--color-nuit-trait)]">
      <div className="colonne-large flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="titre-affiche shrink-0 text-xl sm:text-2xl">
          {NOM_DU_SITE}
        </Link>
        <nav aria-label="Rubriques">
          <ul className="flex gap-4 text-sm font-semibold sm:gap-6">
            {RUBRIQUES.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  aria-current={actif === r.href ? "page" : undefined}
                  className="inline-flex min-h-12 items-center border-b-2 border-transparent text-[var(--color-craie-douce)] hover:text-[var(--color-craie)] aria-[current=page]:border-[var(--color-jaune)] aria-[current=page]:text-[var(--color-craie)]"
                >
                  {r.nom}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
