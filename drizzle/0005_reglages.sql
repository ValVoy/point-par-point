CREATE TABLE `reglages` (
	`cle` text PRIMARY KEY NOT NULL,
	`valeur` text NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
