"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { connecter, type EtatConnexion } from "./actions";

const ETAT_INITIAL: EtatConnexion = { erreur: null, email: "" };

function Bouton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-lg bg-[var(--color-craie)] px-4 py-3 text-sm font-medium text-[var(--color-nuit-surface)] transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Connexion…" : "Se connecter"}
    </button>
  );
}

export function FormulaireConnexion() {
  const [etat, action] = useActionState(connecter, ETAT_INITIAL);

  return (
    <form action={action} className="mt-8">
      <label
        htmlFor="email"
        className="block text-sm font-medium text-[var(--color-craie-douce)]"
      >
        Adresse e-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        defaultValue={etat.email}
        required
        className="mt-2 w-full rounded-lg border border-[var(--color-nuit-bord)] bg-[var(--color-nuit)] px-3 py-2.5 text-[var(--color-craie)] focus:border-[var(--color-turquoise)]"
      />

      <label
        htmlFor="motDePasse"
        className="mt-5 block text-sm font-medium text-[var(--color-craie-douce)]"
      >
        Mot de passe
      </label>
      <input
        id="motDePasse"
        name="motDePasse"
        type="password"
        autoComplete="current-password"
        required
        className="mt-2 w-full rounded-lg border border-[var(--color-nuit-bord)] bg-[var(--color-nuit)] px-3 py-2.5 text-[var(--color-craie)] focus:border-[var(--color-turquoise)]"
      />

      {etat.erreur ? (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-[var(--color-erreur)]/10 px-3 py-2.5 text-sm text-[var(--color-erreur)]"
        >
          {etat.erreur}
        </p>
      ) : null}

      <Bouton />
    </form>
  );
}
