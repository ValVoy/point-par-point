import type { EtatRencontre } from "./db/schema";

/**
 * Libelles affichables des etats d'un match. Comme pour les postes, le schema
 * stocke des valeurs stables ; ce qui s'affiche vit ici, dans un fichier sans
 * acces a la base, pour pouvoir servir aussi dans un formulaire client.
 */
export const LIBELLES_ETAT: Record<EtatRencontre, string> = {
  a_venir: "À venir",
  jouee: "Joué",
  annulee: "Annulé",
  reportee: "Reporté",
};
