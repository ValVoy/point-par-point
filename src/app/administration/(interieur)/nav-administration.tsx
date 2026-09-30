"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Les rubriques de l'administration (audit du 01-10-2026, U3). Au telephone,
 * elles passent a la ligne plutot que de defiler hors de l'ecran : la pastille
 * des messages non lus reste visible. Chaque lien fait 44 px et la rubrique
 * courante est marquee, pour l'oeil comme pour un lecteur d'ecran.
 */
export function NavAdministration({ rubriques, nonLus }: { rubriques: { href: string; libelle: string }[]; nonLus: number }) {
  const chemin = usePathname();
  const active = (href: string) => (href === "/administration" ? chemin === href : chemin === href || chemin.startsWith(`${href}/`));

  return (
    <nav aria-label="Rubriques de l'administration" className="mx-auto max-w-5xl px-4">
      <ul className="flex flex-wrap gap-x-5 text-sm">
        {rubriques.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              aria-current={active(r.href) ? "page" : undefined}
              className="inline-flex min-h-11 items-center border-b-2 border-transparent text-[var(--color-craie-douce)] hover:text-[var(--color-craie)] aria-[current=page]:border-[var(--color-jaune)] aria-[current=page]:text-[var(--color-craie)]"
            >
              {r.libelle}
              {r.href === "/administration/messages" && nonLus > 0 ? (
                <span className="ml-1.5 rounded-full bg-[var(--color-jaune)] px-1.5 text-xs font-semibold text-[var(--color-nuit)]">
                  {nonLus}
                  <span className="sr-only"> non lu{nonLus > 1 ? "s" : ""}</span>
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
