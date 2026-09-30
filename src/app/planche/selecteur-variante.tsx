"use client";

import { useState } from "react";

/*
 * Bascule toute la planche d'une variante de palette a l'autre, pour juger la
 * modernite sur le rendu reel plutot que sur des descriptions. Agit seulement
 * sur l'attribut data-variante de la planche : les teintes de chaque variante
 * vivent dans planche.module.css. Outil de travail, retire une fois tranche.
 */

const VARIANTES = [
  { id: "", nom: "Actuelle" },
  { id: "eclat", nom: "Éclat" },
  { id: "net", nom: "Net" },
  { id: "eclat net", nom: "Éclat et net" },
];

export function SelecteurVariante() {
  const [active, setActive] = useState("");

  function choisir(id: string) {
    setActive(id);
    const planche = document.querySelector<HTMLElement>("[data-planche]");
    if (planche) planche.dataset.variante = id;
  }

  return (
    <div
      role="group"
      aria-label="Variante de palette"
      className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1 border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-1 text-sm"
    >
      {VARIANTES.map((v) => (
        <button
          key={v.nom}
          type="button"
          aria-pressed={active === v.id}
          onClick={() => choisir(v.id)}
          className="px-3 py-2 font-semibold whitespace-nowrap text-[var(--color-craie-douce)] aria-pressed:bg-[var(--color-craie)] aria-pressed:text-[var(--color-nuit)]"
        >
          {v.nom}
        </button>
      ))}
    </div>
  );
}
