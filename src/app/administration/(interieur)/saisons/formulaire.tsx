"use client";

import { useActionState } from "react";
import { BoutonEnvoi, Champ, Erreur } from "@/components/formulaire";
import { creerSaison, modifierSaison, type EtatSaison } from "./actions";

const ETAT_INITIAL: EtatSaison = { erreur: null };

export type SaisonModifiable = {
  id: number;
  libelle: string;
  debuteLe: string;
  finitLe: string;
};

export function FormulaireSaison({ saison }: { saison?: SaisonModifiable }) {
  const [etat, action] = useActionState(
    saison ? modifierSaison : creerSaison,
    ETAT_INITIAL,
  );

  return (
    <form action={action} className="space-y-4">
      {saison ? <input type="hidden" name="id" value={saison.id} /> : null}

      <Champ
        nom="libelle"
        libelle="Libellé"
        valeur={saison?.libelle}
        requis
        placeholder="2026-2027"
        aide="Tel qu'il apparaîtra dans le sélecteur de saison."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ
          nom="debuteLe"
          libelle="Début"
          type="date"
          valeur={saison?.debuteLe}
        />
        <Champ
          nom="finitLe"
          libelle="Fin"
          type="date"
          valeur={saison?.finitLe}
        />
      </div>

      <Erreur message={etat.erreur} />

      <BoutonEnvoi>
        {saison ? "Enregistrer" : "Ajouter la saison"}
      </BoutonEnvoi>
    </form>
  );
}
