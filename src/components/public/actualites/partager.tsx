"use client";

import { useState } from "react";

/**
 * Partager un article. Sur un ecran tactile, le partage natif du telephone
 * (Instagram, WhatsApp, messages) ; sur un ordinateur, la copie du lien, que
 * Windows et macOS exposent aussi navigator.share mais ouvrent une feuille
 * peu utile. Si le partage natif echoue pour une autre raison qu'une
 * annulation, on se rabat sur la copie. Aucun bouton de reseau social, donc
 * aucun script tiers ni pistage.
 */
export function Partager({ titre }: { titre: string }) {
  const [message, setMessage] = useState("");

  function annoncer(texte: string) {
    setMessage(texte);
    window.setTimeout(() => setMessage(""), 2500);
  }

  async function copier(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      annoncer("Lien copié.");
    } catch {
      annoncer("Copie impossible : le lien est dans la barre d'adresse.");
    }
  }

  async function partager() {
    const url = window.location.href;
    const tactile = window.matchMedia("(pointer: coarse)").matches;
    if (tactile && navigator.share) {
      try {
        await navigator.share({ title: titre, url });
        return;
      } catch (erreur) {
        // Le visiteur a ferme la feuille de partage : rien a faire.
        if (erreur instanceof DOMException && erreur.name === "AbortError") return;
      }
    }
    await copier(url);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={partager}
        className="inline-flex min-h-12 items-center border-2 border-[var(--color-craie-tenue)] px-5 font-semibold transition-colors duration-[80ms] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]"
      >
        Partager l&apos;article
      </button>
      <p role="status" className="text-sm text-[var(--color-craie-douce)]">
        {message}
      </p>
    </div>
  );
}
