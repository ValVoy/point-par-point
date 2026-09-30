"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ONGLETS = [
  { href: "/administration/projet", libelle: "Chronologie" },
  { href: "/administration/projet/equipe", libelle: "L'équipe derrière" },
  { href: "/administration/projet/partenaires", libelle: "Partenaires" },
  { href: "/administration/projet/salle", libelle: "La salle" },
];

export function Onglets() {
  const chemin = usePathname();
  return (
    <nav aria-label="Rubriques du projet" className="mt-6 flex gap-1 overflow-x-auto border-b border-[var(--color-nuit-trait)] text-sm whitespace-nowrap">
      {ONGLETS.map((onglet) => {
        const actif = chemin === onglet.href;
        return (
          <Link
            key={onglet.href}
            href={onglet.href}
            aria-current={actif ? "page" : undefined}
            className={`-mb-px inline-flex min-h-11 items-center border-b-2 px-3 ${
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
