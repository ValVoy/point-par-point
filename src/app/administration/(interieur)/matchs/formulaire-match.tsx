"use client";

import { useActionState } from "react";
import {
  BoutonEnvoi,
  Champ,
  Erreur,
  Selection,
  ZoneTexte,
} from "@/components/formulaire";
import type { EtatRencontre } from "@/lib/db/schema";
import { LIBELLES_ETAT } from "@/lib/etats-rencontre";
import { creerMatch, modifierMatch, type EtatMatch } from "./actions";

const ETAT_INITIAL: EtatMatch = { erreurs: [] };

export type MatchModifiable = {
  id: number;
  date: string;
  heure: string;
  adversaire: string;
  domicile: boolean;
  competition: string;
  salleNom: string;
  salleAdresse: string;
  etat: EtatRencontre;
  commentaire: string;
};

export const OPTIONS_LIEU = [
  { valeur: "domicile", libelle: "Domicile" },
  { valeur: "exterieur", libelle: "Extérieur" },
];

export function FormulaireMatch({
  saisonId,
  match,
}: {
  saisonId: number;
  match?: MatchModifiable;
}) {
  const [etat, action] = useActionState(
    match ? modifierMatch : creerMatch,
    ETAT_INITIAL,
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="saisonId" value={saisonId} />
      {match ? <input type="hidden" name="id" value={match.id} /> : null}

      <div className="grid grid-cols-2 gap-4">
        <Champ nom="date" libelle="Date" type="date" valeur={match?.date} requis />
        <Champ
          nom="heure"
          libelle="Heure"
          type="time"
          valeur={match?.heure}
          aide="Vide si l'horaire n'est pas encore connu : le site affichera « horaire à confirmer »."
        />
      </div>

      <Champ
        nom="adversaire"
        libelle="Adversaire"
        valeur={match?.adversaire}
        requis
        maxLength={80}
      />

      <Selection
        nom="lieu"
        libelle="Lieu"
        valeur={match ? (match.domicile ? "domicile" : "exterieur") : "domicile"}
        options={OPTIONS_LIEU}
      />

      <Champ
        nom="competition"
        libelle="Compétition"
        valeur={match?.competition}
        maxLength={80}
        placeholder="Championnat départemental 2"
      />

      <Champ nom="salleNom" libelle="Salle" valeur={match?.salleNom} maxLength={80} />
      <Champ
        nom="salleAdresse"
        libelle="Adresse de la salle"
        valeur={match?.salleAdresse}
        maxLength={160}
        aide="Elle servira à la carte et au bouton d'itinéraire."
      />

      {match ? (
        <>
          <Selection
            nom="etat"
            libelle="État"
            valeur={match.etat}
            options={Object.entries(LIBELLES_ETAT).map(([valeur, libelle]) => ({
              valeur,
              libelle,
            }))}
          />
          <ZoneTexte
            nom="commentaire"
            libelle="Commentaire d'après-match"
            max={2000}
            valeur={match.commentaire}
            aide="Quelques lignes, affichées sur la page du match."
          />
        </>
      ) : null}

      <Erreur message={etat.erreurs.join(" ") || null} />

      <BoutonEnvoi>{match ? "Enregistrer" : "Ajouter le match"}</BoutonEnvoi>
    </form>
  );
}
