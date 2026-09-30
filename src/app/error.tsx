"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Une page publique qui echoue (base injoignable, par exemple) : audit du
 * 01-10-2026, F1. Rien ici ne touche la base : cette page doit tenir quand le
 * reste ne tient plus. Le detail de l'erreur reste dans les journaux, jamais
 * a l'ecran.
 */
export default function ErreurPublique({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[site] erreur de page", error.digest ?? error.message);
  }, [error]);

  return (
    <main id="contenu" className="colonne-large pt-24 pb-24">
      <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">Temps mort</p>
      <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">Petit souci</h1>
      <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
        Cette page n&apos;a pas pu s&apos;afficher. Ce n&apos;est pas de votre fait : réessayez dans un instant.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] hover:bg-[var(--color-craie)]"
        >
          Réessayer
        </button>
        <Link href="/" className="inline-flex min-h-12 items-center border border-[var(--color-nuit-trait)] px-6 font-semibold">
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
