"use client";

import { useActionState } from "react";
import { BoutonEnvoi, Champ, Erreur, ZoneTexte } from "@/components/formulaire";
import {
  enregistrerEtape,
  enregistrerMembre,
  enregistrerPartenaire,
  type EtatProjet,
} from "./actions";

/*
 * Formulaires de la vitrine du projet. Les valeurs par defaut viennent de
 * l'element modifie ou, apres un refus, de ce qui vient d'etre saisi : React
 * remet le formulaire a ces valeurs apres l'envoi, donc rien ne se perd.
 */

const ETAT_INITIAL: EtatProjet = { erreur: null };

type Valeurs = Record<string, string>;

function useFormulaire(
  action: (precedent: EtatProjet, donnees: FormData) => Promise<EtatProjet>,
  initiales: Valeurs,
) {
  const [etat, envoyer] = useActionState(action, ETAT_INITIAL);
  const valeur = (nom: string) => etat.valeurs?.[nom] ?? initiales[nom] ?? "";
  return { etat, envoyer, valeur };
}

export function FormulaireEtape({ initiales = {} }: { initiales?: Valeurs }) {
  const { etat, envoyer, valeur } = useFormulaire(enregistrerEtape, initiales);
  return (
    <form action={envoyer} className="space-y-4">
      {initiales.id ? <input type="hidden" name="id" value={initiales.id} /> : null}
      <Champ nom="titre" libelle="Titre" valeur={valeur("titre")} requis maxLength={120} />
      <div className="grid gap-4">
        <Champ nom="survenuLe" libelle="Date" type="date" valeur={valeur("survenuLe")} />
        <Champ
          nom="dateLibre"
          libelle="Ou une période"
          valeur={valeur("dateLibre")}
          maxLength={40}
          placeholder="Printemps 2026"
        />
      </div>
      <ZoneTexte nom="texte" libelle="Récit" valeur={valeur("texte")} lignes={4} />
      <Erreur message={etat.erreur} />
      <BoutonEnvoi>{initiales.id ? "Enregistrer" : "Ajouter en brouillon"}</BoutonEnvoi>
    </form>
  );
}

export function FormulaireMembre({ initiales = {} }: { initiales?: Valeurs }) {
  const { etat, envoyer, valeur } = useFormulaire(enregistrerMembre, initiales);
  return (
    <form action={envoyer} className="space-y-4">
      {initiales.id ? <input type="hidden" name="id" value={initiales.id} /> : null}
      <Champ nom="nom" libelle="Nom" valeur={valeur("nom")} requis maxLength={80} />
      <Champ
        nom="role"
        libelle="Rôle"
        valeur={valeur("role")}
        requis
        maxLength={80}
        placeholder="Entraîneur, image et montage..."
      />
      <ZoneTexte nom="texte" libelle="Présentation" valeur={valeur("texte")} lignes={3} />
      <Erreur message={etat.erreur} />
      <BoutonEnvoi>{initiales.id ? "Enregistrer" : "Ajouter"}</BoutonEnvoi>
    </form>
  );
}

export function FormulairePartenaire({ initiales = {} }: { initiales?: Valeurs }) {
  const { etat, envoyer, valeur } = useFormulaire(enregistrerPartenaire, initiales);
  return (
    <form action={envoyer} className="space-y-4">
      {initiales.id ? <input type="hidden" name="id" value={initiales.id} /> : null}
      <Champ nom="nom" libelle="Nom" valeur={valeur("nom")} requis maxLength={80} />
      <Champ
        nom="lien"
        libelle="Site du partenaire"
        type="url"
        valeur={valeur("lien")}
        maxLength={300}
        placeholder="https://"
      />
      <Erreur message={etat.erreur} />
      <BoutonEnvoi>{initiales.id ? "Enregistrer" : "Ajouter"}</BoutonEnvoi>
    </form>
  );
}
