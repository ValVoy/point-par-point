CREATE TABLE `anciens_slugs_rencontre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`rencontre_id` integer NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`rencontre_id`) REFERENCES `rencontres`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `anciens_slugs_rencontre_slug_unique` ON `anciens_slugs_rencontre` (`slug`);