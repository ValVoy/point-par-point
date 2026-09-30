"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BoutonEnvoi, Erreur } from "@/components/formulaire";
import { LIBELLES_POSTE } from "@/lib/postes";
import type { Poste } from "@/lib/db/schema";
import {
  designerCapitaine,
  modifierLigneEffectif,
  retirerDeLEffectif,
  type EtatJoueur,
} from "./actions";

const ETAT_INITIAL: EtatJoueur = { erreur: null };

export type LigneEffectif = {
  effectifId: number;
  joueurId: number;
  aPhoto: boolean;
  nomComplet: string;
  numero: number | null;
  poste: Poste;
  capitaine: boolean;
  age: number | null;
  tailleCm: number | null;
};

/**
 * Une ligne d'effectif, modifiable sur place. Le numero et le poste se
 * corrigent sans changer de page : ce sont les deux champs qu'on retouche le
 * plus souvent, et les faire passer par un ecran separe serait une corvee.
 *
 * Les actions secondaires sont des formulaires freres, jamais imbriques :
 * un `<form>` dans un `<form>` est invalide et le navigateur en avale un.
 */
export function LigneEffectifModifiable({ ligne }: { ligne: LigneEffectif }) {
  const [etat, action] = useActionState(modifierLigneEffectif, ETAT_INITIAL);

  const details =
    [
      ligne.age !== null ? `${ligne.age} ans` : null,
      ligne.tailleCm ? `${ligne.tailleCm} cm` : null,
      ligne.aPhoto ? null : "sans photo",
    ]
      .filter(Boolean)
      .join(" · ") || "Fiche à compléter";

  return (
    <div className="rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] px-4 py-3">
      {/* Grille plutot que flex-wrap : le retour a la ligne d'un flex depend
          de la largeur du contenu, donc le bouton sautait a la ligne des que
          le nom d'un joueur etait long. Ici, les colonnes sont decidees. */}
      <form
        action={action}
        className="grid grid-cols-[3.5rem_1fr] items-center gap-3 sm:grid-cols-[3.5rem_1fr_13rem_auto]"
      >
        <input type="hidden" name="effectifId" value={ligne.effectifId} />

        <input
          name="numero"
          type="number"
          min={0}
          max={99}
          aria-label={`Numéro de ${ligne.nomComplet}`}
          defaultValue={ligne.numero ?? ""}
          className="w-full rounded-lg border border-[var(--color-nuit-trait)] bg-[var(--color-nuit)] px-2 py-1.5 text-center font-medium outline-none focus:border-[var(--color-turquoise)]"
        />

        <div className="min-w-0">
          {/* Le nom occupe sa ligne entiere, le reste passe dessous : mis
              cote a cote, c'est le nom qui se faisait tronquer par un badge
              pourtant plus court que lui. */}
          <Link
            href={`/administration/effectif/joueur/${ligne.joueurId}`}
            className="block truncate font-medium hover:text-[var(--color-turquoise)] hover:underline"
          >
            {ligne.nomComplet}
            <span className="sr-only"> : ouvrir sa fiche</span>
          </Link>
          <p className="truncate text-xs text-[var(--color-craie-tenue)]">
            {ligne.capitaine ? (
              <span className="mr-1.5 rounded bg-[var(--color-turquoise-sourd)] px-1.5 py-0.5 text-[var(--color-turquoise-clair)]">
                capitaine
              </span>
            ) : null}
            {details}
          </p>
        </div>

        <select
          name="poste"
          aria-label={`Poste de ${ligne.nomComplet}`}
          defaultValue={ligne.poste}
          className="col-span-2 w-full rounded-lg border border-[var(--color-nuit-trait)] bg-[var(--color-nuit)] px-2 py-1.5 outline-none focus:border-[var(--color-turquoise)] sm:col-span-1"
        >
          {Object.entries(LIBELLES_POSTE).map(([valeur, libelle]) => (
            <option key={valeur} value={valeur}>
              {libelle}
            </option>
          ))}
        </select>

        <div className="col-span-2 sm:col-span-1">
          <BoutonEnvoi variante="discret">Enregistrer</BoutonEnvoi>
        </div>
      </form>

      {etat.erreur ? (
        <div className="mt-3">
          <Erreur message={etat.erreur} />
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--color-nuit-trait)] pt-2 text-xs">
        <Link href={`/administration/effectif/joueur/${ligne.joueurId}`} className="action-admin text-[var(--color-turquoise)]">
          Fiche et photo
        </Link>
        {ligne.capitaine ? null : (
          <form action={designerCapitaine}>
            <input type="hidden" name="effectifId" value={ligne.effectifId} />
            <button
              type="submit"
              className="text-[var(--color-craie-tenue)] action-admin"
            >
              Désigner capitaine
            </button>
          </form>
        )}
        <form action={retirerDeLEffectif}>
          <input type="hidden" name="effectifId" value={ligne.effectifId} />
          <button
            type="submit"
            className="text-[var(--color-craie-tenue)] action-admin"
          >
            Retirer du groupe
          </button>
        </form>
      </div>
    </div>
  );
}
