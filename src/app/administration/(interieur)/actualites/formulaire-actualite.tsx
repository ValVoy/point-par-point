"use client";

import { useActionState, useState } from "react";
import { BoutonEnvoi, Erreur } from "@/components/formulaire";
import { EditeurTexteLeger } from "@/components/editeur-texte-leger";
import { creerActualite, modifierActualite, type EtatActualite } from "./actions";

/* Champs controles : un long texte ne doit jamais se perdre sur un refus. */

const ETAT_INITIAL: EtatActualite = { erreur: null };

const CLASSE_CHAMP =
  "mt-1.5 w-full rounded-lg border border-[var(--color-trait)] bg-white px-3 py-2 text-[var(--color-encre)] outline-none focus:border-[var(--color-accent)]";
const CLASSE_LABEL = "block text-sm font-medium text-[var(--color-encre-douce)]";

export type ActualiteModifiable = {
  id: number;
  titre: string;
  chapo: string;
  corps: string;
};

export function FormulaireActualite({ actualite }: { actualite?: ActualiteModifiable }) {
  const [etat, action] = useActionState(
    actualite ? modifierActualite : creerActualite,
    ETAT_INITIAL,
  );
  const [titre, setTitre] = useState(actualite?.titre ?? "");
  const [chapo, setChapo] = useState(actualite?.chapo ?? "");
  const [corps, setCorps] = useState(actualite?.corps ?? "");

  return (
    <form action={action} className="space-y-5">
      {actualite ? <input type="hidden" name="id" value={actualite.id} /> : null}

      <div>
        <label htmlFor="titre" className={CLASSE_LABEL}>
          Titre
        </label>
        <input
          id="titre"
          name="titre"
          required
          maxLength={140}
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className={`${CLASSE_CHAMP} text-lg`}
        />
      </div>

      <div>
        <label htmlFor="chapo" className={CLASSE_LABEL}>
          Chapô
          <span className="ml-1.5 text-xs font-normal text-[var(--color-encre-tenue)]">
            facultatif
          </span>
        </label>
        <textarea
          id="chapo"
          name="chapo"
          rows={2}
          maxLength={300}
          value={chapo}
          onChange={(e) => setChapo(e.target.value)}
          className={CLASSE_CHAMP}
        />
        <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">
          Une ou deux phrases qui résument l&apos;actualité. Elles s&apos;affichent dans la liste
          et en tête de l&apos;article. {chapo.length}/300
        </p>
      </div>

      <EditeurTexteLeger nom="corps" libelle="Texte" valeur={corps} onChange={setCorps} requis />

      <Erreur message={etat.erreur} />

      <BoutonEnvoi>{actualite ? "Enregistrer" : "Enregistrer le brouillon"}</BoutonEnvoi>
    </form>
  );
}
