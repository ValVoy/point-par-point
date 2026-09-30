"use client";

import { useState } from "react";

/**
 * Le mot de passe provisoire, affiche une seule fois. Il n'est ni stocke ni
 * retrouvable : fermer la page le perd, et il faut alors en generer un autre.
 */
export function MotDePasseProvisoire({ nom, email, motDePasse }: { nom: string; email: string; motDePasse: string }) {
  const [copie, setCopie] = useState(false);
  return (
    <div role="status" className="mt-3 rounded-xl border border-[var(--color-jaune)] bg-[var(--color-nuit)] p-4 text-sm">
      <p className="text-[var(--color-craie-douce)]">
        Mot de passe provisoire de <strong className="text-[var(--color-craie)]">{nom}</strong> ({email}) :
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-3">
        <code className="rounded-lg bg-[var(--color-nuit-surface)] px-3 py-2 font-mono text-lg tracking-[0.12em] text-[var(--color-craie)] select-all">
          {motDePasse}
        </code>
        <button
          type="button"
          className="action-admin text-[var(--color-turquoise)]"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(motDePasse);
              setCopie(true);
            } catch {
              setCopie(false);
            }
          }}
        >
          {copie ? "Copié" : "Copier"}
        </button>
      </p>
      <p className="mt-2 text-xs text-[var(--color-craie-tenue)]">
        Transmettez-le de vive voix ou par message privé. Il ne sera plus affiché : la personne le remplace
        depuis « Mon compte » à sa première connexion.
      </p>
    </div>
  );
}
