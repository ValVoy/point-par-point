"use client";

import { useActionState } from "react";
import { BoutonEnvoi, Champ, Erreur } from "@/components/formulaire";
import { changerMonMotDePasse, type EtatMonCompte } from "./actions";

const INITIAL: EtatMonCompte = { erreur: null };

/** Les mots de passe ne reviennent jamais dans l'etat : un refus vide les champs, c'est voulu. */
export function FormulaireMotDePasse({ longueurMinimale }: { longueurMinimale: number }) {
  const [etat, action] = useActionState(changerMonMotDePasse, INITIAL);
  return (
    <form action={action} className="mt-4 max-w-md space-y-4">
      <Champ nom="actuel" libelle="Mot de passe actuel" type="password" requis autoComplete="current-password" />
      <Champ
        nom="nouveau"
        libelle="Nouveau mot de passe"
        type="password"
        requis
        minLength={longueurMinimale}
        maxLength={200}
        autoComplete="new-password"
        aide={`${longueurMinimale} caractères au moins. Une phrase de quelques mots fait très bien l'affaire.`}
      />
      <Champ nom="confirmation" libelle="Nouveau mot de passe, encore une fois" type="password" requis autoComplete="new-password" />
      <div className="flex flex-wrap items-center gap-4">
        <BoutonEnvoi>Changer le mot de passe</BoutonEnvoi>
        <Erreur message={etat.erreur} />
        {etat.reussi ? (
          <p role="status" className="text-sm text-[var(--color-turquoise-clair)]">
            Mot de passe changé. Vos autres appareils sont déconnectés.
          </p>
        ) : null}
      </div>
    </form>
  );
}
