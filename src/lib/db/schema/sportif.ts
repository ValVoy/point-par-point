import { relations } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { communes, horodatage, identifiant } from "./colonnes";

/** Les cinq postes du volley, plus un fourre-tout pour les cas atypiques. */
export const POSTES = [
  "passeur",
  "pointu",
  "central",
  "receptionneur",
  "libero",
  "autre",
] as const;
export type Poste = (typeof POSTES)[number];

export const ETATS_RENCONTRE = [
  "a_venir",
  "jouee",
  "annulee",
  "reportee",
] as const;
export type EtatRencontre = (typeof ETATS_RENCONTRE)[number];

/**
 * Tout contenu date est rattache a une saison, decide au cadrage. La colonne
 * coute une ligne aujourd'hui et evite une migration penible l'ete prochain.
 */
export const saisons = sqliteTable("saisons", {
  id: identifiant(),
  libelle: text("libelle").notNull(), // "2026-2027"
  debuteLe: integer("debute_le", { mode: "timestamp_ms" }),
  finitLe: integer("finit_le", { mode: "timestamp_ms" }),
  /** Une seule saison courante a la fois, garantie par le code metier. */
  courante: integer("courante", { mode: "boolean" }).notNull().default(false),
  ...communes,
});

export const joueurs = sqliteTable(
  "joueurs",
  {
    id: identifiant(),
    prenom: text("prenom").notNull(),
    nom: text("nom").notNull(),
    /** Sert l'adresse publique de sa page, /effectif/<slug>. */
    slug: text("slug").notNull(),
    neLe: integer("ne_le", { mode: "timestamp_ms" }),
    tailleCm: integer("taille_cm"),
    /** Cle de l'objet dans le bucket R2, jamais une URL complete. */
    photoCle: text("photo_cle"),
    presentation: text("presentation"),
    parcours: text("parcours"),
    actif: integer("actif", { mode: "boolean" }).notNull().default(true),
    ...communes,
  },
  (table) => [uniqueIndex("joueurs_slug_unique").on(table.slug)],
);

/**
 * Le numero et le poste appartiennent a la saison, pas au joueur : ils changent
 * d'une annee sur l'autre. Les porter sur `joueurs` reecrirait retroactivement
 * toutes les feuilles de match passees le jour ou quelqu'un change de maillot.
 */
export const effectifs = sqliteTable(
  "effectifs",
  {
    id: identifiant(),
    saisonId: integer("saison_id")
      .notNull()
      .references(() => saisons.id),
    joueurId: integer("joueur_id")
      .notNull()
      .references(() => joueurs.id),
    numero: integer("numero"),
    poste: text("poste", { enum: POSTES }).notNull().default("autre"),
    /** Capitaine de l'equipe sur cette saison. */
    capitaine: integer("capitaine", { mode: "boolean" })
      .notNull()
      .default(false),
    ...communes,
  },
  (table) => [
    uniqueIndex("effectifs_saison_joueur_unique").on(
      table.saisonId,
      table.joueurId,
    ),
    index("effectifs_saison_idx").on(table.saisonId),
  ],
);

export const rencontres = sqliteTable(
  "rencontres",
  {
    id: identifiant(),
    saisonId: integer("saison_id")
      .notNull()
      .references(() => saisons.id),
    slug: text("slug").notNull(),
    joueLe: integer("joue_le", { mode: "timestamp_ms" }).notNull(),
    adversaire: text("adversaire").notNull(),
    aDomicile: integer("a_domicile", { mode: "boolean" })
      .notNull()
      .default(true),
    competition: text("competition"),
    salleNom: text("salle_nom"),
    salleAdresse: text("salle_adresse"),
    salleLatitude: real("salle_latitude"),
    salleLongitude: real("salle_longitude"),
    etat: text("etat", { enum: ETATS_RENCONTRE }).notNull().default("a_venir"),
    /**
     * Principe 3 : la saisie est partielle par nature. Un match a venir n'a
     * aucun score, un match joue peut n'avoir que le nombre de sets.
     */
    setsNous: integer("sets_nous"),
    setsEux: integer("sets_eux"),
    commentaire: text("commentaire"),
    ...communes,
  },
  (table) => [
    uniqueIndex("rencontres_slug_unique").on(table.slug),
    index("rencontres_saison_idx").on(table.saisonId),
    index("rencontres_date_idx").on(table.joueLe),
  ],
);

export const setsRencontre = sqliteTable(
  "sets_rencontre",
  {
    id: identifiant(),
    rencontreId: integer("rencontre_id")
      .notNull()
      .references(() => rencontres.id),
    numero: integer("numero").notNull(),
    pointsNous: integer("points_nous"),
    pointsEux: integer("points_eux"),
    ...horodatage,
  },
  (table) => [
    uniqueIndex("sets_rencontre_unique").on(table.rencontreId, table.numero),
  ],
);

