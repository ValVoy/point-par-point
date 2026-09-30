"use client";

import { useActionState } from "react";
import { BoutonEnvoi, Erreur } from "@/components/formulaire";
import { basculerActif, changerRole, reinitialiserMotDePasse, type EtatCompte } from "./actions";
import { MotDePasseProvisoire } from "./mot-de-passe-provisoire";

const INITIAL: EtatCompte = { erreur: null };

type Compte = {
  id: number;
  nom: string;
  email: string;
  role: "admin" | "redacteur";
  actif: boolean;
  derniereConnexion: string | null;
};

/**
 * Une ligne de la liste. Son propre compte se lit mais ne se retrograde ni ne
 * se desactive d'ici : c'est « Mon compte » qui sert a le gerer.
 */
export function LigneCompte({ compte: c, soiMeme }: { compte: Compte; soiMeme: boolean }) {
  const [etatRole, actionRole] = useActionState(changerRole, INITIAL);
  const [etatActif, actionActif] = useActionState(basculerActif, INITIAL);
  const [etatMdp, actionMdp] = useActionState(reinitialiserMotDePasse, INITIAL);
  const erreur = etatRole.erreur ?? etatActif.erreur ?? etatMdp.erreur;

  return (
    <li
      className={`rounded-xl border bg-[var(--color-nuit-surface)] p-4 ${c.actif ? "border-[var(--color-nuit-trait)]" : "border-dashed border-[var(--color-nuit-trait)]"}`}
    >
      <p className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-craie-tenue)]">
        <span className="rounded-lg bg-[var(--color-turquoise-sourd)] px-1.5 py-0.5 text-[var(--color-turquoise-clair)]">
          {c.role === "admin" ? "administrateur" : "rédacteur"}
        </span>
        {c.actif ? null : <span className="rounded-lg bg-[var(--color-nuit)] px-1.5 py-0.5 text-[var(--color-craie-douce)]">désactivé</span>}
        {soiMeme ? <span className="rounded-lg bg-[var(--color-nuit)] px-1.5 py-0.5 text-[var(--color-craie-douce)]">vous</span> : null}
        {c.derniereConnexion ? `dernière connexion le ${c.derniereConnexion}` : "jamais connecté"}
      </p>
      <p className="mt-1.5 font-medium break-words">
        {c.nom} <span className="font-normal text-[var(--color-craie-douce)]">({c.email})</span>
      </p>

      {soiMeme ? null : (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <form action={actionRole}>
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="role" value={c.role === "admin" ? "redacteur" : "admin"} />
            <BoutonEnvoi variante="discret">{c.role === "admin" ? "Passer rédacteur" : "Passer administrateur"}</BoutonEnvoi>
          </form>
          <form action={actionActif}>
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="actif" value={c.actif ? "0" : "1"} />
            <BoutonEnvoi variante="discret">{c.actif ? "Désactiver" : "Réactiver"}</BoutonEnvoi>
          </form>
          {c.actif ? (
            <form action={actionMdp}>
              <input type="hidden" name="id" value={c.id} />
              <BoutonEnvoi variante="discret">Nouveau mot de passe provisoire</BoutonEnvoi>
            </form>
          ) : null}
        </div>
      )}
      {erreur ? (
        <div className="mt-2">
          <Erreur message={erreur} />
        </div>
      ) : null}
      {etatMdp.provisoire ? <MotDePasseProvisoire {...etatMdp.provisoire} /> : null}
    </li>
  );
}
