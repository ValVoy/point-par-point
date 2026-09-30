"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ONGLETS = [
  { href: "/administration/projet", libelle: "Chronologie" },
  { href: "/administration/projet/equipe", libelle: "L'équipe derrière" },
  { href: "/administration/projet/partenaires", libelle: "Partenaires" },
];

export function Onglets() {
  const chemin = usePathname();
  return (
    <nav className="mt-6 flex gap-1 border-b border-[var(--color-nuit-trait)] text-sm">
      {ONGLETS.map((onglet) => {
        const actif = chemin === onglet.href;
        return (
          <Link
            key={onglet.href}
            href={onglet.href}
            aria-current={actif ? "page" : undefined}
            className={`-mb-px border-b-2 px-3 py-2 ${
              actif
                ? "border-[var(--color-turquoise)] text-[var(--color-craie)]"
                : "border-transparent text-[var(--color-craie-douce)] hover:text-[var(--color-turquoise)]"
            }`}
          >
            {onglet.libelle}
          </Link>
        );
      })}
    </nav>
  );
}
