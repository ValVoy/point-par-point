"use client";

import { CLE_INTRO } from "@/components/public/intro/script-intro";

/** Outil du prototype : efface la memoire de visite et recharge la page. */
export function RejouerIntro() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          sessionStorage.removeItem(CLE_INTRO);
        } catch {
          // Stockage bloque : rien a effacer.
        }
        window.scrollTo(0, 0);
        window.location.reload();
      }}
      className="mt-8 rounded-full border border-[var(--color-nuit-trait)] px-5 py-2.5 text-sm font-semibold"
    >
      Rejouer l&apos;intro
    </button>
  );
}
