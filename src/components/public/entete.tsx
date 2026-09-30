import Link from "next/link";
import { NOM_DU_SITE } from "@/lib/site";

/**
 * L'en-tete des pages publiques hors accueil (l'accueil a son ouverture). Le
 * nom a gauche, les rubriques a droite ; sur un telephone, les rubriques
 * passent sous le nom plutot que de deborder. Seules les rubriques qui
 * existent sont listees : on n'annonce pas une page qui n'est pas encore la.
 */

export const RUBRIQUES = [
  { href: "/matchs", nom: "Matchs" },
  { href: "/effectif", nom: "Effectif" },
  { href: "/serie", nom: "La série" },
  { href: "/actualites", nom: "Actualités" },
];

/** Les pages de vitrine, reliees depuis le pied de page (l'en-tete n'en tiendrait pas plus au telephone). */
export const VITRINE = [
  { href: "/le-projet", nom: "Le projet" },
  { href: "/ou-nous-voir", nom: "Où nous voir" },
  { href: "/partenaires", nom: "Partenaires" },
];

export function EnTete({ actif }: { actif?: string }) {
  return (
    <header className="border-b border-[var(--color-nuit-trait)]">
      <div className="colonne-large flex flex-wrap items-center justify-between gap-x-6 pt-3 sm:min-h-16 sm:pt-0">
        <Link href="/" className="titre-affiche shrink-0 text-2xl">
          {NOM_DU_SITE}
        </Link>
        <nav aria-label="Rubriques" className="w-full sm:w-auto">
          <ul className="flex gap-5 text-sm font-semibold sm:gap-6">
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
