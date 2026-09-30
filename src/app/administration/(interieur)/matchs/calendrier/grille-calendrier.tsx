"use client";

import { useActionState, useState } from "react";
import { BoutonEnvoi } from "@/components/formulaire";
import { creerCalendrier, type EtatMatch } from "../actions";

/*
 * Grille de saisie du calendrier complet. Les lignes vivent dans l'etat du
 * composant et les champs sont controles : React vide les champs non
 * controles d'un formulaire apres chaque envoi, et un calendrier de vingt
 * lignes perdu sur une seule faute de frappe ferait abandonner la saisie.
 */

type Ligne = {
  cle: number;
  date: string;
  heure: string;
  adversaire: string;
  lieu: "domicile" | "exterieur";
  salleNom: string;
};

const LIGNES_AU_DEPART = 10;
const LIGNES_AJOUTEES = 5;

let compteur = 0;
function ligneVide(lieu: Ligne["lieu"] = "domicile"): Ligne {
  compteur += 1;
  return { cle: compteur, date: "", heure: "", adversaire: "", lieu, salleNom: "" };
}

const ETAT_INITIAL: EtatMatch = { erreurs: [] };

const CLASSE =
  "w-full rounded-lg border border-[var(--color-nuit-trait)] bg-[var(--color-nuit)] px-2.5 py-2 text-sm outline-none focus:border-[var(--color-turquoise)]";

export function GrilleCalendrier({ saisonId }: { saisonId: number }) {
  const [etat, action] = useActionState(creerCalendrier, ETAT_INITIAL);
  const [lignes, setLignes] = useState<Ligne[]>(() =>
    // Domicile et exterieur alternent dans un championnat : on le propose
    // d'office, il n'y a plus qu'a corriger les exceptions.
    Array.from({ length: LIGNES_AU_DEPART }, (_, i) =>
      ligneVide(i % 2 === 0 ? "domicile" : "exterieur"),
    ),
  );

  function modifier(index: number, champ: keyof Omit<Ligne, "cle">, valeur: string) {
    setLignes((actuelles) =>
      actuelles.map((ligne, i) => {
        if (i !== index) return ligne;
        const suivante = { ...ligne, [champ]: valeur } as Ligne;
        // L'heure d'un championnat change rarement : une date posee sur une
        // ligne sans heure reprend celle de la ligne du dessus.
        if (champ === "date" && !ligne.heure) {
          const precedente = actuelles
            .slice(0, index)
            .reverse()
            .find((autre) => autre.heure);
          if (precedente) suivante.heure = precedente.heure;
        }
        return suivante;
      }),
    );
  }

  const [competition, setCompetition] = useState("");
  const remplies = lignes.filter((l) => l.date || l.adversaire).length;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="saisonId" value={saisonId} />

      <div className="max-w-md">
        <label htmlFor="competition" className="block text-sm font-medium text-[var(--color-craie-douce)]">
          Compétition
          <span className="ml-1.5 text-xs font-normal text-[var(--color-craie-tenue)]">
            facultatif
          </span>
        </label>
        <input
          id="competition"
          name="competition"
          maxLength={80}
          placeholder="Championnat départemental 2, poule B"
          value={competition}
          onChange={(e) => setCompetition(e.target.value)}
          className={`${CLASSE} mt-1.5`}
        />
        <p className="mt-1 text-xs text-[var(--color-craie-tenue)]">
          Commune à tous les matchs de la grille.
        </p>
      </div>

      {etat.erreurs.length > 0 ? (
        <ul
          role="alert"
          className="space-y-1 rounded-lg bg-[var(--color-erreur)]/10 px-3 py-2 text-sm text-[var(--color-erreur)]"
        >
          {etat.erreurs.map((erreur) => (
            <li key={erreur}>{erreur}</li>
          ))}
        </ul>
      ) : null}

      <div className="hidden grid-cols-[2rem_9.5rem_6.5rem_1fr_8.5rem_1fr] gap-2 px-1 text-xs font-medium text-[var(--color-craie-tenue)] lg:grid">
        <span>N°</span>
        <span>Date</span>
        <span>Heure</span>
        <span>Adversaire</span>
        <span>Lieu</span>
        <span>Salle (facultatif)</span>
      </div>

      <ol className="space-y-3 lg:space-y-2">
        {lignes.map((ligne, index) => (
          <li
            key={ligne.cle}
            className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-3 lg:grid-cols-[2rem_9.5rem_6.5rem_1fr_8.5rem_1fr] lg:items-center lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:px-1"
          >
            <span className="col-span-2 text-xs font-medium text-[var(--color-craie-tenue)] lg:col-span-1">
              <span className="lg:hidden">Ligne </span>
              {index + 1}
            </span>
            <input
              name="date"
              type="date"
              aria-label={`Date, ligne ${index + 1}`}
              value={ligne.date}
              onChange={(e) => modifier(index, "date", e.target.value)}
              className={CLASSE}
            />
            <input
              name="heure"
              type="time"
              aria-label={`Heure, ligne ${index + 1}`}
              value={ligne.heure}
              onChange={(e) => modifier(index, "heure", e.target.value)}
              className={CLASSE}
            />
            <input
              name="adversaire"
              aria-label={`Adversaire, ligne ${index + 1}`}
              placeholder="Adversaire"
              maxLength={80}
              value={ligne.adversaire}
              onChange={(e) => modifier(index, "adversaire", e.target.value)}
              className={`${CLASSE} col-span-2 lg:col-span-1`}
            />
            <select
              name="lieu"
              aria-label={`Lieu, ligne ${index + 1}`}
              value={ligne.lieu}
              onChange={(e) => modifier(index, "lieu", e.target.value)}
              className={CLASSE}
            >
              <option value="domicile">Domicile</option>
              <option value="exterieur">Extérieur</option>
            </select>
            <input
              name="salleNom"
              aria-label={`Salle, ligne ${index + 1}`}
              placeholder="Salle"
              maxLength={80}
              value={ligne.salleNom}
              onChange={(e) => modifier(index, "salleNom", e.target.value)}
              className={CLASSE}
            />
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setLignes((actuelles) => [
              ...actuelles,
              ...Array.from({ length: LIGNES_AJOUTEES }, (_, i) =>
                ligneVide((actuelles.length + i) % 2 === 0 ? "domicile" : "exterieur"),
              ),
            ])
          }
          className="inline-flex min-h-11 items-center rounded-lg border border-[var(--color-nuit-trait)] bg-[var(--color-nuit)] px-4 text-sm text-[var(--color-craie-douce)]"
        >
          Ajouter {LIGNES_AJOUTEES} lignes
        </button>
        <span className="text-sm text-[var(--color-craie-tenue)]">
          {remplies} {remplies > 1 ? "lignes remplies" : "ligne remplie"}. Les lignes
          vides sont ignorées.
        </span>
        <div className="ml-auto">
          <BoutonEnvoi>Enregistrer le calendrier</BoutonEnvoi>
        </div>
      </div>
    </form>
  );
}
