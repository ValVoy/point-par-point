"use client";

import { useEffect } from "react";

/**
 * Demande confirmation avant de fermer, recharger ou quitter le site quand une
 * saisie n'est pas enregistree (audit du 01-10-2026, U7). Le navigateur
 * affiche son propre message ; on ne peut que declencher la question.
 *
 * Limite connue : un lien interne au site (navigation sans rechargement) ne
 * declenche pas cet evenement.
 */
export function useAvertirAvantDeQuitter(modifie: boolean) {
  useEffect(() => {
    if (!modifie) return;
    const avertir = (evenement: BeforeUnloadEvent) => {
      evenement.preventDefault();
    };
    window.addEventListener("beforeunload", avertir);
    return () => window.removeEventListener("beforeunload", avertir);
  }, [modifie]);
}
