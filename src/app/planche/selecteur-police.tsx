"use client";

import { useState } from "react";
import type { Candidate } from "./polices";

/*
 * Bascule la police des cartes et du tableau de score d'une candidate a
 * l'autre, pour comparer en situation et pas seulement en specimen. Agit sur
 * deux variables CSS de la planche, rien d'autre.
 */
export function SelecteurPolice({ candidates }: { candidates: Candidate[] }) {
  const [active, setActive] = useState(candidates[0]?.id);

  function choisir(c: Candidate) {
    setActive(c.id);
    const planche = document.querySelector<HTMLElement>("[data-planche]");
    planche?.style.setProperty("--titre", c.famille);
    planche?.style.setProperty("--titre-largeur", c.largeur ?? "100%");
  }

  return (
    <div
      role="group"
      aria-label="Police des titres"
      className="fixed right-4 bottom-4 z-10 flex gap-1 rounded-full border border-[var(--trait)] bg-[var(--nuit-surface)]/90 p-1 text-sm shadow-lg backdrop-blur"
    >
      {candidates.map((c) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={active === c.id}
          onClick={() => choisir(c)}
          className="rounded-full px-4 py-2 font-semibold text-[var(--craie-douce)] aria-pressed:bg-[var(--turquoise)] aria-pressed:text-[var(--nuit)]"
        >
          {c.id.toUpperCase()}
          <span className="sr-only"> : {c.nom}</span>
        </button>
      ))}
    </div>
  );
}
