"use client";

import { useEffect, useState } from "react";
import { compteRebours } from "@/lib/resultats";
import { AfficheurLed } from "./afficheur-led";

/**
 * Le compte a rebours du tableau, qui tourne. Le premier rendu reprend la
 * valeur calculee par le serveur au moment de la visite : le navigateur n'a
 * rien a corriger a l'hydratation. Il recalcule ensuite toutes les quinze
 * secondes, assez pour ne jamais rater le changement de minute de plus de
 * quinze secondes, sans reveiller la page pour rien.
 *
 * Au coup d'envoi, les chiffres restent a zero et une legende le dit : un
 * compte a rebours fige a 00 sans explication a l'air casse. Le match reste
 * trois heures au tableau (lib/resultats.ts), puis laisse la place.
 *
 * Le texte pour les lecteurs d'ecran suit la meme valeur que les chiffres.
 */

type Valeurs = ReturnType<typeof compteRebours>;

const deux = (n: number) => String(n).padStart(2, "0");

export function CompteReboursLed({ cible, initial }: { cible: string; initial: Valeurs }) {
  const [valeurs, setValeurs] = useState(initial);

  useEffect(() => {
    const date = new Date(cible);
    const actualiser = () => setValeurs(compteRebours(date, new Date()));
    actualiser();
    const minuterie = window.setInterval(actualiser, 15_000);
    return () => window.clearInterval(minuterie);
  }, [cible]);

  const unites = [
    { valeur: deux(valeurs.jours), nom: "Jours" },
    { valeur: deux(valeurs.heures), nom: "Heures" },
    { valeur: deux(valeurs.minutes), nom: "Min" },
  ];

  const commence = valeurs.jours + valeurs.heures + valeurs.minutes === 0;

  return (
    <div>
      <p className="sr-only">
        {commence
          ? "Match en cours."
          : `Dans ${valeurs.jours} jours, ${valeurs.heures} heures et ${valeurs.minutes} minutes.`}
      </p>
      <div aria-hidden="true" className="flex items-end justify-center gap-3 sm:gap-6">
        {unites.map((unite, index) => (
          <div key={unite.nom} className="flex items-end gap-3 sm:gap-6">
            {index > 0 ? <AfficheurLed valeur=":" className="mb-[1.1rem] text-5xl sm:mb-6 sm:text-7xl" /> : null}
            <div className="text-center">
              <AfficheurLed valeur={unite.valeur} className="text-6xl sm:text-8xl" />
              <span className="mt-2 block text-[0.65rem] tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
                {unite.nom}
              </span>
            </div>
          </div>
        ))}
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
