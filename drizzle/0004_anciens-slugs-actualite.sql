CREATE TABLE `anciens_slugs_actualite` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`actualite_id` integer NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`actualite_id`) REFERENCES `actualites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `anciens_slugs_actualite_slug_unique` ON `anciens_slugs_actualite` (`slug`);