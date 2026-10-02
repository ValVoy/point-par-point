"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Les rubriques du pied de page, avec la page en cours marquee (audit du
 * 02-10-2026, U28) : au telephone, Le projet, Ou nous voir et Contact ne sont
 * que la, et le visiteur doit pouvoir y lire ou il se trouve.
 */
export function LiensPied({ rubriques }: { rubriques: { href: string; nom: string }[] }) {
  const chemin = usePathname();
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1 font-semibold">
      {rubriques.map((r) => {
        const actif = chemin === r.href || chemin.startsWith(`${r.href}/`);
        return (
          <li key={r.href}>
            <Link
              href={r.href}
              aria-current={actif ? "page" : undefined}
              className="inline-flex min-h-12 items-center border-b-2 border-transparent hover:text-[var(--color-craie)] aria-[current=page]:border-[var(--color-jaune)] aria-[current=page]:text-[var(--color-craie)]"
            >
              {r.nom}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
