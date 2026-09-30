CREATE TABLE `anciens_slugs_episode` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`episode_id` integer NOT NULL,
	`cree_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`modifie_le` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `anciens_slugs_episode_slug_unique` ON `anciens_slugs_episode` (`slug`);