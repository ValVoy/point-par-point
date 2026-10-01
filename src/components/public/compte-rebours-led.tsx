"use client";

import { useEffect, useState } from "react";
import { compteRebours, compteReboursEnLettres } from "@/lib/resultats";
import { AfficheurLed } from "./afficheur-led";

/**
 * Le compte a rebours du tableau, qui defile a la seconde (demande du
 * 01-10-2026) : chaque chiffre qui change bascule, comme le volet d'un
 * afficheur de gymnase, et lui seul. Le premier rendu reprend la valeur
 * calculee par le serveur au moment de la visite : le navigateur n'a rien a
 * corriger a l'hydratation, et rien ne bascule a l'arrivee (le tableau a deja
 * son allumage). Le battement est cale sur le changement de seconde.
 *
 * Au coup d'envoi, les chiffres restent a zero et une legende le dit : un
 * compte a rebours fige a 00 sans explication a l'air casse. Le match reste
 * trois heures au tableau (lib/resultats.ts), puis laisse la place.
 *
 * Le texte pour les lecteurs d'ecran suit la meme valeur, mais a la minute :
 * il ne change pas a chaque seconde.
 *
 * La taille des chiffres suit la largeur du tableau (requete de conteneur),
 * pas celle de l'ecran : sur l'accueil, le tableau partage la ligne avec le
 * dernier resultat, et quatre groupes de chiffres y debordaient a 1280 px.
 */

type Valeurs = ReturnType<typeof compteRebours>;

const deux = (n: number) => String(n).padStart(2, "0");

const UNITES = [
  { cle: "jours", nom: "Jours" },
  { cle: "heures", nom: "Heures" },
  { cle: "minutes", nom: "Min" },
  { cle: "secondes", nom: "Sec" },
] as const;

/** Les positions des caracteres qui ont change entre deux affichages. */
function changes(avant: string, apres: string): number[] {
  return [...apres].flatMap((c, i) => (c === avant[i] ? [] : [i]));
}

export function CompteReboursLed({ cible, initial }: { cible: string; initial: Valeurs }) {
  const [etat, setEtat] = useState({ valeurs: initial, precedentes: initial });

  useEffect(() => {
    const date = new Date(cible);
    let minuterie = 0;
    const battre = () => {
      setEtat((avant) => ({ valeurs: compteRebours(date, new Date()), precedentes: avant.valeurs }));
      minuterie = window.setTimeout(battre, 1000 - (Date.now() % 1000) + 5);
    };
    minuterie = window.setTimeout(battre, 1000 - (Date.now() % 1000) + 5);
    return () => window.clearTimeout(minuterie);
  }, [cible]);

  const { valeurs, precedentes } = etat;
  const commence = valeurs.jours + valeurs.heures + valeurs.minutes + valeurs.secondes === 0;
  const lettres = compteReboursEnLettres(valeurs);

  return (
    <div className="@container">
      <p className="sr-only">{commence ? "Match en cours." : `Dans ${lettres || "moins d'une minute"}.`}</p>
      <div aria-hidden="true" className="flex items-end justify-center gap-1.5 @md:gap-4">
        {UNITES.map((unite, index) => {
          const valeur = deux(valeurs[unite.cle]);
          return (
            <div key={unite.cle} className="flex items-end gap-1.5 @md:gap-4">
              {index > 0 ? (
                <AfficheurLed valeur=":" className="mb-[2.15rem] text-[1.92rem] @md:mb-[2.25rem] @md:text-5xl @xl:text-6xl" />
              ) : null}
              <div className="text-center">
                <AfficheurLed
                  valeur={valeur}
                  bascule={changes(deux(precedentes[unite.cle]), valeur)}
                  className="text-[2.4rem] @md:text-6xl @xl:text-7xl"
                />
                <span className="mt-2 block text-[0.65rem] tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
                  {unite.nom}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {commence ? (
        <p
          aria-hidden="true"
          className="mt-4 text-center text-xs font-semibold tracking-[0.2em] text-[var(--color-jaune)] uppercase"
        >
          Match en cours
        </p>
      ) : null}
    </div>
  );
}
