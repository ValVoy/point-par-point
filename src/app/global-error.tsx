"use client";

import "./globals.css";

/**
 * Le dernier filet (audit F1) : quand meme la mise en page racine echoue. Il
 * remplace tout le document, sans police ni composant du site, et ne depend
 * de rien d'autre que de la feuille de style.
 */
export default function ErreurGlobale({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-[var(--color-nuit)] text-[var(--color-craie)]">
        <main className="mx-auto max-w-xl px-4 pt-24">
          <h1 className="text-4xl font-bold">Le site fait une pause</h1>
          <p className="mt-4 text-lg text-[var(--color-craie-douce)]">
            Il n&apos;a pas pu s&apos;afficher. Réessayez dans un instant.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)]"
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
