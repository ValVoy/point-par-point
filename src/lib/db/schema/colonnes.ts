import { integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Colonnes communes a toutes les tables. Elles portent deux principes du
 * codex, et c'est pour cela qu'elles vivent ici plutot que d'etre recopiees.
 */

/** Identifiant technique. */
export const identifiant = () =>
  integer("id").primaryKey({ autoIncrement: true });

/** Dates de creation et de derniere modification, en millisecondes. */
export const horodatage = {
  creeLe: integer("cree_le", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  modifieLe: integer("modifie_le", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
};

/**
 * Principe 6 du codex : rien ne disparait par accident. Une suppression pose
 * une date ici, elle n'efface jamais la ligne. Toute lecture publique doit
 * donc filtrer sur `supprimeLe is null`, ce dont se charge `visible()`.
 */
export const corbeille = {
  supprimeLe: integer("supprime_le", { mode: "timestamp_ms" }),
};

/**
 * Marquage des donnees de demonstration. Le site est livre rempli pour que
 * l'ami n'ait pas a decouvrir un site vide, et cette colonne est ce qui rend
 * l'oubli impossible le jour de la mise en ligne : l'administration affiche un
 * bandeau tant qu'il en reste une seule a vrai, et `npm run db:purge-demo` les
 * enleve toutes.
 */
export const demonstration = {
  demo: integer("demo", { mode: "boolean" }).notNull().default(false),
};

/** Le triptyque complet, pour les tables de contenu. */
export const communes = {
  ...horodatage,
  ...corbeille,
  ...demonstration,
};

/**
 * Principe 6 du codex, second volet : rien ne se publie par accident. Tout
 * contenu editorial nait en brouillon et ne devient visible que par une action
 * explicite.
 */
export const etatPublication = () =>
  text("etat", { enum: ["brouillon", "publie"] })
    .notNull()
    .default("brouillon");

export type EtatPublication = "brouillon" | "publie";
