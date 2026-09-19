CREATE TABLE `classements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`saison_id` integer NOT NULL,
	`intitule` text,
	`mis_a_jour_le` integer,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`saison_id`) REFERENCES `saisons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `classements_saison_unique` ON `classements` (`saison_id`);--> statement-breakpoint
CREATE TABLE `effectifs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`saison_id` integer NOT NULL,
	`joueur_id` integer NOT NULL,
	`numero` integer,
	`poste` text DEFAULT 'autre' NOT NULL,
	`capitaine` integer DEFAULT false NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`saison_id`) REFERENCES `saisons`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `effectifs_saison_joueur_unique` ON `effectifs` (`saison_id`,`joueur_id`);--> statement-breakpoint
CREATE INDEX `effectifs_saison_idx` ON `effectifs` (`saison_id`);--> statement-breakpoint
CREATE TABLE `feuilles_rencontre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rencontre_id` integer NOT NULL,
	`joueur_id` integer NOT NULL,
	`present` integer DEFAULT true NOT NULL,
	`points` integer,
	`attaques_reussies` integer,
	`attaques_tentees` integer,
	`aces` integer,
	`services_fautes` integer,
	`blocs` integer,
	`receptions_reussies` integer,
	`receptions_tentees` integer,
	`fautes` integer,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`rencontre_id`) REFERENCES `rencontres`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feuilles_rencontre_unique` ON `feuilles_rencontre` (`rencontre_id`,`joueur_id`);--> statement-breakpoint
CREATE INDEX `feuilles_rencontre_joueur_idx` ON `feuilles_rencontre` (`joueur_id`);--> statement-breakpoint
CREATE TABLE `joueurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prenom` text NOT NULL,
	`nom` text NOT NULL,
	`slug` text NOT NULL,
	`ne_le` integer,
	`taille_cm` integer,
	`photo_cle` text,
	`presentation` text,
	`parcours` text,
	`actif` integer DEFAULT true NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `joueurs_slug_unique` ON `joueurs` (`slug`);--> statement-breakpoint
CREATE TABLE `lignes_classement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`classement_id` integer NOT NULL,
	`rang` integer NOT NULL,
	`equipe` text NOT NULL,
	`est_nous` integer DEFAULT false NOT NULL,
	`points` integer,
	`joues` integer,
	`gagnes` integer,
	`perdus` integer,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`classement_id`) REFERENCES `classements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `lignes_classement_classement_idx` ON `lignes_classement` (`classement_id`);--> statement-breakpoint
CREATE TABLE `rencontres` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`saison_id` integer NOT NULL,
	`slug` text NOT NULL,
	`joue_le` integer NOT NULL,
	`adversaire` text NOT NULL,
	`a_domicile` integer DEFAULT true NOT NULL,
	`competition` text,
	`salle_nom` text,
	`salle_adresse` text,
	`salle_latitude` real,
	`salle_longitude` real,
	`etat` text DEFAULT 'a_venir' NOT NULL,
	`sets_nous` integer,
	`sets_eux` integer,
	`commentaire` text,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`saison_id`) REFERENCES `saisons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rencontres_slug_unique` ON `rencontres` (`slug`);--> statement-breakpoint
CREATE INDEX `rencontres_saison_idx` ON `rencontres` (`saison_id`);--> statement-breakpoint
CREATE INDEX `rencontres_date_idx` ON `rencontres` (`joue_le`);--> statement-breakpoint
CREATE TABLE `saisons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`libelle` text NOT NULL,
	`debute_le` integer,
	`finit_le` integer,
	`courante` integer DEFAULT false NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sets_rencontre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rencontre_id` integer NOT NULL,
	`numero` integer NOT NULL,
	`points_nous` integer,
	`points_eux` integer,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`rencontre_id`) REFERENCES `rencontres`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sets_rencontre_unique` ON `sets_rencontre` (`rencontre_id`,`numero`);--> statement-breakpoint
CREATE TABLE `actualites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text NOT NULL,
	`slug` text NOT NULL,
	`chapo` text,
	`corps` text NOT NULL,
	`image_cle` text,
	`publie_le` integer,
	`etat` text DEFAULT 'brouillon' NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `actualites_slug_unique` ON `actualites` (`slug`);--> statement-breakpoint
CREATE INDEX `actualites_publie_idx` ON `actualites` (`publie_le`);--> statement-breakpoint
CREATE TABLE `episodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`saison_id` integer,
	`numero` integer,
	`titre` text NOT NULL,
	`slug` text NOT NULL,
	`youtube_id` text NOT NULL,
	`resume` text,
	`publie_le` integer,
	`rencontre_id` integer,
	`etat` text DEFAULT 'brouillon' NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`saison_id`) REFERENCES `saisons`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rencontre_id`) REFERENCES `rencontres`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `episodes_slug_unique` ON `episodes` (`slug`);--> statement-breakpoint
CREATE INDEX `episodes_rencontre_idx` ON `episodes` (`rencontre_id`);--> statement-breakpoint
CREATE TABLE `etapes_projet` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`survenu_le` integer,
	`date_libre` text,
	`titre` text NOT NULL,
	`texte` text,
	`image_cle` text,
	`ordre` integer DEFAULT 0 NOT NULL,
	`etat` text DEFAULT 'brouillon' NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `membres_staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`role` text NOT NULL,
	`photo_cle` text,
	`texte` text,
	`ordre` integer DEFAULT 0 NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `partenaires` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`logo_cle` text,
	`lien` text,
	`ordre` integer DEFAULT 0 NOT NULL,
	`actif` integer DEFAULT true NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	`demo` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages_contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`email` text NOT NULL,
	`sujet` text,
	`message` text NOT NULL,
	`lu` integer DEFAULT false NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer
);
--> statement-breakpoint
CREATE INDEX `messages_contact_lu_idx` ON `messages_contact` (`lu`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`jeton_hache` text PRIMARY KEY NOT NULL,
	`utilisateur_id` integer NOT NULL,
	`expire_le` integer NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sessions_utilisateur_idx` ON `sessions` (`utilisateur_id`);--> statement-breakpoint
CREATE INDEX `sessions_expire_idx` ON `sessions` (`expire_le`);--> statement-breakpoint
CREATE TABLE `soutiens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`auteur` text NOT NULL,
	`message` text NOT NULL,
	`etat` text DEFAULT 'en_attente' NOT NULL,
	`modere_le` integer,
	`modere_par_id` integer,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer,
	FOREIGN KEY (`modere_par_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `soutiens_etat_idx` ON `soutiens` (`etat`);--> statement-breakpoint
CREATE TABLE `utilisateurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`mot_de_passe_hache` text NOT NULL,
	`nom` text NOT NULL,
	`role` text DEFAULT 'redacteur' NOT NULL,
	`actif` integer DEFAULT true NOT NULL,
	`derniere_connexion_le` integer,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`supprime_le` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utilisateurs_email_unique` ON `utilisateurs` (`email`);