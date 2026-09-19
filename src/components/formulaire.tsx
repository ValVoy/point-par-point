"use client";

import { useFormStatus } from "react-dom";

/**
 * Primitives de formulaire de l'administration. Elles existent pour une raison
 * simple : sans elles, les memes vingt classes seraient recopiees dans chaque
 * ecran, et le jour ou l'on change la couleur de focus, on en oublierait un.
 */

const CLASSE_CHAMP =
  "mt-1.5 w-full rounded-lg border border-[var(--color-trait)] bg-white px-3 py-2 text-[var(--color-encre)] outline-none focus:border-[var(--color-accent)]";

const CLASSE_LABEL = "block text-sm font-medium text-[var(--color-encre-douce)]";

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
  return (
    <div>
      <label htmlFor={nom} className={CLASSE_LABEL}>
        {libelle}
        {requis ? null : (
          <span className="ml-1.5 text-xs font-normal text-[var(--color-encre-tenue)]">
            facultatif
          </span>
        )}
      </label>
      <input
        id={nom}
        name={nom}
        type={type}
        defaultValue={valeur ?? ""}
        required={requis}
        className={CLASSE_CHAMP}
        {...reste}
      />
      {aide ? (
        <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">{aide}</p>
      ) : null}
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
  return (
    <div>
      <label htmlFor={nom} className={CLASSE_LABEL}>
        {libelle}
      </label>
      <select
        id={nom}
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
}: {
  nom: string;
  libelle: string;
  valeur?: string | null;
  lignes?: number;
  aide?: string;
}) {
  return (
    <div>
      <label htmlFor={nom} className={CLASSE_LABEL}>
        {libelle}
        <span className="ml-1.5 text-xs font-normal text-[var(--color-encre-tenue)]">
          facultatif
        </span>
      </label>
      <textarea
        id={nom}
        name={nom}
        rows={lignes}
        defaultValue={valeur ?? ""}
        className={CLASSE_CHAMP}
      />
      {aide ? (
        <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">{aide}</p>
      ) : null}
    </div>
  );
}

export function CaseACocher({
  nom,
  libelle,
  coche,
}: {
  nom: string;
  libelle: string;
  coche?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--color-encre-douce)]">
      <input
        type="checkbox"
        name={nom}
        defaultChecked={coche}
        className="size-4 rounded border-[var(--color-trait)]"
      />
      {libelle}
    </label>
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
      ? "bg-[var(--color-encre)] text-[var(--color-papier)]"
      : "border border-[var(--color-trait)] bg-white text-[var(--color-encre-douce)]";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 ${classes}`}
    >
      {pending ? "..." : children}
    </button>
  );
}

export function Erreur({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-[var(--color-defaite)]/10 px-3 py-2 text-sm text-[var(--color-defaite)]"
    >
      {message}
    </p>
  );
}
