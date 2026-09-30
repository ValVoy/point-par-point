ALTER TABLE `envois_contact` ADD `refuse` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `envois_contact_survenu_idx` ON `envois_contact` (`survenu_le`);