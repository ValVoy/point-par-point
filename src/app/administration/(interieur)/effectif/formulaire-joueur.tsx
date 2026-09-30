"use client";

import { useActionState } from "react";
import {
  BoutonEnvoi,
  Champ,
  Erreur,
  Selection,
  ZoneTexte,
} from "@/components/formulaire";
import { LIBELLES_POSTE } from "@/lib/postes";
import { ajouterJoueur, type EtatJoueur } from "./actions";

const ETAT_INITIAL: EtatJoueur = { erreur: null };

const OPTIONS_POSTE = Object.entries(LIBELLES_POSTE).map(
  ([valeur, libelle]) => ({ valeur, libelle }),
);

export function FormulaireJoueur({ saisonId }: { saisonId: number }) {
  const [etat, action] = useActionState(ajouterJoueur, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="saisonId" value={saisonId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ nom="prenom" libelle="Prénom" requis />
        <Champ nom="nom" libelle="Nom" requis />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ nom="numero" libelle="Numéro" type="number" min={0} max={99} />
        <Selection
          nom="poste"
          libelle="Poste"
          valeur="receptionneur"
          options={OPTIONS_POSTE}
          requis
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ nom="neLe" libelle="Date de naissance" type="date" />
        <Champ
          nom="tailleCm"
          libelle="Taille"
          type="number"
          min={100}
          max={250}
          aide="En centimètres."
        />
      </div>

      <ZoneTexte
        nom="presentation"
        libelle="Présentation"
        lignes={3}
        max={1000}
        aide="Deux ou trois lignes, affichées sur sa page."
      />
      <ZoneTexte nom="parcours" libelle="Parcours" lignes={3} max={1000} />

      <Erreur message={etat.erreur} />

      <BoutonEnvoi>Ajouter au groupe</BoutonEnvoi>
    </form>
  );
}
