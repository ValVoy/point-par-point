"use client";

import { useState } from "react";

/** Copier l'adresse de la salle, pour la coller dans une application de cartes ou un message. */
export function CopierAdresse({ adresse }: { adresse: string }) {
  const [message, setMessage] = useState("");

  async function copier() {
    try {
      await navigator.clipboard.writeText(adresse);
      setMessage("Adresse copiée.");
    } catch {
      setMessage("Copie impossible : sélectionnez l'adresse ci-dessus.");
    }
    window.setTimeout(() => setMessage(""), 2500);
  }

  return (
    <>
      <button
        type="button"
        onClick={copier}
        className="inline-flex min-h-12 items-center justify-center border-2 border-[var(--color-craie-tenue)] px-5 font-semibold transition-colors duration-[80ms] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]"
      >
        Copier l&apos;adresse
      </button>
      <p role="status" className="basis-full text-sm text-[var(--color-craie-douce)]">
        {message}
      </p>
    </>
  );
}
