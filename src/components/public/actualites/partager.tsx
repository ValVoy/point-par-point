"use client";

import { useState } from "react";

/**
 * Partager un article : le partage natif du telephone quand il existe
 * (Instagram, WhatsApp, messages), sinon la copie du lien. Aucun bouton de
 * reseau social, donc aucun script tiers ni pistage.
 */
export function Partager({ titre }: { titre: string }) {
  const [copie, setCopie] = useState(false);

  async function partager() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, url });
        return;
      } catch {
        // Partage annule par le visiteur : rien a faire.
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2500);
    } catch {
      // Presse-papiers refuse : le lien reste dans la barre d'adresse.
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={partager}
        className="inline-flex min-h-12 items-center border-2 border-[var(--color-craie-tenue)] px-5 font-semibold transition-colors duration-[80ms] hover:border-[var(--color-craie)] hover:bg-[var(--color-craie)] hover:text-[var(--color-nuit)]"
      >
        Partager l&apos;article
      </button>
      <p role="status" className="text-sm text-[var(--color-craie-douce)]">
        {copie ? "Lien copié." : ""}
      </p>
    </div>
  );
}
