CREATE TABLE `tentatives_auth` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`ip` text,
	`reussie` integer DEFAULT false NOT NULL,
	`survenu_le` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `tentatives_auth_email_idx` ON `tentatives_auth` (`email`,`survenu_le`);--> statement-breakpoint
CREATE INDEX `tentatives_auth_ip_idx` ON `tentatives_auth` (`ip`,`survenu_le`);