/**
 * Une ligne par joueur et par match. Tous les champs de statistique sont
 * nullables, et c'est le principe 3 du codex, pas un oubli : un match peut
 * n'avoir que des presences. L'ecran de saisie detaillee arrive au lot 2, mais
 * les colonnes existent des maintenant pour qu'il n'y ait pas de migration
 * douloureuse ce jour-la.
 */
export const feuillesRencontre = sqliteTable(
  "feuilles_rencontre",
  {
    id: identifiant(),
    rencontreId: integer("rencontre_id")
      .notNull()
      .references(() => rencontres.id),
    joueurId: integer("joueur_id")
      .notNull()
      .references(() => joueurs.id),
    present: integer("present", { mode: "boolean" }).notNull().default(true),
    points: integer("points"),
    attaquesReussies: integer("attaques_reussies"),
    attaquesTentees: integer("attaques_tentees"),
    aces: integer("aces"),
    servicesFautes: integer("services_fautes"),
    blocs: integer("blocs"),
    receptionsReussies: integer("receptions_reussies"),
    receptionsTentees: integer("receptions_tentees"),
    fautes: integer("fautes"),
    ...horodatage,
  },
  (table) => [
    uniqueIndex("feuilles_rencontre_unique").on(
      table.rencontreId,
      table.joueurId,
    ),
    index("feuilles_rencontre_joueur_idx").on(table.joueurId),
  ],
);

/**
 * Le classement porte sa propre date de mise a jour, et c'est elle qui commande
 * l'affichage : principe 4 du codex, un classement qui n'est plus tenu
 * s'efface plutot que de mentir.
 */
export const classements = sqliteTable(
  "classements",
  {
    id: identifiant(),
    saisonId: integer("saison_id")
      .notNull()
      .references(() => saisons.id),
    intitule: text("intitule"),
    misAJourLe: integer("mis_a_jour_le", { mode: "timestamp_ms" }),
    ...communes,
  },
  (table) => [uniqueIndex("classements_saison_unique").on(table.saisonId)],
);

export const lignesClassement = sqliteTable(
  "lignes_classement",
  {
    id: identifiant(),
    classementId: integer("classement_id")
      .notNull()
      .references(() => classements.id),
    rang: integer("rang").notNull(),
    equipe: text("equipe").notNull(),
    /** Marque la ligne de notre equipe, pour la mettre en valeur. */
    estNous: integer("est_nous", { mode: "boolean" }).notNull().default(false),
    points: integer("points"),
    joues: integer("joues"),
    gagnes: integer("gagnes"),
    perdus: integer("perdus"),
    ...horodatage,
  },
  (table) => [index("lignes_classement_classement_idx").on(table.classementId)],
);

export const saisonsRelations = relations(saisons, ({ many }) => ({
  effectifs: many(effectifs),
  rencontres: many(rencontres),
}));

export const joueursRelations = relations(joueurs, ({ many }) => ({
  effectifs: many(effectifs),
  feuilles: many(feuillesRencontre),
}));

export const effectifsRelations = relations(effectifs, ({ one }) => ({
  saison: one(saisons, {
    fields: [effectifs.saisonId],
    references: [saisons.id],
  }),
  joueur: one(joueurs, {
    fields: [effectifs.joueurId],
    references: [joueurs.id],
  }),
}));

export const rencontresRelations = relations(rencontres, ({ one, many }) => ({
  saison: one(saisons, {
    fields: [rencontres.saisonId],
    references: [saisons.id],
  }),
  sets: many(setsRencontre),
  feuilles: many(feuillesRencontre),
}));

export const setsRencontreRelations = relations(setsRencontre, ({ one }) => ({
  rencontre: one(rencontres, {
    fields: [setsRencontre.rencontreId],
    references: [rencontres.id],
  }),
}));

export const feuillesRencontreRelations = relations(
  feuillesRencontre,
  ({ one }) => ({
    rencontre: one(rencontres, {
      fields: [feuillesRencontre.rencontreId],
      references: [rencontres.id],
    }),
    joueur: one(joueurs, {
      fields: [feuillesRencontre.joueurId],
      references: [joueurs.id],
    }),
  }),
);

export const classementsRelations = relations(classements, ({ one, many }) => ({
  saison: one(saisons, {
    fields: [classements.saisonId],
    references: [saisons.id],
  }),
  lignes: many(lignesClassement),
}));

export const lignesClassementRelations = relations(
  lignesClassement,
  ({ one }) => ({
    classement: one(classements, {
      fields: [lignesClassement.classementId],
      references: [classements.id],
    }),
  }),
);
