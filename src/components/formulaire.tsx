"use client";

import { useId } from "react";
import { useFormStatus } from "react-dom";

/**
 * Primitives de formulaire de l'administration. Elles existent pour une raison
 * simple : sans elles, les memes vingt classes seraient recopiees dans chaque
 * ecran, et le jour ou l'on change la couleur de focus, on en oublierait un.
 *
 * Audit du 01-10-2026 : identifiants uniques par instance (U1, plusieurs
 * formulaires d'une meme page portaient les memes `id`), aide reliee au champ
 * (U8), bord de champ a 3,5:1 et anneau de focus du site (G1, G3).
 */

export const CLASSE_CHAMP =
  "mt-1.5 w-full rounded-lg border border-[var(--color-nuit-bord)] bg-[var(--color-nuit)] px-3 py-2 text-base text-[var(--color-craie)] focus:border-[var(--color-turquoise)]";

/** Un identifiant unique par instance, lisible dans le DOM. */
function useIdentifiant(nom: string) {
  return `${nom}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

function Facultatif() {
  return (
    <>
      {" "}
      <span className="ml-1 text-xs font-normal text-[var(--color-craie-tenue)]">(facultatif)</span>
    </>
  );
}

function Aide({ id, texte }: { id: string; texte?: string }) {
  return texte ? (
    <p id={id} className="mt-1 text-xs text-[var(--color-craie-tenue)]">
      {texte}
    </p>
  ) : null;
}

const CLASSE_LABEL = "block text-sm font-medium text-[var(--color-craie-douce)]";

export function Champ({
  nom,
  libelle,
  type = "text",
  valeur,
  requis,
  aide,
  ...reste
}: {
  nom: string;
  libelle: string;
  type?: string;
  valeur?: string | number;
  requis?: boolean;
  aide?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type">) {
  const id = useIdentifiant(nom);
  return (
    <div>
      <label htmlFor={id} className={CLASSE_LABEL}>
        {libelle}
        {requis ? null : <Facultatif />}
      </label>
      <input
        id={id}
        name={nom}
        aria-describedby={aide ? `${id}-aide` : undefined}
        type={type}
        defaultValue={valeur ?? ""}
        required={requis}
        className={CLASSE_CHAMP}
        {...reste}
      />
      <Aide id={`${id}-aide`} texte={aide} />
    </div>
  );
}

export function Selection({
  nom,
  libelle,
  valeur,
  options,
  requis,
}: {
  nom: string;
  libelle: string;
  valeur?: string;
  requis?: boolean;
  options: { valeur: string; libelle: string }[];
}) {
  const id = useIdentifiant(nom);
  return (
    <div>
      <label htmlFor={id} className={CLASSE_LABEL}>
        {libelle}
      </label>
      <select
        id={id}
        name={nom}
        defaultValue={valeur}
        required={requis}
        className={CLASSE_CHAMP}
      >
        {options.map((option) => (
          <option key={option.valeur} value={option.valeur}>
            {option.libelle}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ZoneTexte({
  nom,
  libelle,
  valeur,
  lignes = 4,
  aide,
  max,
}: {
  nom: string;
  libelle: string;
  valeur?: string | null;
  lignes?: number;
  aide?: string;
  /** Longueur maximale, tenue aussi par le navigateur (audit W4). */
  max?: number;
}) {
  const id = useIdentifiant(nom);
  return (
    <div>
      <label htmlFor={id} className={CLASSE_LABEL}>
        {libelle}
        <Facultatif />
      </label>
      <textarea
        id={id}
        name={nom}
        rows={lignes}
        maxLength={max}
        defaultValue={valeur ?? ""}
        aria-describedby={aide ? `${id}-aide` : undefined}
        className={CLASSE_CHAMP}
      />
      <Aide id={`${id}-aide`} texte={aide} />
    </div>
  );
}

/**
 * Bouton de soumission. Il se desactive pendant l'envoi : sans cela, un double
 * clic cree deux fois la meme saison, et personne ne comprend pourquoi.
 */
export function BoutonEnvoi({
  children,
  variante = "principal",
}: {
  children: React.ReactNode;
  variante?: "principal" | "discret";
}) {
  const { pending } = useFormStatus();
  const classes =
    variante === "principal"
      ? "bg-[var(--color-craie)] text-[var(--color-nuit-surface)]"
      : "border border-[var(--color-nuit-trait)] bg-[var(--color-nuit)] text-[var(--color-craie-douce)]";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 ${classes}`}
    >
      {pending ? "Enregistrement…" : children}
    </button>
  );
}

export function Erreur({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-[var(--color-erreur)]/10 px-3 py-2 text-sm text-[var(--color-erreur)]"
    >
      {message}
    </p>
  );
}
