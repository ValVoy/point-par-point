"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Un ecran d'administration qui echoue (audit F1) : la navigation reste en
 * place, seule la zone de travail est remplacee. On dit quoi faire, sans
 * detail technique a l'ecran.
 */
export default function ErreurAdministration({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[administration] erreur d'ecran", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="max-w-prose rounded-xl border border-[var(--color-erreur)] bg-[var(--color-nuit-surface)] p-5">
      <h1 className="titre-admin text-2xl">Cet écran n&apos;a pas pu s&apos;afficher</h1>
      <p className="mt-2 text-sm text-[var(--color-craie-douce)]">
        Rien n&apos;a été perdu de ce qui était déjà enregistré. Réessayez ; si le problème revient, prévenez
        Valentin en lui disant sur quel écran c&apos;était.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="action-admin text-sm text-[var(--color-turquoise)]">
          Réessayer
        </button>
        <Link href="/administration" className="action-admin text-sm text-[var(--color-craie-douce)]">
          Tableau de bord
        </Link>
      </div>
    </section>
  );
}
