"use client";

import { useActionState, useState } from "react";
import { EditeurTexteLeger } from "@/components/editeur-texte-leger";
import { BoutonEnvoi, Erreur } from "@/components/formulaire";
import { enregistrerVenirALaSalle, type EtatProjet } from "../actions";

const ETAT_INITIAL: EtatProjet = { erreur: null };

export function FormulaireSalle({ texte }: { texte: string }) {
  const [etat, envoyer] = useActionState(enregistrerVenirALaSalle, ETAT_INITIAL);
  const [valeur, setValeur] = useState(etat.valeurs?.texte ?? texte);
  return (
    <form action={envoyer} className="space-y-4">
      <EditeurTexteLeger nom="texte" libelle="Venir à la salle" valeur={valeur} onChange={setValeur} lignes={14} />
      <Erreur message={etat.erreur} />
      {etat.valeurs?.enregistre ? (
        <p role="status" className="text-sm text-[var(--color-turquoise-clair)]">
          Enregistré.
        </p>
      ) : null}
      <BoutonEnvoi>Enregistrer</BoutonEnvoi>
    </form>
  );
}
