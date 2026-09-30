import { relations } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { communes, etatPublication, horodatage, identifiant } from "./colonnes";
import { rencontres, saisons } from "./sportif";

/**
 * Les episodes de la serie YouTube. Aucune API n'est appelee : l'adresse est
 * collee a la main dans l'administration, ce qui laisse a l'ami la maitrise de
 * ce qui apparait et evite de dependre d'un flux que YouTube peut changer.
 */
export const episodes = sqliteTable(
  "episodes",
  {
    id: identifiant(),
    saisonId: integer("saison_id").references(() => saisons.id),
    numero: integer("numero"),
    titre: text("titre").notNull(),
    slug: text("slug").notNull(),
    /** Identifiant YouTube seul, pas l'URL : la miniature s'en deduit. */
    youtubeId: text("youtube_id").notNull(),
    resume: text("resume"),
    publieLe: integer("publie_le", { mode: "timestamp_ms" }),
    /** Le match raconte par l'episode, quand il y en a un. */
    rencontreId: integer("rencontre_id").references(() => rencontres.id),
    etat: etatPublication(),
    ...communes,
  },
  (table) => [
    uniqueIndex("episodes_slug_unique").on(table.slug),
    index("episodes_rencontre_idx").on(table.rencontreId),
  ],
);

/**
 * Les anciennes adresses d'un episode : l'adresse suit le titre, et un lien
 * deja partage doit survivre a une correction de titre, par redirection vers
 * l'adresse du moment (meme parade que pour les matchs, 30-09-2026).
 */
export const anciensSlugsEpisode = sqliteTable(
  "anciens_slugs_episode",
  {
    id: identifiant(),
    slug: text("slug").notNull(),
    episodeId: integer("episode_id")
      .notNull()
      .references(() => episodes.id),
    ...horodatage,
  },
  (table) => [uniqueIndex("anciens_slugs_episode_slug_unique").on(table.slug)],
);

export const actualites = sqliteTable(
  "actualites",
  {
    id: identifiant(),
    titre: text("titre").notNull(),
    slug: text("slug").notNull(),
    chapo: text("chapo"),
    corps: text("corps").notNull(),
    imageCle: text("image_cle"),
    /** Ce que montre l'image, lu aux lecteurs d'ecran ; vide, l'image est decorative (audit U9). */
    imageDescription: text("image_description"),
    publieLe: integer("publie_le", { mode: "timestamp_ms" }),
    etat: etatPublication(),
    ...communes,
  },
  (table) => [
    uniqueIndex("actualites_slug_unique").on(table.slug),
    index("actualites_publie_idx").on(table.publieLe),
  ],
);

/**
 * Les anciennes adresses d'une actualite : l'adresse suit le titre, et un lien
 * deja partage doit survivre a une correction (meme parade que les matchs et
 * les episodes, 30-09-2026).
 */
export const anciensSlugsActualite = sqliteTable(
  "anciens_slugs_actualite",
  {
    id: identifiant(),
    slug: text("slug").notNull(),
    actualiteId: integer("actualite_id")
      .notNull()
      .references(() => actualites.id),
    ...horodatage,
  },
  (table) => [uniqueIndex("anciens_slugs_actualite_slug_unique").on(table.slug)],
);

/**
 * La chronologie de la page « le projet ». Saisie a la main et non deduite des
 * evenements : le recit d'un projet ne se resume pas a ses donnees, et les
 * vrais moments fondateurs ne sont ni un match ni un episode.
 */
export const etapesProjet = sqliteTable("etapes_projet", {
  id: identifiant(),
  survenuLe: integer("survenu_le", { mode: "timestamp_ms" }),
  /** Quand la date exacte est inconnue : « printemps 2026 ». */
  dateLibre: text("date_libre"),
  titre: text("titre").notNull(),
  texte: text("texte"),
  imageCle: text("image_cle"),
  /** Ce que montre l'image, lu aux lecteurs d'ecran ; vide, l'image est decorative (audit U9). */
  imageDescription: text("image_description"),
  ordre: integer("ordre").notNull().default(0),
  etat: etatPublication(),
  ...communes,
});

/**
 * Les reglages du site : quelques textes uniques saisis dans l'administration,
 * qu'aucune liste ne porte (par exemple « Venir a la salle », decide le
 * 30-09-2026). Une cle, une valeur ; la liste des cles vit dans lib/reglages.ts.
 */
export const reglages = sqliteTable("reglages", {
  cle: text("cle").primaryKey(),
  valeur: text("valeur").notNull(),
  ...horodatage,
});

export const membresStaff = sqliteTable("membres_staff", {
  id: identifiant(),
  nom: text("nom").notNull(),
  role: text("role").notNull(),
  photoCle: text("photo_cle"),
  texte: text("texte"),
  ordre: integer("ordre").notNull().default(0),
  ...communes,
});

export const partenaires = sqliteTable("partenaires", {
  id: identifiant(),
  nom: text("nom").notNull(),
  logoCle: text("logo_cle"),
  lien: text("lien"),
  ordre: integer("ordre").notNull().default(0),
  actif: integer("actif", { mode: "boolean" }).notNull().default(true),
  ...communes,
});

export const episodesRelations = relations(episodes, ({ one }) => ({
  saison: one(saisons, {
    fields: [episodes.saisonId],
    references: [saisons.id],
  }),
  rencontre: one(rencontres, {
    fields: [episodes.rencontreId],
    references: [rencontres.id],
  }),
}));
