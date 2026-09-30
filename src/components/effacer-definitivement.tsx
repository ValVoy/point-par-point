"use client";

import { useId, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * Bouton d'effacement definitif (audit R1) : il ne s'active qu'une fois la
 * case « Je comprends » cochee, et le serveur refait le controle. Rien ne se
 * perd sur un clic de travers.
 */

function Bouton({ actif, libelle }: { actif: boolean; libelle: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={!actif || pending}
      className="action-admin border-[var(--color-erreur)] text-sm text-[var(--color-erreur)] disabled:opacity-40"
    >
      {pending ? "Effacement…" : libelle}
    </button>
  );
}

export function EffacerDefinitivement({
  action,
  champs,
  libelle = "Effacer définitivement",
  explication,
}: {
  action: (donnees: FormData) => Promise<void>;
  champs: Record<string, string | number>;
  libelle?: string;
  explication: string;
}) {
  const [compris, setCompris] = useState(false);
  const id = useId();
  return (
    <form action={action} className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {Object.entries(champs).map(([nom, valeur]) => (
        <input key={nom} type="hidden" name={nom} value={valeur} />
      ))}
      <input type="hidden" name="confirme" value={compris ? "1" : ""} />
      <label htmlFor={id} className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-craie-douce)]">
        <input id={id} type="checkbox" checked={compris} onChange={(e) => setCompris(e.currentTarget.checked)} className="size-5 accent-[var(--color-erreur)]" />
        {explication}
      </label>
      <Bouton actif={compris} libelle={libelle} />
    </form>
  );
}
