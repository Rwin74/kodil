ALTER TABLE `editorial_reviews` ADD `decided_by_user_id` varchar(64);--> statement-breakpoint
ALTER TABLE `media` ADD `original_filename` varchar(255);--> statement-breakpoint
ALTER TABLE `media` ADD `original_storage_key` varchar(512);--> statement-breakpoint
ALTER TABLE `media` ADD `webp_storage_key` varchar(512);--> statement-breakpoint
ALTER TABLE `media` ADD `avif_storage_key` varchar(512);--> statement-breakpoint
ALTER TABLE `media` ADD `rights_evidence_reference` varchar(255);--> statement-breakpoint
ALTER TABLE `media` ADD `permission_status` enum('not_applicable','pending','verified','restricted') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `media` ADD `permission_evidence_reference` varchar(255);--> statement-breakpoint
ALTER TABLE `posts` ADD `scheduled_at` datetime;--> statement-breakpoint
ALTER TABLE `sources` ADD `evidence_reference` varchar(255);--> statement-breakpoint
ALTER TABLE `editorial_reviews` ADD CONSTRAINT `editorial_reviews_decided_by_user_id_users_id_fk` FOREIGN KEY (`decided_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;