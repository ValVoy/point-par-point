"use client";

import { useActionState, useState } from "react";
import { BoutonEnvoi, Champ, Erreur, ZoneTexte } from "@/components/formulaire";
import { MANIFESTE_DEPART, MANIFESTE_TEXTE_MAX, MANIFESTE_TITRE_MAX } from "@/lib/porte-entree";
import { enregistrerManifeste, type EtatProjet } from "../actions";

const ETAT_INITIAL: EtatProjet = { erreur: null };

/**
 * Le retour au texte de depart efface le texte saisi : il se confirme en deux
 * temps, et « Garder mon texte » annule sans rien envoyer (critique du
 * 01-10-2026).
 */
export function FormulaireManifeste({ titre, texte, personnalise }: { titre: string; texte: string; personnalise: boolean }) {
  const [etat, envoyer] = useActionState(enregistrerManifeste, ETAT_INITIAL);
  const [confirmer, setConfirmer] = useState(false);
  const v = etat.valeurs;
  const retourDepart = v?.enregistre === "depart";
  // Apres un retour au depart, les champs montrent de nouveau le texte de depart.
  const valeurTitre = retourDepart ? MANIFESTE_DEPART.titre : v?.titre || titre;
  const valeurTexte = retourDepart ? MANIFESTE_DEPART.texte : v?.texte || texte;
  const aDuTexteAMoi = v?.enregistre ? v.personnalise === "1" : personnalise;

  return (
    <form action={envoyer} onSubmit={() => setConfirmer(false)} className="space-y-5">
      <Champ
        nom="titre"
        libelle="Titre"
        valeur={valeurTitre}
        maxLength={MANIFESTE_TITRE_MAX}
        aide={`${MANIFESTE_TITRE_MAX} caractères au plus.`}
      />
      <ZoneTexte
        nom="texte"
        libelle="Texte"
        valeur={valeurTexte}
        lignes={7}
        max={MANIFESTE_TEXTE_MAX}
        aide={`${MANIFESTE_TEXTE_MAX} caractères au plus.`}
      />
      <Erreur message={etat.erreur} />
      {v?.enregistre ? (
        <p role="status" className="text-sm text-[var(--color-turquoise-clair)]">
          {retourDepart ? "Texte de départ rétabli." : "Enregistré."}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        <BoutonEnvoi>Enregistrer</BoutonEnvoi>
        {aDuTexteAMoi && !confirmer ? (
          <button
            type="button"
            onClick={() => setConfirmer(true)}
            className="min-h-11 text-sm text-[var(--color-craie-douce)] underline underline-offset-4 hover:text-[var(--color-turquoise)]"
          >
            Revenir au texte de départ
          </button>
        ) : null}
      </div>
      {aDuTexteAMoi && confirmer ? (
        <div role="group" aria-label="Confirmer le retour au texte de départ" className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-[var(--color-craie-douce)]">Votre texte sera remplacé par celui de départ.</p>
          <button
            type="submit"
            name="depart"
            value="1"
            className="min-h-11 text-sm font-semibold text-[var(--color-erreur)] underline underline-offset-4"
          >
            Oui, revenir au départ
          </button>
          <button
            type="button"
            onClick={() => setConfirmer(false)}
            className="min-h-11 text-sm text-[var(--color-craie-douce)] underline underline-offset-4 hover:text-[var(--color-craie)]"
          >
            Garder mon texte
          </button>
        </div>
      ) : null}
    </form>
  );
}
