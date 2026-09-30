CREATE TABLE `envois_contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text,
	`survenu_le` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `envois_contact_ip_idx` ON `envois_contact` (`ip`,`survenu_le`);