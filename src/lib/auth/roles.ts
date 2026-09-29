import type { Role } from "../db/schema";
import type { UtilisateurConnecte } from "./sessions";

/**
 * Les droits sont figes ici, en un seul endroit, et se lisent d'un coup d'oeil.
 * Pas de table de permissions, pas d'ecran de gestion : decide au cadrage.
 *
 * Le redacteur produit du contenu. Il ne touche ni a la structure (saisons,
 * comptes, et la vitrine du projet : chronologie, staff, partenaires), ni a
 * l'irreversible (purge de la corbeille, purge des donnees de
 * demonstration).
 */
export const ACTIONS = [
  "redigerContenu",
  "publierContenu",
  "saisirResultats",
  "modererSoutiens",
  "lireMessages",
  "gererEffectif",
  "gererSaisons",
  "gererProjet",
  "gererComptes",
  "viderCorbeille",
  "purgerDemo",
] as const;

export type Action = (typeof ACTIONS)[number];

const DROITS: Record<Role, readonly Action[]> = {
  admin: ACTIONS,
  redacteur: [
    "redigerContenu",
    "publierContenu",
    "saisirResultats",
    "modererSoutiens",
    "lireMessages",
  ],
};

export function peut(
  utilisateur: UtilisateurConnecte | null,
  action: Action,
): boolean {
  if (!utilisateur) return false;
  return DROITS[utilisateur.role].includes(action);
}

/**
 * Principe 6 du codex : rien ne disparait par accident. La suppression envoie
 * en corbeille et tout le monde peut le faire ; seul l'admin peut vider la
 * corbeille, c'est-a-dire effacer pour de bon.
 */
export function estAdmin(utilisateur: UtilisateurConnecte | null): boolean {
  return utilisateur?.role === "admin";
}
