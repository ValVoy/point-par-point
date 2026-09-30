"use client";

import { useActionState } from "react";
import { ChampImage } from "@/components/champ-image";
import { BoutonEnvoi, Champ, Erreur, ZoneTexte } from "@/components/formulaire";
import { enregistrerFicheJoueur, type EtatFiche } from "./actions";
import { positionPhoto } from "@/lib/position-photo";
import { ChoixVisage } from "./choix-visage";

const INITIAL: EtatFiche = { erreur: null };

export type FicheModifiable = {
  id: number;
  prenom: string;
  nom: string;
  neLe: string;
  tailleCm: string;
  presentation: string;
  parcours: string;
  photo: string | null;
  visageX: number | null;
  visageY: number | null;
};

/**
 * La fiche d'un joueur. Les champs gardent les valeurs enregistrees ; apres un
 * refus, la saisie en cours est perdue pour la photo seulement, que le
 * navigateur ne sait pas renvoyer (la phrase d'aide le dit).
 */
export function FormulaireFiche({ fiche: f }: { fiche: FicheModifiable }) {
  const [etat, action] = useActionState(enregistrerFicheJoueur, INITIAL);
  return (
    <form action={action} className="mt-6 max-w-3xl space-y-5">
      <input type="hidden" name="id" value={f.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Champ nom="prenom" libelle="Prénom" requis valeur={f.prenom} maxLength={60} />
        <Champ nom="nom" libelle="Nom" requis valeur={f.nom} maxLength={60} />
        <Champ nom="neLe" libelle="Date de naissance" type="date" valeur={f.neLe} aide="Seul l'âge s'affiche sur le site." />
        <Champ nom="tailleCm" libelle="Taille, en centimètres" type="number" min={120} max={240} valeur={f.tailleCm} />
      </div>

      <ChampImage
        nom="photo"
        libelle="Photo"
        actuelle={f.photo}
        position={positionPhoto({ x: f.visageX, y: f.visageY })}
        aide="Portrait vertical de préférence. JPEG, PNG, WebP ou AVIF, 12 Mo au plus ; la position GPS est retirée. À choisir de nouveau si l'enregistrement est refusé."
      />
      {f.photo ? <ChoixVisage photo={f.photo} x={f.visageX} y={f.visageY} /> : null}

      <ZoneTexte nom="presentation" libelle="Présentation" valeur={f.presentation} lignes={4} max={1000} aide="Ce qu'il dit de lui, en quelques phrases. 1 000 caractères au plus." />
      <ZoneTexte nom="parcours" libelle="Parcours" valeur={f.parcours} lignes={4} max={1000} aide="Ses clubs, ses saisons. 1 000 caractères au plus." />

      <div className="flex flex-wrap items-center gap-4">
        <BoutonEnvoi>Enregistrer la fiche</BoutonEnvoi>
        <Erreur message={etat.erreur} />
        {etat.enregistre ? (
          <p role="status" className="text-sm text-[var(--color-turquoise-clair)]">
            Fiche enregistrée.
          </p>
        ) : null}
      </div>
    </form>
  );
}
