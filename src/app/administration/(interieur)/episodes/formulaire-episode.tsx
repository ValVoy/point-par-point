"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { BoutonEnvoi, Erreur } from "@/components/formulaire";
import { extraireIdYoutube, miniatureYoutube } from "@/lib/youtube";
import { creerEpisode, modifierEpisode, type EtatEpisode } from "./actions";

/*
 * Champs controles, comme sur les grilles de saisie des matchs : React vide un
 * formulaire apres chaque envoi, et un resume de dix lignes perdu sur une
 * adresse mal collee ne se reecrit pas deux fois.
 */

const ETAT_INITIAL: EtatEpisode = { erreur: null };

const CLASSE_CHAMP =
  "mt-1.5 w-full rounded-lg border border-[var(--color-nuit-bord)] bg-[var(--color-nuit)] px-3 py-2 text-[var(--color-craie)] focus:border-[var(--color-turquoise)]";
const CLASSE_LABEL = "block text-sm font-medium text-[var(--color-craie-douce)]";

function Facultatif() {
  return (
    <span className="ml-1.5 text-xs font-normal text-[var(--color-craie-tenue)]">
      facultatif
    </span>
  );
}

export type EpisodeModifiable = {
  id: number;
  adresse: string;
  titre: string;
  numero: string;
  resume: string;
  publieLe: string;
  rencontreId: string;
};

const VIDE: Omit<EpisodeModifiable, "id"> = {
  adresse: "",
  titre: "",
  numero: "",
  resume: "",
  publieLe: "",
  rencontreId: "",
};

export function FormulaireEpisode({
  episode,
  matchs,
  numeroSuivant,
}: {
  episode?: EpisodeModifiable;
  matchs: { id: number; libelle: string }[];
  numeroSuivant?: number;
}) {
  const [etat, action] = useActionState(
    episode ? modifierEpisode : creerEpisode,
    ETAT_INITIAL,
  );
  const [champs, setChamps] = useState(
    episode ?? { ...VIDE, numero: numeroSuivant?.toString() ?? "" },
  );
  const idVideo = extraireIdYoutube(champs.adresse);

  // Apres un ajout reussi, le formulaire repart vide pour l'episode suivant. Le
  // reglage se fait pendant le rendu, a la reception du nouvel etat, plutot
  // que dans un effet qui provoquerait un second rendu.
  const [etatVu, setEtatVu] = useState(etat);
  if (etat !== etatVu) {
    setEtatVu(etat);
    if (etat.enregistre && !episode) {
      const suivant = Number(champs.numero) ? Number(champs.numero) + 1 : null;
      setChamps({ ...VIDE, numero: suivant?.toString() ?? "" });
    }
  }

  function modifier(nom: keyof typeof VIDE, valeur: string) {
    setChamps((actuels) => ({ ...actuels, [nom]: valeur }));
  }

  return (
    <form action={action} className="space-y-4">
      {episode ? <input type="hidden" name="id" value={episode.id} /> : null}

      <div>
        <label htmlFor="adresse" className={CLASSE_LABEL}>
          Adresse de la vidéo YouTube
        </label>
        <input
          id="adresse"
          name="adresse"
          required
          inputMode="url"
          placeholder="https://youtu.be/…"
          value={champs.adresse}
          onChange={(e) => modifier("adresse", e.target.value)}
          className={CLASSE_CHAMP}
        />
        {champs.adresse && !idVideo ? (
          <p className="mt-1 text-xs text-[var(--color-erreur)]">
            Adresse non reconnue : collez le lien de partage de la vidéo.
          </p>
        ) : null}
        {idVideo ? (
          <Image
            src={miniatureYoutube(idVideo)}
            alt="Miniature de la vidéo reconnue"
            width={480}
            height={360}
            loading="eager"
            className="mt-2 aspect-video w-full rounded-lg object-cover"
          />
        ) : null}
      </div>

      <div className="grid grid-cols-[5rem_1fr] gap-4">
        <div>
          <label htmlFor="numero" className={CLASSE_LABEL}>
            Numéro
          </label>
          <input
            id="numero"
            name="numero"
            inputMode="numeric"
            maxLength={3}
            value={champs.numero}
            onChange={(e) => modifier("numero", e.target.value.replace(/\D/g, ""))}
            className={CLASSE_CHAMP}
          />
        </div>
        <div>
          <label htmlFor="titre" className={CLASSE_LABEL}>
            Titre
          </label>
          <input
            id="titre"
            name="titre"
            required
            maxLength={120}
            value={champs.titre}
            onChange={(e) => modifier("titre", e.target.value)}
            className={CLASSE_CHAMP}
          />
        </div>
      </div>

      <div>
        <label htmlFor="resume" className={CLASSE_LABEL}>
          Résumé
          <Facultatif />
        </label>
        <textarea
          id="resume"
          name="resume"
          rows={5}
          maxLength={1500}
          value={champs.resume}
          onChange={(e) => modifier("resume", e.target.value)}
          className={CLASSE_CHAMP}
        />
      </div>

      <div>
        <label htmlFor="rencontreId" className={CLASSE_LABEL}>
          Match raconté
          <Facultatif />
        </label>
        <select
          id="rencontreId"
          name="rencontreId"
          value={champs.rencontreId}
          onChange={(e) => modifier("rencontreId", e.target.value)}
          className={CLASSE_CHAMP}
        >
          <option value="">Aucun, épisode hors match</option>
          {matchs.map((match) => (
            <option key={match.id} value={match.id}>
              {match.libelle}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="publieLe" className={CLASSE_LABEL}>
          Sortie sur YouTube
          <Facultatif />
        </label>
        <input
          id="publieLe"
          name="publieLe"
          type="date"
          value={champs.publieLe}
          onChange={(e) => modifier("publieLe", e.target.value)}
          className={CLASSE_CHAMP}
        />
        <p className="mt-1 text-sm text-[var(--color-craie-tenue)]">
          Laissée vide, elle prendra la date du jour où l&apos;épisode est publié sur le site.
        </p>
      </div>

      <Erreur message={etat.erreur} />
      {etat.enregistre && !episode ? (
        <p role="status" className="rounded-lg bg-[var(--color-turquoise-sourd)] px-3 py-2 text-sm text-[var(--color-turquoise-clair)]">
          Épisode ajouté en brouillon. Publiez-le depuis la liste quand il est prêt.
        </p>
      ) : null}

      <BoutonEnvoi>{episode ? "Enregistrer" : "Ajouter en brouillon"}</BoutonEnvoi>
    </form>
  );
}
